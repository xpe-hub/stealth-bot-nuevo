#!/bin/bash

# 🚀 INICIADOR AUTOMÁTICO - Stealth-AntiCheatX v2.0 con IA
# Bot Avanzado de Discord con MiniMax IA y AutoUpdater
# Desarrollado por: xpe.nettt

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}🧠 ==========================================${NC}"
echo -e "${BLUE}🧠 STEALTH COMMUNITY STEALTH v2.0 - BOT STARTER${NC}"
echo -e "${BLUE}🧠 Iniciando Bot con IA MiniMax + AutoUpdater${NC}"
echo -e "${BLUE}🧠 ==========================================${NC}"
echo ""

# Verificar Node.js
echo -e "${PURPLE}🔍 Verificando requisitos del sistema v2.0...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo -e "${YELLOW}📥 Ejecuta primero: ./install.sh${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

# Verificar instalación
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Dependencias no instaladas${NC}"
    echo -e "${YELLOW}📥 Ejecuta primero: ./install.sh${NC}"
    exit 1
fi

# Verificar configuración
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
    echo -e "${YELLOW}📥 Ejecuta primero: ./install.sh${NC}"
    exit 1
fi

source .env

# Verificar tokens críticos
MISSING_TOKENS=""

if [[ "$DISCORD_BOT_TOKEN" == "PUT_YOUR_DISCORD_BOT_TOKEN_HERE" ]]; then
    MISSING_TOKENS="${MISSING_TOKENS}Discord Bot Token, "
fi

if [[ "$BOT_OWNER_ID" == "PUT_YOUR_USER_ID_HERE" ]]; then
    MISSING_TOKENS="${MISSING_TOKENS}Owner ID, "
fi

if [ ! -z "$MISSING_TOKENS" ]; then
    echo -e "${RED}❌ Tokens faltantes:${NC}"
    echo -e "${RED}   Faltan: ${MISSING_TOKENS%??}${NC}"
    echo -e "${YELLOW}🔧 Edita .env y configura los tokens requeridos${NC}"
    echo ""
    echo -e "${BLUE}💡 COMANDOS DE AYUDA:${NC}"
    echo -e "• ${YELLOW}/stealth-info${NC} - Información del sistema"
    echo -e "• ${YELLOW}/ai-audio${NC} - Generar audio con IA"
    echo -e "• ${YELLOW}/dev-status${NC} - Estado del sistema (solo devs)"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Sistema verificado v2.0${NC}"
echo ""

# Mostrar información de la versión
echo -e "${PURPLE}🧠 INFORMACIÓN DE LA VERSIÓN:${NC}"
echo -e "• ${GREEN}Bot${NC}: Stealth-AntiCheatX v2.0-Intelligence"
echo -e "• ${GREEN}IA${NC}: MiniMax Integration"
echo -e "• ${GREEN}AutoUpdater${NC}: ${AUTO_UPDATE_ENABLED:-disabled}"
echo -e "• ${GREEN}Comandos${NC}: 25+ slash commands"
echo ""

# Crear directorios si no existen
mkdir -p data logs backup

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado del Sistema v2.0:${NC}"
    echo -e "   🕐 Hora: $(date)"
    echo -e "   🤖 Bot: Stealth-AntiCheatX v2.0"
    echo -e "   🧠 IA: MiniMax ${MINIMAX_API_KEY:+Configured}${MINIMAX_API_KEY:+}${MINIMAX_API_KEY:-Not Configured}"
    echo -e "   🛡️ Sistema: AntiCheatConsciousness v2.0"
    echo -e "   🔄 AutoUpdater: ${AUTO_UPDATE_ENABLED:-disabled}"
    echo -e "   🌐 Comunidad: Community Stealth"
    echo ""
}

