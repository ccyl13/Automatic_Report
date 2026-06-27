#!/usr/bin/env python3
"""
Pentestify MCP Server
=====================
Expone Pentestify como un servidor MCP (Model Context Protocol) para que
Claude Desktop, Claude Code y cualquier agente compatible puedan crear y
gestionar reportes de pentesting de forma nativa.

Este servidor soporta dos modos de transporte:

  1) stdio (por defecto) — Claude Desktop / Claude Code lo lanzan como
     subproceso EN LOCAL. La API key se lee de la variable de entorno
     PENTESTIFY_API_KEY. Configuración:
       a. En Pentestify → Cuenta → MCP / Agentes IA: genera una API key.
       b. Añade el bloque JSON que aparece a tu claude_desktop_config.json
          (o usa `claude mcp add` en Claude Code).
       c. Reinicia el cliente.

  2) streamable-http — el servidor MCP corre EN EL VPS (mismo puerto que el
     API si se monta en main.py, o como proceso aparte con `--http`). En este
     modo la API key NO se lee del entorno: cada cliente envía su propia clave
     en la cabecera `Authorization: Bearer ptf_...` de cada petición. Conecta
     desde Claude Code con:
       claude mcp add --transport http pentestify https://tu-vps/mcp \
         --header "Authorization: Bearer ptf_TU_CLAVE"

Variables de entorno:
  PENTESTIFY_API_URL   URL base del API de Pentestify (por defecto: http://localhost:8000)
  PENTESTIFY_API_KEY   Clave de API (solo en modo stdio; empieza por ptf_)

Ejecución del modo HTTP como proceso independiente:
  python mcp_server.py --http --host 127.0.0.1 --port 8001
"""

import json
import os
import sys
from typing import List, Optional

try:
    import httpx
except ImportError:
    print("ERROR: httpx no está instalado. Ejecuta: pip install httpx", file=sys.stderr)
    sys.exit(1)

try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    print(
        "ERROR: El paquete 'mcp' no está instalado.\n"
        "Instálalo con: pip install 'mcp>=1.0'\n"
        "O instala todas las dependencias: pip install -r requirements.txt",
        file=sys.stderr,
    )
    sys.exit(1)

from pydantic import BaseModel, Field

# --------------------------------------------------------------------------- #
# Configuración
# --------------------------------------------------------------------------- #
PENTESTIFY_URL = os.environ.get("PENTESTIFY_API_URL", "http://localhost:8000").rstrip("/")
# Solo se usa en modo stdio. En modo HTTP la clave llega por petición en la
# cabecera Authorization (ver _resolve_key). NO abortamos aquí si falta, porque
# este módulo se importa desde main.py para montar el transporte HTTP.
PENTESTIFY_KEY = os.environ.get("PENTESTIFY_API_KEY", "")

# --------------------------------------------------------------------------- #
# Servidor MCP
# --------------------------------------------------------------------------- #
# stateless_http=True: cada petición HTTP es independiente (no requiere afinidad
# de sesión), lo que simplifica el despliegue detrás de un reverse proxy.
mcp = FastMCP(
    "Pentestify",
    stateless_http=True,
    instructions="""
Estás conectado a Pentestify, un generador profesional de reportes de pentesting.

## Conceptos clave

**Reportes** contienen metadatos del engagement:
- Información del cliente y del auditor
- Alcance (en scope / fuera de scope), tipo de auditoría y metodología
- Resumen ejecutivo, pruebas realizadas y recomendaciones

**Hallazgos** (findings) son vulnerabilidades registradas en un reporte:
- título, severidad, descripción, Prueba de Concepto (PoC), impacto, remediación
- puntuación CVSS y vector, identificadores CVE/CWE, categoría OWASP
- activos afectados, estado, referencias de compliance

## Valores permitidos en los campos

- severity:        "crit" | "high" | "med" | "low" | "info"
- status:          "open" | "remediated" | "accepted_risk" | "false_positive"
- lang:            "es" (español) | "en" (inglés)
- audit_type:      "pentesting_web" | "pentesting_infra" | "red_team" | "caja_negra" |
                   "caja_blanca" | "caja_gris" | "phishing" | "wireless" |
                   "social_engineering" | "otro"
- classification:  1 (Público) | 2 (Interno) | 3 (Confidencial) | 4 (Restringido)
- tlp_level:       "clear" | "green" | "amber" | "amber+strict" | "red"
- likelihood / impact_rating: "high" | "med" | "low"

## Flujo de trabajo recomendado

Para un engagement nuevo, usa **create_full_report()** — crea el reporte y todos los
hallazgos en una sola llamada (el camino más eficiente para un agente).
Para añadir hallazgos más tarde, usa add_finding() o add_findings_bulk().
""",
)

