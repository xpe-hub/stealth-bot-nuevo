# 🚀 CONFIGURACIÓN RÁPIDA RAILWAY - STEP BY STEP

## ✅ VERIFICACIÓN COMPLETADA

**TODOS LOS ARCHIVOS ESTÁN CORRECTOS:**
- ✅ `bot.js` - Bot principal con importaciones integradas
- ✅ `anticheat_analyzer_advanced.js` - Análisis DLL + Bypass detection
- ✅ `repository_connector.js` - Monitoreo de repositorio
- ✅ `GUIA_COMPLETA_REACTIVACION.md` - Documentación completa

## 📋 CONFIGURACIÓN MANUAL EN RAILWAY

### PASO 1: Acceder al Dashboard
1. Ir a: **https://railway.app/dashboard**
2. Iniciar sesión con tu cuenta
3. Buscar proyecto: `stealth-anticheatx`

### PASO 2: Configurar Variables (Exactamente como están aquí)

**IMPORTANTE:** Copia EXACTAMENTE estos valores, sin espacios adicionales:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DISCORD_BOT_TOKEN` | `MTQ0MTg3ODA3MjUwNzg5MTcyMg.GtM5hc.gCwZut05T36Cqm7YXtPXil-Qo2iCVDPuJFthmw` | Token Discord |
| `MINIMAX_API_KEY` | `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwiVXNlck5hbWUiOiJzdGVhbHRoLW1hbmFnZXItYWkiLCJBY2NvdW50IjoiIiwiU3ViamVjdElEIjoiMTk4ODQ2ODgyOTk4MTc3ODMxOCIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE5ODg0Njg4Mjk5Nzc1Nzk5MTgiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiJ4cGVwYW5lbGVzQGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTI2IDAwOjE4OjU1IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0X5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA` | API MiniMax |
| `BOT_OWNER_ID` | `751601149928538224` | Tu Discord ID |
| `CHAT_CHANNEL_ID` | `1442266154516091020` | Canal Chat IA |
| `CMD_CHANNEL_ID` | `1441888236833210389` | Canal Comandos |
| `SUPPORT_CHANNEL_ID` | `1442209840976887849` | Canal Soporte |
| `ANTICHEAT_WEBHOOK_URL` | `https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM` | Webhook Reportes |
| `GITHUB_TOKEN` | `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` | Token GitHub |
| `RAILWAY_TOKEN` | `c5813d10-044e-49fe-bf85-362db75d9738` | Token Railway |
| `ENABLE_DLL_ANALYSIS` | `true` | Activa análisis DLL |
| `ENABLE_BYPASS_DETECTION` | `true` | Activa bypass detection |
| `ENABLE_REPOSITORY_MONITORING` | `true` | Activa monitoreo repo |
| `REPOSITORY_OWNER` | `xpe-hub` | Owner repositorio |
| `REPOSITORY_NAME` | `stealth-bot-nuevo` | Nombre repositorio |
| `ANALYSIS_TIMEOUT` | `30000` | Timeout análisis |
| `THREAT_CONFIDENCE_THRESHOLD` | `70` | Umbral amenazas |

### PASO 3: Proceso en Railway Dashboard

1. **Clic en tu proyecto** `stealth-anticheatx`
2. **Pestaña "Variables"**
3. **Botón "New Variable"**
4. **Para cada variable:**
   - Nombre: (copiar EXACTAMENTE de la tabla)
   - Valor: (copiar EXACTAMENTE de la tabla)
   - Clic "Add"
5. **Repetir** para las 14 variables

### PASO 4: Redeploy
- Railway **redesplegará automáticamente** al detectar cambios
- O clic **"Redeploy"** manualmente
- **Esperar 2-5 minutos**

### PASO 5: Verificación

Una vez online, prueba estos comandos:
```
$ai Hola, ¿cómo funciona el sistema?
$status
$repository
$help
```

## 🔧 SI HAY ERRORES

### Error: "Bot no responde"
1. Verificar que todas las 14 variables están configuradas
2. Verificar tokens exactos sin espacios extra
3. Revisar logs en Railway dashboard
4. Redeployar si es necesario

### Error: "No se conectan módulos"
1. Verificar que `ENABLE_DLL_ANALYSIS`, `ENABLE_BYPASS_DETECTION`, `ENABLE_REPOSITORY_MONITORING` estén en `true`
2. Verificar `GITHUB_TOKEN` correcto

## 🎯 RESULTADO ESPERADO

**En 2-5 minutos tendrás:**
- ✅ Bot online en Discord
- ✅ IA MiniMax funcionando
- ✅ Análisis DLL activo
- ✅ Detección bypass activa
- ✅ Monitoreo repositorio activo
- ✅ Comandos: `$ai`, `$status`, `$repository`, `$analyze`, `$help`

## 📞 SOPORTE

Si algo falla, envía un screenshot de:
1. Variables configuradas en Railway
2. Logs del deployment
3. Error específico que aparece

¡Tu bot estará 100% funcional! 🚀🛡️
