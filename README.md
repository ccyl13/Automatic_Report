<p align="center">
  <img src="https://github.com/ccyl13/Pentestify/blob/main/assets/images/pentestify.png?raw=true" alt="Pentestify Banner" width="100%">
</p>

<p align="center">
  <img src="logo.png" alt="Pentestify Logo" width="110" height="110" style="border-radius: 20px;">
</p>

<h1 align="center">Pentestify</h1>

<p align="center">
  <strong>Generador interactivo de reportes de pentesting.</strong><br>
  Registra vulnerabilidades, visualiza estadísticas de riesgo en tiempo real y exporta informes corporativos como HTML autocontenido o PDF (impresión nativa del navegador).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version 2.0.0">
  <img src="https://img.shields.io/badge/Maintyaned%3F-yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License MIT">
</p>

<p align="center">
  <strong>Versión actual: 2.0.0</strong>
</p>

## 🚀 Novedades de la 2.0.0

- **Sin Playwright/Chromium**: el informe se renderiza y exporta 100% en el navegador. Despliegue mucho más ligero (sin descargar navegadores).
  - **Exportar HTML**: documento HTML autocontenido (CSS incrustado e imágenes embebidas), se ve perfecto y se abre en cualquier navegador (estilo SysReptor).
  - **Generar PDF**: impresión nativa del navegador (Guardar como PDF) sobre la vista de impresión.
- **Estudio de temas a página completa**: personaliza *todas* las variables de estilo del informe con vista previa en vivo, y **guárdalo como un tema nuevo** en la app o **expórtalo** (JSON o plantilla HTML).
- **Vista previa con conmutador Renderizado / Código fuente** del informe.
- **Botón único “Exportar”** con menú (PDF / HTML).
- **Base de datos protegida con contraseña**: exportación cifrada (AES-256-GCM, cliente) desde *Mis Reportes*.
- **Todo se guarda en SQLite** (reportes, hallazgos, usuarios, temas, plantillas y *preferencias*: idioma, tema activo y opciones de PDF). Exportar la BD captura el 100% del estado.
- Arregla el desbordamiento del recuadro de PoC y el icono de eliminar usuario.

## ✨ Novedades de la 1.2.0

Esta versión convierte Pentestify en un generador de **informes de pentesting profesionales**:

### 🎨 Temas del informe basados en CSS (personalizables)
- Los estilos del informe ahora se controlan con **variables CSS** (`--rt-*`), no con colores incrustados en el código.
- Se mantienen los **3 temas de fábrica** (Claro, Oscuro, HTB).
- Los usuarios pueden **crear sus propios temas** con un editor visual (colores + vista previa en vivo), **aplicarlos**, **exportarlos** e **importarlos** como JSON, y eliminarlos. Gestor disponible en *Ajustes → Tema del informe*.

### 🛡️ Funcionalidades de informe profesional
- **Calculadora CVSS 3.1** interactiva: genera el vector, calcula el *base score* y deriva la severidad automáticamente.
- **Alcance y Metodología**: in-scope / out-of-scope, ventana del engagement, estándares aplicados (OWASP WSTG/Top 10, PTES, NIST 800-115, OSSTMM, MITRE ATT&CK…) y herramientas utilizadas.
- **Activos afectados** por hallazgo (host/URL/parámetro).
- **Estado del hallazgo** (abierto / remediado / riesgo aceptado / falso positivo) y **notas de re-test**.
- **Matriz de riesgo** Probabilidad × Impacto en el resumen ejecutivo.
- **IDs de hallazgo** (F-01, F-02…), **vector CVSS**, **categoría OWASP Top 10**, **referencias múltiples** y **mapeo de cumplimiento** (PCI-DSS, ISO 27001, MITRE…).
- **Historial de revisiones / control de versiones** del documento.
- Los nuevos campos se reflejan en la **vista previa** y en el **PDF** (incluidos los temas personalizados).

## 👥 Autores

<br>

<div align="center">
  <table>
    <tr>
      <td align="center" width="200">
        <a href="https://www.linkedin.com/in/maalfer1/" target="_blank">
          <img src="assets/images/el-pinguino-de-mario.webp" width="120" height="120" style="border-radius: 50%; border: 3px solid #9fef00;" alt="El Pingüino de Mario">
        </a>
        <br><br>
        <strong>El Pingüino de Mario</strong>
        <br>
        <a href="https://www.linkedin.com/in/maalfer1/" target="_blank">
          <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn">
        </a>
      </td>
      <td width="60"></td>
      <td align="center" width="200">
        <a href="https://www.linkedin.com/in/thomasoneil%C3%A1lvarez/" target="_blank">
          <img src="assets/images/thomas-oneil.webp" width="120" height="120" style="border-radius: 50%; border: 3px solid #9fef00;" alt="Thomas O'neil">
        </a>
        <br><br>
        <strong>Thomas O'neil Álvarez</strong>
        <br>
        <a href="https://www.linkedin.com/in/thomasoneil%C3%A1lvarez/" target="_blank">
          <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn">
        </a>
      </td>
    </tr>
  </table>
</div>

<br>

## Estructura del Proyecto

```
Pentestify/
├── index.html              # Frontend SPA
├── run.py                  # Script para iniciar el servidor
├── requirements.txt        # Dependencias Python
├── Dockerfile              # Imagen Docker
├── css/
│   └── styles.css          # Estilos CSS vanilla
├── js/
│   └── app.js              # Aplicación Vanilla JavaScript
├── assets/                 # Imágenes y recursos estáticos
└── backend/                # API FastAPI
    ├── main.py             # Endpoints y lógica principal
    ├── models.py           # Modelos SQLAlchemy
    ├── schemas.py          # Esquemas Pydantic
    ├── database.py         # Configuración SQLite
    ├── migrations.py       # Migraciones de base de datos
    └── tests/              # Tests pytest
        ├── conftest.py
        ├── test_api_info.py
        ├── test_reports.py
        ├── test_findings.py
        ├── test_findings_reorder.py
        ├── test_findings_delete_reorder.py
        ├── test_pdf_export.py
        ├── test_database_io.py
        └── test_static_files.py
```

