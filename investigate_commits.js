const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

async function getCommitHistory() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${BRANCH}&per_page=10`,
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
                    const commits = JSON.parse(data);
                    console.log('📜 HISTORIAL DE COMMITS RECIENTES:');
                    console.log('====================================');
                    
                    commits.forEach((commit, index) => {
                        console.log(`${index + 1}. ${commit.sha.substring(0, 8)} - ${commit.commit.message}`);
                        console.log(`   Autor: ${commit.commit.author.name}`);
                        console.log(`   Fecha: ${commit.commit.author.date}`);
                        console.log(`   Files: ${commit.files ? commit.files.length : 'N/A'} archivos modificados`);
                        console.log('');
                    });
                    
                    resolve(commits);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => reject(error));
        req.end();
    });
}

async function downloadDirectFile() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'raw.githubusercontent.com',
            path: `/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/bot.js`,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const lines = data.split('\n');
                    console.log('🔽 DESCARGA DIRECTA DESDE GITHUB:');
                    console.log('=================================');
                    console.log(`📊 Total líneas: ${lines.length}`);
                    
                    if (lines[1044]) {
                        console.log(`📍 Línea 1045: "${lines[1044]}"`);
                        console.log('✅ Contenido correcto confirmado');
                    }
                    
                    resolve(data);
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
        console.log('🔍 INVESTIGANDO COMMIT SHA Y ARCHIVO DIRECTO...\n');
        
        await getCommitHistory();
        console.log('');
        await downloadDirectFile();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();