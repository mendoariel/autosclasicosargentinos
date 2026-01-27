#!/bin/bash

echo "🔍 Diagnosticando problemas en producción..."
echo ""

# URL del sitio
SITE_URL="https://autosclasicosargentinos.com.ar"
API_URL="https://api.autosclasicosargentinos.com.ar"

echo "🌐 Probando conectividad..."
echo "📍 Frontend: $SITE_URL"
echo "📍 Backend: $API_URL"
echo ""

# Test frontend
echo "📱 Test Frontend:"
curl -s -o /dev/null -w "Status: %{http_code} - Tiempo: %{time_total}s\n" $SITE_URL

# Test API health
echo ""
echo "🔧 Test API Health:"
curl -s -o /dev/null -w "Status: %{http_code} - Tiempo: %{time_total}s\n" $API_URL/api/health

# Test API login endpoint
echo ""
echo "🔐 Test Login Endpoint:"
curl -s -o /dev/null -w "Status: %{http_code} - Tiempo: %{time_total}s\n" $API_URL/api/auth/login

# Verificar respuesta del health
echo ""
echo "📊 Respuesta API Health:"
curl -s $API_URL/api/health | head -5

echo ""
echo "🔍 Verificando logs del backend (si tienes acceso SSH):"
echo "ssh tu-servidor 'docker logs autosclasicos-backend --tail 20'"

echo ""
echo "📝 Si tienes acceso al servidor, ejecuta:"
echo "1. docker-compose -f docker-compose.yml ps"
echo "2. docker logs autosclasicos-backend"
echo "3. docker logs autosclasicos-frontend"
