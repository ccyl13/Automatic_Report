"""Tests para API info endpoint"""


class TestAPIInfo:
    """Test suite para información de la API"""

    def test_api_root_endpoint(self, client):
        """Test: GET /api retorna información de la API"""
        response = client.get("/api")
        assert response.status_code == 200

        data = response.json()
        assert data["message"] == "Pentestify API"
        assert data["version"] == "1.0.0"

    def test_frontend_root_endpoint(self, client):
        """Test: GET / retorna el frontend (index.html)"""
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
