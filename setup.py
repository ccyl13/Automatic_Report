#!/usr/bin/env python3
"""
Script de configuración para Pentestify.
Instala las dependencias y los navegadores necesarios para Playwright.
"""

import subprocess
import sys
import os

def run_command(cmd, description):
    print(f"\n📦 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completado")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}:")
        print(e.stderr or e.stdout)
        return False

def main():
    print("=" * 60)
    print("🔧 Configuración de Pentestify")
    print("=" * 60)
    
    if not run_command(f"{sys.executable} -m pip install -r requirements.txt", 
                       "Instalando dependencias Python"):
        print("\n⚠️  Error instalando dependencias. Intenta manualmente:")
        print(f"   {sys.executable} -m pip install -r requirements.txt")
        return 1
    
    if not run_command("playwright install chromium", 
                       "Instalando navegador Chromium para Playwright"):
        print("\n⚠️  Error instalando navegadores. Intenta manualmente:")
        print("   playwright install chromium")
        return 1
    
    print("\n" + "=" * 60)
    print("✅ Configuración completada exitosamente!")
    print("=" * 60)
    print("\n🚀 Para iniciar la aplicación:")
    print("   python run.py")
    print("\n📖 Documentación:")
    print("   - Backend API: http://localhost:8000/api")
    print("   - Frontend: http://localhost:8000")
    print("\n" + "=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(main())
