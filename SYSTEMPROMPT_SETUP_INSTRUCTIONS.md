# Instrucciones para configurar Systemprompt.io en iPhone con MiniMax

## TUS CLAVES LISTAS PARA USAR:
- **API Key MiniMax**: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxlcyIsIlVzZXJOYW1lIjoic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxlc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA`
- **Host**: `mcp-api.minimax.chat`
- **Base Path**: `/v1` (o `/api/v1` si no funciona)

---

## PASO 1: ABRIR LA APP
1. Toca el icono de **Systemprompt.io** en tu iPhone
2. Primero te pedirá "Suscription Required" - selecciona **"Continue"** o **"Try Free Trial"**
3. Si pide crear cuenta, haz clic en **"Skip"** o **"Continue as Guest"** si está disponible

---

## PASO 2: AGREGAR SERVIDOR MCP
1. Busca el botón **"+"** o **"Add new server"** en la pantalla principal
2. Toca para agregar nuevo servidor
3. Te aparecerá un formulario con campos:

---

## PASO 3: COMPLETAR LOS DATOS
**COMPLETA EXACTAMENTE ASÍ:**

**Server Name** (Nombre del servidor):
```
MiniMax-MCP
```

**Server Type** (Tipo de servidor):
- Selecciona **"HTTP"** o **"Remote"** (si hay opciones)
- Si no hay opciones, déjalo como está

**URL/Endpoint**:
```
https://mcp-api.minimax.chat/v1
```
*(Si no funciona, prueba: https://mcp-api.minimax.chat/api/v1)*

**API Key** (o "Authorization"):
```
Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxlcyIsIlVzZXJOYW1lIjoic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxlc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA
```

**Headers** (si hay campo separado):
```
Authorization: Bearer [tu API key completa]
```

---

## PASO 4: CONECTAR
1. Toca **"Connect"** o **"Save"**
2. Espera unos segundos para que se conecte
3. Deberías ver "Connected" o una marca verde de éxito

---

## PASO 5: USAR CON CLAUDE
1. Abre **Claude** en tu iPhone o desde navegador móvil
2. Busca el botón **"Settings"** o **"⚙️"**
3. Ve a **"Advanced Features"** o **"MCP Servers"**
4. Deberías ver **"MiniMax-MCP"** en la lista de servidores disponibles
5. Actívalo activando el switch

---

## COMANDOS POR VOZ QUE FUNCIONARÁN:
- "Hey Claude, conecta con MiniMax"
- "Usa el servidor MiniMax para buscar información"
- "Conecta con MiniMax MCP para ejecutar código"

---

## SOLUCIÓN DE PROBLEMAS:
**Si no conecta:**
1. Verifica que la URL sea: `https://mcp-api.minimax.chat/v1`
2. Asegúrate de que la API Key tenga el texto "Bearer" al inicio
3. Si sigue fallando, intenta con base path `/api/v1` en lugar de `/v1`

**Si Claude no ve el servidor:**
1. Reabre Claude completamente
2. Ve a Settings > Advanced > MCP Servers
3. Desactiva y reactiva MiniMax-MCP
4. Prueba conectando nuevamente

---

## ¡LISTO! 
Una vez conectado, podrás usar Claude con todas las herramientas de MiniMax directamente desde tu iPhone, 24/7, sin necesidad de PC.

¿Necesitas ayuda con algún paso específico?