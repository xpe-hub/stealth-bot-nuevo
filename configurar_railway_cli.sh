#!/bin/bash

# Configurador automático de Railway usando CLI
# Configura todas las variables de entorno del bot Stealth-AntiCheatX

echo "🚀 Iniciando configuración automática de Railway"
echo "📋 Instalando y configurando Railway CLI..."

# Instalar Railway CLI
npm install -g @railway/cli

# Hacer login con el token
echo "🔐 Iniciando sesión con Railway..."
railway login --token 841554ac-1557-437c-b0ac-fc58d2f6387f

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."

# Configurar DISCORD_BOT_TOKEN (crítico)
railway variables set DISCORD_BOT_TOKEN="1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws"
sleep 1

# Configurar BOT_OWNER_ID
railway variables set BOT_OWNER_ID="751601149928538224"
sleep 1

# Configurar channel IDs
railway variables set SUPPORT_CHANNEL_ID="1442209840976887849"
sleep 1

railway variables set DESCUBRIMIENTOS_CHANNEL_ID="1442266383265038386"
sleep 1

railway variables set IMPLEMENTACIONES_CHANNEL_ID="1442268897406619798"
sleep 1

railway variables set CHAT_CHANNEL_ID="1442266154516091020"
sleep 1

railway variables set CMD_CHANNEL_ID="1441888236833210389"
sleep 1

# Configurar URLs
railway variables set ANTICHEAT_WEBHOOK_URL="https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM"
sleep 1

railway variables set COMMUNITY_SERVER_INVITE="https://discord.gg/stealth-anticheat"
sleep 1

# Configurar GitHub
railway variables set GITHUB_TOKEN="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"
sleep 1

railway variables set GITHUB_REPO_OWNER="xpe-hub"
sleep 1

railway variables set GITHUB_REPO_NAME="stealth-bot-nuevo"
sleep 1

railway variables set REPO_TARGET_BRANCH="main"
sleep 1

# Configurar MiniMax
railway variables set MINIMAX_API_KEY="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxzQEdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTI2IDAwOjE4OjU1IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA"
sleep 1

# Configurar análisis de servidor
railway variables set SERVER_ANALYSIS_ENABLED="true"
sleep 1

railway variables set SERVER_ANALYSIS_INTERVAL="300"
sleep 1

# Configurar base de datos
railway variables set DATABASE_NAME="stealth_bot_db"
sleep 1

railway variables set BACKUP_ENABLED="true"
sleep 1

# Configurar logs
railway variables set LOG_LEVEL="info"
sleep 1

railway variables set LOG_TO_FILE="true"
sleep 1

# Configurar puerto del servidor
railway variables set SERVER_PORT="3000"
sleep 1

echo "✅ Variables configuradas"
echo "🔄 Reiniciando servicio..."

# Reiniciar el servicio
railway deploy --restart

echo "🎉 ¡Configuración completada!"
echo "⏱️  Espera 1-2 minutos y revisa los logs para verificar que esté funcionando."
echo "📊 Para ver los logs: railway logs"