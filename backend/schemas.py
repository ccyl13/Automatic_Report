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


def _clean_str_list(values, limit: int = 50, maxlen: int = 500) -> List[str]:
    """Lista de cadenas saneada: descarta vacíos, recorta longitud y nº de ítems."""
    out: List[str] = []
    for v in (values or []):
        if not isinstance(v, str):
            continue
        v = v.strip()
        if v:
            out.append(v[:maxlen])
        if len(out) >= limit:
            break
    return out


class FindingBase(BaseModel):
    template_key: str = "custom"
    title: str
    severity: str = "med"
    description: str = ""
    cvss: str = ""
    cvss_vector: str = ""
    poc: str = ""
    impact: str = ""
    remediation: str = ""
    reference: str = ""
    references: List[str] = []
    cve: str = ""
    cwe: str = ""
    status: str = "open"
    affected_assets: str = ""
    likelihood: str = ""
    impact_rating: str = ""
    owasp: str = ""
    compliance: List[str] = []
    retest_notes: str = ""
    images: List[str] = []
    order_index: int = 0

    @field_validator('images')
    @classmethod
    def _sanitize_images(cls, v):
        return sanitize_image_list(v)

    @field_validator('references', 'compliance')
    @classmethod
    def _sanitize_str_lists(cls, v):
        return _clean_str_list(v)


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


class RevisionEntry(BaseModel):
    version: str = ""
    date: str = ""
    author: str = ""
    changes: str = ""


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
    theme: str = "corporate"  # corporate, ctf, certification (legacy)
    report_theme: str = "light"
    client_logo: List[str] = []
    has_incidents: bool = False
    incidents_text: str = ""
    audit_summary: str = ""
    tests_performed: str = ""
    recommended_solutions: str = ""
    audit_type: str = "pentesting_web"
    scope_in: str = ""
    scope_out: str = ""
    methodology_notes: str = ""
    methodology_standards: List[str] = []
    tools_used: str = ""
    engagement_start: str = ""
    engagement_end: str = ""
    revision_history: List[RevisionEntry] = []

    @field_validator('client_logo')
    @classmethod
    def _sanitize_client_logo(cls, v):
        return sanitize_image_list(v, keep_slots=True)

    @field_validator('methodology_standards')
    @classmethod
    def _sanitize_methodology(cls, v):
        return _clean_str_list(v, limit=30, maxlen=80)


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


# --------------------------------------------------------------------------- #
# Temas de informe (estilos CSS personalizables)
# --------------------------------------------------------------------------- #
# Slug seguro: se inserta en un selector CSS [data-rt-theme="..."], así que sólo
# permitimos caracteres inertes para cerrar la inyección de CSS/HTML.
_SLUG_RE = re.compile(r'^[a-z0-9][a-z0-9-]{0,48}$')

# Valor de variable CSS: rechazamos llaves, punto y coma, dos puntos extra y
# secuencias que permitan salir del valor de la propiedad o inyectar reglas.
_CSS_VALUE_RE = re.compile(r'^[#a-zA-Z0-9 ,.\-%()]{0,120}$')


def _sanitize_theme_vars(vars_dict) -> dict:
    if not isinstance(vars_dict, dict):
        return {}
    clean = {}
    for k, v in vars_dict.items():
        if not isinstance(k, str) or not isinstance(v, str):
            continue
        k = k.strip()
        v = v.strip()
        # Las claves deben ser variables CSS de nuestro espacio de nombres.
        if not re.match(r'^--rt-[a-zA-Z0-9-]{1,40}$', k):
            continue
        if not _CSS_VALUE_RE.match(v):
            continue
        clean[k] = v
        if len(clean) >= 80:
            break
    return clean