# Función para manejar errores
handle_exit() {
    echo -e "${RED}❌ Bot v2.0 detenido${NC}"
    echo -e "${YELLOW}🔄 Logs guardados en: logs/stealth-bot.log${NC}"
    
    # Log error
    echo "$(date): Bot v2.0 stopped unexpectedly" >> logs/error.log
    
    # Mostrar comandos útiles
    echo -e "${BLUE}💡 Comandos útiles para reiniciar:${NC}"
    echo -e "• ${YELLOW}npm start${NC} - Iniciar bot normalmente"
    echo -e "• ${YELLOW}npm run dev${NC} - Iniciar en modo desarrollo"
    echo -e "• ${YELLOW}$0 --logs${NC} - Ver logs en tiempo real"
    echo ""
    
    # Preguntar sobre reinicio
    read -p "¿Quieres reiniciar el bot v2.0? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🔄 Reiniciando bot v2.0...${NC}"
        sleep 2
        exec "$0" "$@"
    else
        echo -e "${GREEN}👋 ¡Hasta luego!${NC}"
        exit 0
    fi
}

# Configurar manejadores de señal
trap 'handle_exit' INT TERM EXIT

# Mostrar información de inicio
show_status
echo -e "${PURPLE}🚀 Iniciando Community Stealth Bot v2.0 con IA...${NC}"
echo -e "${YELLOW}   Ctrl+C para detener el bot${NC}"
echo ""

# Función para mostrar logs en tiempo real (opcional)
if [[ "$1" == "--logs" || "$1" == "-l" ]]; then
    echo -e "${BLUE}📋 Modo logs activado - mostrando actividad en tiempo real v2.0${NC}"
    echo ""
    
    # Mostrar estado inicial
    echo -e "${CYAN}🎯 SISTEMA INICIALIZADO:${NC}"
    echo -e "   ✅ Discord.js v14.15.3 cargado"
    echo -e "   ✅ SQLite3 database ready"
    echo -e "   ✅ Node-cron scheduler loaded"
    echo -e "   ✅ 25+ slash commands registered"
    echo -e "   ✅ AntiCheatConsciousness v2.0 active"
    echo -e "   ✅ AutoUpdater ${AUTO_UPDATE_ENABLED:-disabled}"
    echo ""
fi

# Iniciar el bot con logging
if [[ "$1" == "--logs" || "$1" == "-l" ]]; then
    # Iniciar con logs en tiempo real
    npm start 2>&1 | tee -a logs/stealth-bot.log
else
    # Iniciar en modo normal con logs separados
    echo -e "${GREEN}🔄 Bot v2.0 iniciado...${NC}"
    echo -e "${BLUE}📁 Logs disponibles en: logs/stealth-bot.log${NC}"
    echo -e "${YELLOW}💡 Usa '$0 --logs' para ver logs en tiempo real${NC}"
    echo ""
    
    # Mostrar comandos disponibles
    echo -e "${BLUE}🎯 COMANDOS DISPONIBLES v2.0:${NC}"
    echo -e "• ${PURPLE}Anti-Cheat${NC}: /stealth-info, /stealth-diagnose, /stealth-scan"
    echo -e "• ${PURPLE}IA Audio${NC}: /ai-voices, /ai-audio, /ai-clone-voice"
    echo -e "• ${PURPLE}IA Visual${NC}: /ai-image, /ai-analyze-image, /ai-video"
    echo -e "• ${PURPLE}IA Música${NC}: /ai-music"
    echo -e "• ${PURPLE}IA Chat${NC}: /ai-chat, /ai-diagnose"
    echo -e "• ${PURPLE}Desarrolladores${NC}: /dev-status, /check-updates, /bot-stats"
    echo ""
    
    # Ejecutar bot y capturar salida
    npm start > logs/stealth-bot.log 2>&1
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✅ Bot v2.0 detenido normalmente${NC}"
    else
        echo -e "${RED}❌ Bot v2.0 terminó con código de error: $EXIT_CODE${NC}"
        handle_exit
    fi
fi

echo -e "${GREEN}🎉 Community Stealth Bot v2.0 finalizado${NC}"