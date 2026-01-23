# 🌐 Configuración DNS para Producción

## 📋 Registros DNS Necesarios

Para que funcionen todas las URLs de producción, necesitas configurar estos registros DNS:

### Si usas Name Servers de Hetzner (Recomendado)

En Hetzner DNS (https://dns.hetzner.com):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 46.224.152.98 | 3600 |
| A | www | 46.224.152.98 | 3600 |
| A | api | 46.224.152.98 | 3600 |
| A | traefik | 46.224.152.98 | 3600 |

### Si usas Name Servers de AFIP

En AFIP (página de Delegaciones):

| Host | Tipo | IPv4 |
|------|------|------|
| (vacío o @) | A | 46.224.152.98 |
| www | A | 46.224.152.98 |
| api | A | 46.224.152.98 |
| traefik | A | 46.224.152.98 |

## 🎯 URLs que Funcionarán

Una vez configurados los DNS:

- ✅ **Frontend Principal**: https://autosclasicosargentinos.com.ar
- ✅ **Frontend WWW**: https://www.autosclasicosargentinos.com.ar
- ✅ **API Backend**: https://api.autosclasicosargentinos.com.ar
- ✅ **Traefik Dashboard**: https://traefik.autosclasicosargentinos.com.ar

## 📝 Pasos Detallados

### Opción 1: Name Servers de Hetzner (Recomendado)

1. **En AFIP**:
   - Ve a la sección de **Name Servers** o **Servidores de Nombres**
   - Configura:
     - `hydrogen.ns.hetzner.com`
     - `oxygen.ns.hetzner.com`
     - `helium.ns.hetzner.de`

2. **En Hetzner DNS** (https://dns.hetzner.com):
   - Selecciona tu zona `autosclasicosargentinos.com.ar`
   - Ve a la pestaña **Records**
   - Agrega estos registros A:
     ```
     @     A    46.224.152.98
     www   A    46.224.152.98
     api   A    46.224.152.98
     traefik A  46.224.152.98
     ```

### Opción 2: Name Servers de AFIP

1. **En AFIP** (página de Delegaciones):
   - Agrega estos registros A:
     ```
     Host: (vacío)  → IPv4: 46.224.152.98
     Host: www      → IPv4: 46.224.152.98
     Host: api      → IPv4: 46.224.152.98
     Host: traefik  → IPv4: 46.224.152.98
     ```

## ⏱️ Tiempo de Propagación

- **Normal**: 15-30 minutos
- **Máximo**: 24-48 horas

## 🔍 Verificar DNS

Puedes verificar que los DNS están configurados correctamente:

```bash
# Verificar dominio principal
dig autosclasicosargentinos.com.ar

# Verificar subdominio API
dig api.autosclasicosargentinos.com.ar

# Verificar subdominio Traefik
dig traefik.autosclasicosargentinos.com.ar
```

O usar herramientas online:
- https://dnschecker.org
- https://www.whatsmydns.net

## ⚠️ Importante

1. **Todos los subdominios apuntan a la misma IP**: `46.224.152.98`
2. **Traefik se encarga del enrutamiento**: Basado en el `Host` header
3. **Let's Encrypt generará certificados**: Para cada dominio automáticamente

## 🚀 Después de Configurar DNS

Una vez que los DNS estén propagados:

1. Deploya la aplicación (ver `PREPARAR-DEPLOY.md`)
2. Traefik generará automáticamente los certificados SSL
3. Todo funcionará con HTTPS

## 📊 Resumen Visual

```
autosclasicosargentinos.com.ar (A → 46.224.152.98)
├── www.autosclasicosargentinos.com.ar (A → 46.224.152.98)
├── api.autosclasicosargentinos.com.ar (A → 46.224.152.98)
└── traefik.autosclasicosargentinos.com.ar (A → 46.224.152.98)
         ↓
    [Traefik en puerto 80/443]
         ↓
    ┌────┴────┐
    │         │
 Frontend  Backend
```



