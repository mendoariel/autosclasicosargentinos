#!/bin/bash

# Script para conectar al servidor de Hetzner
# Uso: ./connect.sh [IP_DEL_SERVIDOR]

SERVER_IP="${1:-46.224.152.98}"

if [ "$SERVER_IP" == "TU_IP_AQUI" ]; then
    echo "❌ Error: Debes proporcionar la IP del servidor"
    echo ""
    echo "Uso: ./connect.sh <IP_DEL_SERVIDOR>"
    echo "Ejemplo: ./connect.sh 123.456.789.0"
    echo ""
    echo "O puedes editar el archivo .ssh/config y reemplazar 'TU_IP_AQUI' con la IP real"
    exit 1
fi

echo "🔌 Conectando al servidor Hetzner..."
echo "IP: $SERVER_IP"
echo ""

# Verificar si existe la clave SSH
if [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "⚠️  No se encontró una clave SSH. ¿Deseas generar una? (s/n)"
    read -r response
    if [[ "$response" =~ ^[Ss]$ ]]; then
        ssh-keygen -t ed25519 -C "autosclasicos-hetzner"
        echo "✅ Clave SSH generada. Ahora copia la clave pública al servidor:"
        echo "   ssh-copy-id root@$SERVER_IP"
    fi
fi

# Intentar conexión
ssh root@"$SERVER_IP"

