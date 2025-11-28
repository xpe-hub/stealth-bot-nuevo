#!/bin/bash

# 🚀 INSTALADOR AUTOMÁTICO - Stealth Community Stealth Bot
# Bot de monitoreo y análisis anti-cheat
# Desarrollado por: xpe.nettt

echo "🔴 =========================================="
echo "🔴 STEALTH COMMUNITY STEALTH - INSTALADOR"
echo "🔴 Bot de Monitoreo Anti-Cheat"
echo "🔴 =========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo -e "${YELLOW}📥 Descarga e instala Node.js desde: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm encontrado: $NPM_VERSION${NC}"
echo ""

# Verificar archivo .env
echo -e "${BLUE}📋 Verificando configuración...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
    echo -e "${YELLOW}📝 Creando archivo .env con configuración básica...${NC}"
    
    cat > .env << 'EOF'
# Stealth Community Stealth - Discord Bot Configuration

# Discord Bot Token (OBLIGATORIO)
DISCORD_BOT_TOKEN=PUT_YOUR_DISCORD_BOT_TOKEN_HERE

# GitHub Integration
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_REPO_OWNER=xpe-hub
GITHUB_REPO_NAME=Stealth-AntiCheatX

# Bot Owner Configuration (OBLIGATORIO)
BOT_OWNER_ID=PUT_YOUR_USER_ID_HERE
BOT_PREFIX=$

# Webhook Configuration
ANTICHEAT_WEBHOOK_URL=YOUR_ANTICHEAT_WEBHOOK_URL

# Database Configuration
DATABASE_PATH=./data/stealth.db

# Community Stealth Configuration
COMMUNITY_STEALTH_URL=https://discord.gg/3sCxhWShvu
COMMUNITY_STEALTH_NAME=Community Stealth

# Bot Status
BOT_STATUS=🛡️ AntiCheat para Community Stealth
BOT_ACTIVITY=PLAYING
EOF
    
    echo -e "${YELLOW}📝 Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️ IMPORTANTE: Debes configurar los tokens antes de continuar${NC}"
    echo ""
    echo -e "${BLUE}📋 CONFIGURACIÓN REQUERIDA:${NC}"
    echo -e "1. ${GREEN}DISCORD_BOT_TOKEN${NC}: Obténlo del Discord Developer Portal"
    echo -e "2. ${GREEN}BOT_OWNER_ID${NC}: Tu ID de Discord (Activar Modo Desarrollador)"
    echo ""
    echo -e "${YELLOW}🔧 Para obtener tu User ID:${NC}"
    echo -e "1. Ve a Discord > Configuración de Usuario > Avanzado > Modo Desarrollador"
    echo -e "2. Click derecho en tu perfil > Copiar ID"
    echo ""
    echo -e "${YELLOW}🔧 Para crear un bot:${NC}"
    echo -e "1. Ve a https://discord.com/developers/applications"
    echo -e "2. Crea nueva aplicación > Bot > Reset Token"
    echo ""
else
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
fi

# Verificar configuración
echo ""
echo -e "${BLUE}🔍 Verificando configuración de tokens...${NC}"
source .env

MISSING_CONFIG=""

if [[ "$DISCORD_BOT_TOKEN" == "PUT_YOUR_DISCORD_BOT_TOKEN_HERE" ]]; then
    MISSING_CONFIG="${MISSING_CONFIG}Discord Bot Token, "
fi

if [[ "$BOT_OWNER_ID" == "PUT_YOUR_USER_ID_HERE" ]]; then
    MISSING_CONFIG="${MISSING_CONFIG}Owner ID, "
fi

if [ ! -z "$MISSING_CONFIG" ]; then
    echo -e "${RED}❌ Configuración incompleta:${NC}"
    echo -e "${RED}   Faltan: ${MISSING_CONFIG%??}${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Configura el archivo .env y ejecuta este script nuevamente${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuración verificada${NC}"
echo ""

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# Crear directorios necesarios
echo ""
echo -e "${BLUE}📁 Creando directorios...${NC}"
mkdir -p data
mkdir -p logs

echo -e "${GREEN}✅ Directorios creados${NC}"

# Verificar permisos del bot
echo ""
echo -e "${BLUE}🔐 Verificando configuración del bot...${NC}"
echo -e "${YELLOW}💡 Asegúrate de que el bot tenga los siguientes permisos:${NC}"
echo -e "${GREEN}✅ Send Messages${NC}"
echo -e "${GREEN}✅ Embed Links${NC}"
echo -e "${GREEN}✅ Read Message History${NC}"
echo -e "${GREEN}✅ Use Slash Commands${NC}"
echo -e "${GREEN}✅ Server Members Intent${NC}"
echo ""

# Resultado final
echo -e "${GREEN}🎉 ==========================================${NC}"
echo -e "${GREEN}🎉 INSTALACIÓN COMPLETADA EXITOSAMENTE${NC}"
echo -e "${GREEN}🎉 ==========================================${NC}"
echo ""
echo -e "${BLUE}📋 RESUMEN DE INSTALACIÓN:${NC}"
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
echo -e "${GREEN}✅ Dependencias: Instaladas${NC}"
echo -e "${GREEN}✅ Base de datos: Lista${NC}"
echo -e "${GREEN}✅ Configuración: Verificada${NC}"
echo ""

echo -e "${BLUE}🚀 PRÓXIMOS PASOS:${NC}"
echo -e "1. ${YELLOW}Editar .env${NC}: Configura DISCORD_BOT_TOKEN y BOT_OWNER_ID si no lo has hecho"
echo -e "2. ${YELLOW}Invitar bot${NC}: Usar token del Discord Developer Portal"
echo -e "3. ${YELLOW}Iniciar bot${NC}: ./start.sh o npm start"
echo ""

echo -e "${BLUE}📖 DOCUMENTACIÓN:${NC}"
echo -e "• README.md: Guía completa del bot"
echo -e "• Comandos: \$help para ver lista completa"
echo ""

echo -e "${GREEN}🛡️ ¡El bot está listo para proteger Community Stealth!${NC}"
echo -e "${BLUE}🌐 Comunidad: https://discord.gg/3sCxhWShvu${NC}"
echo ""

# Preguntar si iniciar el bot
read -p "¿Quieres iniciar el bot ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Iniciando Stealth-AntiCheatX Bot...${NC}"
    npm start
fi

echo ""
echo -e "${GREEN}👋 ¡Gracias por usar Community Stealth!${NC}"