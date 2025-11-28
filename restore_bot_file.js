const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

async function getGitHubFile() {
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
                        resolve(content);
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

async function restoreFile() {
    try {
        console.log('🔄 Restaurando archivo completo desde GitHub...');
        const content = await getGitHubFile();
        
        // Añadir timestamp al inicio del archivo
        const lines = content.split('\n');
        lines.splice(1, 0, '// Actualizado: 2025-11-28 10:23:19 - Force rebuild for Railway cache clear');
        
        const restoredContent = lines.join('\n');
        
        // Escribir el archivo restaurado
        const fs = require('fs');
        fs.writeFileSync('/workspace/stealth-bot-nuevo/bot.js', restoredContent);
        
        console.log(`✅ Archivo restaurado con ${lines.length} líneas`);
        console.log('✅ Timestamp añadido para forzar rebuild');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

restoreFile();