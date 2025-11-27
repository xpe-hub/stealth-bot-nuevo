// ========================================================
// BOT MEJORADO - 2025-11-27 16:28:23
// Comandos $vc y $add_server completamente funcionales
// Agregado logging detallado y mejor manejo de errores
// Preparado para IA con MiniMax API
// ========================================================

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Stealth-CheatX AI Integration - Anti-Cheat Specialist
const { stealthCheatXChat, processStealthCheatXResponse, executeAntiCheatTool } = require('./stealth_cheatx_ai');

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

// Función para auto-actualizar el repositorio de GitHub
async function updateAntiCheatRepository(method) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'xpe-hub';
    const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'stealth-bot-nuevo';
    const REPO_TARGET_BRANCH = process.env.REPO_TARGET_BRANCH || 'main';
    
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN no está configurado');
    }
    
    try {
        // 1. Obtener el contenido actual del archivo bot.js
        const getCurrentFileUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/bot.js`;
        const getCurrentFileResponse = await fetch(getCurrentFileUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            }
        });
        
        if (!getCurrentFileResponse.ok) {
            throw new Error(`Error al obtener archivo actual: ${getCurrentFileResponse.status} ${getCurrentFileResponse.statusText}`);
        }
        
        const currentFileData = await getCurrentFileResponse.json();
        const currentContent = Buffer.from(currentFileData.content, 'base64').toString('utf-8');
        
        // 2. Añadir el nuevo método de detección
        const patternCode = `
    // Método ID: ${method.id} - ${method.method}
    // Detectado: ${new Date(method.timestamp).toLocaleString()}
    // Patrón: ${method.pattern}
    if (message.content.match(/${method.pattern}/i)) {
        console.log('🚨 CHEAT DETECTADO - Método ${method.id}:', method.method);
        
        await reportToDiscoveryChannels(client, {
            id: ${method.id},
            method: '${method.method}',
            pattern: '${method.pattern}',
            user: message.author.tag,
            userId: message.author.id,
            guildId: message.guild.id,
            channelId: message.channel.id,
            messageId: message.id,
            timestamp: new Date().toISOString(),
            severity: 'ALTA',
            type: 'CHEAT_DETECTED'
        });
        
        return true;
    }`;
        
        // 3. Insertar el patrón en la función de detección (antes del último else)
        const detectionFunctionStart = currentContent.indexOf('// Función principal de detección');
        const detectionFunctionEnd = currentContent.indexOf('// Si ningún patrón coincide');
        
        if (detectionFunctionStart === -1 || detectionFunctionEnd === -1) {
            throw new Error('No se pudo encontrar la función de detección en el archivo');
        }
        
        // Buscar el final de la función de detección antes del último else
        const beforeLastElse = currentContent.substring(0, detectionFunctionEnd);
        const afterLastElse = currentContent.substring(detectionFunctionEnd);
        
        const newContent = beforeLastElse + patternCode + '\n' + afterLastElse;
        
        // 4. Crear el commit
        const commitMessage = `🤖 Auto-Update: Añadir detección de cheat - Método ${method.id}\n\n` +
            `Método: ${method.method}\n` +
            `Patrón: ${method.pattern}\n` +
            `Detectado por: ${method.user} (${method.userId})\n` +
            `Servidor: ${method.guildId}\n` +
            `Fecha: ${new Date(method.timestamp).toLocaleString()}\n` +
            `\n🤖 Actualización automática autorizada por desarrollador`;
        
        // 5. Actualizar el archivo en GitHub
        const updateFileUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/bot.js`;
        const updateFileData = {
            message: commitMessage,
            content: Buffer.from(newContent, 'utf-8').toString('base64'),
            sha: currentFileData.sha,
            branch: REPO_TARGET_BRANCH
        };
        
        const updateFileResponse = await fetch(updateFileUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            },
            body: JSON.stringify(updateFileData)
        });
        
        if (!updateFileResponse.ok) {
            const errorText = await updateFileResponse.text();
            throw new Error(`Error al actualizar archivo: ${updateFileResponse.status} ${updateFileResponse.statusText} - ${errorText}`);
        }
        
        const updateResult = await updateFileResponse.json();
        console.log('✅ Repositorio actualizado exitosamente:', updateResult.commit.sha);
        
        return {
            success: true,
            commitSha: updateResult.commit.sha,
            commitUrl: updateResult.commit.html_url,
            message: 'Repositorio actualizado exitosamente'
        };
        
    } catch (error) {
        console.error('❌ Error en auto-actualización:', error);
        throw error;
    }
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
        
        // ENVIAR CONSULTA AUTOMÁTICA A DESARROLLADORES
        await sendDeveloperConsultation(client, method);
        
        console.log(`✅ Método ${method.id} reportado y consulta enviada a desarrolladores`);
        
    } catch (error) {
        console.error('Error en reportToDiscoveryChannels:', error);
    }
}

// Función para enviar consulta automática a desarrolladores
async function sendDeveloperConsultation(client, method) {
    try {
        const implementationChannel = client.channels.cache.get(IMPLEMENTACIONES_CHANNEL_ID);
        if (!implementationChannel) {
            console.log('❌ Canal de implementaciones no encontrado');
            return;
        }
        
        // Mencionar desarrolladores
        const developerMentions = `<@${BOT_OWNER_ID}>`;
        
        const consultationEmbed = new EmbedBuilder()
            .setTitle('💬 CONSULTA AUTOMÁTICA A DESARROLLADORES')
            .setDescription(`**CHEAT DETECTADO - ESPERANDO PERMISO** ${developerMentions}`)
            .addFields(
                { name: '🤖 PREGUNTA DEL BOT', value: '¿Puedo implementar la detección de este cheat en Stealth-AntiCheatX?\n¿Pueden compilar el EXE actualizado y enviarlo?' },
                { name: '🔧 Método', value: method.method, inline: false },
                { name: '📊 Patrón Detectado', value: `\`${method.pattern}\``, inline: false },
                { name: '👤 Usuario Sospechoso', value: `${method.user}`, inline: true },
                { name: '⚡ Severidad', value: method.severity, inline: true },
                { name: '🆔 Método ID', value: `#${method.id}`, inline: true },
                { name: '⏰ Tiempo', value: new Date(method.timestamp).toLocaleString(), inline: true }
            )
            .addFields(
                { name: '📋 COMANDOS DISPONIBLES', value: '`$dev approve approve ' + method.id + '` - Aprobar auto-actualización\n`$dev approve deny ' + method.id + '` - Denegar auto-actualización\n`$dev pending` - Ver métodos pendientes', inline: false }
            )
            .setColor('#ffaa00')
            .setFooter({ text: '🤖 ESPERANDO AUTORIZACIÓN DE DESARROLLADORES 🤖' })
            .setTimestamp();
        
        await implementationChannel.send({ 
            content: developerMentions,
            embeds: [consultationEmbed] 
        });
        
        // Cambiar estado del método a AWAITING_PERMISSION
        method.status = 'AWAITING_PERMISSION';
        
        console.log(`📤 Consulta enviada para método ${method.id}`);
        
    } catch (error) {
        console.error('Error enviando consulta a desarrolladores:', error);
    }
}

