from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime
import re


# Logos y evidencias solo pueden ser data URLs de imagen. Cualquier URL remota
# se rechaza para evitar SSRF al generar el PDF y XSS al romper el atributo src.
_DATA_IMAGE_RE = re.compile(r'^data:image/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+$')

# Caracteres permitidos en el nombre de usuario (sin comillas ni metacaracteres).
_USERNAME_RE = re.compile(r'^[A-Za-z0-9_.\-]{3,32}$')


def is_safe_image_src(value) -> bool:
    return isinstance(value, str) and bool(_DATA_IMAGE_RE.match(value.strip()))


def sanitize_image_list(values, keep_slots: bool = False) -> List[str]:
    cleaned: List[str] = []
    for v in (values or []):
        if v == '' or is_safe_image_src(v):
            cleaned.append(v)
        elif keep_slots:
            cleaned.append('')
    return cleaned


class LoginRequest(BaseModel):
    username: str
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class AuthResponse(BaseModel):
    token: str
    username: str
    message: Optional[str] = None


class CreateUserRequest(BaseModel):
    username: str
    password: str

    @field_validator('username')
    @classmethod
    def _valid_username(cls, v):
        # Allowlist estricta: el username se refleja en handlers JS del frontend,
        # así que solo permitimos caracteres seguros para cerrar la clase de XSS.
        v = (v or '').strip()
        if not _USERNAME_RE.match(v):
            raise ValueError('El usuario solo admite letras, números y . _ - (3 a 32 caracteres)')
        return v


class UserInfo(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class FindingBase(BaseModel):
    template_key: str = "custom"
    title: str
    severity: str = "med"
    description: str = ""
    cvss: str = ""
    poc: str = ""
    impact: str = ""
    remediation: str = ""
    reference: str = ""
    cve: str = ""
    cwe: str = ""
    images: List[str] = []
    order_index: int = 0

    @field_validator('images')
    @classmethod
    def _sanitize_images(cls, v):
        return sanitize_image_list(v)


class FindingCreate(FindingBase):
    pass


class FindingUpdate(FindingBase):
    pass


class FindingResponse(FindingBase):
    id: int
    report_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReportBase(BaseModel):
    document_title: str = "Reporte Técnico de Vulnerabilidades"
    client_company: str = "Empresa Cliente S.A."
    target_asset: str = "Aplicación Principal"
    auditor_company: str = "Empresa Auditora LLC"
    auditor_name: str = "Juan Pérez"
    auditor_phone: str = ""
    auditor_email: str = ""
    classification: int = 2
    tlp_level: str = "amber"
    classification_mode: str = "internal"
    version: str = "1.0"
    date: str = ""
    lang: str = "es"
    theme: str = "corporate"  # corporate, ctf, certification
    client_logo: List[str] = []
    has_incidents: bool = False
    incidents_text: str = ""
    audit_summary: str = ""
    tests_performed: str = ""
    recommended_solutions: str = ""

    @field_validator('client_logo')
    @classmethod
    def _sanitize_client_logo(cls, v):
        return sanitize_image_list(v, keep_slots=True)


class ReportCreate(ReportBase):
    pass


class ReportUpdate(ReportBase):
    pass


class ReportResponse(ReportBase):
    id: int
    created_at: datetime
    updated_at: datetime
    findings: List[FindingResponse] = []

    class Config:
        from_attributes = True


class ReportList(BaseModel):
    id: int
    document_title: str
    client_company: str
    target_asset: str
    date: str
    created_at: datetime
    findings_count: int = 0

    class Config:
        from_attributes = True
