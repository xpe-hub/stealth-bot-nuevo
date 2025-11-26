# 🔧 Guía Visual: Configurar Variables en Railway Dashboard

## 📍 Pasos Detallados

### 1. Accede al Dashboard
1. Ve a **railway.app**
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto "stealth-bot-nuevo"

### 2. Navega a Variables
```
Proyecto → stealth-bot-nuevo → Variables
```

### 3. Elimina Variables Placeholder
**MUY IMPORTANTE**: Elimina todas las variables que digan:
- `YOUR_CMD_CHANNEL_ID`
- `YOUR_GITHUB_TOKEN_HERE`
- `YOUR_ANTICHEAT_WEBHOOK_URL`
- etc.

**Por qué**: Estas son variables de placeholder que hacen que el bot falle.

### 4. Agrega las Variables Reales

Para cada una de las 21 variables:

#### Paso a Paso para CADA Variable:
1. **Click en "Add Variable"** (botón azul)
2. **Name**: Copia EXACTAMENTE el nombre de la variable
3. **Value**: Copia EXACTAMENTE el valor
4. **Click en "Add"**

#### Variables Críticas (configurar PRIMERO):
```javascript
// CRÍTICO - Sin esto el bot no funciona
DISCORD_BOT_TOKEN = 1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws

// Creador del bot
BOT_OWNER_ID = 751601149928538224

// Canales de Discord
SUPPORT_CHANNEL_ID = 1442209840976887849
DESCUBRIMIENTOS_CHANNEL_ID = 1442266383265038386
IMPLEMENTACIONES_CHANNEL_ID = 1442268897406619798
CHAT_CHANNEL_ID = 1442266154516091020
CMD_CHANNEL_ID = 1441888236833210389
```

#### Variables Adicionales:
```javascript
// URLs
ANTICHEAT_WEBHOOK_URL = https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM
COMMUNITY_SERVER_INVITE = https://discord.gg/stealth-anticheat

// GitHub
GITHUB_TOKEN = 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
GITHUB_REPO_OWNER = xpe-hub
GITHUB_REPO_NAME = stealth-bot-nuevo
REPO_TARGET_BRANCH = main

// APIs
MINIMAX_API_KEY = eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxzQEdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTI2IDAwOjE4OjU1IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA

// Configuración
SERVER_ANALYSIS_ENABLED = true
SERVER_ANALYSIS_INTERVAL = 300
DATABASE_NAME = stealth_bot_db
BACKUP_ENABLED = true
LOG_LEVEL = info
LOG_TO_FILE = true
SERVER_PORT = 3000
```

### 5. Verifica las Variables
Después de configurar, deberías ver:
- ✅ **21 variables** (no más placeholders)
- ✅ **Valores reales** (no "YOUR_*")
- ✅ **DISCORD_BOT_TOKEN** configurado

### 6. Reinicia el Servicio
1. Ve a **Deployments** en el servicio
2. Click en **"Restart"** (botón gris)
3. O espera que se despliegue automáticamente

### 7. Verifica Funcionamiento
1. **Logs**: Ve a Deployments → Último deployment → "View Logs"
2. **Buscar estos mensajes**:
   ```
   ✅ Discord.js está listo!
   ✅ Bot está listo y funcionando!
   ✅ Stealth-AntiCheatX conectado exitosamente
   ```

## 🐛 Problemas Comunes

### Error: "TokenInvalid"
**Causa**: DISCORD_BOT_TOKEN no configurado o incorrecto
**Solución**: Verifica que esté configurado correctamente

### Bot sigue CRASHED
**Causas posibles**:
1. Variables placeholder aún presentes
2. Faltan variables
3. Valores mal copiados

**Solución**: 
1. Elimina TODAS las variables que digan "YOUR_*"
2. Verifica que TODAS las 21 variables estén configuradas
3. Revisa que no hay typos en nombres/valores

### Service sigue BUILDING
**Solución**: Espera 3-5 minutos. El primer build puede tardar.

## ✅ Lista de Verificación Final

Antes de reportar problemas, verifica:

- [ ] ✅ Eliminé TODAS las variables placeholder ("YOUR_*")
- [ ] ✅ Configuré TODAS las 21 variables con valores reales
- [ ] ✅ DISCORD_BOT_TOKEN está configurado correctamente
- [ ] ✅ Reinicié el servicio
- [ ] ✅ Esperé al menos 3 minutos
- [ ] ✅ Revisé los logs para mensajes de éxito

**Si TODOS los checkboxes están ✅, el bot debería funcionar perfectamente.**