// Stealth Bot Simplificado para prueba rápida
const fs = require('fs');
const https = require('https');

// Cargar configuración
function loadConfig() {
    const env = {};
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    lines.forEach(line => {
        if (line && !line.startsWith('#') && line.includes('=')) {
            const [key, value] = line.split('=');
            env[key.trim()] = value.trim();
        }
    });
    return env;
}

const config = loadConfig();

console.log(`
╔══════════════════════════════════════════╗
║  🤖 STEALTH ANTICHEAT BOT v2.0       ║
║     Versión Simplificada          ║
╚══════════════════════════════════════════╝
`);

// Verificar configuración
const requiredFields = [
    'DISCORD_BOT_TOKEN',
    'BOT_OWNER_ID',
    'SUPPORT_CHANNEL_ID',
    'DESCUBRIMIENTOS_CHANNEL_ID',
    'IMPLEMENTACIONES_CHANNEL_ID',
    'CHAT_CHANNEL_ID',
    'CMD_CHANNEL_ID',
    'ANTICHEAT_WEBHOOK_URL'
];

console.log('🔍 Verificando configuración...\n');

let allConfigured = true;
requiredFields.forEach(field => {
    const value = config[field];
    if (value && value !== 'PUT_YOUR_USER_ID_HERE' && value !== 'PUT_MINIMAX_API_KEY_HERE') {
        console.log(`✅ ${field}: Configurado`);
    } else {
        console.log(`❌ ${field}: No configurado`);
        allConfigured = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allConfigured) {
    console.log('🎉 ¡CONFIGURACIÓN COMPLETA!');
    console.log('\n📊 INFORMACIÓN DEL BOT:');
    console.log(`• Propietario: ${config.BOT_OWNER_ID}`);
    console.log(`• Token Discord: ${config.DISCORD_BOT_TOKEN.substring(0, 20)}...`);
    console.log(`• Canales configurados: 5/5`);
    console.log(`• MiniMax AI: ${config.MINIMAX_API_KEY !== 'PUT_MINIMAX_API_KEY_HERE' ? '✅ Configurado' : '⚠️  No configurado'}`);
    
    console.log('\n🚀 ESTADO: LISTO PARA LANZAR');
    console.log('\n📋 Para ejecutar en tu máquina local:');
    console.log('1. git clone https://github.com/xpe-hub/stealth-bot-nuevo.git');
    console.log('2. cd stealth-bot-nuevo');
    console.log('3. npm install');
    console.log('4. node bot.js');
    
    // Enviar notificación de configuración completa
    const webhookData = JSON.stringify({
        content: `🤖 **Stealth Bot - Configuración Completa**\n\n✅ **Estado**: Listo para usar\n👤 **Propietario**: ${config.BOT_OWNER_ID}\n🤖 **Bot Token**: Configurado\n📱 **Canales**: 5/5 configurados\n🧠 **MiniMax AI**: ${config.MINIMAX_API_KEY !== 'PUT_MINIMAX_API_KEY_HERE' ? 'Activo' : 'No configurado'}\n\n🚀 **El bot está listo para ser lanzado en tu máquina local**`
    });
    
    const webhookOptions = {
        method: 'POST',
        hostname: 'discord.com',
        port: 443,
        path: '/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(webhookData)
        }
    };
    
    const webhookReq = https.request(webhookOptions, (res) => {
        if (res.statusCode === 204) {
            console.log('\n📢 **Notificación enviada al canal AntiCheat**');
        } else {
            console.log('\n⚠️  No se pudo enviar la notificación');
        }
    });
    
    webhookReq.on('error', (err) => {
        console.log('\n⚠️  Error enviando notificación:', err.message);
    });
    
    webhookReq.write(webhookData);
    webhookReq.end();
    
} else {
    console.log('\n❌ **CONFIGURACIÓN INCOMPLETA**');
    console.log('Por favor configura los campos faltantes en el archivo .env');
}

console.log('\n' + '='.repeat(50));