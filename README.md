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
python -m http.server 8080
```

Abre en tu navegador: `http://localhost:8080`

---

## 🐳 Docker (Recomendado)

### Comando rápido (copiar y pegar)

```bash
# 1. Construir imagen
docker build -t pentestify:latest .

# 2. Crear directorio para persistir datos
mkdir -p data

# 3. Ejecutar contenedor
docker run -d \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  --name pentestify \
  pentestify:latest
```

### Comandos útiles

```bash
# Ver logs
docker logs -f pentestify

# Detener contenedor
docker stop pentestify

# Iniciar contenedor detenido
docker start pentestify

# Eliminar contenedor (datos se mantienen en ./data/)
docker stop pentestify && docker rm pentestify

# Eliminar todo incluyendo imagen
docker stop pentestify && docker rm pentestify && docker rmi pentestify:latest
```

### Persistencia de datos

La base de datos SQLite se guarda en el directorio local `./data/` gracias al volumen montado (`-v $(pwd)/data:/app/data`). Los datos persisten incluso si eliminas y recreas el contenedor.

### Acceder a la aplicación Dockerizada

- API: `http://localhost:8000`
- API Docs (Swagger): `http://localhost:8000/docs`
- API Docs (ReDoc): `http://localhost:8000/redoc`

---

## 🧪 Testing

### Ejecutar tests del backend

```bash
cd backend

# Instalar dependencias (incluye pytest)
pip install -r requirements.txt

# Ejecutar todos los tests
pytest tests/

# Ejecutar con verbose
pytest tests/ -v

# Ejecutar tests específicos
pytest tests/test_reports.py -v
pytest tests/test_findings.py -v

# Ver cobertura
pytest tests/ --cov=.
```

### Tests incluidos

- **test_reports.py**: 11 tests para CRUD de reportes
- **test_findings.py**: 15 tests para hallazgos

### Ejecutar tests en Docker

```bash
# Construir imagen de desarrollo con tests
docker build -t pentestify:test .

# Ejecutar tests
docker run --rm pentestify:test pytest backend/tests/ -v
```

---

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reports` | Listar todos los reportes |
| POST | `/api/reports` | Crear nuevo reporte |
| GET | `/api/reports/{id}` | Obtener reporte con hallazgos |
| PUT | `/api/reports/{id}` | Actualizar reporte |
| DELETE | `/api/reports/{id}` | Eliminar reporte |
| GET | `/api/reports/{id}/findings` | Listar hallazgos del reporte |
| POST | `/api/reports/{id}/findings` | Agregar hallazgo |
| PUT | `/api/findings/{id}` | Actualizar hallazgo |
| DELETE | `/api/findings/{id}` | Eliminar hallazgo |

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
