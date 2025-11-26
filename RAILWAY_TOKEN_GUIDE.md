# 🚀 Usar Token de Railway para Deploy

## 📋 Opción 1: Railway CLI (Recomendado)

### Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Login con tu token
```bash
railway login --token TU_TOKEN_DE_RAILWAY
```

### Deploy directo
```bash
cd /ruta/a/tu/proyecto
railway up
```

## 📱 Opción 2: Usar desde tu iPhone

### En Railway.app:
1. **Ve a Settings** → **Access Tokens**
2. **Copia tu token**
3. **Pega en la CLI** o usa la app web

### Deploy desde CLI:
```bash
railway login
railway up --detach
```

## 🔧 Opción 3: Automatizar Deploy

### Script de deploy:
```bash
#!/bin/bash
# deploy-railway.sh

export RAILWAY_TOKEN="tu_token"

# Build y deploy
railway up --detach

# Ver deploy status
railway status
```

## 📊 Verificar Deploy con Token

### Status del proyecto:
```bash
railway status
```

### Logs en tiempo real:
```bash
railway logs
```

### Variables de entorno:
```bash
railway variables
```

## 🎯 ¿Cuál método prefieres?

**Responde**:
1. **"CLI"** → Te instalo Railway CLI y uso tu token
2. **"Manual"** → Te doy los comandos exactos para usar en tu terminal
3. **"Script"** → Creo un script automático de deploy

---

**💡 Para usar tu token necesitas:**
- Instalar Railway CLI
- Autenticarte con: `railway login --token TU_TOKEN`
- Ejecutar deploy desde el directorio del proyecto