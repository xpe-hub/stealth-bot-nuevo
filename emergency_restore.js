const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

// Restaurar desde GitHub directamente
async function restoreFromGitHub() {
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
                    if (response.content) {
                        const content = Buffer.from(response.content, 'base64').toString('utf-8');
                        
                        // Añadir timestamp muy específico al inicio para forzar rebuild
                        const lines = content.split('\n');
                        lines.splice(1, 0, '// ACTUALIZACIÓN FORZADA: 2025-11-28 10:32:21 - CACHE CLEAR');
                        
                        const restoredContent = lines.join('\n');
                        
                        // Escribir archivo
                        const fs = require('fs');
                        fs.writeFileSync('/workspace/stealth-bot-nuevo/bot.js', restoredContent);
                        
                        console.log(`✅ Archivo RESTAURADO con ${lines.length} líneas`);
                        console.log(`✅ Timestamp añadido: 2025-11-28 10:32:21`);
                        console.log(`✅ Para forzar cache clear en Railway`);
                        
                        resolve(restoredContent);
                    } else {
                        reject(new Error('No content found'));
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
        await restoreFromGitHub();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();