# 🔐 Implementación de Autenticación con Passport.js

## ✅ Lo que se ha implementado

### Backend

1. **Passport.js configurado**
   - Estrategia JWT implementada
   - Middleware de autenticación
   - Configuración en `src/config/passport.ts`

2. **Endpoints de Autenticación**
   - `POST /api/auth/register` - Registro de usuarios
   - `POST /api/auth/login` - Inicio de sesión
   - `GET /api/auth/profile` - Obtener perfil (requiere token)

3. **Utilidades**
   - `src/utils/jwt.ts` - Generación y verificación de tokens
   - `src/utils/bcrypt.ts` - Hash y comparación de contraseñas
   - `src/middleware/auth.middleware.ts` - Middleware para proteger rutas

### Frontend

1. **Context de Autenticación**
   - `contexts/AuthContext.tsx` - Manejo global del estado de autenticación
   - Hook `useAuth()` para acceder al contexto

2. **Páginas**
   - `/login` - Página de inicio de sesión
   - `/registro` - Página de registro
   - `/` - Página principal con información del usuario

3. **Cliente API**
   - `lib/api.ts` - Cliente Axios configurado con interceptores para tokens

## 🧪 Cómo Probar

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234567890"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Respuesta incluirá un `token` que debes usar para las peticiones protegidas.

### 3. Obtener perfil (requiere token)

```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Probar desde el Frontend

1. Abre http://localhost:3000
2. Haz clic en "Registrarse"
3. Completa el formulario
4. Serás redirigido a la página principal con tu información

## 📝 Próximos Pasos

1. **Proteger rutas del frontend**
   - Crear componente `ProtectedRoute`
   - Redirigir a login si no está autenticado

2. **Mejorar UI**
   - Mejor diseño de formularios
   - Mensajes de error más claros
   - Loading states

3. **Funcionalidades adicionales**
   - Recuperación de contraseña
   - Editar perfil
   - Cambiar contraseña

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ Tokens JWT con expiración (7 días por defecto)
- ✅ Validación de datos en el backend
- ✅ Middleware de autenticación para rutas protegidas

## 📚 Archivos Creados

### Backend
- `src/config/passport.ts`
- `src/utils/jwt.ts`
- `src/utils/bcrypt.ts`
- `src/middleware/auth.middleware.ts`
- `src/controllers/auth.controller.ts`
- `src/routes/auth.routes.ts`

### Frontend
- `contexts/AuthContext.tsx`
- `lib/api.ts`
- `pages/login.tsx`
- `pages/registro.tsx`



