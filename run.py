#!/usr/bin/env python3
"""
Script para iniciar Pentestify en local.

Uso:
    python run.py              # Iniciar en http://localhost:8000
    python run.py --port 8080  # Iniciar en puerto custom
    python run.py --reload     # Modo desarrollo con auto-reload

Este script:
1. Activa el entorno virtual si existe
2. Inicia el servidor FastAPI con el frontend servido estáticamente
3. Configura los paths correctos para css/, js/, assets/
"""

import sys
import os
import subprocess
import argparse

def find_venv_python():
    venv_paths = [
        "backend/venv/bin/python",
        "backend/venv/Scripts/python.exe",
        ".venv/bin/python",
        ".venv/Scripts/python.exe",
    ]
    
    for path in venv_paths:
        if os.path.exists(path):
            return path
    return sys.executable

def check_playwright():
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            try:
                browser = p.chromium.launch()
                browser.close()
                return True, None
            except Exception as e:
                error_msg = str(e)
                if "Executable doesn't exist" in error_msg:
                    return False, "playwright install chromium"
                return False, str(e)
    except ImportError:
        return False, "pip install playwright"
    except Exception as e:
        return False, str(e)

def main():
    parser = argparse.ArgumentParser(description="Iniciar Pentestify")
    parser.add_argument("--port", type=int, default=8000, help="Puerto (default: 8000)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host (default: 0.0.0.0)")
    parser.add_argument("--reload", action="store_true", help="Modo desarrollo con auto-reload")
    args = parser.parse_args()

    if not os.path.exists("index.html"):
        print("❌ Error: No se encontró index.html")
        print("   Asegúrate de ejecutar este script desde el directorio raíz del proyecto")
        print("   Ejemplo: cd /Users/mario/Desktop/Automatic_Report && python run.py")
        sys.exit(1)

    if not os.path.exists("backend/main.py"):
        print("❌ Error: No se encontró backend/main.py")
        sys.exit(1)

    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.join(os.getcwd(), "backend")
    
    python_exec = find_venv_python()
    
    print("🔍 Verificando dependencias...")
    playwright_ok, playwright_error = check_playwright()
    
    cmd = [
        python_exec, "-m", "uvicorn",
        "backend.main:app",
        "--host", args.host,
        "--port", str(args.port),
    ]
    
    if args.reload:
        cmd.append("--reload")
        cmd.extend(["--reload-dir", "backend"])
    
    print("=" * 60)
    print("🚀 Iniciando Pentestify...")
    print("=" * 60)
    print(f"📁 Directorio: {os.getcwd()}")
    print(f"🐍 Python: {python_exec}")
    print(f"🌐 URL: http://localhost:{args.port}")
    print(f"📚 API Docs: http://localhost:{args.port}/docs")
    if args.reload:
        print("⚡ Modo desarrollo (auto-reload activado)")
    
    if not playwright_ok:
        print()
        print("⚠️  ADVERTENCIA: Playwright no está configurado correctamente")
        print(f"   Error: {playwright_error}")
        print()
        print("   Para solucionarlo, ejecuta uno de estos comandos:")
        print(f"   1. {playwright_error}")
        print("   2. python setup.py")
        print()
        print("   El servidor funcionará, pero la generación de PDFs desde el backend")
        print("   fallará. Puedes usar el botón 'Generar PDF' del frontend como alternativa.")
    else:
        print("✅ Playwright configurado correctamente")
    
    print("=" * 60)
    print()
    
    try:
        subprocess.run(cmd, env=env, check=True)
    except KeyboardInterrupt:
        print("\n\n👋 Servidor detenido")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error al iniciar el servidor: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
