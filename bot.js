// ========================================================
// STEALTH-ANTICHEATX - BOT MEJORADO 2025-11-28
// Bio cada 10min + VC robusto + Reconocimiento canales
// CON IA MINIMAX REAL + Comandos avanzados + Estilo Stealth
// ========================================================

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Stealth-CheatX AI Integration - Anti-Cheat Specialist
const { stealthCheatXChat, processStealthCheatXResponse, executeAntiCheatTool } = require('./stealth_cheatx_ai');

// Advanced Anti-Cheat Modules Integration - v3.0
const { analyzeDLL, detectBypassMethods, calculateThreatScore } = require('./anticheat_analyzer_advanced');
const { connectToRepository, analyzeCommits, getRepositoryStatus } = require('./repository_connector');

// Configuración del bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Variables de configuración
const BOT_PREFIX = process.env.BOT_PREFIX || '$';
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;
const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;
const DESCUBRIMIENTOS_CHANNEL_ID = process.env.DESCUBRIMIENTOS_CHANNEL_ID;
const IMPLEMENTACIONES_CHANNEL_ID = process.env.IMPLEMENTACIONES_CHANNEL_ID;
const CHAT_CHANNEL_ID = process.env.CHAT_CHANNEL_ID;
const CMD_CHANNEL_ID = process.env.CMD_CHANNEL_ID;
const ANTICHEAT_WEBHOOK_URL = process.env.ANTICHEAT_WEBHOOK_URL;
const COMMUNITY_SERVER_INVITE = process.env.COMMUNITY_SERVER_INVITE || 'https://discord.gg/stealth-anticheat';

// Base de datos de apodos
const NICKNAMES_FILE = path.join(__dirname, 'nicknames.json');
const DEVELOPERS_FILE = path.join(__dirname, 'developers.json');

