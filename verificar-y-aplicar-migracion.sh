#!/bin/bash

echo "🔍 Verificando y aplicando migración..."
echo ""

# Verificar contenedor de desarrollo
if docker ps | grep -q "autosclasicos-db-dev"; then
    echo "✅ Contenedor de desarrollo encontrado: autosclasicos-db-dev"
    echo ""
    echo "📋 Verificando si los campos ya existen..."
    
    # Verificar si los campos ya existen
    docker exec autosclasicos-db-dev psql -U dev -d autosclasicos -c "\d autos" | grep -q "color"
    
    if [ $? -eq 0 ]; then
        echo "✅ Los campos ya existen en la tabla autos"
    else
        echo "⚠️  Los campos NO existen. Aplicando migración..."
        docker exec -i autosclasicos-db-dev psql -U dev -d autosclasicos < database/migration_add_auto_fields.sql
        if [ $? -eq 0 ]; then
            echo "✅ Migración aplicada correctamente"
        else
            echo "❌ Error al aplicar la migración"
            exit 1
        fi
    fi
    
    echo ""
    echo "🔄 Regenerando Prisma Client..."
    cd backend
    npx prisma generate
    
    echo ""
    echo "🔄 Reiniciando backend..."
    docker compose -f docker-compose.dev.yml restart backend
    
    echo ""
    echo "✅ ¡Listo! Intenta publicar el auto nuevamente."
    
else
    echo "❌ Contenedor de desarrollo no encontrado"
    echo "💡 Asegúrate de que Docker Compose esté corriendo:"
    echo "   docker compose -f docker-compose.dev.yml up -d"
    exit 1
fi



