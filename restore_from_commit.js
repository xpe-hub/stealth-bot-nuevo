const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';

async function getFileFromCommit(commitSha, filePath) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${commitSha}`,
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

async function restoreOriginalFile() {
    try {
        console.log('🔄 Restaurando archivo original desde commit...');
        
        // Intentar con el commit que tenía el archivo correcto
        const correctCommit = '870979361ffa2b309d4c02cd7f5f9a9a9f921e54';
        console.log(`Obteniendo desde commit: ${correctCommit}`);
        
        const content = await getFileFromCommit(correctCommit, 'bot.js');
        
        // Añadir timestamp para forzar rebuild
        const lines = content.split('\n');
        lines.splice(1, 0, '// Actualizado: 2025-11-28 10:23:19 - Force rebuild for Railway cache clear');
        
        const restoredContent = lines.join('\n');
        
        // Escribir archivo restaurado
        const fs = require('fs');
        fs.writeFileSync('/workspace/stealth-bot-nuevo/bot.js', restoredContent);
        
        console.log(`✅ Archivo restaurado con ${lines.length} líneas`);
        console.log(`✅ Timestamp añadido para forzar rebuild`);
        
        // Verificar
        const savedContent = fs.readFileSync('/workspace/stealth-bot-nuevo/bot.js', 'utf8');
        const savedLines = savedContent.split('\n');
        console.log(`✅ Verificación: archivo guardado tiene ${savedLines.length} líneas`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('🔄 Intentando con commit alternativo...');
        
        // Si falla, intentar con el último commit de stealth_cheatx_ai que sabemos que funcionaba
        const fallbackCommit = '01e172db5b49d28dc6bad0f421ecb4bd81ee571d';
        try {
            const content = await getFileFromCommit(fallbackCommit, 'stealth_cheatx_ai.js');
            console.log('✅ Puedo acceder al commit fallback, el sistema de API funciona');
        } catch (fallbackError) {
            console.log('❌ Error también con fallback:', fallbackError.message);
        }
    }
}

restoreOriginalFile();