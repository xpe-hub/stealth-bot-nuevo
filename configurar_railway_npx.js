#!/usr/bin/env node

/**
 * ================================================================
 * CONFIGURACIÓN AUTOMÁTICA CON NPX RAILWAY
 * Stealth-AntiCheatX v3.0 - Ejecuta configuración usando npx
 * ================================================================
 */

const { execSync } = require('child_process');
const fs = require('fs');
// const axios = require('axios'); // Removed for compatibility - using curl instead

// Configuración principal
const BOT_CONFIG = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    MINIMAX_API_KEY: process.env.MINIMAX_API_KEY,
    BOT_OWNER_ID: process.env.BOT_OWNER_ID,
    CHAT_CHANNEL_ID: process.env.CHAT_CHANNEL_ID,
    CMD_CHANNEL_ID: process.env.CMD_CHANNEL_ID,
    SUPPORT_CHANNEL_ID: process.env.SUPPORT_CHANNEL_ID,
    ANTICHEAT_WEBHOOK_URL: process.env.ANTICHEAT_WEBHOOK_URL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    RAILWAY_TOKEN: process.env.RAILWAY_TOKEN,
    
    // Variables para funcionalidades avanzadas
    ENABLE_DLL_ANALYSIS: 'true',
    ENABLE_BYPASS_DETECTION: 'true',
    ENABLE_REPOSITORY_MONITORING: 'true',
    REPOSITORY_OWNER: 'xpe-hub',
    REPOSITORY_NAME: 'stealth-bot-nuevo',
    ANALYSIS_TIMEOUT: '30000',
    THREAT_CONFIDENCE_THRESHOLD: '70'
};

// Función para ejecutar comandos Railway con npx
function runRailwayCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    
    try {
        const fullCommand = `npx @railway/cli ${command}`;
        const result = execSync(fullCommand, { 
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env, RAILWAY_TOKEN: BOT_CONFIG.RAILWAY_TOKEN }
        });
        
        console.log(`✅ ${description} - Éxito`);
        return { success: true, output: result };
        
    } catch (error) {
        console.log(`❌ ${description} - Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Función para configurar variables usando GraphQL API
async function setVariableViaGraphQL(name, value) {
    try {
        const mutation = `{"query":"mutation variableUpsert { variableUpsert(input: { name: \\"${name}\\", value: \\"${value}\\" }) { id name }}"}`;
        
        const curlCommand = `curl -X POST https://backboard.railway.app/graphql/v2 -H "Authorization: Bearer ${BOT_CONFIG.RAILWAY_TOKEN}" -H "Content-Type: application/json" -d '${mutation}'`;
        
        const result = execSync(curlCommand, { 
            encoding: 'utf8',
            timeout: 15000 
        });
        
        // Parsear respuesta JSON
        const response = JSON.parse(result);
        return response.data?.variableUpsert ? true : false;
        
    } catch (error) {
        console.warn(`⚠️ GraphQL falló para ${name}: ${error.message}`);
        return false;
    }
}

