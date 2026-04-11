from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import models, schemas, database
from database import engine, get_db

# Determinar el directorio raíz del proyecto (donde está index.html)
# Si ejecutamos desde backend/, subimos un nivel
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if not os.path.exists(os.path.join(BASE_DIR, "index.html")):
    # Si no encontramos index.html, asumimos que estamos en la raíz
    BASE_DIR = os.getcwd()

# Crear tablas
models.Base.metadata.create_all(bind=engine)

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
app.mount("/css", StaticFiles(directory=os.path.join(BASE_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(BASE_DIR, "js")), name="js")
app.mount("/assets", StaticFiles(directory=os.path.join(BASE_DIR, "assets")), name="assets")


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
    
    # Obtener el siguiente índice de orden
    max_order = db.query(models.Finding).filter(
        models.Finding.report_id == report_id
    ).count()
    
    db_finding = models.Finding(
        **finding.dict(),
        report_id=report_id,
        order_index=max_order
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
