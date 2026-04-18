"""Tests para reordenamiento automático al eliminar hallazgos"""

import pytest


class TestFindingsDeleteReorder:
    """Test suite para verificar reordenamiento al eliminar"""

    @pytest.fixture
    def sample_report(self, client):
        """Fixture: Crea un reporte de ejemplo"""
        report_data = {
            "document_title": "Delete Reorder Test",
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
    def three_findings(self, client, sample_report):
        """Fixture: Crea 3 hallazgos con order_index 0, 1, 2"""
        report_id = sample_report["id"]
        findings = []

        for i in range(3):
            finding_data = {
                "template_key": "custom",
                "title": f"Finding {i}",
                "severity": "med",
                "description": f"Description {i}",
                "cvss": str(5.0 + i),
                "poc": f"PoC {i}",
                "impact": f"Impact {i}",
                "remediation": f"Fix {i}",
                "reference": f"Ref {i}",
                "cve": f"CVE-2024-{i}",
                "images": [],
                "order_index": i
            }
            response = client.post(f"/api/reports/{report_id}/findings", json=finding_data)
            findings.append(response.json())

        return findings

    def test_delete_middle_finding_reorders_others(self, client, sample_report, three_findings):
        """Test: Eliminar hallazgo del medio reordena los restantes"""
        report_id = sample_report["id"]

        # Eliminar el hallazgo del medio (índice 1)
        middle_finding_id = three_findings[1]["id"]
        delete_response = client.delete(f"/api/findings/{middle_finding_id}")
        assert delete_response.status_code == 200

        # Verificar reordenamiento
        get_response = client.get(f"/api/reports/{report_id}/findings")
        remaining = get_response.json()

        assert len(remaining) == 2

        # El que era índice 0 debe seguir en 0
        assert remaining[0]["order_index"] == 0
        # El que era índice 2 ahora debe estar en 1
        assert remaining[1]["order_index"] == 1
        assert remaining[1]["title"] == "Finding 2"

    def test_delete_first_finding_reorders_others(self, client, sample_report, three_findings):
        """Test: Eliminar primer hallazgo reordena los restantes"""
        report_id = sample_report["id"]

        # Eliminar el primer hallazgo (índice 0)
        first_finding_id = three_findings[0]["id"]
        delete_response = client.delete(f"/api/findings/{first_finding_id}")
        assert delete_response.status_code == 200

        # Verificar reordenamiento
        get_response = client.get(f"/api/reports/{report_id}/findings")
        remaining = get_response.json()

        assert len(remaining) == 2

        # Los índices deben ser 0 y 1, no 1 y 2
        assert remaining[0]["order_index"] == 0
        assert remaining[0]["title"] == "Finding 1"
        assert remaining[1]["order_index"] == 1
        assert remaining[1]["title"] == "Finding 2"

    def test_delete_last_finding_no_reorder_needed(self, client, sample_report, three_findings):
        """Test: Eliminar último hallazgo no requiere reordenar"""
        report_id = sample_report["id"]

        # Eliminar el último hallazgo (índice 2)
        last_finding_id = three_findings[2]["id"]
        delete_response = client.delete(f"/api/findings/{last_finding_id}")
        assert delete_response.status_code == 200

        # Verificar que los primeros dos mantienen sus índices
        get_response = client.get(f"/api/reports/{report_id}/findings")
        remaining = get_response.json()

        assert len(remaining) == 2
        assert remaining[0]["order_index"] == 0
        assert remaining[1]["order_index"] == 1
