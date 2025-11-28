#!/bin/bash
# Script para obtener logs de Railway usando curl

echo "🔍 Obteniendo logs de Railway..."

# Token de Railway
TOKEN="841554ac-1557-437c-b0ac-fc58d2f6387f"

# Consulta GraphQL para obtener proyectos
QUERY='{
  "query": "query { projects(first: 10) { edges { node { id name description services(first: 10) { edges { node { id name environmentId } } } deployments(first: 5) { edges { node { id status buildLogs deployLogs createdAt updatedAt } } } } } } } }"
}'

# Realizar petición
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$QUERY" \
  "https://railway.app/api/v2/query" | jq '.' > /tmp/railway_response.json

echo "📊 Respuesta de Railway:"
cat /tmp/railway_response.json

# Buscar información específica del bot
echo ""
echo "🤖 Buscando proyecto del bot..."
cat /tmp/railway_response.json | jq '.data.projects.edges[] | select(.node.name | test("stealth|bot"; "i")) | .node'

echo ""
echo "📦 Último deployment:"
cat /tmp/railway_response.json | jq '.data.projects.edges[] | select(.node.name | test("stealth|bot"; "i")) | .node.deployments.edges[0].node'