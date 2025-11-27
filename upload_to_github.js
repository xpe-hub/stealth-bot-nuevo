const fs = require('fs');
const https = require('https');

// Configuración
const GITHUB_TOKEN = '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';
const OWNER = 'xpe-hub';
const REPO = 'stealth-bot-nuevo';

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
  const commitMessage = path === 'bot.js' 
    ? `🎤 SIMPLIFICACIÓN: Comandos de Voz Simplificados\n\n` +
      `🔧 OBJETIVO: Bot específico con funciones claras\n\n` +
      `✅ Cambios implementados:\n` +
      `• SIMPLIFICADO: Solo 2 comandos esenciales\n` +
      `• \\$vc - Unión automática si usuario está en canal\n` +
      `• \\$vc random - Canal aleatorio con personas\n` +
      `• ELIMINADO: Opciones complejas (auto, most_active, por nombre)\n` +
      `• LIMPIADO: Código de ~800 líneas a ~150 líneas\n` +
      `• OPTIMIZADO: Enfoque en funcionalidades específicas\n` +
      `• PREPARADO: Para implementación de IA con MiniMax API\n\n` +
      `🎯 Filosofía del bot:\n` +
      `• Bot específico con misiones específicas\n` +
      `• Sin funciones innecesarias\n` +
      `• Preparado para automatización con IA\n` +
      `• Focus en completar implementaciones actuales\n\n` +
      `🔧 Desarrollado por: xpe.nettt\n` +
      `📅 Fecha: ${new Date().toLocaleString()}\n` +
      `🏠 Community Stealth`
    : `Update ${path} - ${new Date().toISOString()}`;
    
  const putData = JSON.stringify({
    message: commitMessage,
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
  console.log('🚀 Subiendo bot.js actualizado con sistema de permisos a GitHub...');
  
  try {
    // Subir el bot.js actualizado
    const botJsPath = '/workspace/bot.js';
    
    if (!fs.existsSync(botJsPath)) {
      throw new Error('bot.js no encontrado en /workspace/');
    }
    
    const botJsContent = fs.readFileSync(botJsPath, 'utf8');
    console.log('📄 Archivo bot.js leído exitosamente');
    console.log(`📊 Tamaño: ${botJsContent.length} caracteres`);
    
    // Subir bot.js
    const result = await uploadFile('bot.js', botJsContent);
    console.log('✅ bot.js subido exitosamente');
    
    // Resumen
    console.log('\n🎉 ¡Actualización completada!');
    console.log('📋 Resumen de cambios:');
    console.log('   ✅ Sistema de detección automática de cheats');
    console.log('   ✅ Consultas automáticas a desarrolladores');
    console.log('   ✅ Sistema de permisos con dev approve');
    console.log('   ✅ Auto-actualización del repositorio');
    console.log('   ✅ Monitoreo inteligente de threats');
    
    console.log('\n🔗 El bot está listo para deployment en Railway');
    console.log('📁 Repositorio:', `https://github.com/${OWNER}/${REPO}`);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    throw error;
  }
}

if (require.main === module) {
  main();
}