# --------------------------------------------------------------------------- #
# Cliente HTTP compartido
# --------------------------------------------------------------------------- #
_client = httpx.Client(timeout=30.0)


def _resolve_key() -> str:
    """Devuelve la API key a usar para llamar al API de Pentestify.

    En modo HTTP, cada cliente envía su propia clave en la cabecera
    `Authorization: Bearer ptf_...`; la leemos del contexto de la petición en
    curso. En modo stdio no hay petición HTTP, así que usamos PENTESTIFY_KEY.
    """
    try:
        ctx = mcp.get_context()
        request = getattr(ctx.request_context, "request", None)
        if request is not None:
            header = request.headers.get("authorization", "")
            if header.lower().startswith("bearer "):
                token = header[7:].strip()
                if token:
                    return token
    except Exception:
        # Sin contexto de petición (modo stdio) o contexto no disponible.
        pass
    return PENTESTIFY_KEY


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {_resolve_key()}",
        "Content-Type": "application/json",
    }


def _get(path: str):
    try:
        r = _client.get(f"{PENTESTIFY_URL}{path}", headers=_headers())
        r.raise_for_status()
        return r.json()
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Error {e.response.status_code}: {e.response.text}") from e
    except httpx.RequestError as e:
        raise RuntimeError(f"No se pudo conectar a Pentestify ({PENTESTIFY_URL}): {e}") from e


def _post(path: str, data: dict):
    try:
        r = _client.post(f"{PENTESTIFY_URL}{path}", json=data, headers=_headers())
        r.raise_for_status()
        return r.json()
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Error {e.response.status_code}: {e.response.text}") from e
    except httpx.RequestError as e:
        raise RuntimeError(f"No se pudo conectar a Pentestify ({PENTESTIFY_URL}): {e}") from e


def _put(path: str, data: dict):
    try:
        r = _client.put(f"{PENTESTIFY_URL}{path}", json=data, headers=_headers())
        r.raise_for_status()
        return r.json()
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Error {e.response.status_code}: {e.response.text}") from e
    except httpx.RequestError as e:
        raise RuntimeError(f"No se pudo conectar a Pentestify ({PENTESTIFY_URL}): {e}") from e


def _delete(path: str):
    try:
        r = _client.delete(f"{PENTESTIFY_URL}{path}", headers=_headers())
        r.raise_for_status()
        return r.json()
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Error {e.response.status_code}: {e.response.text}") from e
    except httpx.RequestError as e:
        raise RuntimeError(f"No se pudo conectar a Pentestify ({PENTESTIFY_URL}): {e}") from e


# --------------------------------------------------------------------------- #
# Modelos Pydantic para los inputs de las herramientas
# (FastMCP los convierte automáticamente en JSON Schema para el agente)
# --------------------------------------------------------------------------- #

