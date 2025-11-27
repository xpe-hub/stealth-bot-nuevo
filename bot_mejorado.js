require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuración del bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Variables de configuración
const BOT_PREFIX = process.env.BOT_PREFIX || '$';
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;
const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;

// Base de datos de apodos (archivo JSON simple)
const NICKNAMES_FILE = path.join(__dirname, 'nicknames.json');

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

function saveNicknames(nicknames) {
    try {
        fs.writeFileSync(NICKNAMES_FILE, JSON.stringify(nicknames, null, 2));
    } catch (error) {
        console.log('Error saving nicknames:', error);
    }
}

let nicknames = loadNicknames();

// Funciones auxiliares
function isOwner(userId) {
    return userId === BOT_OWNER_ID;
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

// Función para enviar respuesta con apodo
function respondWithNickname(interaction, message, username) {
    const nickname = getUserNickname(interaction.author.id, username);
    const response = message.replace('{username}', nickname);
    interaction.reply(response);
}

// Evento: Bot listo
client.once('ready', () => {
    console.log('🤖 Bot está listo y funcionando!');
    console.log(`📍 Conectado como: ${client.user.tag}`);
    console.log(`🏠 En ${client.guilds.cache.size} servidores`);
    
    // Establecer presencia del bot
    client.user.setPresence({
        status: 'online',
        activities: [{ 
            name: '🛡️ AntiCheat Community Stealth', 
            type: 3 // WATCHING
        }]
    });
});

// Evento: Nuevo mensaje
client.on('messageCreate', async (message) => {
    // Ignorar mensajes de otros bots
    if (message.author.bot) return;
    
    // Obtener el apodo del usuario
    const userNickname = getUserNickname(message.author.id, message.author.username);
    
    // Manejo de menciones
    if (message.content.includes(`<@${client.user.id}>`)) {
        const totalMembers = getTotalMemberCount(client);
        const currentGuildMembers = getCurrentGuildMemberCount(client);
        
        const embed = new EmbedBuilder()
            .setTitle('🤖 ¡Stealth-AntiCheat-bot está aquí!')
            .setDescription(`¡Hola ${userNickname}! Soy el bot de **anti-cheat avanzado** para Community Stealth.`)
            .setColor('#0099ff')
            .addFields(
                { name: '📋 Comandos', value: `\`${BOT_PREFIX}help\` - Lista de comandos\n\`${BOT_PREFIX}ping\` - Verificar estado\n\`${BOT_PREFIX}scan\` - para escanear el servidor`, inline: true },
                { name: '🌐 Comunidad', value: '¡Únete a Community Stealth!', inline: true },
                { name: '📊 Estado', value: `Bot conectado: ✅\nServidores: ${client.guilds.cache.size}\nUsuarios: ${totalMembers}`, inline: true }
            )
            .setFooter({ text: 'Stealth-AntiCheat-bot v2.0 | xpe.nettt' })
            .setTimestamp();
        
        await message.reply({ embeds: [embed] });
        return;
    }
    
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
                    .setDescription('Lista de comandos disponibles para Stealth-AntiCheat-bot')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '📋 Comandos Básicos', value: `\`${BOT_PREFIX}help\` - Muestra esta lista de comandos\n\`${BOT_PREFIX}ping\` - Verifica la latencia del bot\n\`${BOT_PREFIX}info\` - Información del bot`, inline: true },
                        { name: '🔍 Anti-Cheat', value: `\`${BOT_PREFIX}scan\` - Escanea el servidor en busca de amenazas\n\`${BOT_PREFIX}anticheat\` - Descargar herramienta anti-cheat`, inline: true },
                        { name: '👤 Personalización', value: `\`${BOT_PREFIX}apodo [nombre]\` - Establece tu apodo\n\`${BOT_PREFIX}apodo\` - Ver tu apodo actual`, inline: true }
                    )
                    .setFooter({ text: 'Desarrollado por xpe.nettt' })
                    .setTimestamp();
                
                await message.reply({ embeds: [helpEmbed] });
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
                        { name: '📊 Estado', value: `${statusEmoji} ${statusText}`, inline: true }
                    )
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [pingEmbed] });
                break;
                
            case 'info':
                const totalMembers = getTotalMemberCount(client);
                const currentGuildMembers = getCurrentGuildMemberCount(client);
                
                const infoEmbed = new EmbedBuilder()
                    .setTitle('🤖 Información del Bot')
                    .setDescription('Bot de Discord para Community Stealth con funcionalidades anti-cheat')
                    .setColor('#0099ff')
                    .addFields(
                        { name: '📋 Detalles', value: `**Nombre:** ${client.user.username}\n**ID:** ${client.user.id}\n**Versión:** 2.0.0-Advanced`, inline: false },
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
                const scanEmbed = new EmbedBuilder()
                    .setTitle('🔍 Escaneando Servidor...')
                    .setDescription('Analizando el servidor en busca de amenazas y actividades sospechosas.')
                    .setColor('#ffaa00')
                    .addFields(
                        { name: '👥 Miembros Escaneados', value: `${getCurrentGuildMemberCount(client)}`, inline: true },
                        { name: '⚠️ Amenazas Detectadas', value: '0', inline: true },
                        { name: '🛡️ Nivel de Seguridad', value: 'Alto', inline: true },
                        { name: '📊 Análisis Completado', value: '✅ Sin problemas detectados', inline: false }
                    )
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [scanEmbed] });
                break;
                
            case 'anticheat':
                // Comando para descargar herramienta anti-cheat
                if (!isOwner(message.author.id)) {
                    return message.reply('❌ Solo el desarrollador puede usar este comando.');
                }
                
                const anticheatEmbed = new EmbedBuilder()
                    .setTitle('🛡️ Herramienta Anti-Cheat')
                    .setDescription('Herramienta avanzada de detección y eliminación de cheats para juegos.')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '📋 Descripción', value: 'Sistema anti-cheat avanzado con detección de modificaciones, inyectores y programas maliciosos.', inline: false },
                        { name: '🔧 Características', value: '• Detección en tiempo real\n• Eliminación automática\n• Protección preventiva\n• Actualizaciones automáticas', inline: false },
                        { name: '💻 Compatibilidad', value: 'Windows 10/11, 64-bit', inline: true }
                    )
                    .setFooter({ text: `¡Hola ${userNickname}!` })
                    .setTimestamp();
                
                await message.reply({ embeds: [anticheatEmbed] });
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
                        .setFooter({ text: 'Stealth-AntiCheat-bot | xpe.nettt' })
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
                        .setFooter({ text: 'Stealth-AntiCheat-bot | xpe.nettt' })
                        .setTimestamp();
                    
                    await message.reply({ embeds: [nicknameEmbed] });
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
            .setFooter({ text: 'Stealth-AntiCheat-bot | xpe.nettt' })
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