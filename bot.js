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
                        { name: '📋 Comandos Básicos', value: `\`${BOT_PREFIX}help\` - Muestra esta lista\n\`${BOT_PREFIX}about\` - Acerca del bot\n\`${BOT_PREFIX}ping\` - Ver latencia\n\`${BOT_PREFIX}scan\` - Escanear servidor\n\`${BOT_PREFIX}community\` - Info de la comunidad\n\`${BOT_PREFIX}vc [canal]\` - Unirse a canal de voz\n\`${BOT_PREFIX}add_server\` - Invitar bot\n\`${BOT_PREFIX}canales\` - Ver todos los canales`, inline: true },
                        { name: '👷 Comandos Desarrollador', value: `\`${BOT_PREFIX}owner\` - Info de permisos\n\`${BOT_PREFIX}status\` - Estado del bot\n\`${BOT_PREFIX}servers\` - Lista de servidores\n\`${BOT_PREFIX}dev_add [ID]\` - Agregar desarrolladores\n\`${BOT_PREFIX}dev_check [ID]\` - Verificar desarrolladores`, inline: true },
                        { name: '👑 Comandos Owner', value: `\`${BOT_PREFIX}leave\` - Salir del servidor\n\`${BOT_PREFIX}dev_remove [ID]\` - Remover desarrolladores\n\`${BOT_PREFIX}dev_list\` - Lista completa desarrolladores`, inline: true },
                        { name: '🔍 Anti-Cheat', value: `\`${BOT_PREFIX}anticheat\` - Descargar herramienta`, inline: true },
                        { name: '👤 Personalización', value: `\`${BOT_PREFIX}apodo [nombre]\` - Establece tu apodo\n\`${BOT_PREFIX}apodo\` - Ver tu apodo actual`, inline: true }
                    )
                    .addFields(
                        { name: '✔️ Características', value: '• Monitoreo automático\n• Análisis de amenazas\n• Reportes en tiempo real\n• Responde cuando lo mencionas\n• Integración con Community Stealth', inline: false }
                    )
                    .setFooter({ text: 'Únete a Community Stealth' })
                    .setTimestamp();
                
                await message.reply({ embeds: [helpEmbed] });
                break;
                
            case 'about':
                const aboutEmbed = new EmbedBuilder()
                    .setTitle('🤖 Acerca de Stealth-AntiCheat')
                    .setDescription('Bot de monitoreo y análisis anti-cheat desarrollado por xpe.nettt')
                    .setColor('#0099ff')
                    .addFields(
                        { name: '📋 Información', value: `**Nombre:** ${client.user.username}\n**ID:** ${client.user.id}\n**Estado:** Online ✅\n**Uptime:** ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`, inline: true },
                        { name: '👨‍💻 Desarrollador', value: 'xpe.nettt | Community Stealth', inline: true },
                        { name: '🛡️ Funciones', value: 'Anti-cheat avanzado, análisis de amenazas, monitoreo automático', inline: true },
                        { name: '📊 Estadísticas', value: `**Servidores:** ${client.guilds.cache.size}\n**Comandos:** 15+\n**Nivel de seguridad:** Máximo`, inline: true }
                    )
                    .setFooter({ text: 'Community Stealth' })
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
                
                if (args.length === 0) {
                    // Mostrar estado de voz actual
                    if (message.member.voice.channel) {
                        const voiceEmbed = new EmbedBuilder()
                            .setTitle('🎤 Canal de Voz Actual')
                            .setDescription(`Estás conectado en: **${message.member.voice.channel.name}**`)
                            .setColor('#00ff00')
                            .addFields(
                                { name: '🔗 Canal ID', value: message.member.voice.channel.id, inline: true },
                                { name: '👥 Usuarios', value: `${message.member.voice.channel.members.size}`, inline: true }
                            )
                            .setFooter({ text: `Uso: ${BOT_PREFIX}vc [nombre del canal]` })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [voiceEmbed] });
                    } else {
                        const voiceEmbed = new EmbedBuilder()
                            .setTitle('🎤 Canales de Voz Disponibles')
                            .setDescription('Canales de voz disponibles en este servidor:')
                            .setColor('#ff9900')
                            .addFields(
                                { name: '📋 Lista de Canales', value: guild.voiceChannels.map(channel => channel.name).slice(0, 10).join('\n') || 'No hay canales de voz disponibles', inline: false },
                                { name: '💡 Uso', value: `\`${BOT_PREFIX}vc [nombre del canal]\``, inline: false }
                            )
                            .setFooter({ text: 'Community Stealth | xpe.nettt' })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [voiceEmbed] });
                    }
                } else {
                    // Unirse al canal especificado (VERSIÓN CORREGIDA)
                    const channelName = args.join(' ');
                    const guild = message.guild;
                    
                    // Buscar canal de voz por nombre
                    const voiceChannel = guild.channels.cache.find(channel => 
                        channel.type === 2 && // GUILD_VOICE
                        channel.name.toLowerCase().includes(channelName.toLowerCase())
                    );
                    
                    if (!voiceChannel) {
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('❌ Canal No Encontrado')
                            .setDescription(`No se encontró un canal de voz con el nombre "${channelName}"`)
                            .setColor('#ff0000')
                            .addFields(
                                { name: '🔍 Canales Disponibles', value: guild.voiceChannels.map(ch => ch.name).slice(0, 5).join('\n') || 'No hay canales de voz', inline: false },
                                { name: '💡 Sugerencia', value: `Usa un nombre más específico o verifica el nombre exacto.`, inline: false }
                            )
                            .setFooter({ text: `Uso: ${BOT_PREFIX}vc [nombre del canal]` })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [errorEmbed] });
                        return;
                    }
                    
                    try {
                        // Si el bot ya está en un canal, desconectarlo primero
                        if (message.guild.members.me.voice.channel) {
                            await message.guild.members.me.voice.disconnect();
                        }
                        
                        // El bot se conecta al canal especificado
                        await message.guild.members.me.voice.setChannel(voiceChannel.id);
                        
                        const successEmbed = new EmbedBuilder()
                            .setTitle('✅ Bot Unido al Canal')
                            .setDescription(`El bot se ha unido al canal de voz **${voiceChannel.name}**`)
                            .setColor('#00ff00')
                            .addFields(
                                { name: '📢 Anuncio', value: '¡El bot está ahora en este canal para monitoreo!', inline: false },
                                { name: '🔧 Estado', value: 'Monitoreo de audio activo', inline: true },
                                { name: '⚠️ Nota', value: 'Para que el bot monitoree, debe tener permisos de voz', inline: true }
                            )
                            .setFooter({ text: `Canal: ${voiceChannel.name} | ID: ${voiceChannel.id}` })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [successEmbed] });
                        
                    } catch (voiceError) {
                        console.error('Error conectando al canal de voz:', voiceError);
                        
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('❌ Error de Conexión')
                            .setDescription(`No se pudo conectar al canal de voz.`)
                            .setColor('#ff0000')
                            .addFields(
                                { name: '🔧 Posibles Soluciones', value: '• Verificar permisos de voz\n• El canal puede estar lleno\n• El bot puede estar en cooldown', inline: false },
                                { name: '📞 Contacto', value: 'Si persiste el error, contacta al administrador', inline: false }
                            )
                            .setFooter({ text: 'Error: ' + voiceError.message })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [errorEmbed] });
                    }
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
                const totalThreats = threatAnalysis.reduce((sum, threat) => sum + threat.count, 0);
                
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
                        { name: '⚠️ Amenazas', value: `${totalThreats}`, inline: true }
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
                
            case 'add_server':
                const botInviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
                
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