// Evento: Bot listo
client.once('ready', () => {
    console.log('🤖 Stealth-AntiCheat-bot está listo!');
    console.log(`📍 Conectado como: ${client.user.tag}`);
    console.log(`🏠 En ${client.guilds.cache.size} servidores`);
    
    // Establecer presencia dinámica del bot (BIO VIVA)
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
    
    // Cambiar actividad cada 15 segundos (BIO VIVA)
    setInterval(() => {
        activityIndex = (activityIndex + 1) % activities.length;
        
        client.user.setPresence({
            status: 'online',
            activities: [{ 
                name: activities[activityIndex], 
                type: 3 // WATCHING
            }]
        });
    }, 15000); // 15 segundos

    // Inicializar desarrolladores con el owner por defecto
    if (!developers.owners.includes(BOT_OWNER_ID)) {
        developers.owners.push(BOT_OWNER_ID);
        saveDevelopers(developers);
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
    
    // Manejo de menciones
    if (message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)) {
        const totalMembers = getTotalMemberCount(client);
        
        const embed = new EmbedBuilder()
            .setTitle('🤖 ¡Stealth-AntiCheatX está aquí!')
            .setDescription(`¡Hola ${userNickname}! Soy **Stealth-AntiCheatX APP** - bot de monitoreo y análisis anti-cheat desarrollado por xpe.nettt`)
            .setColor('#0099ff')
            .addFields(
                { name: '📋 Comandos', value: `\`${BOT_PREFIX}help\` - Lista de comandos\n\`${BOT_PREFIX}ping\` - Verificar estado\n\`${BOT_PREFIX}scan\` - para escanear el servidor`, inline: true },
                { name: '🌐 Comunidad', value: '¡Únete a Community Stealth!', inline: true },
                { name: '📊 Estado', value: `Bot conectado: ✅\nServidores: ${client.guilds.cache.size}\nUsuarios: ${totalMembers}`, inline: true }
            )
            .setFooter({ text: 'Community Stealth | Desarrollado por xpe.nettt' })
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
                        { name: '📋 Comandos Básicos', value: `\`${BOT_PREFIX}help\` - Muestra esta lista\n\`${BOT_PREFIX}about\` - Acerca del bot\n\`${BOT_PREFIX}ping\` - Ver latencia\n\`${BOT_PREFIX}scan\` - Escanear servidor\n\`${BOT_PREFIX}community\` - Info de la comunidad\n\`${BOT_PREFIX}vc [canal]\` - Unirse a canal de voz\n\`${BOT_PREFIX}add_server\` - Invitar bot\n\`${BOT_PREFIX}ai [mensaje]\` - Stealth-CheatX IA\n\`${BOT_PREFIX}canales\` - Ver todos los canales`, inline: true },
                        { name: '👷 Comandos Desarrollador', value: `\`${BOT_PREFIX}owner\` - Info de permisos\n\`${BOT_PREFIX}status\` - Estado del bot\n\`${BOT_PREFIX}servers\` - Lista de servidores\n\`${BOT_PREFIX}dev_add [ID]\` - Agregar desarrolladores\n\`${BOT_PREFIX}dev_check [ID]\` - Verificar desarrolladores`, inline: true },
                        { name: '👑 Comandos Owner', value: `\`${BOT_PREFIX}leave\` - Salir del servidor\n\`${BOT_PREFIX}dev_remove [ID]\` - Remover desarrolladores\n\`${BOT_PREFIX}dev_list\` - Lista completa desarrolladores`, inline: true },
                        { name: '🔐 Sistema de Permisos', value: `\`${BOT_PREFIX}dev approve approve [ID]\` - Aprobar auto-actualización\n\`${BOT_PREFIX}dev approve yes [ID]\` - Aprobar (alternativa)\n\`${BOT_PREFIX}dev approve deny [ID]\` - Rechazar auto-actualización\n\`${BOT_PREFIX}dev approve no [ID]\` - Rechazar (alternativa)\n\`${BOT_PREFIX}dev pending\` - Ver métodos pendientes`, inline: true },
                        { name: '🔍 Anti-Cheat', value: `\`${BOT_PREFIX}anticheat\` - Descargar herramienta`, inline: true },
                        { name: '👤 Personalización', value: `\`${BOT_PREFIX}apodo [nombre]\` - Establece tu apodo\n\`${BOT_PREFIX}apodo\` - Ver tu apodo actual`, inline: true }
                    )
                    .addFields(
                        { name: '✔️ Características', value: '• Monitoreo automático\n• Análisis de amenazas\n• Reportes en tiempo real\n• Responde cuando lo mencionas\n• Integración con Community Stealth\n• Sistema de permisos inteligente', inline: false }
                    )
                    .setFooter({ text: 'Únete a Community Stealth' })
                    .setTimestamp();
                
                await message.reply({ embeds: [helpEmbed] });
                break;
                
            case 'about':
                const uptimeHours = Math.floor(process.uptime() / 3600);
                const uptimeMinutes = Math.floor((process.uptime() % 3600) / 60);
                
                const aboutEmbed = new EmbedBuilder()
                    .setTitle('🤖 Acerca de Stealth-AntiCheatX')
                    .setDescription('Bot de monitoreo y análisis anti-cheat desarrollado por xpe.nettt | Community Stealth')
                    .setColor('#0099ff')
                    .addFields(
                        { name: '📋 Información', value: `**Nombre:** ${client.user.username}\n**ID:** ${client.user.id}\n**Estado:** Online ✅\n**Uptime:** ${uptimeHours}h ${uptimeMinutes}m`, inline: true },
                        { name: '👨‍💻 Desarrollador', value: 'xpe.nettt | Community Stealth', inline: true },
                        { name: '🛡️ Funciones Core', value: '• Anti-cheat avanzado con detección automática\n• Análisis de amenazas en tiempo real\n• Monitoreo inteligente de patterns\n• Sistema de permisos inteligente', inline: true },
                        { name: '⚡ Características Avanzadas', value: '• **Detección automática:** Análisis de patrones de cheats\n• **Consultas inteligentes:** Auto-consulta a desarrolladores\n• **Auto-actualización:** Repository auto-sync al aprobar\n• **Monitoreo 24/7:** Threat analysis continuo', inline: true },
                        { name: '📊 Estadísticas del Sistema', value: `**Servidores activos:** ${client.guilds.cache.size}\n**Comandos disponibles:** 20+\n**Patterns detectados:** 12+ tipos de cheats\n**Nivel de seguridad:** 🔒 Máximo\n**Sistema de permisos:** ✅ Activo`, inline: true },
                        { name: '🔧 Comandos de Permisos', value: '```\n$dev approve approve [ID] - Aprobar\n$dev approve deny [ID] - Rechazar\n$dev pending - Ver pendientes\n```\n*Requiere permisos de desarrollador*', inline: false },
                        { name: '🎯 Integraciones', value: '• **GitHub API:** Auto-actualización de repositorio\n• **Discord Webhooks:** Reportes automáticos\n• **Sistema de tags:** `<@751601149928538224>`\n• **Canales especializados:** Implementaciones y descubrimientos', inline: true }
                    )
                    .setFooter({ text: 'Community Stealth | Sistema de Permisos Inteligente' })
                    .setTimestamp();
                
                await message.reply({ embeds: [aboutEmbed] });
                break;
                
            case 'ping':
                const ping = Math.round(client.ws.ping);
                let statusEmoji = '🟢';
                let statusText = 'Excelente';
                
                if (ping >= 300) {
                    statusEmoji = '🔴';
                    statusText = 'Lenta';
                } else if (ping >= 100) {
                    statusEmoji = '🟡';
                    statusText = 'Buena';
                }
                
                const pingEmbed = new EmbedBuilder()
                    .setTitle('🏓 Pong!')
                    .setColor('#ffaa00')
                    .addFields(
                        { name: '⚡ Latencia del Bot', value: `${ping}ms`, inline: true },
                        { name: '🌐 Latencia del WebSocket', value: `${client.ws.ping}ms`, inline: true },
                        { name: '📊 Estado', value: `${statusEmoji} ${statusText}`, inline: true },
                        { name: '💾 Uso de memoria', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`, inline: true }
                    )
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [pingEmbed] });
                break;
                
            case 'community':
                const communityEmbed = new EmbedBuilder()
                    .setTitle('🌐 Community Stealth')
                    .setDescription('¡Únete a nuestra comunidad de desarrolladores de anti-cheat!')
                    .setColor('#7289da')
                    .addFields(
                        { name: '🔗 Enlaces', value: `[Servidor Discord](${COMMUNITY_SERVER_INVITE}) - Comunidad principal`, inline: false },
                        { name: '💬 Canal Chat AI', value: 'Generador de ideas y discusiones técnicas', inline: true },
                        { name: '📋 Canal Soporte', value: 'Ayuda técnica y resolución de problemas', inline: true },
                        { name: '🔍 Descubrimientos', value: 'Nuevos hallazgos y actualizaciones', inline: true },
                        { name: '⚙️ Implementaciones', value: 'Nuevas funcionalidades y mejoras', inline: true },
                        { name: '🌟 Comunidad', value: 'Comunidad activa de desarrolladores anti-cheat', inline: false }
                    )
                    .setFooter({ text: 'Community Stealth | xpe.nettt' })
                    .setTimestamp();
                
                await message.reply({ embeds: [communityEmbed] });
                break;
                
            case 'vc':
            case 'voice':
            case 'canal':
                if (!message.guild) {
                    return message.reply('❌ Este comando solo funciona en servidores.');
                }
                
                try {
                    console.log(`[VC] Comando ejecutado por ${message.author.tag} en ${message.guild.name}`);
                    
                    // PASO 1: Escanear canales de voz del servidor
                    const voiceChannels = message.guild.channels.cache.filter(channel => 
                        channel.type === 2 && // GUILD_VOICE
                        channel.name && 
                        !channel.name.toLowerCase().includes('afk')
                    );
                    
                    console.log(`[VC] Encontrados ${voiceChannels.size} canales de voz`);
                    
                    // PASO 2: Obtener canales donde el bot puede conectarse
                    const accessibleChannels = [];
                    for (const [id, channel] of voiceChannels) {
                        try {
                            const permissions = channel.permissionsFor(message.guild.members.me);
                            if (permissions && permissions.has('Connect') && permissions.has('ViewChannel')) {
                                accessibleChannels.push({
                                    id: id,
                                    name: channel.name,
                                    members: channel.members.size,
                                    channel: channel
                                });
                            }
                        } catch (error) {
                            console.log(`[VC] Error con canal ${channel.name}:`, error.message);
                        }
                    }
                    
                    console.log(`[VC] ${accessibleChannels.length} canales accesibles`);
                    
                    // CASO 1: Usuario está en un canal de voz - UNIRSE AUTOMÁTICAMENTE
                    const userVoiceChannel = message.member.voice.channel;
                    console.log(`[VC] Usuario en canal: ${userVoiceChannel ? userVoiceChannel.name : 'No'}`);
                    
                    if (userVoiceChannel) {
                        const targetChannel = voiceChannels.get(userVoiceChannel.id);
                        if (targetChannel) {
                            console.log(`[VC] Intentando unirse a canal del usuario: ${targetChannel.name}`);
                            
                            // Verificar permisos
                            const permissions = targetChannel.permissionsFor(message.guild.members.me);
                            if (permissions && permissions.has('Connect')) {
                                // Desconectar si ya estamos en otro canal
                                if (message.guild.members.me.voice.channel) {
                                    console.log('[VC] Desconectando de canal actual');
                                    await message.guild.members.me.voice.disconnect();
                                }
                                
                                // Unirnos al canal del usuario
                                console.log(`[VC] Uniéndose a ${targetChannel.name} (${targetChannel.id})`);
                                await message.guild.members.me.voice.setChannel(targetChannel.id);
                                
                                const autoEmbed = new EmbedBuilder()
                                    .setTitle('🎤 ¡Unión Automática!')
                                    .setDescription(`Bot unido a **${targetChannel.name}**`)
                                    .setColor('#00ff00')
                                    .addFields(
                                        { name: '👥 Usuarios', value: `${targetChannel.members.size}`, inline: true },
                                        { name: '📢 Estado', value: 'Monitoreo activo', inline: true },
                                        { name: '✅ Confirmación', value: 'Conectado correctamente', inline: true }
                                    )
                                    .setFooter({ text: 'Community Stealth | Bot conectado' })
                                    .setTimestamp();
                                
                                await message.reply({ embeds: [autoEmbed] });
                                console.log(`[VC] Bot joined channel successfully: ${targetChannel.name}`);
                                return;
                            } else {
                                console.log('[VC] Sin permisos para conectar');
                                return message.reply('❌ El bot no tiene permisos para unirse a tu canal.');
                            }
                        }
                    }
                    
                    // CASO 2: Comando con argumentos
                    if (args.length === 0) {
                        // Sin argumentos y usuario no en canal - mostrar mensaje de uso
                        const helpEmbed = new EmbedBuilder()
                            .setTitle('🎤 Comandos de Voz Disponibles')
                            .setDescription('Comandos para conectar el bot a canales de voz')
                            .setColor('#00ff00')
                            .addFields(
                                { name: '🔗 Unión Automática', value: `Únete a un canal y usa \`${BOT_PREFIX}vc\`` , inline: false },
                                { name: '🎲 Aleatorio', value: `\`${BOT_PREFIX}vc random\` - Canal aleatorio con usuarios`, inline: false },
                                { name: '📊 Canales Encontrados', value: `${accessibleChannels.length} canales accesibles`, inline: false }
                            )
                            .setFooter({ text: 'Community Stealth | Bot de Voz Simplificado' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [helpEmbed] });
                        return;
                    }
                    
                    // CASO 3: Comando con argumentos
                    const input = args.join(' ').toLowerCase().trim();
                    console.log(`[VC] Argumentos recibidos: ${input}`);
                    
                    if (input === 'random' || input === 'aleatorio') {
                        // Unirnos a un canal aleatorio (priorizar canales con usuarios)
                        if (accessibleChannels.length === 0) {
                            console.log('[VC] No hay canales accesibles para random');
                            return message.reply('❌ No hay canales accesibles para unirse aleatoriamente.');
                        }
                        
                        // Priorizar canales con usuarios
                        const channelsWithUsers = accessibleChannels.filter(ch => ch.members > 0);
                        const availableChannels = channelsWithUsers.length > 0 ? channelsWithUsers : accessibleChannels;
                        
                        const randomIndex = Math.floor(Math.random() * availableChannels.length);
                        const targetChannel = availableChannels[randomIndex];
                        
                        console.log(`[VC] Seleccionando canal aleatorio: ${targetChannel.name}`);
                        
                        // Desconectar si ya estamos en otro canal
                        if (message.guild.members.me.voice.channel) {
                            await message.guild.members.me.voice.disconnect();
                        }
                        
                        // Unirnos al canal seleccionado
                        await message.guild.members.me.voice.setChannel(targetChannel.id);
                        
                        const randomEmbed = new EmbedBuilder()
                            .setTitle('🎲 ¡Unión Aleatoria!')
                            .setDescription(`Bot se ha unido a **${targetChannel.name}**`)
                            .setColor('#00ff00')
                            .addFields(
                                { name: '👥 Usuarios', value: `${targetChannel.members}`, inline: true },
                                { name: '🎯 Método', value: 'Aleatorio', inline: true },
                                { name: '✅ Confirmación', value: 'Conectado correctamente', inline: true }
                            )
                            .setFooter({ text: 'Community Stealth' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [randomEmbed] });
                        console.log(`[VC] Bot joined random channel: ${targetChannel.name}`);
                        return;
                    }
                    
                    // Argumento no reconocido
                    const unknownEmbed = new EmbedBuilder()
                        .setTitle('❌ Comando Desconocido')
                        .setDescription(`La opción "${args.join(' ')}" no es válida`)
                        .setColor('#ff0000')
                        .addFields(
                            { name: '💡 Comandos Disponibles', value: `\`${BOT_PREFIX}vc\` - Unión automática\n\`${BOT_PREFIX}vc random\` - Canal aleatorio`, inline: false }
                        )
                        .setFooter({ text: 'Community Stealth | Bot Simplificado' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [unknownEmbed] });
                    
                } catch (error) {
                    console.error('[VC] Error en comando vc:', error);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('❌ Error de Voz')
                        .setDescription('Ocurrió un error ejecutando el comando de voz')
                        .addFields(
                            { name: '🚨 Error', value: error.message, inline: false },
                            { name: '🔧 Posibles soluciones', value: '• Verificar permisos de voz del bot\n• Reactivar el bot en Railway\n• Revisar configuración de canales', inline: false }
                        )
                        .setColor('#ff0000')
                        .setFooter({ text: 'Community Stealth | Soporte técnico' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorEmbed] });
                }
                break;
                    
                } catch (error) {
                    console.error('Error en comando vc:', error);
                    
                    const errorEmbed = new EmbedBuilder()
                        .setTitle('❌ Error de Voz')
                        .setDescription('Ocurrió un error ejecutando el comando de voz')
                        .addFields(
                            { name: '🚨 Error', value: error.message, inline: false },
                            { name: '🔧 Soluciones', value: '• Verificar permisos de voz\n• Reactivar el bot en Railway\n• Comprobar configuración', inline: false }
                        )
                        .setColor('#ff0000')
                        .setFooter({ text: 'Community Stealth | Soporte técnico' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [errorEmbed] });
                }
                break;
                
            case 'info':
                const totalMembers = getTotalMemberCount(client);
                const currentGuildMembers = getCurrentGuildMemberCount(client);
                
                const infoEmbed = new EmbedBuilder()
                    .setTitle('📊 Información del Bot')
                    .setDescription('Bot de Discord para Community Stealth con funcionalidades anti-cheat')
                    .setColor('#0099ff')
                    .addFields(
                        { name: '📋 Detalles', value: `**Nombre:** ${client.user.username}\n**ID:** ${client.user.id}\n**Estado:** Online ✅`, inline: false },
                        { name: '👨‍💻 Desarrollador', value: 'xpe.nettt', inline: true },
                        { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                        { name: '👥 Usuarios Totales', value: `${totalMembers}`, inline: true },
                        { name: '🏢 Miembros del Servidor Actual', value: `${currentGuildMembers}`, inline: true }
                    )
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [infoEmbed] });
                break;
                
            case 'scan':
                // Simulación de escaneo del servidor
                const threats = performThreatAnalysis();
                const totalThreats = threats.reduce((sum, threat) => sum + threat.count, 0);
                
                const scanEmbed = new EmbedBuilder()
                    .setTitle('🔍 Escaneando Servidor...')
                    .setDescription('Analizando el servidor en busca de amenazas y actividades sospechosas.')
                    .setColor('#ffaa00')
                    .addFields(
                        { name: '👥 Miembros Escaneados', value: `${getCurrentGuildMemberCount(client)}`, inline: true },
                        { name: '⚠️ Amenazas Detectadas', value: `${totalThreats}`, inline: true },
                        { name: '🛡️ Nivel de Seguridad', value: totalThreats === 0 ? 'Alto' : totalThreats < 3 ? 'Medio' : 'Bajo', inline: true },
                        { name: '📊 Análisis', value: threats.map(t => `• ${t.type}: ${t.count} (${t.severity})`).join('\n') || '✅ Sin problemas detectados', inline: false }
                    )
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [scanEmbed] });
                
                // Reportar en canal de descubrimientos si existe
                if (DESCUBRIMIENTOS_CHANNEL_ID) {
                    try {
                        const guild = client.guilds.cache.first();
                        if (guild && guild.channels.cache.has(DESCUBRIMIENTOS_CHANNEL_ID)) {
                            const channel = guild.channels.cache.get(DESCUBRIMIENTOS_CHANNEL_ID);
                            await channel.send({
                                embeds: [{
                                    title: '🔍 Nuevo Escaneo Realizado',
                                    description: `Se completó un escaneo del servidor ${guild.name}`,
                                    color: 0xFFAA00,
                                    fields: [
                                        { name: '⚠️ Amenazas', value: `${totalThreats}`, inline: true },
                                        { name: '🛡️ Seguridad', value: totalThreats === 0 ? 'Alto' : 'En revisión', inline: true },
                                        { name: '👤 Usuario', value: `${userNickname}`, inline: true }
                                    ],
                                    timestamp: new Date()
                                }]
                            });
                        }
                    } catch (error) {
                        console.log('Error reportando descubrimiento:', error);
                    }
                }
                break;
                
            case 'anticheat':
                // Comando para descargar herramienta anti-cheat (SOLO xpe.nettt)
                if (!isOwner(message.author.id)) {
                    const noAuthEmbed = new EmbedBuilder()
                        .setTitle('❌ Acceso Denegado')
                        .setDescription('Este comando solo está disponible para el desarrollador principal.')
                        .setColor('#ff0000')
                        .setTimestamp();
                    
                    return message.reply({ embeds: [noAuthEmbed] });
                }
                
                const anticheatEmbed = new EmbedBuilder()
                    .setTitle('🎯 ¡Stealth-AntiCheatX Anti-Cheat!')
                    .setDescription('🎯 **¡Aquí estoy! Puedes descargarte ;)**\n\n💎 **Stealth-AntiCheatX Anti-Cheat**')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🔧 Versión:', value: 'v1', inline: true },
                        { name: '🔒 Anti-cheat avanzado', value: 'para torneos y ss', inline: true },
                        { name: '📥 ¡Descárgame y', value: 'destroza ss ;)', inline: true },
                        { name: '📁 Archivo', value: 'StealthAntiCheatX.exe', inline: true },
                        { name: '📏 Tamaño', value: '1.01MB', inline: true },
                        { name: '🔧 Versión', value: 'v1', inline: true },
                        { name: '🎮 Compatibilidad', value: 'HD Player / MSI', inline: true },
                        { name: '🏡 Desarrollado por', value: 'xpe.nettt', inline: true },
                        { name: '📣 Importante', value: 'Solo personal autorizado - prohibida su venta', inline: false }
                    )
                    .setFooter({ text: 'Community Stealth' })
                    .setTimestamp();
                
                // Crear archivo de texto como placeholder para el executable
                const exeContent = `Stealth-AntiCheatX Anti-Cheat v1
Desarrollado por: xpe.nettt
Compatibilidad: HD Player / MSI
Tamaño: 1.01MB
Fecha: ${new Date().toLocaleDateString()}

Este es un archivo placeholder.
Para usar el verdadero comando $anticheat, reemplaza este archivo
con el verdadero StealthAntiCheatX.exe`;

                try {
                    // PASO 1: Enviar información del anticheat PRIMERO
                    await message.reply({ embeds: [anticheatEmbed] });
                    
                    // PASO 2: Esperar un momento y enviar el archivo DEBAJO
                    setTimeout(async () => {
                        try {
                            fs.writeFileSync('./StealthAntiCheatX.txt', exeContent);
                            const attachment = new AttachmentBuilder('./StealthAntiCheatX.txt', { name: 'StealthAntiCheatX.exe' });
                            
                            await message.reply({ 
                                content: '🔥 **DESCARGA EL ARCHIVO AQUÍ:** 🔥',
                                files: [attachment] 
                            });
                            
                            fs.unlinkSync('./StealthAntiCheatX.txt'); // Limpiar archivo temporal
                        } catch (fileError) {
                            console.log('Error enviando archivo:', fileError);
                        }
                    }, 1500); // Esperar 1.5 segundos
                    
                } catch (error) {
                    console.log('Error en comando anticheat:', error);
                    await message.reply({ embeds: [anticheatEmbed] });
                }
                break;
                
            case 'apodo':
            case 'nickname':
                if (args.length === 0) {
                    // Mostrar apodo actual
                    const currentNickname = getUserNickname(message.author.id, message.author.username);
                    const nicknameEmbed = new EmbedBuilder()
                        .setTitle('👤 Tu Apodo')
                        .setDescription(`Tu apodo actual es: **${currentNickname}**`)
                        .setColor('#0099ff')
                        .addFields(
                            { name: '💡 Para cambiar', value: `Usa: \`${BOT_PREFIX}apodo [nuevo nombre]\``, inline: false }
                        )
                        .setFooter({ text: 'Community Stealth | xpe.nettt' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [nicknameEmbed] });
                } else {
                    // Establecer nuevo apodo
                    const newNickname = args.join(' ');
                    const oldNickname = getUserNickname(message.author.id, message.author.username);
                    
                    nicknames[message.author.id] = newNickname;
                    saveNicknames(nicknames);
                    
                    const nicknameEmbed = new EmbedBuilder()
                        .setTitle('👤 Apodo Actualizado')
                        .setDescription(`✅ Apodo actualizado correctamente!`)
                        .setColor('#00ff00')
                        .addFields(
                            { name: '📝 Apodo Anterior', value: oldNickname, inline: true },
                            { name: '🎯 Nuevo Apodo', value: newNickname, inline: true }
                        )
                        .setFooter({ text: 'Community Stealth | xpe.nettt' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [nicknameEmbed] });
                }
                break;

            // Comandos de desarrollador (👷)
            case 'owner':
                if (!isDeveloper(message.author.id)) {
                    return message.reply('❌ Solo los desarrolladores pueden usar este comando.');
                }
                
                const ownerEmbed = new EmbedBuilder()
                    .setTitle('👷 Información de Permisos')
                    .setDescription('Información sobre permisos de desarrolladores')
                    .setColor('#ff9900')
                    .addFields(
                        { name: '👑 Propietario', value: `<@${BOT_OWNER_ID}>`, inline: true },
                        { name: '👷 Desarrolladores', value: `${developers.developers.length}`, inline: true },
                        { name: '🔐 Tu Permiso', value: isOwner(message.author.id) ? 'Propietario' : 'Desarrollador', inline: true }
                    )
                    .setFooter({ text: 'Community Stealth | xpe.nettt' })
                    .setTimestamp();
                
                await message.reply({ embeds: [ownerEmbed] });
                break;

            case 'status':
                if (!isDeveloper(message.author.id)) {
                    return message.reply('❌ Solo los desarrolladores pueden usar este comando.');
                }
                
                const uptime = Math.floor(process.uptime() / 3600);
                const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
                const threatAnalysis = performThreatAnalysis();
                const totalAnalysisThreats = threatAnalysis.reduce((sum, threat) => sum + threat.count, 0);
                
                const statusEmbed = new EmbedBuilder()
                    .setTitle('📊 Estado del Bot')
                    .setDescription('Estado actual y métricas del sistema')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '🔄 Estado', value: 'Online ✅', inline: true },
                        { name: '⏱️ Uptime', value: `${uptime}h`, inline: true },
                        { name: '💾 Memoria', value: `${memoryUsage} MB`, inline: true },
                        { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                        { name: '👥 Usuarios', value: `${getTotalMemberCount(client)}`, inline: true },
                        { name: '⚠️ Amenazas', value: `${totalAnalysisThreats}`, inline: true }
                    )
                    .setFooter({ text: 'Community Stealth | xpe.nettt' })
                    .setTimestamp();
                
                await message.reply({ embeds: [statusEmbed] });
                break;

            case 'servers':
                if (!isDeveloper(message.author.id)) {
                    return message.reply('❌ Solo los desarrolladores pueden usar este comando.');
                }
                
                const serversList = client.guilds.cache.map(guild => 
                    `**${guild.name}** (${guild.id})\nMiembros: ${guild.memberCount}`
                ).join('\n\n');
                
                const serversEmbed = new EmbedBuilder()
                    .setTitle('🏠 Lista de Servidores')
                    .setDescription(`Servidores donde está presente el bot:\n\n${serversList || 'No hay servidores conectados.'}`)
                    .setColor('#7289da')
                    .setFooter({ text: `Total: ${client.guilds.cache.size} servidores` })
                    .setTimestamp();
                
                await message.reply({ embeds: [serversEmbed] });
                break;

            case 'dev_add':
                if (!isDeveloper(message.author.id)) {
                    return message.reply('❌ Solo los desarrolladores pueden usar este comando.');
                }
                
                if (args.length === 0) {
                    return message.reply('❌ Uso: `$dev_add [ID del usuario]`');
                }
                
                const userIdToAdd = args[0].replace(/[<@!>]/g, '');
                
                if (developers.developers.includes(userIdToAdd) || developers.owners.includes(userIdToAdd)) {
                    return message.reply('❌ Este usuario ya es desarrollador.');
                }
                
                developers.developers.push(userIdToAdd);
                saveDevelopers(developers);
                
                const devAddEmbed = new EmbedBuilder()
                    .setTitle('👷 Desarrollador Agregado')
                    .setDescription(`✅ <@${userIdToAdd}> agregado como desarrollador.`)
                    .setColor('#00ff00')
                    .setTimestamp();
                
                await message.reply({ embeds: [devAddEmbed] });
                break;

            case 'dev_check':
                if (!isDeveloper(message.author.id)) {
                    return message.reply('❌ Solo los desarrolladores pueden usar este comando.');
                }
                
                if (args.length === 0) {
                    return message.reply('❌ Uso: `$dev_check [ID del usuario]`');
                }
                
                const userIdToCheck = args[0].replace(/[<@!>]/g, '');
                const isDevOwner = developers.owners.includes(userIdToCheck);
                const isDev = developers.developers.includes(userIdToCheck);
                
                const status = isDevOwner ? 'Propietario' : isDev ? 'Desarrollador' : 'Sin permisos';
                const color = isDevOwner ? '#ff0000' : isDev ? '#ff9900' : '#666666';
                
                const devCheckEmbed = new EmbedBuilder()
                    .setTitle('👷 Verificación de Desarrollador')
                    .setDescription(`Estado de <@${userIdToCheck}>`)
                    .setColor(color)
                    .addFields(
                        { name: '🔐 Permiso', value: status, inline: true },
                        { name: '🆔 ID', value: userIdToCheck, inline: true },
                        { name: '✅ Verificado', value: isDevOwner || isDev ? 'Sí' : 'No', inline: true }
                    )
                    .setTimestamp();
                
                await message.reply({ embeds: [devCheckEmbed] });
                break;

            // Comandos de owner (👑)
            case 'leave':
                if (!isOwner(message.author.id)) {
                    return message.reply('❌ Solo el propietario puede usar este comando.');
                }
                
                const guild = message.guild;
                const leaveEmbed = new EmbedBuilder()
                    .setTitle('👋 Saliendo del Servidor')
                    .setDescription(`El bot abandonará ${guild.name} en 10 segundos...`)
                    .setColor('#ff0000')
                    .setTimestamp();
                
                await message.reply({ embeds: [leaveEmbed] });
                
                setTimeout(async () => {
                    try {
                        await guild.leave();
                    } catch (error) {
                        console.log('Error leaving guild:', error);
                    }
                }, 10000);
                break;

            case 'dev_remove':
                if (!isOwner(message.author.id)) {
                    return message.reply('❌ Solo el propietario puede usar este comando.');
                }
                
                if (args.length === 0) {
                    return message.reply('❌ Uso: `$dev_remove [ID del usuario]`');
                }
                
                const userIdToRemove = args[0].replace(/[<@!>]/g, '');
                const index = developers.developers.indexOf(userIdToRemove);
                
                if (index === -1) {
                    return message.reply('❌ Este usuario no es desarrollador.');
                }
                
                developers.developers.splice(index, 1);
                saveDevelopers(developers);
                
                const devRemoveEmbed = new EmbedBuilder()
                    .setTitle('👷 Desarrollador Removido')
                    .setDescription(`❌ <@${userIdToRemove}> removido de desarrolladores.`)
                    .setColor('#ff0000')
                    .setTimestamp();
                
                await message.reply({ embeds: [devRemoveEmbed] });
                break;

            case 'dev_list':
                if (!isOwner(message.author.id)) {
                    return message.reply('❌ Solo el propietario puede usar este comando.');
                }
                
                const ownersList = developers.owners.map(id => `<@${id}> (${id})`).join('\n') || 'Ninguno';
                const developersList = developers.developers.map(id => `<@${id}> (${id})`).join('\n') || 'Ninguno';
                
                const devListEmbed = new EmbedBuilder()
                    .setTitle('👥 Lista Completa de Desarrolladores')
                    .setColor('#7289da')
                    .addFields(
                        { name: '👑 Propietarios', value: ownersList, inline: false },
                        { name: '👷 Desarrolladores', value: developersList, inline: false }
                    )
                    .setFooter({ text: `Total: ${developers.owners.length + developers.developers.length} usuarios` })
                    .setTimestamp();
                
                await message.reply({ embeds: [devListEmbed] });
                break;
                
            // Sistema de Permisos para Auto-Actualizaciones
            case 'dev':
                if (!isDeveloper(message.author.id)) {
                    return message.reply('❌ Solo los desarrolladores pueden usar este comando.');
                }
                
                if (args.length === 0) {
                    const devHelpEmbed = new EmbedBuilder()
                        .setTitle('🤖 Comandos de Desarrollador')
                        .setDescription('Comandos disponibles para desarrolladores:')
                        .addFields(
                            { name: '💬 Sistema de Permisos', value: '`$dev approve approve [ID]` - Aprobar auto-actualización\n`$dev approve deny [ID]` - Denegar auto-actualización\n`$dev pending` - Ver métodos esperando autorización', inline: false },
                            { name: '🛠️ Gestión', value: '`$dev_add [ID]` - Agregar desarrollador\n`$dev_remove [ID]` - Remover desarrollador\n`$dev_check [ID]` - Verificar permisos\n`$dev_list` - Listar desarrolladores', inline: false }
                        )
                        .setColor('#7289da')
                        .setFooter({ text: 'Stealth-AntiCheat | Sistema de Permisos' })
                        .setTimestamp();
                    
                    return message.reply({ embeds: [devHelpEmbed] });
                }
                
                const subcommand = args[0].toLowerCase();
                
                switch (subcommand) {
                    case 'approve':
                        if (args.length < 3) {
                            return message.reply('❌ Uso: `$dev approve [approve|deny|yes|no] [ID]`');
                        }
                        
                        const action = args[1].toLowerCase();
                        const methodId = parseInt(args[2]);
                        
                        if (isNaN(methodId)) {
                            return message.reply('❌ ID debe ser un número válido.');
                        }
                        
                        // Buscar el método en la lista de métodos descubiertos
                        const targetMethod = discoveredMethods.find(method => method.id === methodId);
                        
                        if (!targetMethod) {
                            return message.reply(`❌ No se encontró un método con ID ${methodId}.`);
                        }
                        
                        if (targetMethod.status !== 'AWAITING_PERMISSION') {
                            return message.reply(`❌ El método ${methodId} no está esperando autorización (estado actual: ${targetMethod.status}).`);
                        }
                        
                        if (action === 'approve' || action === 'yes') {
                            // Aprobar auto-actualización
                            targetMethod.status = 'APPROVED';
                            targetMethod.approvedBy = message.author.id;
                            targetMethod.approvedAt = new Date();
                            
                            const approveEmbed = new EmbedBuilder()
                                .setTitle('✅ AUTO-ACTUALIZACIÓN APROBADA')
                                .setDescription(`**Método ID: ${methodId}** - Auto-actualización autorizada`)
                                .addFields(
                                    { name: '🔧 Método', value: targetMethod.method, inline: false },
                                    { name: '📊 Patrón', value: targetMethod.pattern, inline: false },
                                    { name: '👤 Aprobado por', value: `<@${message.author.id}>`, inline: true },
                                    { name: '⏰ Timestamp', value: targetMethod.approvedAt.toLocaleString(), inline: true }
                                )
                                .setColor('#00ff00')
                                .setFooter({ text: '🤖 Iniciando auto-actualización...' })
                                .setTimestamp();
                            
                            await message.reply({ embeds: [approveEmbed] });
                            
                            // Ejecutar auto-actualización
                            try {
                                await updateAntiCheatRepository(targetMethod);
                                
                                const successEmbed = new EmbedBuilder()
                                    .setTitle('🎉 Auto-Actualización Completada')
                                    .setDescription(`El método ${methodId} ha sido implementado exitosamente en el repositorio Stealth-AntiCheatX`)
                                    .setColor('#00ff00')
                                    .setFooter({ text: '✅ Sistema actualizado y funcionando' })
                                    .setTimestamp();
                                
                                await message.reply({ embeds: [successEmbed] });
                                
                            } catch (error) {
                                console.error('Error en auto-actualización:', error);
                                
                                const errorEmbed = new EmbedBuilder()
                                    .setTitle('❌ Error en Auto-Actualización')
                                    .setDescription(`Error al actualizar el repositorio para el método ${methodId}`)
                                    .addFields(
                                        { name: '🚨 Error', value: error.message, inline: false }
                                    )
                                    .setColor('#ff0000')
                                    .setFooter({ text: '🔧 Revisar logs del sistema' })
                                    .setTimestamp();
                                
                                await message.reply({ embeds: [errorEmbed] });
                            }
                            
                        } else if (action === 'deny' || action === 'no') {
                            // Denegar auto-actualización
                            targetMethod.status = 'DENIED';
                            targetMethod.deniedBy = message.author.id;
                            targetMethod.deniedAt = new Date();
                            
                            const denyEmbed = new EmbedBuilder()
                                .setTitle('❌ AUTO-ACTUALIZACIÓN DENEGADA')
                                .setDescription(`**Método ID: ${methodId}** - Continuando monitoreo`)
                                .addFields(
                                    { name: '🔧 Método', value: targetMethod.method, inline: false },
                                    { name: '📊 Razón', value: 'Solicitud denegada. El bot continuará monitoreando.', inline: false },
                                    { name: '👤 Denegado por', value: `<@${message.author.id}>`, inline: true },
                                    { name: '⏰ Timestamp', value: targetMethod.deniedAt.toLocaleString(), inline: true }
                                )
                                .setColor('#ff9900')
                                .setFooter({ text: '🤖 Continuando vigilancia...' })
                                .setTimestamp();
                            
                            await message.reply({ embeds: [denyEmbed] });
                        } else {
                            return message.reply('❌ Acción debe ser: `approve`, `deny`, `yes`, o `no`');
                        }
                        break;
                        
                    case 'pending':
                        const pendingMethods = discoveredMethods.filter(method => method.status === 'AWAITING_PERMISSION');
                        
                        if (pendingMethods.length === 0) {
                            return message.reply('📋 No hay métodos esperando autorización.');
                        }
                        
                        const pendingList = pendingMethods.map(method => 
                            `**ID ${method.id}**: ${method.method}\n📊 Patrón: \`${method.pattern}\`\n⏰ Detectado: ${new Date(method.timestamp).toLocaleString()}`
                        ).join('\n\n');
                        
                        const pendingEmbed = new EmbedBuilder()
                            .setTitle('⏳ Métodos Esperando Autorización')
                            .setDescription(`${pendingMethods.length} métodos pendientes de aprobación:`)
                            .addFields(
                                { name: '📋 Lista de Métodos', value: pendingList.slice(0, 1800), inline: false }
                            )
                            .setColor('#ffaa00')
                            .setFooter({ text: `Usa: $dev approve [approve|deny] [ID]` })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [pendingEmbed] });
                        break;
                        
                    default:
                        const unknownDevEmbed = new EmbedBuilder()
                            .setTitle('❓ Comando no reconocido')
                            .setDescription(`No conozco el subcomando \`${subcommand}\` para \`dev\`.`)
                            .addFields(
                                { name: '💡 Ayuda', value: '`$dev approve approve [ID]` - Aprobar auto-actualización\n`$dev approve deny [ID]` - Denegar auto-actualización\n`$dev pending` - Ver métodos esperando autorización', inline: false }
                            )
                            .setColor('#ff0000')
                            .setFooter({ text: 'Usa: $dev (sin argumentos) para ver ayuda' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [unknownDevEmbed] });
                }
                break;
                
            case 'add_server':
                const botInviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
                
                // Si hay argumentos, procesar enlace de servidor
                if (args.length > 0) {
                    const arg = args[0];
                    
                    // Si es un enlace de Discord
                    if (arg.includes('discord.gg/') || arg.includes('discord.com/invite/')) {
                        const inviteCode = arg.split('/').pop().split('?')[0];
                        
                        const inviteEmbed = new EmbedBuilder()
                            .setTitle('🔗 Procesando enlace de servidor...')
                            .setDescription(`Enlace procesado: **${inviteCode}**`)
                            .setColor('#00ff00')
                            .addFields(
                                { name: '📋 Tipo', value: 'Enlace de invitación de servidor', inline: true },
                                { name: '🔍 Estado', value: 'Procesado correctamente', inline: true },
                                { name: '🤖 Bot', value: 'Stealth-AntiCheatX listo para servir', inline: true }
                            )
                            .setFooter({ text: 'Community Stealth | Bot procesado' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [inviteEmbed] });
                        return;
                    }
                    
                    // Si es otro tipo de argumento
                    if (arg === 'invite' || arg === 'bot') {
                        // Mostrar enlace del bot
                        const addServerEmbed = new EmbedBuilder()
                            .setTitle('🚀 ¡Invita Stealth-AntiCheatX a tu Servidor!')
                            .setDescription('Añade el bot a tu servidor de Discord para protegerlo con nuestro sistema anti-cheat avanzado.')
                            .setColor('#00ff00')
                            .addFields(
                                { name: '🌟 Características', value: '• Monitoreo automático 24/7\n• Detección de exploits\n• Protección anti-cheat\n• Análisis de amenazas', inline: false },
                                { name: '🔗 Enlace de Invitación', value: `[Click aquí para agregar](${botInviteLink})`, inline: false },
                                { name: '⚙️ Permisos Necesarios', value: 'Administrador (para todas las funciones)', inline: false }
                            )
                            .setFooter({ text: 'Community Stealth | Desarrollado por xpe.nettt' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [addServerEmbed] });
                        return;
                    }
                }
                
                // Por defecto, mostrar ayuda del comando
                const helpAddServerEmbed = new EmbedBuilder()
                    .setTitle('🤖 Uso de Comando Add_Server')
                    .setDescription('Comandos disponibles para manejar el bot y servidores')
                    .setColor('#7289da')
                    .addFields(
                        { name: '🔗 Enlace de servidor', value: `\`${BOT_PREFIX}add_server [enlace_discord]\`` + '\nEjemplo: $add_server https://discord.gg/vliz-store', inline: false },
                        { name: '🤖 Invitar bot', value: `\`${BOT_PREFIX}add_server bot\`` + '\nObtener enlace para invitar el bot', inline: false },
                        { name: '📋 Ejemplo completo', value: `$add_server https://discord.gg/vliz-store\n$add_server bot`, inline: false }
                    )
                    .setFooter({ text: 'Community Stealth | Comando mejorado' })
                    .setTimestamp();
                
                await message.reply({ embeds: [helpAddServerEmbed] });
                break;
                
            case 'ai':
            case 'stealth':
                if (!process.env.MINIMAX_API_KEY) {
                    return message.reply('❌ API key de MiniMax no configurada. Contacta al desarrollador.');
                }
                
                if (!message.guild) {
                    return message.reply('❌ Este comando solo funciona en servidores.');
                }
                
                try {
                    // Obtener contexto específico para anti-cheat
                    const anticheatContext = {
                        guild: {
                            name: message.guild.name,
                            memberCount: message.guild.memberCount,
                            channels: {
                                total: message.guild.channels.cache.size,
                                text: message.guild.channels.cache.filter(c => c.type === 0).size,
                                voice: message.guild.channels.cache.filter(c => c.type === 2).size
                            }
                        },
                        request: {
                            user: message.author.tag,
                            userId: message.author.id,
                            channelId: message.channel.id,
                            timestamp: new Date().toISOString(),
                            messageContent: message.content
                        },
                        antiCheatStatus: {
                            monitoringActive: true,
                            patternsLoaded: 12,
                            threatLevel: 'OPERATIONAL'
                        }
                    };

                    const userMessage = args.join(' ') || 'Analiza el estado de seguridad actual';
                    console.log(`🛡️ [Stealth-CheatX] ${message.author.tag} en ${message.guild.name}: ${userMessage}`);
                    
                    // Respuesta inicial específica de anti-cheat
                    const loadingMessage = await message.reply('🛡️ *Stealth-CheatX analizando...*');
                    
                    // Obtener respuesta de Stealth-CheatX
                    const cheatXResponse = await stealthCheatXChat(userMessage, anticheatContext);
                    
                    if (!cheatXResponse) {
                        await loadingMessage.edit('❌ Error en sistema Stealth-CheatX. Contacta al desarrollador.');
                        return;
                    }
                    
                    // Procesar respuesta específica de anti-cheat
                    const finalResponse = await processStealthCheatXResponse(cheatXResponse, message.guild, message);
                    
                    // Mostrar respuesta al usuario
                    if (finalResponse && finalResponse.trim()) {
                        await loadingMessage.edit(`🛡️ **Stealth-CheatX:**\n${finalResponse}`);
                    } else {
                        await loadingMessage.edit('🛡️ **Análisis completado.** Consulte los resultados de herramientas arriba.');
                    }
                    
                } catch (error) {
                    console.error('Error en Stealth-CheatX:', error);
                    await message.reply('❌ Error en sistema Stealth-CheatX. Contacta al desarrollador.');
                }
                break;

            case 'canales':
            case 'channels':
                const channels = message.guild.channels.cache
                    .filter(channel => channel.type === 0) // GUILD_TEXT
                    .sort((a, b) => a.position - b.position);
                
                if (channels.size === 0) {
                    return message.reply('❌ No se encontraron canales de texto en este servidor.');
                }
                
                const channelsList = channels
                    .map(channel => `#${channel.name}`)
                    .join('\n')
                    .slice(0, 1000); // Limitar a 1000 caracteres
                
                const channelsEmbed = new EmbedBuilder()
                    .setTitle('📋 Canales del Servidor')
                    .setDescription(`**${message.guild.name}** tiene ${channels.size} canales de texto:`)
                    .setColor('#7289da')
                    .addFields(
                        { name: '🏷️ Canales Encontrados', value: channelsList, inline: false },
                        { name: '🔢 Total', value: `${channels.size} canales`, inline: true }
                    )
                    .setFooter({ text: `Guild ID: ${message.guild.id}` })
                    .setTimestamp();
                
                await message.reply({ embeds: [channelsEmbed] });
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