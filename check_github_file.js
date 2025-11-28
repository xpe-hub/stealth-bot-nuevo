const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

async function checkGitHubFile() {
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
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.content) {
                        // Decodificar base64
                        const content = Buffer.from(response.content, 'base64').toString('utf-8');
                        resolve(content);
                    } else {
                        reject(new Error('No content found in response'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Verificar líneas alrededor de la 1044
async function main() {
    try {
        console.log('Verificando archivo en GitHub...');
        const content = await checkGitHubFile();
        
        const lines = content.split('\n');
        console.log(`Total líneas en GitHub: ${lines.length}`);
        console.log('\nLíneas 1040-1050:');
        for (let i = 1039; i < Math.min(1050, lines.length); i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
        
        // Verificar específicamente la línea 1044
        if (lines[1043]) {
            console.log('\n🔍 Línea 1044 específica:');
            console.log(`Línea 1044: "${lines[1043]}"`);
            console.log('Longitud:', lines[1043].length);
            
            // Verificar caracteres especiales
            const chars = [];
            for (let i = 0; i < Math.min(50, lines[1043].length); i++) {
                const char = lines[1043][i];
                const code = char.charCodeAt(0);
                chars.push(`${char} (${code})`);
            }
            console.log('Primeros 50 caracteres con códigos:', chars.join(', '));
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();