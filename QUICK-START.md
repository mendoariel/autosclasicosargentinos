# ⚡ Inicio Rápido

## 🎯 Pasos para empezar

### 1. Crear archivo .env del backend

Crea manualmente el archivo `backend/.env` con este contenido:

```bash
cd backend
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://dev:dev123@postgres:5432/autosclasicos
JWT_SECRET=dev-secret-key-change-in-production
UPLOAD_DIR=/app/uploads
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
EOF
```

O simplemente copia y pega el contenido en un nuevo archivo `backend/.env`

### 2. Iniciar Docker Compose

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- ✅ PostgreSQL (puerto 5432)
- ✅ Backend API (puerto 5000)
- ✅ Frontend Next.js (puerto 3000)

### 3. Configurar Prisma (en otra terminal)

Espera a que los contenedores estén corriendo, luego:

```bash
# Opción A: Desde dentro del contenedor
docker exec -it autosclasicos-backend-dev sh
npm install
npx prisma generate
npx prisma migrate dev --name init
exit

# Opción B: Desde tu máquina (si tienes Node.js instalado)
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Verificar

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/health
- Prisma Studio: `cd backend && npm run db:studio`

## 🎉 ¡Listo para desarrollar!

Ahora puedes empezar a desarrollar. Los cambios se reflejarán automáticamente gracias al hot reload.



