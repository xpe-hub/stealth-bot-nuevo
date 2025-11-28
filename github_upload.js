#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const token = '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';
const owner = 'xpe-hub';
const repo = 'stealth-bot-nuevo';

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed, body });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function updateFile(filename, message) {
    try {
        console.log(`🔄 Actualizando ${filename}...`);
        
        // Leer contenido del archivo
        const filePath = `/workspace/${filename}`;
        if (!fs.existsSync(filePath)) {
            throw new Error(`Archivo ${filePath} no existe`);
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const encodedContent = Buffer.from(content, 'utf8').toString('base64');
        
        // Obtener SHA del archivo actual
        const getOptions = {
            hostname: 'api.github.com',
            path: `/repos/${owner}/${repo}/contents/${filename}`,
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            }
        };
        
        const getResponse = await makeRequest(getOptions);
        
        if (getResponse.status !== 200) {
            throw new Error(`Error al obtener ${filename}: ${getResponse.status}`);
        }
        
        const sha = getResponse.data.sha;
        
        // Actualizar archivo
        const updateData = {
            message: message,
            content: encodedContent,
            sha: sha,
            branch: 'main'
        };
        
        const updateOptions = {
            hostname: 'api.github.com',
            path: `/repos/${owner}/${repo}/contents/${filename}`,
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Stealth-AntiCheat-Bot'
            }
        };
        
        const updateResponse = await makeRequest(updateOptions, JSON.stringify(updateData));
        
        if (updateResponse.status !== 200) {
            throw new Error(`Error al actualizar ${filename}: ${updateResponse.status} - ${updateResponse.body}`);
        }
        
        console.log(`✅ ${filename} actualizado: ${updateResponse.data.commit.sha}`);
        return updateResponse.data.commit.sha;
        
    } catch (error) {
        console.error(`❌ Error con ${filename}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🚀 Iniciando subida a GitHub...');
    
    // Subir bot.js
    const botSha = await updateFile('bot_original_con_error.js', 
        'RESTAURACION URGENTE: bot.js restaurado al estado original. Restored by MiniMax Agent 2025-11-27 19:35:59');
    
    if (botSha) {
        // Subir stealth_cheatx_ai.js
        const stealthSha = await updateFile('stealth_cheatx_ai_corregido.js', 
            'CORRECCIÓN URGENTE: stealth_cheatx_ai.js corregido. Template string syntax error fixed. Restored by MiniMax Agent 2025-11-27 19:35:59');
        
        if (stealthSha) {
            console.log('🎉 ¡Ambos archivos subidos exitosamente!');
            console.log('🔄 Railway debería desplegar automáticamente.');
        }
    } else {
        console.log('❌ Error en la subida. Revisar logs.');
    }
}

main();