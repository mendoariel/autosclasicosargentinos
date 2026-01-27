#!/bin/bash

echo "👤 Creando usuario para Alberto en producción..."

# Datos del usuario
USER_EMAIL="mendoariel@hotmail.com"
USER_PASSWORD_HASH="\$2b\$10\$VLJSETFRZfYHY0zGJTOdPeLesOdWKMoWb2crzrixoMK.HX5Dodslm"
USER_NAME="Albert"
USER_ROLE="asesor"
USER_TEL="2615597977"

echo "📋 Datos del usuario:"
echo "📧 Email: $USER_EMAIL"
echo "👤 Nombre: $USER_NAME"
echo "📞 Teléfono: $USER_TEL"
echo "🔐 Rol: $USER_ROLE"
echo ""

# Verificar si el contenedor está corriendo
echo "📋 Verificando contenedores..."
docker ps | grep autosclasicos

if [ $? -ne 0 ]; then
    echo "❌ Los contenedores no están corriendo localmente."
    echo "🌐 Este script debe ejecutarse en el servidor de producción"
    echo ""
    echo "🔧 Para ejecutar en el servidor:"
    echo "1. Copia este archivo al servidor:"
    echo "   scp crear-usuario-alberto.sh root@tu-ip-del-servidor:/root/"
    echo ""
    echo "2. Conéctate al servidor:"
    echo "   ssh root@tu-ip-del-servidor"
    echo ""
    echo "3. Navega al proyecto y ejecuta:"
    echo "   cd /ruta/del/proyecto"
    echo "   chmod +x crear-usuario-alberto.sh"
    echo "   ./crear-usuario-alberto.sh"
    exit 1
fi

# Conectarse a la base de datos y crear el usuario
echo "👤 Creando usuario Alberto..."

docker exec -it autosclasicos-db psql -U postgres -d autosclasicos_db -c "
-- Crear usuario Alberto
INSERT INTO users (email, password, name, role, phone, created_at, updated_at) 
VALUES (
    '$USER_EMAIL', 
    '$USER_PASSWORD_HASH', 
    '$USER_NAME', 
    '$USER_ROLE',
    '$USER_TEL',
    NOW(), 
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    password = '$USER_PASSWORD_HASH',
    name = '$USER_NAME',
    role = '$USER_ROLE',
    phone = '$USER_TEL',
    updated_at = NOW();

-- Verificar usuario creado
SELECT email, name, role, phone, created_at FROM users WHERE email = '$USER_EMAIL';
"

echo ""
echo "✅ Usuario Alberto creado exitosamente!"
echo ""
echo "📝 Credenciales para login:"
echo "📧 Email: mendoariel@hotmail.com"
echo "🔐 Contraseña: Casadesara1"
echo ""
echo "🌐 Sitio: https://autosclasicosargentinos.com.ar/login"
echo "🔧 API: https://api.autosclasicosargentinos.com.ar"
