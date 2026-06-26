FROM python:3.12-slim

# Establecer directorio de trabajo
WORKDIR /app

# Dependencias del sistema mínimas (compilación de wheels si hiciera falta).
# Desde la v2.0.0 el informe se exporta a HTML/PDF 100% en el cliente, así que
# ya NO se necesita Playwright/Chromium ni sus librerías del sistema.
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar cache de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ ./backend/

# Copiar frontend estático
COPY index.html .
COPY css/ ./css/
COPY js/ ./js/
COPY assets/ ./assets/

# Crear directorio para la base de datos SQLite
RUN mkdir -p /app/data

# Variables de entorno
ENV PYTHONPATH=/app/backend
ENV DATABASE_URL=sqlite:///./data/pentestify.db
ENV PORT=8000
# Orígenes CORS permitidos (lista explícita). Ajustar al dominio real en producción.
ENV ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000

# Puerto expuesto
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
