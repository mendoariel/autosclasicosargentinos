#!/bin/bash

# Script para instalar Docker en el servidor Ubuntu

echo "🐳 Instalando Docker..."

# Actualizar paquetes
echo "📦 Actualizando paquetes..."
apt update

# Instalar dependencias
echo "📦 Instalando dependencias..."
apt install -y ca-certificates curl gnupg lsb-release

# Agregar la clave GPG oficial de Docker
echo "🔑 Agregando clave GPG de Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Configurar el repositorio
echo "📝 Configurando repositorio de Docker..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Actualizar e instalar Docker
echo "📦 Instalando Docker Engine..."
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Agregar usuario actual al grupo docker (si no es root)
if [ "$USER" != "root" ]; then
    echo "👤 Agregando usuario $USER al grupo docker..."
    usermod -aG docker $USER
    echo "⚠️  Nota: Necesitarás cerrar sesión y volver a conectarte para que los cambios surtan efecto"
fi

# Iniciar y habilitar Docker
echo "🚀 Iniciando Docker..."
systemctl enable docker
systemctl start docker

# Verificar instalación
echo "✅ Verificando instalación..."
docker --version
docker compose version

echo ""
echo "🎉 ¡Docker instalado exitosamente!"
echo ""
echo "Para verificar que funciona:"
echo "  docker run hello-world"



