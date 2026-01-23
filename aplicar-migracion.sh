#!/bin/bash

# Script para aplicar la migración SQL directamente en la base de datos

echo "🔍 Verificando contenedor de base de datos..."

# Verificar si el contenedor de desarrollo está corriendo
if docker ps | grep -q "autosclasicos-db-dev"; then
    echo "✅ Contenedor de desarrollo encontrado"
    echo "📝 Aplicando migración en base de datos de desarrollo..."
    docker exec -i autosclasicos-db-dev psql -U dev -d autosclasicos < database/migration_add_auto_fields.sql
    if [ $? -eq 0 ]; then
        echo "✅ Migración aplicada correctamente en desarrollo"
    else
        echo "❌ Error al aplicar la migración"
        exit 1
    fi
else
    echo "⚠️  Contenedor de desarrollo no encontrado"
    echo "🔍 Buscando contenedor de producción..."
    
    if docker ps | grep -q "autosclasicos-db"; then
        echo "✅ Contenedor de producción encontrado"
        echo "⚠️  ATENCIÓN: Estás aplicando la migración en PRODUCCIÓN"
        read -p "¿Continuar? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "📝 Aplicando migración en base de datos de producción..."
            docker exec -i autosclasicos-db psql -U ${DB_USER:-postgres} -d ${DB_NAME:-autosclasicos} < database/migration_add_auto_fields.sql
            if [ $? -eq 0 ]; then
                echo "✅ Migración aplicada correctamente en producción"
            else
                echo "❌ Error al aplicar la migración"
                exit 1
            fi
        else
            echo "❌ Operación cancelada"
            exit 1
        fi
    else
        echo "❌ No se encontró ningún contenedor de base de datos"
        echo "💡 Asegúrate de que Docker Compose esté corriendo:"
        echo "   docker compose -f docker-compose.dev.yml up -d"
        exit 1
    fi
fi

echo ""
echo "🔄 Regenerando Prisma Client..."
cd backend
npx prisma generate

echo ""
echo "✅ ¡Migración completada!"
echo "💡 Reinicia el backend para aplicar los cambios:"
echo "   docker compose -f docker-compose.dev.yml restart backend"



