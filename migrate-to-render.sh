#!/bin/bash

# 🚀 Script de Migración Automatizada a Render.com
# Stealth-AntiCheatX Bot Migration Script
# Desarrollado por: xpe.nettt

set -e  # Salir en caso de error

echo "🚀 Stealth-AntiCheatX - Migración a Render.com"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "bot.js" ]; then
    log_error "Error: No se encontró bot.js en el directorio actual"
    exit 1
fi

log_success "Verificando archivos del bot..."

# Backup del package.json original
if [ -f "package.json" ]; then
    cp package.json package-railway-backup.json
    log_info "Backup de package.json original creado"
fi

# Copiar archivos de Render
log_info "Copiando archivos de configuración para Render..."

# Reemplazar package.json con la versión de Render
cp package-render.json package.json
log_success "package.json actualizado para Render"

# Verificar que server.js existe
if [ ! -f "server.js" ]; then
    log_error "Error: server.js no encontrado"
    exit 1
fi

log_success "Archivos de Render copiados correctamente"

# Crear directorio .git si no existe
if [ ! -d ".git" ]; then
    log_warning "Inicializando repositorio Git..."
    git init
fi

# Verificar si hay cambios para commit
if [ -n "$(git status --porcelain)" ]; then
    log_info "Commitando cambios para Render..."
    git add .
    git commit -m "Migración a Render.com - $(date +'%Y-%m-%d %H:%M:%S')"
    log_success "Cambios commitados"
else
    log_info "No hay cambios para commit"
fi

# Verificar variables de entorno necesarias
log_info "Verificando variables de entorno críticas..."

REQUIRED_VARS=(
    "DISCORD_BOT_TOKEN"
    "BOT_OWNER_ID"
)

missing_vars=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    log_warning "Variables de entorno faltantes:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    log_warning "Configura estas variables en Render.com después del deploy"
else
    log_success "Todas las variables críticas están configuradas"
fi

# Mostrar instrucciones finales
echo ""
log_success "🎉 ¡Migración preparada exitosamente!"
echo ""
echo -e "${BLUE}📋 PRÓXIMOS PASOS:${NC}"
echo "1. Ve a https://render.com y crea una cuenta"
echo "2. Crea un nuevo Web Service"
echo "3. Conecta tu repositorio GitHub"
echo "4. Configura estas variables de entorno:"
echo ""
echo -e "${YELLOW}DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN:-'[TU_TOKEN]'}${NC}"
echo -e "${YELLOW}BOT_OWNER_ID=751601149928538224${NC}"
echo -e "${YELLOW}SUPPORT_CHANNEL_ID=1442209840976887849${NC}"
echo -e "${YELLOW}DESCUBRIMIENTOS_CHANNEL_ID=1442266383265038386${NC}"
echo -e "${YELLOW}IMPLEMENTACIONES_CHANNEL_ID=1442268897406619798${NC}"
echo -e "${YELLOW}CHAT_CHANNEL_ID=1442266154516091020${NC}"
echo -e "${YELLOW}CMD_CHANNEL_ID=1441888236833210389${NC}"
echo -e "${YELLOW}ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM${NC}"
echo -e "${YELLOW}COMMUNITY_SERVER_INVITE=https://discord.gg/stealth-anticheat${NC}"
echo -e "${YELLOW}BOT_PREFIX=$${NC}"
echo ""
echo -e "${BLUE}5. Deploy settings:${NC}"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Node Version: 18.x"
echo ""
echo -e "${GREEN}🎯 Render te dará un URL como: https://stealth-anticheat-bot.onrender.com${NC}"
echo ""
log_success "¡Migración lista para Render.com! 🚀"

# Mostrar el estado actual del bot
echo ""
log_info "Estado actual del bot en Railway:"
echo "GitHub Repo: https://github.com/xpe-hub/stealth-bot-nuevo"
echo "Railway URL: (tu proyecto en railway.app)"
echo ""
log_warning "Recuerda migrar ANTES de que expire Railway (16 días)"