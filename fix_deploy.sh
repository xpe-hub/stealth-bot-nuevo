#!/bin/bash

# Push urgente para Railway
echo "🚨 PUSH URGENTE - Fixing AI Integration"

# Verificar archivos
ls -la bot.js stealth_cheatx_ai.js

# Forzar add y commit
git add .
git commit -m "URGENT: Fix AI Integration - MiniMax Real v2.1"

# Push forzado
git push --force origin master

echo "✅ Push completado - Railway redeploy en 1-2 minutos"