class FindingInput(BaseModel):
    title: str = Field(description="Título de la vulnerabilidad")
    severity: str = Field(
        default="med",
        description='Severidad: "crit" | "high" | "med" | "low" | "info"',
    )
    description: str = Field(default="", description="Descripción técnica de la vulnerabilidad")
    poc: str = Field(default="", description="Pasos para reproducir la vulnerabilidad (Proof of Concept)")
    exploit: str = Field(default="", description="Código o fragmento del exploit (opcional)")
    impact: str = Field(default="", description="Impacto en el negocio / sistema")
    remediation: str = Field(default="", description="Pasos de remediación recomendados")
    cvss: str = Field(default="", description='Puntuación CVSS 3.x (ej: "9.8")')
    cvss_vector: str = Field(default="", description='Vector CVSS completo (ej: "CVSS:3.1/AV:N/AC:L/...")')
    cve: str = Field(default="", description='Identificador CVE (ej: "CVE-2023-1234" o "N/A")')
    cwe: str = Field(default="", description='Identificador CWE MITRE (ej: "CWE-89")')
    owasp: str = Field(default="", description='Categoría OWASP Top 10 (ej: "A03:2021 – Injection")')
    affected_assets: str = Field(default="", description="URLs, hosts o parámetros afectados (uno por línea)")
    status: str = Field(
        default="open",
        description='"open" | "remediated" | "accepted_risk" | "false_positive"',
    )
    likelihood: str = Field(default="", description='"high" | "med" | "low"')
    impact_rating: str = Field(default="", description='"high" | "med" | "low"')
    references: List[str] = Field(default_factory=list, description="Lista de URLs de referencia")
    compliance: List[str] = Field(
        default_factory=list,
        description='Referencias normativas (ej: ["PCI-DSS 6.5.1", "ISO 27001 A.14"])',
    )
    retest_notes: str = Field(default="", description="Notas del re-test (si aplica)")


class ReportInput(BaseModel):
    document_title: str = Field(
        default="Reporte Técnico de Vulnerabilidades",
        description="Título del documento del informe",
    )
    client_company: str = Field(default="", description="Nombre de la empresa cliente")
    target_asset: str = Field(default="", description="Activo o sistema auditado (URL, IP, nombre)")
    auditor_company: str = Field(default="", description="Nombre de la empresa auditora")
    auditor_name: str = Field(default="", description="Nombre del auditor responsable")
    auditor_email: str = Field(default="", description="Email del auditor")
    auditor_phone: str = Field(default="", description="Teléfono del auditor")
    date: str = Field(default="", description="Fecha del reporte en formato YYYY-MM-DD")
    version: str = Field(default="1.0", description='Versión del documento (ej: "1.0")')
    lang: str = Field(default="es", description='"es" (español) | "en" (inglés)')
    audit_type: str = Field(
        default="pentesting_web",
        description=(
            '"pentesting_web" | "pentesting_infra" | "red_team" | '
            '"caja_negra" | "caja_blanca" | "caja_gris" | '
            '"phishing" | "wireless" | "social_engineering" | "otro"'
        ),
    )
    classification: int = Field(
        default=3,
        description="1=Público · 2=Interno · 3=Confidencial · 4=Restringido",
    )
    tlp_level: str = Field(
        default="amber",
        description='"clear" | "green" | "amber" | "amber+strict" | "red"',
    )
    classification_mode: str = Field(
        default="tlp",
        description='"internal" | "tlp" | "both"',
    )
    scope_in: str = Field(default="", description="Activos dentro del alcance (uno por línea)")
    scope_out: str = Field(default="", description="Exclusiones / fuera de alcance (uno por línea)")
    audit_summary: str = Field(default="", description="Resumen ejecutivo de la auditoría")
    tests_performed: str = Field(default="", description="Descripción de las pruebas realizadas")
    recommended_solutions: str = Field(default="", description="Recomendaciones globales")
    methodology_notes: str = Field(default="", description="Notas sobre la metodología empleada")
    methodology_standards: List[str] = Field(
        default_factory=list,
        description='Estándares aplicados (ej: ["owasp_wstg", "ptes", "nist_800_115"])',
    )
    tools_used: str = Field(default="", description="Herramientas utilizadas durante el engagement")
    engagement_start: str = Field(default="", description="Fecha de inicio del engagement (YYYY-MM-DD)")
    engagement_end: str = Field(default="", description="Fecha de fin del engagement (YYYY-MM-DD)")
    has_incidents: bool = Field(default=False, description="True si se produjeron incidentes durante la auditoría")
    incidents_text: str = Field(default="", description="Descripción de los incidentes (si has_incidents=True)")


# --------------------------------------------------------------------------- #
# Herramientas MCP
# --------------------------------------------------------------------------- #

