#!/bin/bash

# Script para crear .env.production con contraseñas seguras

echo "🔐 Generando .env.production..."

# Generar contraseñas seguras
DB_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")

# Crear archivo
cat > .env.production << EOF
# Base de datos
DB_NAME=autosclasicos
DB_USER=prod_user
DB_PASSWORD=${DB_PASSWORD}

# JWT
JWT_SECRET=${JWT_SECRET}
EOF

echo "✅ Archivo .env.production creado con contraseñas seguras"
echo ""
echo "📝 Contraseñas generadas:"
echo "   DB_PASSWORD: ${DB_PASSWORD}"
echo "   JWT_SECRET: ${JWT_SECRET}"
echo ""
echo "⚠️  IMPORTANTE: Guarda estas contraseñas en un lugar seguro!"



