#!/usr/bin/env python3
"""
Configurador Automático de Railway
Configura automáticamente TODAS las variables del bot usando API Token
"""

import requests
import json
import time
from typing import Dict, List, Optional, Tuple

class RailwayAutoConfigurator:
    def __init__(self, api_token: str):
        self.api_token = api_token
        self.base_url = "https://backboard.railway.app/graphql/v2"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_token}"
        }
        
    def authenticate(self) -> Tuple[bool, str]:
        """Autenticar y verificar permisos del token"""
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
                    error_msg = data['errors'][0]['message']
                    return False, f"Error de autenticación: {error_msg}"
                
                user = data.get("data", {}).get("me", {})
                print(f"✅ Autenticado como: {user.get('name', 'Unknown')} ({user.get('email', 'Unknown')})")
                return True, "Autenticación exitosa"
            else:
                return False, f"Error HTTP {response.status_code}: {response.text[:100]}"
                
        except Exception as e:
            return False, f"Error de conexión: {str(e)}"
    
    def get_workspace_projects(self) -> List[Dict]:
        """Obtener todos los proyectos del workspace"""
        try:
            query = """
            query {
                projects {
                    id
                    name
                    description
                    createdAt
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
                    raise Exception(f"Error GraphQL: {data['errors'][0]['message']}")
                
                projects = data.get("data", {}).get("projects", [])
                print(f"✅ Encontrados {len(projects)} proyectos en el workspace")
                return projects
            else:
                raise Exception(f"Error HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error obteniendo proyectos: {str(e)}")
            return []
    
    def find_stealth_bot_project(self, projects: List[Dict]) -> Optional[Dict]:
        """Buscar proyecto stealth-bot-nuevo"""
        target_names = ["stealth-bot-nuevo", "stealth bot", "stealth_bot", "stealth-bot"]
        
        for project in projects:
            name_lower = project['name'].lower()
            if any(target in name_lower for target in target_names):
                print(f"✅ Proyecto encontrado: {project['name']} (ID: {project['id']})")
                return project
        
        # Si no se encuentra exacto, mostrar opciones
        print("❌ No se encontró 'stealth-bot-nuevo'. Proyectos disponibles:")
        for i, project in enumerate(projects, 1):
            print(f"  {i}. {project['name']} (ID: {project['id']})")
        
        # Buscar proyectos que contengan "stealth"
        stealth_projects = [p for p in projects if "stealth" in p['name'].lower()]
        if stealth_projects:
            print("🎯 Proyectos con 'stealth' encontrados:")
            for project in stealth_projects:
                print(f"  - {project['name']} (ID: {project['id']})")
            return stealth_projects[0]  # Usar el primero que contenga "stealth"
        
        return None
    
    def get_project_services(self, project_id: str) -> List[Dict]:
        """Obtener servicios del proyecto"""
        try:
            query = f"""
            query {{
                project(id: "{project_id}") {{
                    id
                    name
                    services {{
                        id
                        name
                        createdAt
                        type
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
                    raise Exception(f"Error GraphQL: {data['errors'][0]['message']}")
                
                project = data.get("data", {}).get("project", {})
                services = project.get("services", [])
                print(f"✅ Proyecto '{project.get('name', 'Unknown')}' tiene {len(services)} servicios:")
                for service in services:
                    print(f"  - {service['name']} (ID: {service['id']}, Tipo: {service['type']})")
                return services
            else:
                raise Exception(f"Error HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error obteniendo servicios: {str(e)}")
            return []
    
    def find_bot_service(self, services: List[Dict]) -> Optional[Dict]:
        """Encontrar el servicio del bot"""
        # Prioridades para encontrar el servicio del bot
        target_names = ["stealth-bot", "bot", "discord-bot", "main"]
        
        for service in services:
            name_lower = service['name'].lower()
            if any(target in name_lower for target in target_names):
                print(f"✅ Servicio del bot encontrado: {service['name']} (ID: {service['id']})")
                return service
        
        # Si no se encuentra específico, usar el primer servicio
        if services:
            print(f"🎯 Usando primer servicio disponible: {services[0]['name']} (ID: {services[0]['id']})")
            return services[0]
        
        return None
    
    def get_service_variables(self, service_id: str) -> List[Dict]:
        """Obtener variables actuales del servicio"""
        try:
            query = f"""
            query {{
                service(id: "{service_id}") {{
                    id
                    name
                    environment {{
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
                    raise Exception(f"Error GraphQL: {data['errors'][0]['message']}")
                
                service = data.get("data", {}).get("service", {})
                environment = service.get("environment", [])
                
                print(f"✅ Servicio '{service.get('name', 'Unknown')}' tiene {len(environment)} variables:")
                for var in environment:
                    print(f"  - {var['name']}: {var['value'][:20]}...")
                
                return environment
            else:
                raise Exception(f"Error HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error obteniendo variables: {str(e)}")
            return []
    
    def delete_variable(self, service_id: str, variable_name: str) -> bool:
        """Eliminar una variable (para limpiar placeholders)"""
        try:
            mutation = """
            mutation deleteVariable($serviceId: String!, $name: String!) {
                deleteEnvironmentVariable(serviceId: $serviceId, name: $name) {
                    id
                    name
                }
            }
            """
            
            variables = {
                "serviceId": service_id,
                "name": variable_name
            }
            
            response = requests.post(
                self.base_url,
                json={"query": mutation, "variables": variables},
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "errors" in data:
                    print(f"⚠️  No se pudo eliminar {variable_name}: {data['errors'][0]['message']}")
                    return False
                else:
                    print(f"✅ Variable eliminada: {variable_name}")
                    return True
            else:
                print(f"⚠️  Error HTTP eliminando {variable_name}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"⚠️  Error eliminando {variable_name}: {str(e)}")
            return False
    
    def create_variable(self, service_id: str, variable_name: str, variable_value: str) -> bool:
        """Crear/actualizar una variable"""
        try:
            mutation = """
            mutation upsertEnvironmentVariable($serviceId: String!, $name: String!, $value: String!) {
                upsertEnvironmentVariable(serviceId: $serviceId, name: $name, value: $value) {
                    id
                    name
                    value
                }
            }
            """
            
            variables = {
                "serviceId": service_id,
                "name": variable_name,
                "value": variable_value
            }
            
            response = requests.post(
                self.base_url,
                json={"query": mutation, "variables": variables},
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "errors" in data:
                    print(f"❌ Error configurando {variable_name}: {data['errors'][0]['message']}")
                    return False
                else:
                    print(f"✅ Variable configurada: {variable_name}")
                    return True
            else:
                print(f"❌ Error HTTP configurando {variable_name}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error configurando {variable_name}: {str(e)}")
            return False
    
    def cleanup_placeholder_variables(self, service_id: str, current_variables: List[Dict]) -> int:
        """Limpiar variables placeholder (YOUR_*)"""
        placeholder_names = []
        for var in current_variables:
            if (var['name'].startswith('YOUR_') or 
                'YOUR' in var['value'] or
                var['value'].startswith('YOUR_') or
                var['value'] == 'null' or
                var['value'] == ''):
                placeholder_names.append(var['name'])
        
        print(f"🧹 Encontradas {len(placeholder_names)} variables placeholder para eliminar:")
        for name in placeholder_names:
            print(f"  - {name}")
        
        deleted_count = 0
        for name in placeholder_names:
            if self.delete_variable(service_id, name):
                deleted_count += 1
            time.sleep(0.5)  # Pequeña pausa entre eliminaciones
        
        return deleted_count
    
    def configure_all_variables(self, service_id: str, variables: Dict[str, str]) -> Tuple[int, int]:
        """Configurar todas las variables del bot"""
        print(f"\n🚀 Configurando {len(variables)} variables del bot...")
        
        success_count = 0
        failed_count = 0
        
        for name, value in variables.items():
            print(f"\n📝 Configurando: {name}")
            print(f"   Valor: {value[:50]}...")
            
            if self.create_variable(service_id, name, value):
                success_count += 1
            else:
                failed_count += 1
            
            time.sleep(0.5)  # Pausa entre configuraciones
        
        return success_count, failed_count
    
    def restart_service(self, service_id: str) -> bool:
        """Reiniciar el servicio"""
        try:
            mutation = """
            mutation restartService($serviceId: String!) {
                restartService(serviceId: $serviceId) {
                    id
                    name
                }
            }
            """
            
            variables = {"serviceId": service_id}
            
            response = requests.post(
                self.base_url,
                json={"query": mutation, "variables": variables},
                headers=self.headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "errors" in data:
                    print(f"❌ Error reiniciando servicio: {data['errors'][0]['message']}")
                    return False
                else:
                    print(f"✅ Servicio reiniciado correctamente")
                    return True
            else:
                print(f"❌ Error HTTP reiniciando servicio: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error reiniciando servicio: {str(e)}")
            return False

def main():
    print("🤖 CONFIGURADOR AUTOMÁTICO DE RAILWAY")
    print("=" * 60)
    
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
    
    # Configurador
    configurator = RailwayAutoConfigurator("")
    
    # Paso 1: Obtener API Token
    print("\n🔐 PASO 1: Autenticación")
    api_token = input("Pega tu API Token de Railway (comienza con 'rail_'): ").strip()
    
    if not api_token:
        print("❌ Token requerido. Configuración cancelada.")
        return
    
    configurator = RailwayAutoConfigurator(api_token)
    
    # Verificar autenticación
    auth_success, auth_msg = configurator.authenticate()
    if not auth_success:
        print(f"❌ {auth_msg}")
        print("💡 Asegúrate de que el token tenga permisos de API correctos")
        return
    
    # Paso 2: Obtener proyectos
    print("\n📁 PASO 2: Buscando proyectos")
    projects = configurator.get_workspace_projects()
    if not projects:
        print("❌ No se pudieron obtener proyectos")
        return
    
    # Paso 3: Encontrar proyecto
    print("\n🔍 PASO 3: Buscando proyecto stealth-bot-nuevo")
    stealth_project = configurator.find_stealth_bot_project(projects)
    if not stealth_project:
        print("❌ No se pudo encontrar el proyecto")
        return
    
    # Paso 4: Obtener servicios
    print("\n⚙️ PASO 4: Obteniendo servicios del proyecto")
    services = configurator.get_project_services(stealth_project["id"])
    if not services:
        print("❌ No se pudieron obtener servicios")
        return
    
    # Paso 5: Encontrar servicio del bot
    print("\n🤖 PASO 5: Buscando servicio del bot")
    bot_service = configurator.find_bot_service(services)
    if not bot_service:
        print("❌ No se pudo encontrar el servicio del bot")
        return
    
    # Paso 6: Obtener variables actuales
    print(f"\n📋 PASO 6: Analizando variables del servicio {bot_service['name']}")
    current_variables = configurator.get_service_variables(bot_service["id"])
    
    # Paso 7: Limpiar placeholders
    print("\n🧹 PASO 7: Limpiando variables placeholder")
    if current_variables:
        deleted = configurator.cleanup_placeholder_variables(bot_service["id"], current_variables)
        print(f"✅ Eliminadas {deleted} variables placeholder")
        time.sleep(2)  # Esperar que Railway procese las eliminaciones
    
    # Paso 8: Configurar variables
    print("\n🚀 PASO 8: Configurando variables del bot")
    success, failed = configurator.configure_all_variables(bot_service["id"], bot_variables)
    
    print(f"\n📊 RESUMEN DE CONFIGURACIÓN:")
    print(f"✅ Variables configuradas correctamente: {success}")
    print(f"❌ Variables con errores: {failed}")
    
    if failed == 0:
        # Paso 9: Reiniciar servicio
        print("\n🔄 PASO 9: Reiniciando servicio")
        if configurator.restart_service(bot_service["id"]):
            print("\n🎉 ¡CONFIGURACIÓN COMPLETADA!")
            print("⏰ Espera 2-3 minutos para que el bot se inicie")
            print("📱 Luego revisa los logs en Railway para verificar que funcione")
            print("🔍 Busca el mensaje: 'Bot está listo y funcionando!'")
        else:
            print("\n⚠️  Configuración completada, pero no se pudo reiniciar automáticamente")
            print("💡 Reinicia manualmente desde Railway Dashboard")
    else:
        print(f"\n⚠️  Hubo {failed} errores en la configuración")
        print("💡 Revisa los logs arriba y configura manualmente las variables fallidas")

if __name__ == "__main__":
    main()