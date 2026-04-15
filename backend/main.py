from fastapi import FastAPI, HTTPException, Depends, Request, UploadFile, File
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
import models, schemas, database
from database import engine, get_db, db_path

# Determinar el directorio raíz del proyecto (donde está index.html)
# Si ejecutamos desde backend/, subimos un nivel
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if not os.path.exists(os.path.join(BASE_DIR, "index.html")):
    # Si no encontramos index.html, asumimos que estamos en la raíz
    BASE_DIR = os.getcwd()

# Crear tablas
models.Base.metadata.create_all(bind=engine)

# Migración: agregar columnas nuevas si no existen (para compatibilidad con DBs antiguas)
from sqlalchemy import text
try:
    with engine.connect() as conn:
        # Verificar si existe la columna auditor_phone
        result = conn.execute(text("PRAGMA table_info(reports)"))
        columns = [row[1] for row in result]
        
        if 'auditor_phone' not in columns:
            conn.execute(text("ALTER TABLE reports ADD COLUMN auditor_phone VARCHAR"))
            conn.commit()
            print("✅ Columna auditor_phone agregada")
        
        if 'auditor_email' not in columns:
            conn.execute(text("ALTER TABLE reports ADD COLUMN auditor_email VARCHAR"))
            conn.commit()
            print("✅ Columna auditor_email agregada")
        
        if 'theme' not in columns:
            conn.execute(text("ALTER TABLE reports ADD COLUMN theme VARCHAR DEFAULT 'corporate'"))
            conn.commit()
            print("✅ Columna theme agregada")
except Exception as e:
    print(f"⚠️  Nota: {e}")

app = FastAPI(
    title="Pentestify API",
    description="API para gestión de reportes de pentesting",
    version="1.0.0"
)

# CORS para permitir requests del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el origen exacto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos (CSS, JS) usando paths absolutos
# Agregamos headers para evitar caché durante desarrollo
from starlette.staticfiles import StaticFiles as StarletteStaticFiles
from starlette.responses import FileResponse as StarletteFileResponse

class NoCacheStaticFiles(StarletteStaticFiles):
    """StaticFiles que agrega headers anti-caché"""
    def file_response(self, *args, **kwargs):
        response = super().file_response(*args, **kwargs)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

