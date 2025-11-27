#!/bin/bash

# Script para subir cambios a GitHub usando API
set -e

echo "🚀 Subiendo cambios a GitHub..."

# Verificar variables de entorno
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN no encontrado"
    exit 1
fi

if [ -z "$GITHUB_REPO_OWNER" ]; then
    echo "❌ GITHUB_REPO_OWNER no encontrado"
    exit 1
fi

if [ -z "$GITHUB_REPO_NAME" ]; then
    echo "❌ GITHUB_REPO_NAME no encontrado"
    exit 1
fi

REPO_OWNER="$GITHUB_REPO_OWNER"
REPO_NAME="$GITHUB_REPO_NAME"
TOKEN="$GITHUB_TOKEN"

echo "📦 Repository: $REPO_OWNER/$REPO_NAME"

# Configurar remote
git remote set-url origin "https://$TOKEN@github.com/$REPO_OWNER/$REPO_NAME.git" 2>/dev/null || git remote add origin "https://$TOKEN@github.com/$REPO_OWNER/$REPO_NAME.git"

# Crear branch si no existe
git checkout -b "fix/vc-command" || git checkout "fix/vc-command"

# Agregar archivos
git add bot.js

# Commit
COMMIT_MESSAGE="Fix: $vc command - Corrección de lógica de comando de voz

- Eliminado: Verificación innecesaria de usuario en voz
- Agregado: Bot se conecta directamente al canal especificado  
- Mejorado: Manejo de errores y mensajes de confirmación
- Solucionado: Error 'Target user is not connected to voice'

Fecha: $(date +'%Y-%m-%d %H:%M:%S')"

git commit -m "$COMMIT_MESSAGE"

# Push
git push origin "fix/vc-command" --force

echo "✅ Cambios subidos exitosamente a branch: fix/vc-command"
echo "🔗 URL: https://github.com/$REPO_OWNER/$REPO_NAME/compare/main...fix/vc-command"

# Crear Pull Request
PR_TITLE="🔧 Fix: Comando $vc - Corrección de lógica"
PR_BODY="## 🔧 Corrección del Comando \$vc

### ❌ Problema Detectado:
- Error: \"Target user is not connected to voice\"
- Bot intentaba mover usuarios innecesariamente

### ✅ Solución Implementada:
- Eliminado: Verificación innecesaria de que usuario esté en voz
- El bot ahora se conecta directamente al canal especificado
- Mejorado: Manejo de errores y mensajes de confirmación

### 🎯 Comportamiento Corregido:
\`\`\`
$vc [nombre_canal] - Bot se une al canal especificado
$vc - Muestra canal actual del usuario
\`\`\`

### 📋 Testing Requerido:
- [ ] Comando \$vc sin argumentos
- [ ] Comando \$vc [nombre_canal]
- [ ] Verificar uniones exitosas a canales de voz

---
**Desarrollado por:** xpe.nettt  
**Fecha:** $(date +'%Y-%m-%d')"

curl -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls" \
  -d "{
    \"title\": \"$PR_TITLE\",
    \"head\": \"fix/vc-command\",
    \"base\": \"main\",
    \"body\": \"$(echo -e $PR_BODY | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')\"
  }"

echo "🎉 ¡Pull Request creado exitosamente!"