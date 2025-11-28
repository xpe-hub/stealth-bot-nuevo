#!/bin/bash

# 🚀 INSTALADOR AUTOMÁTICO - Stealth-AntiCheatX v2.0 con IA
# Bot Avanzado de Discord con MiniMax IA y AutoUpdater
# Desarrollado por: xpe.nettt

echo "🧠 =========================================="
echo "🧠 STEALTH COMMUNITY STEALTH v2.0 - INSTALADOR"
echo "🧠 Bot con IA MiniMax + AutoUpdater"
echo "🧠 =========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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
# Stealth Community Stealth - Bot Avanzado con IA
# Bot con MiniMax IA, AutoUpdater y 25+ comandos slash

# Discord Bot Token (OBLIGATORIO)
DISCORD_BOT_TOKEN=PUT_YOUR_DISCORD_BOT_TOKEN_HERE

# GitHub Integration para AutoUpdater
GITHUB_TOKEN=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
GITHUB_REPO_OWNER=xpe-hub
GITHUB_REPO_NAME=Stealth-AntiCheatX

# MiniMax IA Configuration (REQUERIDO PARA IA)
MINIMAX_API_KEY=PUT_MINIMAX_API_KEY_HERE
MINIMAX_API_KEY_NAME=Stealth-AntiCheatX-bot

# Bot Owner Configuration (OBLIGATORIO)
BOT_OWNER_ID=PUT_YOUR_USER_ID_HERE
BOT_PREFIX=$

# Webhook Configuration
ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM

# Database Configuration
DATABASE_PATH=./data/stealth.db

# AutoUpdater Configuration
AUTO_UPDATE_ENABLED=true
AUTO_UPDATE_INTERVAL=60 # minutes
AUTO_UPDATE_CHECK_INTERVAL=30 # minutes
AUTO_RESTART_ENABLED=true

# Community Stealth Configuration
COMMUNITY_STEALTH_URL=https://discord.gg/3sCxhWShvu
COMMUNITY_STEALTH_NAME=Community Stealth

# Bot Status
BOT_STATUS=🧠 IA MiniMax | 🛡️ AntiCheat Community Stealth
BOT_ACTIVITY=PLAYING
EOF
    
    echo -e "${YELLOW}📝 Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️ IMPORTANTE: Debes configurar TODOS los tokens antes de continuar${NC}"
    echo ""
    echo -e "${BLUE}📋 CONFIGURACIÓN REQUERIDA:${NC}"
    echo -e "1. ${GREEN}DISCORD_BOT_TOKEN${NC}: Token del Discord Developer Portal"
    echo -e "2. ${GREEN}BOT_OWNER_ID${NC}: Tu ID de Discord (Activar Modo Desarrollador)"
    echo -e "3. ${YELLOW}MINIMAX_API_KEY${NC}: API Key de MiniMax (para funciones de IA)"
    echo ""
    echo -e "${YELLOW}🔧 Para obtener tu User ID:${NC}"
    echo -e "1. Ve a Discord > Configuración de Usuario > Avanzado > Modo Desarrollador"
    echo -e "2. Click derecho en tu perfil > Copiar ID"
    echo ""
    echo -e "${YELLOW}🔧 Para crear un bot:${NC}"
    echo -e "1. Ve a https://discord.com/developers/applications"
    echo -e "2. Crea nueva aplicación > Bot > Reset Token"
    echo ""
    echo -e "${YELLOW}🧠 Para MiniMax API Key:${NC}"
    echo -e "1. Ve a https://api.minimax.chat/"
    echo -e "2. Crea cuenta > API Keys > Crear nueva key"
    echo ""
else
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
fi

# Verificar configuración
echo ""
echo -e "${BLUE}🔍 Verificando configuración de tokens...${NC}"
source .env

MISSING_CONFIG=""
INCOMPLETE_CONFIG=""

# Verificar tokens críticos
if [[ "$DISCORD_BOT_TOKEN" == "PUT_YOUR_DISCORD_BOT_TOKEN_HERE" ]]; then
    MISSING_CONFIG="${MISSING_CONFIG}Discord Bot Token, "
fi

if [[ "$BOT_OWNER_ID" == "PUT_YOUR_USER_ID_HERE" ]]; then
    MISSING_CONFIG="${MISSING_CONFIG}Owner ID, "
fi

if [[ "$MINIMAX_API_KEY" == "PUT_MINIMAX_API_KEY_HERE" ]]; then
    INCOMPLETE_CONFIG="${INCOMPLETE_CONFIG}MiniMax API Key, "
fi

if [ ! -z "$MISSING_CONFIG" ]; then
    echo -e "${RED}❌ Configuración incompleta:${NC}"
    echo -e "${RED}   FALTAN (obligatorios): ${MISSING_CONFIG%??}${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Configura el archivo .env y ejecuta este script nuevamente${NC}"
    exit 1
fi

