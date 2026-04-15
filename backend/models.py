from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    document_title = Column(String, default="Reporte Técnico de Vulnerabilidades")
    client_company = Column(String, default="Empresa Cliente S.A.")
    target_asset = Column(String, default="Aplicación Principal")
    auditor_company = Column(String, default="Empresa Auditora LLC")
    auditor_name = Column(String, default="Juan Pérez")
    auditor_phone = Column(String, default="")
    auditor_email = Column(String, default="")
    classification = Column(Integer, default=2)
    version = Column(String, default="1.0")
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))
    lang = Column(String, default="es")
    theme = Column(String, default="corporate")  # corporate, ctf, certification
    client_logo = Column(JSON, default=list)
    has_incidents = Column(Integer, default=0)  # 0 = false, 1 = true
    incidents_text = Column(Text, default="")
    audit_summary = Column(Text, default="")
    tests_performed = Column(Text, default="")
    recommended_solutions = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

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
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    report = relationship("Report", back_populates="findings")
