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
| `DISCORD_BOT_TOKEN` | `TU_TOKEN_DISCORD_AQUI` | Token Discord |
| `MINIMAX_API_KEY` | `TU_API_KEY_MINIMAX_AQUI` | API MiniMax |
| `BOT_OWNER_ID` | `TU_ID_DISCORD_AQUI` | Tu Discord ID |
| `CHAT_CHANNEL_ID` | `ID_CANAL_CHAT_AQUI` | Canal Chat IA |
| `CMD_CHANNEL_ID` | `ID_CANAL_COMANDOS_AQUI` | Canal Comandos |
| `SUPPORT_CHANNEL_ID` | `ID_CANAL_SOPORTE_AQUI` | Canal Soporte |
| `ANTICHEAT_WEBHOOK_URL` | `TU_WEBHOOK_URL_AQUI` | Webhook Reportes |
| `GITHUB_TOKEN` | `TU_GITHUB_TOKEN_AQUI` | Token GitHub |
| `RAILWAY_TOKEN` | `TU_RAILWAY_TOKEN_AQUI` | Token Railway |
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
