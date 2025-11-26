#!/usr/bin/env node

/**
 * Script para subir la corrección TypeScript a GitHub
 * Corrige el error TS2345 en el constructor de Server
 */

const fs = require('fs');
const https = require('https');

// Configuración de GitHub
const REPO_OWNER = 'xpe-hub';
const REPO_NAME = 'Stealth-AntiCheat-MCP';
const FILE_PATH = 'src/index.ts';
const BRANCH = 'main';
const GITHUB_TOKEN = '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';

// Leer el archivo corregido
const fileContent = fs.readFileSync('/workspace/Stealth-AntiCheat-MCP/src/index.ts', 'utf8');
const base64Content = Buffer.from(fileContent, 'utf8').toString('base64');

// Primero, obtener el SHA del archivo existente
function getFileSha() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          resolve(response.sha);
        } else {
          console.error('Error getting file SHA:', res.statusCode, data);
          reject(new Error('Could not get file SHA'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Actualizar el archivo
function updateFile(fileSha) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      message: 'Fix TypeScript TS2345: Update Server constructor to use object parameter\n\n' +
               'Changed from: new Server(\'name\', {version: \'3.0.0\'})\n' +
               'Changed to:   new Server({name: \'name\', version: \'3.0.0\'})\n\n' +
               'This fixes the TypeScript compilation error TS2345.',
      content: base64Content,
      sha: fileSha,
      branch: BRANCH
    });

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Archivo actualizado exitosamente en GitHub');
          console.log('🔗 URL: https://github.com/' + REPO_OWNER + '/' + REPO_NAME + '/blob/' + BRANCH + '/' + FILE_PATH);
          resolve();
        } else {
          console.error('Error updating file:', res.statusCode, data);
          reject(new Error('Could not update file'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Ejecutar el proceso
async function main() {
  try {
    console.log('🚀 Subiendo corrección TypeScript a GitHub...');
    console.log('📁 Archivo:', FILE_PATH);
    console.log('🔗 Repositorio:', REPO_OWNER + '/' + REPO_NAME);
    console.log('🌿 Rama:', BRANCH);
    console.log('');
    
    const fileSha = await getFileSha();
    console.log('📋 SHA del archivo existente:', fileSha.substring(0, 8) + '...');
    
    await updateFile(fileSha);
    
    console.log('');
    console.log('🎉 ¡Corrección subida exitosamente!');
    console.log('💡 Ahora Railway puede ser desplegado sin errores TypeScript');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();