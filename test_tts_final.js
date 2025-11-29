// ========================================================
// PRUEBA FINAL TTS - USANDO LA CONFIGURACIÓN CORRECTA
// Stealth-AntiCheatX v3.0 - IA AUTÓNOMA CON VOZ
// ========================================================

// Simular dotenv con variables reales
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
// FUNCIÓN TTS CON CONFIGURACIÓN CORREGIDA
// ========================================================

async function testTTSCorrect() {
    const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
    
    if (!MINIMAX_API_KEY) {
        throw new Error('MINIMAX_API_KEY no configurada');
    }
    
    console.log('🔧 PROBANDO DIFERENTES CONFIGURACIONES DE API...\n');
    
    // Lista de posibles endpoints y configuraciones
    const configurations = [
        {
            name: 'Configuración 1: api.minimaxi.chat con Bearer',
            url: 'https://api.minimaxi.chat/v1/t2a_v2',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            }
        },
        {
            name: 'Configuración 2: api.minimax.io con Bearer',
            url: 'https://api.minimax.io/v1/text_to_speech',
            headers: {
                'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                'Content-Type': 'application/json'
            }
        },
        {
            name: 'Configuración 3: api.minimax.io con x-api-key',
            url: 'https://api.minimax.io/v1/text_to_speech',
            headers: {
                'x-api-key': MINIMAX_API_KEY,
                'Content-Type': 'application/json'
            }
        }
    ];
    
    const testData = {
        text: '¡Hola! Soy Stealth-AntiCheatX v3.0 con IA autónoma.',
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
    };
    
    for (const config of configurations) {
        console.log(`🧪 ${config.name}`);
        console.log(`   📡 URL: ${config.url}`);
        console.log(`   🔑 Headers: ${JSON.stringify(config.headers).substring(0, 50)}...`);
        
        try {
            const response = await fetch(config.url, {
                method: 'POST',
                headers: config.headers,
                body: JSON.stringify(testData)
            });
            
            console.log(`   📊 Status: ${response.status}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log('   ✅ ÉXITO! API respondiendo correctamente');
                console.log(`   📋 Respuesta: ${JSON.stringify(result).substring(0, 100)}...`);
                
                // Guardar configuración exitosa
                return { success: true, config, result };
                
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Error: ${response.status} - ${errorText.substring(0, 100)}...`);
            }
            
        } catch (error) {
            console.log(`   🚫 Error de red: ${error.message}`);
        }
        
        console.log(''); // Línea en blanco
    }
    
    return { success: false, error: 'Ninguna configuración funcionó' };
}

// ========================================================
// FUNCIÓN PARA DECODIFICAR JWT Y VER SU ESTRUCTURA
// ========================================================

function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        console.log('🔍 ESTRUCTURA DEL JWT:');
        console.log(`   👤 User: ${payload.UserName || payload.username || 'N/A'}`);
        console.log(`   🏢 Group: ${payload.GroupName || payload.group || 'N/A'}`);
        console.log(`   🆔 ISS: ${payload.iss || 'N/A'}`);
        console.log(`   📧 Mail: ${payload.Mail || payload.email || 'N/A'}`);
        console.log(`   📅 Created: ${payload.CreateTime || payload.created_at || 'N/A'}`);
        
        return payload;
    } catch (error) {
        return null;
    }
}

// ========================================================
// FUNCIÓN PRINCIPAL
// ========================================================

async function runFinalTest() {
    console.log('🔍 ========================================================');
    console.log('🎤 PRUEBA FINAL TTS - STEALTH-ANTICHEATX v3.0');
    console.log('🔍 ========================================================');
    
    // 1. Decodificar JWT para ver estructura
    console.log('\n🔍 ANÁLISIS DEL TOKEN JWT:');
    const jwtPayload = decodeJWT(process.env.MINIMAX_API_KEY);
    
    // 2. Probar TTS con diferentes configuraciones
    console.log('\n🎯 PROBANDO CONFIGURACIONES TTS:');
    const result = await testTTSCorrect();
    
    // 3. Resumen final
    console.log('\n📊 RESUMEN DE RESULTADOS:');
    if (result.success) {
        console.log('✅ TTS FUNCIONANDO CORRECTAMENTE');
        console.log(`🎉 Configuración exitosa: ${result.config.name}`);
        console.log('🗣️ El bot puede convertir texto a voz');
        console.log('🤖 Sistema de IA autónoma listo');
        
        console.log('\n🎯 COMANDOS TTS LISTOS PARA USAR EN DISCORD:');
        console.log('   💬 !speak [mensaje] - Convertir texto a voz');
        console.log('   📢 !voices - Ver voces disponibles');
        console.log('   🧪 !test-voice - Probar sistema TTS');
        console.log('   🎤 !joinvc - Unirse al canal de voz');
        console.log('   🔇 !leavevc - Salir del canal de voz');
        
    } else {
        console.log('❌ TTS NO FUNCIONA');
        console.log('🔧 Posibles soluciones:');
        console.log('   1. Verificar que MINIMAX_API_KEY sea válida');
        console.log('   2. Revisar permisos de la API key');
        console.log('   3. Confirmar endpoint correcto de MiniMax');
        console.log('   4. Verificar formato del header Authorization');
    }
    
    console.log('\n🔍 ========================================================');
}

// Ejecutar prueba
runFinalTest().catch(console.error);