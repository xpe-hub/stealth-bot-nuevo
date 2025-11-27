require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

console.log('🔍 Verificando configuración del bot...');

// Verificar variables de entorno críticas
const requiredVars = [
    'DISCORD_BOT_TOKEN',
    'BOT_OWNER_ID'
];

console.log('\n📋 Variables de entorno:');
requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
        console.log(`❌ ${varName}: NO ENCONTRADA`);
    }
});

// Crear cliente de prueba
const testClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

testClient.once('ready', () => {
    console.log(`\n🎯 Bot conectado exitosamente!`);
    console.log(`📊 Información del bot:`);
    console.log(`   - Nombre: ${testClient.user.tag}`);
    console.log(`   - ID: ${testClient.user.id}`);
    console.log(`   - Servidores: ${testClient.guilds.cache.size}`);
    console.log(`\n✅ El bot está funcionando correctamente!`);
    
    testClient.destroy();
    process.exit(0);
});

testClient.on('error', error => {
    console.error('\n❌ Error de conexión:', error.message);
    process.exit(1);
});

console.log('\n🔄 Intentando conectar a Discord...');
testClient.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('\n❌ Error al conectar el bot:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verificar que el token de Discord sea válido');
    console.log('   2. Verificar que el bot esté invitado al servidor');
    console.log('   3. Verificar que el bot tenga los permisos necesarios');
    process.exit(1);
});