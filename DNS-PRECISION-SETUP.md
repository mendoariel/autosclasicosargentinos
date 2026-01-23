# 🌐 Configuración DNS para precisionmotos.com.ar

El error `DNS_PROBE_FINISHED_NXDOMAIN` indica que el dominio no está resolviendo a ninguna dirección IP. 

Según la verificación:
1. ✅ El dominio está correctamente delegado a Hetzner en **NIC.ar**.
2. ❌ Los servidores de nombres de Hetzner están **rechazando** las consultas (REFUSED), lo que significa que la **Zona DNS** no existe o no tiene registros en tu cuenta de Hetzner.

## 📋 Pasos para solucionar el problema

Sigue estos pasos en el panel de **Hetzner DNS** (https://dns.hetzner.com):

### 1. Crear la Zona DNS (Si no existe)
Si no ves `precisionmotos.com.ar` en tu lista de zonas:
- Haz clic en **"Add new zone"**.
- Ingresa `precisionmotos.com.ar`.
- Selecciona la opción de usar los servidores de nombres predeterminados de Hetzner (`hydrogen`, `oxygen`, `helium`).

### 2. Agregar los Registros A
Dentro de la zona `precisionmotos.com.ar`, agrega los siguientes registros en la pestaña **"Records"**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 46.224.152.98 | 3600 |
| A | www | 46.224.152.98 | 3600 |

> [!IMPORTANT]
> La IP `46.224.152.98` es la misma que usa tu sitio principal. Traefik se encargará de dirigir el tráfico al contenedor correcto basándose en el nombre del dominio.

### 3. Verificar en NIC.ar
Asegúrate de que en NIC.ar los servidores de nombres sean exactamente estos:
- `hydrogen.ns.hetzner.com`
- `oxygen.ns.hetzner.com`
- `helium.ns.hetzner.de`

## 🔒 Configuración HTTPS (Automática)

¡Buenas noticias! La configuración para HTTPS ya está lista en el servidor:

1. **Traefik ya está configurado**: En el archivo `docker-compose.yml`, el servicio `precisionmotos` ya tiene las etiquetas necesarias:
   - `certresolver=letsencrypt`
   - `entrypoints=websecure` (puerto 443)

2. **Certificado Let's Encrypt**: Una vez que los DNS (`precisionmotos.com.ar` y `www.precisionmotos.com.ar`) apunten correctamente a la IP del servidor, Traefik detectará el tráfico y solicitará automáticamente el certificado SSL gratuito a Let's Encrypt.

3. **Redirección automática**: Traefik está configurado para redirigir todo el tráfico de `http` (puerto 80) a `https` (puerto 443) de forma automática.

> [!TIP]
> No necesitas hacer nada adicional en el código. Solo asegúrate de que los DNS estén propagados. Cuando entres al sitio por primera vez después de la propagación, Traefik tardará unos segundos en generar el certificado y luego verás el candado verde.

## ⏱️ Tiempo de espera
Una vez que agregues los registros A en Hetzner:
- La propagación suele tardar entre **15 y 30 minutos**.
- Puedes verificarlo con este comando:
  ```bash
  dig precisionmotos.com.ar +short
  ```

## 🚀 Verificación del Servidor
He verificado que el servidor y los contenedores están funcionando correctamente:
- Docker status: `UP`
- Container `precisionmotos`: `UP`
- Traefik: `UP`

El problema es únicamente la configuración de los registros DNS en el panel de Hetzner.
