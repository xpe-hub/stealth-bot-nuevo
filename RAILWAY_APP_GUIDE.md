# 📱 Guía Railway.app para iPhone

## 🎯 Lo que verás en Railway.app

### Si tienes proyectos existentes:
- Dashboard con lista de proyectos
- Busca: **"Stealth-AntiCheat-MCP"** o similar
- Toca el proyecto para abrirlo

### Si es tu primera vez:
- Pantalla de bienvenida
- Botón **"New Project"** (Proyectos)
- Selecciona **"Deploy from GitHub repo"**

## 🚀 Conectar tu repositorio

### Paso 1: Nuevo proyecto
1. Toca **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca: **"xpe-hub/Stealth-AntiCheat-MCP"**

### Paso 2: Configurar variables de entorno
Después de conectar el repo, ve a **"Variables"** y agrega:

```
DISCORD_BOT_TOKEN=1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws

OPENROUTER_API_KEY=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

BOT_OWNER_ID=751601149928538224

GITHUB_TOKEN=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

ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNNWzLvM

# Configuración Discord Channels
CODE_ANALYSIS_CHANNEL_ID=1444132184634556426
CHEAT_DETECTION_CHANNEL_ID=1444132190619426797
ADMIN_CHANNEL_ID=1444132195407757372
USER_FEEDBACK_CHANNEL_ID=1444132200066951329
GITHUB_UPDATES_CHANNEL_ID=1444132204787744898
SYSTEM_ALERTS_CHANNEL_ID=1444132208948990052

# Base de datos
DATABASE_PATH=./data/anticheat.db
LOG_LEVEL=info
NODE_ENV=production
```

## 📊 Monitorear el deployment

### En la pestaña "Deploys":
- Verás el progreso del build
- Nixpacks debería compilar correctamente ahora ✅
- Verás logs en tiempo real

### En la pestaña "Settings":
- URL del servicio activo
- Logs de aplicación
- Métricas de uso

## 🔍 Verificar que funciona

### Después del deployment:
1. **Discord Bot**: Debe aparecer online en tu Discord
2. **Railway Service**: Estado "Active" 
3. **Logs**: Sin errores en Railway

### Probar ChatMCP:
- En ChatMCP, busca el bot "Railway MCP"
- Debe mostrar "9 tools available"
- Prueba ejecutar: `/list_channels`

## 📱 Control desde iPhone

Una vez desplegado, puedes:
- ✅ Monitorear el bot desde Discord
- ✅ Ver logs en Railway.app
- ✅ Controlar el bot con ChatMCP
- ✅ Recibir notificaciones de alertas

## 🚨 Si algo sale mal

### Build error:
- Revisa los logs en Railway
- Nixpacks ya está corregido ✅

### Variables faltantes:
- Asegúrate de agregar TODAS las variables
- Sin `DISCORD_BOT_TOKEN` el bot no arranca

### Bot offline:
- Revisa logs de aplicación en Railway
- Verifica que las variables estén correctas

---

**💡 Tip**: Mantén Railway.app abierta durante el primer deployment para ver el progreso en tiempo real.