@mcp.tool()
def list_reports() -> str:
    """Lista todos los reportes de pentesting almacenados en Pentestify con su información básica."""
    reports = _get("/api/reports")
    if not reports:
        return "No hay reportes en Pentestify."

    lines = [f"Se encontraron {len(reports)} reporte(s):\n"]
    for r in reports:
        lines.append(
            f"  ID {r['id']}: {r['document_title']}\n"
            f"    Cliente: {r['client_company']} | Objetivo: {r['target_asset']}\n"
            f"    Fecha: {r['date']} | Hallazgos: {r['findings_count']}\n"
        )
    return "\n".join(lines)


@mcp.tool()
def get_report(report_id: int) -> str:
    """Obtiene un reporte completo con todos sus hallazgos.

    Args:
        report_id: ID del reporte a recuperar
    """
    report = _get(f"/api/reports/{report_id}")
    return json.dumps(report, indent=2, default=str, ensure_ascii=False)


@mcp.tool()
def create_report(report: ReportInput) -> str:
    """Crea un nuevo reporte de pentesting (solo metadatos).

    Devuelve el reporte creado con su ID. Usa add_finding() o add_findings_bulk()
    para añadir hallazgos, o usa create_full_report() para crear todo de una vez.

    Args:
        report: Metadatos del reporte (cliente, auditor, alcance, metodología)
    """
    result = _post("/api/reports", report.model_dump())
    return (
        f"Reporte creado correctamente.\n"
        f"  ID: {result['id']}\n"
        f"  Título: {result['document_title']}\n"
        f"  Cliente: {result['client_company']}\n"
        f"  URL: {PENTESTIFY_URL}/?report_id={result['id']}"
    )


@mcp.tool()
def update_report(report_id: int, report: ReportInput) -> str:
    """Actualiza los metadatos de un reporte existente.

    Args:
        report_id: ID del reporte a actualizar
        report: Metadatos actualizados del reporte
    """
    result = _put(f"/api/reports/{report_id}", report.model_dump())
    return f"Reporte {report_id} actualizado: {result['document_title']}"


@mcp.tool()
def delete_report(report_id: int) -> str:
    """Elimina un reporte y todos sus hallazgos de forma permanente.

    Args:
        report_id: ID del reporte a eliminar
    """
    result = _delete(f"/api/reports/{report_id}")
    return result.get("message", f"Reporte {report_id} eliminado.")


@mcp.tool()
def list_findings(report_id: int) -> str:
    """Lista todos los hallazgos de un reporte con su información básica.

    Args:
        report_id: ID del reporte
    """
    findings = _get(f"/api/reports/{report_id}/findings")
    if not findings:
        return f"El reporte {report_id} no tiene hallazgos."

    lines = [f"Hallazgos del reporte {report_id} ({len(findings)} total):\n"]
    for f in findings:
        lines.append(
            f"  ID {f['id']}: [{f['severity'].upper()}] {f['title']}\n"
            f"    Estado: {f['status']} | CVSS: {f.get('cvss') or 'N/A'} "
            f"| CWE: {f.get('cwe') or 'N/A'} | OWASP: {f.get('owasp') or 'N/A'}\n"
        )
    return "\n".join(lines)


@mcp.tool()
def add_finding(report_id: int, finding: FindingInput) -> str:
    """Añade un hallazgo de vulnerabilidad a un reporte.

    Args:
        report_id: ID del reporte al que añadir el hallazgo
        finding: Datos del hallazgo de vulnerabilidad
    """
    result = _post(f"/api/reports/{report_id}/findings", finding.model_dump())
    return (
        f"Hallazgo añadido correctamente.\n"
        f"  ID: {result['id']}\n"
        f"  [{result['severity'].upper()}] {result['title']}"
    )


@mcp.tool()
def update_finding(finding_id: int, finding: FindingInput) -> str:
    """Actualiza un hallazgo de vulnerabilidad existente.

    Args:
        finding_id: ID del hallazgo a actualizar
        finding: Datos actualizados del hallazgo
    """
    result = _put(f"/api/findings/{finding_id}", finding.model_dump())
    return f"Hallazgo {finding_id} actualizado: [{result['severity'].upper()}] {result['title']}"


