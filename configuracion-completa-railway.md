# Configuración Manual Completa - Railway Variables

## 🎯 Variables Críticas (DEBEN configurarse primero)

### 1. DISCORD_BOT_TOKEN (CRÍTICO - BOT CRASHED SIN ESTE)
```
DISCORD_BOT_TOKEN = 1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws
```

### 2. BOT_OWNER_ID 
```
BOT_OWNER_ID = 751601149928538224
```

## 📱 Variables de Canales de Discord

### 3. SUPPORT_CHANNEL_ID
```
SUPPORT_CHANNEL_ID = 1442209840976887849
```

### 4. DESCUBRIMIENTOS_CHANNEL_ID
```
DESCUBRIMIENTOS_CHANNEL_ID = 1442266383265038386
```

### 5. IMPLEMENTACIONES_CHANNEL_ID
```
IMPLEMENTACIONES_CHANNEL_ID = 1442268897406619798
```

### 6. CHAT_CHANNEL_ID
```
CHAT_CHANNEL_ID = 1442266154516091020
```

### 7. CMD_CHANNEL_ID
```
CMD_CHANNEL_ID = 1441888236833210389
```

## 🔗 URLs y Webhooks

### 8. ANTICHEAT_WEBHOOK_URL
```
ANTICHEAT_WEBHOOK_URL = https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM
```

### 9. COMMUNITY_SERVER_INVITE
```
COMMUNITY_SERVER_INVITE = https://discord.gg/stealth-anticheat
```

## 🐙 Variables de GitHub

### 10. GITHUB_TOKEN
```
GITHUB_TOKEN = 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
```

### 11. GITHUB_REPO_OWNER
```
GITHUB_REPO_OWNER = xpe-hub
```

### 12. GITHUB_REPO_NAME
```
GITHUB_REPO_NAME = stealth-bot-nuevo
```

### 13. REPO_TARGET_BRANCH
```
REPO_TARGET_BRANCH = main
```

## 🔑 API Keys

### 14. MINIMAX_API_KEY
```
MINIMAX_API_KEY = eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxzQEdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTI2IDAwOjE4OjU1IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA
```

## ⚙️ Configuración de Análisis de Servidor

### 15. SERVER_ANALYSIS_ENABLED
```
SERVER_ANALYSIS_ENABLED = true
```

### 16. SERVER_ANALYSIS_INTERVAL
```
SERVER_ANALYSIS_INTERVAL = 300
```

## 💾 Base de Datos

### 17. DATABASE_NAME
```
DATABASE_NAME = stealth_bot_db
```

### 18. BACKUP_ENABLED
```
BACKUP_ENABLED = true
```

## 📝 Logs

### 19. LOG_LEVEL
```
LOG_LEVEL = info
```

### 20. LOG_TO_FILE
```
LOG_TO_FILE = true
```

### 21. SERVER_PORT
```
SERVER_PORT = 3000
```

---

## 🚀 Pasos para Configurar en Railway

### Método 1: Dashboard Web
1. Ve a tu proyecto en railway.app
2. Haz clic en tu servicio "stealth-bot-nuevo"
3. Ve a la pestaña "Variables"
4. Haz clic en "Add Variable"
5. Para cada variable:
   - **Name**: (el nombre de la variable)
   - **Value**: (el valor correspondiente)
   - Haz clic en "Add"

### Método 2: Railway CLI
```bash
# Instalar CLI
npm install -g @railway/cli

# Login con tu cuenta
railway login

# Conectar al proyecto
railway link

# Configurar variables una por una
railway variables set DISCORD_BOT_TOKEN="1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws"
railway variables set BOT_OWNER_ID="751601149928538224"
# ... y así sucesivamente
```

### Método 3: Variables compartidas
1. En Railway Dashboard → Variables → Add Variable
2. Configura todas las variables como "Shared Variables"
3. Marca "Share with Services" para cada una

---

## ✅ Verificación Final

Una vez configuradas todas las variables:

1. **Reinicia el servicio**: En Railway Dashboard, haz clic en el botón "Restart" del servicio
2. **Verifica los logs**: Ve a la pestaña "Deployments" y haz clic en el deployment más reciente
3. **Busca estos mensajes**:
   - "Bot está listo y funcionando!"
   - "Discord.js está listo!"
   - "Stealth-AntiCheatX conectado exitosamente"

## 🐛 Solución de Problemas

### Si el bot sigue en CRASHED:
- Verifica que TODAS las variables estén configuradas (sin placeholders)
- Revisa que DISCORD_BOT_TOKEN sea correcto
- Espera 2-3 minutos después del reinicio
- Revisa los logs para errores específicos

### Variables comunes que faltan:
- Todas las variables están como "YOUR_*" → Reemplaza con valores reales
- Token inválido → Verifica el DISCORD_BOT_TOKEN
- Canales no encontrados → Verifica los IDs de los canales

---

**🎉 ¡Después de configurar todas las variables, tu bot debería funcionar perfectamente!**