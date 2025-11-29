// ========================================================
// PRUEBA ESPECÍFICA TTS - USANDO LA MISMA IMPLEMENTACIÓN
// Stealth-AntiCheatX v3.0 - IA AUTÓNOMA CON VOZ
// ========================================================

// Simular dotenv para evitar problemas de dependencias
process.env = {
    ...process.env,
    DISCORD_BOT_TOKEN: "MTQ0MTg3ODA3MjUwNzg5MTcyMg.GtM5hc.gCwZut05T36Cqm7YXtPXil-Qo2iCVDPuJFthmw",
    MINIMAX_API_KEY: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxlc3IiLCJVc2VyTmFtZSI6InN0ZWFsdGgtbWFuYWdlci1haSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg4NDY4ODI5OTk4MTc3ODMxOCIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE5ODg0Njg4Mjk5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxlc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0X5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA",
    BOT_OWNER_ID: "751601149928538224",
    CHAT_CHANNEL_ID: "1442266154516091020",
    CMD_CHANNEL_ID: "1441888236833210389"
};

// Usar fetch nativo de Node.js 18+
const fetch = global.fetch || require('node-fetch');

// ========================================================
// IMPLEMENTACIÓN TTS EXACTA DEL MÓDULO
// ========================================================

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const TTS_API_URL = 'https://api.minimaxi.chat/v1/t2a_v2';

async function textToSpeechTest(text, options = {}) {
    if (!MINIMAX_API_KEY) {
        throw new Error('MINIMAX_API_KEY no está configurada');
    }

    const defaultOptions = {
        text: text,
        voice_setting: {
            voice_id: 'male-qn-qingse',  // Voz masculina por defecto
            speed: 1.0,                  // Velocidad normal
            vol: 1.0,                    // Volumen normal
            pitch: 0,                    // Pitch normal
            audio_sample_rate: 32000,    // 32kHz
            bitrate: 128000,             // 128kbps
            format: 'mp3'                // Formato MP3
        },
        language_boost: 'auto',          // Auto-detección
        emotion: 'happy',                // Emoción alegre
        pitch_setting: {
            enable: true
        }
    };

    const config = { ...defaultOptions, ...options };
    
    try {
        console.log(`🗣️ TTS API: "${text.substring(0, 50)}..."`);
        
        const response = await fetch(TTS_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        if (result.base_resp && result.base_resp.status_code !== 0) {
            throw new Error(`MiniMax API Error: ${result.base_resp.status_msg}`);
        }

        console.log('✅ TTS Generado exitosamente');
        console.log('📁 Archivo de audio:', result.audio_file || 'N/A');
        console.log('🎵 Formato:', result.format || 'N/A');
        
        return result;
        
    } catch (error) {
        console.error('❌ Error en TTS:', error.message);
        throw error;
    }
}

// ========================================================
// FUNCIÓN PRINCIPAL DE PRUEBA
// ========================================================

async function runTTSTest() {
    console.log('🔍 ========================================================');
    console.log('🗣️ PRUEBA ESPECÍFICA TTS - STEALTH-ANTICHEATX');
    console.log('🔍 ========================================================');
    
    console.log('\n📋 CONFIGURACIÓN:');
    console.log('  🔑 MINIMAX_API_KEY:', MINIMAX_API_KEY ? '✅ Configurada' : '❌ No configurada');
    console.log('  🌐 API URL:', TTS_API_URL);
    
    if (!MINIMAX_API_KEY) {
        console.log('\n❌ ERROR: MINIMAX_API_KEY no está configurada');
        console.log('🔧 Solución: Configurar la variable en Railway');
        return;
    }
    
    console.log('\n🎯 EJECUTANDO PRUEBA TTS...');
    
    try {
        const result = await textToSpeechTest('¡Hola! Soy Stealth-AntiCheatX v3.0. Mi sistema de IA autónoma está funcionando correctamente y listo para acompañarte en conversaciones por voz.');
        
        console.log('\n✅ PRUEBA TTS EXITOSA');
        console.log('🎉 El sistema de voz está completamente funcional');
        
        console.log('\n📋 DETALLES DE LA RESPUESTA:');
        console.log('  📄 Respuesta completa:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.log('\n❌ PRUEBA TTS FALLÓ');
        console.log('🔧 Error:', error.message);
        
        if (error.message.includes('401') || error.message.includes('403')) {
            console.log('🔑 POSIBLE SOLUCIÓN: Verificar MINIMAX_API_KEY');
        } else if (error.message.includes('404')) {
            console.log('🌐 POSIBLE SOLUCIÓN: Verificar URL de la API');
        } else if (error.message.includes('timeout')) {
            console.log('⏱️ POSIBLE SOLUCIÓN: Problema de conectividad');
        }
    }
    
    console.log('\n🔍 ========================================================');
    console.log('🎯 COMANDOS DEL BOT LISTOS PARA USAR:');
    console.log('  💬 !speak [mensaje] - Convertir texto a voz');
    console.log('  📢 !voices - Ver voces disponibles'); 
    console.log('  🧪 !test-voice - Probar sistema TTS');
    console.log('🔍 ========================================================');
}

// Ejecutar prueba
runTTSTest().catch(console.error);