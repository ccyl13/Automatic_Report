from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, default="admin")
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


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
    tlp_level = Column(String, default="amber")             # clear, green, amber, amber+strict, red
    classification_mode = Column(String, default="internal") # internal, tlp, both
    version = Column(String, default="1.0")
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d"))
    lang = Column(String, default="es")
    theme = Column(String, default="corporate")  # corporate, ctf, certification (legacy)
    report_theme = Column(String, default="light")  # slug del tema de estilos del informe (light/dark/htb/custom-*)
    client_logo = Column(JSON, default=list)
    has_incidents = Column(Integer, default=0)  # 0 = false, 1 = true
    incidents_text = Column(Text, default="")
    audit_summary = Column(Text, default="")
    tests_performed = Column(Text, default="")
    recommended_solutions = Column(Text, default="")

    # --- Tipo de auditoría y alcance / metodología (informe profesional) ---
    audit_type = Column(String, default="pentesting_web")
    scope_in = Column(Text, default="")          # activos dentro del alcance
    scope_out = Column(Text, default="")         # exclusiones / fuera de alcance
    methodology_notes = Column(Text, default="") # notas de metodología
    methodology_standards = Column(JSON, default=list)  # ["owasp_wstg", "ptes", ...]
    tools_used = Column(Text, default="")
    engagement_start = Column(String, default="")
    engagement_end = Column(String, default="")
    revision_history = Column(JSON, default=list)  # [{version, date, author, changes}]

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
    cvss_vector = Column(String, default="")  # Ej: CVSS:3.1/AV:N/AC:L/...
    poc = Column(Text, default="")  # Proof of Concept
    impact = Column(Text, default="")
    remediation = Column(Text, default="")
    reference = Column(String, default="")       # legacy: una sola referencia
    references = Column(JSON, default=list)       # lista de referencias (URLs/recursos)
    cve = Column(String, default="")
    cwe = Column(String, default="")  # Ej: "CWE-89" o "CWE-89, CWE-564"

    # --- Informe profesional ---
    status = Column(String, default="open")        # open, remediated, accepted_risk, false_positive
    affected_assets = Column(Text, default="")     # hosts/URLs/parámetros afectados
    likelihood = Column(String, default="")        # high, med, low  (matriz de riesgo)
    impact_rating = Column(String, default="")     # high, med, low  (matriz de riesgo)
    owasp = Column(String, default="")             # categoría OWASP Top 10
    compliance = Column(JSON, default=list)        # ["PCI 6.5.1", "ISO A.14", ...]
    retest_notes = Column(Text, default="")        # notas de re-test

    # Imágenes se guardan como JSON array de URLs/data URLs
    images = Column(JSON, default=list)

    # Orden del hallazgo en el reporte
    order_index = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    report = relationship("Report", back_populates="findings")


class Theme(Base):
    """Tema de estilos del informe. Los built-in (light/dark/htb) se siembran al
    arrancar; los personalizados los crean los usuarios (paleta de variables CSS)."""
    __tablename__ = "themes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    base = Column(String, default="light")     # tema base del que hereda (light/dark/htb)
    vars = Column(JSON, default=dict)           # { "--rt-pageBg": "#fff", ... }
    custom_css = Column(Text, default="")       # CSS libre del usuario (control total de estilos)
    is_builtin = Column(Integer, default=0)     # 0 = personalizado, 1 = de fábrica
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FindingTemplate(Base):
    """Plantilla de hallazgo reutilizable creada por el usuario (su propia base de
    conocimiento). Las 30 plantillas de fábrica siguen viviendo en plantillas.json."""
    __tablename__ = "finding_templates"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    title = Column(String, default="")
    severity = Column(String, default="med")
    cvss = Column(String, default="")
    cvss_vector = Column(String, default="")
    description = Column(Text, default="")
    poc = Column(Text, default="")
    impact = Column(Text, default="")
    remediation = Column(Text, default="")
    reference = Column(String, default="")
    cwe = Column(String, default="")
    cve = Column(String, default="")
    owasp = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AppSettings(Base):
    """Preferencias globales de la aplicación (idioma, tema activo, opciones de PDF).
    Fila única (id=1). Vive en la BD para que la exportación capture el 100% del
    estado y no se pierda nada al exportar/importar."""
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True)
    lang = Column(String, default="es")
    report_theme = Column(String, default="light")
    pdf_print_theme = Column(String, default="light")
    pdf_show_severity_bars = Column(Integer, default=1)  # 0/1
    pdf_content_width = Column(Integer, default=820)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
