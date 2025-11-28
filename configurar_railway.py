#!/usr/bin/env python3
"""
Configurador automático de variables de Railway
Configura todas las variables de entorno del bot Stealth-AntiCheatX
"""

import requests
import json
import time

# Token y configuración de Railway
RAILWAY_TOKEN = "841554ac-1557-437c-b0ac-fc58d2f6387f"
SERVICE_ID = "fdf91d31-9d3f-43dd-a55a-4a01571124e9"

# Todas las variables de entorno del bot
env_vars = {
    "DISCORD_BOT_TOKEN": "1441878707250791722.GHFGuP.JZJGI3pJDm2iaN2CJHiRUKoyq_kqxIPoh6ADws",
    "BOT_OWNER_ID": "751601149928538224",
    "SUPPORT_CHANNEL_ID": "1442209840976887849",
    "DESCUBRIMIENTOS_CHANNEL_ID": "1442266383265038386",
    "IMPLEMENTACIONES_CHANNEL_ID": "1442268897406619798",
    "CHAT_CHANNEL_ID": "1442266154516091020",
    "CMD_CHANNEL_ID": "1441888236833210389",
    "ANTICHEAT_WEBHOOK_URL": "https://discord.com/api/webhooks/1441660384443498578/cCBalfn0kXDaV3GjdeqyGMbXTqOEoQMyx8yFZRauypmWTpIZlM40xBrOGcsP5wNWzLvM",
    "GITHUB_TOKEN": "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",
    "GITHUB_REPO_OWNER": "xpe-hub",
    "GITHUB_REPO_NAME": "stealth-bot-nuevo",
    "REPO_TARGET_BRANCH": "main",
    "MINIMAX_API_KEY": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwic3RlYWx0aC1tYW5hZ2VyLWFpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5ODg0Njg4Mjk5ODE3NzgzMTgiLCJQaG9uZSI6IiIsIkdyb3VwSUQiOiIxOTg4NDY4ODI5OTc3NTc5OTE4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoieHBlcGFuZWxzQEdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTExLTI2IDAwOjE4OjU1IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA",
    "SERVER_ANALYSIS_ENABLED": "true",
    "SERVER_ANALYSIS_INTERVAL": "300",
    "COMMUNITY_SERVER_INVITE": "https://discord.gg/stealth-anticheat",
    "DATABASE_NAME": "stealth_bot_db",
    "BACKUP_ENABLED": "true",
    "LOG_LEVEL": "info",
    "LOG_TO_FILE": "true",
    "SERVER_PORT": "3000"
}

def setup_headers():
    """Configurar headers para la API de Railway"""
    return {
        "Authorization": f"Bearer {RAILWAY_TOKEN}",
        "Content-Type": "application/json"
    }

def get_service_variables():
    """Obtener variables actuales del servicio"""
    print("🔍 Verificando variables actuales del servicio...")
    
    try:
        # API de Railway para variables
        url = f"https://railway.app/api/v2/service/{SERVICE_ID}/variable"
        response = requests.get(url, headers=setup_headers())
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Variables actuales encontradas: {len(data.get('variables', []))}")
            return data
        else:
            print(f"Error al obtener variables: {response.text}")
            return None
            
    except Exception as e:
        print(f"Error de conexión: {e}")
        return None

def create_variable(name, value):
    """Crear una variable de entorno"""
    print(f"⚙️ Configurando {name}...")
    
    try:
        url = f"https://railway.app/api/v2/service/{SERVICE_ID}/variable"
        payload = {
            "name": name,
            "value": str(value)
        }
        
        response = requests.post(url, json=payload, headers=setup_headers())
        
        if response.status_code == 200:
            print(f"✅ {name} configurado correctamente")
            return True
        elif response.status_code == 409:
            # Variable ya existe, intentar actualizarla
            print(f"🔄 {name} ya existe, actualizando...")
            return update_variable(name, value)
        else:
            print(f"❌ Error configurando {name}: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creando {name}: {e}")
        return False

def update_variable(name, value):
    """Actualizar una variable existente"""
    try:
        url = f"https://railway.app/api/v2/service/{SERVICE_ID}/variable/{name}"
        payload = {
            "value": str(value)
        }
        
        response = requests.patch(url, json=payload, headers=setup_headers())
        
        if response.status_code == 200:
            print(f"✅ {name} actualizado correctamente")
            return True
        else:
            print(f"❌ Error actualizando {name}: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error actualizando {name}: {e}")
        return False

def restart_service():
    """Reiniciar el servicio de Railway"""
    print("🔄 Reiniciando servicio de Railway...")
    
    try:
        # API para reiniciar servicio
        url = f"https://railway.app/api/v2/service/{SERVICE_ID}/deployments/restart"
        response = requests.post(url, headers=setup_headers())
        
        if response.status_code == 200:
            print("✅ Servicio reiniciado correctamente")
            return True
        else:
            print(f"❌ Error reiniciando servicio: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error reiniciando servicio: {e}")
        return False

def main():
    """Función principal de configuración"""
    print("🚀 Iniciando configuración automática de Railway")
    print(f"📋 Configurando {len(env_vars)} variables de entorno...")
    print(f"🆔 Service ID: {SERVICE_ID}")
    print("-" * 60)
    
    # Verificar variables actuales
    current_vars = get_service_variables()
    
    # Configurar cada variable
    success_count = 0
    for var_name, var_value in env_vars.items():
        if create_variable(var_name, var_value):
            success_count += 1
        
        # Pequeña pausa para evitar rate limiting
        time.sleep(0.5)
    
    print("-" * 60)
    print(f"📊 Variables configuradas: {success_count}/{len(env_vars)}")
    
    if success_count == len(env_vars):
        print("✅ Todas las variables configuradas correctamente!")
        
        # Reiniciar servicio
        if restart_service():
            print("🎉 ¡Configuración completada! El bot se reiniciará automáticamente.")
            print("⏱️  Espera 1-2 minutos y revisa los logs para verificar que esté funcionando.")
        else:
            print("⚠️  Variables configuradas, pero falló el reinicio automático.")
            print("🔧 Puedes reiniciar manualmente desde el dashboard de Railway.")
    else:
        print(f"⚠️  Solo se configuraron {success_count}/{len(env_vars)} variables.")
        print("🔧 Revisa los errores arriba y vuelve a intentar.")

if __name__ == "__main__":
    main()