# 🚀 MIGRACIÓN COMPLETA A RENDER.COM

## ⚡ CONFIGURACIÓN CRÍTICA PARA RENDER

### 🎯 **PASO 1: Configuración de Health Check**

Crear archivo `server.js` para Render (solución al sleep automático):

```javascript
const http = require('http');

const port = process.env.PORT || 10000;

// Health check endpoint
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date() }));
    } else if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Stealth-AntiCheatX Bot is Running! 🤖</h1>');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Iniciar bot después del servidor
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ] 
});

client.once('clientReady', () => {
    console.log(`🤖 Stealth-AntiCheatX está listo en Render!`);
    console.log(`📍 Conectado como: ${client.user.tag}`);
    console.log(`🏠 En ${client.guilds.cache.size} servidores`);
});

// Cargar variables de entorno
require('dotenv').config();

// Leer y ejecutar el bot
require('./bot.js');

```

### 🎯 **PASO 2: Variables de Entorno en Render**

Configurar estas variables en Render.com:

```
DISCORD_BOT_TOKEN=[tu_token_aquí]
BOT_OWNER_ID=751601149928538224
SUPPORT_CHANNEL_ID=1442209840976887849
DESCUBRIMIENTOS_CHANNEL_ID=1442266383265038386
IMPLEMENTACIONES_CHANNEL_ID=1442268897406619798
CHAT_CHANNEL_ID=1442266154516091020
CMD_CHANNEL_ID=1441888236833210389
ANTICHEAT_WEBHOOK_URL=https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM
COMMUNITY_SERVER_INVITE=https://discord.gg/stealth-anticheat
BOT_PREFIX=$
NODE_ENV=production
PORT=10000
```

### 🎯 **PASO 3: package.json para Render**

```json
{
  "name": "stealth-anticheat-bot",
  "version": "1.0.0",
  "description": "Stealth-AntiCheatX Discord Bot for Render",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node bot.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "discord.js": "^14.15.3",
    "dotenv": "^16.4.1"
  },
  "keywords": ["discord", "bot", "anticheat", "stealth"],
  "author": "xpe.nettt",
  "license": "MIT"
}
```

## 🎯 **PASO 4: Configuración en Render.com**

1. **Crear cuenta** en Render.com
2. **Nuevo Web Service** → Conectar GitHub
3. **Configurar:**
   - Name: `stealth-anticheat-bot`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - **Automáticamente detectará server.js**

## 🎯 **PASO 5: Health Check Setup**

Render usa automáticamente health checks en puerto 10000. El endpoint `/health` mantiene el servicio activo 24/7.

## 📊 **VENTAJAS DE RENDER vs RAILWAY**

| Característica | Railway | Render |
|----------------|---------|--------|
| **Costo** | $5/mes después de prueba | **GRATIS** 750h/mes |
| **Sleep** | Automatic sleep en free | **24/7 sin sleep** |
| **Health Check** | Manual | **Automático** |
| **Deploy** | Manual | **Auto desde GitHub** |
| **Uptime** | Variable | **99.9% garantizado** |

## 🚨 **CUENTA REGRESIVA**

- **Días restantes en Railway**: ~16 días
- **Tiempo para migración**: 1-2 horas
- **Ventana de seguridad**: 7 días antes del vencimiento

## ✅ **CHECKLIST PRE-MIGRACIÓN**

- [ ] Crear cuenta en Render.com
- [ ] Subir archivos server.js y package.json a GitHub
- [ ] Configurar variables de entorno en Render
- [ ] Test de conectividad Discord
- [ ] Verificar todos los comandos funcionan
- [ ] Migrar dominio personalizado (opcional)

## 📞 **PRÓXIMOS PASOS**

1. **Ejecutar pruebas en Railway** (ahora)
2. **Crear cuenta Render** (hoy)
3. **Configurar migración** (mañana)
4. **Deploy en Render** (esta semana)
5. **Verificar estabilidad** (24h testing)
6. **Migrar dominio** (si necesario)

¡RENDER = MIGRACIÓN EXITOSA SIN COSTO! 🎯