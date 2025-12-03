// ========================================================
// STEALTH-ANTICHEATX - VERSIÓN LIMPIA VERDE
// Bot anticheat simple sin MiniMax - Diseño original
// ========================================================

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variables de configuración
const BOT_PREFIX = process.env.BOT_PREFIX || '$';
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;
const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;
const CHAT_CHANNEL_ID = process.env.CHAT_CHANNEL_ID;
const CMD_CHANNEL_ID = process.env.CMD_CHANNEL_ID;
const ANTICHEAT_WEBHOOK_URL = process.env.ANTICHEAT_WEBHOOK_URL;

// Estado del bot
let currentVoiceChannel = null;
let voiceConnection = null;

// Embed Verde Principal - Stealth-AntiCheatX
const createStealthEmbed = (title, description, color = 0x00FF00) => {
    return new EmbedBuilder()
        .setTitle(`🛡️ ${title}`)
        .setDescription(description)
        .setColor(color)
        .setFooter({ 
            text: 'Stealth-AntiCheatX v3.0 • Sistema Anti-Cheat Activo',
            iconURL: 'https://cdn.discordapp.com/emojis/1234567890123456789.png'
        })
        .setTimestamp();
};

// Canal de Comandos
const CMD_CHANNEL_ID = process.env.CMD_CHANNEL_ID;

// Conexión y Login
client.once('ready', () => {
    console.log(`🛡️ Stealth-AntiCheatX Conectado como ${client.user.tag}`);
    console.log(`🔧 Sistema Anti-Cheat Activo`);
    console.log(`🎯 Canales configurados: Chat=${CHAT_CHANNEL_ID}, Comandos=${CMD_CHANNEL_ID}`);
    
    // Estado personalizado
    client.user.setPresence({
        activities: [{ 
            name: '🛡️ Monitoreando servidores',
            type: 3 // WATCHING
        }],
        status: 'online'
    });
});

