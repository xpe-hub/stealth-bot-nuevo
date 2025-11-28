const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'stealth-bot-nuevo';
const BRANCH = 'main';

async function analyzeLine1045() {
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
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.content) {
                        const content = Buffer.from(response.content, 'base64').toString('utf-8');
                        const lines = content.split('\n');
                        
                        console.log('🔍 ANÁLISIS DETALLADO LÍNEA 1045:');
                        console.log('=====================================');
                        
                        if (lines[1044]) { // Línea 1045 es índice 1044
                            const line1045 = lines[1044];
                            console.log(`📍 Línea 1045 (índice 1044):`);
                            console.log(`Contenido: "${line1045}"`);
                            console.log(`Longitud: ${line1045.length} caracteres`);
                            
                            // Análisis carácter por carácter
                            console.log('\n🔍 Análisis carácter por carácter:');
                            const chars = [];
                            for (let i = 0; i < line1045.length; i++) {
                                const char = line1045[i];
                                const code = char.charCodeAt(0);
                                const isPrintable = code >= 32 && code <= 126;
                                chars.push({
                                    pos: i,
                                    char: char,
                                    code: code,
                                    printable: isPrintable,
                                    hex: char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
                                });
                            }
                            
                            // Mostrar caracteres problemáticos
                            const problematic = chars.filter(c => !c.printable || c.code > 127);
                            if (problematic.length > 0) {
                                console.log('⚠️ CARACTERES PROBLEMÁTICOS ENCONTRADOS:');
                                problematic.forEach(c => {
                                    console.log(`Pos ${c.pos}: "${c.char}" (U+${c.code.toString(16).toUpperCase()})`);
                                });
                            } else {
                                console.log('✅ Todos los caracteres parecen normales');
                            }
                            
                            // Verificar template string
                            console.log('\n🔍 Análisis del template string:');
                            const backticks = (line1045.match(/`/g) || []).length;
                            const dollars = (line1045.match(/\$/g) || []).length;
                            const braces = (line1045.match(/[{}]/g) || []).length;
                            
                            console.log(`Tildes abiertas: ${backticks}`);
                            console.log(`Signos $: ${dollars}`);
                            console.log(`Llaves {}: ${braces}`);
                            
                            // Verificar estructura del setFooter
                            const setFooterRegex = /\.setFooter\(\{ text: `([^`]+)` \}\)/;
                            const match = line1045.match(setFooterRegex);
                            if (match) {
                                console.log('✅ Template string detectado correctamente');
                                console.log(`Contenido template: "${match[1]}"`);
                            } else {
                                console.log('❌ NO se detectó template string correcto');
                            }
                        } else {
                            console.log('❌ No existe línea 1045');
                        }
                        
                        // Mostrar contexto alrededor
                        console.log('\n📋 CONTEXTO (líneas 1043-1047):');
                        for (let i = 1042; i < Math.min(1047, lines.length); i++) {
                            console.log(`${i + 1}: ${lines[i]}`);
                        }
                        
                        resolve(lines);
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

async function main() {
    try {
        await analyzeLine1045();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();