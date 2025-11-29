// ========================================================
// SCRIPT DE PRUEBA SIMPLIFICADO - VERIFICAR ESTADO DEL BOT
// Stealth-AntiCheatX v3.0 - IA AUTÓNOMA CON VOZ
// ========================================================

// Simular dotenv para evitar problemas de dependencias
process.env = {
    ...process.env,
    DISCORD_BOT_TOKEN: "MTQ0MTg3ODA3MjUwNzg5MTcyMg.GtM5hc.gCwZut05T36Cqm7YXtPXil-Qo2iCVDPuJFthmw",
    MINIMAX_API_KEY: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxlc3IiLCJVc2VyTmFtZSI6InN0ZWFsdGgtbWFuYWdlci1haSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg4NDY4ODI5OTk4MTc3ODMxOCIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE5ODg0Njg4Mjk5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxlc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0X5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA",
    BOT_OWNER_ID: "751601149928538224",
    CHAT_CHANNEL_ID: "1442266154516091020",
    CMD_CHANNEL_ID: "1441888236833210389",
    ENABLE_DLL_ANALYSIS: "true",
    ENABLE_BYPASS_DETECTION: "true", 
    ENABLE_REPOSITORY_MONITORING: "true",
    REPOSITORY_OWNER: "xpe-hub",
    REPOSITORY_NAME: "stealth-bot-nuevo",
    ANALYSIS_TIMEOUT: "30000",
    THREAT_CONFIDENCE_THRESHOLD: "70"
};

// Usar fetch nativo de Node.js 18+
const fetch = global.fetch || require('node-fetch');

// ========================================================
// FUNCIONES DE PRUEBA TTS SIMPLIFICADAS
// ========================================================

async function testMiniMaxAPI() {
    const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
    
    if (!MINIMAX_API_KEY) {
        return { success: false, error: 'MINIMAX_API_KEY no configurada' };
    }
    
    try {
        console.log('🧪 Probando conectividad con MiniMax API...');
        
        // Probar endpoint de voces disponibles
        const voicesResponse = await fetch('https://api.minimaxi.chat/v1/t2a_v2/voice/list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!voicesResponse.ok) {
            const errorText = await voicesResponse.text();
            return { success: false, error: `API Error ${voicesResponse.status}: ${errorText}` };
        }
        
        const voicesData = await voicesResponse.json();
        console.log('✅ MiniMax API respondiendo correctamente');
        console.log('📢 Voces disponibles:', voicesData.data ? voicesData.data.length : 'N/A');
        
        // Probar generación de audio
        console.log('🎯 Probando generación de audio...');
        
        const ttsResponse = await fetch('https://api.minimaxi.chat/v1/t2a_v2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: '¡Hola! Soy el bot Stealth-AntiCheatX v3.0 con IA autónoma por voz.',
                voice_setting: {
                    voice_id: 'male-qn-qingse',
                    speed: 1.0,
                    vol: 1.0,
                    pitch: 0,
                    audio_sample_rate: 32000,
                    bitrate: 128000,
                    format: 'mp3'
                },
                emotion: 'happy'
            })
        });
        
        if (!ttsResponse.ok) {
            const errorText = await ttsResponse.text();
            return { success: false, error: `TTS Error ${ttsResponse.status}: ${errorText}` };
        }
        
        const ttsData = await ttsResponse.json();
        console.log('✅ Audio generado exitosamente');
        
        return { 
            success: true, 
            voices: voicesData,
            audio: ttsData,
            message: 'TTS funcionando correctamente'
        };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========================================================
// FUNCIÓN PRINCIPAL DE VERIFICACIÓN
// ========================================================

console.log('🔍 ========================================================');
console.log('🤖 STEALTH-ANTICHEATX - VERIFICACIÓN COMPLETA');
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

// 2. Probar conectividad a MiniMax API
console.log('\n🔊 PRUEBA DE MINIMAX API:');

testMiniMaxAPI().then(result => {
    if (result.success) {
        console.log('  ✅ MiniMax API totalmente funcional');
        console.log('  🎵 Sistema TTS operativo');
        console.log('  🗣️ Conversión de texto a voz disponible');
        
        if (result.voices && result.voices.data) {
            console.log('  📋 Voces disponibles:');
            result.voices.data.slice(0, 5).forEach(voice => {
                console.log(`    - ${voice.name} (${voice.id})`);
            });
            if (result.voices.data.length > 5) {
                console.log(`    ... y ${result.voices.data.length - 5} voces más`);
            }
        }
    } else {
        console.log('  ❌ Error en MiniMax API:', result.error);
        console.log('  🔧 Revisa la configuración de MINIMAX_API_KEY');
    }
}).catch(error => {
    console.log('  ❌ Error inesperado:', error);
});

// 3. Verificar módulos del bot
console.log('\n🔧 MÓDULOS DEL BOT:');
const modules = [
    'anticheat_analyzer_advanced.js',
    'repository_connector.js', 
    'stealth_cheatx_ai.js',
    'minimax_tts_direct.js'
];

modules.forEach(moduleName => {
    try {
        require(`./${moduleName}`);
        console.log(`  ✅ ${moduleName} - Cargado correctamente`);
    } catch (error) {
        console.log(`  ❌ ${moduleName} - Error: ${error.message}`);
    }
});

console.log('\n🎯 COMANDOS TTS DISPONIBLES:');
console.log('  💬 !speak [texto] - Convertir texto a voz');
console.log('  📢 !voices - Listar voces disponibles'); 
console.log('  🧪 !test-voice - Probar sistema TTS');
console.log('  🎤 !joinvc - Unirse al canal de voz');
console.log('  🔇 !leavevc - Salir del canal de voz');

console.log('\n🔍 ========================================================');
console.log('🚀 VERIFICACIÓN COMPLETADA');
console.log('📋 Si todas las pruebas pasaron, el bot está listo para usar');
console.log('🔧 Para iniciar el bot: node bot.js');
console.log('🔍 ========================================================');

setTimeout(() => {
    console.log('\n⏳ Las pruebas de API están ejecutándose...');
}, 1000);