// Función principal de configuración
async function configureRailway() {
    console.log('🚀 CONFIGURACIÓN AUTOMÁTICA DE RAILWAY');
    console.log('Stealth-AntiCheatX v3.0 - Con npx Railway CLI');
    console.log('='.repeat(60));
    console.log(`📅 ${new Date().toLocaleString()}`);
    console.log(`🔑 Variables: ${Object.keys(BOT_CONFIG).length}`);
    console.log(`🎯 Token: ${BOT_CONFIG.RAILWAY_TOKEN.substring(0, 8)}...`);
    console.log('='.repeat(60));
    
    try {
        // Paso 1: Verificar autenticación
        console.log('\n🔐 PASO 1: Verificando Railway CLI y autenticación');
        
        const versionResult = runRailwayCommand('--version', 'Verificando Railway CLI');
        if (!versionResult.success) {
            throw new Error('No se pudo verificar Railway CLI');
        }
        console.log(`📋 Versión CLI: ${versionResult.output.trim()}`);
        
        const whoamiResult = runRailwayCommand('whoami', 'Verificando usuario');
        if (!whoamiResult.success) {
            throw new Error('No se pudo autenticar con Railway');
        }
        console.log(`👤 Usuario: ${whoamiResult.output.trim()}`);
        
        // Paso 2: Listar proyectos
        console.log('\n📋 PASO 2: Listando proyectos');
        const listResult = runRailwayCommand('list', 'Listando proyectos');
        if (!listResult.success) {
            throw new Error('No se pudieron listar proyectos');
        }
        console.log('📋 Proyectos encontrados:');
        console.log(listResult.output);
        
        // Paso 3: Obtener estado
        console.log('\n📊 PASO 3: Obteniendo estado del proyecto');
        const statusResult = runRailwayCommand('status', 'Estado del proyecto');
        if (statusResult.success) {
            console.log('📊 Estado actual:');
            console.log(statusResult.output);
        }
        
        // Paso 4: Configurar variables
        console.log('\n⚙️ PASO 4: Configurando variables de entorno');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const [key, value] of Object.entries(BOT_CONFIG)) {
            console.log(`\n🔑 Configurando ${key}...`);
            
            // Intentar con CLI primero
            const cliResult = runRailwayCommand(
                `variables --set "${key}=${value}"`,
                `CLI: ${key}`
            );
            
            if (cliResult.success) {
                successCount++;
                console.log(`✅ ${key} configurada vía CLI`);
                continue;
            }
            
            // Si CLI falla, intentar GraphQL
            console.log(`🔄 Probando GraphQL API para ${key}...`);
            const graphqlSuccess = await setVariableViaGraphQL(key, value);
            
            if (graphqlSuccess) {
                successCount++;
                console.log(`✅ ${key} configurada vía GraphQL`);
            } else {
                errorCount++;
                console.log(`❌ Error configurando ${key}`);
            }
        }
        
        // Paso 5: Verificar variables configuradas
        console.log('\n🔍 PASO 5: Verificando variables');
        const verifyResult = runRailwayCommand('variables', 'Verificando variables');
        if (verifyResult.success) {
            console.log('📋 Variables en Railway:');
            console.log(verifyResult.output);
        }
        
        // Paso 6: Desplegar
        console.log('\n🚀 PASO 6: Desplegando bot');
        const deployResult = runRailwayCommand('up --detach', 'Desplegando bot');
        
        if (deployResult.success) {
            console.log('✅ Bot desplegado exitosamente');
        } else {
            console.log('⚠️ Deployment con advertencias');
        }
        
        // Paso 7: Obtener logs
        console.log('\n📝 PASO 7: Obteniendo logs');
        const logsResult = runRailwayCommand('logs --deployment --limit 30', 'Logs de deployment');
        if (logsResult.success) {
            console.log('📝 Logs recientes:');
            console.log(logsResult.output);
        }
        
        // Resumen final
        console.log('\n' + '='.repeat(70));
        console.log('📊 RESUMEN DE CONFIGURACIÓN');
        console.log('='.repeat(70));
        console.log(`✅ Variables configuradas: ${successCount}`);
        console.log(`❌ Variables con errores: ${errorCount}`);
        console.log(`📊 Total: ${Object.keys(BOT_CONFIG).length}`);
        console.log(`🚀 Desplegado: ${deployResult.success ? 'Sí' : 'Parcial'}`);
        
        if (errorCount === 0 && deployResult.success) {
            console.log('\n🎉 ¡CONFIGURACIÓN EXITOSA!');
            console.log('🔄 Railway redeployará automáticamente...');
            console.log('⏰ Bot online en 2-5 minutos');
            console.log('🌐 Dashboard: https://railway.app/dashboard');
            
            console.log('\n🆕 NUEVAS FUNCIONALIDADES HABILITADAS:');
            console.log('  • 🔬 Análisis avanzado de DLL');
            console.log('  • 🛡️ Detección de bypass techniques');
            console.log('  • 📡 Monitoreo del repositorio');
            console.log('  • ⚡ IA MiniMax completamente integrada');
            
        } else {
            console.log('\n⚠️ CONFIGURACIÓN CON ADVERTENCIAS');
            console.log('🔧 Variables pueden necesitar configuración manual');
        }
        
        console.log('\n💡 COMANDOS PARA PROBAR:');
        console.log('  • $ai <mensaje> - Chat con IA avanzada');
        console.log('  • $analyze <archivo> - Análisis anti-cheat');
        console.log('  • $status - Estado del sistema');
        console.log('  • $repository - Estado del repositorio');
        
        return {
            success: true,
            configured: successCount,
            errors: errorCount,
            deployed: deployResult.success
        };
        
    } catch (error) {
        console.error('\n❌ ERROR CRÍTICO:', error.message);
        console.error('\n🔧 SOLUCIONES:');
        console.error('1. Verificar token Railway');
        console.error('2. Configurar manualmente en dashboard');
        console.error('3. Usar comandos Railway CLI');
        console.error('4. Revisar logs en Railway');
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Función para generar guía manual
function generateManualGuide() {
    console.log('\n📋 GUÍA MANUAL PARA CONFIGURACIÓN EN RAILWAY');
    console.log('='.repeat(50));
    
    console.log('\n🔐 PASO 1: Acceder a Railway Dashboard');
    console.log('  • Ir a: https://railway.app/dashboard');
    console.log('  • Iniciar sesión con tu cuenta');
    
    console.log('\n📋 PASO 2: Seleccionar Proyecto');
    console.log('  • Buscar proyecto: stealth-anticheatx');
    console.log('  • Hacer clic en el proyecto');
    
    console.log('\n⚙️ PASO 3: Configurar Variables');
    console.log('  • Ir a Variables tab en el proyecto');
    console.log('  • Agregar las siguientes variables:');
    
    for (const [key, value] of Object.entries(BOT_CONFIG)) {
        const masked = key.includes('TOKEN') ? `${value.substring(0, 8)}...` : value;
        console.log(`    • ${key}: ${masked}`);
    }
    
    console.log('\n🚀 PASO 4: Redeployar');
    console.log('  • Railway redeployará automáticamente');
    console.log('  • O usar botón "Redeploy" en dashboard');
    
    console.log('\n🔍 PASO 5: Verificar Estado');
    console.log('  • Ir a Logs tab para ver deployment');
    console.log('  • Verificar que no hay errores');
    console.log('  • El bot estará online en 2-5 minutos');
    
    console.log('\n💡 COMANDOS PARA PROBAR:');
    console.log('  • $ai <mensaje> - Chat con IA');
    console.log('  • $status - Estado del bot');
    console.log('  • $help - Lista de comandos');
}

// Ejecutar configuración principal
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--manual') || args.includes('-m')) {
        generateManualGuide();
        return;
    }
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log('Usage: node configurar_railway_npx.js [opciones]');
        console.log('Opciones:');
        console.log('  --manual, -m    Generar guía manual');
        console.log('  --help, -h      Mostrar ayuda');
        return;
    }
    
    // Configuración automática
    const result = await configureRailway();
    
    if (!result.success) {
        console.log('\n❌ Configuración automática falló');
        console.log('💡 Usa --manual para guía paso a paso');
        process.exit(1);
    }
}

// Ejecutar script
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
}

module.exports = { BOT_CONFIG, configureRailway, generateManualGuide };