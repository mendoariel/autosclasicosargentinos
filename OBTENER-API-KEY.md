# 🔑 Cómo Obtener tu API Key de OpenAI

## Paso 1: Crear una Cuenta en OpenAI

1. Ve a https://platform.openai.com
2. Haz clic en **"Sign up"** (Registrarse) o **"Log in"** (Iniciar sesión) si ya tienes cuenta
3. Completa el registro con tu email o usa Google/Microsoft

## Paso 2: Agregar Método de Pago (Opcional pero Recomendado)

⚠️ **Importante:** Para usar la API necesitas agregar un método de pago, aunque tengas créditos gratuitos.

1. Una vez dentro, ve a **Billing** (Facturación) en el menú
2. Haz clic en **"Add payment method"** (Agregar método de pago)
3. Agrega una tarjeta de crédito o débito
4. **Nota:** OpenAI tiene un límite muy bajo para empezar (como $5 USD), y solo cobra lo que uses

## Paso 3: Obtener tu API Key

1. Ve a https://platform.openai.com/api-keys
2. O desde el menú: **API keys** → **Create new secret key**
3. Dale un nombre a tu key (ej: "Autos Clásicos Argentinos")
4. Haz clic en **"Create secret key"**
5. ⚠️ **IMPORTANTE:** Copia la key inmediatamente, porque solo se muestra una vez
6. Se verá algo así: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Paso 4: Configurar en tu Proyecto

### Opción A: Editar el archivo directamente

```bash
# Edita backend/.env
nano backend/.env
# O con tu editor favorito
code backend/.env
```

Agrega o actualiza esta línea:
```env
OPENAI_API_KEY=sk-proj-tu-api-key-aqui
OPENAI_MODEL=gpt-4o-mini
```

### Opción B: Desde la terminal

```bash
# Agregar la API key al archivo .env
echo "OPENAI_API_KEY=sk-proj-tu-api-key-aqui" >> backend/.env
```

### Opción C: Desde el contenedor Docker

```bash
docker exec -it autosclasicos-backend-dev sh
# Editar .env
nano .env
# Agregar: OPENAI_API_KEY=sk-proj-tu-api-key-aqui
exit
```

## Paso 5: Reiniciar el Backend

```bash
docker compose -f docker-compose.dev.yml restart backend
```

## Verificar que Funciona

```bash
# Verificar que la key está configurada
docker exec autosclasicos-backend-dev grep OPENAI_API_KEY .env
```

## 💰 Costos

- **gpt-4o-mini** (recomendado): Muy económico, ~$0.15 por 1M tokens de entrada
- Una noticia típica usa ~500-1000 tokens = **menos de $0.001 por noticia**
- **gpt-4**: Más caro pero mejor calidad, ~$5-30 por 1M tokens

## 🔒 Seguridad

- ⚠️ **NUNCA** subas tu API key a GitHub o repositorios públicos
- El archivo `.env` ya está en `.gitignore` para protegerlo
- Si expones tu key, revócala inmediatamente en OpenAI y crea una nueva

## 🆓 Créditos Gratuitos

OpenAI a veces ofrece créditos gratuitos para nuevos usuarios:
- Revisa en https://platform.openai.com/account/billing
- Puedes tener $5-18 USD de crédito gratuito

## 📝 Notas

- La API key es personal y no debe compartirse
- Puedes crear múltiples keys para diferentes proyectos
- Puedes revocar keys desde https://platform.openai.com/api-keys



