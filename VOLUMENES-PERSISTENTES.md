# 💾 Volúmenes Persistentes - Base de Datos

## ✅ Configuración Actual

La base de datos PostgreSQL ahora usa un volumen persistente local en lugar de un volumen Docker anónimo.

### Ubicación de los Datos

Los datos de PostgreSQL se guardan en:
```
./data/postgres/
```

### Ventajas

1. **Persistencia**: Los datos no se pierden al reconstruir contenedores
2. **Acceso directo**: Puedes hacer backup directamente desde la carpeta
3. **Control**: Tienes control total sobre los datos
4. **Portabilidad**: Fácil de mover o copiar

### Estructura

```
autosclasicosargentinos/
├── data/
│   └── postgres/          # Datos de PostgreSQL (persistente)
│       ├── base/          # Bases de datos
│       ├── global/        # Configuración global
│       └── pg_wal/       # Write-Ahead Log
└── ...
```

## 🔄 Migración de Datos Existentes

Si tenías datos en un volumen Docker anterior:

```bash
# 1. Detener contenedores
docker-compose -f docker-compose.dev.yml down

# 2. Copiar datos del volumen antiguo (si existe)
docker run --rm \
  -v autosclasicosargentinos_postgres_dev_data:/source \
  -v $(pwd)/data/postgres:/dest \
  alpine sh -c "cp -a /source/. /dest/"

# 3. Ajustar permisos
chmod -R 777 data/postgres

# 4. Reiniciar
docker-compose -f docker-compose.dev.yml up -d
```

## 📦 Backup y Restore

### Backup Manual

```bash
# Backup de la carpeta completa
tar -czf backup-postgres-$(date +%Y%m%d).tar.gz data/postgres/

# O usando pg_dump
docker exec autosclasicos-db-dev pg_dump -U dev autosclasicos > backup.sql
```

### Restore

```bash
# Restore desde carpeta
tar -xzf backup-postgres-YYYYMMDD.tar.gz

# O desde SQL
docker exec -i autosclasicos-db-dev psql -U dev -d autosclasicos < backup.sql
```

## ⚠️ Notas Importantes

1. **Permisos**: La carpeta `data/postgres` necesita permisos de escritura para el usuario de PostgreSQL (UID 999 en el contenedor)
2. **Git**: La carpeta `data/` está en `.gitignore` para no subir datos sensibles
3. **Backup**: Haz backups regulares de la carpeta `data/postgres/`

## 🗑️ Limpiar Datos (Cuidado!)

Si quieres empezar de cero:

```bash
# Detener contenedores
docker-compose -f docker-compose.dev.yml down

# Eliminar carpeta de datos
rm -rf data/postgres/*

# Reiniciar
docker-compose -f docker-compose.dev.yml up -d
```

## 📊 Verificar que Funciona

```bash
# Ver que los datos persisten
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
# Los datos deberían seguir ahí
```



