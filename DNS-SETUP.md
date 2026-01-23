# Configuración DNS para autosclasicosargentinos.com.ar

## Registros DNS necesarios

Para que tu dominio apunte al servidor de Hetzner, necesitas agregar los siguientes registros:

### 1. Registro A para el dominio raíz (@)

En el panel de DNS que estás viendo:

- **Type**: `A`
- **Name**: `@` (esto representa el dominio raíz: autosclasicosargentinos.com.ar)
- **Value**: `46.224.152.98` (IP de tu servidor)
- **TTL**: `3600` (o el valor por defecto)
- **Comment**: (opcional) "Servidor principal"

### 2. Registro A para www

- **Type**: `A`
- **Name**: `www`
- **Value**: `46.224.152.98` (misma IP)
- **TTL**: `3600`
- **Comment**: (opcional) "Subdominio www"

## Pasos en el panel:

1. En la sección **"ADD RECORD"**:
   - Selecciona **Type**: `A`
   - En **Name**: escribe `@`
   - En **Value**: escribe `46.224.152.98`
   - Deja **TTL** en el valor por defecto (3600)
   - Haz clic en **"Add"**

2. Repite el proceso para `www`:
   - **Type**: `A`
   - **Name**: `www`
   - **Value**: `46.224.152.98`
   - Haz clic en **"Add"**

## Verificación

Después de agregar los registros, deberías ver en **"RECORD OVERVIEW"**:

```
TYPE    NAME    VALUE              TTL
A       @       46.224.152.98      3600
A       www     46.224.152.98      3600
```

## Tiempo de propagación

- Los cambios DNS pueden tardar entre **5 minutos y 48 horas** en propagarse
- Normalmente toma entre 15-30 minutos
- Puedes verificar la propagación en: https://www.whatsmydns.net/

## Configurar Nginx para el dominio

Una vez que los DNS estén configurados, ejecuta el script de configuración:

```bash
# Copiar el script al servidor
scp -F .ssh/config setup-domain.sh hetzner-autosclasicos:/tmp/

# Conectarse y ejecutar
ssh hetzner-autosclasicos
chmod +x /tmp/setup-domain.sh
sudo /tmp/setup-domain.sh
```

O ejecuta directamente desde tu máquina local:
```bash
ssh -F .ssh/config hetzner-autosclasicos < setup-domain.sh
```

## Verificación final

Después de configurar DNS y Nginx:

1. **Verifica DNS** (puede tardar unos minutos):
   ```bash
   dig autosclasicosargentinos.com.ar +short
   # Debería mostrar: 46.224.152.98
   ```

2. **Verifica que el sitio responde**:
   ```bash
   curl -I http://autosclasicosargentinos.com.ar
   ```

3. **Visita en el navegador**:
   - http://autosclasicosargentinos.com.ar
   - http://www.autosclasicosargentinos.com.ar

