import requests
import json
import os
import base64

# Configuración
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
REPO_OWNER = os.getenv('GITHUB_REPO_OWNER', 'xpe-hub')
REPO_NAME = os.getenv('GITHUB_REPO_NAME', 'stealth-bot-nuevo')
BRANCH_NAME = 'main'

# Headers para API de GitHub
headers = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

def get_current_file():
    """Obtener el contenido actual del archivo bot.js"""
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/bot.js'
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        file_data = response.json()
        return file_data['content'], file_data['sha']
    else:
        print(f"Error obteniendo archivo: {response.status_code}")
        print(response.json())
        return None, None

def update_file(content, sha, message):
    """Actualizar el archivo en GitHub"""
    url = f'https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/bot.js'
    
    # Codificar contenido en base64
    encoded_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    
    data = {
        'message': message,
        'content': encoded_content,
        'sha': sha,
        'branch': BRANCH_NAME
    }
    
    response = requests.put(url, headers=headers, json=data)
    
    if response.status_code == 200:
        print("✅ Archivo actualizado exitosamente!")
        return True
    else:
        print(f"❌ Error actualizando archivo: {response.status_code}")
        print(response.json())
        return False

def main():
    # Leer el archivo bot.js corregido
    try:
        with open('/workspace/bot.js', 'r', encoding='utf-8') as f:
            new_content = f.read()
    except Exception as e:
        print(f"❌ Error leyendo bot.js: {e}")
        return
    
    # Obtener contenido actual
    current_content, sha = get_current_file()
    if not current_content or not sha:
        print("❌ No se pudo obtener el archivo actual")
        return
    
    # Decodificar contenido actual
    try:
        decoded_current = base64.b64decode(current_content.encode('utf-8')).decode('utf-8')
    except Exception as e:
        print(f"❌ Error decodificando contenido actual: {e}")
        return
    
    # Verificar si hay cambios
    if decoded_current.strip() == new_content.strip():
        print("ℹ️  No hay cambios en el archivo")
        return
    
    print("🔄 Subiendo cambios a GitHub...")
    
    # Commit message
    commit_message = """🔧 Fix: Comando $vc - Corrección de lógica

- Eliminado: Verificación innecesaria de usuario en voz
- Agregado: Bot se conecta directamente al canal especificado  
- Mejorado: Manejo de errores y mensajes de confirmación
- Solucionado: Error 'Target user is not connected to voice'

Desarrollado por: xpe.nettt
Fecha: $(date +'%Y-%m-%d %H:%M:%S')"""
    
    # Actualizar archivo
    if update_file(new_content, sha, commit_message):
        print("🎉 ¡Cambios subidos exitosamente!")
        print(f"🔗 Ver en: https://github.com/{REPO_OWNER}/{REPO_NAME}")
        print("🔄 Railway se actualizará automáticamente en ~2-3 minutos")
    else:
        print("❌ Error subiendo cambios")

if __name__ == "__main__":
    main()