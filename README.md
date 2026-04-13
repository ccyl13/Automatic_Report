<p align="center">
  <img src="https://github.com/ccyl13/Pentestify/blob/main/assets/images/pentestify.png?raw=true" alt="Pentestify Banner" width="100%">
</p>

# Pentestify

<p align="center">
  <strong>Generador interactivo de reportes de pentesting.</strong><br>
  Registra vulnerabilidades, visualiza estadísticas de riesgo en tiempo real y exporta informes corporativos estruturados en PDF.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Maintyaned%3F-yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License MIT">
</p>

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
    └── tests/              # Tests pytest
        ├── conftest.py
        ├── test_reports.py
        └── test_findings.py
```

## Instalación y Uso

### 1. Instalar dependencias del backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 run.py
```

El servidor estará disponible en: `http://localhost:8000`

---

## 🐳 Docker (Recomendado)

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

## Tecnologías

Pentestify está construido sobre un stack moderno y eficiente que equilibra el rendimiento de un backend asíncrono con la ligereza de un frontend SPA, garantizando reportes rápidos y una persistencia de datos robusta.

<br>

| Innovación Tecnológica | Capacidades Clave | Función y Valor de UX |
| :--- | :--- | :--- |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/HTML.svg" height="60" alt="Frontend Icon"> **FRONTEND**<br>*SPA Ultraligera* | <ul><li>**Vanilla JavaScript** (ES6+)</li><li>**Pure CSS** (Vanilla)</li><li>**Inter Font Family** (Optimized)</li></ul> | **Experiencia de Usuario Fluida**.<br>Navegación instantánea de página única (SPA) sin recargas. El diseño limpio y la tipografía optimizada aseguran la legibilidad durante largas sesiones de auditoría. Sin frameworks pesados. |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/FastAPI.svg" height="60" alt="Backend Icon"> **BACKEND**<br>*API Asíncrona* | <ul><li>**FastAPI**</li><li>**Python 3.x**</li><li>**Uvicorn** / **Gunicorn**</li></ul> | **Rendimiento Asíncrono**. <br>Manejo eficiente de múltiples peticiones simultáneas, garantizando que el guardado automático de reportes y hallazgos sea imperceptible para el auditor. |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/SQLite.svg" height="60" alt="Database Icon"> **PERSISTENCIA**<br>*Datos Relacionales* | <ul><li>**SQLite**</li><li>**SQLAlchemy** (ORM)</li><li>**Pydantic**</li></ul> | **Tus Datos Seguros y Estructurados**.<br>Persistencia local robusta en `pentestify.db`. SQLAlchemy gestiona los datos, mientras Pydantic asegura que cada vulnerabilidad y reporte cumpla con el esquema corporativo. |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Docker.svg" height="60" alt="Docker Icon"> **DESPLIEGUE**<br>*Infraestructura* | <ul><li>**Docker**</li><li>**Docker Compose**</li><li>Python `http.server`</li></ul> | **Portabilidad Instantánea**.<br>Ejecuta Pentestify en cualquier entorno (Windows, Linux, macOS) con un solo comando, aislando dependencias y protegiendo la integridad de la base de datos mediante volúmenes. |

<br>

## Autores

- El Pingüino de Mario
- Manuel Martínez
- Thomas O'neil Álvarez
