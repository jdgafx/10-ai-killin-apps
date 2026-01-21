#!/bin/bash
export CLOUDFLARE_API_TOKEN="R_9JqiurpTj5MhL3oDDitRumde4tWYSuhpoRcB8h"
export CLOUDFLARE_ACCOUNT_ID="6e1d67cd22e25bfe13e47eb76e05d1f3"

cd apps/app-01-rag-chat && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-01-rag-chat") && cd ../..
cd apps/app-02-research-agent && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-02-research-agent") && cd ../..
cd apps/app-03-ui-builder && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-03-ui-builder") && cd ../..
cd apps/app-04-sql-generator && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-04-sql-generator") && cd ../..
cd apps/app-05-voice-chat && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-05-voice-chat") && cd ../..
cd apps/app-06-doc-processor && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-06-doc-processor") && cd ../..
cd apps/app-07-semantic-search && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-07-semantic-search") && cd ../..
cd apps/app-08-content-generator && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-08-content-generator") && cd ../..
cd apps/app-09-agent-orchestrator && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-09-agent-orchestrator") && cd ../..
cd apps/app-10-rag-knowledge-base && npm run build && (echo -e "yes\nmain" | npx wrangler pages deploy dist --project-name="app-10-rag-knowledge-base") && cd ../..

echo "✅ ALL DEPLOYED!"
