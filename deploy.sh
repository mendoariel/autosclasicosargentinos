#!/bin/bash

# Script de deploy a producción
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy a producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml"
    exit 1
fi

# Verificar que existe .env.production
if [ ! -f ".env.production" ]; then
    echo "⚠️  No se encontró .env.production"
    echo "📝 Creando desde .env.production.example..."
    cp .env.production.example .env.production
    echo "⚠️  Por favor, edita .env.production con tus valores antes de continuar"
    exit 1
fi

# Verificar email en traefik.yml
if grep -q "tu-email@ejemplo.com" traefik/traefik.yml; then
    echo "⚠️  Por favor, actualiza el email en traefik/traefik.yml"
    exit 1
fi

# Configurar permisos
echo "🔐 Configurando permisos..."
chmod 600 traefik/acme.json 2>/dev/null || true
mkdir -p data/postgres
chmod 777 data/postgres

# Construir y levantar servicios
echo "🏗️  Construyendo imágenes..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Generar Prisma Client
echo "📦 Generando Prisma Client..."
docker exec autosclasicos-backend npx prisma generate || echo "⚠️  Error generando Prisma Client"

# Crear tablas si no existen
echo "🗄️  Verificando base de datos..."
docker exec -i autosclasicos-db psql -U ${DB_USER:-prod_user} -d ${DB_NAME:-autosclasicos} -c "SELECT 1 FROM users LIMIT 1;" 2>/dev/null || {
    echo "📊 Creando tablas..."
    docker exec -i autosclasicos-db psql -U ${DB_USER:-prod_user} -d ${DB_NAME:-autosclasicos} < database/schema.sql
}

echo "✅ Deploy completado!"
echo ""
echo "🔍 Verificando servicios..."
docker ps | grep -E "traefik|autosclasicos"

echo ""
echo "🌐 URLs:"
echo "  - Frontend: https://autosclasicosargentinos.com.ar"
echo "  - API: https://api.autosclasicosargentinos.com.ar"
echo "  - Traefik Dashboard: https://traefik.autosclasicosargentinos.com.ar"
echo ""
echo "📋 Ver logs con: docker-compose logs -f"