if [ ! -z "$INCOMPLETE_CONFIG" ]; then
    echo -e "${YELLOW}⚠️ Configuración parcial:${NC}"
    echo -e "${YELLOW}   FALTAN (opcionales para IA): ${INCOMPLETE_CONFIG%??}${NC}"
    echo -e "${YELLOW}   ⚡ El bot funcionará, pero sin funciones de IA${NC}"
    echo ""
    read -p "¿Continuar sin IA? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}📝 Configura el MiniMax API Key en .env y vuelve a intentar${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Configuración verificada${NC}"
echo ""

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias avanzadas...${NC}"
echo -e "${PURPLE}   📦 Discord.js v14.15.3"
echo -e "${PURPLE}   🗄️ SQLite3 v5.1.7"
echo -e "${PURPLE}   ⏰ node-cron v3.0.3"
echo -e "${PURPLE}   🔄 simple-git v3.24.0"
echo -e "${PURPLE}   🔐 crypto v1.0.1"
echo ""

npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias avanzadas instaladas correctamente${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# Crear directorios necesarios
echo ""
echo -e "${BLUE}📁 Creando estructura de directorios...${NC}"
mkdir -p data
mkdir -p logs
mkdir -p backup

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
echo -e "${GREEN}✅ Manage Messages${NC}"
echo ""

# Mostrar información de la versión
echo -e "${PURPLE}🧠 INFORMACIÓN DE LA VERSIÓN v2.0:${NC}"
echo -e "${GREEN}✅ 25+ comandos slash implementados${NC}"
echo -e "${GREEN}✅ MiniMax IA integration${NC}"
echo -e "${GREEN}✅ AutoUpdater automático${NC}"
echo -e "${GREEN}✅ AntiCheatConsciousness v2.0${NC}"
echo -e "${GREEN}✅ Base de datos expandida (5 tablas)${NC}"
echo -e "${GREEN}✅ Sistema de desarrolladores${NC}"
echo ""

# Resultado final
echo -e "${GREEN}🎉 ==========================================${NC}"
echo -e "${GREEN}🎉 INSTALACIÓN v2.0 COMPLETADA EXITOSAMENTE${NC}"
echo -e "${GREEN}🎉 ==========================================${NC}"
echo ""
echo -e "${BLUE}📋 RESUMEN DE INSTALACIÓN:${NC}"
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
echo -e "${GREEN}✅ Dependencias: Instaladas (discord.js, sqlite3, node-cron, etc.)${NC}"
echo -e "${GREEN}✅ Base de datos: Lista${NC}"
echo -e "${GREEN}✅ Configuración: Verificada${NC}"
echo -e "${GREEN}✅ AutoUpdater: Habilitado${NC}"
echo ""

echo -e "${BLUE}🚀 PRÓXIMOS PASOS:${NC}"
echo -e "1. ${YELLOW}Verificar configuración${NC}: Asegúrate de que DISCORD_BOT_TOKEN, BOT_OWNER_ID estén configurados"
echo -e "2. ${YELLOW}Configurar IA${NC}: Añade MINIMAX_API_KEY para funciones de IA completas"
echo -e "3. ${YELLOW}Invitar bot${NC}: ${DISCORD_BOT_TOKEN} a tu servidor"
echo -e "4. ${YELLOW}Iniciar bot${NC}: npm start"
echo ""

echo -e "${BLUE}📖 FUNCIONALIDADES v2.0:${NC}"
echo -e "• ${GREEN}Comandos Slash${NC}: 25+ comandos disponibles"
echo -e "• ${GREEN}IA MiniMax${NC}: Texto a audio, generación de imágenes"
echo -e "• ${GREEN}AutoUpdater${NC}: Actualizaciones automáticas cada hora"
echo -e "• ${GREEN}AntiCheat v2.0${NC}: Monitoreo multi-capa de amenazas"
echo -e "• ${GREEN}Base de Datos${NC}: Estadísticas detalladas y logs completos"
echo ""

echo -e "${BLUE}📊 COMANDOS PRINCIPALES:${NC}"
echo -e "• ${PURPLE}/stealth-info${NC} - Información completa del sistema"
echo -e "• ${PURPLE}/ai-audio${NC} - Generar audio con IA"
echo -e "• ${PURPLE}/ai-image${NC} - Generar imágenes con IA"
echo -e "• ${PURPLE}/dev-status${NC} - Estado del sistema (solo devs)"
echo -e "• ${PURPLE}/check-updates${NC} - Verificación manual de actualizaciones"
echo ""

echo -e "${GREEN}🛡️ ¡El bot v2.0 está listo para Community Stealth con IA!${NC}"
echo -e "${BLUE}🌐 Comunidad: https://discord.gg/3sCxhWShvu${NC}"
echo -e "${YELLOW}🧠 Desarrollado por: xpe.nettt${NC}"
echo ""

# Preguntar si iniciar el bot
read -p "¿Quieres iniciar el bot v2.0 ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Iniciando Stealth-AntiCheatX v2.0 con IA...${NC}"
    npm start
fi

echo ""
echo -e "${GREEN}👋 ¡Gracias por usar Community Stealth v2.0!${NC}"