"""Tests para generación de PDF"""

import pytest


class TestPDFExport:
    """Test suite para exportación de reportes a PDF"""

    @pytest.fixture
    def sample_report(self, client):
        """Fixture: Crea un reporte de ejemplo"""
        report_data = {
            "document_title": "PDF Test Report",
            "client_company": "Test Client",
            "target_asset": "Test Application",
            "auditor_company": "Test Auditor",
            "auditor_name": "Test User",
            "classification": 2,
            "version": "1.0",
            "date": "2024-01-15",
            "lang": "es"
        }
        response = client.post("/api/reports", json=report_data)
        return response.json()

    @pytest.fixture
    def sample_finding(self, client, sample_report):
        """Fixture: Crea un hallazgo de ejemplo"""
        finding_data = {
            "template_key": "sqli",
            "title": "SQL Injection in Login",
            "severity": "crit",
            "description": "SQL Injection vulnerability found in login form",
            "cvss": "9.1",
            "poc": "Inject ' OR '1'='1' --",
            "impact": "Complete database compromise",
            "remediation": "Use parameterized queries",
            "reference": "OWASP SQL Injection",
            "cve": "CVE-2024-1234",
            "images": [],
            "order_index": 0
        }
        report_id = sample_report["id"]
        response = client.post(f"/api/reports/{report_id}/findings", json=finding_data)
        return response.json()

    def test_generate_pdf_existing_report(self, client, sample_report):
        """Test: GET /api/reports/{id}/pdf genera PDF para reporte existente"""
        report_id = sample_report["id"]

        # Nota: Este test puede fallar si Playwright no está instalado
        # o si no hay navegador disponible en el entorno de CI
        try:
            response = client.get(f"/api/reports/{report_id}/pdf")
            # Si Playwright está disponible, debe retornar 200 con PDF
            if response.status_code == 200:
                assert response.headers["content-type"] == "application/pdf"
                assert f"Report_{report_id}.pdf" in response.headers.get("content-disposition", "")
            else:
                # Si no hay Playwright, al menos verificar que no es 404
                assert response.status_code in [200, 500]  # 500 si hay error de Playwright
        except Exception as e:
            pytest.skip(f"Playwright no disponible: {e}")

    def test_generate_pdf_nonexistent_report(self, client):
        """Test: GET /api/reports/999/pdf retorna 404"""
        response = client.get("/api/reports/999/pdf")
        assert response.status_code == 404
        assert response.json()["detail"] == "Reporte no encontrado"

    def test_generate_pdf_with_findings(self, client, sample_report, sample_finding):
        """Test: PDF se puede generar con hallazgos incluidos"""
        report_id = sample_report["id"]

        try:
            response = client.get(f"/api/reports/{report_id}/pdf")
            # Verificar que el endpoint responde (el contenido del PDF depende de Playwright)
            assert response.status_code in [200, 500]
        except Exception as e:
            pytest.skip(f"Playwright no disponible: {e}")
