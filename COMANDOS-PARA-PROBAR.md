# 🧪 Lista de Comandos para Probar - Stealth-AntiCheatX Bot

## 📋 Comandos Básicos para Verificar Funcionamiento

### 🔧 **Comandos de Información**
```bash
$about                    # Información completa del sistema
$help                     # Lista de comandos
$ping                     # Verificar estado
$status                   # Status del sistema
```

### 🛡️ **Comandos Stealth-AntiCheatX**
```bash
$anticheat info          # Info detallada del sistema
$anticheat scan          # Escaneo profundo con IA
$anticheat patterns      # Patrones de detección
$anticheat stealth       # Sistema completo Stealth
$anticheat channels      # Info sistema de canales
```

### 👨‍💻 **Comandos de Desarrollador** (Solo developers)
```bash
$dev status              # Estado completo del sistema
$dev channels            # Info detallada de canales
$dev move chat           # Mover bot al canal de chat
$dev move soporte        # Mover bot al canal de soporte
$dev analyze [código]    # Análisis avanzado de código
$dev test               # Test de detección
```

## 🎯 **Comandos Específicos para Testear los 5 Canales**

### **En Canal de Comandos (CMD_CHANNEL_ID)**
```bash
$about                           # Información completa
$anticheat stealth              # Sistema completo Stealth
$dev status                     # Status para desarrolladores
```

### **En Canal de Soporte (SUPPORT_CHANNEL_ID)**
```bash
$anticheat info                 # Información de soporte
$help                          # Ayuda técnica
$dev channels                  # Info de canales para soporte
```

### **En Canal de Descubrimientos (DESCUBRIMIENTOS_CHANNEL_ID)**
```bash
$anticheat patterns            # Patrones de descubrimiento
$dev analyze [código_sospechoso]  # Análisis de código
$anticheat scan                # Escaneo para hallazgos
```

### **En Canal de Implementaciones (IMPLEMENTACIONES_CHANNEL_ID)**
```bash
$anticheat stealth             # Sistema completo para implementar
$dev update knowledge          # Actualizar base de conocimientos
$dev channels                  # Info para coordinación
```

### **En Canal de Chat (CHAT_CHANNEL_ID)**
```bash
$about                         # Información general
$community                     # Info de comunidad
$dev move [otro_canal]         # Mover bot a otro canal
```

## 🔄 **Test de Movimiento Entre Canales**

### **Comandos de Movimiento para Desarrolladores:**
```bash
$dev move comandos            # Mover al canal de comandos
$dev move chat                # Mover al canal de chat
$dev move soporte             # Mover al canal de soporte
$dev move descubrimientos     # Mover al canal de descubrimientos
$dev move implementaciones    # Mover al canal de implementaciones
```

## 🧠 **Comandos de Análisis Avanzado**

### **Análisis de Código para Desarrolladores:**
```bash
# Test básico de inyección de memoria
$dev analyze VirtualAllocEx(GetCurrentProcess(), NULL, 4096, MEM_COMMIT, PAGE_EXECUTE_READWRITE);

# Test de ESP Overlay
$dev analyze GetWindowLongPtr(espWindow, GWL_EXSTYLE);

# Test combinado
$dev analyze VirtualAllocEx + CreateRemoteThread + ESP_Overlay;
```

### **Test de Detección Completa:**
```bash
$dev test                     # Test automático con código de ejemplo
$anticheat scan               # Escaneo completo del servidor
```

## 📊 **Verificaciones de Estado**

### **Estado del Sistema:**
```bash
$status                       # Estado general
$dev status                   # Estado para desarrolladores
$anticheat info              # Info del sistema Stealth
```

### **Información de Canales:**
```bash
$anticheat channels          # Info general de canales
$dev channels                # Info detallada para devs
$about                       # Info completa con contexto de canal
```

## 🎪 **Scenarios de Prueba Específicos**

### **Scenario 1: Testing de Conocimiento de Canales**
1. Usar `$about` en cada canal diferente
2. Verificar que la información del "Canal Actual" cambia
3. Comprobar que el "Rol del Bot" es específico para cada canal

### **Scenario 2: Testing de Movimiento de Bot**
1. Como desarrollador, usar `$dev move chat`
2. Verificar que el bot envía mensaje en el canal de chat
3. Usar `$dev move comandos` para regresar
4. Verificar funcionamiento en ambos canales

### **Scenario 3: Testing de Análisis Stealth-AntiCheatX**
1. Usar `$dev analyze` con código sospechoso
2. Verificar que incluye "Compatibilidad Stealth-AntiCheatX"
3. Comprobar recomendaciones específicas del sistema
4. Probar `$anticheat stealth` para info completa

### **Scenario 4: Testing de Comandos Específicos por Canal**
1. En DESCUBRIMIENTOS: `$anticheat patterns`
2. En IMPLEMENTACIONES: `$dev update knowledge`
3. En SUPPORT: `$help` y `$anticheat info`
4. En CHAT: `$community` y `$about`
5. En CMD: Todos los comandos disponibles

## ✅ **Criterios de Éxito**

### **Debe Funcionar Correctamente:**
- ✅ `$about` muestra información completa del sistema
- ✅ El bot conoce específicamente el canal actual
- ✅ `$dev move [canal]` cambia exitosamente de canal
- ✅ `$anticheat stealth` muestra info completa de Stealth-AntiCheatX
- ✅ `$dev channels` da información detallada de cada canal
- ✅ `$dev analyze` incluye análisis de compatibilidad Stealth
- ✅ Los comandos responden differently según el canal actual

### **Errores Comunes a Verificar:**
- ❌ Bot no responde en canales no autorizados (excepto menciones)
- ❌ `$dev move` no encuentra el canal especificado
- ❌ `$about` no muestra información del canal actual
- ❌ `$anticheat stealth` no muestra información completa del sistema

---

**💡 Tip**: Probar los comandos en orden secuencial para verificar que toda la funcionalidad está operativa.