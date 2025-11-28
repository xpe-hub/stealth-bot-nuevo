const https = require('https');
const fs = require('fs');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

const files = [
    {
        path: '.gitignore',
        description: '.gitignore con timestamp para forzar rebuild'
    },
    {
        path: 'railway_cache_clear.txt',
        description: 'Archivo temporal para forzar cache clear'
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
                        message: 'FORCE RAILWAY REBUILD - Cache clear timestamp 2025-11-28 10:32:21',
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
                                console.log(`📏 Tamaño: ${base64Content.length} bytes (base64)`);
                                console.log(`🔗 Commit: ${putResult.commit.sha}`);
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

async function uploadMultipleFiles() {
    try {
        console.log('🚀 Subiendo múltiples archivos para forzar rebuild completo de Railway...');
        console.log('📅 Timestamp: 2025-11-28 10:32:21');
        console.log('');
        
        for (const file of files) {
            console.log(`📤 Subiendo ${file.path}...`);
            await uploadFile(file.path);
            console.log('');
        }
        
        console.log('🎉 ¡TODOS LOS ARCHIVOS SUBIDOS EXITOSAMENTE!');
        console.log('✅ Railway debería hacer rebuild completo en 2-3 minutos');
        console.log('✅ Esto debería eliminar el caché y usar el archivo correcto');
        
    } catch (error) {
        console.error('❌ Error durante la subida:', error.message);
    }
}

uploadMultipleFiles();