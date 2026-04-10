"""Tests para endpoints de Reportes"""


class TestReportsAPI:
    """Test suite para la API de Reportes"""
    
    def test_root_endpoint(self, client):
        """Test: GET / debe retornar mensaje de bienvenida"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Pentestify API"
        assert data["version"] == "1.0.0"
    
    def test_create_report(self, client):
        """Test: POST /api/reports crea un reporte"""
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
        assert response.status_code == 200
        
        data = response.json()
        assert data["document_title"] == "Test Report"
        assert data["client_company"] == "Test Client"
        assert data["id"] is not None
        assert "created_at" in data
    
    def test_get_all_reports(self, client):
        """Test: GET /api/reports retorna lista de reportes"""
        # Crear reporte primero
        report_data = {
            "document_title": "List Test",
            "client_company": "Client",
            "target_asset": "App",
            "auditor_company": "Auditor",
            "auditor_name": "User",
            "classification": 1,
            "version": "1.0",
            "date": "2024-01-15",
            "lang": "en"
        }
        client.post("/api/reports", json=report_data)
        
        response = client.get("/api/reports")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["document_title"] == "List Test"
    
    def test_get_single_report(self, client):
        """Test: GET /api/reports/{id} retorna reporte específico"""
        # Crear reporte
        report_data = {
            "document_title": "Single Test",
            "client_company": "Client",
            "target_asset": "App",
            "auditor_company": "Auditor",
            "auditor_name": "User",
            "classification": 1,
            "version": "1.0",
            "date": "2024-01-15",
            "lang": "es"
        }
        create_response = client.post("/api/reports", json=report_data)
        report_id = create_response.json()["id"]
        
        # Obtener reporte
        response = client.get(f"/api/reports/{report_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == report_id
        assert data["document_title"] == "Single Test"
        assert "findings" in data
    
    def test_get_nonexistent_report(self, client):
        """Test: GET /api/reports/999 retorna 404"""
        response = client.get("/api/reports/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Reporte no encontrado"
    
    def test_update_report(self, client):
        """Test: PUT /api/reports/{id} actualiza reporte"""
        # Crear reporte
        report_data = {
            "document_title": "Original",
            "client_company": "Client",
            "target_asset": "App",
            "auditor_company": "Auditor",
            "auditor_name": "User",
            "classification": 1,
            "version": "1.0",
            "date": "2024-01-15",
            "lang": "es"
        }
        create_response = client.post("/api/reports", json=report_data)
        report_id = create_response.json()["id"]
        
        # Actualizar
        update_data = {
            "document_title": "Updated Title",
            "client_company": "Updated Client",
            "target_asset": "Updated App",
            "auditor_company": "Auditor",
            "auditor_name": "User",
            "classification": 3,
            "version": "2.0",
            "date": "2024-02-20",
            "lang": "en"
        }
        response = client.put(f"/api/reports/{report_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["document_title"] == "Updated Title"
        assert data["version"] == "2.0"
        assert data["lang"] == "en"
    
    def test_update_nonexistent_report(self, client):
        """Test: PUT /api/reports/999 retorna 404"""
        update_data = {
            "document_title": "Updated",
            "client_company": "Client",
            "target_asset": "App",
            "auditor_company": "Auditor",
            "auditor_name": "User",
            "classification": 1,
            "version": "1.0",
            "date": "2024-01-15",
            "lang": "es"
        }
        response = client.put("/api/reports/999", json=update_data)
        assert response.status_code == 404
    
    def test_delete_report(self, client):
        """Test: DELETE /api/reports/{id} elimina reporte"""
        # Crear reporte
        report_data = {
            "document_title": "To Delete",
            "client_company": "Client",
            "target_asset": "App",
            "auditor_company": "Auditor",
            "auditor_name": "User",
            "classification": 1,
            "version": "1.0",
            "date": "2024-01-15",
            "lang": "es"
        }
        create_response = client.post("/api/reports", json=report_data)
        report_id = create_response.json()["id"]
        
        # Eliminar
        response = client.delete(f"/api/reports/{report_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Reporte eliminado correctamente"
        
        # Verificar que ya no existe
        get_response = client.get(f"/api/reports/{report_id}")
        assert get_response.status_code == 404
    
    def test_delete_nonexistent_report(self, client):
        """Test: DELETE /api/reports/999 retorna 404"""
        response = client.delete("/api/reports/999")
        assert response.status_code == 404