## 🐳 Instalación y Uso (Docker - Recomendado)

Docker es la forma **más rápida y sencilla** de ejecutar Pentestify. Desde la v2.0.0 la imagen es ligera: ya no incluye navegadores, porque la exportación a HTML/PDF se hace en el navegador del usuario.

### Comando rápido (copiar y pegar)

```bash
# 1. Construir imagen
docker build -t pentestify:latest .

# 2. Ejecutar contenedor
docker run -d \
  -p 8000:8000 \
  -v pentestify_data:/app/data \
  --name pentestify \
  pentestify:latest
```

El servidor estará disponible en: `http://localhost:8000`

---

## 🖥️ Instalación Manual (Sin Docker)

Si prefieres no usar Docker, puedes instalar manualmente:

### 1. Instalar dependencias del backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 run.py
```

El servidor estará disponible en: `http://localhost:8000`

---

## Base de Datos

Los datos se almacenan en `pentestify.db` (SQLite) con dos tablas:

- **reports** - Datos generales del reporte (cliente, fecha, etc.)
- **findings** - Vulnerabilidades asociadas a cada reporte

## Funcionalidades de Persistencia

### Guardado automático
- Los datos del reporte se guardan automáticamente 2 segundos después de cada cambio
- Los hallazgos se guardan inmediatamente al agregarlos

### Mis Reportes
- Desde el navbar puedes acceder a "Mis Reportes"
- Lista todos los reportes guardados con su fecha y número de hallazgos
- Clic para cargar un reporte existente
- Botón para eliminar reportes permanentemente

### Nuevo Reporte
- Desde "Mis Reportes" puedes crear reportes nuevos
- Cada reporte es independiente con sus propios hallazgos

## Testing

Pentestify incluye una suite completa de tests para garantizar que todas las funcionalidades funcionen correctamente.

### Ejecutar todos los tests

```bash
# Desde la raíz del proyecto
python -m pytest backend/tests/ -v

# O desde el directorio backend
cd backend
python -m pytest tests/ -v
```

### Tests específicos

```bash
# Solo tests de reportes
python -m pytest backend/tests/test_reports.py -v

# Solo tests de hallazgos
python -m pytest backend/tests/test_findings.py -v

# Tests con cobertura
python -m pytest backend/tests/ -v --cov=backend --cov-report=html
```

### Antes de hacer git push

**Recomendación:** Ejecutar siempre los tests antes de subir cambios:

```bash
python -m pytest backend/tests/ -v
```

La suite de tests incluye:
- **API Info**: Verificación de endpoints básicos
- **Reportes**: CRUD completo de reportes
- **Hallazgos**: CRUD y reordenamiento de hallazgos
- **Reordenamiento**: Tests específicos para orden de hallazgos
- **Ajustes**: Preferencias globales persistidas en la BD
- **Base de Datos**: Import/export de backups SQLite
- **Archivos Estáticos**: CSS, JS y assets

## Tecnologías

Pentestify está construido sobre un stack moderno y eficiente que equilibra el rendimiento de un backend asíncrono con la ligereza de un frontend SPA, garantizando reportes rápidos y una persistencia de datos robusta.

<br>

| Innovación Tecnológica | Capacidades Clave | Función y Valor de UX |
| :--- | :--- | :--- |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/HTML.svg" height="60" alt="Frontend Icon"> **FRONTEND**<br>*SPA Ultraligera* | <ul><li>**Vanilla JavaScript** (ES6+)</li><li>**Pure CSS** (Vanilla)</li><li>**Inter Font Family** (Optimized)</li></ul> | **Experiencia de Usuario Fluida**.<br>Navegación instantánea de página única (SPA) sin recargas. El diseño limpio y la tipografía optimizada aseguran la legibilidad durante largas sesiones de auditoría. Sin frameworks pesados. |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/FastAPI.svg" height="60" alt="Backend Icon"> **BACKEND**<br>*API Asíncrona* | <ul><li>**FastAPI**</li><li>**Python 3.x**</li><li>**Uvicorn** / **Gunicorn**</li></ul> | **Rendimiento Asíncrono**. <br>Manejo eficiente de múltiples peticiones simultáneas, garantizando que el guardado automático de reportes y hallazgos sea imperceptible para el auditor. |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/SQLite.svg" height="60" alt="Database Icon"> **PERSISTENCIA**<br>*Datos Relacionales* | <ul><li>**SQLite**</li><li>**SQLAlchemy** (ORM)</li><li>**Pydantic**</li></ul> | **Tus Datos Seguros y Estructurados**.<br>Persistencia local robusta en `pentestify.db`. SQLAlchemy gestiona los datos, mientras Pydantic asegura que cada vulnerabilidad y reporte cumpla con el esquema corporativo. |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Docker.svg" height="60" alt="Docker Icon"> **DESPLIEGUE**<br>*Infraestructura* | <ul><li>**Docker**</li><li>**Docker Compose**</li><li>Python `http.server`</li></ul> | **Portabilidad Instantánea**.<br>Ejecuta Pentestify en cualquier entorno (Windows, Linux, macOS) con un solo comando, aislando dependencias y protegiendo la integridad de la base de datos mediante volúmenes. |

