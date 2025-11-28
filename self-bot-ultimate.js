const Discord = require('discord.js-selfbot-v13');
const OpenAI = require('openai');
const express = require('express');
const app = express();

// Configuración de OpenAI para IA REAL
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Aquí va tu API key
});

// Configuración del bot
const client = new Discord.Client({
    checkUpdate: false,
    ws: {
        properties: {
            $browser: "Discord iOS"
        }
    }
});

// Configuración de RPC
const RPC = require('discord-rpc');
RPC.register('1234567890123456789'); // Reemplaza con tu ID de aplicación

const rpcClient = new RPC.Client({ transport: 'ipc' });

// Configurar Rich Presence
async function setRPC() {
    if (!rpcClient) return;
    
    await rpcClient.setActivity({
        state: "🛡️ Stealth-AntiCheat Active",
        details: "Protegiendo el servidor 24/7",
        startTimestamp: Date.now(),
        largeImageKey: "stealth-logo",
        largeImageText: "Sistema Anti-Cheat",
        smallImageKey: "shield",
        smallImageText: "Protegido",
        buttons: [
            {
                label: "Servidor Principal",
                url: "https://discord.gg/stealth-anticheat"
            }
        ]
    });
}

// Historial de conversación para IA contextual
const conversationHistory = new Map();

// Sistema de IA Real con OpenAI
async function generateAIResponse(message, channelId) {
    try {
        // Obtener historial del canal
        if (!conversationHistory.has(channelId)) {
            conversationHistory.set(channelId, []);
        }
        
        const history = conversationHistory.get(channelId);
        
        // Contexto especializado para Stealth-AntiCheat
        const systemPrompt = `Eres Stealth-AntiCheat, un sistema de IA avanzado especializado en detección de trampas y protección contra hackers. 

Tu personalidad:
- Eres frío, analítico y preciso
- Hablas como un experto en ciberseguridad
- Usas terminología técnica apropiada
- Mantienes un tono profesional pero accesible
- Eres proactivo en detectar posibles amenazas
- Tienes conocimiento profundo sobre gaming, hacking y anticheat

Tu función principal:
- Asistir con temas de seguridad y anticheat
- Responder preguntas técnicas sobre cheating/hacking
- Proporcionar información sobre sistemas de protección
- Mantener conversaciones inteligentes y contextuales
- Recordar el contexto de conversaciones anteriores

Responde de manera natural e inteligente, NO de forma robótica.`;
        
        // Agregar mensaje actual al historial
        history.push({
            role: "user",
            content: message.content
        });
        
        // Mantener solo los últimos 10 mensajes para optimizar
        const recentHistory = history.slice(-10);
        
        // Llamar a OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4", // Modelo más potente
            messages: [
                { role: "system", content: systemPrompt },
                ...recentHistory
            ],
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.3,
            frequency_penalty: 0.3
        });
        
        const aiResponse = completion.choices[0].message.content.trim();
        
        // Guardar respuesta en historial
        history.push({
            role: "assistant",
            content: aiResponse
        });
        
        return aiResponse;
        
    } catch (error) {
        console.error('Error con OpenAI:', error);
        return "🛡️ **Error del sistema de IA:** No puedo procesar tu consulta en este momento. ¿Podrías intentar de nuevo?";
    }
}

// Eventos del bot
client.on('ready', () => {
    console.log(`🛡️ Stealth-AntiCheat Bot iniciado como ${client.user.tag}`);
    console.log(`🔗 Conectado a ${client.guilds.cache.size} servidores`);
    
    // Configurar RPC al inicio
    setRPC();
    
    // Actualizar presencia cada 30 segundos
    const activities = [
        "🛡️ Vigilando el servidor",
        "⚡ Detectando actividades sospechosas",
        "🔍 Analizando patrones de comportamiento",
        "🚫 Bloqueando intentos de cheating",
        "💻 Monitoreando seguridad",
        "🎮 Protegiendo gameplay justo"
    ];
    
    let activityIndex = 0;
    setInterval(() => {
        client.user.setActivity(activities[activityIndex], { type: 3 });
        activityIndex = (activityIndex + 1) % activities.length;
    }, 30000);
    
    // Configurar RPC
    rpcClient.on('ready', () => {
        console.log('🚀 RPC configurado');
        setRPC();
    });
    
    // Reintentar RPC cada minuto
    setInterval(() => {
        if (!rpcClient) {
            rpcClient = new RPC.Client({ transport: 'ipc' });
            rpcClient.login({ clientId: '1234567890123456789' });
        }
    }, 60000);
});

client.on('message', async (message) => {
    // Ignorar mensajes de bots
    if (message.author.bot) return;
    
    // Solo responder si el bot es mencionado o está en canal específico
    const shouldRespond = message.content.includes('<@!' + client.user.id + '>') || 
                         message.content.includes(client.user.toString()) ||
                         message.channel.name.includes('chat-ai') ||
                         message.channel.name.includes('cmd');
    
    if (!shouldRespond) return;
    
    // Detectar canal CMD para comandos
    if (message.channel.name.includes('cmd')) {
        // Comandos específicos
        if (message.content.startsWith('$vc')) {
            if (message.member.voice.channel) {
                try {
                    const voiceChannel = message.member.voice.channel;
                    const connection = await voiceChannel.join();
                    message.channel.send(`🛡️ **Conectado a ${voiceChannel.name}**\n✅ Audio: ${connection.dispatcher ? 'Activo' : 'Configurando...'}`);
                    
                    // Auto-desconectar después de 10 minutos
                    setTimeout(() => {
                        if (voiceChannel.members.has(client.user.id)) {
                            voiceChannel.leave();
                            message.channel.send('🔊 **Desconectado del canal de voz**');
                        }
                    }, 600000);
                    
                } catch (error) {
                    message.channel.send('❌ **Error conectando a voz:** ' + error.message);
                }
            } else {
                message.channel.send('❌ **No estás en un canal de voz**\n💡 Entra a un canal y usa `$vc`');
            }
        }
        return;
    }
    
    // Generar respuesta con IA REAL
    const response = await generateAIResponse(message, message.channel.id);
    
    // Responder con estilo personalizado
    const embed = new Discord.Embed()
        .setColor('#0099ff')
        .setTitle('🛡️ Stealth-AntiCheat')
        .setDescription(response)
        .setTimestamp()
        .setFooter({ text: 'Sistema Anti-Cheat | IA Avanzada' });
    
    await message.channel.send({ embeds: [embed] });
});

// Configurar servidor web para health checks
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        bot: client.user.tag,
        servers: client.guilds.cache.size,
        users: client.users.cache.size,
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Servidor web ejecutándose en puerto ${PORT}`);
});

// Manejo de errores
process.on('unhandledRejection', error => {
    console.error('Error no manejado:', error);
});

process.on('SIGINT', () => {
    console.log('🛑 Cerrando bot...');
    client.destroy();
    process.exit(0);
});

// Iniciar bot (el token se configura con variables de entorno)
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ Necesitas configurar DISCORD_TOKEN en variables de entorno');
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);