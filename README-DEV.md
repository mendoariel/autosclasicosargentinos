# Autos Clásicos Argentinos - Guía de Desarrollo

## 🚀 Inicio Rápido

### Prerequisitos

- Docker y Docker Compose instalados
- Node.js 20+ (opcional, para desarrollo sin Docker)

### Primeros Pasos

1. **Clonar el repositorio** (si aplica)

2. **Configurar variables de entorno**

   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Editar backend/.env con tus configuraciones
   ```

3. **Iniciar el entorno de desarrollo**

   ```bash
   npm run dev
   ```

   Esto iniciará:
   - PostgreSQL en `localhost:5432`
   - Backend API en `http://localhost:5000`
   - Frontend Next.js en `http://localhost:3000`

4. **Configurar la base de datos**

   En otra terminal:

   ```bash
   # Generar Prisma Client
   cd backend
   npm install
   npx prisma generate

   # Crear migraciones
   npx prisma migrate dev --name init

   # (Opcional) Abrir Prisma Studio
   npm run db:studio
   ```

## 📁 Estructura del Proyecto

```
autosclasicosargentinos/
├── backend/              # API Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/      # Rutas de la API
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── services/    # Servicios (noticias, uploads, etc)
│   │   ├── middleware/  # Middleware (auth, error handling)
│   │   └── utils/       # Utilidades
│   └── prisma/          # Schema y migraciones
├── frontend/            # Next.js + React + TypeScript
│   ├── pages/           # Páginas (routing automático)
│   ├── components/      # Componentes React
│   └── styles/          # Estilos globales
├── database/            # Scripts SQL de inicialización
├── traefik/            # Configuración Traefik (producción)
└── docker-compose.yml  # Configuración Docker
```

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Iniciar entorno de desarrollo
npm run dev

# Reconstruir contenedores
npm run dev:build

# Detener contenedores
npm run dev:down
```

### Base de Datos

```bash
# Crear migración
cd backend && npx prisma migrate dev --name nombre_migracion

# Abrir Prisma Studio (GUI para DB)
npm run db:studio

# Generar Prisma Client
cd backend && npx prisma generate
```

### Producción

```bash
# Deploy al servidor
npm run prod:deploy
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://dev:dev123@postgres:5432/autosclasicos
JWT_SECRET=dev-secret-key-change-in-production
UPLOAD_DIR=/app/uploads
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

#### Frontend

Las variables de entorno del frontend deben empezar con `NEXT_PUBLIC_`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📝 Desarrollo de Features

### Agregar una nueva ruta al backend

1. Crear controller: `backend/src/controllers/nuevo.controller.ts`
2. Crear route: `backend/src/routes/nuevo.routes.ts`
3. Importar en `server.ts`

### Agregar una nueva página al frontend

1. Crear archivo en `frontend/pages/nueva-pagina.tsx`
2. Next.js crea la ruta automáticamente

### Agregar un nuevo modelo a la DB

1. Editar `backend/prisma/schema.prisma`
2. Ejecutar: `npx prisma migrate dev --name agregar_modelo`
3. Prisma generará automáticamente el cliente TypeScript

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```bash
# Ver qué está usando el puerto
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # PostgreSQL

# Detener contenedores
npm run dev:down
```

### Error: Prisma Client no encontrado

```bash
cd backend
npx prisma generate
```

### Error: Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
docker ps

# Ver logs
docker logs autosclasicos-db-dev
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com/)
- [Docker Docs](https://docs.docker.com/)

## 🚢 Deploy a Producción

Ver `README.md` para instrucciones de deploy al servidor.



