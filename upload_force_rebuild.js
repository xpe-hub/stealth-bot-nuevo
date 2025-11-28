const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';
const FILE_PATH = 'bot.js';

// Leer el archivo local
const fs = require('fs');
const filePath = '/workspace/stealth-bot-nuevo/bot.js';
const content = fs.readFileSync(filePath, 'utf8');

// Codificar a base64
const base64Content = Buffer.from(content, 'utf8').toString('base64');

async function updateGitHubFile() {
    return new Promise((resolve, reject) => {
        // Primero obtener SHA del archivo actual
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
                    
                    // Ahora actualizar el archivo
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
                        message: 'Force cache clear - Force rebuild with timestamp 2025-11-28 10:23:19',
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
                                console.log('✅ Archivo actualizado exitosamente!');
                                console.log('Commit SHA:', putResult.commit.sha);
                                resolve(putResult);
                            } catch (error) {
                                reject(new Error('Error parsing response: ' + error.message));
                            }
                        });
                    });

                    putReq.on('error', (error) => {
                        reject(error);
                    });

                    putReq.write(putData);
                    putReq.end();
                    
                } catch (error) {
                    reject(error);
                }
            });
        });

        getReq.on('error', (error) => {
            reject(error);
        });

        getReq.end();
    });
}

async function main() {
    try {
        console.log('🔄 Actualizando archivo en GitHub con timestamp para forzar limpieza de caché...');
        const result = await updateGitHubFile();
        console.log('✅ Actualización completada!');
        console.log(`📄 Total líneas: ${content.split('\n').length}`);
        console.log(`🔗 Commit: ${result.commit.sha}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();