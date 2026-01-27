#!/bin/bash

echo "🔧 Creando usuarios de prueba en producción..."

# Variables de conexión
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="autosclasicos_db"
DB_USER="postgres"
DB_PASSWORD="tu_password_aqui"

# Verificar si el contenedor está corriendo
echo "📋 Verificando contenedores..."
docker ps | grep autosclasicos

if [ $? -ne 0 ]; then
    echo "❌ Los contenedores no están corriendo. Iniciando..."
    docker-compose -f docker-compose.yml up -d
    sleep 10
fi

# Conectarse a la base de datos y crear usuarios
echo "👤 Creando usuarios de prueba..."

docker exec -it autosclasicos-db psql -U $DB_USER -d $DB_NAME -c "
-- Crear usuario administrador
INSERT INTO users (email, password, name, role, created_at, updated_at) 
VALUES (
    'admin@autosclasicos.com.ar', 
    '\$2b\$10\$BFDGt0kDZma0B.LAEqqeJOe/IMKSnePVXXO47QvueQK.Ck1ZQYlUG', 
    'Administrador', 
    'admin', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Crear usuario asesor comercial
INSERT INTO users (email, password, name, role, created_at, updated_at) 
VALUES (
    'asesor@autosclasicos.com.ar', 
    '\$2b\$10\$BFDGt0kDZma0B.LAEqqeJOe/IMKSnePVXXO47QvueQK.Ck1ZQYlUG', 
    'Asesor Comercial', 
    'user', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Crear usuario cliente prueba
INSERT INTO users (email, password, name, role, created_at, updated_at) 
VALUES (
    'cliente@autosclasicos.com.ar', 
    '\$2b\$10\$BFDGt0kDZma0B.LAEqqeJOe/IMKSnePVXXO47QvueQK.Ck1ZQYlUG', 
    'Cliente Prueba', 
    'user', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

SELECT email, name, role, created_at FROM users;
"

echo "✅ Usuarios creados exitosamente!"
echo ""
echo "📝 Credenciales de prueba:"
echo "👑 Admin: admin@autosclasicos.com.ar / password123"
echo "🤝 Asesor: asesor@autosclasicos.com.ar / password123"
echo "👤 Cliente: cliente@autosclasicos.com.ar / password123"
echo ""
echo "🌐 Sitio: https://autosclasicosargentinos.com.ar"
echo "🔧 API: https://api.autosclasicosargentinos.com.ar"
