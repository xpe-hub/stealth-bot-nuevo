// ========================================================
// SCRIPT DE PRUEBA - VERIFICAR ESTADO DEL BOT Y TTS
// Stealth-AntiCheatX v3.0 - IA AUTÓNOMA CON VOZ
// ========================================================

require('dotenv').config();
const { textToSpeech, getAvailableVoices } = require('./minimax_tts_direct');

console.log('🔍 ========================================================');
console.log('🤖 STEALTH-ANTICHEATX - VERIFICACIÓN DEL BOT');
console.log('🔍 ========================================================');

// 1. Verificar variables de entorno críticas
console.log('\n📋 VARIABLES DE ENTORNO:');
const criticalVars = [
    'DISCORD_BOT_TOKEN',
    'MINIMAX_API_KEY',
    'BOT_OWNER_ID',
    'CHAT_CHANNEL_ID',
    'CMD_CHANNEL_ID',
    'ENABLE_DLL_ANALYSIS',
    'ENABLE_BYPASS_DETECTION',
    'ENABLE_REPOSITORY_MONITORING'
];

criticalVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const displayValue = value ? 
        (varName.includes('TOKEN') || varName.includes('KEY') ? 
            value.substring(0, 20) + '...' : 
            value) : 
        'NO CONFIGURADA';
    console.log(`  ${status} ${varName}: ${displayValue}`);
});

// 2. Probar función TTS
console.log('\n🔊 PRUEBA DE TTS (Text-to-Speech):');

async function testTTS() {
    try {
        console.log('  🧪 Probando conectividad con MiniMax API...');
        
        const testResult = await getAvailableVoices();
        
        if (testResult && Array.isArray(testResult)) {
            console.log('  ✅ MiniMax API respondiendo correctamente');
            console.log('  📢 Voces disponibles:', testResult.length);
            
            // Probar generación de audio
            console.log('  🎯 Probando generación de audio...');
            const audioResult = await textToSpeech('¡Hola! Soy el bot Stealth-AntiCheatX v3.0 con IA autónoma por voz.', {
                voice_setting: {
                    voice_id: 'male-qn-qingse',
                    speed: 1.0,
                    format: 'mp3'
                }
            });
            
            if (audioResult && audioResult.audio_file) {
                console.log('  ✅ Audio generado exitosamente');
                console.log('  📁 Archivo de audio:', audioResult.audio_file);
                console.log('  🌍 URL de descarga:', audioResult.download_url || 'N/A');
            } else {
                console.log('  ⚠️ Audio generado pero formato inesperado:', audioResult);
            }
        } else {
            console.log('  ⚠️ MiniMax API respondiendo pero formato inesperado');
        }
        
    } catch (error) {
        console.log('  ❌ Error en prueba TTS:', error.message);
        
        if (error.message.includes('MINIMAX_API_KEY')) {
            console.log('  🔑 SOLUCIÓN: Configurar MINIMAX_API_KEY en Railway');
        } else if (error.message.includes('fetch')) {
            console.log('  🌐 SOLUCIÓN: Verificar conectividad a internet');
        } else {
            console.log('  🔧 SOLUCIÓN: Revisar configuración de MiniMax API');
        }
    }
}

// 3. Verificar módulos del bot
console.log('\n🔧 MÓDULOS DEL BOT:');
try {
    require('./anticheat_analyzer_advanced');
    console.log('  ✅ anticheat_analyzer_advanced.js - Cargado');
} catch (error) {
    console.log('  ❌ anticheat_analyzer_advanced.js - Error:', error.message);
}

try {
    require('./repository_connector');
    console.log('  ✅ repository_connector.js - Cargado');
} catch (error) {
    console.log('  ❌ repository_connector.js - Error:', error.message);
}

try {
    require('./stealth_cheatx_ai');
    console.log('  ✅ stealth_cheatx_ai.js - Cargado');
} catch (error) {
    console.log('  ❌ stealth_cheatx_ai.js - Error:', error.message);
}

// 4. Test de conectividad a Discord
console.log('\n🌐 CONECTIVIDAD DISCORD:');
console.log('  🔑 DISCORD_BOT_TOKEN configurado:', process.env.DISCORD_BOT_TOKEN ? 'SÍ' : 'NO');
console.log('  👤 BOT_OWNER_ID configurado:', process.env.BOT_OWNER_ID ? 'SÍ' : 'NO');
console.log('  📧 CHAT_CHANNEL_ID configurado:', process.env.CHAT_CHANNEL_ID ? 'SÍ' : 'NO');
console.log('  ⚡ CMD_CHANNEL_ID configurado:', process.env.CMD_CHANNEL_ID ? 'SÍ' : 'NO');

console.log('\n🎯 COMANDOS TTS DISPONIBLES:');
console.log('  💬 !speak [texto] - Convertir texto a voz');
console.log('  📢 !voices - Listar voces disponibles');
console.log('  🧪 !test-voice - Probar sistema TTS');

console.log('\n🔍 ========================================================');
console.log('🚀 EJECUTANDO PRUEBAS...');
console.log('🔍 ========================================================\n');

// Ejecutar prueba TTS
testTTS().then(() => {
    console.log('\n✅ VERIFICACIÓN COMPLETADA');
    console.log('📋 Para usar el bot en Discord, ejecuta: node bot.js');
    console.log('🔧 Si hay errores, revisa las variables de entorno en Railway');
}).catch(error => {
    console.log('\n❌ ERROR EN VERIFICACIÓN:', error);
});

console.log('\n⏳ Esperando resultados de las pruebas...');