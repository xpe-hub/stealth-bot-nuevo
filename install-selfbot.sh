#!/bin/bash

# ========================================================
# 🚀 INSTALACIÓN RÁPIDA STEALTH-ANTICHEATX SELF-BOT
# ========================================================

echo "🛡️ Instalando Stealth-AntiCheatX Self-Bot Ultimate..."
echo "=============================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo desde: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install discord.js-selfbot-v13 axios express

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error instalando dependencias"
    exit 1
fi

# Crear .env de ejemplo
echo "📝 Creando archivo de configuración..."
cat > .env << EOF
# Configuración Stealth-AntiCheatX Self-Bot
DISCORD_TOKEN=tu_token_de_discord_aqui
EOF

echo "✅ Archivo .env creado"
echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Obtén tu token siguiendo: OBTENER_TOKEN_DISCORD.md"
echo "2. Edita el archivo .env y pon tu token"
echo "3. Ejecuta: npm start"
echo ""
echo "🚀 ¡El bot estará funcionando con IA MiniMax real!"
echo "=============================================="