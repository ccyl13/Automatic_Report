"""
Migrations module for Pentestify database.
Handles incremental schema updates for existing databases.
"""
from sqlalchemy import text


def run_migrations(engine):
    """Run all pending migrations."""
    _migrate_add_auditor_contact_fields(engine)
    _migrate_add_theme_field(engine)
    _migrate_add_tlp_fields(engine)
    _migrate_add_cwe_field(engine)
    _migrate_add_pro_report_fields(engine)
    _migrate_add_pro_finding_fields(engine)


def _add_columns(engine, table, columns):
    """Añade columnas que falten a `table`. `columns` = [(name, ddl_type_default), ...]."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(f"PRAGMA table_info({table})"))
            existing = [row[1] for row in result]
            for name, ddl in columns:
                if name not in existing:
                    # Identificador entre comillas: algunos nombres (p.ej. references)
                    # son palabras reservadas de SQLite.
                    conn.execute(text(f'ALTER TABLE {table} ADD COLUMN "{name}" {ddl}'))
                    conn.commit()
                    print(f"✅ Columna {name} agregada a {table}")
    except Exception as e:
        print(f"⚠️  Migración {table}: {e}")


def _migrate_add_pro_report_fields(engine):
    """Migration: campos de informe profesional (alcance, metodología, tema, historial)."""
    _add_columns(engine, "reports", [
        ("report_theme", "VARCHAR DEFAULT 'light'"),
        ("audit_type", "VARCHAR DEFAULT 'pentesting_web'"),
        ("scope_in", "TEXT DEFAULT ''"),
        ("scope_out", "TEXT DEFAULT ''"),
        ("methodology_notes", "TEXT DEFAULT ''"),
        ("methodology_standards", "TEXT DEFAULT '[]'"),
        ("tools_used", "TEXT DEFAULT ''"),
        ("engagement_start", "VARCHAR DEFAULT ''"),
        ("engagement_end", "VARCHAR DEFAULT ''"),
        ("revision_history", "TEXT DEFAULT '[]'"),
    ])


def _migrate_add_pro_finding_fields(engine):
    """Migration: campos de hallazgo profesional (estado, vector, activos, riesgo)."""
    _add_columns(engine, "findings", [
        ("cvss_vector", "VARCHAR DEFAULT ''"),
        ("references", "TEXT DEFAULT '[]'"),
        ("status", "VARCHAR DEFAULT 'open'"),
        ("affected_assets", "TEXT DEFAULT ''"),
        ("likelihood", "VARCHAR DEFAULT ''"),
        ("impact_rating", "VARCHAR DEFAULT ''"),
        ("owasp", "VARCHAR DEFAULT ''"),
        ("compliance", "TEXT DEFAULT '[]'"),
        ("retest_notes", "TEXT DEFAULT ''"),
    ])


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


def _migrate_add_tlp_fields(engine):
    """Migration: Add tlp_level and classification_mode columns to reports table."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(reports)"))
            columns = [row[1] for row in result]

            if 'tlp_level' not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN tlp_level VARCHAR DEFAULT 'amber'"))
                conn.commit()
                print("✅ Columna tlp_level agregada")

            if 'classification_mode' not in columns:
                conn.execute(text("ALTER TABLE reports ADD COLUMN classification_mode VARCHAR DEFAULT 'internal'"))
                conn.commit()
                print("✅ Columna classification_mode agregada")
    except Exception as e:
        print(f"⚠️  Migración de TLP: {e}")


def _migrate_add_cwe_field(engine):
    """Migration: Add cwe column to findings table (MITRE CWE reference)."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(findings)"))
            columns = [row[1] for row in result]

            if 'cwe' not in columns:
                conn.execute(text("ALTER TABLE findings ADD COLUMN cwe VARCHAR DEFAULT ''"))
                conn.commit()
                print("✅ Columna cwe agregada a findings")
    except Exception as e:
        print(f"⚠️  Migración de CWE: {e}")
