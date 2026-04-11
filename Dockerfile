FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
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

# Puerto expuesto
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
