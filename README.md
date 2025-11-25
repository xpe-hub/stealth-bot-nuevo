# 🤖 Stealth AntiCheat Bot - Versión 2.0

Bot de Discord avanzado con funcionalidades anti-cheat, análisis inteligente del servidor y detección automática de amenazas para servidores de gaming.

## ✨ Características Principales

- **🛡️ Anti-Cheat Avanzado**: Sistema de detección automática de métodos de trampa
- **🔍 Análisis del Servidor**: Monitoreo continuo y reportes de amenazas
- **🤖 IA Integrada**: Análisis inteligente con MiniMax AI
- **📊 Reportes en Tiempo Real**: Notificaciones automáticas y alertas
- **🗄️ Base de Datos**: Persistencia de datos con SQLite
- **⚙️ Configuración Súper Simple**: Setup automático con un solo comando

## 🚀 Instalación Rápida

### Opción 1: Instalación Automática (RECOMENDADA)
```bash
# Clonar e instalar automáticamente
git clone https://github.com/xpe-hub/stealth-bot-nuevo.git
cd stealth-bot-nuevo
npm install
node setup.js
node start.sh
```

### Opción 2: Instalación Manual
```bash
# Instalar dependencias
npm install

# Configurar el bot
cp .env.template .env
# Editar .env con tus credenciales

# Ejecutar el bot
node bot.js
```

## ⚙️ Configuración

### 1. Variables de Entorno (.env)
Copia `.env.template` a `.env` y configura:

```env
# Discord Bot
DISCORD_BOT_TOKEN=tu_bot_token_aqui
BOT_OWNER_ID=tu_user_id_aqui
BOT_PREFIX=$

# Canales del Servidor
SUPPORT_CHANNEL_ID=tu_canal_support
DESCUBRIMIENTOS_CHANNEL_ID=tu_canal_descubrimientos
IMPLEMENTACIONES_CHANNEL_ID=tu_canal_implementaciones
CHAT_CHANNEL_ID=tu_canal_chat
CMD_CHANNEL_ID=tu_canal_comandos

# Integración GitHub
GITHUB_TOKEN=tu_github_token
GITHUB_REPO_OWNER=xpe-hub
GITHUB_REPO_NAME=stealth-bot-nuevo
REPO_TARGET_BRANCH=main

# Webhook para Alertas
ANTICHEAT_WEBHOOK_URL=tu_webhook_url

# MiniMax AI (Opcional)
MINIMAX_API_KEY=tu_api_key_minimax

# Configuración Avanzada
SERVER_ANALYSIS_ENABLED=true
SERVER_ANALYSIS_INTERVAL=15
COMMUNITY_STEALTH_URL=https://discord.gg/tu-invita
```

### 2. Permisos del Bot
El bot necesita los siguientes permisos:
- ✅ Enviar mensajes
- ✅ Leer historial de mensajes
- ✅ Usar botones de respuesta
- ✅ Enviar archivos
- ✅ Crear invitaciones (opcional)

## 📁 Estructura del Proyecto

```
stealth-bot-nuevo/
├── bot.js              # Archivo principal del bot
├── package.json        # Configuración npm
├── .env.template      # Plantilla de configuración
├── setup.js           # Script de configuración interactiva
├── start.sh           # Script de inicio automático
├── install.sh         # Script de instalación
├── database.db        # Base de datos SQLite (se crea automáticamente)
├── backup.db          # Backup automático de la BD
├── logs/              # Archivos de log
├── README.md          # Este archivo
└── docs/              # Documentación adicional
```

## 🎮 Canales del Bot

El bot maneja 5 canales específicos:

1. **💬 Support Channel** (`SUPPORT_CHANNEL_ID`)
   - Comando: `!help`
   - Función: Ayuda y soporte general

2. **🔍 Descubrimientos** (`DESCUBRIMIENTOS_CHANNEL_ID`)
   - Comando: `!nuevo [descripción]`
   - Función: Registrar nuevos métodos anti-cheat

3. **⚙️ Implementaciones** (`IMPLEMENTACIONES_CHANNEL_ID`)
   - Comando: `!implementar [nombre] [descripción]`
   - Función: Documentar implementaciones exitosas

