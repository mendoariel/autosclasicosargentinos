# 🚀 Pasos para Deploy a Producción

## ✅ Paso 1: Configurar Email en Traefik

Edita `traefik/traefik.yml` y cambia:
```yaml
email: tu-email@ejemplo.com
```
Por tu email real (ej: `mendoariel@hotmail.com`)

## ✅ Paso 2: Crear .env.production

```bash
cp .env.production.example .env.production
```

Luego edita `.env.production` con valores seguros:
```env
DB_NAME=autosclasicos
DB_USER=prod_user
DB_PASSWORD=TU_CONTRASEÑA_MUY_SEGURA_AQUI
JWT_SECRET=TU_SECRETO_JWT_MUY_LARGO_Y_ALEATORIO_AQUI
```

**Generar contraseñas seguras:**
```bash
# Generar contraseña para DB
openssl rand -base64 32

# Generar JWT_SECRET
openssl rand -base64 64
```

## ✅ Paso 3: Subir Código al Servidor

```bash
# Opción A: Si ya tienes el código en el servidor
ssh hetzner-autosclasicos
cd /root/autosclasicosargentinos
git pull  # Si usas git

# Opción B: Subir todo el proyecto
scp -r . hetzner-autosclasicos:/root/autosclasicosargentinos/
```

## ✅ Paso 4: Deploy en el Servidor

```bash
ssh hetzner-autosclasicos
cd /root/autosclasicosargentinos

# Configurar permisos
chmod 600 traefik/acme.json
mkdir -p data/postgres
chmod 777 data/postgres

# Detener servicios antiguos (si existen)
docker-compose down 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
docker stop $(docker ps -q) 2>/dev/null || true

# Iniciar servicios
docker-compose up -d --build

# Esperar a que los servicios estén listos
sleep 15

# Configurar base de datos
docker exec autosclasicos-backend npx prisma generate
docker exec -i autosclasicos-db psql -U prod_user -d autosclasicos < database/schema.sql
```

## ✅ Paso 5: Verificar

```bash
# Ver contenedores
docker ps

# Ver logs
docker-compose logs -f

# Verificar HTTPS (puede tardar unos minutos en generar certificados)
curl -I https://autosclasicosargentinos.com.ar
curl https://api.autosclasicosargentinos.com.ar/api/health
```

## 🌐 URLs de Producción

Una vez que los certificados estén listos (puede tardar 2-5 minutos):

- ✅ Frontend: https://autosclasicosargentinos.com.ar
- ✅ API: https://api.autosclasicosargentinos.com.ar
- ✅ Traefik Dashboard: https://traefik.autosclasicosargentinos.com.ar

## 🐛 Troubleshooting

### Si los certificados no se generan:

```bash
# Ver logs de Traefik
docker logs traefik | grep -i acme

# Verificar que el puerto 80 esté abierto
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

### Si el backend no responde:

```bash
# Ver logs
docker logs autosclasicos-backend

# Verificar variables de entorno
docker exec autosclasicos-backend env | grep DATABASE
```

### Si el frontend no carga:

```bash
# Ver logs
docker logs autosclasicos-frontend

# Verificar que NEXT_PUBLIC_API_URL esté correcto
docker exec autosclasicos-frontend env | grep NEXT_PUBLIC
```



