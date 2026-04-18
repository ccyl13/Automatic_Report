"""
Migrations module for Pentestify database.
Handles incremental schema updates for existing databases.
"""
from sqlalchemy import text


def run_migrations(engine):
    """Run all pending migrations."""
    _migrate_add_auditor_contact_fields(engine)
    _migrate_add_theme_field(engine)


def _migrate_add_auditor_contact_fields(engine):
    """Migration: Add auditor_phone and auditor_email columns to reports table."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(reports)"))
            columns = [row[1] for row in result]

            if 'auditor_phone' not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN auditor_phone VARCHAR"))
                conn.commit()
                print("✅ Columna auditor_phone agregada")

            if 'auditor_email' not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN auditor_email VARCHAR"))
                conn.commit()
                print("✅ Columna auditor_email agregada")
    except Exception as e:
        print(f"⚠️  Migración de contacto del auditor: {e}")


def _migrate_add_theme_field(engine):
    """Migration: Add theme column to reports table."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(reports)"))
            columns = [row[1] for row in result]

            if 'theme' not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN theme VARCHAR DEFAULT 'corporate'"))
                conn.commit()
                print("✅ Columna theme agregada")
    except Exception as e:
        print(f"⚠️  Migración de tema: {e}")