4. **💭 Chat General** (`CHAT_CHANNEL_ID`)
   - Comando: `!analizar [mensaje]`
   - Función: Análisis inteligente del contenido

5. **⚡ Comandos** (`CMD_CHANNEL_ID`)
   - Comando: `!comando [nombre] [descripción]`
   - Función: Gestión de comandos personalizados

## 🔧 Comandos Disponibles

### Comandos Básicos
- `!help` - Mostrar ayuda
- `!status` - Estado del bot
- `!ping` - Verificar conectividad
- `!info` - Información del servidor

### Comandos Anti-Cheat
- `!nuevo [método]` - Reportar nuevo método anti-cheat
- `!implementar [nombre] [descripción]` - Documentar implementación
- `!analizar [contenido]` - Análisis con IA

### Comandos de Análisis
- `!scan` - Escaneo completo del servidor
- `!reporte` - Generar reporte de amenazas
- `!historial` - Ver historial de detecciones

## 📊 Base de Datos

El bot utiliza SQLite para persistencia de datos:

- **Tabla `anticheat_methods`**: Métodos anti-cheat detectados
- **Tabla `implementations`**: Implementaciones documentadas
- **Tabla `threats`**: Amenazas identificadas
- **Tabla `server_analysis`**: Análisis del servidor

## 🤖 Integración con MiniMax AI

El bot incluye análisis inteligente con MiniMax AI:
- Detección automática de amenazas
- Análisis de contenido sospechoso
- Recomendaciones de seguridad
- Respuestas inteligentes

**Configurar MiniMax AI:**
1. Obtén tu API key en [MiniMax](https://minimax.chat)
2. Agrega `MINIMAX_API_KEY` al archivo `.env`
3. El bot activará automáticamente la IA

## 🔐 Seguridad

- **✅ Tokens Seguros**: Todas las credenciales en variables de entorno
- **✅ Backup Automático**: Base de datos respaldada cada hora
- **✅ Logs Completos**: Registro detallado de todas las operaciones
- **✅ Validación**: Validación de todas las entradas del usuario

## 📈 Análisis y Reportes

### Reportes Automáticos
- **Cada 15 minutos**: Análisis de amenazas
- **Cada hora**: Backup de base de datos
- **Cada día**: Reporte de actividad
- **Semanal**: Resumen de detecciones

### Métricas Monitoreadas
- Número de métodos anti-cheat detectados
- Implementaciones documentadas
- Amenazas eliminadas
- Tiempo de respuesta promedio

## 🆘 Soporte

### Problemas Comunes
1. **Bot no responde**: Verificar token y permisos
2. **Error de base de datos**: Verificar permisos de escritura
3. **Comandos no funcionan**: Verificar IDs de canales
4. **IA no responde**: Verificar API key de MiniMax

### Obtener Ayuda
- **Discord**: [Community Stealth](https://discord.gg/3sCxhWShvu)
- **Issues**: [GitHub Issues](https://github.com/xpe-hub/stealth-bot-nuevo/issues)
- **Email**: xpepanels@gmail.com

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Desarrollo

### Tecnologías Utilizadas
- **Node.js** v18+
- **Discord.js** v14
- **SQLite3** para base de datos
- **Axios** para APIs
- **Node-cron** para tareas programadas

### Contribución
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 🔄 Historial de Versiones

### v2.0.0 (2025-11-25)
- ✅ Nuevo sistema anti-cheat avanzado
- ✅ Integración completa con MiniMax AI
- ✅ Base de datos SQLite optimizada
- ✅ Instalación automática
- ✅ Scripts de backup y recuperación
- ✅ Análisis de servidor en tiempo real
- ✅ 5 canales específicos configurables
- ✅ Reportes automáticos

---

**🎯 Desarrollado por: xpe.nettt**  
**📧 Contacto: xpepanels@gmail.com**  
**🌐 GitHub: https://github.com/xpe-hub/stealth-bot-nuevo**

---

### ⚡ Inicio Rápido

```bash
# 1. Clonar
git clone https://github.com/xpe-hub/stealth-bot-nuevo.git
cd stealth-bot-nuevo

# 2. Configurar (automático)
npm install && node setup.js

# 3. Iniciar
node start.sh
```

**¡Tu bot estará funcionando en menos de 2 minutos!** 🚀