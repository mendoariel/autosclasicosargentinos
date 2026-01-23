# 🧪 Cómo Probar la Generación de Noticias

## Paso 1: Configurar OpenAI API Key

1. **Obtener API Key:**
   - Ve a https://platform.openai.com/api-keys
   - Inicia sesión o crea una cuenta
   - Crea una nueva API key
   - Cópiala (solo se muestra una vez)

2. **Configurar en el backend:**
   ```bash
   # Editar el archivo backend/.env
   # Agregar o actualizar:
   OPENAI_API_KEY=tu-api-key-aqui
   OPENAI_MODEL=gpt-4o-mini
   ```

   O desde el contenedor:
   ```bash
   docker exec -it autosclasicos-backend-dev sh
   # Editar .env y agregar la API key
   exit
   ```

## Paso 2: Probar la Generación

### Opción A: Usando el Script Automático (Más Fácil)

```bash
./probar-generar-noticia.sh
```

Este script te guiará paso a paso.

### Opción B: Manualmente con cURL

1. **Iniciar sesión para obtener token:**
   ```bash
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"tu-email@ejemplo.com","password":"tu-password"}'
   ```

2. **Copiar el token de la respuesta**

3. **Generar noticia:**
   ```bash
   curl -X POST http://localhost:5001/api/noticias/generar \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TU_TOKEN_AQUI" \
     -d '{}'
   ```

   Para generar sobre un auto específico:
   ```bash
   curl -X POST http://localhost:5001/api/noticias/generar \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TU_TOKEN_AQUI" \
     -d '{"autoId": 1}'
   ```

### Opción C: Desde el Navegador (con extensión)

1. Instala una extensión como "REST Client" o usa Postman
2. Haz POST a `http://localhost:5001/api/noticias/generar`
3. Agrega header: `Authorization: Bearer TU_TOKEN`
4. Body: `{}` o `{"autoId": 1}`

## Paso 3: Ver la Noticia Generada

```bash
# Ver todas las noticias
curl http://localhost:5001/api/noticias

# O visita en el navegador
http://localhost:3000/noticias
```

## Notas Importantes

- ⚠️ **Costo:** Cada generación consume créditos de OpenAI (muy económico con gpt-4o-mini)
- 🔒 **Autenticación:** Necesitas estar logueado para generar noticias
- 🎲 **Auto Aleatorio:** Si no especificas `autoId`, se selecciona un auto aleatorio
- 📝 **Formato:** Las noticias se generan en español argentino con formato HTML

## Troubleshooting

### Error: "OPENAI_API_KEY no configurada"
- Verifica que el archivo `backend/.env` tenga la variable
- Reinicia el backend: `docker compose -f docker-compose.dev.yml restart backend`

### Error: "401 Unauthorized"
- Necesitas estar autenticado
- Inicia sesión primero y usa el token

### Error: "Rate limit exceeded"
- Has excedido el límite de OpenAI
- Espera unos minutos o verifica tu plan de OpenAI



