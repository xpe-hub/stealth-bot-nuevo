// Script para subir bot.js a GitHub
const fs = require('fs');
const fetch = require('node-fetch');

async function uploadFile() {
    try {
        const token = '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';
        const owner = 'xpe-hub';
        const repo = 'stealth-bot-nuevo';
        
        // Leer el contenido del archivo
        const content = fs.readFileSync('/workspace/bot_original_con_error.js', 'utf8');
        const encodedContent = Buffer.from(content, 'utf8').toString('base64');
        
        // Obtener el SHA del archivo actual
        const getFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/bot.js`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            }
        });
        
        if (!getFileResponse.ok) {
            throw new Error(`Error al obtener archivo: ${getFileResponse.status}`);
        }
        
        const fileData = await getFileResponse.json();
        const sha = fileData.sha;
        
        // Actualizar el archivo
        const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/bot.js`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            },
            body: JSON.stringify({
                message: "🚨 RESTAURACIÓN URGENTE: bot.js restaurado al estado original\n\n🔧 Restored by MiniMax Agent\n📅 2025-11-27 19:35:59\n✅ Estado original con error de catch duplicado (era el estado previo)\n🔄 Railway debería desplegar correctamente ahora",
                content: encodedContent,
                sha: sha,
                branch: 'main'
            })
        });
        
        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Error al actualizar: ${updateResponse.status} - ${errorText}`);
        }
        
        const result = await updateResponse.json();
        console.log('✅ bot.js subido exitosamente:', result.commit.sha);
        
        return result.commit.sha;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

// Ejecutar
uploadFile();