#!/usr/bin/env python3
"""
Configurador de Railway usando GraphQL API
Método oficial de Railway para automatización
"""

import requests
import json
import time

# Token de Railway
RAILWAY_TOKEN = "841554ac-1557-437c-b0ac-fc58d2f6387f"
SERVICE_ID = "fdf91d31-9d3f-43dd-a55a-4a01571124e9"

# GraphQL endpoint de Railway
RAILWAY_GRAPHQL_URL = "https://railway.app/api/v2/query"

# Variables de entorno
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
    """Configurar headers para la API GraphQL de Railway"""
    return {
        "Authorization": f"Bearer {RAILWAY_TOKEN}",
        "Content-Type": "application/json"
    }

def graphql_query(query, variables=None):
    """Ejecutar consulta GraphQL en Railway"""
    payload = {
        "query": query,
        "variables": variables or {}
    }
    
    try:
        response = requests.post(RAILWAY_GRAPHQL_URL, json=payload, headers=setup_headers())
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error HTTP {response.status_code}: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def create_service_variable(name, value):
    """Crear variable de entorno en el servicio usando GraphQL"""
    print(f"⚙️ Configurando {name}...")
    
    # Query GraphQL para crear variable
    query = """
    mutation SetServiceVariable($input: SetServiceVariableInput!) {
        setServiceVariable(input: $input) {
            id
            name
            value
        }
    }
    """
    
    variables = {
        "input": {
            "serviceId": SERVICE_ID,
            "name": name,
            "value": str(value)
        }
    }
    
    result = graphql_query(query, variables)
    
    if result and "errors" not in result:
        print(f"✅ {name} configurado correctamente")
        return True
    else:
        print(f"❌ Error configurando {name}: {result}")
        return False

def restart_deployment():
    """Reiniciar el deployment usando GraphQL"""
    print("🔄 Reiniciando deployment...")
    
    query = """
    mutation RestartDeployment($input: RestartDeploymentInput!) {
        restartDeployment(input: $input) {
            id
            status
        }
    }
    """
    
    variables = {
        "input": {
            "serviceId": SERVICE_ID
        }
    }
    
    result = graphql_query(query, variables)
    
    if result and "errors" not in result:
        print("✅ Deployment reiniciado correctamente")
        return True
    else:
        print(f"❌ Error reiniciando deployment: {result}")
        return False

def get_project_info():
    """Obtener información del proyecto para verificar que tenemos acceso"""
    print("🔍 Verificando acceso al proyecto...")
    
    query = """
    query {
        project(id: "fdf91d31-9d3f-43dd-a55a-4a01571124e9") {
            id
            name
            services {
                id
                name
            }
        }
    }
    """
    
    result = graphql_query(query)
    
    if result and "errors" not in result:
        project = result.get("data", {}).get("project", {})
        print(f"✅ Proyecto: {project.get('name', 'Unknown')}")
        services = project.get("services", [])
        print(f"📋 Servicios encontrados: {len(services)}")
        for service in services:
            print(f"  - {service['name']} ({service['id']})")
        return True
    else:
        print(f"❌ Error accediendo al proyecto: {result}")
        return False

def main():
    """Función principal"""
    print("🚀 Configuración automática de Railway usando GraphQL")
    print(f"🆔 Service ID: {SERVICE_ID}")
    print(f"🔑 Token: {RAILWAY_TOKEN[:20]}...")
    print("-" * 60)
    
    # Verificar acceso
    if not get_project_info():
        print("❌ No se puede acceder al proyecto. Verifica el token.")
        return
    
    # Configurar variables
    success_count = 0
    for var_name, var_value in env_vars.items():
        if create_service_variable(var_name, var_value):
            success_count += 1
        time.sleep(0.5)  # Evitar rate limiting
    
    print("-" * 60)
    print(f"📊 Variables configuradas: {success_count}/{len(env_vars)}")
    
    if success_count == len(env_vars):
        print("✅ Todas las variables configuradas correctamente!")
        
        # Reiniciar deployment
        if restart_deployment():
            print("🎉 ¡Configuración completada!")
            print("⏱️  El bot se reiniciará automáticamente en 1-2 minutos.")
            print("📊 Revisa los logs en Railway para confirmar el funcionamiento.")
        else:
            print("⚠️  Variables configuradas, pero falló el reinicio automático.")
            print("🔧 Puedes reiniciar manualmente desde Railway dashboard.")
    else:
        print(f"⚠️  Solo se configuraron {success_count}/{len(env_vars)} variables.")
        print("🔧 Revisa los errores arriba.")

if __name__ == "__main__":
    main()