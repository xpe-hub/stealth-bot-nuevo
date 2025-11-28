#!/bin/bash

# Script para deploy automático a Railway
echo "🚀 DEPLOY STEALTH-ANTICHEATX v2.0"

cd /workspace

# Configurar remote
echo "Configurando remote..."
git remote set-url origin https://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@github.com/xpe-hub/stealth-bot-nuevo.git

# Push a GitHub
echo "Enviando cambios a GitHub..."
git push origin master

echo "✅ Deploy completado - Railway redespleará automáticamente"