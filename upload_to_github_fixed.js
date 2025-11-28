const https = require('https');
const fs = require('fs');

// Configuración de GitHub
const GITHUB_TOKEN = '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';
const OWNER = 'xpe-hub';
const REPO = 'stealth-bot-nuevo';
const FILE_PATH = 'bot.js';
const BRANCH = 'main';

// Leer el archivo
const fileContent = fs.readFileSync('/workspace/bot_original_con_error.js', 'utf8');

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
        console.log('🚀 Iniciando subida a GitHub...');
        
        // 1. Obtener el SHA del archivo actual
        const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
        console.log('📋 Obteniendo archivo actual...');
        
        let currentFile;
        try {
            currentFile = await githubRequest(getUrl, 'GET');
            console.log('✅ Archivo actual encontrado:', currentFile.sha);
        } catch (error) {
            if (error.message.includes('404')) {
                console.log('📄 Archivo no existe, será creado nuevo');
                currentFile = null;
            } else {
                throw error;
            }
        }
        
        // 2. Preparar datos para subir
        const encodedContent = Buffer.from(fileContent, 'utf8').toString('base64');
        const commitMessage = 'Restore: Bot file restored from backup';
        
        const uploadData = {
            message: commitMessage,
            content: encodedContent,
            branch: BRANCH
        };
        
        if (currentFile) {
            uploadData.sha = currentFile.sha;
        }
        
        // 3. Subir archivo
        const uploadUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
        console.log('📤 Subiendo archivo a GitHub...');
        
        const result = await githubRequest(uploadUrl, 'PUT', uploadData);
        
        console.log('🎉 ¡Archivo subido exitosamente!');
        console.log('📊 Commit SHA:', result.commit.sha);
        console.log('🔗 Commit URL:', result.commit.html_url);
        console.log('📄 File URL:', result.content.html_url);
        
        return {
            success: true,
            commitSha: result.commit.sha,
            commitUrl: result.commit.html_url,
            fileUrl: result.content.html_url
        };
        
    } catch (error) {
        console.error('❌ Error subiendo archivo:', error.message);
        throw error;
    }
}

// Ejecutar la subida
uploadFile().then(result => {
    console.log('\n✅ ¡SUCESO! El archivo ha sido subido a GitHub');
    console.log('🔗 Ver commit:', result.commitUrl);
}).catch(error => {
    console.error('\n❌ FALLO:', error.message);
    process.exit(1);
});
