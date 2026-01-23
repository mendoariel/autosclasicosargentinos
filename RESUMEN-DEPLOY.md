# ✅ Resumen - Listo para Deploy

## ✅ Configurado

1. **Email en Traefik**: `albertdesarrolloweb@gmail.com` ✅
2. **Archivo .env.production**: Creado con contraseñas seguras ✅
3. **DNS**: Configurados (api y traefik) ✅

## 🚀 Próximos Pasos

### 1. Subir archivos al servidor

```bash
scp -r . hetzner-autosclasicos:/root/autosclasicosargentinos/
```

### 2. Conectar al servidor y deployar

```bash
ssh hetzner-autosclasicos
cd /root/autosclasicosargentinos

# Configurar permisos
chmod 600 traefik/acme.json
mkdir -p data/postgres
chmod 777 data/postgres

# Detener servicios antiguos
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

### 3. Verificar

```bash
# Ver contenedores
docker ps

# Ver logs
docker-compose logs -f

# Verificar HTTPS (puede tardar 2-5 minutos en generar certificados)
curl -I https://autosclasicosargentinos.com.ar
curl https://api.autosclasicosargentinos.com.ar/api/health
```

## 🌐 URLs de Producción

Una vez que los certificados estén listos:

- ✅ Frontend: https://autosclasicosargentinos.com.ar
- ✅ API: https://api.autosclasicosargentinos.com.ar
- ✅ Traefik Dashboard: https://traefik.autosclasicosargentinos.com.ar

## 📝 Notas

- **Certificados SSL**: Let's Encrypt puede tardar 2-5 minutos en generar los certificados la primera vez
- **DNS**: Asegúrate de que los DNS estén propagados antes de deployar
- **Puertos**: Verifica que los puertos 80 y 443 estén abiertos en el firewall

## 🔐 Credenciales Generadas

Las contraseñas están en `.env.production`:
- `DB_PASSWORD`: Generada automáticamente
- `JWT_SECRET`: Generado automáticamente

**⚠️ IMPORTANTE**: Guarda estas credenciales en un lugar seguro. El archivo `.env.production` está en `.gitignore` y no se subirá al repositorio.



