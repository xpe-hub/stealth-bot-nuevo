#!/bin/bash

# 🚀 INICIADOR AUTOMÁTICO - Stealth Community Stealth Bot
# Bot de monitoreo y análisis anti-cheat
# Desarrollado por: xpe.nettt

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}🔴 ==========================================${NC}"
echo -e "${BLUE}🔴 STEALTH COMMUNITY STEALTH - BOT STARTER${NC}"
echo -e "${BLUE}🔴 Iniciando AntiCheatConsciousness...${NC}"
echo -e "${BLUE}🔴 ==========================================${NC}"
echo ""

# Verificar Node.js
echo -e "${PURPLE}🔍 Verificando requisitos del sistema...${NC}"
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
if [[ "$DISCORD_BOT_TOKEN" == "YOUR_DISCORD_BOT_TOKEN" ]]; then
    echo -e "${RED}❌ DISCORD_BOT_TOKEN no configurado${NC}"
    echo -e "${YELLOW}🔧 Edita .env y configura el token del bot${NC}"
    exit 1
fi

if [[ "$BOT_OWNER_ID" == "YOUR_DISCORD_USER_ID" ]]; then
    echo -e "${RED}❌ BOT_OWNER_ID no configurado${NC}"
    echo -e "${YELLOW}🔧 Edita .env y configura tu User ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Sistema verificado${NC}"
echo ""

# Crear directorios si no existen
mkdir -p data logs

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado del Sistema:${NC}"
    echo -e "   🕐 Hora: $(date)"
    echo -e "   🤖 Bot: Stealth-AntiCheatX"
    echo -e "   🛡️ Sistema: AntiCheatConsciousness"
    echo -e "   🌐 Comunidad: Community Stealth"
    echo ""
}

# Función para manejar errores
handle_exit() {
    echo -e "${RED}❌ Bot detenido${NC}"
    echo -e "${YELLOW}🔄 Logs guardados en: logs/stealth-bot.log${NC}"
    
    # Log error
    echo "$(date): Bot stopped unexpectedly" >> logs/error.log
    
    # Preguntar sobre reinicio
    read -p "¿Quieres reiniciar el bot? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🔄 Reiniciando bot...${NC}"
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
echo -e "${PURPLE}🚀 Iniciando Community Stealth Bot...${NC}"
echo -e "${YELLOW}   Ctrl+C para detener el bot${NC}"
echo ""

# Función para mostrar logs en tiempo real (opcional)
if [[ "$1" == "--logs" || "$1" == "-l" ]]; then
    echo -e "${BLUE}📋 Modo logs activado - mostrando actividad en tiempo real${NC}"
    echo ""
fi

# Iniciar el bot con logging
if [[ "$1" == "--logs" || "$1" == "-l" ]]; then
    # Iniciar con logs en tiempo real
    npm start 2>&1 | tee -a logs/stealth-bot.log
else
    # Iniciar en modo normal con logs separados
    echo -e "${GREEN}🔄 Bot iniciado...${NC}"
    echo -e "${BLUE}📁 Logs disponibles en: logs/stealth-bot.log${NC}"
    echo -e "${YELLOW}💡 Usa '$0 --logs' para ver logs en tiempo real${NC}"
    echo ""
    
    # Ejecutar bot y capturar salida
    npm start > logs/stealth-bot.log 2>&1
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✅ Bot detenido normalmente${NC}"
    else
        echo -e "${RED}❌ Bot terminó con código de error: $EXIT_CODE${NC}"
        handle_exit
    fi
fi