# 🚀 Configuración RÁPIDA - Copy & Paste

## ⚠️ INSTRUCCIONES:
1. Ve a Railway → Tu Proyecto → Servicio "stealth-bot-nuevo" → Variables
2. Haz clic en "Add Variable" 21 veces
3. Copia cada línea Y la pega como:
   - **Name**: (la parte antes del `=`)
   - **Value**: (la parte después del `=`)

---

## 📋 VARIABLES PARA COPIAR:

```
DISCORD_BOT_TOKEN=MTQ0MTg3ODA3MjUwNzg5MTcyMg.GtM5hc.gCwZut05T36Cqm7YXtPXil-Qo2iCVDPuJFthmw
BOT_OWNER_ID=751601149928538224
SUPPORT_CHANNEL_ID=1442209840976887849
DESCUBRIMIENTOS_CHANNEL_ID=1442266383265038386
IMPLEMENTACIONES_CHANNEL_ID=1442268897406619798
CHAT_CHANNEL_ID=1442266154516091020
CMD_CHANNEL_ID=1441888236833210389
ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM
GITHUB_TOKEN=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
GITHUB_REPO_OWNER=xpe-hub
GITHUB_REPO_NAME=stealth-bot-nuevo
REPO_TARGET_BRANCH=main
MINIMAX_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxzQEdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTI2IDAwOjE4OjU1IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA
SERVER_ANALYSIS_ENABLED=true
SERVER_ANALYSIS_INTERVAL=300
COMMUNITY_SERVER_INVITE=https://discord.gg/stealth-anticheat
DATABASE_NAME=stealth_bot_db
BACKUP_ENABLED=true
LOG_LEVEL=info
LOG_TO_FILE=true
SERVER_PORT=3000
```

---

## ✅ PASO FINAL:

1. **Reinicia el servicio**: En Railway Dashboard → Service → "Restart"
2. **Espera 2-3 minutos**
3. **Revisa los logs**: Deployments → Último deployment → Logs
4. **Busca**: "Bot está listo y funcionando!" ✅

## 🐛 SI NO FUNCIONA:

### Verificación rápida:
- ✅ ¿Configuraste TODAS las 21 variables?
- ✅ ¿Ninguna variable dice "YOUR_*"?
- ✅ ¿El token de Discord es correcto?

### Error común:
```
Error [TokenInvalid]: An invalid token was provided
```
**Solución**: Verifica que DISCORD_BOT_TOKEN esté configurado correctamente.

---

**🎯 ¡Con esto tu bot debería funcionar perfectamente!**