def sanitize_css_source(css) -> str:
    """Sanea CSS libre escrito por el usuario antes de inyectarlo en un <style>.

    Elimina lo que permitiría romper el <style>, inyectar HTML/JS o hacer
    peticiones externas (SSRF al imprimir): etiquetas, @import, expression(),
    javascript:, behavior y url() que no sean data: o fragmentos locales.
    """
    if not isinstance(css, str):
        return ''
    css = css[:8000]
    # Nada de etiquetas HTML ni cierre de <style>.
    css = css.replace('<', '').replace('>', '')
    # Construcciones peligrosas fuera.
    css = re.sub(r'@import[^;]*;?', '', css, flags=re.IGNORECASE)
    css = re.sub(r'expression\s*\([^)]*\)', '', css, flags=re.IGNORECASE)
    css = re.sub(r'(javascript|vbscript)\s*:', '', css, flags=re.IGNORECASE)
    css = re.sub(r'-moz-binding\s*:[^;]*;?', '', css, flags=re.IGNORECASE)
    css = re.sub(r'behavior\s*:[^;]*;?', '', css, flags=re.IGNORECASE)

    # url(...) sólo se permite con data: o fragmentos (#id); el resto -> none.
    def _url(m):
        inner = m.group(1).strip().strip('\'"').lower()
        return m.group(0) if (inner.startswith('data:') or inner.startswith('#')) else 'none'
    css = re.sub(r'url\(([^)]*)\)', _url, css, flags=re.IGNORECASE)
    return css


class ThemeBase(BaseModel):
    slug: str
    name: str
    base: str = "light"
    vars: dict = {}
    custom_css: str = ""

    @field_validator('slug')
    @classmethod
    def _valid_slug(cls, v):
        v = (v or '').strip().lower()
        if not _SLUG_RE.match(v):
            raise ValueError('Slug inválido (solo minúsculas, números y guiones)')
        return v

    @field_validator('base')
    @classmethod
    def _valid_base(cls, v):
        return v if v in ('light', 'dark', 'htb') else 'light'

    @field_validator('vars')
    @classmethod
    def _clean_vars(cls, v):
        return _sanitize_theme_vars(v)

    @field_validator('custom_css')
    @classmethod
    def _clean_css(cls, v):
        return sanitize_css_source(v)


class ThemeCreate(ThemeBase):
    pass


class ThemeResponse(ThemeBase):
    id: int
    is_builtin: int = 0

    class Config:
        from_attributes = True


# --------------------------------------------------------------------------- #
# Plantillas de hallazgo del usuario
# --------------------------------------------------------------------------- #
class FindingTemplateBase(BaseModel):
    slug: str
    name: str
    title: str = ""
    severity: str = "med"
    cvss: str = ""
    cvss_vector: str = ""
    description: str = ""
    poc: str = ""
    impact: str = ""
    remediation: str = ""
    reference: str = ""
    cwe: str = ""
    cve: str = ""
    owasp: str = ""

    @field_validator('slug')
    @classmethod
    def _valid_slug(cls, v):
        v = (v or '').strip().lower()
        if not _SLUG_RE.match(v):
            raise ValueError('Slug inválido (solo minúsculas, números y guiones)')
        return v


class FindingTemplateCreate(FindingTemplateBase):
    pass


class FindingTemplateResponse(FindingTemplateBase):
    id: int

    class Config:
        from_attributes = True


class AppSettingsBase(BaseModel):
    lang: str = "es"
    report_theme: str = "light"
    pdf_print_theme: str = "light"
    pdf_show_severity_bars: bool = True
    pdf_content_width: int = 820

    @field_validator('lang')
    @classmethod
    def _valid_lang(cls, v):
        return v if v in ('es', 'en') else 'es'

    @field_validator('pdf_content_width')
    @classmethod
    def _clamp_width(cls, v):
        try:
            v = int(v)
        except (TypeError, ValueError):
            return 820
        return max(400, min(1400, v))


class AppSettingsUpdate(AppSettingsBase):
    pass


class AppSettingsResponse(AppSettingsBase):
    class Config:
        from_attributes = True
