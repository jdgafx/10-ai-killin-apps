#!/bin/bash
set -e

TOKEN="O3gYLLrl9b1fjeAfQ1ZQCcVO"

APPS=(
  "app-01-rag-chat"
  "app-02-research-agent"
  "app-03-ui-builder"
  "app-04-sql-generator"
  "app-05-voice-chat"
  "app-06-doc-processor"
  "app-07-semantic-search"
  "app-08-content-generator"
  "app-09-agent-orchestrator"
  "app-10-rag-knowledge-base"
)

echo "🚀 Deploying 10 AI Apps to Vercel..."
echo ""

for app in "${APPS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Deploying: $app"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cd "/home/chris/dev/10-ai-killin-apps/apps/$app"
  vercel --token "$TOKEN" --yes --prod | tee "/tmp/deploy-$app.log"
  echo ""
done

echo "✅ All 10 apps deployed!"
echo ""
echo "📝 Collecting deployment URLs..."
grep -h "Production: " /tmp/deploy-app-*.log || echo "Check logs for URLs"
