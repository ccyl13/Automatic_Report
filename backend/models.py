from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    document_title = Column(String, default="Reporte Técnico de Vulnerabilidades")
    client_company = Column(String, default="Empresa Cliente S.A.")
    target_asset = Column(String, default="Aplicación Principal")
    auditor_company = Column(String, default="Empresa Auditora LLC")
    auditor_name = Column(String, default="Juan Pérez")
    classification = Column(Integer, default=2)
    version = Column(String, default="1.0")
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))
    lang = Column(String, default="es")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    findings = relationship("Finding", back_populates="report", cascade="all, delete-orphan")


class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    
    # Datos del hallazgo
    template_key = Column(String, default="custom")
    title = Column(String, nullable=False)
    severity = Column(String, default="med")  # crit, high, med, low, info
    description = Column(Text, default="")
    cvss = Column(String, default="")
    poc = Column(Text, default="")  # Proof of Concept
    impact = Column(Text, default="")
    remediation = Column(Text, default="")
    reference = Column(String, default="")
    cve = Column(String, default="")
    
    # Imágenes se guardan como JSON array de URLs/data URLs
    images = Column(JSON, default=list)
    
    # Orden del hallazgo en el reporte
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    report = relationship("Report", back_populates="findings")
