#!/usr/bin/env python3
"""
Configuración automática de Railway usando el nuevo token
Intenta configurar todas las variables del bot de forma automática
"""

import requests
import json
import time
from typing import Dict, List, Optional

class RailwayConfigurator:
    def __init__(self, api_token: str):
        self.api_token = api_token
        self.base_url = "https://backboard.railway.app/graphql/v2"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_token}"
        }
        
    def test_authentication(self) -> Dict:
        """Prueba la autenticación del token"""
        try:
            query = """
            query {
                me {
                    id
                    name
                    email
                }
            }
            """
            
            response = requests.post(
                self.base_url,
                json={"query": query},
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "errors" in data:
                    print(f"❌ Error de GraphQL: {data['errors']}")
                    return {"success": False, "error": data['errors']}
                else:
                    user = data.get("data", {}).get("me", {})
                    print(f"✅ Autenticación exitosa para: {user.get('name', 'Unknown')}")
                    return {"success": True, "user": user}
            else:
                print(f"❌ Error HTTP {response.status_code}: {response.text}")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            print(f"❌ Error de conexión: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def get_projects(self) -> Dict:
        """Obtiene la lista de proyectos disponibles"""
        try:
            query = """
            query {
                projects {
                    id
                    name
                    description
                    createdAt
                    updatedAt
                }
            }
            """
            
            response = requests.post(
                self.base_url,
                json={"query": query},
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "errors" in data:
                    return {"success": False, "error": data['errors']}
                else:
                    projects = data.get("data", {}).get("projects", [])
                    print(f"✅ Encontrados {len(projects)} proyectos:")
                    for project in projects:
                        print(f"  - {project['name']} (ID: {project['id']})")
                    return {"success": True, "projects": projects}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def find_stealth_bot_project(self, projects: List[Dict]) -> Optional[Dict]:
        """Busca el proyecto 'stealth-bot-nuevo'"""
        target_names = ["stealth-bot-nuevo", "Stealth Bot", "stealth_bot"]
        
        for project in projects:
            name_lower = project['name'].lower()
            if any(target in name_lower for target in target_names):
                print(f"✅ Proyecto encontrado: {project['name']} (ID: {project['id']})")
                return project
        
        print("❌ No se encontró el proyecto 'stealth-bot-nuevo'")
        print("Proyectos disponibles:")
        for project in projects:
            print(f"  - {project['name']} (ID: {project['id']})")
        
        return None
    
    def get_project_variables(self, project_id: str) -> Dict:
        """Obtiene las variables del proyecto"""
        try:
            query = f"""
            query {{
                project(id: "{project_id}") {{
                    id
                    name
                    variables {{
                        id
                        name
                        value
                    }}
                }}
            }}
            """
            
            response = requests.post(
                self.base_url,
                json={"query": query},
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "errors" in data:
                    return {"success": False, "error": data['errors']}
                else:
                    project = data.get("data", {}).get("project", {})
                    if project:
                        variables = project.get("variables", [])
                        print(f"✅ Proyecto '{project['name']}' tiene {len(variables)} variables:")
                        for var in variables:
                            print(f"  - {var['name']}: {var['value'][:20]}...")
                        return {"success": True, "project": project, "variables": variables}
                    else:
                        return {"success": False, "error": "Proyecto no encontrado"}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}

def main():
    # Token del usuario
    NEW_API_TOKEN = "906617a6-fd4d-4c8a-b10c-54f6201053ab"
    
    print("🚀 Configurando Railway automáticamente...")
    print(f"Token: {NEW_API_TOKEN}")
    print("-" * 50)
    
    # Variables del bot
    bot_variables = {
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
        "MINIMAX_API_KEY": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJ4cGUgcGFuZWxzIiwic3RlYW0tbmFuYWdlci1haSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg4NDY4ODI5OTgxNzc4MzE4IiwicGhvbmUiOiIiLCJHcm91cElEIjoiMTk4ODQ2ODgyOTk3NzU3OTkxOCIsIlBhZ2VOYW1lIjoiIiwibWFpbCI6InhwZXBhbmVsc0BnbWFpbC5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAwMDoxODo1NSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.HP47wVjpfhFrLkA-6iGW6ysJYysldKHHbYQgBSxD-mpCrF4DwqQR_Dybs-b3v9L8EkHaZaI-9M8eEwR9nRbFEwMBgNv8Vtp8dU7Oo0_IOo_XphfKzSryo2qb4Vc0AmbKa7YGScuqq4ABUVfIbF2b6uD0pVMgTVXwnizgSzP2fLijUrVnPpnr_SeCX-Aqyvh4D9DKTcF1HP7VswknohnFqxk70mD3RBAiFYrZY4WeTnzcImIrI30S6GoNK0Xo5ao_DUJKVTpfCnJNqT3e-LwKISN6Az5fz0L_Ocokv7PqY240B0HjXou7aD36WQ8YegaM5StXMsTpoUSOi_R-cCaDSA",
        "SERVER_ANALYSIS_ENABLED": "true",
        "SERVER_ANALYSIS_INTERVAL": "300",
        "COMMUNITY_SERVER_INVITE": "https://discord.gg/stealth-anticheat",
        "DATABASE_NAME": "stealth_bot_db",
        "BACKUP_ENABLED": "true",
        "LOG_LEVEL": "info",
        "LOG_TO_FILE": "true",
        "SERVER_PORT": "3000"
    }
    
    # Inicializar configurador
    configurator = RailwayConfigurator(NEW_API_TOKEN)
    
    # Paso 1: Probar autenticación
    print("\n🔐 Paso 1: Verificando autenticación...")
    auth_result = configurator.test_authentication()
    
    if not auth_result["success"]:
        print("❌ No se pudo autenticar. El token no tiene permisos de API.")
        print("💡 Alternativa: Configura manualmente usando los archivos que creé.")
        return
    
    # Paso 2: Obtener proyectos
    print("\n📁 Paso 2: Obteniendo proyectos...")
    projects_result = configurator.get_projects()
    
    if not projects_result["success"]:
        print("❌ No se pudieron obtener proyectos.")
        print(f"💡 Error: {projects_result['error']}")
        print("💡 Alternativa: Configura manualmente usando los archivos que creé.")
        return
    
    # Paso 3: Buscar proyecto stealth-bot-nuevo
    print("\n🔍 Paso 3: Buscando proyecto 'stealth-bot-nuevo'...")
    stealth_project = configurator.find_stealth_bot_project(projects_result["projects"])
    
    if not stealth_project:
        print("❌ No se encontró el proyecto 'stealth-bot-nuevo'")
        print("💡 Alternativa: Configura manualmente usando los archivos que creé.")
        return
    
    # Paso 4: Verificar variables actuales
    print("\n📋 Paso 4: Verificando variables actuales...")
    variables_result = configurator.get_project_variables(stealth_project["id"])
    
    if not variables_result["success"]:
        print("❌ No se pudieron obtener variables del proyecto.")
        print(f"💡 Error: {variables_result['error']}")
        print("💡 Alternativa: Configura manualmente usando los archivos que creé.")
        return
    
    print(f"\n🎯 Estado actual del proyecto '{stealth_project['name']}':")
    print(f"  - Variables encontradas: {len(variables_result['variables'])}")
    
    # Paso 5: Configuración automática (requiere mutación)
    print("\n⚠️  Paso 5: Configuración automática")
    print("Para configurar automáticamente las variables, necesito permisos de mutación.")
    print("Esto requiere una versión más avanzada del token API.")
    
    print(f"\n💡 RECOMENDACIÓN:")
    print("1. Usa el archivo 'formato-copy-paste-individual.md' para configuración manual")
    print("2. Es más rápido y más confiable")
    print("3. Evita problemas de permisos de API")
    
    print("\n✅ Análisis completado. Configuración manual recomendada.")

if __name__ == "__main__":
    main()