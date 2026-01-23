#!/bin/bash

# Script de despliegue rápido para actualizaciones
# IP del servidor obtenida de connect.sh
SERVER_IP="46.224.152.98"
REMOTE_DIR="/root/autosclasicosargentinos"

echo "🚀 Iniciando despliegue de actualización..."
echo "📡 Servidor: $SERVER_IP"

# 1. Subir carpeta precisionmotos
echo "📤 Subiendo directorio precisionmotos..."
scp -r precisionmotos root@$SERVER_IP:$REMOTE_DIR/

# 2. Subir docker-compose.yml actualizado
echo "📤 Subiendo docker-compose.yml..."
scp docker-compose.yml root@$SERVER_IP:$REMOTE_DIR/

# 3. Aplicar cambios en el servidor
echo "🔄 Aplicando cambios en el servidor..."
ssh root@$SERVER_IP "cd $REMOTE_DIR && docker compose up -d --remove-orphans"

echo "✅ Despliegue completado con éxito."
