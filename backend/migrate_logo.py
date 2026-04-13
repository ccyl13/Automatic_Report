"""
Script de migración para convertir client_logo de TEXT a JSON
sin perder datos existentes.
"""
import sqlite3
import os
import json
from database import db_path

def migrate_client_logo():
    """Migra la columna client_logo de TEXT a JSON"""
    
    if not os.path.exists(db_path):
        print(f"Base de datos no encontrada en {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Limpiar tablas temporales si existen de ejecuciones previas fallidas
    cursor.execute("DROP TABLE IF EXISTS reports_new")
    
    # Verificar si existe la tabla reports
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='reports'")
    if not cursor.fetchone():
        print("Tabla 'reports' no existe")
        conn.close()
        return
    
    # Obtener información de las columnas actuales
    cursor.execute("PRAGMA table_info(reports)")
    columns = cursor.fetchall()
    
    # Verificar el tipo actual de client_logo
    client_logo_col = None
    for col in columns:
        if col[1] == 'client_logo':
            client_logo_col = col
            break
    
    if not client_logo_col:
        print("Columna client_logo no encontrada")
        conn.close()
        return
    
    print(f"Columna client_logo encontrada con tipo: {client_logo_col[2]}")
    
    # Si ya es JSON, no hacer nada
    if client_logo_col[2].upper() == 'JSON':
        print("La columna ya es tipo JSON. No se requiere migración.")
        conn.close()
        return
    
    # Paso 1: Crear tabla temporal con la nueva estructura
    print("Creando tabla temporal...")
    cursor.execute("""
        CREATE TABLE reports_new (
            id INTEGER PRIMARY KEY,
            document_title TEXT DEFAULT 'Reporte Técnico de Vulnerabilidades',
            client_company TEXT DEFAULT 'Empresa Cliente S.A.',
            target_asset TEXT DEFAULT 'Aplicación Principal',
            auditor_company TEXT DEFAULT 'Empresa Auditora LLC',
            auditor_name TEXT DEFAULT 'Juan Pérez',
            classification INTEGER DEFAULT 2,
            version TEXT DEFAULT '1.0',
            date TEXT,
            lang TEXT DEFAULT 'es',
            client_logo TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Paso 2: Migrar datos
    print("Migrando datos...")
    cursor.execute("SELECT * FROM reports")
    reports = cursor.fetchall()
    
    # Obtener nombres de columnas
    cursor.execute("PRAGMA table_info(reports)")
    old_columns = [col[1] for col in cursor.fetchall()]
    
    for report in reports:
        # Crear diccionario con los datos
        report_dict = dict(zip(old_columns, report))
        
        # Convertir client_logo a array JSON
        old_logo = report_dict.get('client_logo', '')
        if old_logo and old_logo.strip():
            # Si había un logo, ponerlo en la primera posición
            new_logo = json.dumps([old_logo, ''])
        else:
            # Si no había logo, array vacío
            new_logo = json.dumps(['', ''])
        
        # Insertar en nueva tabla
        cursor.execute("""
            INSERT INTO reports_new (
                id, document_title, client_company, target_asset,
                auditor_company, auditor_name, classification,
                version, date, lang, client_logo, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            report_dict.get('id'),
            report_dict.get('document_title', 'Reporte Técnico de Vulnerabilidades'),
            report_dict.get('client_company', 'Empresa Cliente S.A.'),
            report_dict.get('target_asset', 'Aplicación Principal'),
            report_dict.get('auditor_company', 'Empresa Auditora LLC'),
            report_dict.get('auditor_name', 'Juan Pérez'),
            report_dict.get('classification', 2),
            report_dict.get('version', '1.0'),
            report_dict.get('date', ''),
            report_dict.get('lang', 'es'),
            new_logo,
            report_dict.get('created_at', 'CURRENT_TIMESTAMP'),
            report_dict.get('updated_at', 'CURRENT_TIMESTAMP')
        ))
    
    print(f"Migrados {len(reports)} reportes")
    
    # Paso 3: Guardar findings temporalmente
    print("Preservando hallazgos...")
    cursor.execute("SELECT * FROM findings")
    findings = cursor.fetchall()
    
    cursor.execute("PRAGMA table_info(findings)")
    finding_cols = [col[1] for col in cursor.fetchall()]
    
    # Paso 4: Eliminar tablas antiguas
    print("Reemplazando tabla...")
    cursor.execute("DROP TABLE IF EXISTS findings")
    cursor.execute("DROP TABLE reports")
    cursor.execute("ALTER TABLE reports_new RENAME TO reports")
    
    # Paso 5: Recrear tabla findings
    print("Recreando tabla findings...")
    cursor.execute("""
        CREATE TABLE findings (
            id INTEGER PRIMARY KEY,
            report_id INTEGER REFERENCES reports(id),
            template_key TEXT DEFAULT 'custom',
            title TEXT NOT NULL,
            severity TEXT DEFAULT 'med',
            description TEXT DEFAULT '',
            cvss TEXT DEFAULT '',
            poc TEXT DEFAULT '',
            impact TEXT DEFAULT '',
            remediation TEXT DEFAULT '',
            reference TEXT DEFAULT '',
            cve TEXT DEFAULT '',
            images TEXT DEFAULT '[]',
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Restaurar findings
    for finding in findings:
        finding_dict = dict(zip(finding_cols, finding))
        cursor.execute("""
            INSERT INTO findings (
                id, report_id, template_key, title, severity,
                description, cvss, poc, impact, remediation,
                reference, cve, images, order_index, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            finding_dict.get('id'),
            finding_dict.get('report_id'),
            finding_dict.get('template_key', 'custom'),
            finding_dict.get('title'),
            finding_dict.get('severity', 'med'),
            finding_dict.get('description', ''),
            finding_dict.get('cvss', ''),
            finding_dict.get('poc', ''),
            finding_dict.get('impact', ''),
            finding_dict.get('remediation', ''),
            finding_dict.get('reference', ''),
            finding_dict.get('cve', ''),
            finding_dict.get('images', '[]'),
            finding_dict.get('order_index', 0),
            finding_dict.get('created_at'),
            finding_dict.get('updated_at')
        ))
    
    print(f"Restaurados {len(findings)} hallazgos")
    
    conn.commit()
    conn.close()
    
    print("✅ Migración completada exitosamente!")
    print("Los datos se han preservado y client_logo ahora es tipo JSON.")

if __name__ == "__main__":
    migrate_client_logo()
