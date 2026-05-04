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

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if not os.path.exists(os.path.join(BASE_DIR, "index.html")):
    BASE_DIR = os.getcwd()

models.Base.metadata.create_all(bind=engine)

from migrations import run_migrations
run_migrations(engine)

app = FastAPI(
    title="Pentestify API",
    description="API para gestión de reportes de pentesting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el origen exacto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from starlette.staticfiles import StaticFiles as StarletteStaticFiles
from starlette.responses import FileResponse as StarletteFileResponse

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
    return {"message": "Pentestify API", "version": "1.0.0"}


@app.get("/")
def root():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))


@app.get("/api/reports", response_model=List[schemas.ReportList])
def get_reports(db: Session = Depends(get_db)):
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
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return report


@app.post("/api/reports", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@app.put("/api/reports/{report_id}", response_model=schemas.ReportResponse)
def update_report(report_id: int, report: schemas.ReportUpdate, db: Session = Depends(get_db)):
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
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    db.delete(db_report)
    db.commit()
    return {"message": "Reporte eliminado correctamente"}


@app.get("/api/reports/{report_id}/findings", response_model=List[schemas.FindingResponse])
def get_findings(report_id: int, db: Session = Depends(get_db)):
    findings = db.query(models.Finding).filter(
        models.Finding.report_id == report_id
    ).order_by(models.Finding.order_index).all()
    return findings


@app.post("/api/reports/{report_id}/findings", response_model=schemas.FindingResponse)
def create_finding(report_id: int, finding: schemas.FindingCreate, db: Session = Depends(get_db)):
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
def update_finding(finding_id: int, finding: schemas.FindingUpdate, db: Session = Depends(get_db)):
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
def reorder_findings(report_id: int, finding_ids: List[int], db: Session = Depends(get_db)):
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
async def generate_pdf(report_id: int, request: Request, db: Session = Depends(get_db), theme: str = "light"):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    try:
        base_url = str(request.base_url).rstrip("/")
        target_url = f"{base_url}/?report_id={report_id}&print_mode=true&theme={theme}"

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
            page = await browser.new_page()
            
            await page.goto(target_url, wait_until="networkidle")
            
            await page.wait_for_timeout(2000)
            
            if theme == 'dark':
                await page.evaluate("""
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.background = '#0f172a';
                    document.body.style.background = '#0f172a';
                    document.body.style.margin = '0';
                    var style = document.createElement('style');
                    style.textContent = 'html, body { background: #0f172a !important; } @page { background: #0f172a; }';
                    document.head.appendChild(style);
                """)
                await page.wait_for_timeout(500) 

            fd, path = tempfile.mkstemp(suffix=".pdf")
            os.close(fd)
            
            await page.pdf(
                path=path,
                format="A4",
                print_background=True,
                margin={"top": "15mm", "right": "18mm", "bottom": "15mm", "left": "18mm"},
                scale=0.92,
                display_header_footer=True,
                header_template="<span></span>",
                footer_template=f"<div style=\"font-size:14px;font-weight:700;font-family:sans-serif;color:{'#ffffff' if theme == 'dark' else '#6b7280'};width:100%;text-align:right;padding-right:20mm;\"><span class=\"pageNumber\"></span></div>",
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


@app.get("/api/database/export")
def export_database():
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
        try:
            conn = sqlite3.connect(temp_path)
            cursor = conn.cursor()
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