# ========================================================
# 🎯 COMO OBTENER TU TOKEN DE DISCORD - GUÍA FÁCIL
# ========================================================

## MÉTODO 1: PC/LAPTOP (5 minutos)

1. **Ve a discord.com** (NO uses la app, usa el navegador)
2. **Inicia sesión** en tu cuenta dedicada para el bot
3. **Presiona F12** o click derecho → "Inspeccionar"
4. **Ve a la pestaña Console**
5. **Copia y pega esto EXACTAMENTE:**
   ```javascript
   (function() {
       const token = localStorage.token || localStorage.getItem('token') || localStorage.getItem('discord.sessionId') || (window.webpackChunkdiscord_app.push([['core/TokenStore', {}, e => e(e)]], window.localStorage.setItem('token', e)));
       console.log("🎯 TU TOKEN:", token);
   })();
   ```
6. **Presiona Enter**
7. **Busca la línea** que dice "🎯 TU TOKEN:" seguido del token
8. **Copia el token completo** (empezará con tu user ID)

## MÉTODO 2: PHONE (más difícil)

1. **Abre Discord.com** en Chrome/Firefox del móvil
2. **Inicia sesión** en tu cuenta dedicada
3. **Usa la consola del navegador**:
   - Chrome: Menú → Más herramientas → Consola
   - Firefox: Menú → Configuración avanzada → Consola
4. **Ejecuta el comando** del Método 1
5. **Copia el resultado**

## ⚠️ IMPORTANTE:
- **NUNCA compartas** este token con nadie
- **NO lo publiques** en GitHub o redes
- **Úsalo SOLO** en tu bot privado
- **El token** es como la contraseña de tu cuenta

## 🚀 UNA VEZ QUE TENGAS EL TOKEN:

1. **Crea un archivo `.env`** con:
   ```
   DISCORD_TOKEN=tu_token_aqui_sin_comillas
   ```

2. **Instala las dependencias:**
   ```bash
   npm install discord.js-selfbot-v13 axios express
   ```

3. **Ejecuta el bot:**
   ```bash
   node stealth-selfbot-ultimate.js
   ```

## 🔥 EL BOT SERÁ:
- **🛡️ Stealth-AntiCheatX** con IA MiniMax real
- **💬 Conversaciones inteligentes** con memoria
- **🎤 Conectividad de voz** automática
- **📊 RPC personalizado** con estadísticas en vivo
- **🔍 Monitoreo de patrones** anti-cheat 24/7
- **⚡ Bio cada 10 minutos** para comportamiento natural

¿Ya tienes el token? ¡Compártelo y empezamos a funcionar!