@mcp.tool()
def delete_finding(finding_id: int) -> str:
    """Elimina un hallazgo de vulnerabilidad.

    Args:
        finding_id: ID del hallazgo a eliminar
    """
    result = _delete(f"/api/findings/{finding_id}")
    return result.get("message", f"Hallazgo {finding_id} eliminado.")


@mcp.tool()
def add_findings_bulk(report_id: int, findings: List[FindingInput]) -> str:
    """Añade múltiples hallazgos a un reporte en una sola llamada.

    Args:
        report_id: ID del reporte
        findings: Lista de hallazgos a añadir (en orden de aparición en el informe)
    """
    created: List[str] = []
    errors: List[str] = []

    for i, finding in enumerate(findings):
        try:
            data = finding.model_dump()
            data["order_index"] = i
            result = _post(f"/api/reports/{report_id}/findings", data)
            created.append(f"  {i + 1}. [{result['severity'].upper()}] {result['title']} (ID: {result['id']})")
        except Exception as e:
            errors.append(f"  {i + 1}. {finding.title}: {e}")

    lines = [f"Añadidos {len(created)}/{len(findings)} hallazgos al reporte {report_id}:"]
    lines.extend(created)
    if errors:
        lines.append(f"\nErrores ({len(errors)}):")
        lines.extend(errors)
    return "\n".join(lines)


@mcp.tool()
def reorder_findings(report_id: int, finding_ids: List[int]) -> str:
    """Reordena los hallazgos de un reporte.

    Args:
        report_id: ID del reporte
        finding_ids: Lista de IDs de hallazgos en el nuevo orden deseado
    """
    result = _post(f"/api/reports/{report_id}/findings/reorder", finding_ids)
    return result.get("message", "Orden actualizado correctamente.")


@mcp.tool()
def create_full_report(report: ReportInput, findings: List[FindingInput]) -> str:
    """Crea un reporte de pentesting completo con todos sus hallazgos en una sola llamada.

    Esta es la herramienta más eficiente para un agente IA: crea el reporte y todos
    los hallazgos de forma atómica. Úsala cuando tengas todos los datos del engagement.

    Args:
        report: Metadatos del reporte (cliente, auditor, alcance, resumen ejecutivo, etc.)
        findings: Lista de todos los hallazgos de vulnerabilidades a incluir en el reporte
    """
    # 1. Crear el reporte
    created_report = _post("/api/reports", report.model_dump())
    report_id = created_report["id"]

    # 2. Añadir todos los hallazgos
    added: List[str] = []
    failed: List[str] = []

    for i, finding in enumerate(findings):
        try:
            data = finding.model_dump()
            data["order_index"] = i
            result = _post(f"/api/reports/{report_id}/findings", data)
            added.append(f"  {i + 1}. [{result['severity'].upper()}] {result['title']}")
        except Exception as e:
            failed.append(f"  {i + 1}. {finding.title}: {e}")

    lines = [
        "¡Reporte creado correctamente!",
        f"  ID:       {report_id}",
        f"  Título:   {created_report['document_title']}",
        f"  Cliente:  {created_report['client_company']}",
        f"  Objetivo: {created_report['target_asset']}",
        f"  Hallazgos añadidos: {len(added)}/{len(findings)}",
        f"  URL: {PENTESTIFY_URL}/?report_id={report_id}",
        "",
        "Hallazgos:",
    ]
    lines.extend(added)
    if failed:
        lines.append(f"\nFallidos ({len(failed)}):")
        lines.extend(failed)

    return "\n".join(lines)


