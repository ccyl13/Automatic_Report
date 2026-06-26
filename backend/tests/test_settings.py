"""Tests de las preferencias globales (app_settings) persistidas en la BD."""


class TestAppSettings:
    def test_get_creates_defaults(self, client):
        """GET /api/settings devuelve (creando) la fila de preferencias por defecto."""
        response = client.get("/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert data["lang"] in ("es", "en")
        assert "report_theme" in data
        assert "pdf_print_theme" in data
        assert isinstance(data["pdf_show_severity_bars"], bool)
        assert isinstance(data["pdf_content_width"], int)

    def test_update_and_persist(self, client):
        """PUT /api/settings guarda y un GET posterior lo refleja."""
        payload = {
            "lang": "en",
            "report_theme": "htb",
            "pdf_print_theme": "dark",
            "pdf_show_severity_bars": False,
            "pdf_content_width": 1000,
        }
        put = client.put("/api/settings", json=payload)
        assert put.status_code == 200
        assert put.json() == payload

        got = client.get("/api/settings").json()
        assert got == payload

    def test_lang_is_validated(self, client):
        """Un idioma no soportado se normaliza a 'es'."""
        client.put("/api/settings", json={
            "lang": "fr",
            "report_theme": "light",
            "pdf_print_theme": "light",
            "pdf_show_severity_bars": True,
            "pdf_content_width": 820,
        })
        assert client.get("/api/settings").json()["lang"] == "es"

    def test_content_width_is_clamped(self, client):
        """El ancho de contenido se acota a un rango razonable."""
        client.put("/api/settings", json={
            "lang": "es",
            "report_theme": "light",
            "pdf_print_theme": "light",
            "pdf_show_severity_bars": True,
            "pdf_content_width": 99999,
        })
        assert client.get("/api/settings").json()["pdf_content_width"] <= 1400
