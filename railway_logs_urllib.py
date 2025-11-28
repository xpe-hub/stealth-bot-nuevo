#!/usr/bin/env python3
"""
Script para obtener logs de Railway usando urllib (sin dependencias externas)
"""

import urllib.request
import urllib.parse
import json
import ssl

def get_railway_logs():
    """Obtener logs del proyecto Railway usando urllib"""
    
    # Token de Railway
    RAILWAY_TOKEN = "841554ac-1557-437c-b0ac-fc58d2f6387f"
    
    # Crear contexto SSL sin verificación (para desarrollo)
    context = ssl._create_unverified_context()
    
    # Query GraphQL para obtener proyectos y deployments
    query_data = {
        "query": """
        query {
            projects(first: 10) {
                edges {
                    node {
                        id
                        name
                        description
                        services(first: 10) {
                            edges {
                                node {
                                    id
                                    name
                                    environmentId
                                }
                            }
                        }
                        deployments(first: 5) {
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
    }
    
    # Codificar los datos
    json_data = json.dumps(query_data).encode('utf-8')
    
    # Crear la petición
    req = urllib.request.Request(
        "https://railway.app/api/v2/query",
        data=json_data,
        headers={
            "Authorization": f"Bearer {RAILWAY_TOKEN}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    
    try:
        # Realizar la petición
        print("🔍 Conectando a Railway API...")
        response = urllib.request.urlopen(req, context=context)
        response_data = response.read().decode('utf-8')
        
        # Parsear la respuesta JSON
        data = json.loads(response_data)
        
        print("✅ Conexión exitosa con Railway")
        print(f"Status Code: {response.status}")
        
        # Buscar el proyecto del bot
        projects = data.get("data", {}).get("projects", {}).get("edges", [])
        bot_project = None
        
        for project_edge in projects:
            project = project_edge.get("node", {})
            project_name = project.get("name", "").lower()
            
            if "stealth" in project_name or "bot" in project_name:
                bot_project = project
                break
        
        if bot_project:
            print(f"\n🤖 Proyecto encontrado: {bot_project.get('name', 'N/A')}")
            print(f"ID: {bot_project.get('id', 'N/A')}")
            print(f"Descripción: {bot_project.get('description', 'N/A')}")
            
            # Ver deployments
            deployments = bot_project.get("deployments", {}).get("edges", [])
            if deployments:
                print(f"\n📦 Deployments encontrados: {len(deployments)}")
                
                for i, deployment_edge in enumerate(deployments[:3]):  # Mostrar solo los 3 más recientes
                    deployment = deployment_edge.get("node", {})
                    print(f"\n📋 Deployment {i+1}:")
                    print(f"   Status: {deployment.get('status', 'N/A')}")
                    print(f"   Creado: {deployment.get('createdAt', 'N/A')}")
                    print(f"   Actualizado: {deployment.get('updatedAt', 'N/A')}")
                    print(f"   ID: {deployment.get('id', 'N/A')}")
                    
                    # Logs de construcción
                    build_logs = deployment.get("buildLogs", "")
                    if build_logs and len(build_logs) > 0:
                        print(f"   📝 Build Logs encontrados (longitud: {len(build_logs)} chars)")
                        # Mostrar últimas líneas
                        lines = build_logs.split('\n')
                        if len(lines) > 5:
                            print("      Últimas líneas del build:")
                            for line in lines[-5:]:
                                print(f"        {line}")
                        else:
                            print("      Build logs completos:")
                            print(f"        {build_logs[:500]}...")
                    
                    # Logs de deploy
                    deploy_logs = deployment.get("deployLogs", "")
                    if deploy_logs and len(deploy_logs) > 0:
                        print(f"   📝 Deploy Logs encontrados (longitud: {len(deploy_logs)} chars)")
                        # Mostrar últimas líneas
                        lines = deploy_logs.split('\n')
                        if len(lines) > 10:
                            print("      Últimas líneas del deploy:")
                            for line in lines[-10:]:
                                print(f"        {line}")
                        else:
                            print("      Deploy logs completos:")
                            print(f"        {deploy_logs[:800]}...")
                    
                    if i == 0:  # Solo mostrar detalles del más reciente
                        print(f"\n🎯 ANÁLISIS DEL DEPLOYMENT MÁS RECIENTE:")
                        print(f"   - Status: {deployment.get('status', 'N/A')}")
                        if deployment.get('status') == 'SUCCESS':
                            print("   ✅ Deployment exitoso")
                        elif deployment.get('status') == 'FAILURE':
                            print("   ❌ Deployment falló")
                        elif deployment.get('status') == 'RUNNING':
                            print("   🔄 Deployment en progreso")
                        
                        # Verificar si hay errores en los logs
                        if build_logs:
                            if "error" in build_logs.lower() or "failed" in build_logs.lower():
                                print("   ⚠️  Errores detectados en build logs")
                        
                        if deploy_logs:
                            if "error" in deploy_logs.lower() or "failed" in deploy_logs.lower():
                                print("   ⚠️  Errores detectados en deploy logs")
                        
                        return deployment.get('id', '')
            else:
                print("❌ No se encontraron deployments para el proyecto del bot")
                
        else:
            print("❌ No se encontró el proyecto del bot")
            print(f"Proyectos disponibles: {[p.get('node', {}).get('name', 'N/A') for p in projects]}")
            
        return None
            
    except urllib.error.HTTPError as e:
        print(f"❌ Error HTTP: {e.code} - {e.reason}")
        print(f"Response: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"❌ Error al conectar con Railway: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Iniciando diagnóstico de Railway...")
    deployment_id = get_railway_logs()
    
    if deployment_id:
        print(f"\n✅ Deployment ID obtenido: {deployment_id}")
        print("🎯 Ahora podemos investigar problemas específicos del bot")
    else:
        print("\n❌ No se pudo obtener información del deployment")
    
    print("\n💡 Siguientes pasos:")
    print("1. Revisar los logs para errores específicos")
    print("2. Verificar variables de entorno en Railway")
    print("3. Comprobar si la IA MiniMax está configurada correctamente")
    print("4. Revisar dependencias (axios, discord.js, etc.)")