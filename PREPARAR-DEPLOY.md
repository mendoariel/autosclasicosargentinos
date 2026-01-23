# 🚀 Preparar Deploy a Producción

## 📋 Checklist Antes de Deployar

### 1. Configurar Email en Traefik

Edita `traefik/traefik.yml` y cambia:
```yaml
email: tu-email@ejemplo.com
```
Por tu email real (ej: `mendoariel@hotmail.com`)

### 2. Crear archivo .env.production

```bash
cp .env.production.example .env.production
```

Edita `.env.production` con valores seguros:
```env
DB_NAME=autosclasicos
DB_USER=prod_user
DB_PASSWORD=TU_CONTRASEÑA_MUY_SEGURA_AQUI
JWT_SECRET=TU_SECRETO_JWT_MUY_LARGO_Y_ALEATORIO_AQUI
```

### 3. Verificar configuración

- ✅ Email configurado en `traefik/traefik.yml`
- ✅ Variables de entorno en `.env.production`
- ✅ DNS apuntando a `46.224.152.98`
- ✅ Puertos 80 y 443 abiertos en el servidor

## 🚀 Pasos para Deploy

### Opción A: Usando el script (Recomendado)

```bash
# 1. Preparar archivos localmente
# - Editar traefik/traefik.yml con tu email
# - Crear .env.production

# 2. Subir al servidor
scp -r . hetzner-autosclasicos:/root/autosclasicosargentinos/

# 3. Conectar y ejecutar
ssh hetzner-autosclasicos
cd /root/autosclasicosargentinos
chmod +x deploy.sh
./deploy.sh
```

### Opción B: Manual

```bash
# 1. Conectar al servidor
ssh hetzner-autosclasicos

# 2. Ir al directorio (o clonar si es primera vez)
cd /root/autosclasicosargentinos
# O: git clone <tu-repo> autosclasicosargentinos && cd autosclasicosargentinos

# 3. Configurar
chmod 600 traefik/acme.json
mkdir -p data/postgres
chmod 777 data/postgres

# 4. Detener servicios antiguos
docker-compose down 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true

# 5. Iniciar servicios
docker-compose up -d --build

# 6. Configurar base de datos
docker exec autosclasicos-backend npx prisma generate
docker exec -i autosclasicos-db psql -U prod_user -d autosclasicos < database/schema.sql
```

## 🔍 Verificar

```bash
# Ver contenedores
docker ps

# Ver logs
docker-compose logs -f

# Verificar HTTPS
curl -I https://autosclasicosargentinos.com.ar
```

## 📝 Notas Importantes

1. **Primera vez**: Let's Encrypt puede tardar unos minutos en generar el certificado
2. **DNS**: Asegúrate de que los DNS estén propagados antes de hacer deploy
3. **Backup**: Si hay datos anteriores, haz backup antes de deployar
4. **Permisos**: `acme.json` debe tener permisos 600

## 🐛 Si algo falla

Ver logs:
```bash
docker-compose logs traefik
docker-compose logs backend
docker-compose logs frontend
```



