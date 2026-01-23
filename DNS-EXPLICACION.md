# Explicación: Configuración DNS - Dos Opciones

## ⚠️ IMPORTANTE: Hay dos formas de configurar DNS

### Opción 1: Usar Name Servers de Hetzner (RECOMENDADO) ✅

Si usas los name servers de Hetzner, entonces:

1. **En AFIP** (página de Delegaciones):
   - NO agregues registros A directamente
   - En su lugar, busca la sección de **"Name Servers"** o **"Servidores de Nombres"**
   - Configura estos name servers de Hetzner:
     - `hydrogen.ns.hetzner.com`
     - `oxygen.ns.hetzner.com`
     - `helium.ns.hetzner.de`

2. **En Hetzner** (página que estás viendo):
   - Una vez que los name servers estén configurados en AFIP
   - Ve a la pestaña **"Records"** (no "Name servers")
   - Ahí es donde agregas los registros A:
     - Type: `A`, Name: `@`, Value: `46.224.152.98`
     - Type: `A`, Name: `www`, Value: `46.224.152.98`

### Opción 2: Usar Name Servers de AFIP

Si prefieres mantener los name servers de AFIP:

1. **En AFIP** (página de Delegaciones):
   - Agrega los registros A directamente:
     - Host: (vacío o @), IPv4: `46.224.152.98`
     - Host: `www`, IPv4: `46.224.152.98`
   - NO cambies los name servers

2. **En Hetzner**:
   - NO necesitas hacer nada aquí si usas esta opción

## ¿Cuál opción usar?

**Recomendación: Opción 1 (Name Servers de Hetzner)**
- Más fácil de gestionar desde Hetzner
- Mejor integración con el servidor
- Puedes gestionar todos los DNS desde un solo lugar

## Pasos para Opción 1 (Recomendada):

### Paso 1: En AFIP - Configurar Name Servers
1. Ve a la sección de **"Name Servers"** o **"Servidores de Nombres"** en AFIP
2. Cambia los name servers a:
   - `hydrogen.ns.hetzner.com`
   - `oxygen.ns.hetzner.com`
   - `helium.ns.hetzner.de`
3. Guarda los cambios

### Paso 2: En Hetzner - Agregar Registros A
1. Ve a la pestaña **"Records"** en Hetzner
2. Agrega:
   - Type: `A`, Name: `@`, Value: `46.224.152.98`
   - Type: `A`, Name: `www`, Value: `46.224.152.98`

### Paso 3: Esperar propagación
- Los cambios pueden tardar 15-30 minutos (hasta 48 horas máximo)



