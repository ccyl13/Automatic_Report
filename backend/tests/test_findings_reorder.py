"""Tests para reordenamiento de hallazgos"""

import pytest


class TestFindingsReorder:
    """Test suite para reordenamiento de hallazgos"""

    @pytest.fixture
    def sample_report(self, client):
        """Fixture: Crea un reporte de ejemplo"""
        report_data = {
            "document_title": "Reorder Test Report",
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
    def multiple_findings(self, client, sample_report):
        """Fixture: Crea múltiples hallazgos para reordenar"""
        report_id = sample_report["id"]
        findings = []

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
            response = client.post(f"/api/reports/{report_id}/findings", json=finding_data)
            findings.append(response.json())

        return findings

    def test_reorder_findings_success(self, client, sample_report, multiple_findings):
        """Test: POST /api/reports/{id}/findings/reorder cambia el orden"""
        report_id = sample_report["id"]

        # IDs en orden inverso: [2, 1, 0] en lugar de [0, 1, 2]
        finding_ids = [f["id"] for f in reversed(multiple_findings)]

        response = client.post(
            f"/api/reports/{report_id}/findings/reorder",
            json=finding_ids
        )

        assert response.status_code == 200
        assert response.json()["message"] == "Orden actualizado"

        # Verificar que el orden se actualizó
        get_response = client.get(f"/api/reports/{report_id}/findings")
        findings = get_response.json()

        assert len(findings) == 3
        # El que era índice 2 ahora debe ser 0, el 1 es 1, el 0 es 2
        assert findings[0]["id"] == finding_ids[0]
        assert findings[1]["id"] == finding_ids[1]
        assert findings[2]["id"] == finding_ids[2]

    def test_reorder_findings_nonexistent_report(self, client):
        """Test: Reordenar hallazgos de reporte inexistente no falla"""
        response = client.post(
            "/api/reports/999/findings/reorder",
            json=[1, 2, 3]
        )

        # Debe retornar 200 porque simplemente no encuentra hallazgos que actualizar
        assert response.status_code == 200

    def test_reorder_findings_partial_list(self, client, sample_report, multiple_findings):
        """Test: Reordenar subset de hallazgos mantiene el resto"""
        report_id = sample_report["id"]

        # Solo reordenar los primeros 2 hallazgos
        finding_ids = [multiple_findings[1]["id"], multiple_findings[0]["id"]]

        response = client.post(
            f"/api/reports/{report_id}/findings/reorder",
            json=finding_ids
        )

        assert response.status_code == 200

        # Verificar el orden
        get_response = client.get(f"/api/reports/{report_id}/findings")
        findings = get_response.json()

        # Los dos primeros deben estar en el nuevo orden
        assert findings[0]["id"] == finding_ids[0]
        assert findings[1]["id"] == finding_ids[1]
        # El tercero no se modificó porque no estaba en la lista

    def test_reorder_with_nonexistent_finding_id(self, client, sample_report, multiple_findings):
        """Test: ID de hallazgo inexistente en la lista se ignora silenciosamente"""
        report_id = sample_report["id"]

        # Incluir un ID que no existe (9999)
        finding_ids = [multiple_findings[0]["id"], 9999, multiple_findings[1]["id"]]

        response = client.post(
            f"/api/reports/{report_id}/findings/reorder",
            json=finding_ids
        )

        # No debe fallar, simplemente ignora el ID inválido
        assert response.status_code == 200

        # Verificar que los hallazgos válidos se actualizaron
        get_response = client.get(f"/api/reports/{report_id}/findings")
        findings = get_response.json()

        # El hallazgo 0 debe estar en índice 0
        assert findings[0]["id"] == multiple_findings[0]["id"]
