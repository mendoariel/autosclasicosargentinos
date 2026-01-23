# 🤖 Generar Noticias con IA

## Configuración

1. **Obtener API Key de OpenAI:**
   - Ve a https://platform.openai.com/api-keys
   - Crea una nueva API key
   - Cópiala

2. **Configurar en backend/.env:**
   ```env
   OPENAI_API_KEY=tu-api-key-aqui
   OPENAI_MODEL=gpt-4o-mini
   ```

## Formas de Generar Noticias

### Opción 1: Usando el Script (Recomendado para pruebas)

```bash
# Generar noticia sobre un auto aleatorio
docker exec autosclasicos-backend-dev npx tsx src/scripts/generar-noticia.ts

# Generar noticia sobre un auto específico (ID 1)
docker exec autosclasicos-backend-dev npx tsx src/scripts/generar-noticia.ts 1
```

### Opción 2: Usando el Endpoint API

```bash
# Primero, inicia sesión para obtener el token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu-email@ejemplo.com","password":"tu-password"}'

# Luego genera una noticia
curl -X POST http://localhost:5001/api/noticias/generar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{}'

# O sobre un auto específico
curl -X POST http://localhost:5001/api/noticias/generar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"autoId": 1}'
```

### Opción 3: Desde el Frontend (próximamente)

Se puede agregar un botón en el panel de administración para generar noticias.

## Ver Noticias Generadas

```bash
# Ver todas las noticias
curl http://localhost:5001/api/noticias

# O visita en el navegador
http://localhost:3000/noticias
```

## Notas

- Las noticias se generan en español argentino
- Si no hay autos en la base de datos, se genera una noticia general
- El modelo por defecto es `gpt-4o-mini` (más económico)
- Puedes cambiar el modelo en `OPENAI_MODEL` (ej: `gpt-4`, `gpt-3.5-turbo`)



