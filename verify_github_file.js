const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

async function verifyUploadedFile() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/bot.js?ref=${BRANCH}`,
            method: 'GET',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'Railway-Deploy-Bot',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('📊 Verificando archivo en GitHub:');
                    console.log('- Nombre:', response.name);
                    console.log('- SHA:', response.sha);
                    console.log('- Tamaño:', response.size, 'bytes');
                    console.log('- Última modificación:', response.last_modified);
                    
                    if (response.content) {
                        const content = Buffer.from(response.content, 'base64').toString('utf-8');
                        const lines = content.split('\n');
                        console.log('- Líneas totales:', lines.length);
                        
                        console.log('\n🔍 Líneas 1040-1050:');
                        for (let i = 1039; i < Math.min(1050, lines.length); i++) {
                            console.log(`${i + 1}: ${lines[i]}`);
                        }
                        
                        console.log('\n🔍 Línea 1045 específica:');
                        if (lines[1044]) {
                            console.log(`"${lines[1044]}"`);
                        }
                        
                        resolve({
                            size: response.size,
                            lines: lines.length,
                            sha: response.sha,
                            content: content
                        });
                    } else {
                        reject(new Error('No content in response'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => reject(error));
        req.end();
    });
}

async function main() {
    try {
        await verifyUploadedFile();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();