"""Tests para import/export de base de datos"""

import os
import pytest
from io import BytesIO


class TestDatabaseIO:
    """Test suite para importación y exportación de base de datos"""

    @pytest.fixture
    def sample_report(self, client):
        """Fixture: Crea un reporte de ejemplo"""
        report_data = {
            "document_title": "Export Test Report",
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

    def test_export_database(self, client, sample_report):
        """Test: GET /api/database/export descarga archivo .db"""
        response = client.get("/api/database/export")
        assert response.status_code == 200

        # Verificar headers
        assert response.headers["content-type"] == "application/x-sqlite3"
        assert "pentestify_backup_" in response.headers["content-disposition"]
        assert ".db" in response.headers["content-disposition"]

        # Verificar que el contenido es un archivo SQLite válido
        content = response.content
        assert content[:16] == b"SQLite format 3\x00"  # Magic bytes de SQLite

    def test_import_database_valid(self, client, sample_report, tmp_path):
        """Test: POST /api/database/import restaura base de datos válida"""
        # Primero exportar la base de datos actual
        export_response = client.get("/api/database/export")
        assert export_response.status_code == 200
        db_content = export_response.content

        # Crear archivo para subir
        file_obj = BytesIO(db_content)
        file_obj.name = "test_backup.db"

        # Importar la base de datos
        response = client.post(
            "/api/database/import",
            files={"file": ("test_backup.db", file_obj, "application/x-sqlite3")}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Base de datos importada correctamente"
        assert data["filename"] == "test_backup.db"

        # Verificar que el reporte sigue existiendo después de importar
        reports_response = client.get("/api/reports")
        assert reports_response.status_code == 200
        reports = reports_response.json()
        assert len(reports) >= 1

    def test_import_database_invalid_extension(self, client):
        """Test: Importar archivo sin extensión .db retorna 400"""
        file_obj = BytesIO(b"not a database")
        file_obj.name = "invalid.txt"

        response = client.post(
            "/api/database/import",
            files={"file": ("invalid.txt", file_obj, "text/plain")}
        )

        assert response.status_code == 400
        assert "extensión .db" in response.json()["detail"]

    def test_import_database_invalid_sqlite(self, client):
        """Test: Importar archivo que no es SQLite válido retorna 400"""
        file_obj = BytesIO(b"this is not a sqlite database file content")
        file_obj.name = "invalid.db"

        response = client.post(
            "/api/database/import",
            files={"file": ("invalid.db", file_obj, "application/x-sqlite3")}
        )

        assert response.status_code == 400
        assert "no es una base de datos SQLite" in response.json()["detail"]

    def test_import_database_missing_tables(self, client, tmp_path):
        """Test: Importar SQLite sin tablas requeridas retorna 400"""
        import sqlite3

        # Crear base de datos SQLite vacía
        temp_db = tmp_path / "empty.db"
        conn = sqlite3.connect(str(temp_db))
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE other_table (id INTEGER)")
        conn.commit()
        conn.close()

        # Subir archivo
        with open(temp_db, "rb") as f:
            response = client.post(
                "/api/database/import",
                files={"file": ("empty.db", f, "application/x-sqlite3")}
            )

        assert response.status_code == 400
        assert "no tiene las tablas requeridas" in response.json()["detail"]
