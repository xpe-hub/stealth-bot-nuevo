const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';
const FILE_PATH = 'bot.js';

// Leer archivo restaurado
const fs = require('fs');
const filePath = '/workspace/stealth-bot-nuevo/bot.js';
const content = fs.readFileSync(filePath, 'utf8');

// Codificar a base64
const base64Content = Buffer.from(content, 'utf8').toString('base64');

async function uploadRestoredFile() {
    return new Promise((resolve, reject) => {
        // Obtener SHA actual
        const getOptions = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
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
                    const response = JSON.parse(data);
                    const currentSha = response.sha;
                    
                    console.log(`📄 Archivo actual en GitHub: ${response.size} bytes, ${response.name}`);
                    
                    // Subir archivo restaurado
                    const putOptions = {
                        hostname: 'api.github.com',
                        path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
                        method: 'PUT',
                        headers: {
                            'Authorization': `token ${GITHUB_TOKEN}`,
                            'User-Agent': 'Railway-Deploy-Bot',
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        }
                    };

                    const putData = JSON.stringify({
                        message: 'RESTAURACIÓN COMPLETA: Restaurar archivo bot.js completo (1984 líneas) - Eliminar corrupción y forzar rebuild 2025-11-28 10:23:19',
                        content: base64Content,
                        branch: BRANCH,
                        sha: currentSha
                    });

                    const putReq = https.request(putOptions, (putRes) => {
                        let putResponse = '';
                        putRes.on('data', (chunk) => putResponse += chunk);
                        putRes.on('end', () => {
                            try {
                                const putResult = JSON.parse(putResponse);
                                console.log('✅ ¡ARCHIVO RESTAURADO EXITOSAMENTE!');
                                console.log('📊 Líneas en archivo restaurado:', content.split('\n').length);
                                console.log('🔗 Commit SHA:', putResult.commit.sha);
                                console.log('📏 Tamaño en GitHub:', putResult.content.size, 'bytes');
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

async function main() {
    try {
        console.log('🔄 Subiendo archivo RESTAURADO a GitHub...');
        console.log('📊 Archivo local:', content.split('\n').length, 'líneas');
        console.log('📏 Tamaño local:', Buffer.byteLength(content, 'utf8'), 'bytes');
        
        const result = await uploadRestoredFile();
        console.log('\n🎉 ¡RESTAURACIÓN COMPLETADA!');
        console.log('✅ Railway debería reconstruir con el archivo completo en 2-3 minutos');
        
    } catch (error) {
        console.error('❌ Error durante la restauración:', error.message);
    }
}

main();