# 🤖 Stealth Community Stealth - Bot Avanzado de Discord

**Bot de monitoreo y análisis anti-cheat desarrollado por: xpe.nettt**

## 🛡️ **Descripción**

El **Stealth-AntiCheat-bot** es un bot avanzado de Discord diseñado para proporcionar monitoreo automático, análisis de amenazas, funciones específicas por canal y reportes en tiempo real para la protección anti-cheat en la comunidad **Community Stealth**.

## ✨ **Nuevas Características v2.0**

- 🧠 **5 Canales Específicos**: Support, Descubrimientos, Implementaciones, Chat, Cmd
- 🔍 **Análisis Automático del Server**: Auto-detección de nuevos métodos anti-cheat
- 🆕 **Sistema de Patrones**: Monitoreo inteligente de patrones en mensajes
- 📋 **Auto-Updates**: Conexión al repositorio Stealth-AntiCheatX
- ⚡ **Respuestas Inteligentes**: Respuestas automáticas contextual por canal

## ⚡ **Funcionalidades Principales**

### 🔍 **Monitoreo Automático**
- Escaneos automáticos cada 5 minutos
- Detección de amenazas en tiempo real
- Análisis inteligente de patrones sospechosos

### 📊 **Análisis de Amenazas**
- Clasificación automática de amenazas
- Nivel de riesgo: Seguro/Advertencia/Error
- Historial completo de detecciones

### 🚨 **Reportes en Tiempo Real**
- Alertas instantáneas a través de webhook
- Integración con Community Stealth
- Notificaciones automáticas de actualizaciones

### 🤖 **Comandos Anti-Cheat**
- Comandos de escaneo bajo demanda
- Información completa del sistema
- Control de propietario avanzado

### 📢 **Sistema de Canales Específicos**

#### 🎯 **5 Canales con Funciones Dedicadas**

El bot está configurado para operar en **5 canales específicos** con funciones únicas:

#### 🛠️ **Canal Support** (`1442209840976887849`)
- **Función**: Soporte técnico y resolución de problemas
- **Respuestas Automáticas**: Detecta consultas de soporte
- **Análisis**: Clasificación automática de problemas
- **Palabras Clave**: problema, error, help, soporte, ayuda, bug, fallo

