#!/bin/bash

# Script para deploy automático a Railway
echo "🚀 DEPLOY STEALTH-ANTICHEATX v2.0"

cd /workspace

# Configurar remote
echo "Configurando remote..."
GITHUB_TOKEN="${GITHUB_TOKEN:-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}"
git remote set-url origin https://${GITHUB_TOKEN}@github.com/xpe-hub/stealth-bot-nuevo.git

# Push a GitHub
echo "Enviando cambios a GitHub..."
git push origin master

echo "✅ Deploy completado - Railway redespleará automáticamente"