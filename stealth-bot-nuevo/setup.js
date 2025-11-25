#!/bin/bash

# 🔧 CONFIGURADOR AUTOMÁTICO - Stealth Community Stealth Bot
# Configuración rápida y automática del bot
# Desarrollado por: xpe.nettt

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 ==========================================${NC}"
echo -e "${BLUE}🔧 STEALTH COMMUNITY STEALTH - CONFIGURADOR${NC}"
echo -e "${BLUE}🔧 ==========================================${NC}"
echo ""

# Función para obtener User ID
get_user_id() {
    echo -e "${YELLOW}🔑 OBTENER TU USER ID DE DISCORD:${NC}"
    echo -e "1. Abre Discord"
    echo -e "2. Ve a Configuración de Usuario (⚙️)"
    echo -e "3. Busca 'Modo Desarrollador' y actívalo"
    echo -e "4. Click derecho en tu perfil > 'Copiar ID'"
    echo ""
    read -p "📝 Pega tu User ID aquí: " user_id
    echo "$user_id"
}

# Función para obtener Bot Token
get_bot_token() {
    echo -e "${YELLOW}🤖 CREAR/OBTENER TOKEN DEL BOT:${NC}"
    echo -e "1. Ve a: https://discord.com/developers/applications"
    echo -e "2. Crea nueva aplicación o selecciona la existente"
    echo -e "3. Ve a 'Bot' en el menú lateral"
    echo -e "4. Click 'Reset Token' si necesitas uno nuevo"
    echo -e "5. Copia el token completo"
    echo ""
    read -p "📝 Pega el Bot Token aquí: " bot_token
    echo "$bot_token"
}

# Función para configurar .env
configure_env() {
    local user_id="$1"
    local bot_token="$2"
    
    echo -e "${BLUE}📝 Configurando archivo .env...${NC}"
    
    cat > .env << EOF
# Stealth Community Stealth - Discord Bot Configuration

# Discord Bot Token
DISCORD_BOT_TOKEN=$bot_token

# GitHub Integration
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
GITHUB_REPO_OWNER=xpe-hub
GITHUB_REPO_NAME=Stealth-AntiCheatX

# Bot Owner Configuration
BOT_OWNER_ID=$user_id
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

    echo -e "${GREEN}✅ Archivo .env configurado correctamente${NC}"
}

# Función para validar configuración
validate_config() {
    echo -e "${BLUE}🔍 Validando configuración...${NC}"
    
    # Verificar que el .env existe
    if [ ! -f .env ]; then
        echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
        return 1
    fi
    
    # Cargar variables
    source .env
    
    # Validar formato de tokens
    if [[ "$DISCORD_BOT_TOKEN" =~ ^[0-9]{17,18}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}$ ]]; then
        echo -e "${GREEN}✅ Discord Bot Token: Formato válido${NC}"
    else
        echo -e "${RED}❌ Discord Bot Token: Formato inválido${NC}"
        return 1
    fi
    
    # Validar User ID
    if [[ "$BOT_OWNER_ID" =~ ^[0-9]{17,18}$ ]]; then
        echo -e "${GREEN}✅ User ID: Formato válido${NC}"
    else
        echo -e "${RED}❌ User ID: Formato inválido${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Configuración validada correctamente${NC}"
    return 0
}

# Función principal
main() {
    echo -e "${YELLOW}🎯 Este script configurará automáticamente tu bot${NC}"
    echo -e "${YELLOW}📋 Información requerida:${NC}"
    echo -e "• Tu User ID de Discord"
    echo -e "• Token del bot de Discord"
    echo ""
    
    read -p "¿Continuar con la configuración? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ Configuración cancelada${NC}"
        exit 0
    fi
    
    # Obtener User ID
    user_id=$(get_user_id)
    if [ -z "$user_id" ]; then
        echo -e "${RED}❌ User ID requerido${NC}"
        exit 1
    fi
    
    # Obtener Bot Token
    bot_token=$(get_bot_token)
    if [ -z "$bot_token" ]; then
        echo -e "${RED}❌ Bot Token requerido${NC}"
        exit 1
    fi
    
    # Configurar .env
    configure_env "$user_id" "$bot_token"
    
    # Validar configuración
    if validate_config; then
        echo ""
        echo -e "${GREEN}🎉 ==========================================${NC}"
        echo -e "${GREEN}🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE${NC}"
        echo -e "${GREEN}🎉 ==========================================${NC}"
        echo ""
        echo -e "${BLUE}📋 RESUMEN:${NC}"
        echo -e "${GREEN}✅ User ID configurado: $user_id${NC}"
        echo -e "${GREEN}✅ Bot Token configurado: ${bot_token:0:10}...${NC}"
        echo -e "${GREEN}✅ Variables de entorno: Configuradas${NC}"
        echo ""
        echo -e "${BLUE}🚀 PRÓXIMOS PASOS:${NC}"
        echo -e "1. ${YELLOW}Instalar dependencias${NC}: npm install"
        echo -e "2. ${YELLOW}Invitar bot a servidor${NC}: Usar el token configurado"
        echo -e "3. ${YELLOW}Iniciar bot${NC}: npm start"
        echo ""
        echo -e "${GREEN}🛡️ ¡Tu bot Community Stealth está listo!${NC}"
    else
        echo -e "${RED}❌ Error en la configuración${NC}"
        echo -e "${YELLOW}🔧 Revisa los tokens y vuelve a intentar${NC}"
        exit 1
    fi
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo -e "${YELLOW}📁 Asegúrate de ejecutar este script desde el directorio del bot${NC}"
    exit 1
fi

# Ejecutar configuración principal
main