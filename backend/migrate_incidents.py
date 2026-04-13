"""
Script de migración para añadir columnas has_incidents e incidents_text
a la base de datos existente sin perder datos.
"""
import sqlite3
import os
import sys

# Determinar directorio base
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if not os.path.exists(os.path.join(BASE_DIR, "index.html")):
    BASE_DIR = os.getcwd()

data_dir = os.path.join(BASE_DIR, "data")
db_path = os.path.join(data_dir, "pentestify.db")

def migrate_incidents():
    """Añade columnas has_incidents e incidents_text si no existen"""
    
    if not os.path.exists(db_path):
        print(f"Base de datos no encontrada en {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Verificar si existe la tabla reports
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='reports'")
    if not cursor.fetchone():
        print("Tabla 'reports' no existe")
        conn.close()
        return False
    
    # Obtener información de las columnas actuales
    cursor.execute("PRAGMA table_info(reports)")
    columns = cursor.fetchall()
    column_names = [col[1] for col in columns]
    
    print(f"Columnas actuales: {column_names}")
    
    # Añadir has_incidents si no existe
    if 'has_incidents' not in column_names:
        print("Añadiendo columna has_incidents...")
        cursor.execute("ALTER TABLE reports ADD COLUMN has_incidents INTEGER DEFAULT 0")
        print("✓ Columna has_incidents añadida")
    else:
        print("Columna has_incidents ya existe")
    
    # Añadir incidents_text si no existe
    if 'incidents_text' not in column_names:
        print("Añadiendo columna incidents_text...")
        cursor.execute("ALTER TABLE reports ADD COLUMN incidents_text TEXT DEFAULT ''")
        print("✓ Columna incidents_text añadida")
    else:
        print("Columna incidents_text ya existe")
    
    conn.commit()
    conn.close()
    print("\n✓ Migración completada exitosamente")
    return True

if __name__ == "__main__":
    success = migrate_incidents()
    sys.exit(0 if success else 1)
