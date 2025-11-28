const https = require('https');
const fs = require('fs');

// Configuración de GitHub
const GITHUB_TOKEN = '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';
const OWNER = 'xpe-hub';
const REPO = 'stealth-bot-nuevo';
const FILE_PATH = '.gitignore';
const BRANCH = 'main';

// Crear un archivo .gitignore temporal para forzar rebuild
const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Railway
.railway/

# Stealth bot temporary files
temp/
tmp/
cache/
`;

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
                    console.log(`Status: ${res.statusCode}, Response: ${body}`);
                    if (res.statusCode === 404) {
                        // File doesn't exist, that's OK
                        resolve(null);
                    } else {
                        reject(new Error(`GitHub API error: ${res.statusCode} ${res.statusText} - ${body}`));
                    }
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

async function forceRailwayRebuild() {
    try {
        console.log('🚀 Forzando rebuild de Railway...');
        
        // 1. Verificar si existe .gitignore
        const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
        let currentFile = null;
        
        try {
            currentFile = await githubRequest(getUrl, 'GET');
            console.log('✅ .gitignore ya existe, lo actualizaremos');
        } catch (error) {
            if (error.message.includes('404')) {
                console.log('📄 .gitignore no existe, será creado');
            } else {
                throw error;
            }
        }
        
        // 2. Subir .gitignore con timestamp actualizado
        const encodedContent = Buffer.from(gitignoreContent, 'utf8').toString('base64');
        const commitMessage = 'Force: Railway rebuild trigger - ' + new Date().toISOString();
        
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
        const result = await githubRequest(uploadUrl, 'PUT', uploadData);
        
        console.log('🎉 ¡Forzado rebuild de Railway!');
        console.log('📊 Commit SHA:', result.commit.sha);
        
        return {
            success: true,
            commitSha: result.commit.sha,
            commitUrl: result.commit.html_url
        };
        
    } catch (error) {
        console.error('❌ Error forzando rebuild:', error.message);
        throw error;
    }
}

// Ejecutar el forzado de rebuild
forceRailwayRebuild().then(result => {
    console.log('\n✅ ¡RAILWAY SE RECONSTRUIRÁ!');
    console.log('🔗 Ver commit:', result.commitUrl);
    console.log('📋 Railway detectará este cambio y hará rebuild completo');
    console.log('⏰ Espera 2-3 minutos para que Railway se reconstruya');
}).catch(error => {
    console.error('\n❌ FALLO:', error.message);
    process.exit(1);
});