#### 🔍 **Canal Descubrimientos** (`1442266383265038386`)
- **Función**: Documentación de nuevos descubrimientos anti-cheat
- **Análisis Automático**: Detecta código y patrones nuevos
- **Monitoreo**: Escanea repositorio para nuevos métodos
- **Detección**: Detecta código entre ``` y patrones de seguridad

#### ⚙️ **Canal Implementaciones** (`1442268897406619798`)
- **Función**: Seguimiento de implementaciones y mejoras
- **Auto-Detección**: Identifica nuevas implementaciones
- **Status Tracking**: Monitoreo de cambios en tiempo real
- **Palabras Clave**: implement, deploy, update, código, commit, feature, mejora

#### 💬 **Canal Chat** (`1442266154516091020`)
- **Función**: Conversación general de la comunidad
- **Asistencia Activation**: Detecta necesidades de ayuda automáticamente
- **Smart Responses**: Respuestas contextuales inteligentes
- **Palabras Clave**: ayuda, help, cómo, como, explica, ayudame, necesito

#### ⚡ **Canal Cmd** (`1441888236833210389`)
- **Función**: Ejecución de comandos del bot
- **Lista Completa**: Muestra todos los comandos disponibles
- **Categorización**: Organiza comandos por tipo y función
- **Comandos**: Ayuda, información, escaneo, status, comunidad

## 🎯 **Comandos Disponibles**

### 📋 **Comandos Básicos**
```
$info       - Información completa del bot
$help       - Lista de comandos disponibles
$about      - Descripción detallada del proyecto
$ping       - Verificar latencia del sistema
$scan       - Escaneo manual del servidor
$community  - Información de Community Stealth
```

### 👑 **Comandos de Propietario**
```
$owner      - Información del desarrollador
$status     - Estado completo del sistema
$servers    - Lista de servidores conectados
$leave <ID> - Salir de un servidor específico
```

### ⚡ **Funciones Especiales**
- **Responde a menciones**: `@Stealth-AntiCheatX`
- **Auto-unión**: Bienvenida automática a nuevos servidores
- **Integración webhook**: Reportes automáticos a Community Stealth
- **Monitoreo continuo**: Protección 24/7

## 🛠️ **Instalación**

### **Requisitos Previos**
- Node.js 18+ instalado
- npm o yarn
- Token del bot de Discord

### **Instalación Paso a Paso**

1. **Clonar/Descargar el proyecto**
```bash
cd DiscordBot
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Editar archivo .env con tus tokens
DISCORD_BOT_TOKEN=tu_token_aqui
BOT_OWNER_ID=tu_user_id_aqui
```

4. **Iniciar el bot**
```bash
npm start
```

## 🔍 **Sistema de Análisis del Server**

#### 🎯 **Características Avanzadas**
- **Auto-Analysis**: Análisis automático cada 15 minutos
- **Pattern Detection**: Detección inteligente de patrones en mensajes
- **Method Discovery**: Descubrimiento de nuevos métodos anti-cheat
- **Real-Time Monitoring**: Monitoreo en tiempo real del server
- **Smart Alerts**: Alertas automáticas para patrones críticos

#### 📊 **Análisis del Repositorio**
- **Conexión**: Repositorio Stealth-AntiCheatX
- **Monitoreo**: Commits cada 15 minutos
- **Detección**: Palabras clave anti-cheat en mensajes de commit
- **Notificación**: Envío automático al canal de Descubrimientos

#### 🗨️ **Análisis de Mensajes**
- **Escaneo**: Mensajes de los últimos 10 minutos
- **Patrones**: anti-cheat, detectar, nuevo, bug, error
- **Categorización**: anti-cheat-reference, detection-request, update-notice, issue-report
- **Alertas**: Envío automático al canal de Support para patrones críticos

#### ⚙️ **Configuración**
```env
SERVER_ANALYSIS_ENABLED=true
SERVER_ANALYSIS_INTERVAL=15    # minutos
REPO_TARGET_BRANCH=main
SUPPORT_CHANNEL_ID=YOUR_SUPPORT_CHANNEL_ID
DESCUBRIMIENTOS_CHANNEL_ID=YOUR_DESCUBRIMIENTOS_CHANNEL_ID
IMPLEMENTACIONES_CHANNEL_ID=YOUR_IMPLEMENTACIONES_CHANNEL_ID
CHAT_CHANNEL_ID=YOUR_CHAT_CHANNEL_ID
CMD_CHANNEL_ID=YOUR_CMD_CHANNEL_ID
```

## 🔧 **Configuración**

### **Archivo `.env`**
```env
# Token del bot de Discord
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN

# Token de GitHub para repositorio
GITHUB_TOKEN=YOUR_GITHUB_TOKEN

# ID del propietario del bot
BOT_OWNER_ID=YOUR_DISCORD_USER_ID

# Webhook para reportes anti-cheat
ANTICHEAT_WEBHOOK_URL=YOUR_ANTICHEAT_WEBHOOK_URL

