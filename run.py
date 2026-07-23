#!/usr/bin/env python3
"""
Script para iniciar Pentestify en local.

Uso:
    python run.py              # Iniciar en http://localhost:8000
    python run.py --port 8080  # Iniciar en puerto custom
    python run.py --reload     # Modo desarrollo con auto-reload

Este script:
1. Usa el entorno virtual si existe
2. Inicia el servidor FastAPI con el frontend servido estáticamente
3. Configura los paths correctos para css/, js/, assets/

Nota: desde la v2.0.0 la exportación a HTML/PDF es 100% en el navegador, por lo
que no se necesita Playwright ni Chromium.
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


def main():
    parser = argparse.ArgumentParser(description="Iniciar Pentestify")
    parser.add_argument("--port", type=int, default=8000, help="Puerto (default: 8000)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host (default: 0.0.0.0)")
    parser.add_argument("--reload", action="store_true", help="Modo desarrollo con auto-reload")
    args = parser.parse_args()

    if not os.path.exists("index.html"):
        print("❌ Error: No se encontró index.html")
        print("   Asegúrate de ejecutar este script desde el directorio raíz del proyecto")
        sys.exit(1)

    if not os.path.exists("backend/main.py"):
        print("❌ Error: No se encontró backend/main.py")
        sys.exit(1)

    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.join(os.getcwd(), "backend")
    # Por defecto no confiamos en X-Forwarded-For de ninguna IP.
    # Para despliegues detrás de un proxy de confianza, el admin debe configurar
    # explícitamente: FORWARDED_ALLOW_IPS=<ip_del_proxy>
    if "FORWARDED_ALLOW_IPS" not in env:
        env["FORWARDED_ALLOW_IPS"] = ""

    python_exec = find_venv_python()

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
