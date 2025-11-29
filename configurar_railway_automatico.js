#!/usr/bin/env node

/**
 * Script automático para configurar las variables de entorno del bot en Railway
 * Utiliza Railway CLI para configurar todas las variables necesarias
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Variables de configuración del bot
const botVariables = {
    DISCORD_BOT_TOKEN: 'MTQ0MTg3ODA3MjUwNzg5MTcyMg.GtM5hc.gCwZut05T36Cqm7YXtPXil-Qo2iCVDPuJFthmw',
    MINIMAX_API_KEY: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxlcyIsIlVzZXJOYW1lIjoic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxlc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0X5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA',
    BOT_OWNER_ID: '751601149928538224',
    CHAT_CHANNEL_ID: '1442266154516091020',
    CMD_CHANNEL_ID: '1441888236833210389',
    SUPPORT_CHANNEL_ID: '1442209840976887849',
    ANTICHEAT_WEBHOOK_URL: 'https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM'
};

// Configuración de Railway
const RAILWAY_TOKEN = 'c5813d10-044e-49fe-bf85-362db75d9738';

// Función para ejecutar comandos Railway
function runRailwayCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    try {
        const result = execSync(command, { 
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env, RAILWAY_TOKEN }
        });
        console.log(`✅ ${description} - Éxito`);
        return result;
    } catch (error) {
        console.log(`❌ ${description} - Error: ${error.message}`);
        return null;
    }
}

// Función principal
async function main() {
    console.log('🚀 Iniciando configuración automática de Railway...\n');
    
    // Paso 1: Verificar autenticación
    console.log('📋 Paso 1: Verificando autenticación con Railway...');
    const whoamiResult = runRailwayCommand('railway whoami', 'Verificando usuario autenticado');
    if (!whoamiResult) {
        console.log('\n❌ Error: No se pudo autenticar con Railway');
        console.log('Asegúrate de que el token RAILWAY_TOKEN esté correcto.');
        process.exit(1);
    }
    console.log(`👤 Usuario: ${whoamiResult.trim()}`);

    // Paso 2: Listar proyectos
    console.log('\n📋 Paso 2: Listando proyectos disponibles...');
    const listResult = runRailwayCommand('railway list', 'Listando proyectos');
    if (!listResult) {
        console.log('\n❌ Error: No se pudieron obtener los proyectos');
        process.exit(1);
    }
    console.log('📋 Proyectos encontrados:');
    console.log(listResult);

    // Paso 3: Obtener estado del proyecto actual
    console.log('\n📋 Paso 3: Obteniendo estado del proyecto...');
    const statusResult = runRailwayCommand('railway status', 'Obteniendo estado del proyecto');
    if (statusResult) {
        console.log('📊 Estado del proyecto:');
        console.log(statusResult);
    }

    // Paso 4: Configurar variables de entorno
    console.log('\n📋 Paso 4: Configurando variables de entorno...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [key, value] of Object.entries(botVariables)) {
        console.log(`\n🔧 Configurando ${key}...`);
        
        // Configurar variable usando Railway CLI
        const setResult = runRailwayCommand(
            `railway variables --set "${key}=${value}"`,
            `Configurando ${key}`
        );
        
        if (setResult) {
            successCount++;
            console.log(`✅ ${key} configurada correctamente`);
        } else {
            errorCount++;
            console.log(`❌ Error al configurar ${key}`);
            
            // Intentar método alternativo usando GraphQL API
            console.log(`🔄 Intentando método alternativo para ${key}...`);
            try {
                const axios = require('axios');
                
                const mutation = `
                    mutation variableUpsert {
                        variableUpsert(
                            input: {
                                name: "${key}"
                                value: "${value}"
                            }
                        )
                    }
                `;
                
                const response = await axios.post('https://backboard.railway.app/graphql/v2', {
                    query: mutation
                }, {
                    headers: {
                        'Authorization': `Bearer ${RAILWAY_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data.data.variableUpsert) {
                    console.log(`✅ ${key} configurada via API GraphQL`);
                    successCount++;
                    errorCount--;
                }
            } catch (graphqlError) {
                console.log(`❌ Error en API GraphQL para ${key}: ${graphqlError.message}`);
            }
        }
    }

    // Paso 5: Verificar variables configuradas
    console.log('\n📋 Paso 5: Verificando variables configuradas...');
    const verifyResult = runRailwayCommand('railway variables', 'Verificando variables configuradas');
    if (verifyResult) {
        console.log('📋 Variables actuales en Railway:');
        console.log(verifyResult);
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE CONFIGURACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Variables configuradas exitosamente: ${successCount}`);
    console.log(`❌ Variables con errores: ${errorCount}`);
    console.log(`📊 Total de variables: ${Object.keys(botVariables).length}`);
    
    if (errorCount === 0) {
        console.log('\n🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('🔄 Railway redeployará automáticamente el bot...');
        console.log('⏰ El bot debería estar online en 2-5 minutos');
        console.log('\n💡 Tip: Puedes verificar el estado en https://railway.app');
    } else {
        console.log('\n⚠️  CONFIGURACIÓN COMPLETADA CON ERRORES');
        console.log('🔧 Algunas variables necesitan configuración manual en Railway dashboard');
        console.log('🌐 Visit: https://railway.app/dashboard para configurar manualmente');
    }
    
    console.log('\n' + '='.repeat(60));
}

// Ejecutar script principal
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Error inesperado:', error);
        process.exit(1);
    });
}

module.exports = { runRailwayCommand, botVariables };