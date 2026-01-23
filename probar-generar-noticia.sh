#!/bin/bash

echo "🤖 Generador de Noticias con IA"
echo "================================"
echo ""

# Verificar que el backend esté corriendo
if ! docker ps | grep -q "autosclasicos-backend"; then
    echo "❌ El backend no está corriendo"
    echo "💡 Inicia el backend con: docker compose -f docker-compose.dev.yml up -d"
    exit 1
fi

# Verificar API key
API_KEY=$(docker exec autosclasicos-backend-dev sh -c "grep OPENAI_API_KEY .env | cut -d '=' -f2" | tr -d '\r\n')

if [ -z "$API_KEY" ] || [ "$API_KEY" = "" ]; then
    echo "⚠️  OPENAI_API_KEY no está configurada"
    echo ""
    echo "📝 Para configurarla:"
    echo "   1. Obtén tu API key en: https://platform.openai.com/api-keys"
    echo "   2. Edita backend/.env y agrega:"
    echo "      OPENAI_API_KEY=tu-api-key-aqui"
    echo ""
    read -p "¿Tienes la API key lista? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        read -p "Pega tu API key aquí: " api_key
        docker exec autosclasicos-backend-dev sh -c "sed -i 's/OPENAI_API_KEY=.*/OPENAI_API_KEY=$api_key/' .env"
        echo "✅ API key configurada"
    else
        echo "❌ Necesitas configurar la API key primero"
        exit 1
    fi
fi

echo "🔐 Obteniendo token de autenticación..."
echo ""

# Intentar obtener token (necesitas estar logueado)
read -p "¿Tienes un usuario registrado? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "💡 Primero regístrate en: http://localhost:3000/registro"
    exit 1
fi

read -p "Email: " email
read -sp "Password: " password
echo ""

TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\",\"password\":\"$password\"}" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Error al iniciar sesión. Verifica tus credenciales."
    exit 1
fi

echo "✅ Autenticado correctamente"
echo ""
echo "🤖 Generando noticia..."
echo ""

# Generar noticia
RESPONSE=$(curl -s -X POST http://localhost:5001/api/noticias/generar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')

if echo "$RESPONSE" | grep -q "error"; then
    echo "❌ Error al generar noticia:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo "✅ ¡Noticia generada exitosamente!"
echo ""
echo "📰 Ver la noticia en: http://localhost:3000/noticias"
echo ""



