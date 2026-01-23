# Autos Clásicos Argentinos - Servidor Hetzner

## Conexión SSH al Servidor

### Opción 1: Usar el script de conexión

1. Obtén la IP del servidor desde la [consola de Hetzner](https://console.hetzner.com/projects/12950212/servers/116791322/overview)
2. Ejecuta:
   ```bash
   chmod +x connect.sh
   ./connect.sh <IP_DEL_SERVIDOR>
   ```

### Opción 2: Configuración SSH manual

1. Edita el archivo `.ssh/config` y reemplaza `TU_IP_AQUI` con la IP real del servidor
2. Conecta usando:
   ```bash
   ssh hetzner-autosclasicos
   ```

### Opción 3: Conexión directa

```bash
ssh root@<IP_DEL_SERVIDOR>
```

## Configuración inicial del servidor

Una vez conectado, es recomendable:

1. **Actualizar el sistema:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Crear un usuario no-root (recomendado):**
   ```bash
   adduser tu_usuario
   usermod -aG sudo tu_usuario
   ```

3. **Configurar firewall:**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

4. **Instalar herramientas básicas:**
   ```bash
   apt install -y git curl wget vim
   ```

## Notas

- El usuario por defecto en servidores nuevos de Hetzner suele ser `root`
- Si usas autenticación por clave SSH, asegúrate de tener tu clave pública en el servidor
- Puedes copiar tu clave SSH con: `ssh-copy-id root@<IP_DEL_SERVIDOR>`