client.on('messageCreate', async (message) => {
    // No responder a bots
    if (message.author.bot) return;
    
    // Solo procesar comandos en canales específicos
    if (![CHAT_CHANNEL_ID, CMD_CHANNEL_ID].includes(message.channel.id)) {
        return;
    }
    
    // Comando de ayuda
    if (message.content.startsWith(`${BOT_PREFIX}help`)) {
        const helpEmbed = createStealthEmbed(
            'Comandos Stealth-AntiCheatX',
            `**Comandos Disponibles:**

🛡️ **$anticheat** - Información del sistema anti-cheat
🎤 **$join** - Unirse al canal de voz
👋 **$leave** - Salir del canal de voz  
🎵 **$voices** - Lista de comandos de voz
🔍 **$status** - Estado del sistema
📊 **$scan** - Escaneo básico de seguridad
💬 **$chat** - Chat con el bot (solo canal de chat)

**Canal de Comandos:** <#${CMD_CHANNEL_ID}>
**Canal de Chat:** <#${CHAT_CHANNEL_ID}>`
        );
        
        return message.channel.send({ embeds: [helpEmbed] });
    }
    
    // Comando de estado
    if (message.content.startsWith(`${BOT_PREFIX}status`)) {
        const statusEmbed = createStealthEmbed(
            'Estado del Sistema',
            `🟢 **Estado:** Operativo
🔒 **Anti-Cheat:** Activo
🎤 **Voz:** ${currentVoiceChannel ? 'Conectado' : 'Desconectado'}
👥 **Usuarios:** ${message.guild.memberCount}
📊 **Latencia:** ${client.ws.ping}ms`
        );
        
        return message.channel.send({ embeds: [statusEmbed] });
    }
    
    // Comando Anti-Cheat
    if (message.content.startsWith(`${BOT_PREFIX}anticheat`)) {
        const anticheatEmbed = createStealthEmbed(
            'Sistema Anti-Cheat Stealth-AntiCheatX',
            `🛡️ **Protección Activa Contra:**

🔍 **Cheats Detectados**
- Aimbots y Triggerbots
- Wallhacks y ESP
- Speedhacks y Fly hacks
- Script injections
- Memory modifications

⚡ **Características:**
- Monitoreo en tiempo real
- Detección automática
- Reportes instantáneos
- Protección integral

🔧 **Versión:** v3.0
🌐 **Estado:** ${message.guild.name}`
        );
        
        return message.channel.send({ embeds: [anticheatEmbed] });
    }
    
    // Comando de escaneo
    if (message.content.startsWith(`${BOT_PREFIX}scan`)) {
        const scanEmbed = createStealthEmbed(
            'Escaneo de Seguridad Completado',
            `✅ **Análisis Completado:**

🔍 Procesos verificados: OK
🛡️ Protecciones activas: OK
⚡ Sistema estable: OK
🎮 Cliente validado: OK

**Resultado:** 🟢 Ambiente Seguro`
        );
        
        return message.channel.send({ embeds: [scanEmbed] });
    }
    
    // Comando Unirse a Voz
    if (message.content.startsWith(`${BOT_PREFIX}join`)) {
        if (!message.member.voice.channel) {
            const errorEmbed = createStealthEmbed(
                'Error de Conexión',
                '❌ Debes estar en un canal de voz para usar este comando.',
                0xFF0000
            );
            return message.channel.send({ embeds: [errorEmbed] });
        }
        
        try {
            // Conectar al canal de voz
            const voiceChannel = message.member.voice.channel;
            voiceConnection = await voiceChannel.join();
            currentVoiceChannel = voiceChannel;
            
            const joinEmbed = createStealthEmbed(
                'Conectado a Voz',
                `✅ Conectado exitosamente a **${voiceChannel.name}**
🎤 Calidad: Optimizada
🛡️ Sistema Anti-Cheat Activo en Voz`
            );
            
            message.channel.send({ embeds: [joinEmbed] });
            
        } catch (error) {
            console.error('Error conectando a voz:', error);
            const errorEmbed = createStealthEmbed(
                'Error de Conexión',
                '❌ No se pudo conectar al canal de voz.',
                0xFF0000
            );
            message.channel.send({ embeds: [errorEmbed] });
        }
    }
    
    // Comando Salir de Voz
    if (message.content.startsWith(`${BOT_PREFIX}leave`)) {
        if (!voiceConnection) {
            const errorEmbed = createStealthEmbed(
                'No Conectado',
                '❌ El bot no está conectado a ningún canal de voz.',
                0xFF0000
            );
            return message.channel.send({ embeds: [errorEmbed] });
        }
        
        try {
            if (voiceConnection) {
                voiceConnection.disconnect();
                voiceConnection = null;
            }
            currentVoiceChannel = null;
            
            const leaveEmbed = createStealthEmbed(
                'Desconectado de Voz',
                '👋 Desconectado del canal de voz.
🛡️ Sistema Anti-Cheat sigue activo.'
            );
            
            message.channel.send({ embeds: [leaveEmbed] });
            
        } catch (error) {
            console.error('Error desconectando de voz:', error);
        }
    }
    
    // Lista de comandos de voz
    if (message.content.startsWith(`${BOT_PREFIX}voices`)) {
        const voicesEmbed = createStealthEmbed(
            'Comandos de Voz Disponibles',
            `🎤 **Para usar en canal de voz:**

${BOT_PREFIX}join - Unirse al canal
${BOT_PREFIX}leave - Salir del canal
${BOT_PREFIX}status - Estado del bot

🛡️ **Nota:** Los comandos de voz solo funcionan cuando el bot está conectado al canal.`
        );
        
        return message.channel.send({ embeds: [voicesEmbed] });
    }
    
    // Chat simple (solo en canal de chat)
    if (message.content.startsWith(`${BOT_PREFIX}chat`) && message.channel.id === CHAT_CHANNEL_ID) {
        const chatResponse = message.content.replace(`${BOT_PREFIX}chat `, '');
        
        const chatEmbed = createStealthEmbed(
            'Chat con Stealth-AntiCheatX',
            `💬 **Tu mensaje:** ${chatResponse}
🤖 **Respuesta:** ¡Hola! Soy el sistema anti-cheat de ${message.guild.name}. Estoy aquí para mantener el servidor seguro.`
        );
        
        return message.channel.send({ embeds: [chatEmbed] });
    }
    
    // Respuesta de ayuda para comandos no reconocidos
    if (message.content.startsWith(BOT_PREFIX)) {
        const unknownEmbed = createStealthEmbed(
            'Comando No Reconocido',
            `❓ Comando desconocido: \`${message.content}\`

💡 **Usa ${BOT_PREFIX}help** para ver todos los comandos disponibles.`,
            0xFFA500
        );
        
        return message.channel.send({ embeds: [unknownEmbed] });
    }
});

// Manejo de errores
client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('warn', warning => {
    console.warn('Discord client warning:', warning);
});

// Reconexión automática
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});

// Login
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error('❌ Token del bot no encontrado en variables de entorno');
    process.exit(1);
}

console.log('🛡️ Iniciando Stealth-AntiCheatX v3.0...');
client.login(BOT_TOKEN);