app.mount("/css", NoCacheStaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css")
app.mount("/js", NoCacheStaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js")
app.mount("/assets", NoCacheStaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="assets")


# ==================== API INFO ====================

@app.get("/api")
def api_info():
    """Información de la API"""
    return {"message": "Pentestify API", "version": "1.0.0"}


# ==================== FRONTEND ====================

@app.get("/")
def root():
    """Servir el frontend (index.html)"""
    return FileResponse(os.path.join(BASE_DIR, "index.html"))


@app.get("/api/reports", response_model=List[schemas.ReportList])
def get_reports(db: Session = Depends(get_db)):
    """Obtener lista de todos los reportes"""
    reports = db.query(models.Report).all()
    result = []
    for report in reports:
        findings_count = db.query(models.Finding).filter(models.Finding.report_id == report.id).count()
        report_data = schemas.ReportList.from_orm(report)
        report_data.findings_count = findings_count
        result.append(report_data)
    return result


@app.get("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """Obtener un reporte específico con todos sus hallazgos"""
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return report


@app.post("/api/reports", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    """Crear un nuevo reporte"""
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@app.put("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def update_report(report_id: int, report: schemas.ReportUpdate, db: Session = Depends(get_db)):
    """Actualizar datos de un reporte"""
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    for key, value in report.dict().items():
        setattr(db_report, key, value)
    
    db.commit()
    db.refresh(db_report)
    return db_report


@app.delete("/api/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    """Eliminar un reporte y todos sus hallazgos"""
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    db.delete(db_report)
    db.commit()
    return {"message": "Reporte eliminado correctamente"}


# ==================== FINDINGS ====================

@app.get("/api/reports/{report_id}/findings", response_model=List[schemas.FindingResponse])
def get_findings(report_id: int, db: Session = Depends(get_db)):
    """Obtener todos los hallazgos de un reporte"""
    findings = db.query(models.Finding).filter(
        models.Finding.report_id == report_id
    ).order_by(models.Finding.order_index).all()
    return findings


@app.post("/api/reports/{report_id}/findings", response_model=schemas.FindingResponse)
def create_finding(report_id: int, finding: schemas.FindingCreate, db: Session = Depends(get_db)):
    """Agregar un hallazgo a un reporte"""
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    # Usamos el order_index proporcionado por el frontend
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
def update_finding(finding_id: int, finding: schemas.FindingUpdate, db: Session = Depends(get_db)):
    """Actualizar un hallazgo"""
    db_finding = db.query(models.Finding).filter(models.Finding.id == finding_id).first()
    if not db_finding:
        raise HTTPException(status_code=404, detail="Hallazgo no encontrado")
    
    for key, value in finding.dict().items():
        setattr(db_finding, key, value)
    
    db.commit()
    db.refresh(db_finding)
    return db_finding


@app.delete("/api/findings/{finding_id}")
def delete_finding(finding_id: int, db: Session = Depends(get_db)):
    """Eliminar un hallazgo"""
    db_finding = db.query(models.Finding).filter(models.Finding.id == finding_id).first()
    if not db_finding:
        raise HTTPException(status_code=404, detail="Hallazgo no encontrado")
    
    report_id = db_finding.report_id
    db.delete(db_finding)
    
    # Reordenar los hallazgos restantes
    remaining = db.query(models.Finding).filter(
        models.Finding.report_id == report_id
    ).order_by(models.Finding.order_index).all()
    
    for idx, f in enumerate(remaining):
        f.order_index = idx
    
    db.commit()
    return {"message": "Hallazgo eliminado correctamente"}


@app.post("/api/reports/{report_id}/findings/reorder")
def reorder_findings(report_id: int, finding_ids: List[int], db: Session = Depends(get_db)):
    """Reordenar hallazgos (array de IDs en el nuevo orden)"""
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
async def generate_pdf(report_id: int, request: Request, db: Session = Depends(get_db)):
    """Generar PDF del reporte usando Playwright"""
    # Verificar que existe
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    try:
        # Usamos el path dinámicamente según donde corre el server, por normal general host + port
        # o localhost:8000
        base_url = str(request.base_url).rstrip("/")
        # URL en modo especial "print" para que el frontend vaya directo al reporte y la vista previa
        target_url = f"{base_url}/?report_id={report_id}&print_mode=true"

        async with async_playwright() as p:
            browser = await p.chromium.launch(args=['--no-sandbox', '--disable-setuid-sandbox'])
            page = await browser.new_page()
            
            # Vamos a la url
            await page.goto(target_url, wait_until="networkidle")
            
            # Esperamos un pequeño tiempo extra para garantizar que las gráficas
            # y contenido dinámico se hayan renderizado completamente.
            await page.wait_for_timeout(1000) 

            # Generar PDF en un archivo temporal
            fd, path = tempfile.mkstemp(suffix=".pdf")
            os.close(fd)
            
            await page.pdf(
                path=path,
                format="A4",
                print_background=True,
                margin={"top": "20mm", "right": "18mm", "bottom": "25mm", "left": "18mm"},
                scale=0.92,  # Reducir escala para mejor legibilidad y evitar cortes
                display_header_footer=True,
                header_template="<div></div>",  # Header vacío
                footer_template="""
                    <div style="font-size: 10px; font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #6b7280; width: 100%; text-align: center; padding: 15px 0; border-top: 1px solid #e5e7eb; margin: 0 20mm;">
                        <span class="pageNumber" style="font-weight: 600;"></span>
                    </div>
                """
            )
            
            await browser.close()
            
            return FileResponse(
                path, 
                media_type="application/pdf", 
                filename=f"Report_{report_id}.pdf"
            )
            
    except Exception as e:
        print(f"Error generando PDF: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor generando el PDF")


# ==================== DATABASE IMPORT/EXPORT ====================

@app.get("/api/database/export")
def export_database():
    """Exportar la base de datos SQLite como archivo descargable"""
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
def import_database(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Importar una base de datos SQLite para restaurar reportes"""
    
    # Verificar que el archivo es una base de datos SQLite
    if not file.filename.endswith('.db'):
        raise HTTPException(status_code=400, detail="El archivo debe tener extensión .db")
    
    # Crear backup temporal de la base de datos actual
    backup_path = None
    if os.path.exists(db_path):
        backup_path = f"{db_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copy2(db_path, backup_path)
    
    try:
        # Guardar el archivo subido temporalmente
        temp_path = tempfile.mktemp(suffix=".db")
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Verificar que es una base de datos SQLite válida
        import sqlite3
        try:
            conn = sqlite3.connect(temp_path)
            cursor = conn.cursor()
            # Verificar que tiene las tablas esperadas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            conn.close()
            
            required_tables = {'reports', 'findings'}
            if not required_tables.issubset(set(tables)):
                raise HTTPException(
                    status_code=400, 
                    detail=f"La base de datos no tiene las tablas requeridas. Tablas encontradas: {tables}"
                )
        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail=f"Archivo no es una base de datos SQLite válida: {str(e)}")
        
        # Cerrar todas las conexiones actuales antes de reemplazar
        db.close()
        
        # Reemplazar la base de datos actual
        shutil.copy2(temp_path, db_path)
        
        # Limpiar archivo temporal
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
