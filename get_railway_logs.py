#!/usr/bin/env python3
"""
Script para obtener logs de Railway
"""

import requests
import json

# Token de Railway
RAILWAY_TOKEN = "841554ac-1557-437c-b0ac-fc58d2f6387f"

def get_railway_logs():
    """Obtener logs del proyecto Railway"""
    
    # Query para obtener proyectos y deployments
    query = """
    query {
        projects {
            edges {
                node {
                    id
                    name
                    description
                    deployments(first: 10) {
                        edges {
                            node {
                                id
                                status
                                buildLogs
                                deployLogs
                                createdAt
                                updatedAt
                            }
                        }
                    }
                }
            }
        }
    }
    """
    
    headers = {
        "Authorization": f"Bearer {RAILWAY_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(
            "https://railway.app/api/v2/query",
            headers=headers,
            json={"query": query}
        )
        
        print("📊 Respuesta de Railway API:")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Buscar el proyecto del bot
            for project_edge in data.get("data", {}).get("projects", {}).get("edges", []):
                project = project_edge.get("node", {})
                project_name = project.get("name", "")
                
                if "stealth" in project_name.lower() or "bot" in project_name.lower():
                    print(f"\n🤖 Proyecto encontrado: {project_name}")
                    print(f"ID: {project.get('id', 'N/A')}")
                    
                    # Ver deployments
                    deployments = project.get("deployments", {}).get("edges", [])
                    if deployments:
                        latest_deployment = deployments[0].get("node", {})
                        print(f"\n📦 Deployment más reciente:")
                        print(f"Status: {latest_deployment.get('status', 'N/A')}")
                        print(f"Creado: {latest_deployment.get('createdAt', 'N/A')}")
                        print(f"Actualizado: {latest_deployment.get('updatedAt', 'N/A')}")
                        
                        # Logs de construcción
                        build_logs = latest_deployment.get("buildLogs", "")
                        deploy_logs = latest_deployment.get("deployLogs", "")
                        
                        if build_logs:
                            print(f"\n📝 Build Logs (últimas 1000 chars):")
                            print(build_logs[-1000:])
                        
                        if deploy_logs:
                            print(f"\n📝 Deploy Logs (últimas 1000 chars):")
                            print(deploy_logs[-1000:])
                        
                        return latest_deployment.get('id', '')
                    else:
                        print("❌ No se encontraron deployments")
                        break
            
            print("❌ No se encontró el proyecto del bot")
            return None
            
        else:
            print(f"❌ Error en la API: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error al conectar con Railway: {e}")
        return None

if __name__ == "__main__":
    print("🔍 Obteniendo logs de Railway...")
    deployment_id = get_railway_logs()
    
    if deployment_id:
        print(f"\n✅ Deployment ID encontrado: {deployment_id}")
        print("🎯 Ahora necesitamos revisar los logs en tiempo real del deployment")
    else:
        print("\n❌ No se pudo obtener información del deployment")