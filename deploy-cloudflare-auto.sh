#!/bin/bash
set -e

export CLOUDFLARE_API_TOKEN="R_9JqiurpTj5MhL3oDDitRumde4tWYSuhpoRcB8h"
export CLOUDFLARE_ACCOUNT_ID="6e1d67cd22e25bfe13e47eb76e05d1f3"

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

echo "🚀 Deploying ALL 10 Apps to Cloudflare Pages..."
echo ""

for app in "${APPS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Deploying: $app"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  cd "/home/chris/dev/10-ai-killin-apps/apps/$app"
  
  # Build
  echo "Building..."
  npm run build
  
  # Deploy (auto-create project if needed)
  echo "Deploying..."
  echo "yes" | npx wrangler pages deploy dist --project-name="$app" --branch=main || npx wrangler pages deploy dist --project-name="$app" --branch=main
  
  echo "✅ $app deployed!"
  echo ""
  cd /home/chris/dev/10-ai-killin-apps
done

echo ""
echo "✅✅✅ ALL 10 APPS DEPLOYED! ✅✅✅"
echo ""
echo "🌐 Live URLs:"
for app in "${APPS[@]}"; do
  echo "   https://$app.pages.dev"
done