// Funciones para manejar apodos
function loadNicknames() {
    try {
        if (fs.existsSync(NICKNAMES_FILE)) {
            const data = fs.readFileSync(NICKNAMES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error loading nicknames:', error);
    }
    return {};
}

// Funciones para manejar desarrolladores
function loadDevelopers() {
    try {
        if (fs.existsSync(DEVELOPERS_FILE)) {
            const data = fs.readFileSync(DEVELOPERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error loading developers:', error);
    }
    return { owners: [], developers: [] };
}

function saveNicknames(nicknames) {
    try {
        fs.writeFileSync(NICKNAMES_FILE, JSON.stringify(nicknames, null, 2));
    } catch (error) {
        console.log('Error saving nicknames:', error);
    }
}

function saveDevelopers(developers) {
    try {
        fs.writeFileSync(DEVELOPERS_FILE, JSON.stringify(developers, null, 2));
    } catch (error) {
        console.log('Error saving developers:', error);
    }
}

let nicknames = loadNicknames();
let developers = loadDevelopers();

// Funciones auxiliares
function isOwner(userId) {
    return userId === BOT_OWNER_ID;
}

function isDeveloper(userId) {
    return developers.developers.includes(userId) || isOwner(userId);
}

function getUserNickname(userId, username) {
    return nicknames[userId] || username;
}

function getTotalMemberCount(client) {
    let totalMembers = 0;
    client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount;
    });
    return totalMembers;
}

function getCurrentGuildMemberCount(client) {
    const guild = client.guilds.cache.first();
    return guild ? guild.memberCount : 0;
}

// Función para análisis de amenazas simulado
function performThreatAnalysis() {
    const threats = [
        { type: 'Sospechoso', count: Math.floor(Math.random() * 5), severity: 'Media' },
        { type: 'Actividad anómala', count: Math.floor(Math.random() * 3), severity: 'Baja' },
        { type: 'Módulos no firmados', count: Math.floor(Math.random() * 2), severity: 'Alta' }
    ];
    return threats;
}

// Array para almacenar métodos descubiertos (simula base de datos)
const discoveredMethods = [];

// Función para reportar a canales de descubrimiento
async function reportToDiscoveryChannels(client, methodData) {
    try {
        // Agregar método a la lista de descubiertos
        const method = {
            id: discoveredMethods.length + 1,
            ...methodData,
            status: 'PENDING_ANALYSIS',
            timestamp: new Date().toISOString(),
            discoveredBy: 'automatic_detection'
        };
        
        discoveredMethods.push(method);
        
        // Enviar reporte a canal de descubrimientos
        const discoveryChannel = client.channels.cache.get(DESCUBRIMIENTOS_CHANNEL_ID);
        if (discoveryChannel) {
            const discoveryEmbed = new EmbedBuilder()
                .setTitle('🔍 NUEVO CHEAT DETECTADO')
                .setDescription('**Análisis automático completado**')
                .addFields(
                    { name: '🔧 Método', value: method.method, inline: false },
                    { name: '👤 Usuario', value: `${methodData.user} (${methodData.userId})`, inline: true },
                    { name: '🏠 Servidor', value: methodData.guildId, inline: true },
                    { name: '📊 Patrón', value: `\`${methodData.pattern}\``, inline: false },
                    { name: '⚡ Severidad', value: methodData.severity, inline: true },
                    { name: '⏰ Detectado', value: new Date(methodData.timestamp).toLocaleString(), inline: true },
                    { name: '🆔 Método ID', value: `#${method.id}`, inline: true }
                )
                .setColor('#ff6600')
                .setFooter({ text: '🤖 Sistema de Detección Automática | Stealth-AntiCheat' })
                .setTimestamp();
            
            await discoveryChannel.send({ embeds: [discoveryEmbed] });
        }
        
        console.log(`✅ Método ${method.id} reportado`);
        
    } catch (error) {
        console.error('Error en reportToDiscoveryChannels:', error);
    }
}

// Evento: Bot listo
client.once('ready', () => {
    console.log('🛡️ Stealth-AntiCheat está listo!');
    console.log(`📍 Conectado como: ${client.user.tag}`);
    console.log(`🏠 En ${client.guilds.cache.size} servidores`);
    
    // Establecer presencia dinámica del bot (BIO VIVA) con IA MiniMax
    const activities = [
        '🛡️ Stealth-AntiCheat con IA MiniMax',
        '⚡ Monitoreando 12 patrones activos',
        '🔍 Analizando repositorio xpe-hub/stealth-bot-nuevo', 
        '🚫 Detectando DLL Injection',
        '💻 MiniMax-M2 conectado',
        '🎮 Protegiendo gameplay justo',
        '🤖 IA contextualizando conversaciones',
        '🎯 Patrones anti-cheat en tiempo real',
        '🔒 Sistema de seguridad avanzado',
        '📊 Sistema Stealth operacional',
        '🚨 Monitoreo 24/7 activo',
        '👀 Vigilando exploits de memoria',
        '🔧 Manteniendo protección constante',
        '🎯 Aimbot detection activa',
        '🌟 Community Stealth protegida',
        '⚙️ Procesando con MiniMax API',
        '💡 Resolviendo vulnerabilidades',
        '🛠️ Análisis predictivo habilitado'
    ];
    
    let activityIndex = 0;
    
    // Cambiar actividad cada 10 minutos (BIO VIVA)
    setInterval(() => {
        activityIndex = (activityIndex + 1) % activities.length;
        
        client.user.setPresence({
            status: 'online',
            activities: [{ 
                name: activities[activityIndex], 
                type: 3 // WATCHING
            }]
        });
    }, 600000); // 10 minutos

    // Inicializar desarrolladores con el owner por defecto
    if (!developers.owners.includes(BOT_OWNER_ID)) {
        developers.owners.push(BOT_OWNER_ID);
        saveDevelopers(developers);
    }
    
    // Mensaje de bienvenida en canal de chat si existe
    if (CHAT_CHANNEL_ID) {
        const chatChannel = client.channels.cache.get(CHAT_CHANNEL_ID);
        if (chatChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setTitle('🛡️ Stealth-AntiCheatX Iniciado')
                .setDescription('Sistema anti-cheat completamente operacional')
                .setColor('#00ff00')
                .addFields(
                    { name: '🔍 Detección Activa', value: '12+ patrones cargados', inline: true },
                    { name: '⚡ Monitoreo', value: 'Tiempo real', inline: true },
                    { name: '🎯 Estado', value: 'Protección activa', inline: true },
                    { name: '💬 Conversación', value: '¡Habla conmigo mencionándome!', inline: false }
                )
                .setFooter({ text: 'Stealth-AntiCheat | Sistema Operacional' })
                .setTimestamp();
            
            chatChannel.send({ embeds: [welcomeEmbed] });
        }
    }
});

// Función para detectar patrones de cheats
async function detectCheatPatterns(client, message) {
    try {
        const content = message.content.toLowerCase().trim();
        
        // Patrones de detección de cheats (actualizados constantemente)
        const cheatPatterns = [
            // DLL Injection
            { pattern: /dll\s*injection|inject\s+dll|manualmap|loadlibrary|dll\s*inject/, method: 'DLL Injection Detectado' },
            { pattern: /createthread|remotethread|writeprocessmemory/, method: 'Memory Manipulation' },
            
            // Memory Hacks
            { pattern: /memory\s*hack|ram\s*hack|ramhack|memory\s*editor/, method: 'Memory Hacking Tool' },
            { pattern: /ce\s*table|cheat\s*engine|process\s*hacker/, method: 'Memory Editing Software' },
            { pattern: /write\s*memory|read\s*memory|modify\s*memory/, method: 'Memory Modification' },
            
            // ESP/Aimbot
            { pattern: /esp\s*hack|wallhack|see\s*through\s*walls/, method: 'ESP Wallhack' },
            { pattern: /aim\s*bot|aimbot|auto\s*aim|predictive\s*aim/, method: 'Aimbot Detection' },
            { pattern: /no\s*spread|perfect\s*accuracy|instant\s*kill/, method: 'Combat Modifications' },
            
            // Speed/Time Hacks
            { pattern: /speed\s*hack|speedhack|time\s*warp|faster\s*game/, method: 'Speed Manipulation' },
            { pattern: /freeze\s*time|pause\s*game|slow\s*motion/, method: 'Time Manipulation' },
            
            // Teleport/Position
            { pattern: /teleport|teleport\s*hack| warp\s*position|fly\s*hack/, method: 'Position Teleportation' },
            { pattern: /noclip|fly\s*mode|ghost\s*mode|invisible\s*mode/, method: 'Movement Bypass' },
            
            // Triggerbot/Auto-fire
            { pattern: /trigger\s*bot|triggerbot|auto\s*fire|auto\s*shoot/, method: 'Triggerbot Detection' },
            { pattern: /auto\s*clicker|rapid\s*fire|hold\s*to\s*fire/, method: 'Auto-fire Modification' },
            
            // Item/Resource Hacks
            { pattern: /item\s*spawn|item\s*hack|infinite\s*items/, method: 'Item Generation Hack' },
            { pattern: /money\s*hack|coin\s*hack|credits\s*hack/, method: 'Resource Manipulation' },
            { pattern: /experience\s*hack|xp\s*hack|level\s*up/, method: 'Experience Manipulation' },
            
            // Bypass/Security
            { pattern: /anti\s*cheat\s*bypass|bypass\s*anticheat|disabled\s*security/, method: 'Anti-cheat Bypass' },
            { pattern: /vac\s*bypass|easypass|nocd\s*crack/, method: 'Security Bypass' },
            { pattern: /detect\s*proof|undetectable\s*hack/, method: 'Stealth Mode' },
            
            // Download/Links
            { pattern: /download.*hack|dl\s*hack|get\s*hack|free\s*hack/, method: 'Hack Distribution' },
            { pattern: /mega\.nz|mediafire.*hack|dropbox.*hack/, method: 'Hack Download Links' },
            
            // General Terms
            { pattern: /cheat\s*code|hack\s*tool|game\s*hack|game\s*cheat/, method: 'Generic Cheat Tool' },
            { pattern: /modded|mod.*game|game\s*mod/, method: 'Game Modification' },
            { pattern: /server\s*hack|game\s*server\s*attack/, method: 'Server Attack Tool' }
        ];
        
        // Buscar patrones coincidentes
        for (const cheatPattern of cheatPatterns) {
            if (cheatPattern.pattern.test(content)) {
                console.log('🚨 CHEAT PATTERN DETECTADO:', cheatPattern.method, 'en mensaje de', message.author.tag);
                
                // Reportar inmediatamente a desarrolladores
                await reportToDiscoveryChannels(client, {
                    id: Date.now(), // ID temporal
                    method: cheatPattern.method,
                    pattern: cheatPattern.pattern.source,
                    user: message.author.tag,
                    userId: message.author.id,
                    guildId: message.guild.id,
                    channelId: message.channel.id,
                    messageId: message.id,
                    messageContent: message.content.substring(0, 200), // Primeros 200 chars
                    timestamp: new Date().toISOString(),
                    severity: 'ALTA',
                    type: 'CHEAT_DETECTED'
                });
                
                break; // Solo reportar el primer patrón encontrado
            }
        }
        
    } catch (error) {
        console.error('Error detectando patrones de cheats:', error);
    }
}

// Evento: Nuevo mensaje
client.on('messageCreate', async (message) => {
    // Ignorar mensajes de otros bots
    if (message.author.bot) return;
    
    // Obtener el apodo del usuario
    const userNickname = getUserNickname(message.author.id, message.author.username);
    
    // Manejo de menciones con IA MiniMax Real
    if (message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)) {
        const totalMembers = getTotalMemberCount(client);
        
        const isCmdChannel = message.channel.id === CMD_CHANNEL_ID;
        
        // Si es solo mención sin comando, usar IA MiniMax
        const cleanContent = message.content.replace(/<@!?\d+>/g, '').trim();
        
        if (cleanContent.length > 0 && !cleanContent.startsWith(BOT_PREFIX)) {
            // Consultar IA MiniMax para respuesta inteligente
            try {
                console.log('🤖 Procesando mención con IA MiniMax...');
                
                const channelType = isCmdChannel ? 'cmd' : 'chat';
                const aiResponse = await stealthCheatXChat(message, channelType);
                
                const responseData = await processStealthCheatXResponse(aiResponse, message, {
                    title: `🛡️ Stealth-AntiCheatX | ${channelType.toUpperCase()}`,
                    color: isCmdChannel ? '#ff6b35' : '#0099ff'
                });
                
                await message.reply(responseData);
                return;
                
            } catch (error) {
                console.error('❌ Error en IA MiniMax:', error);
                
                // Fallback a respuesta básica
                const fallbackEmbed = new EmbedBuilder()
                    .setTitle('🛡️ Stealth-AntiCheatX')
                    .setDescription('🧠 **IA MiniMax** temporalmente no disponible. Sistema de respaldo activado.')
                    .setColor('#ffaa00')
                    .addFields(
                        { name: '⚡ Estado', value: 'Sistema operacional', inline: true },
                        { name: '🔧 Resolución', value: 'Reintentando conexión...', inline: true }
                    )
                    .setTimestamp();
                
                await message.reply({ embeds: [fallbackEmbed] });
                return;
            }
        }
        
        // Respuesta de bienvenida inteligente
        const isChatChannel = message.channel.id === CHAT_CHANNEL_ID || 
                            message.channel.name.includes('chat') ||
                            message.channel.name.includes('ai');
        
        const embed = new EmbedBuilder()
            .setTitle('🛡️ Stealth-AntiCheatX | IA MiniMax Conectada')
            .setDescription(`¡Hola ${userNickname}! Soy **Stealth-AntiCheatX** - Sistema anti-cheat con IA avanzada`)
            .setColor(isCmdChannel ? '#ff6b35' : '#0099ff')
            .addFields(
                { name: '🧠 IA', value: 'MiniMax-M2 | Memoria contextual', inline: true },
                { name: '🔍 Detección', value: '12+ patrones activos', inline: true },
                { name: '⚡ Comandos', value: `\`${BOT_PREFIX}ai [mensaje]\` - IA inteligente\n\`${BOT_PREFIX}help\` - Lista completa\n\`${BOT_PREFIX}status\` - Estado sistema`, inline: true },
                { name: '💬 Canal', value: isCmdChannel ? '⚡ **CMD:** Solo comandos aquí' : (isChatChannel ? '💬 **CHAT-AI:** Conversación libre con IA' : '📢 Canal de comunicación'), inline: true },
                { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👥 Monitoreando', value: `${totalMembers} usuarios`, inline: true }
            )
            .setFooter({ text: `Stealth-AntiCheat | ${isCmdChannel ? 'CMD' : isChatChannel ? 'Chat-AI' : 'General'} | xpe-hub/stealth-bot-nuevo` })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
        return;
    }
    
    // DETECCIÓN AUTOMÁTICA DE CHEATS - Sistema Inteligente
    await detectCheatPatterns(client, message);
    
    // Manejo de comandos
    if (!message.content.startsWith(BOT_PREFIX)) return;
    
    const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    try {
        switch (command) {
            case 'help':
            case 'h':
                const helpEmbed = new EmbedBuilder()
                    .setTitle('🛡️ Comandos del Bot')
                    .setDescription('Bot de monitoreo y análisis anti-cheat desarrollado por xpe.nettt | Community Stealth')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🤖 IA Conversacional', value: `\`${BOT_PREFIX}ai [mensaje]\` - Consultar IA MiniMax\n\`${BOT_PREFIX}help\` - Lista de comandos\n💬 **Mención:** Habla conmigo sin comandos`, inline: true },
                        { name: '🎤 Sistema de Voz', value: `\`${BOT_PREFIX}vc\` - Unirse a tu canal de voz\n\`${BOT_PREFIX}vc random\` - Canal aleatorio con usuarios\n⚡ **Unión automática:** Bot se conecta cuando hablas`, inline: true },
                        { name: '🛠️ Utilidades', value: `\`${BOT_PREFIX}clear_chat [canal]\` - Limpiar canal AI\n\`${BOT_PREFIX}add_dev [ID]\` - Agregar developers (owner)\n🎯 **Canal:** Solo comandos en #stealth-anticheat-cmd`, inline: true }
                    )
                    .addFields(
                        { name: '✨ Características v3.0', value: '• 🤖 IA MiniMax con memoria contextual\n• 🎤 Monitoreo anti-cheat en tiempo real\n• 🗣️ Conversación natural (solo mención)\n• 🎯 Sistema de voz avanzado\n• 🔍 Detección automática de amenazas\n• 📊 Análisis inteligente de patrones', inline: false }
                    )
                    .setFooter({ text: 'Únete a Community Stealth' })
                    .setTimestamp();
                
                await message.reply({ embeds: [helpEmbed] });
                break;

            case 'ai':
            case 'ask':
            case 'stealth':
                // Comando de IA MiniMax
                const aiMessage = args.join(' ').trim();
                
                if (!aiMessage) {
                    const helpAIEmbed = new EmbedBuilder()
                        .setTitle('🧠 Comando IA MiniMax')
                        .setDescription('Uso correcto del comando de IA avanzada')
                        .setColor('#6a5acd')
                        .addFields(
                            { name: '💬 Ejemplo', value: `\`${BOT_PREFIX}ai ¿Cómo funciona el sistema anti-cheat?\``, inline: false },
                            { name: '🔍 Consultas Válidas', value: '• Preguntas sobre anti-cheat\n• Análisis de patrones\n• Información técnica\n• Conversación general', inline: false },
                            { name: '⚡ Características', value: '• Memoria contextual\n• IA MiniMax-M2\n• Conocimiento repositorio', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | IA Avanzada' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpAIEmbed] });
                    break;
                }
                
                try {
                    console.log(`🤖 IA MiniMax: Procesando consulta de ${message.author.username}`);
                    
                    // Determinar tipo de canal para contexto
                    const isCmdChannel = message.channel.id === CMD_CHANNEL_ID;
                    const channelType = isCmdChannel ? 'cmd' : 'chat';
                    
                    // Procesar con IA MiniMax
                    const aiResponse = await stealthCheatXChat(message, channelType);
                    
                    // Crear respuesta embebida
                    const aiEmbed = new EmbedBuilder()
                        .setColor('#6a5acd')
                        .setTitle(`🧠 IA MiniMax | ${channelType.toUpperCase()}`)
                        .setDescription(aiResponse)
                        .addFields(
                            { name: '👤 Usuario', value: message.author.username, inline: true },
                            { name: '📝 Consulta', value: aiMessage.length > 50 ? aiMessage.substring(0, 50) + '...' : aiMessage, inline: true },
                            { name: '⚡ Estado', value: 'MiniMax-M2 Activo', inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'Stealth-AntiCheat | IA Contextual' });
                    
                    await message.reply({ embeds: [aiEmbed] });
                    
                } catch (error) {
                    console.error('❌ Error en comando IA:', error);
                    
                    const errorAIEmbed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('🛡️ Error del Sistema IA')
                        .setDescription(`Error procesando consulta: ${error.message}`)
                        .addFields(
                            { name: '🔧 Solución', value: 'Reintentando conexión con MiniMax...', inline: false }
                        )
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorAIEmbed] });
                }
                break;

            case 'vc':
            case 'voice':
            case 'canal':
                if (!message.guild) {
                    return message.reply('❌ Este comando solo funciona en servidores.');
                }
                
                // ADVERTENCIA: Solo comandos en CMD
                if (message.channel.id !== CMD_CHANNEL_ID) {
                    const warnEmbed = new EmbedBuilder()
                        .setTitle('⚠️ Comando Restringido')
                        .setDescription('Los comandos del bot solo se ejecutan en el canal CMD.')
                        .setColor('#ff9900')
                        .addFields(
                            { name: '📋 Canal Requerido', value: 'stealth-anticheat-cmd', inline: true },
                            { name: '💬 Canal Actual', value: message.channel.name, inline: true },
                            { name: '💡 Para Chat', value: 'Menciona al bot sin prefijo', inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Sistema de Canales' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [warnEmbed] });
                    return;
                }
                
                try {
                    console.log(`[VC] Comando ejecutado por ${message.author.tag} en ${message.guild.name}`);
                    
                    // VERIFICAR PERMISOS BÁSICOS DEL BOT
                    const botMember = message.guild.members.me;
                    if (!botMember.permissions.has('Connect')) {
                        return message.reply('❌ Bot sin permisos de voz. Necesita permiso "Conectar".');
                    }
                    
                    if (!botMember.permissions.has('Speak')) {
                        return message.reply('❌ Bot sin permisos de habla. Necesita permiso "Hablar".');
                    }
                    
                    // OBTENER CANALES DE VOZ ACCESIBLES
                    const voiceChannels = message.guild.channels.cache.filter(channel => 
                        channel.type === 2 && // GUILD_VOICE
                        !channel.parentId || // Canales sin categoría o
                        botMember.permissionsIn(channel).has('Connect') // Con permisos específicos
                    );
                    
                    const accessibleChannels = [];
                    for (const [id, channel] of voiceChannels) {
                        try {
                            if (channel.permissionsFor(botMember).has('Connect') && 
                                channel.permissionsFor(botMember).has('ViewChannel')) {
                                accessibleChannels.push({
                                    id: id,
                                    name: channel.name,
                                    members: channel.members.size,
                                    channel: channel
                                });
                            }
                        } catch (error) {
                            console.log(`[VC] Error verificando canal ${channel.name}:`, error.message);
                        }
                    }
                    
                    console.log(`[VC] ${accessibleChannels.length} canales accesibles de ${voiceChannels.size} totales`);
                    
                    // CASO 1: UNIÓN AUTOMÁTICA (usuario en canal de voz)
                    const userVoiceChannel = message.member.voice.channel;
                    
                    if (userVoiceChannel) {
                        console.log(`[VC] Usuario en canal: ${userVoiceChannel.name}`);
                        
                        try {
                            // Desconectar de canal actual si existe
                            if (botMember.voice.channel && botMember.voice.channel.id !== userVoiceChannel.id) {
                                await botMember.voice.disconnect();
                            }
                            
                            // Unirse al canal del usuario
                            await botMember.voice.setChannel(userVoiceChannel.id);
                            
                            const autoEmbed = new EmbedBuilder()
                                .setTitle('🎤 Unión Automática a Voz')
                                .setDescription(`Bot conectado a **${userVoiceChannel.name}**`)
                                .setColor('#00ff00')
                                .addFields(
                                    { name: '👥 Miembros', value: `${userVoiceChannel.members.size}`, inline: true },
                                    { name: '🔊 Estado', value: 'Monitoreo anti-cheat activo', inline: true },
                                    { name: '⚡ Permisos', value: 'Conectado ✓', inline: true }
                                )
                                .setFooter({ text: 'Stealth-AntiCheat | Monitoreo de Voz' })
                                .setTimestamp();
                            
                            await message.reply({ embeds: [autoEmbed] });
                            return;
                            
                        } catch (vcError) {
                            console.error('[VC] Error conectando a canal del usuario:', vcError);
                            return message.reply('❌ Error conectando a tu canal. Verifica permisos.');
                        }
                    }
                    
                    // CASO 2: SIN ARGUMENTOS - MOSTRAR AYUDA
                    if (args.length === 0) {
                        const helpEmbed = new EmbedBuilder()
                            .setTitle('🎤 Comandos de Voz Stealth-AntiCheat')
                            .setDescription('Conecta el bot a canales de voz para monitoreo anti-cheat')
                            .setColor('#0099ff')
                            .addFields(
                                { name: '🔗 Unión Automática', value: `Únete a un canal de voz y usa \`${BOT_PREFIX}vc\``, inline: false },
                                { name: '🎲 Canal Aleatorio', value: `\`${BOT_PREFIX}vc random\` - Conecta a canal con usuarios`, inline: false },
                                { name: '📊 Canales Detectados', value: `${accessibleChannels.length} canales accesibles`, inline: true },
                                { name: '🔊 Estado Actual', value: botMember.voice.channel ? `En ${botMember.voice.channel.name}` : 'Desconectado', inline: true }
                            )
                            .setFooter({ text: 'Stealth-AntiCheat | Sistema de Voz' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [helpEmbed] });
                        return;
                    }
                    
                    // CASO 3: COMANDO CON ARGUMENTOS
                    const input = args.join(' ').toLowerCase().trim();
                    
                    if (input === 'random' || input === 'aleatorio' || input === 'rand') {
                        if (accessibleChannels.length === 0) {
                            return message.reply('❌ No hay canales de voz accesibles para conexión aleatoria.');
                        }
                        
                        // Priorizar canales con usuarios
                        const channelsWithUsers = accessibleChannels.filter(ch => ch.members > 0);
                        const targetChannels = channelsWithUsers.length > 0 ? channelsWithUsers : accessibleChannels;
                        
                        const randomIndex = Math.floor(Math.random() * targetChannels.length);
                        const targetChannel = targetChannels[randomIndex];
                        
                        try {
                            // Desconectar si está en otro canal
                            if (botMember.voice.channel) {
                                await botMember.voice.disconnect();
                            }
                            
                            // Conectar al canal seleccionado
                            await botMember.voice.setChannel(targetChannel.id);
                            
                            const randomEmbed = new EmbedBuilder()
                                .setTitle('🎲 Conexión Aleatoria Exitosa')
                                .setDescription(`Bot conectado a **${targetChannel.name}**`)
                                .setColor('#00ff00')
                                .addFields(
                                    { name: '👥 Miembros', value: `${targetChannel.members}`, inline: true },
                                    { name: '🎯 Selección', value: 'Aleatoria', inline: true },
                                    { name: '✅ Estado', value: 'Monitoreo activo', inline: true }
                                )
                                .setFooter({ text: 'Stealth-AntiCheat | Conexión Exitosa' })
                                .setTimestamp();
                            
                            await message.reply({ embeds: [randomEmbed] });
                            
                        } catch (randomError) {
                            console.error('[VC] Error conexión aleatoria:', randomError);
                            return message.reply('❌ Error conectando a canal aleatorio. Verifica permisos.');
                        }
                        return;
                    }
                    
                    // CASO 4: COMANDO DESCONOCIDO
                    const unknownEmbed = new EmbedBuilder()
                        .setTitle('❓ Opción de Voz Desconocida')
                        .setDescription(`No reconozco la opción "${args.join(' ')}"`)
                        .setColor('#ff9900')
                        .addFields(
                            { name: '💡 Opciones Válidas', value: `\`${BOT_PREFIX}vc\` - Unión automática\n\`${BOT_PREFIX}vc random\` - Canal aleatorio`, inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Ayuda de Voz' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [unknownEmbed] });
                    
                } catch (error) {
                    console.error('[VC] Error crítico en comando vc:', error);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('❌ Error Crítico de Voz')
                        .setDescription('Ocurrió un error ejecutando el comando de voz')
                        .addFields(
                            { name: '🚨 Error', value: error.message, inline: false },
                            { name: '🔧 Soluciones', value: '• Reactivar bot en Railway\n• Verificar permisos de voz\n• Contactar desarrollador', inline: false }
                        )
                        .setColor('#ff0000')
                        .setFooter({ text: 'Stealth-AntiCheat | Soporte Técnico' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorEmbed] });
                }
                break;

            case 'add_dev':
                    return message.reply('❌ Solo el owner puede agregar developers.');
                }
                
                const targetUserId = args[0];
                    const helpAddDevEmbed = new EmbedBuilder()
                        .setTitle('🛠️ Agregar Developer')
                        .setDescription('Uso del comando para agregar desarrolladores')
                        .setColor('#6a5acd')
                        .addFields(
                            { name: '💻 Ejemplo', value: , inline: false },
                            { name: '👑 Permisos', value: 'Solo el owner puede usar este comando', inline: true },
                            { name: '⚙️ Función', value: 'Agregar usuarios a la lista de desarrolladores', inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Gestión de Desarrolladores' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpAddDevEmbed] });
                    break;
                }
                
                
                if (developers.developers.includes(cleanUserId)) {
                    return message.reply('❌ Este usuario ya es un desarrollador.');
                }
                
                developers.developers.push(cleanUserId);
                saveDevelopers(developers);
                
                const successAddDevEmbed = new EmbedBuilder()
                    .setTitle('✅ Developer Agregado')
                    .setDescription(`Usuario <@${cleanUserId}> agregado como desarrollador`)
                    .setColor('#00ff00')
                    .addFields(
                        { name: '👤 Usuario', value: `<@${cleanUserId}>`, inline: true },
                        { name: '👑 Autorizado por', value: userNickname, inline: true },
                        { name: '⚙️ Permisos', value: 'Desarrollador completo', inline: true }
                    )
                    .setFooter({ text: 'Stealth-AntiCheat | Gestión de Desarrolladores' })
                    .setTimestamp();
                
                await message.reply({ embeds: [successAddDevEmbed] });
                break;

            case 'clear_chat':
            case 'limpiar':
                const targetChannelId = args[0] ? args[0].replace(/[<>#]/g, '') : message.channel.id;
                
                // Verificar si el canal es un canal AI permitido
                const AI_PERMITTED_CHANNELS = [
                    CHAT_CHANNEL_ID,
                    SUPPORT_CHANNEL_ID,
                    '1442266154516091020' // Chat AI adicional
                ];
                
                    const errorClearEmbed = new EmbedBuilder()
                        .setTitle('❌ Canal No Permitido')
                        .setDescription('Solo se pueden limpiar canales AI autorizados')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🚫 Razón', value: 'Canal no en lista de canales AI permitidos', inline: false },
                            { name: '💬 Canales Válidos', value: 'Chat AI, Soporte AI, Comandos', inline: true },
                            { name: '💡 Solución', value: `Especifica un canal AI válido: `${BOT_PREFIX}clear_chat #chat-ai`, inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Control de Canales AI' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorClearEmbed] });
                    return;
                }
                
                try {
                    const targetChannel = await client.channels.fetch(targetChannelId);
                    const messages = await targetChannel.messages.fetch({ limit: 100 });
                    
                    // Filtrar mensajes del bot y mensajes con más de 14 días
                    const messagesToDelete = messages.filter(msg => {
                        const isBotMessage = msg.author.id === client.user.id;
                        const isOldMessage = (Date.now() - msg.createdTimestamp) > 14 * 24 * 60 * 60 * 1000;
                        return isBotMessage || isOldMessage;
                    });
                    
                    if (messagesToDelete.size === 0) {
                        const noMessagesEmbed = new EmbedBuilder()
                            .setTitle('📭 No hay mensajes para limpiar')
                            .setDescription(`No se encontraron mensajes del bot o antiguos en **${targetChannel.name}**`)
                            .setColor('#ffaa00')
                            .addFields(
                                { name: '📋 Canal', value: targetChannel.name, inline: true },
                                { name: '🔍 Mensajes encontrados', value: '0', inline: true },
                                { name: '⏰ Periodo', value: 'Últimos 14 días', inline: true }
                            )
                            .setFooter({ text: 'Stealth-AntiCheat | Limpieza de Chat' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [noMessagesEmbed] });
                        return;
                    }
                    
                    // Eliminar mensajes en lotes de 50
                    const batchSize = 50;
                    const batches = Math.ceil(messagesToDelete.size / batchSize);
                    
                    for (let i = 0; i < batches; i++) {
                        const batch = messagesToDelete.array().slice(i * batchSize, (i + 1) * batchSize);
                        if (batch.length > 0) {
                            await targetChannel.bulkDelete(batch, true);
                        }
                    }
                    
                    const successClearEmbed = new EmbedBuilder()
                        .setTitle('✅ Chat Limpiado Exitosamente')
                        .setDescription(`**${messagesToDelete.size}** mensajes limpiados del canal **${targetChannel.name}**`)
                        .setColor('#00ff00')
                        .addFields(
                            { name: '🗑️ Mensajes eliminados', value: `${messagesToDelete.size}`, inline: true },
                            { name: '📋 Canal', value: targetChannel.name, inline: true },
                            { name: '⏱️ Periodo', value: 'Últimos 14 días', inline: true },
                            { name: '🔄 Lotes procesados', value: `${batches}`, inline: true },
                            { name: '👤 Solicitado por', value: userNickname, inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Limpieza Completada' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [successClearEmbed] });
                    
                } catch (clearError) {
                    console.error('Error limpiando chat:', clearError);
                    
                    const errorClearEmbed = new EmbedBuilder()
                        .setTitle('❌ Error Limpiando Chat')
                        .setDescription('No se pudo limpiar el canal especificado')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🚨 Error', value: clearError.message, inline: false },
                            { name: '🔧 Solución', value: 'Verificar permisos del bot en el canal', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Error de Limpieza' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorClearEmbed] });
                }
                break;



            case 'add_dev':
                if (!isOwner(message.author.id)) {
                    return message.reply('❌ Solo el owner puede agregar developers.');
                }
                
                const targetUserId = args[0];
                if (!targetUserId) {
                    const helpAddDevEmbed = new EmbedBuilder()
                        .setTitle('🛠️ Agregar Developer')
                        .setDescription('Uso del comando para agregar desarrolladores')
                        .setColor('#6a5acd')
                        .addFields(
                            { name: '💻 Ejemplo', value: `\`${BOT_PREFIX}add_dev 123456789\``, inline: false },
                            { name: '👑 Permisos', value: 'Solo el owner puede usar este comando', inline: true },
                            { name: '⚙️ Función', value: 'Agregar usuarios a la lista de desarrolladores', inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Gestión de Desarrolladores' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [helpAddDevEmbed] });
                    break;
                }
                
                const cleanUserId = targetUserId.replace(/[<@!>]/g, '');
                
                if (developers.developers.includes(cleanUserId)) {
                    return message.reply('❌ Este usuario ya es un desarrollador.');
                }
                
                developers.developers.push(cleanUserId);
                saveDevelopers(developers);
                
                const successAddDevEmbed = new EmbedBuilder()
                    .setTitle('✅ Developer Agregado')
                    .setDescription(`Usuario <@${cleanUserId}> agregado como desarrollador`)
                    .setColor('#00ff00')
                    .addFields(
                        { name: '👤 Usuario', value: `<@${cleanUserId}>`, inline: true },
                        { name: '👑 Autorizado por', value: userNickname, inline: true },
                        { name: '⚙️ Permisos', value: 'Desarrollador completo', inline: true }
                    )
                    .setFooter({ text: 'Stealth-AntiCheat | Gestión de Desarrolladores' })
                    .setTimestamp();
                
                await message.reply({ embeds: [successAddDevEmbed] });
                break;

            case 'clear_chat':
            case 'limpiar':
                const targetChannelId = args[0] ? args[0].replace(/[<>#]/g, '') : message.channel.id;
                
                // Verificar si el canal es un canal AI permitido
                const AI_PERMITTED_CHANNELS = [
                    CHAT_CHANNEL_ID,
                    SUPPORT_CHANNEL_ID,
                    '1442266154516091020' // Chat AI adicional
                ];
                
                if (!AI_PERMITTED_CHANNELS.includes(targetChannelId)) {
                    const errorClearEmbed = new EmbedBuilder()
                        .setTitle('❌ Canal No Permitido')
                        .setDescription('Solo se pueden limpiar canales AI autorizados')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🚫 Razón', value: 'Canal no en lista de canales AI permitidos', inline: false },
                            { name: '💬 Canales Válidos', value: 'Chat AI, Soporte AI, Comandos', inline: true },
                            { name: '💡 Solución', value: `Especifica un canal AI válido: \`${BOT_PREFIX}clear_chat #chat-ai\``, inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Control de Canales AI' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorClearEmbed] });
                    return;
                }
                
                try {
                    const targetChannel = await client.channels.fetch(targetChannelId);
                    const messages = await targetChannel.messages.fetch({ limit: 100 });
                    
                    // Filtrar mensajes del bot y mensajes con más de 14 días
                    const messagesToDelete = messages.filter(msg => {
                        const isBotMessage = msg.author.id === client.user.id;
                        const isOldMessage = (Date.now() - msg.createdTimestamp) > 14 * 24 * 60 * 60 * 1000;
                        return isBotMessage || isOldMessage;
                    });
                    
                    if (messagesToDelete.size === 0) {
                        const noMessagesEmbed = new EmbedBuilder()
                            .setTitle('📭 No hay mensajes para limpiar')
                            .setDescription(`No se encontraron mensajes del bot o antiguos en **${targetChannel.name}**`)
                            .setColor('#ffaa00')
                            .addFields(
                                { name: '📋 Canal', value: targetChannel.name, inline: true },
                                { name: '🔍 Mensajes encontrados', value: '0', inline: true },
                                { name: '⏰ Periodo', value: 'Últimos 14 días', inline: true }
                            )
                            .setFooter({ text: 'Stealth-AntiCheat | Limpieza de Chat' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [noMessagesEmbed] });
                        return;
                    }
                    
                    // Eliminar mensajes en lotes de 50
                    const batchSize = 50;
                    const batches = Math.ceil(messagesToDelete.size / batchSize);
                    
                    for (let i = 0; i < batches; i++) {
                        const batch = messagesToDelete.array().slice(i * batchSize, (i + 1) * batchSize);
                        if (batch.length > 0) {
                            await targetChannel.bulkDelete(batch, true);
                        }
                    }
                    
                    const successClearEmbed = new EmbedBuilder()
                        .setTitle('✅ Chat Limpiado Exitosamente')
                        .setDescription(`**${messagesToDelete.size}** mensajes limpiados del canal **${targetChannel.name}**`)
                        .setColor('#00ff00')
                        .addFields(
                            { name: '🗑️ Mensajes eliminados', value: `${messagesToDelete.size}`, inline: true },
                            { name: '📋 Canal', value: targetChannel.name, inline: true },
                            { name: '⏱️ Periodo', value: 'Últimos 14 días', inline: true },
                            { name: '🔄 Lotes procesados', value: `${batches}`, inline: true },
                            { name: '👤 Solicitado por', value: userNickname, inline: true }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Limpieza Completada' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [successClearEmbed] });
                    
                } catch (clearError) {
                    console.error('Error limpiando chat:', clearError);
                    
                    const errorClearEmbed = new EmbedBuilder()
                        .setTitle('❌ Error Limpiando Chat')
                        .setDescription('No se pudo limpiar el canal especificado')
                        .setColor('#ff0000')
                        .addFields(
                            { name: '🚨 Error', value: clearError.message, inline: false },
                            { name: '🔧 Solución', value: 'Verificar permisos del bot en el canal', inline: false }
                        )
                        .setFooter({ text: 'Stealth-AntiCheat | Error de Limpieza' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorClearEmbed] });
                }
                break;




                

                


            default:
                const unknownEmbed = new EmbedBuilder()
                    .setTitle('❓ Comando no reconocido')
                    .setDescription(`No conozco el comando \`${command}\`.`)
                    .addFields(
                        { name: '💡 Ayuda', value: `Usa \`${BOT_PREFIX}help\` para ver todos los comandos disponibles.`, inline: false }
                    )
                    .setColor('#ff0000')
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [unknownEmbed] });
        }
    } catch (error) {
        console.error('Error ejecutando comando:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('Ocurrió un error ejecutando el comando.')
            .setColor('#ff0000')
            .setFooter({ text: 'Stealth-AntiCheat | xpe.nettt' })
            .setTimestamp();
        
        await message.reply({ embeds: [errorEmbed] });
    }
});

// Manejo de errores
client.on('error', error => {
    console.error('Error de Discord.js:', error);
});

client.on('warn', warning => {
    console.warn('Advertencia de Discord.js:', warning);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Login del bot
client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('Error al conectar el bot:', error);
    process.exit(1);
});
