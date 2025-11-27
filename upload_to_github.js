// GitHub Upload Script - Bot IA Integration
const fs = require('fs');
const path = require('path');

// API Configuration
const API_URL = 'https://api.github.com';
const headers = {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
};

// Repository Information
const owner = process.env.GITHUB_REPO_OWNER || 'xpe-hub';
const repo = process.env.GITHUB_REPO_NAME || 'stealth-bot-nuevo';
const branch = process.env.REPO_TARGET_BRANCH || 'main';

// Files to upload
const filesToUpload = [
    {
        path: 'bot.js',
        description: 'Bot principal con comando $ai integrado con MiniMax-M2',
        commitMessage: '🚀 Bot IA Integration: Agregado comando $ai con MiniMax-M2 Agentic capabilities'
    },
    {
        path: 'minimax_integration.js',
        description: 'Sistema completo de integración con MiniMax-M2 API',
        commitMessage: '🤖 MiniMax Integration: Sistema completo de IA Agentic con Tool Calling'
    },
    {
        path: '.env.example',
        description: 'Configuración completa de variables de entorno incluyendo MiniMax',
        commitMessage: '⚙️ Environment Config: Agregada configuración completa de MiniMax API'
    },
    {
        path: 'minimax_config.env',
        description: 'Configuración específica de MiniMax API',
        commitMessage: '🔧 MiniMax Config: Variables de entorno específicas para IA'
    }
];

async function uploadToGitHub() {
    try {
        console.log('🚀 Iniciando upload a GitHub...');
        console.log(`📦 Repositorio: ${owner}/${repo}`);
        console.log(`🌿 Branch: ${branch}`);

        for (const file of filesToUpload) {
            console.log(`\n📄 Subiendo ${file.path}...`);
            
            // Read file content
            const fileContent = fs.readFileSync(file.path, 'utf8');
            const base64Content = Buffer.from(fileContent).toString('base64');

            // Check if file exists
            const getFileUrl = `${API_URL}/repos/${owner}/${repo}/contents/${file.path}`;
            const fileResponse = await fetch(getFileUrl, {
                method: 'GET',
                headers: headers
            });

            let sha;
            if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                sha = fileData.sha;
                console.log(`📝 Archivo existente encontrado, actualizando...`);
            } else {
                console.log(`✨ Archivo nuevo, creándolo...`);
            }

            // Upload/update file
            const updateData = {
                message: file.commitMessage,
                content: base64Content,
                branch: branch
            };

            if (sha) {
                updateData.sha = sha;
            }

            const updateUrl = `${API_URL}/repos/${owner}/${repo}/contents/${file.path}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updateData)
            });

            if (updateResponse.ok) {
                console.log(`✅ ${file.path} subido correctamente!`);
                console.log(`   📝 ${file.description}`);
            } else {
                const error = await updateResponse.json();
                console.error(`❌ Error subiendo ${file.path}:`, error.message);
                throw new Error(`Failed to upload ${file.path}`);
            }
        }

        console.log('\n🎉 ¡Todos los archivos subidos exitosamente!');
        console.log('🚀 Railway debería reiniciar automáticamente en 1-2 minutos');
        console.log('🤖 Tu bot ahora tendrá capacidades IA con MiniMax-M2!');
        
    } catch (error) {
        console.error('❌ Error durante el upload:', error);
        process.exit(1);
    }
}

// Run upload
uploadToGitHub();