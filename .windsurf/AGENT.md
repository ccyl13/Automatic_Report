# Pentestify - Contexto para Agentes AI

## Descripción del Proyecto

Pentestify es un generador de reportes de pentesting profesionales con:
- **Frontend**: SPA Vanilla JavaScript (ES6+) sin frameworks
- **Backend**: FastAPI + SQLite + SQLAlchemy
- **Exportación**: PDF generado con Playwright
- **Persistencia**: Base de datos SQLite con import/export

## Arquitectura

```
Pentestify/
├── index.html              # Punto de entrada SPA
├── js/app.js               # ~1800 líneas de Vanilla JS
├── js/plantillas.json      # Plantillas de vulnerabilidades (es/en)
├── css/styles.css          # Estilos CSS vanilla
├── backend/
│   ├── main.py             # Endpoints FastAPI
│   ├── models.py           # Modelos SQLAlchemy
│   ├── schemas.py          # Esquemas Pydantic
│   ├── database.py         # Configuración SQLite
│   ├── migrations.py       # Migraciones de BD
│   └── tests/              # Tests pytest (43 tests)
└── assets/                 # Imágenes y recursos
```

## Convenciones de Código

### JavaScript (Frontend)

1. **Estado global centralizado** (`state` object):
   ```javascript
   const state = {
       lang: 'es',
       activeTab: 'editor',
       auditData: {...},
       findings: [],
       currentFinding: {...}
   };
   ```

2. **Sistema de traducciones (i18n)**:
   - Objeto `UI` con claves `es` e `en`
   - Todas las UI strings deben usar `UI[state.lang].key`
   - Plantillas JSON tienen estructura `template[lang].field`

3. **Renderizado funcional**:
   - Funciones `renderXxx()` retornan strings HTML
   - `renderApp()` es el punto central que llama a otros renders
   - Sin manipulación directa del DOM, solo innerHTML

4. **Helpers reutilizables**:
   ```javascript
   const $ = (selector) => document.querySelector(selector);
   const escapeHTML = (str) => str.replace(/&/g, '&amp;')...;
   const readFileAsDataURL = (file) => Promise<dataUrl>;
   const calculateSeverityFromCvss = (cvss) => severity|null;
   ```

### Python (Backend)

1. **Endpoints RESTful**:
   ```python
   @app.get("/api/reports/{id}")
   @app.post("/api/reports/{id}/findings")
   @app.put("/api/findings/{id}")
   @app.delete("/api/findings/{id}")
   ```

2. **Modelos SQLAlchemy**:
   - `Report`: datos generales del informe
   - `Finding`: vulnerabilidades con `order_index` para ordenamiento

3. **Reordenamiento automático**:
   Al eliminar un finding, se ejecuta reordenamiento:
   ```python
   db.delete(finding)
   db.flush()  # Importante: aplicar antes de reordenar
   # Reasignar order_index a los restantes
   ```

## Flujos Importantes

### Cambio de Idioma
1. Usuario hace clic en ES/EN
2. `setLang(lang)` actualiza `state.lang`
3. Si hay plantilla seleccionada, `applyTemplate()` recarga contenido
4. `renderApp()` refresca toda la UI

### Guardar Reporte
1. `saveCurrentReport()` recopila datos de `state.auditData` y `state.findings`
2. POST/PUT a `/api/reports` con payload JSON
3. Backend sincroniza hallazgos (crear/actualizar/eliminar)
4. `isDirty` se resetea a `false`

### Generar PDF
1. Usuario debe estar en vista previa
2. `printReport()` usa Playwright:
   - Crea iframe con contenido clonado
   - Espera carga de imágenes
   - Llama a `window.print()`
3. Endpoint `/api/reports/{id}/pdf` genera PDF server-side

## Patrones de Testing

### Tests de Backend (pytest)
- Usar fixtures `client` y `db_session` de `conftest.py`
- Base de datos en memoria por test
- Tests independientes, sin estado compartido

```python
def test_create_report(self, client):
    response = client.post("/api/reports", json={...})
    assert response.status_code == 200
```

### Comando de Tests
```bash
source venv/bin/activate
python -m pytest backend/tests/ -v
```

## Decisiones de Diseño Clave

1. **Sin frameworks frontend**: Vanilla JS para simplicidad y control total
2. **SQLite**: Portabilidad, backup como archivo simple
3. **Plantillas bilingües**: Estructura `es/en` en JSON para mantenibilidad
4. **Reordenamiento por índice**: `order_index` explícito en lugar de array implícito
5. **Imágenes base64**: Almacenadas inline en la BD para simplicidad

## Extensiones Comunes

Para agregar una nueva funcionalidad:

1. **Nueva plantilla de vulnerabilidad**:
   - Agregar entrada en `js/plantillas.json` con `es` e `en`
   - No requiere cambio de código

2. **Nuevo campo en reporte**:
   - Agregar a `models.py` (columna)
   - Agregar a `schemas.py` (validación)
   - Agregar a `state.auditData` (frontend)
   - Ejecutar migración en `migrations.py`

3. **Nuevo idioma**:
   - Copiar estructura `UI.en` a nuevo idioma (ej: `UI.fr`)
   - Agregar plantillas en nuevo idioma a `plantillas.json`
   - Actualizar selector de idioma en UI

## Anti-patrones a Evitar

1. **No usar** manipulación directa del DOM fuera de `renderApp()`
2. **No usar** `var`, siempre `const` o `let`
3. **No usar** funciones sincrónicas para operaciones de BD
4. **No olvidar** `db.flush()` antes de queries dependientes de cambios pendientes

## Debugging

- Backend: Logs en consola, base de datos en `pentestify.db`
- Frontend: `console.log` en `state` para inspeccionar
- Tests: `pytest -v --tb=short` para traceback resumido

## Recursos Externos

- **Playwright**: Necesario para generación de PDFs
- **Google Fonts**: Inter (debe estar disponible en red)
- **SQLite**: Base de datos serverless

---

*Última actualización: Abril 2026*
*Versión del proyecto: 1.0*
