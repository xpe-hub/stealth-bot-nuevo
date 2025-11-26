# 🔄 Actualizar Proyecto Railway Existente

## 📱 Pasos para actualizar en Railway.app

### Paso 1: Ir a tu proyecto MCP
1. Abre Railway.app
2. Busca tu proyecto MCP actual
3. Entra al proyecto

### Paso 2: Cambiar repositorio
1. Ve a **Settings** o **Deploy**
2. Busca **"Change Source"** o **"Update Repository"**
3. Busca: **xpe-hub/Stealth-AntiCheat-MCP**
4. Selecciona el repositorio
5. Click **"Update"** o **"Deploy"**

### Paso 3: Variables de entorno
Si tu proyecto actual tiene variables, agrégalas también:

```
DISCORD_BOT_TOKEN=1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws
OPENROUTER_API_KEY=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
BOT_OWNER_ID=751601149928538224
GITHUB_TOKEN=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
ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNNWzLvM

# Discord Channels
CODE_ANALYSIS_CHANNEL_ID=1444132184634556426
CHEAT_DETECTION_CHANNEL_ID=1444132190619426797
ADMIN_CHANNEL_ID=1444132195407757372
USER_FEEDBACK_CHANNEL_ID=1444132200066951329
GITHUB_UPDATES_CHANNEL_ID=1444132204787744898
SYSTEM_ALERTS_CHANNEL_ID=1444132208948990052

# Configuración
DATABASE_PATH=./data/anticheat.db
LOG_LEVEL=info
NODE_ENV=production
```

### Paso 4: Deploy
1. Railway hará deploy automático
2. Debería compilar sin errores Nixpacks ✅
3. Verás logs en tiempo real

## 📊 Qué cambiarás:
- **❌ MCP server genérico** → **✅ Stealth-AntiCheat-MCP**
- **❌ Sin Discord** → **✅ Con Discord Bot**
- **❌ Sin análisis** → **✅ Con análisis de código**
- **❌ Sin anti-cheat** → **✅ Con anti-cheat signatures**

## ⚠️ Importante:
- Tu MCP server actual dejará de funcionar
- El nuevo bot ocupará su lugar
- ChatMCP tendrá acceso a las 9 herramientas del anti-cheat