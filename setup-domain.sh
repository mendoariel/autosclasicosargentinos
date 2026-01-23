#!/bin/bash

# Script para configurar el dominio autosclasicosargentinos.com.ar en Nginx

DOMAIN="autosclasicosargentinos.com.ar"
NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

echo "🌐 Configurando dominio: $DOMAIN"

# Crear configuración de Nginx
sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root /var/www/html;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ =404;
    }

    # Logs
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;
}
EOF

echo "✅ Configuración de Nginx creada"

# Crear enlace simbólico
if [ -L "$NGINX_ENABLED" ]; then
    echo "⚠️  El enlace ya existe, eliminándolo..."
    sudo rm "$NGINX_ENABLED"
fi

sudo ln -s "$NGINX_CONFIG" "$NGINX_ENABLED"
echo "✅ Enlace simbólico creado"

# Deshabilitar configuración por defecto si existe
if [ -L /etc/nginx/sites-enabled/default ]; then
    echo "⚠️  Deshabilitando configuración por defecto..."
    sudo rm /etc/nginx/sites-enabled/default
fi

# Verificar configuración
echo "🔍 Verificando configuración de Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuración válida"
    echo "🔄 Reiniciando Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reiniciado"
    echo ""
    echo "🎉 ¡Dominio configurado exitosamente!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Asegúrate de que los DNS estén configurados correctamente"
    echo "   2. Verifica que los registros A apunten a: 46.224.152.98"
    echo "   3. Espera la propagación DNS (15-30 minutos)"
    echo "   4. Visita: http://$DOMAIN"
else
    echo "❌ Error en la configuración de Nginx"
    exit 1
fi



