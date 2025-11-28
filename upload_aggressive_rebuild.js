const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';
const FILE_PATH = 'nixpacks.toml';

// Leer archivo modificado
const fs = require('fs');
const filePath = '/workspace/stealth-bot-nuevo/nixpacks.toml';
const content = fs.readFileSync(filePath, 'utf8');

// Codificar a base64
const base64Content = Buffer.from(content, 'utf8').toString('base64');

async function uploadConfigFile() {
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
                    
                    console.log(`📄 nixpacks.toml actual: ${response.size} bytes`);
                    console.log(`🔗 SHA actual: ${currentSha.substring(0, 8)}`);
                    
                    // Subir archivo modificado
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
                        message: 'AGGRESSIVE REBUILD: Modify nixpacks.toml to force complete cache clear 2025-11-28 12:01:26',
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
                                console.log('✅ ¡CONFIGURACIÓN ACTUALIZADA!');
                                console.log('🔧 nixpacks.toml modificado exitosamente');
                                console.log('🔗 Commit SHA:', putResult.commit.sha);
                                console.log('📏 Nuevo tamaño:', putResult.content.size, 'bytes');
                                console.log('\n🚨 AGGRESSIVE REBUILD INICIADO');
                                console.log('✅ Railway detectará cambio en configuración de build');
                                console.log('🧹 Fuerza limpieza completa de caché');
                                console.log('⚡ Debería usar el archivo bot.js correcto');
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
        console.log('🔧 Modificando nixpacks.toml para forzar rebuild agresivo...');
        console.log('⏰ Timestamp: 2025-11-28 12:01:26');
        console.log('');
        
        await uploadConfigFile();
        
    } catch (error) {
        console.error('❌ Error durante la modificación:', error.message);
    }
}

main();