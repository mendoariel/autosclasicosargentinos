#!/bin/bash

# Script para copiar la clave SSH pública al servidor de Hetzner
# Esto permite conectarse sin contraseña

SERVER_IP="46.224.152.98"
KEY_FILE="${1:-~/.ssh/id_ed25519.pub}"

if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: No se encontró la clave pública en $KEY_FILE"
    echo ""
    echo "Claves disponibles:"
    ls -la ~/.ssh/*.pub 2>/dev/null || echo "No se encontraron claves públicas"
    exit 1
fi

echo "🔑 Copiando clave SSH pública al servidor..."
echo "Servidor: root@$SERVER_IP"
echo "Clave: $KEY_FILE"
echo ""
echo "⚠️  Nota: Si es la primera vez, Hetzner te pedirá la contraseña root"
echo "   (La contraseña se encuentra en la consola de Hetzner)"
echo ""

ssh-copy-id -i "$KEY_FILE" root@"$SERVER_IP"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Clave SSH copiada exitosamente!"
    echo "Ahora puedes conectarte sin contraseña usando:"
    echo "   ssh hetzner-autosclasicos"
else
    echo ""
    echo "❌ Error al copiar la clave. Verifica:"
    echo "   1. Que tengas la contraseña root del servidor"
    echo "   2. Que el servidor esté accesible"
    echo "   3. Que el usuario root permita autenticación por contraseña"
fi



