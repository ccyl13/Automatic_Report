"""Tests para endpoints de Findings (Hallazgos)"""

import pytest


class TestFindingsAPI:
    """Test suite para la API de Hallazgos"""
    
    @pytest.fixture
    def sample_report(self, client):
        """Fixture: Crea un reporte de ejemplo"""
        report_data = {
            "document_title": "Test Report",
            "client_company": "Test Client",
            "target_asset": "Test App",
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
            "title": "SQL Injection",
            "severity": "crit",
            "description": "Vulnerabilidad de inyección SQL",
            "cvss": "9.8",
            "poc": "1. Inyectar payload",
            "impact": "Pérdida de datos",
            "remediation": "Usar prepared statements",
            "reference": "OWASP Top 10",
            "cve": "CVE-2024-1234",
            "images": ["data:image/png;base64,abc123"],
            "order_index": 0
        }
        report_id = sample_report["id"]
        response = client.post(f"/api/reports/{report_id}/findings", json=finding_data)
        return response.json()
    
    def test_create_finding(self, client, sample_report):
        """Test: POST /api/reports/{id}/findings crea un hallazgo"""
        finding_data = {
            "template_key": "xss",
            "title": "Cross-Site Scripting",
            "severity": "high",
            "description": "XSS reflejado en parámetro search",
            "cvss": "6.1",
            "poc": "<script>alert(1)</script>",
            "impact": "Robo de sesiones",
            "remediation": "Sanitizar input",
            "reference": "CWE-79",
            "cve": "",
            "images": [],
            "order_index": 0
        }
        
        report_id = sample_report["id"]
        response = client.post(f"/api/reports/{report_id}/findings", json=finding_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["title"] == "Cross-Site Scripting"
        assert data["severity"] == "high"
        assert data["report_id"] == report_id
        assert data["id"] is not None
    
    def test_create_finding_nonexistent_report(self, client):
        """Test: POST hallazgo a reporte inexistente retorna 404"""
        finding_data = {
            "template_key": "custom",
            "title": "Test",
            "severity": "low",
            "description": "Test description",
            "cvss": "",
            "poc": "",
            "impact": "",
            "remediation": "",
            "reference": "",
            "cve": "",
            "images": [],
            "order_index": 0
        }
        
        response = client.post("/api/reports/999/findings", json=finding_data)
        assert response.status_code == 404
    
    def test_get_findings_by_report(self, client, sample_report, sample_finding):
        """Test: GET /api/reports/{id}/findings retorna hallazgos del reporte"""
        report_id = sample_report["id"]
        
        response = client.get(f"/api/reports/{report_id}/findings")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["title"] == "SQL Injection"
    
    def test_get_findings_empty_report(self, client, sample_report):
        """Test: GET hallazgos de reporte sin hallazgos retorna lista vacía"""
        report_id = sample_report["id"]
        
        response = client.get(f"/api/reports/{report_id}/findings")
        assert response.status_code == 200
        assert response.json() == []
    
    def test_update_finding(self, client, sample_report, sample_finding):
        """Test: PUT /api/findings/{id} actualiza hallazgo"""
        finding_id = sample_finding["id"]
        
        update_data = {
            "template_key": "sqli",
            "title": "SQL Injection (Updated)",
            "severity": "high",  # Cambiado de crit a high
            "description": "Descripción actualizada",
            "cvss": "7.5",
            "poc": "Nuevo POC",
            "impact": "Impacto actualizado",
            "remediation": "Nueva solución",
            "reference": "OWASP",
            "cve": "CVE-2024-9999",
            "images": ["data:image/png;base64,updated"],
            "order_index": 0
        }
        
        response = client.put(f"/api/findings/{finding_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["title"] == "SQL Injection (Updated)"
        assert data["severity"] == "high"
        assert data["cvss"] == "7.5"
    
    def test_update_nonexistent_finding(self, client):
        """Test: PUT /api/findings/999 retorna 404"""
        update_data = {
            "template_key": "custom",
            "title": "Test",
            "severity": "low",
            "description": "Test",
            "cvss": "",
            "poc": "",
            "impact": "",
            "remediation": "",
            "reference": "",
            "cve": "",
            "images": [],
            "order_index": 0
        }
        
        response = client.put("/api/findings/999", json=update_data)
        assert response.status_code == 404
    
    def test_delete_finding(self, client, sample_report, sample_finding):
        """Test: DELETE /api/findings/{id} elimina hallazgo"""
        finding_id = sample_finding["id"]
        
        response = client.delete(f"/api/findings/{finding_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Hallazgo eliminado correctamente"
        
        # Verificar que ya no existe
        report_id = sample_report["id"]
        get_response = client.get(f"/api/reports/{report_id}/findings")
        assert get_response.json() == []
    
    def test_delete_nonexistent_finding(self, client):
        """Test: DELETE /api/findings/999 retorna 404"""
        response = client.delete("/api/findings/999")
        assert response.status_code == 404
    
    def test_multiple_findings_order(self, client, sample_report):
        """Test: Múltiples hallazgos mantienen orden correcto"""
        report_id = sample_report["id"]
        
        # Crear 3 hallazgos
        for i in range(3):
            finding_data = {
                "template_key": "custom",
                "title": f"Finding {i}",
                "severity": "med",
                "description": f"Description {i}",
                "cvss": "5.0",
                "poc": "",
                "impact": "",
                "remediation": "",
                "reference": "",
                "cve": "",
                "images": [],
                "order_index": i
            }
            client.post(f"/api/reports/{report_id}/findings", json=finding_data)
        
        response = client.get(f"/api/reports/{report_id}/findings")
        data = response.json()
        
        assert len(data) == 3
        for i, finding in enumerate(data):
            assert finding["title"] == f"Finding {i}"
            assert finding["order_index"] == i
    
    def test_finding_severity_levels(self, client, sample_report):
        """Test: Todos los niveles de severidad son válidos"""
        report_id = sample_report["id"]
        severities = ["crit", "high", "med", "low", "info"]
        
        for sev in severities:
            finding_data = {
                "template_key": "custom",
                "title": f"{sev.capitalize()} Finding",
                "severity": sev,
                "description": f"Test {sev}",
                "cvss": "",
                "poc": "",
                "impact": "",
                "remediation": "",
                "reference": "",
                "cve": "",
                "images": [],
                "order_index": 0
            }
            response = client.post(f"/api/reports/{report_id}/findings", json=finding_data)
            assert response.status_code == 200
            assert response.json()["severity"] == sev
    
    def test_report_includes_findings(self, client, sample_report, sample_finding):
        """Test: GET /api/reports/{id} incluye hallazgos embebidos"""
        report_id = sample_report["id"]
        
        response = client.get(f"/api/reports/{report_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert "findings" in data
        assert isinstance(data["findings"], list)
        assert len(data["findings"]) == 1
        assert data["findings"][0]["title"] == "SQL Injection"
