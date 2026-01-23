#!/bin/bash

echo "🚀 Configurando entorno de desarrollo local..."

# Crear .env del backend si no existe
if [ ! -f backend/.env ]; then
    echo "📝 Creando backend/.env..."
    cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://dev:dev123@postgres:5432/autosclasicos
JWT_SECRET=dev-secret-key-change-in-production
UPLOAD_DIR=/app/uploads
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
EOF
    echo "✅ backend/.env creado"
else
    echo "ℹ️  backend/.env ya existe"
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instálalo primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Docker está instalado"
echo ""
echo "📦 Iniciando contenedores Docker..."
echo "   Esto puede tardar unos minutos la primera vez..."
echo ""

# Iniciar Docker Compose
docker-compose -f docker-compose.dev.yml up --build



