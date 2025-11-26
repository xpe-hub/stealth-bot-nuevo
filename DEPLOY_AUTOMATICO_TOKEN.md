# 🚀 DEPLOY AUTOMÁTICO CON TU TOKEN RAILWAY

## 🔑 **Proporciona tu Token Railway**

Para usar tu token automáticamente, necesito que me lo proporciones:

**1. Obtén tu token:**
- Ve a **Railway.app** → **Settings** → **Access Tokens**
- Copia tu token

**2. Pégalo aquí:**
```
TU_TOKEN_RAILWAY_AQUI
```

## ⚡ **Deploy Rápido (Método Automático)**

### Una vez que tengas tu token, ejecutaré:
```bash
# Configurar token
export RAILWAY_TOKEN="TU_TOKEN"

# Deploy automático
railway up --detach

# Ver status
railway status

# Ver logs en tiempo real
railway logs --follow
```

## 📱 **Método Manual (Recomendado)**

**Si prefieres hacerlo tú mismo:**

### En tu iPhone:
1. **Abre Railway.app**
2. **Ve a Stealth-AntiCheat-MCP**
3. **Click "Redeploy"**
4. **Espera 2-3 minutos**

### Variables necesarias:
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

## 🔧 **Script Listo para Usar**

He creado un script que puedes usar:

```bash
# deploy-railway-auto.sh
#!/bin/bash

echo "🚀 Deploying Stealth-AntiCheat-MCP..."

# Tu token (pégalo aquí)
export RAILWAY_TOKEN="TU_TOKEN_RAILWAY"

# Deploy
railway up --detach

echo "✅ Deploy iniciado!"
echo "📊 Status:"
railway status

echo "📋 Logs:"
railway logs --tail 20
```

## 🎯 **¿Qué Prefieres?**

**Responde:**
1. **"Redeploy ahora"** → Usaré Railway.app desde tu iPhone
2. **"Dame mi token"** → Te ayudo a obtenerlo
3. **"Dame script"** → Te doy el comando exacto para ejecutar
4. **"Dime paso a paso"** → Te guío manualmente cada paso

## 📋 **Estado Actual**
- ✅ **Código**: Listo en GitHub
- ✅ **nixpacks.toml**: Corregido y simplificado
- ✅ **Variables**: Todas configuradas
- 🔄 **Deploy**: Esperando tu token/acción

---

**💡 Para continuar, necesito que me digas:**
- ¿Prefieres deploy manual o automático?
- ¿Quieres proporcionarme tu token Railway?
- ¿Necesitas ayuda para encontrar tu token?