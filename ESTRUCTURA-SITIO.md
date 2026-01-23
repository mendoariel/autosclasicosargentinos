# 🎨 Estructura del Sitio - Autos Clásicos Argentinos

## ✅ Completado

### Frontend
- ✅ **Layout Component**: Navegación unificada con header y footer
- ✅ **Página de Inicio** (`/`): Hero section y tarjetas de servicios
- ✅ **Página de Autos** (`/autos`): Listado de autos clásicos publicados
- ✅ **Página Publicar** (`/publicar`): Formulario para publicar un auto clásico
- ✅ **Página Cotizar** (`/cotizar`): Formulario de cotización de seguros
- ✅ **Página Noticias** (`/noticias`): Listado de noticias generadas por IA

### Backend
- ✅ **Rutas de Autos** (`/api/autos`):
  - `GET /api/autos` - Listar todos los autos
  - `GET /api/autos/:id` - Obtener un auto por ID
  - `POST /api/autos` - Crear un auto (requiere autenticación)
  - `PUT /api/autos/:id` - Actualizar un auto (requiere autenticación)
  - `DELETE /api/autos/:id` - Eliminar un auto (requiere autenticación)

- ✅ **Rutas de Cotizaciones** (`/api/cotizaciones`):
  - `POST /api/cotizaciones` - Crear una cotización (público)
  - `GET /api/cotizaciones` - Obtener historial de cotizaciones (requiere autenticación)

- ✅ **Rutas de Noticias** (`/api/noticias`):
  - `GET /api/noticias` - Listar todas las noticias publicadas
  - `GET /api/noticias/:id` - Obtener una noticia por ID

## 📋 Funcionalidades Implementadas

### 1. Publicar Clásico
- Formulario completo con campos:
  - Marca, Modelo, Año (requeridos)
  - Precio, Kilometraje, Color, Combustible (opcionales)
  - Descripción (requerida)
  - Upload de imagen
- Validación de campos requeridos
- Protección de rutas (requiere autenticación)
- Guardado de imágenes en `/app/uploads`

### 2. Cotizar Seguro
- Formulario de cotización:
  - Marca, Modelo, Año, Valor Asegurado (requeridos)
  - Uso (Particular, Comercial, Exhibición)
- Cálculo automático de prima:
  - Prima mensual y anual
  - Ajuste por antigüedad del vehículo
  - Ajuste por tipo de uso
  - Determinación de cobertura
- Visualización de resultados en tiempo real

### 3. Noticias
- Listado de noticias publicadas
- Información del auto relacionado (si aplica)
- Fecha de publicación
- Imágenes (si aplica)

## 🎯 Próximos Pasos

1. **Sistema de Generación de Noticias Automáticas**
   - Integración con OpenAI
   - Cron job diario
   - Generación de contenido sobre autos clásicos

2. **Mejoras de UI/UX**
   - Página de detalle de auto
   - Filtros y búsqueda en listado de autos
   - Paginación
   - Mejoras visuales

3. **Funcionalidades Adicionales**
   - Edición de autos publicados
   - Eliminación de autos
   - Historial de cotizaciones del usuario
   - Perfil de usuario

## 🔧 Configuración Técnica

### Upload de Imágenes
- Directorio: `/app/uploads` (configurable con `UPLOAD_DIR`)
- Límite: 10MB por archivo
- Formatos: Solo imágenes
- Servido estáticamente en `/uploads`

### Base de Datos
- Modelos actualizados en Prisma:
  - `Auto`: Agregados campos `color`, `combustible`, `imagenUrl`
  - `Cotizacion`: Agregados campos `marca`, `modelo`, `ano`, `cobertura`, `primaAnual`, `uso`
  - `Noticia`: Usa `fechaPublicacion` para ordenamiento

## 📝 Notas

- El esquema de Prisma necesita una migración después de los cambios
- Las imágenes se guardan en memoria y luego se escriben al sistema de archivos
- La lógica de cotización es simplificada y puede mejorarse con más factores



