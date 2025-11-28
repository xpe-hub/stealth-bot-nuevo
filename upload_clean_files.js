const https = require('https');
const fs = require('fs');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

const files = [
    {
        path: 'nixpacks.toml',
        description: 'Configuración modificada para usar bot_test.js'
    },
    {
        path: 'bot_test.js',
        description: 'Archivo de bot completamente nuevo y limpio'
    }
];

async function uploadFile(filePath) {
    return new Promise((resolve, reject) => {
        const fullPath = '/workspace/stealth-bot-nuevo/' + filePath;
        const content = fs.readFileSync(fullPath, 'utf8');
        const base64Content = Buffer.from(content, 'utf8').toString('base64');

        // Obtener SHA actual
        const getOptions = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
            method: 'GET',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'Railway-Deploy-Bot',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const getReq = https.request(getOptions, (getRes) => {
            let data = '';
            getRes.on('data', (chunk) => data += chunk);
            getRes.on('end', () => {
                try {
                    let currentSha = null;
                    try {
                        const response = JSON.parse(data);
                        currentSha = response.sha;
                    } catch (e) {
                        // Archivo nuevo, no hay SHA
                    }
                    
                    // Subir archivo
                    const putOptions = {
                        hostname: 'api.github.com',
                        path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
                        method: 'PUT',
                        headers: {
                            'Authorization': `token ${GITHUB_TOKEN}`,
                            'User-Agent': 'Railway-Deploy-Bot',
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        }
                    };

                    const putData = JSON.stringify({
                        message: 'CLEAN BUILD: Use bot_test.js - completely new clean file 2025-11-28 12:18:17',
                        content: base64Content,
                        branch: BRANCH,
                        ...(currentSha && { sha: currentSha })
                    });

                    const putReq = https.request(putOptions, (putRes) => {
                        let putResponse = '';
                        putRes.on('data', (chunk) => putResponse += chunk);
                        putRes.on('end', () => {
                            try {
                                const putResult = JSON.parse(putResponse);
                                console.log(`✅ ${filePath} subido exitosamente`);
                                console.log(`📏 Tamaño: ${content.length} chars`);
                                console.log(`🔗 Commit: ${putResult.commit.sha.substring(0, 8)}`);
                                resolve(putResult);
                            } catch (error) {
                                reject(new Error('Error parsing upload response: ' + error.message));
                            }
                        });
                    });

                    putReq.on('error', (error) => reject(error));
                    putReq.write(putData);
                    putReq.end();
                    
                } catch (error) {
                    reject(error);
                }
            });
        });

        getReq.on('error', (error) => reject(error));
        getReq.end();
    });
}

async function uploadCleanFiles() {
    try {
        console.log('🧽 SUBIENDO ARCHIVOS COMPLETAMENTE LIMPIOS...');
        console.log('🎯 Objetivo: Forzar Railway a usar archivo de prueba sin errores');
        console.log('⏰ Timestamp: 2025-11-28 12:18:17');
        console.log('');
        
        for (const file of files) {
            console.log(`📤 Subiendo ${file.path}...`);
            await uploadFile(file.path);
            console.log('');
        }
        
        console.log('🎉 ¡ARCHIVOS LIMPIOS SUBIDOS!');
        console.log('✅ Railway debería usar bot_test.js completamente nuevo');
        console.log('🧹 Sin caché corrupto - archivo 100% limpio');
        console.log('📄 Comandos disponibles: $ping, $help, $info, $test');
        console.log('\n⏳ Espera 2-3 minutos para que Railway haga rebuild');
        console.log('🔍 Si funciona, sabremos que el problema era el archivo bot.js corrupto');
        
    } catch (error) {
        console.error('❌ Error durante la subida:', error.message);
    }
}

uploadCleanFiles();