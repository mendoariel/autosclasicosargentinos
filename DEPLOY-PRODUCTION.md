# 🚀 Deploy a Producción - HTTPS con Traefik

## 📋 Checklist Pre-Deploy

- [ ] Email configurado en `traefik/traefik.yml`
- [ ] Variables de entorno en `.env.production`
- [ ] Permisos correctos en `traefik/acme.json`
- [ ] DNS configurado correctamente
- [ ] Backend y Frontend compilados

## 🔧 Configuración

### 1. Configurar Email en Traefik

Edita `traefik/traefik.yml` y cambia:
```yaml
email: tu-email@ejemplo.com
```
Por tu email real.

### 2. Crear archivo .env.production

```bash
cp .env.production.example .env.production
```

Edita `.env.production` con:
- `DB_PASSWORD`: Contraseña fuerte para PostgreSQL
- `JWT_SECRET`: String largo y aleatorio

### 3. Configurar permisos de acme.json

```bash
chmod 600 traefik/acme.json
```

## 🚀 Deploy

### Opción 1: Deploy completo (primera vez)

```bash
# 1. Conectar al servidor
ssh hetzner-autosclasicos

# 2. Clonar o actualizar el repositorio
cd /root
git clone <tu-repo> autosclasicosargentinos
# O si ya existe:
cd autosclasicosargentinos
git pull

# 3. Configurar variables de entorno
cp .env.production.example .env.production
nano .env.production  # Editar con tus valores

# 4. Configurar email en Traefik
nano traefik/traefik.yml  # Cambiar email

# 5. Configurar permisos
chmod 600 traefik/acme.json
mkdir -p data/postgres
chmod 777 data/postgres

# 6. Detener servicios antiguos (si existen)
docker-compose down
# O si usabas Nginx:
systemctl stop nginx
docker stop $(docker ps -q) 2>/dev/null || true

# 7. Iniciar servicios
docker-compose up -d --build

# 8. Generar Prisma Client y crear tablas
docker exec autosclasicos-backend npx prisma generate
docker exec -i autosclasicos-db psql -U ${DB_USER} -d ${DB_NAME} < database/schema.sql
```

### Opción 2: Actualización rápida

```bash
ssh hetzner-autosclasicos
cd /root/autosclasicosargentinos
git pull
docker-compose up -d --build
docker exec autosclasicos-backend npx prisma generate
```

## 🔍 Verificar

### 1. Verificar contenedores

```bash
docker ps
```

Deberías ver:
- traefik
- autosclasicos-db
- autosclasicos-backend
- autosclasicos-frontend

### 2. Verificar logs

```bash
# Traefik
docker logs traefik

# Backend
docker logs autosclasicos-backend

# Frontend
docker logs autosclasicos-frontend
```

### 3. Verificar HTTPS

```bash
# Verificar certificado
curl -I https://autosclasicosargentinos.com.ar

# Verificar API
curl https://api.autosclasicosargentinos.com.ar/api/health
```

### 4. Verificar en navegador

- https://autosclasicosargentinos.com.ar
- https://api.autosclasicosargentinos.com.ar/api/health
- https://traefik.autosclasicosargentinos.com.ar (dashboard)

## 🐛 Troubleshooting

### Certificado no se genera

1. Verificar que el puerto 80 esté abierto:
```bash
sudo ufw allow 80
sudo ufw allow 443
```

2. Verificar logs de Traefik:
```bash
docker logs traefik | grep -i acme
```

3. Verificar DNS:
```bash
dig autosclasicosargentinos.com.ar
```

### Backend no responde

1. Verificar logs:
```bash
docker logs autosclasicos-backend
```

2. Verificar conexión a DB:
```bash
docker exec autosclasicos-backend npm run db:studio
```

3. Verificar variables de entorno:
```bash
docker exec autosclasicos-backend env | grep DATABASE
```

### Frontend no carga

1. Verificar que NEXT_PUBLIC_API_URL esté correcto
2. Verificar logs:
```bash
docker logs autosclasicos-frontend
```

## 📊 URLs de Producción

- **Frontend**: https://autosclasicosargentinos.com.ar
- **API**: https://api.autosclasicosargentinos.com.ar
- **Traefik Dashboard**: https://traefik.autosclasicosargentinos.com.ar

## 🔄 Actualizar Código

```bash
ssh hetzner-autosclasicos
cd /root/autosclasicosargentinos
git pull
docker-compose up -d --build
```

## 💾 Backup

```bash
# Backup de base de datos
docker exec autosclasicos-db pg_dump -U ${DB_USER} ${DB_NAME} > backup-$(date +%Y%m%d).sql

# Backup de datos persistentes
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/
```



