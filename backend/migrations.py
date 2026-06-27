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
    _migrate_add_theme_custom_css(engine)
    _migrate_add_exploit_field(engine)
    _migrate_add_show_scope_section(engine)
    _migrate_create_api_keys(engine)


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
    """Migration: campos de informe profesional (alcance, metodología, historial).

    Nota: el tema del informe es un ajuste GLOBAL (tabla settings.report_theme),
    no por reporte. La antigua columna reports.report_theme quedó obsoleta; las
    BD existentes pueden conservarla sin efecto (el modelo ya no la declara)."""
    _add_columns(engine, "reports", [
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


def _migrate_add_theme_custom_css(engine):
    """Migration: columna custom_css en themes (CSS libre del usuario)."""
    # La tabla themes puede no existir aún en bases muy antiguas; create_all la
    # crea con la columna, así que aquí solo cubrimos bases que ya la tenían.
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(themes)"))
            existing = [row[1] for row in result]
            if existing and 'custom_css' not in existing:
                conn.execute(text("ALTER TABLE themes ADD COLUMN custom_css TEXT DEFAULT ''"))
                conn.commit()
                print("✅ Columna custom_css agregada a themes")
    except Exception as e:
        print(f"⚠️  Migración custom_css: {e}")


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


def _migrate_add_exploit_field(engine):
    """Migration: campo exploit (fragmento de código) en findings y plantillas."""
    _add_columns(engine, "findings", [
        ("exploit", "TEXT DEFAULT ''"),
    ])
    # finding_templates puede no existir en bases antiguas; create_all la crea con
    # la columna, así que sólo cubrimos bases que ya tenían la tabla.
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(finding_templates)"))
            existing = [row[1] for row in result]
            if existing and 'exploit' not in existing:
                conn.execute(text("ALTER TABLE finding_templates ADD COLUMN exploit TEXT DEFAULT ''"))
                conn.commit()
                print("✅ Columna exploit agregada a finding_templates")
    except Exception as e:
        print(f"⚠️  Migración exploit (templates): {e}")


def _migrate_add_show_scope_section(engine):
    """Migration: campo show_scope_section + scope_fields_visibility para control granular de sección alcance."""
    _add_columns(engine, "reports", [
        ("show_scope_section", "INTEGER DEFAULT 1"),
        ("scope_fields_visibility", "TEXT DEFAULT '{}'"),
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


def _migrate_create_api_keys(engine):
    """Migration: crea la tabla api_keys para acceso programático (agentes IA / MCP)."""
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS api_keys (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    label       VARCHAR NOT NULL DEFAULT 'Agent Key',
                    key_hash    VARCHAR NOT NULL UNIQUE,
                    prefix      VARCHAR NOT NULL,
                    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_used_at DATETIME
                )
            """))
            conn.commit()
    except Exception as e:
        print(f"⚠️  Migración api_keys: {e}")
