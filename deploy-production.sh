#!/bin/bash

# Script para hacer deploy a producción
# Uso: ./deploy-production.sh

set -e

echo "🚀 Deploy a Producción - Autos Clásicos Argentinos"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml"
    exit 1
fi

# Verificar email en traefik.yml
if grep -q "tu-email@ejemplo.com" traefik/traefik.yml; then
    echo "⚠️  IMPORTANTE: Actualiza el email en traefik/traefik.yml antes de continuar"
    exit 1
fi

# Verificar .env.production
if [ ! -f ".env.production" ]; then
    echo "⚠️  No se encontró .env.production"
    echo "📝 Creando desde .env.production.example..."
    cp .env.production.example .env.production
    echo "⚠️  Por favor, edita .env.production con tus valores antes de continuar"
    exit 1
fi

echo "✅ Configuración verificada"
echo ""

# Preguntar si quiere subir al servidor
read -p "¿Quieres subir los archivos al servidor ahora? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "📤 Subiendo archivos al servidor..."
    scp -r . hetzner-autosclasicos:/root/autosclasicosargentinos/ || {
        echo "❌ Error al subir archivos. ¿Está configurado el SSH?"
        exit 1
    }
    echo "✅ Archivos subidos"
fi

echo ""
echo "🔧 Pasos siguientes en el servidor:"
echo ""
echo "1. Conectarse al servidor:"
echo "   ssh hetzner-autosclasicos"
echo ""
echo "2. Ir al directorio:"
echo "   cd /root/autosclasicosargentinos"
echo ""
echo "3. Configurar permisos:"
echo "   chmod 600 traefik/acme.json"
echo "   mkdir -p data/postgres && chmod 777 data/postgres"
echo ""
echo "4. Detener servicios antiguos:"
echo "   docker-compose down 2>/dev/null || true"
echo "   systemctl stop nginx 2>/dev/null || true"
echo ""
echo "5. Iniciar servicios:"
echo "   docker-compose up -d --build"
echo ""
echo "6. Configurar base de datos:"
echo "   docker exec autosclasicos-backend npx prisma generate"
echo "   docker exec -i autosclasicos-db psql -U prod_user -d autosclasicos < database/schema.sql"
echo ""
echo "7. Verificar:"
echo "   docker ps"
echo "   docker-compose logs -f"
echo ""



