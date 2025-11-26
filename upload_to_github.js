const fs = require('fs');
const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const OWNER = 'xpe-hub';
const REPO = 'Stealth-AntiCheat-MCP';

// Función para hacer petición HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });
    
    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// Función para subir archivo a GitHub
async function uploadFile(path, content) {
  const encodedContent = Buffer.from(content).toString('base64');
  
  // Primero verificar si el archivo existe
  let sha = null;
  try {
    const getOptions = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}/contents/${path}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node.js'
      }
    };
    
    const response = await makeRequest(getOptions);
    sha = response.sha;
    console.log(`📝 Archivo ${path} existe, actualizando...`);
  } catch (e) {
    console.log(`📄 Archivo ${path} no existe, creando...`);
  }
  
  // Crear o actualizar archivo
  const putData = JSON.stringify({
    message: `Update ${path} - Railway deployment ready ${new Date().toISOString()}`,
    content: encodedContent,
    sha: sha
  });
  
  const putOptions = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/contents/${path}`,
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Node.js'
    }
  };
  
  const response = await makeRequest(putOptions, putData);
  console.log(`✅ ${path} subido exitosamente`);
  return response;
}

async function main() {
  console.log('🚀 Subiendo archivos a GitHub para Railway...');
  
  try {
    // Leer archivos del proyecto
    const projectPath = '/workspace/Stealth-AntiCheat-MCP';
    
    // Archivos críticos para subir
    const files = [
      'src/index.ts',
      'railway.js', 
      'RAILWAY.md',
      'package.json',
      'src/discord-client.ts'
    ];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(`${projectPath}/${file}`, 'utf8');
        await uploadFile(file, content);
      } catch (error) {
        console.error(`❌ Error subiendo ${file}:`, error.message);
      }
    }
    
    console.log('🎯 ¡Deploy a Railway iniciado!');
    console.log('🔗 Railway debería detectar los cambios en 1-2 minutos');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

if (require.main === module) {
  main();
}