@mcp.tool()
def list_finding_templates() -> str:
    """Lista las plantillas de hallazgo guardadas en Pentestify (base de conocimiento).

    Las plantillas contienen descripciones pre-rellenas de vulnerabilidades comunes
    que se pueden usar como punto de partida al añadir hallazgos.
    """
    templates = _get("/api/finding-templates")
    if not templates:
        return "No hay plantillas de hallazgo personalizadas en Pentestify."

    lines = [f"Se encontraron {len(templates)} plantilla(s):\n"]
    for t in templates:
        lines.append(
            f"  Slug: {t['slug']}\n"
            f"  Nombre: {t['name']}\n"
            f"  Título: {t.get('title') or 'N/A'}\n"
            f"  Severidad: {t.get('severity') or 'N/A'} | "
            f"CWE: {t.get('cwe') or 'N/A'} | CVE: {t.get('cve') or 'N/A'}\n"
        )
    return "\n".join(lines)


@mcp.tool()
def get_report_summary(report_id: int) -> str:
    """Obtiene un resumen conciso de un reporte con estadísticas de hallazgos por severidad.

    Útil para revisar el estado de un engagement sin cargar todos los datos.

    Args:
        report_id: ID del reporte
    """
    report = _get(f"/api/reports/{report_id}")

    severity_counts: dict = {"crit": 0, "high": 0, "med": 0, "low": 0, "info": 0}
    status_counts: dict = {"open": 0, "remediated": 0, "accepted_risk": 0, "false_positive": 0}

    for f in report.get("findings", []):
        sev = f.get("severity", "med")
        if sev in severity_counts:
            severity_counts[sev] += 1
        st = f.get("status", "open")
        if st in status_counts:
            status_counts[st] += 1

    total = sum(severity_counts.values())

    lines = [
        f"=== Resumen del reporte ID {report_id} ===",
        f"Título:   {report['document_title']}",
        f"Cliente:  {report['client_company']}",
        f"Objetivo: {report['target_asset']}",
        f"Fecha:    {report['date']}",
        f"Auditor:  {report['auditor_name']} ({report['auditor_company']})",
        "",
        f"Total de hallazgos: {total}",
        f"  Crítico:      {severity_counts['crit']}",
        f"  Alto:         {severity_counts['high']}",
        f"  Medio:        {severity_counts['med']}",
        f"  Bajo:         {severity_counts['low']}",
        f"  Informativo:  {severity_counts['info']}",
        "",
        f"Por estado:",
        f"  Abiertos:           {status_counts['open']}",
        f"  Remediados:         {status_counts['remediated']}",
        f"  Riesgo aceptado:    {status_counts['accepted_risk']}",
        f"  Falso positivo:     {status_counts['false_positive']}",
        "",
        f"URL: {PENTESTIFY_URL}/?report_id={report_id}",
    ]
    return "\n".join(lines)


# --------------------------------------------------------------------------- #
# Punto de entrada
# --------------------------------------------------------------------------- #
def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(
        description="Servidor MCP de Pentestify (stdio por defecto, o HTTP con --http)."
    )
    parser.add_argument(
        "--http",
        action="store_true",
        help="Servir por HTTP (streamable-http) en lugar de stdio.",
    )
    parser.add_argument(
        "--host",
        default=os.environ.get("PENTESTIFY_MCP_HOST", "127.0.0.1"),
        help="Host de escucha en modo HTTP (por defecto: 127.0.0.1).",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.environ.get("PENTESTIFY_MCP_PORT", "8001")),
        help="Puerto de escucha en modo HTTP (por defecto: 8001).",
    )
    args = parser.parse_args()

    if args.http:
        # En modo HTTP la clave llega por petición; no exigimos PENTESTIFY_KEY.
        mcp.settings.host = args.host
        mcp.settings.port = args.port
        print(
            f"Pentestify MCP (HTTP) escuchando en http://{args.host}:{args.port}"
            f"{mcp.settings.streamable_http_path}",
            file=sys.stderr,
        )
        mcp.run(transport="streamable-http")
    else:
        # Modo stdio: la clave es obligatoria porque no hay cabecera por petición.
        if not PENTESTIFY_KEY:
            print(
                "ERROR: La variable de entorno PENTESTIFY_API_KEY es obligatoria "
                "en modo stdio.\n"
                "Genera una API key en Pentestify → Cuenta → MCP / Agentes IA.",
                file=sys.stderr,
            )
            sys.exit(1)
        mcp.run()


if __name__ == "__main__":
    main()
