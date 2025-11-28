#!/bin/bash

# Script de deploy automático para el bot Stealth-AntiCheatX
# Desarrollado por xpe.nettt

echo "🚀 DEPLOY AUTOMÁTICO - Stealth-AntiCheat-Bot"
echo "=============================================="

# Configuración
REPO_URL="https://github.com/xpe-hub/stealth-bot-nuevo.git"
BOT_TOKEN="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"
BRANCH="main"
CLONE_DIR="stealth-bot-deployment"

echo "📋 Configuración:"
echo "   Repositorio: $REPO_URL"
echo "   Rama: $BRANCH"
echo ""

# Paso 1: Clonar repositorio
echo "📦 Paso 1: Clonando repositorio..."
rm -rf $CLONE_DIR
git clone -b $BRANCH https://$BOT_TOKEN@github.com/xpe-hub/stealth-bot-nuevo.git $CLONE_DIR
cd $CLONE_DIR

if [ $? -eq 0 ]; then
    echo "✅ Repositorio clonado exitosamente"
else
    echo "❌ Error clonando repositorio"
    exit 1
fi

# Paso 2: Backup del bot.js actual
echo ""
echo "💾 Paso 2: Creando backup del bot.js actual..."
if [ -f "bot.js" ]; then
    cp bot.js bot.js.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup creado"
else
    echo "⚠️  No existe bot.js previo"
fi

# Paso 3: Reemplazar bot.js
echo ""
echo "🤖 Paso 3: Actualizando bot.js..."
cp /workspace/bot_mejorado.js ./bot.js

if [ $? -eq 0 ]; then
    echo "✅ bot.js actualizado exitosamente"
else
    echo "❌ Error actualizando bot.js"
    exit 1
fi

# Paso 4: Commit y push
echo ""
echo "📤 Paso 4: Enviando cambios a GitHub..."

# Configurar git
git config user.name "xpe.nettt"
git config user.email "xpe@stealth.com"

# Agregar cambios
git add bot.js

# Crear commit con descripción detallada
COMMIT_MESSAGE="🚀 Bot Stealth-AntiCheat v2.0 - Mejoras Completas

✅ CORRECCIONES IMPLEMENTADAS:
• Conteo de usuarios corregido (311 miembros vs 195 anterior)
• Sistema de apodos implementado ($apodo comando)
• Bot llama 'xpe.nettt' en lugar de 'xpe_instaplayer'
• Comando $anticheat implementado para descarga de herramientas
• Comando $scan mejorado para escaneo del servidor
• Respuestas personalizadas con apodos de usuarios

🛡️ DESARROLLADO POR: xpe.nettt
📅 FECHA: $(date '+%Y-%m-%d %H:%M:%S')
🔧 VERSIÓN: 2.0.1-Enhanced"

git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Commit creado exitosamente"
else
    echo "❌ Error creando commit"
    exit 1
fi

# Push a GitHub
echo ""
echo "🌐 Paso 5: Enviando a GitHub..."
git push origin $BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Deploy exitoso a GitHub!"
    echo ""
    echo "🎉 RESUMEN DEL DEPLOY:"
    echo "   ✅ Bot actualizado con nuevas funcionalidades"
    echo "   ✅ Conteo de usuarios corregido"
    echo "   ✅ Sistema de apodos implementado"
    echo "   ✅ Comando $anticheat disponible"
    echo "   ✅ Cambios desplegados en GitHub"
    echo ""
    echo "⚡ PRÓXIMOS PASOS:"
    echo "   1. Railway detectará los cambios automáticamente"
    echo "   2. El bot se reiniciará con las nuevas funcionalidades"
    echo "   3. Verifica los logs en Railway Dashboard"
    echo "   4. Prueba los nuevos comandos en Discord"
    echo ""
    echo "🛠️ COMANDOS NUEVOS:"
    echo "   $apodo [nombre]     - Establece tu apodo personal"
    echo "   $apodo              - Ve tu apodo actual"
    echo "   $anticheat          - Información de herramienta (solo dev)"
    echo "   $scan               - Escaneo mejorado del servidor"
else
    echo "❌ Error enviando a GitHub"
    exit 1
fi

echo ""
echo "🏁 Deploy completado exitosamente!"