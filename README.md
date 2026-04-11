# Pentestify

Generador interactivo de reportes de pentesting que permite registrar vulnerabilidades (con plantillas predefinidas o manualmente), visualizar estadísticas de riesgo en tiempo real, **guardar reportes en base de datos** y exportar informes corporativos estructurados en formato PDF.

## Características

- 📝 **Persistencia de datos** - Guarda tus reportes en SQLite para continuar después
- 🌐 **Sistema bilingüe** - Español/Inglés
- 📊 **Estadísticas de riesgo** - Visualización en tiempo real de criticidad
- 🎯 **14 plantillas de vulnerabilidades** - SQLi, XSS, IDOR, SSRF, CSRF, XXE, RCE, LFI, CORS, etc.
- 📄 **Exportación PDF** - Genera reportes profesionales
- 🖼️ **Evidencias gráficas** - Soporta múltiples imágenes en base64

## Estructura del Proyecto

```
Automatic_Report/
├── index.html              # Frontend React
├── Dockerfile              # Imagen Docker
├── css/
│   └── styles.css          # Estilos CSS vanilla
├── js/
│   ├── services/
│   │   └── api.js          # Cliente API
│   ├── components/
│   │   ├── Icons.js
│   │   ├── SplashScreen.js
│   │   └── App.js          # Componente principal con persistencia
│   ├── data/
│   │   ├── i18n.js         # Traducciones
│   │   ├── templates.js    # Plantillas de vulnerabilidades
│   │   └── authors.js
│   └── config/
│       └── constants.js
└── backend/                # API FastAPI
    ├── main.py
    ├── models.py
    ├── schemas.py
    ├── database.py
    ├── requirements.txt
    └── tests/                # Tests pytest
        ├── conftest.py
        ├── test_reports.py
        └── test_findings.py
```

## Instalación y Uso

### 1. Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Iniciar el servidor backend

```bash
# Desde la carpeta backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# O ejecutar directamente
python main.py
```

El servidor estará disponible en: `http://localhost:8000`

### 3. Iniciar el frontend

Usa cualquier servidor estático para servir los archivos. Por ejemplo:

```bash
# Desde la raíz del proyecto
python -m http.server 8000
```

Abre en tu navegador: `http://localhost:8000`

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

- **Frontend**: React 18 (CDN), CSS Vanilla, Inter Font
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Base de datos**: SQLite
- **Build**: Python http.server (frontend), Uvicorn (backend)

## Autores

- El Pingüino de Mario
- Manuel Martínez
- Thomas O'neil Álvarez
