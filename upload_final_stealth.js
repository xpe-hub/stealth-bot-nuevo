const https = require('https');
const fs = require('fs');

// Configuración de GitHub
const GITHUB_TOKEN = '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';
const OWNER = 'xpe-hub';
const REPO = 'stealth-bot-nuevo';
const FILE_PATH = 'stealth_cheatx_ai.js';
const BRANCH = 'main';

// Leer el archivo CORREGIDO
const fileContent = fs.readFileSync('/workspace/stealth_cheatx_ai_corregido.js', 'utf8');

// Función para hacer request a GitHub API
function githubRequest(url, method, data) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: method,
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            }
        };
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`GitHub API error: ${res.statusCode} ${res.statusText} - ${body}`));
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function uploadFile() {
    try {
        console.log('🚀 Subiendo stealth_cheatx_ai.js FINAL CORREGIDO...');
        console.log('📊 Líneas del archivo:', fileContent.split('\n').length);
        
        // 1. Obtener el SHA del archivo actual
        const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
        const currentFile = await githubRequest(getUrl, 'GET');
        
        // 2. Preparar datos para subir
        const encodedContent = Buffer.from(fileContent, 'utf8').toString('base64');
        const commitMessage = 'Final: Stealth-CheatX AI syntax error FIXED';
        
        const uploadData = {
            message: commitMessage,
            content: encodedContent,
            sha: currentFile.sha,
            branch: BRANCH
        };
        
        // 3. Subir archivo
        const uploadUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
        const result = await githubRequest(uploadUrl, 'PUT', uploadData);
        
        console.log('🎉 ¡stealth_cheatx_ai.js FINAL CORREGIDO subido!');
        console.log('📊 Commit SHA:', result.commit.sha);
        
        return {
            success: true,
            commitSha: result.commit.sha,
            commitUrl: result.commit.html_url
        };
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

uploadFile().then(result => {
    console.log('\n✅ ¡TODO COMPLETADO!');
    console.log('🔗 Ver commit:', result.commitUrl);
    console.log('🎯 ¡AMBOS ARCHIVOS AHORA SON CORRECTOS!');
}).catch(error => {
    console.error('\n❌ FALLO:', error.message);
});
