# 🔄 Migración Manual de Base de Datos

## Cambios en el Esquema

Se han actualizado los modelos de Prisma para agregar nuevos campos. Si `prisma migrate dev` no funciona, puedes aplicar los cambios manualmente.

## Opción 1: Ejecutar Prisma Migrate (Recomendado)

```bash
cd backend
npx prisma migrate dev --name add_auto_fields_and_update_cotizacion
```

## Opción 2: Aplicar SQL Manualmente

Si prefieres aplicar los cambios directamente en la base de datos:

### Para Desarrollo Local (Docker)

```bash
# Conectar a la base de datos
docker exec -i autosclasicos-db-dev psql -U dev -d autosclasicos < database/migration_add_auto_fields.sql
```

### Para Producción

```bash
# Conectar al servidor
ssh root@46.224.152.98

# Ejecutar el script
cd /root/autosclasicosargentinos
docker exec -i autosclasicos-db psql -U [DB_USER] -d [DB_NAME] < database/migration_add_auto_fields.sql
```

## Cambios Aplicados

### Tabla `autos`
- ✅ `color` (TEXT, opcional)
- ✅ `combustible` (TEXT, opcional)
- ✅ `imagenUrl` (TEXT, opcional)

### Tabla `cotizaciones`
- ✅ `marca` (TEXT, opcional)
- ✅ `modelo` (TEXT, opcional)
- ✅ `ano` (INTEGER, opcional)
- ✅ `cobertura` (TEXT, opcional)
- ✅ `primaAnual` (DOUBLE PRECISION, opcional)
- ✅ `uso` (TEXT, opcional)

## Después de Aplicar la Migración

1. Regenerar Prisma Client:
```bash
cd backend
npx prisma generate
```

2. Reiniciar el backend:
```bash
# Desarrollo
docker compose -f docker-compose.dev.yml restart backend

# Producción
docker compose restart backend
```



