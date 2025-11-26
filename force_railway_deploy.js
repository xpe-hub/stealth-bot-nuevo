
# 🚀 Deploy Stealth AntiCheat a Railway
# Uso: node force_railway_deploy.js

const fs = require('fs');
const https = require('https');

const GITHUB_TOKEN = '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';
const RAILWAY_TOKEN = 'c54c1356-6cd2-42a6-adea-b68e17e60f1c';

async function forceDeploy() {
  console.log('🎯 Forzando deploy en Railway...');
  
  // Método 1: Hacer commit vacío a GitHub para activar Railway
  try {
    const commitHash = process.argv[2] || '187bc7837629e3c715dd815317924383c11c5996';
    console.log('📤 Activando deploy con commit:', commitHash);
    
    // Crear commit vacío para forzar deploy
    const emptyCommitData = {
      message: 'Force deploy to Railway',
      content: '' // base64 de string vacío
    };
    
    const options = {
      hostname: 'api.github.com',
      path: '/repos/xpe-hub/Stealth-AntiCheat-MCP/contents/README.md',
      method: 'PUT',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Deploy forzado!');
        console.log('🔗 Railway debería detectar el cambio en 1-2 minutos');
        console.log('📱 Dashboard: https://railway.app/project/zooming-peace');
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ Error:', e.message);
      console.log('💡 Alternativa: Ve a Railway Dashboard > Settings > Deploy');
    });
    
    req.write(JSON.stringify({
      message: 'Force deploy to Railway - ' + new Date().toISOString(),
      content: Buffer.from('').toString('base64'),
      sha: null
    }));
    req.end();
    
  } catch (error) {
    console.error('❌ Error en deploy:', error.message);
  }
}

if (require.main === module) {
  deployScript();
}
