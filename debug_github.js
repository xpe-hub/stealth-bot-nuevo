const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

async function debugGitHubFile() {
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
            console.log('Status Code:', res.statusCode);
            console.log('Headers:', res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                console.log(`Received ${chunk.length} bytes`);
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    console.log('Total data length:', data.length);
                    console.log('First 500 chars:', data.substring(0, 500));
                    
                    const response = JSON.parse(data);
                    console.log('Response keys:', Object.keys(response));
                    
                    if (response.content) {
                        console.log('Content length:', response.content.length);
                        console.log('Content first 200 chars:', response.content.substring(0, 200));
                        
                        const decoded = Buffer.from(response.content, 'base64').toString('utf-8');
                        console.log('Decoded content length:', decoded.length);
                        console.log('Decoded lines count:', decoded.split('\n').length);
                        
                        resolve({
                            rawResponse: data,
                            content: decoded,
                            lines: decoded.split('\n')
                        });
                    } else {
                        reject(new Error('No content in response'));
                    }
                } catch (error) {
                    console.error('Parse error:', error.message);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Request error:', error.message);
            reject(error);
        });

        req.end();
    });
}

async function main() {
    try {
        const result = await debugGitHubFile();
        console.log('=== RESULT ===');
        console.log('Total lines:', result.lines.length);
        console.log('First few lines:', result.lines.slice(0, 5));
        console.log('Last few lines:', result.lines.slice(-5));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();