# Configuración de GitHub Actions para Despliegue Automático

Para que el despliegue automático funcione, necesitas configurar **Secretos** en tu repositorio de GitHub. Esto permite que GitHub se conecte a tu servidor de manera segura.

## Paso 1: Obtener la Clave Privada (SSH Key)

Necesitamos la clave privada que usas para conectarte al servidor.

1.  En tu terminal local (Mac), muestra tu clave privada (hemos confirmado que es `id_ed25519`):
    ```bash
    cat ~/.ssh/id_ed25519
    ```
    Copia **todo el contenido**, incluyendo `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----`.

## Paso 2: Agregar Secretos en GitHub

1.  Ve a tu repositorio en GitHub.
2.  Haz clic en **Settings** (Configuración) > **Secrets and variables** > **Actions**.
3.  Haz clic en **New repository secret**.
4.  Agrega los siguientes secretos:

    | Nombre | Valor |
    | :--- | :--- |
    | `HOST` | `46.224.152.98` |
    | `USERNAME` | `root` |
    | `SSH_PRIVATE_KEY` | *(Pega aquí el contenido de tu clave privada que copiaste en el Paso 1)* |

## Paso 3: Verificar

Una vez configurado:
1.  Haz un cambio en tu código y súbelo (`git push origin main`).
2.  Ve a la pestaña **Actions** en GitHub.
3.  Verás que se inicia un workflow llamado "Deploy to Production".
4.  Si todo sale bien, verás un ✅ verde y tu servidor se habrá actualizado.