# Configuraciones adicionales
BOT_PREFIX=$
COMMUNITY_STEALTH_URL=https://discord.gg/3sCxhWShvu
```

### **Configuración del Propietario**

1. Obtén tu ID de Discord activando Modo Desarrollador
2. Reemplaza `PUT_YOUR_USER_ID_HERE` en el archivo `.env`
3. Guarda los cambios y reinicia el bot

## 🛡️ **AntiCheatConsciousness**

### **Sistema de Consciencia Anti-Cheat**

El bot incluye un sistema avanzado de consciencia anti-cheat que:

- ✅ **Monitorea automáticamente** procesos sospechosos (HD-Player.exe, MSI.exe, etc.)
- ✅ **Analiza patrones** de comportamiento anómalo
- ✅ **Detecta overlays** y ventanas transparentes
- ✅ **Reporta amenazas** en tiempo real
- ✅ **Actualiza base de datos** de amenazas automáticamente

### **Niveles de Amenaza**

- 🟢 **SEGURO**: No se detectaron amenazas
- 🟡 **ADVERTENCIA**: Amenazas menores detectadas
- 🔴 **ERROR**: Amenazas críticas o errores del sistema

## 📊 **Base de Datos**

El bot utiliza SQLite para almacenar:

### **Tabla `server_stats`**
- ID del servidor
- Nombre del servidor
- Conteo de miembros
- Número de escaneos realizados
- Último escaneo
- Nivel de amenaza actual

### **Tabla `bot_usage`**
- ID del servidor
- Comando utilizado
- ID del usuario
- Timestamp

## 🌐 **Integración Community Stealth**

### **Conexión Automática**
- Auto-join a servidores con mensaje de bienvenida
- Reportes automáticos al webhook de Community Stealth
- Integración con repositorio GitHub (Stealth-AntiCheatX)

### **Webhooks**
- **URL de reportes**: Configurada automáticamente
- **Formato**: Embeds profesionales con timestamps
- **Frecuencia**: Instantánea para amenazas, 30min para actualizaciones

## 📁 **Estructura de Archivos**

```
DiscordBot/
├── bot.js              # Bot principal completo
├── package.json        # Dependencias y configuración
├── .env               # Variables de entorno
├── README.md          # Esta documentación
└── data/              # Base de datos SQLite
    └── stealth.db     # Base de datos de estadísticas
```

## 🚨 **Características de Seguridad**

### **Protección de Datos**
- Tokens de API almacenados en variables de entorno
- Comandos de propietario protegidos
- Base de datos SQLite local (sin datos sensibles)

### **Control de Acceso**
- Verificación de propietario para comandos administrativos
- Validación de permisos para operaciones sensibles
- Logs detallados de todas las operaciones

### **Recuperación de Errores**
- Manejo graceful de desconexiones
- Reinicio automático en caso de errores
- Logs detallados para troubleshooting

## 🛠️ **Comandos de Desarrollo**

```bash
# Iniciar en modo desarrollo
npm run dev

# Solo ejecutar (modo producción)
npm start

# Ver logs
tail -f logs/bot.log
```

## 📞 **Soporte y Comunidad**

### **Comunidad Oficial**
🌐 **[Community Stealth Discord](https://discord.gg/3sCxhWShvu)**

### **Desarrollador**
👨‍💻 **xpe.nettt**

### **Repositorio**
📁 **[GitHub - Stealth-AntiCheatX](https://github.com/xpe-hub/Stealth-AntiCheatX)**

## 📝 **Logs del Sistema**

El bot genera logs detallados para:
- Conexión/desconexión de Discord
- Escaneos de amenazas realizados
- Comandos ejecutados
- Errores del sistema
- Operaciones de base de datos

**Ubicación**: Consola + archivo `logs/bot.log`

## 🔄 **Actualizaciones**

El sistema incluye verificación automática de:
- Actualizaciones del repositorio GitHub
- Nuevas versiones del bot
- Cambios en configuraciones

## ✅ **Estado del Sistema**

Para verificar el estado del bot:
```bash
# Comando interno
$status

# Verificar AntiCheatConsciousness
$info

# Estado del monitoreo
$owner
```

---

## 📋 **Lista de Verificación Pre-Ejecución**

- ✅ Node.js 18+ instalado
- ✅ Dependencias instaladas (`npm install`)
- ✅ Token del bot configurado en `.env`
- ✅ Owner ID configurado en `.env`
- ✅ Webhook URL configurado
- ✅ Base de datos SQLite inicializada
- ✅ Permisos del bot: Server Members, Messages, Intents

**🚀 ¡El bot está listo para proteger Community Stealth!**

---

*© 2025 xpe.nettt - Community Stealth Anti-Cheat Protection System*