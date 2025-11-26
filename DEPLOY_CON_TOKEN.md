# 🚀 Deploy Stealth-AntiCheat-MCP con Token Railway

## 🔑 Usar tu Token desde tu iPhone/Dispositivo

### Opción 1: Railway.app (Más Fácil)
1. **Abre Railway.app**
2. **Ve a tu proyecto** Stealth-AntiCheat-MCP
3. **Click "Redeploy"**
4. **Esto usa tu token automáticamente**

### Opción 2: Terminal/CLI
**Si tienes terminal en tu dispositivo:**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login con tu token
railway login --token TU_TOKEN_RAILWAY

# Deploy desde el directorio del proyecto
cd Stealth-AntiCheat-MCP
railway up
```

### Opción 3: API Directa
**Usar Railway API con tu token:**

```bash
# Trigger deploy
curl -X POST https://railway.app/api/projects/PROJECT_ID/deploy \
  -H "Authorization: Bearer TU_TOKEN_RAILWAY" \
  -H "Content-Type: application/json"
```

## 📱 Tu Token Railway

**Necesito tu token para ayudarte mejor:**

1. **Ve a Railway.app** → **Settings** → **Access Tokens**
2. **Copia tu token**
3. **Pégalo aquí** para que lo use automáticamente

## 🔧 Script Automático (Con tu token)

### Crear script deploy-railway.sh:
```bash
#!/bin/bash

# Tu token de Railway
export RAILWAY_TOKEN="TU_TOKEN"

# Deploy
railway up --detach

# Ver status
railway status

# Ver logs
railway logs --follow
```

### Ejecutar:
```bash
chmod +x deploy-railway.sh
./deploy-railway.sh
```

## ⚡ Deploy Rápido (Recomendado)

**La forma más simple:**

1. **Abre Railway.app en tu iPhone**
2. **Ve a Stealth-AntiCheat-MCP**
3. **Click "Redeploy"**
4. **Espera 2-3 minutos**
5. **Verifica que funciona**

## 🎯 Variables Necesarias

**Asegúrate que Railway tenga TODAS estas variables:**

```
DISCORD_BOT_TOKEN=1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws
OPENROUTER_API_KEY=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
BOT_OWNER_ID=751601149928538224
GITHUB_TOKEN=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
ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNNWzLvM

CODE_ANALYSIS_CHANNEL_ID=1444132184634556426
CHEAT_DETECTION_CHANNEL_ID=1444132190619426797
ADMIN_CHANNEL_ID=1444132195407757372
USER_FEEDBACK_CHANNEL_ID=1444132200066951329
GITHUB_UPDATES_CHANNEL_ID=1444132204787744898
SYSTEM_ALERTS_CHANNEL_ID=1444132208948990052

DATABASE_PATH=./data/anticheat.db
LOG_LEVEL=info
NODE_ENV=production
```

## 📊 Test Después del Deploy

### 1. Verificar en Railway:
- ✅ Build exitoso
- ✅ Sin errores de Nixpacks
- ✅ Servicio "Active"

### 2. Verificar en Discord:
- ✅ Bot online
- ✅ Sin errores en consola

### 3. Verificar en ChatMCP:
- ✅ Conecta al servicio Railway
- ✅ Muestra "9 tools available"

---

**💡 ¿Cuál método prefieres usar?**
1. **Railway.app** (más fácil desde iPhone)
2. **CLI con tu token** (más control)
3. **Script automático** (todo automatizado)

**¡Dime tu token para usar el método que prefieras!**