from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


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
    images: List[str] = []
    order_index: int = 0


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
    classification: int = 2
    version: str = "1.0"
    date: str = ""
    lang: str = "es"


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
