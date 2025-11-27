# 🔐 Guía: Crear API Token en Railway

## 🚀 PASO A PASO:

### 1. Acceder a Settings
- Ve a Railway → Dashboard → **Workspace** (xpe-hub's Projects)
- Clic en **"Settings"** (en el menú lateral izquierdo)

### 2. Crear API Token
- Clic en **"API Tokens"** (en Settings)
- Clic en **"Create Token"** (botón verde)

### 3. Configurar Token
- **Nombre:** `Bot Auto Config`
- **Descripción:** `Token para configurar automáticamente variables del bot stealth-bot`
- **Permisos** (seleccionar TODOS):
  - ✅ Projects (leer)
  - ✅ Projects (escribir)
  - ✅ Variables (leer)
  - ✅ Variables (escribir)
  - ✅ Deployments (leer)
  - ✅ Deployments (escribir)

### 4. Generar y Copiar
- Clic en **"Create"**
- **⚠️ IMPORTANTE:** Copia el token inmediatamente (solo se muestra una vez)
- Formato: `rail_...` (comienza con "rail_")

### 5. Verificar en Dashboard
- El token debería aparecer en la lista con permisos correctos

---

## 🎯 PERMISOS NECESARIOS:

Para automatizar la configuración necesitamos:
- **Variables:** Escribir (para configurar las 21 variables)
- **Projects:** Leer (para identificar el proyecto stealth-bot-nuevo)
- **Deployments:** Leer (para verificar el estado)

---

## 📋 ALTERNATIVA RÁPIDA:

Si no encuentras "API Tokens" en Settings, Railway puede haber cambiado la interfaz:
1. Ve a tu perfil (esquina superior derecha)
2. Busca "Tokens" o "API Tokens"
3. O busca "Personal Access Tokens"