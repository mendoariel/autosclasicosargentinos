# 🚀 Instrucciones de Setup - Desarrollo Local

## Paso 1: Crear archivo .env del backend

Crea manualmente el archivo `backend/.env` con este contenido:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://dev:dev123@postgres:5432/autosclasicos
JWT_SECRET=dev-secret-key-change-in-production
UPLOAD_DIR=/app/uploads
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

O ejecuta el script automático:

```bash
./setup-local.sh
```

## Paso 2: Iniciar el entorno de desarrollo

### Opción A: Usando el script (recomendado)

```bash
./setup-local.sh
```

### Opción B: Manualmente

```bash
# Iniciar contenedores
npm run dev

# O directamente con Docker Compose
docker-compose -f docker-compose.dev.yml up --build
```

## Paso 3: Configurar Prisma (en otra terminal)

Una vez que los contenedores estén corriendo:

```bash
# Entrar al contenedor del backend
docker exec -it autosclasicos-backend-dev sh

# Dentro del contenedor:
npm install
npx prisma generate
npx prisma migrate dev --name init

# Salir del contenedor
exit
```

O desde tu máquina local (si tienes Prisma instalado):

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Paso 4: Verificar que todo funciona

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health
- **Prisma Studio**: `cd backend && npm run db:studio` (abre en http://localhost:5555)

## Comandos útiles

```bash
# Ver logs de los contenedores
docker-compose -f docker-compose.dev.yml logs -f

# Detener contenedores
npm run dev:down
# O
docker-compose -f docker-compose.dev.yml down

# Reconstruir contenedores
npm run dev:build
```

## Troubleshooting

### Error: Puerto ya en uso

```bash
# Ver qué está usando el puerto
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :5432  # PostgreSQL

# Detener contenedores anteriores
docker-compose -f docker-compose.dev.yml down
```

### Error: Base de datos no conecta

Espera unos segundos después de iniciar los contenedores para que PostgreSQL esté listo.

### Error: Prisma Client no encontrado

```bash
docker exec -it autosclasicos-backend-dev sh
npx prisma generate
exit
```

## Próximos pasos

Una vez que todo esté funcionando:

1. ✅ Verificar que el backend responde en http://localhost:5000/api/health
2. ✅ Verificar que el frontend carga en http://localhost:3000
3. ✅ Crear tu primera migración de Prisma
4. 🚀 Empezar a desarrollar!



