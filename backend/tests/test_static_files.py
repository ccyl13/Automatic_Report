"""Tests para archivos estáticos (CSS, JS, assets)"""


class TestStaticFiles:
    """Test suite para archivos estáticos"""

    def test_css_files_accessible(self, client):
        """Test: Archivos CSS son accesibles"""
        response = client.get("/css/styles.css")
        assert response.status_code == 200
        assert "text/css" in response.headers["content-type"]

        # Verificar que tiene contenido
        assert len(response.content) > 1000

    def test_js_files_accessible(self, client):
        """Test: Archivos JS son accesibles"""
        response = client.get("/js/app.js")
        assert response.status_code == 200
        # Puede ser text/javascript o application/javascript
        content_type = response.headers["content-type"]
        assert "javascript" in content_type

        # Verificar que tiene contenido
        assert len(response.content) > 1000

    def test_plantillas_json_accessible(self, client):
        """Test: Archivo de plantillas JSON es accesible"""
        response = client.get("/js/plantillas.json")
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

        # Verificar que es JSON válido con plantillas
        data = response.json()
        assert isinstance(data, dict)
        assert len(data) > 0  # Debe tener al menos una plantilla

    def test_static_files_no_cache_headers(self, client):
        """Test: Archivos estáticos tienen headers anti-caché"""
        response = client.get("/css/styles.css")
        assert response.status_code == 200

        # Verificar headers anti-caché
        assert "no-cache" in response.headers.get("Cache-Control", "")
        assert "no-store" in response.headers.get("Cache-Control", "")

    def test_nonexistent_css_file(self, client):
        """Test: Archivo CSS inexistente retorna 404"""
        response = client.get("/css/nonexistent.css")
        assert response.status_code == 404

    def test_nonexistent_js_file(self, client):
        """Test: Archivo JS inexistente retorna 404"""
        response = client.get("/js/nonexistent.js")
        assert response.status_code == 404
