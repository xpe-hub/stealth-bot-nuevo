// server.js - Render.com optimized with health checks
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 10000;

// Health check endpoint - CRITICAL for Render 24/7 uptime
const server = http.createServer((req, res) => {
    console.log(`📡 Health check request: ${req.method} ${req.url}`);
    
    if (req.url === '/health' || req.url === '/health/') {
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            service: 'Stealth-AntiCheatX Bot',
            uptime: process.uptime()
        }));
    } else if (req.url === '/' || req.url === '/status') {
        res.writeHead(200, { 
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stealth-AntiCheatX Bot</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px;
            color: white;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .emoji { font-size: 4em; margin-bottom: 20px; }
        .status { 
            color: #00ff88; 
            font-weight: bold; 
            font-size: 1.2em;
            margin: 20px 0;
        }
        .info {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .timestamp {
            font-size: 0.9em;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">🤖</div>
        <h1>Stealth-AntiCheatX Bot</h1>
        <div class="status">✅ ONLINE - Render.com</div>
        <div class="info">
            <h3>🛡️ Anti-Cheat System Active</h3>
            <p>Bot de monitoreo y seguridad para Community Stealth</p>
            <p><strong>Desarrollado por:</strong> xpe.nettt</p>
            <p><strong>Plataforma:</strong> Render.com</p>
            <p><strong>Uptime:</strong> ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m</p>
        </div>
        <div class="timestamp">
            Última verificación: ${new Date().toLocaleString('es-ES')}
        </div>
    </div>
    
    <script>
        // Auto refresh status
        setInterval(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>
        `);
    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            error: 'Not Found',
            message: 'Este es un bot de Discord. Usa los comandos en Discord.',
            availableEndpoints: ['/', '/health']
        }));
    }
});

server.listen(port, () => {
    console.log(`🚀 Stealth-AntiCheatX Server iniciado en puerto ${port}`);
    console.log(`📡 Health check disponible en: http://localhost:${port}/health`);
    console.log(`🌐 Status page disponible en: http://localhost:${port}/`);
    console.log(`⏰ Tiempo de inicio: ${new Date().toISOString()}`);
    
    // Iniciar el bot después del servidor
    startBot();
});

// Función para iniciar el bot
async function startBot() {
    try {
        console.log('🤖 Iniciando Stealth-AntiCheatX Bot...');
        
        // Verificar que bot.js existe
        if (!fs.existsSync('./bot.js')) {
            throw new Error('bot.js no encontrado');
        }
        
        // Cargar variables de entorno
        require('dotenv').config();
        
        // Importar y ejecutar el bot
        const { Client, GatewayIntentBits } = require('discord.js');
        
        // Crear cliente con todos los intents necesarios
        const client = new Client({ 
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences
            ]
        });
        
        // Evento cuando el bot esté listo
        client.once('clientReady', () => {
            console.log('✅ ¡Stealth-AntiCheatX está listo en Render!');
            console.log(`📍 Conectado como: ${client.user.tag}`);
            console.log(`🏠 En ${client.guilds.cache.size} servidores`);
            console.log(`👥 Total usuarios: ${client.users.cache.size}`);
            
            // Configurar status dinámico cada 15 segundos
            const activities = [
                '🔍 Escaneando amenazas...',
                '🛡️ Protegiendo Community Stealth',
                '⚡ Analizando servidores',
                '🚨 Monitoreo anti-cheat activo',
                '👀 Vigilando exploits',
                '🔧 Manteniendo seguridad',
                '🎯 Detectando trampas',
                '🌟 Community Stealth'
            ];
            
            let activityIndex = 0;
            setInterval(() => {
                activityIndex = (activityIndex + 1) % activities.length;
                client.user.setPresence({
                    status: 'online',
                    activities: [{ 
                        name: activities[activityIndex], 
                        type: 3 // WATCHING
                    }]
                });
            }, 15000);
        });
        
        // Cargar el archivo principal del bot
        console.log('📄 Cargando configuración del bot...');
        
        // Ejecutar bot.js directamente (esto incluye todo el código del bot)
        require('./bot.js');
        
        // Conectar a Discord
        const token = process.env.DISCORD_BOT_TOKEN;
        if (!token) {
            throw new Error('DISCORD_BOT_TOKEN no está configurado');
        }
        
        await client.login(token);
        
    } catch (error) {
        console.error('❌ Error iniciando el bot:', error);
        process.exit(1);
    }
}

// Manejo graceful de errores
process.on('unhandledRejection', error => {
    console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM recibido. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT recibido. Cerrando servidor...');
    process.exit(0);
});