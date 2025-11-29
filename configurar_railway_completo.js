#!/usr/bin/env node

/**
 * ================================================================
 * CONFIGURACIÓN COMPLETA DE RAILWAY - STEALTH-ANTICHEATX v3.0
 * Script automatizado para configurar todas las variables y dependencias
 * ================================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración principal
const CONFIG = {
    // Variables del bot
    botVariables: {
        DISCORD_BOT_TOKEN: 'MTQ0MTg3ODA3MjUwNzg5MTcyMg.GtM5hc.gCwZut05T36Cqm7YXtPXil-Qo2iCVDPuJFthmw',
        MINIMAX_API_KEY: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxlcyIsIlVzZXJOYW1lIjoic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxlc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0X5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA',
        BOT_OWNER_ID: '751601149928538224',
        CHAT_CHANNEL_ID: '1442266154516091020',
        CMD_CHANNEL_ID: '1441888236833210389',
        SUPPORT_CHANNEL_ID: '1442209840976887849',
        ANTICHEAT_WEBHOOK_URL: 'https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM',
        GITHUB_TOKEN: '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',
        RAILWAY_TOKEN: 'c5813d10-044e-49fe-bf85-362db75d9738',
        
        // Nuevas variables para funcionalidades avanzadas
        ENABLE_DLL_ANALYSIS: 'true',
        ENABLE_BYPASS_DETECTION: 'true',
        ENABLE_REPOSITORY_MONITORING: 'true',
        REPOSITORY_OWNER: 'xpe-hub',
        REPOSITORY_NAME: 'stealth-bot-nuevo',
        ANALYSIS_TIMEOUT: '30000',
        THREAT_CONFIDENCE_THRESHOLD: '70'
    },
    
    // Scripts de actualización
    updateScripts: {
        enable_repository_monitoring: 'ENABLE_REPOSITORY_MONITORING=true',
        enable_dll_analysis: 'ENABLE_DLL_ANALYSIS=true',
        enable_bypass_detection: 'ENABLE_BYPASS_DETECTION=true',
        set_analysis_timeout: 'ANALYSIS_TIMEOUT=30000',
        set_confidence_threshold: 'THREAT_CONFIDENCE_THRESHOLD=70'
    }
};

// Función para ejecutar comandos con retry
function executeCommand(command, description, retries = 3) {
    console.log(`\n🔄 ${description}...`);
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`   Intento ${attempt}/${retries}`);
            
            const result = execSync(command, { 
                encoding: 'utf8',
                stdio: 'pipe',
                timeout: 60000, // 1 minuto timeout
                env: { 
                    ...process.env, 
                    RAILWAY_TOKEN: CONFIG.botVariables.RAILWAY_TOKEN 
                }
            });
            
            console.log(`✅ ${description} - Éxito`);
            console.log(`   Output: ${result.trim().substring(0, 200)}...`);
            return { success: true, output: result, attempt };
            
        } catch (error) {
            console.log(`❌ Intento ${attempt} falló: ${error.message}`);
            
            if (attempt === retries) {
                console.log(`❌ ${description} - Falló después de ${retries} intentos`);
                return { success: false, error: error.message, attempt };
            }
            
            // Esperar antes del siguiente intento
            const waitTime = attempt * 2000;
            console.log(`   ⏳ Esperando ${waitTime}ms antes del siguiente intento...`);
            execSync(`sleep ${waitTime / 1000}`);
        }
    }
    
    return { success: false, error: 'Máximo número de intentos alcanzado' };
}

// Función para configurar variables usando diferentes métodos
async function configureVariables() {
    console.log('\n🔧 CONFIGURANDO VARIABLES DE ENTORNO');
    console.log('='.repeat(50));
    
    let successCount = 0;
    let errorCount = 0;
    const results = [];
    
    for (const [key, value] of Object.entries(CONFIG.botVariables)) {
        console.log(`\n🔑 Configurando ${key}...`);
        
        // Método 1: Railway CLI
        const cliResult = executeCommand(
            `railway variables --set "${key}=${value}"`,
            `CLI: ${key}`
        );
        
        if (cliResult.success) {
            successCount++;
            results.push({ variable: key, method: 'CLI', success: true });
            console.log(`✅ ${key} configurada vía CLI`);
            continue;
        }
        
        // Método 2: GraphQL API
        console.log(`🔄 Intentando GraphQL API para ${key}...`);
        try {
            const mutation = `
                mutation variableUpsert {
                    variableUpsert(
                        input: {
                            name: "${key}"
                            value: "${value}"
                            type: ENCRYPTED
                        }
                    ) {
                        id
                        name
                        value
                    }
                }
            `;
            
            const axios = require('axios');
            const response = await axios.post('https://backboard.railway.app/graphql/v2', {
                query: mutation
            }, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.botVariables.RAILWAY_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            if (response.data.data && response.data.data.variableUpsert) {
                successCount++;
                results.push({ variable: key, method: 'GraphQL', success: true });
                console.log(`✅ ${key} configurada vía GraphQL API`);
                continue;
            }
            
        } catch (graphqlError) {
            console.log(`❌ GraphQL API falló para ${key}: ${graphqlError.message}`);
        }
        
        // Método 3: Archivos de configuración temporal
        console.log(`🔄 Creando archivo de configuración para ${key}...`);
        try {
            const envFile = `.env.${key}`;
            fs.writeFileSync(envFile, `${key}=${value}\n`);
            
            const fileResult = executeCommand(
                `railway variables --env-file ${envFile}`,
                `Archivo: ${key}`
            );
            
            if (fileResult.success) {
                successCount++;
                results.push({ variable: key, method: 'Archivo', success: true });
                console.log(`✅ ${key} configurada vía archivo`);
                fs.unlinkSync(envFile); // Limpiar archivo temporal
            } else {
                throw new Error('Método de archivo también falló');
            }
            
        } catch (fileError) {
            errorCount++;
            results.push({ variable: key, method: 'Todos', success: false, error: fileError.message });
            console.log(`❌ Todos los métodos fallaron para ${key}`);
        }
    }
    
    return { successCount, errorCount, results };
}

// Función para desplegar el bot
async function deployBot() {
    console.log('\n🚀 DESPLEGANDO BOT');
    console.log('='.repeat(30));
    
    // Forzar deployment
    const deployResult = executeCommand(
        'railway up --detach',
        'Desplegando bot a Railway'
    );
    
    if (deployResult.success) {
        console.log('✅ Bot desplegado exitosamente');
        return true;
    } else {
        console.log('❌ Fallo en el deployment');
        return false;
    }
}

// Función para verificar estado
async function verifyStatus() {
    console.log('\n📊 VERIFICANDO ESTADO');
    console.log('='.repeat(30));
    
    // Estado del proyecto
    const statusResult = executeCommand('railway status', 'Estado del proyecto');
    if (statusResult.success) {
        console.log('📊 Estado del proyecto:');
        console.log(statusResult.output);
    }
    
    // Variables configuradas
    const variablesResult = executeCommand('railway variables', 'Variables configuradas');
    if (variablesResult.success) {
        console.log('🔑 Variables configuradas:');
        console.log(variablesResult.output);
    }
    
    // Logs recientes
    const logsResult = executeCommand('railway logs --deployment --limit 50', 'Logs de deployment');
    if (logsResult.success) {
        console.log('📝 Logs recientes:');
        console.log(logsResult.output);
    }
    
    return {
        status: statusResult.success,
        variables: variablesResult.success,
        logs: logsResult.success
    };
}

// Función principal de configuración
async function main() {
    console.log('🎯 CONFIGURACIÓN COMPLETA DE RAILWAY');
    console.log('Stealth-AntiCheatX v3.0 - Modo Avanzado');
    console.log('='.repeat(60));
    console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
    console.log(`🔑 Variables a configurar: ${Object.keys(CONFIG.botVariables).length}`);
    console.log(`🚀 Token Railway: ${CONFIG.botVariables.RAILWAY_TOKEN.substring(0, 8)}...`);
    console.log('='.repeat(60));
    
    try {
        // Paso 1: Verificar autenticación
        console.log('\n🔐 PASO 1: Verificando autenticación');
        const authResult = executeCommand('railway whoami', 'Verificando usuario Railway');
        if (!authResult.success) {
            throw new Error('No se pudo autenticar con Railway');
        }
        console.log(`👤 Usuario autenticado: ${authResult.output.trim()}`);
        
        // Paso 2: Verificar proyecto
        console.log('\n📋 PASO 2: Verificando proyecto');
        const projectResult = executeCommand('railway list', 'Listando proyectos');
        if (!projectResult.success) {
            throw new Error('No se pudo obtener la lista de proyectos');
        }
        console.log('📋 Proyectos disponibles:');
        console.log(projectResult.output);
        
        // Paso 3: Configurar variables
        console.log('\n⚙️ PASO 3: Configurando variables de entorno');
        const variableResults = await configureVariables();
        
        // Paso 4: Crear archivos de configuración adicionales
        console.log('\n📁 PASO 4: Creando archivos de configuración');
        
        // Crear package.json actualizado si no existe
        if (!fs.existsSync('package.json')) {
            const packageJson = {
                "name": "stealth-anticheatx",
                "version": "3.0.0",
                "description": "Stealth-AntiCheatX v3.0 - Sistema Avanzado de Detección",
                "main": "bot_completo.js",
                "scripts": {
                    "start": "node bot_completo.js",
                    "dev": "nodemon bot_completo.js",
                    "test": "node test_anticheat.js",
                    "analyze": "node analyze_dll.js",
                    "monitor": "node monitor_repository.js"
                },
                "dependencies": {
                    "axios": "^1.6.0",
                    "discord.js": "^14.15.3",
                    "dotenv": "^16.4.5"
                },
                "keywords": ["discord", "bot", "anticheat", "security", "detection"],
                "author": "MiniMax Agent",
                "license": "MIT"
            };
            fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
            console.log('✅ package.json creado');
        }
        
        // Crear scripts de utilidad
        const scriptsDir = './scripts';
        if (!fs.existsSync(scriptsDir)) {
            fs.mkdirSync(scriptsDir);
        }
        
        // Script de test
        const testScript = `
// Test del sistema anti-cheat
const { analyzeFileForDiscord } = require('./anticheat_analyzer_advanced.js');

async function testAntiCheat() {
    console.log('🧪 Probando sistema anti-cheat...');
    
    // Crear archivo de prueba
    const testContent = Buffer.from('Test DLL content with cheat patterns');
    const result = await analyzeFileForDiscord('test.dll', testContent);
    
    console.log('Resultado del test:', result);
    process.exit(0);
}

testAntiCheat().catch(console.error);
`;
        fs.writeFileSync(`${scriptsDir}/test_anticheat.js`, testScript);
        console.log('✅ Script de test creado');
        
        // Script de monitoreo
        const monitorScript = `
// Monitoreo del repositorio
const { getRepositoryStatusForDiscord } = require('./repository_connector.js');

async function monitorRepository() {
    console.log('👁️ Monitoreando repositorio...');
    
    const result = await getRepositoryStatusForDiscord();
    
    if (result.success) {
        console.log('✅ Estado del repositorio obtenido');
        console.log('📊 Embed generado para Discord');
    } else {
        console.log('❌ Error:', result.error);
    }
    
    process.exit(0);
}

monitorRepository().catch(console.error);
`;
        fs.writeFileSync(`${scriptsDir}/monitor_repository.js`, monitorScript);
        console.log('✅ Script de monitoreo creado');
        
        // Paso 5: Verificar instalación de dependencias
        console.log('\n📦 PASO 5: Verificando dependencias');
        const installResult = executeCommand('npm install --production', 'Instalando dependencias');
        if (installResult.success) {
            console.log('✅ Dependencias instaladas correctamente');
        } else {
            console.log('⚠️ Error en instalación, pero continuando...');
        }
        
        // Paso 6: Desplegar
        console.log('\n🚀 PASO 6: Desplegando bot');
        const deployed = await deployBot();
        
        // Paso 7: Verificar estado final
        console.log('\n🔍 PASO 7: Verificación final');
        const status = await verifyStatus();
        
        // Resumen final
        console.log('\n' + '='.repeat(70));
        console.log('📊 RESUMEN DE CONFIGURACIÓN');
        console.log('='.repeat(70));
        console.log(`✅ Variables configuradas: ${variableResults.successCount}`);
        console.log(`❌ Variables con errores: ${variableResults.errorCount}`);
        console.log(`📊 Total de variables: ${Object.keys(CONFIG.botVariables).length}`);
        console.log(`🚀 Bot desplegado: ${deployed ? 'Sí' : 'No'}`);
        console.log(`📡 Estado verificado: ${Object.values(status).filter(s => s).length}/3`);
        console.log('\n🎯 NUEVAS FUNCIONALIDADES HABILITADAS:');
        console.log('  • 🔬 Análisis avanzado de DLL');
        console.log('  • 🛡️ Detección de bypass techniques');
        console.log('  • 📡 Monitoreo automático del repositorio');
        console.log('  • ⚡ Sistema de confianza dinámico');
        console.log('  • 🧠 IA MiniMax completamente integrada');
        
        if (variableResults.errorCount === 0 && deployed) {
            console.log('\n🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!');
            console.log('🔄 Railway redeployará automáticamente...');
            console.log('⏰ El bot estará online en 2-5 minutos');
            console.log('🌐 Dashboard: https://railway.app/dashboard');
            console.log('\n💡 COMANDOS PARA PROBAR:');
            console.log('  • $ai <mensaje> - Chat con IA avanzada');
            console.log('  • $analyze <archivo> - Análisis anti-cheat');
            console.log('  • $status - Estado del sistema');
            console.log('  • $repository - Estado del repositorio');
        } else {
            console.log('\n⚠️ CONFIGURACIÓN COMPLETADA CON ADVERTENCIAS');
            console.log('🔧 Algunas variables pueden necesitar configuración manual');
            console.log('🌐 Visitar: https://railway.app/dashboard');
            console.log('📋 Manual: railway variables --set "VARIABLE=valor"');
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('🏁 Configuración finalizada');
        console.log('⏰ Timestamp:', new Date().toISOString());
        
    } catch (error) {
        console.error('\n❌ ERROR EN CONFIGURACIÓN:');
        console.error(error.message);
        console.error('\n🔧 SOLUCIONES POSIBLES:');
        console.error('1. Verificar token de Railway');
        console.error('2. Configurar variables manualmente en dashboard');
        console.error('3. Verificar conexión a internet');
        console.error('4. Revisar logs en Railway dashboard');
        process.exit(1);
    }
}

// Ejecutar configuración
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
}

module.exports = { CONFIG, executeCommand, main };