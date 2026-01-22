# Comprehensive AI Portfolio Deployment Guide

## Cloudflare Workers SDK Edition

### Your AI Providers (MiniMax, Claude via Copilot API, Gemini, DeepSeek) + Cloudflare Workers + Agents SDK

---

## Document Philosophy

This guide represents a **complete pivot** to Cloudflare's Workers ecosystem while **prioritizing YOUR existing AI providers**. We use Cloudflare for infrastructure (Workers, Durable Objects, D1, R2, Vectorize) but route AI inference through your preferred providers:

**🤖 AI Provider Priority (YOUR providers, not Cloudflare's):**

| Provider                 | Models                                           | Use Cases                          |
| ------------------------ | ------------------------------------------------ | ---------------------------------- |
| **MiniMax**              | abab-6.5, abab-6.5s                              | Primary chat, creative tasks       |
| **Claude (Copilot API)** | Claude Sonnet, Claude Opus                       | Complex reasoning, code generation |
| **Google Gemini**        | gemini-2.0-flash-exp, gemini-2.0-pro             | Multimodal, large context          |
| **DeepSeek**             | deepseek-chat, deepseek-coder, deepseek-reasoner | Code-specific, reasoning           |

**⚠️ IMPORTANT**: We use Cloudflare Workers AI **only as fallback** or for embeddings. All primary AI calls go through YOUR providers.

**What Changed:**

- ❌ **REMOVED**: Vercel deployment entirely
- ❌ **REMOVED**: GitHub Pages as primary target
- ❌ **REMOVED**: Coolify/Docker-based deployments
- ✅ **NEW FOCUS**: Cloudflare Workers SDK as the exclusive **infrastructure** platform
- ✅ **NEW FOCUS**: YOUR AI providers (MiniMax, Claude, Gemini, DeepSeek) for all AI inference
- ✅ **NEW FOCUS**: Agents SDK for stateful AI applications
- ✅ **NEW FOCUS**: Seamless GitHub → Cloudflare auto-deployment pipeline
- ✅ **NEW FOCUS**: Complete CLI authentication and secrets management

---

## Table of Contents

### Part 0: Complete Environment Setup (START HERE)

- 0.1 Prerequisites and Tools Installation
- 0.2 GitHub CLI Authentication and Secrets Setup
- 0.3 Cloudflare CLI (Wrangler) Authentication and Secrets Setup
- 0.4 Seamless Auto-Deployment Pipeline Configuration
- 0.5 Verifying Your Setup

### Part 1: Cloudflare Workers Fundamentals

- 1.1 Workers Architecture Overview
- 1.2 Wrangler CLI Configuration
- 1.3 Environment Variables and Secrets Management
- 1.4 Deployment Workflow with `wrangler deploy`

### Part 2: AI Provider Integration (YOUR Providers)

- 2.1 Complete AI Provider Configuration
- 2.2 Provider Implementation Classes (MiniMax, Claude, Gemini, DeepSeek)
- 2.3 Unified AI Router (Use This in All Apps)
- 2.4 Using the AI Router in Your Apps
- 2.5 Provider Selection Guide

### Part 3: Agents SDK - Building Stateful AI Agents

- 3.1 Agents SDK Architecture and Concepts
- 3.2 Creating Your First Agent with Durable Objects
- 3.3 State Management (this.setState, this.sql)
- 3.4 WebSocket Support for Real-Time Communication
- 3.5 Scheduling and Asynchronous Workflows

### Part 4: Data Layer - Vectorize, D1, and R2

- 4.1 Vectorize: Vector Database for RAG Applications
- 4.2 D1: Serverless SQLite Databases
- 4.3 R2: Object Storage for Documents and Media
- 4.4 Hyperdrive: Global Database Acceleration

### Part 5: Project Implementations

- 5.1 Project 1: RAG Chat Agent with YOUR AI Providers
- 5.2 Project 2: Autonomous Research Agent with Multi-Step Workflows
- 5.3 Project 3: Real-Time Collaborative Editor with Durable Objects
- 5.4 Project 4: Multi-Modal AI with Browser Rendering
- 5.5 Project 5: AI Agent Swarm Orchestrator
- 5.6 Projects 6-10: Additional Implementations

### Part 6: Advanced Patterns

- 6.1 Containers: Running Custom Runtimes in Workers
- 6.2 Browser Rendering: Headless Chrome for Web Scraping
- 6.3 Email Workers for Intelligent Email Processing
- 6.4 Workflows: Long-Running Stateful Executions
- 6.5 Queues: Async Processing at Scale

### Part 7: Deployment & Operations

- 7.1 GitHub Actions CI/CD
- 7.2 Multi-Environment Deployment
- 7.3 Monitoring & Observability
- 7.4 Security Best Practices

---

## Part 0: Complete Environment Setup (START HERE)

**This section ensures you have everything configured for seamless auto-deployments on every git push.**

### 0.1 Prerequisites and Tools Installation

**Required Tools:**

```bash
# 1. Node.js (v18+ required)
node --version  # Should be >= 18.0.0

# If not installed, use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 2. Install Wrangler (Cloudflare CLI)
npm install -g wrangler

# Verify installation
wrangler --version  # Should be >= 3.0.0

# 3. Install GitHub CLI
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Verify installation
gh --version
```

### 0.2 GitHub CLI Authentication and Secrets Setup

**Step 1: Authenticate GitHub CLI**

```bash
# Interactive login (recommended)
gh auth login

# Follow prompts:
# ? What account do you want to log into? GitHub.com
# ? What is your preferred protocol for Git operations? HTTPS
# ? Authenticate Git with your GitHub credentials? Yes
# ? How would you like to authenticate GitHub CLI? Login with a web browser

# Verify authentication
gh auth status
# ✓ Logged in to github.com as YOUR_USERNAME
```

**Step 2: Create a Personal Access Token (for CI/CD)**

```bash
# Option A: Create via CLI (recommended)
gh auth token
# This shows your current token - copy it for later

# Option B: Create a new token with specific scopes
# Go to: https://github.com/settings/tokens/new
# Required scopes:
#   - repo (full control of private repositories)
#   - workflow (update GitHub Action workflows)
#   - admin:repo_hook (for webhooks)
```

**Step 3: Set Repository Secrets via GitHub CLI**

```bash
# Navigate to your repository
cd /home/chris/dev/10-ai-killin-apps

# Set ALL your AI provider secrets
gh secret set MINIMAX_API_KEY --body "sk-cp-your-minimax-key-here"
gh secret set DEEPSEEK_API_KEY --body "sk-your-deepseek-key-here"
gh secret set GEMINI_API_KEY --body "your-gemini-api-key-here"
gh secret set ANTHROPIC_API_KEY --body "sk-ant-your-anthropic-key-here"

# GitHub Copilot API (for Claude access)
gh secret set GITHUB_COPILOT_TOKEN --body "ghp_your-copilot-token-here"

# Cloudflare credentials (get these from Cloudflare dashboard)
gh secret set CLOUDFLARE_API_TOKEN --body "your-cloudflare-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-cloudflare-account-id"

# Verify secrets are set
gh secret list
# NAME                  UPDATED
# MINIMAX_API_KEY       now
# DEEPSEEK_API_KEY      now
# GEMINI_API_KEY        now
# ANTHROPIC_API_KEY     now
# GITHUB_COPILOT_TOKEN  now
# CLOUDFLARE_API_TOKEN  now
# CLOUDFLARE_ACCOUNT_ID now
```

**Step 4: Set Environment-Specific Secrets (Optional)**

```bash
# For staging environment
gh secret set MINIMAX_API_KEY --env staging --body "sk-staging-key"

# For production environment
gh secret set MINIMAX_API_KEY --env production --body "sk-production-key"

# List environment secrets
gh secret list --env production
```

### 0.3 Cloudflare CLI (Wrangler) Authentication and Secrets Setup

**Step 1: Authenticate Wrangler**

```bash
# Interactive login (opens browser)
wrangler login

# This will:
# 1. Open your browser to Cloudflare login
# 2. Ask you to authorize Wrangler
# 3. Store credentials in ~/.wrangler/config/default.toml

# Verify authentication
wrangler whoami
# ⛅️ wrangler 3.x.x
# -------------------
# Getting User settings...
# 👋 You are logged in with an OAuth Token, associated with the email: your@email.com
# ┌─────────────────────────────────────────┐
# │ Account Name    │ Account ID            │
# ├─────────────────────────────────────────┤
# │ Your Account    │ abc123def456...       │
# └─────────────────────────────────────────┘
```

**Step 2: Get Your Cloudflare API Token (for CI/CD)**

```bash
# Option A: Use the dashboard
# Go to: https://dash.cloudflare.com/profile/api-tokens
# Click "Create Token"
# Use template: "Edit Cloudflare Workers"
# Permissions needed:
#   - Account > Workers Scripts > Edit
#   - Account > Workers KV Storage > Edit
#   - Account > Workers R2 Storage > Edit
#   - Account > D1 > Edit
#   - Account > Vectorize > Edit
#   - Zone > Workers Routes > Edit

# Option B: Create via wrangler (limited)
wrangler config
# Follow prompts to enter API token
```

**Step 3: Get Your Account ID**

```bash
# Display account ID
wrangler whoami
# Copy the Account ID from the output

# Or find it in dashboard URL:
# https://dash.cloudflare.com/ACCOUNT_ID_HERE/workers
```

**Step 4: Set Worker Secrets via Wrangler**

```bash
# Set secrets for your Worker (these are encrypted at rest)
# Navigate to your app directory first
cd apps/app-01-rag-chat

# Set each secret (you'll be prompted to enter the value)
wrangler secret put MINIMAX_API_KEY
# Enter value: sk-cp-your-key-here

wrangler secret put DEEPSEEK_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GITHUB_COPILOT_TOKEN

# Alternative: Pipe the value (useful for scripts)
echo "sk-cp-your-minimax-key" | wrangler secret put MINIMAX_API_KEY

# List secrets (values are hidden)
wrangler secret list
# [
#   { "name": "MINIMAX_API_KEY", "type": "secret_text" },
#   { "name": "DEEPSEEK_API_KEY", "type": "secret_text" },
#   ...
# ]

# Delete a secret if needed
wrangler secret delete OLD_SECRET_NAME
```

**Step 5: Bulk Secret Setup Script**

Create a script for easy secret management:

```bash
#!/bin/bash
# scripts/setup-secrets.sh

# Check if .env.secrets exists
if [ ! -f .env.secrets ]; then
    echo "Create .env.secrets file with your API keys first!"
    echo "Example:"
    echo "MINIMAX_API_KEY=sk-cp-xxx"
    echo "DEEPSEEK_API_KEY=sk-xxx"
    exit 1
fi

# Load secrets from file
source .env.secrets

# Set Cloudflare Worker secrets
echo "Setting Cloudflare Worker secrets..."
echo "$MINIMAX_API_KEY" | wrangler secret put MINIMAX_API_KEY
echo "$DEEPSEEK_API_KEY" | wrangler secret put DEEPSEEK_API_KEY
echo "$GEMINI_API_KEY" | wrangler secret put GEMINI_API_KEY
echo "$ANTHROPIC_API_KEY" | wrangler secret put ANTHROPIC_API_KEY
echo "$GITHUB_COPILOT_TOKEN" | wrangler secret put GITHUB_COPILOT_TOKEN

# Set GitHub repository secrets
echo "Setting GitHub repository secrets..."
gh secret set MINIMAX_API_KEY --body "$MINIMAX_API_KEY"
gh secret set DEEPSEEK_API_KEY --body "$DEEPSEEK_API_KEY"
gh secret set GEMINI_API_KEY --body "$GEMINI_API_KEY"
gh secret set ANTHROPIC_API_KEY --body "$ANTHROPIC_API_KEY"
gh secret set GITHUB_COPILOT_TOKEN --body "$GITHUB_COPILOT_TOKEN"
gh secret set CLOUDFLARE_API_TOKEN --body "$CLOUDFLARE_API_TOKEN"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "$CLOUDFLARE_ACCOUNT_ID"

echo "✅ All secrets configured!"
```

### 0.4 Seamless Auto-Deployment Pipeline Configuration

**Step 1: Create GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

env:
  # AI Provider Keys (passed to Wrangler for secret updates)
  MINIMAX_API_KEY: ${{ secrets.MINIMAX_API_KEY }}
  DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  GITHUB_COPILOT_TOKEN: ${{ secrets.GITHUB_COPILOT_TOKEN }}

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

  deploy:
    needs: lint-and-type-check
    runs-on: ubuntu-latest
    # Only deploy on push to main, not on PRs
    if: github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build all apps
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          # Deploy all apps in the monorepo
          command: deploy --config apps/app-01-rag-chat/wrangler.jsonc

      # Deploy additional apps
      - name: Deploy App 02
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --config apps/app-02-research-agent/wrangler.jsonc

      # Add more apps as needed...

  # Optional: Deploy preview on PR
  preview:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy Preview
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --config apps/app-01-rag-chat/wrangler.jsonc --env preview
```

**Step 2: Configure Wrangler for Multiple Environments**

Update each app's `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "app-01-rag-chat",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  // Production settings (default)
  "vars": {
    "ENVIRONMENT": "production",
    "DEFAULT_AI_PROVIDER": "minimax",
  },

  // Environment overrides
  "env": {
    "preview": {
      "name": "app-01-rag-chat-preview",
      "vars": {
        "ENVIRONMENT": "preview",
      },
    },
    "staging": {
      "name": "app-01-rag-chat-staging",
      "vars": {
        "ENVIRONMENT": "staging",
      },
    },
  },
}
```

**Step 3: Monorepo Deploy Script**

Create `scripts/deploy-all.sh`:

```bash
#!/bin/bash
# scripts/deploy-all.sh
# Deploy all apps in the monorepo

set -e

APPS=(
  "app-01-rag-chat"
  "app-02-research-agent"
  "app-03-collaborative-editor"
  "app-04-multimodal-ai"
  "app-05-agent-swarm"
)

ENV=${1:-production}

echo "🚀 Deploying all apps to $ENV..."

for app in "${APPS[@]}"; do
  echo "📦 Deploying $app..."
  if [ "$ENV" = "production" ]; then
    wrangler deploy --config "apps/$app/wrangler.jsonc"
  else
    wrangler deploy --config "apps/$app/wrangler.jsonc" --env "$ENV"
  fi
  echo "✅ $app deployed!"
done

echo "🎉 All apps deployed successfully!"
```

### 0.5 Verifying Your Setup

**Complete Verification Checklist:**

```bash
# 1. Verify GitHub CLI
gh auth status
# ✓ Logged in to github.com as YOUR_USERNAME

# 2. Verify GitHub secrets
gh secret list
# Should show all your secrets

# 3. Verify Wrangler authentication
wrangler whoami
# Should show your account

# 4. Verify Worker secrets (from app directory)
cd apps/app-01-rag-chat
wrangler secret list
# Should show all secrets

# 5. Test local development
wrangler dev
# Should start local server at http://localhost:8787

# 6. Test deployment
wrangler deploy --dry-run
# Should show what would be deployed

# 7. Verify GitHub Actions
gh workflow list
# Should show your workflows

gh run list
# Should show recent runs
```

**Test Auto-Deployment:**

```bash
# Make a small change
echo "// test" >> src/index.ts

# Commit and push
git add .
git commit -m "test: verify auto-deployment"
git push origin main

# Watch the deployment
gh run watch
# Or view in browser
gh run view --web
```

**Expected Result:**

After pushing to `main`:

1. GitHub Actions triggers automatically
2. Lint and type-check run
3. Build completes
4. Wrangler deploys to Cloudflare
5. Your Worker is live at `https://app-name.your-subdomain.workers.dev`

---

## Part 1: Cloudflare Workers Fundamentals

### 1.1 Workers Architecture Overview

Cloudflare Workers is a serverless execution environment that runs on Cloudflare's global network of data centers. Unlike traditional serverless platforms (AWS Lambda, Vercel Functions), Workers execute at the edge, close to your users, with:

- **Zero cold starts**: Workers start in less than 5ms
- **Global distribution**: Deployed to 300+ cities automatically
- **Unlimited scaling**: From 1 to 1 million requests per second
- **Stateful capabilities**: Durable Objects provide coordination and storage
- **Integrated platform**: Native access to D1, R2, Vectorize, Workers AI

**Key Architectural Differences:**

| Traditional Serverless   | Cloudflare Workers            |
| ------------------------ | ----------------------------- |
| Regional deployment      | Global edge deployment        |
| Cold starts (100ms-3s)   | No cold starts (<5ms)         |
| Separate databases       | Integrated D1/Durable Objects |
| External vector DBs      | Native Vectorize              |
| Complex state management | Built-in Durable Objects      |
| Regional ML inference    | Global Workers AI             |

**Workers Execution Model:**

```typescript
// src/index.ts - Basic Worker structure
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Every Worker exports a fetch handler
    // request: Incoming HTTP request
    // env: Environment bindings (databases, AI models, secrets)
    // ctx: Execution context for background tasks

    return new Response("Hello from Cloudflare Workers!");
  },
};
```

**The Cloudflare Workers Stack for AI (YOUR Providers):**

```
┌─────────────────────────────────────────────┐
│  Frontend (React/Vite) - Cloudflare Pages  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Cloudflare Workers (Request Handling)      │
│  - Routing & Auth                           │
│  - AI Gateway (caching, rate limiting)      │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Agents SDK (Stateful AI Logic)             │
│  - Built on Durable Objects                 │
│  - State: this.setState, this.sql           │
│  - WebSockets for real-time                 │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  YOUR AI PROVIDERS (Primary)                │
│  ├─ MiniMax (abab-6.5, chat/creative)       │
│  ├─ Claude via Copilot API (Sonnet, Opus)   │
│  ├─ Google Gemini (flash, pro, multimodal)  │
│  ├─ DeepSeek (chat, coder, reasoner)        │
│  └─ Workers AI (FALLBACK/embeddings only)   │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Cloudflare Data Layer                      │
│  ├─ Vectorize (vector database)             │
│  ├─ D1 (SQLite database)                    │
│  └─ R2 (object storage)                     │
└─────────────────────────────────────────────┘
```

### 1.2 Wrangler CLI Setup and Configuration

Wrangler is the official CLI tool for Cloudflare Workers. It handles development, testing, and deployment.

**Installation and Authentication:**

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login
# This opens a browser to authenticate with your Cloudflare account

# Verify authentication
wrangler whoami

# Alternative: Use API token (for CI/CD)
export CLOUDFLARE_API_TOKEN=your_api_token
export CLOUDFLARE_ACCOUNT_ID=your_account_id
```

**Wrangler Configuration: wrangler.toml vs wrangler.jsonc**

Cloudflare supports both TOML and JSONC formats. **JSONC is recommended** for better IDE support and type checking.

**Basic wrangler.jsonc for a Worker:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "ai-chat-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  // Bindings to Cloudflare services
  "ai": {
    "binding": "AI",
  },

  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "ai-chat-embeddings",
    },
  ],

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "ai-chat-db",
      "database_id": "your-database-id",
    },
  ],

  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "ai-documents",
    },
  ],

  // Environment variables (non-secret)
  "vars": {
    "ENVIRONMENT": "production",
  },

  // Durable Objects (for Agents SDK)
  "durable_objects": {
    "bindings": [
      {
        "name": "CHAT_AGENT",
        "class_name": "ChatAgent",
      },
    ],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["ChatAgent"],
    },
  ],
}
```

**Equivalent wrangler.toml:**

```toml
name = "ai-chat-worker"
main = "src/index.ts"
compatibility_date = "2026-01-22"
compatibility_flags = ["nodejs_compat"]

[ai]
binding = "AI"

[[vectorize]]
binding = "VECTORIZE"
index_name = "ai-chat-embeddings"

[[d1_databases]]
binding = "DB"
database_name = "ai-chat-db"
database_id = "your-database-id"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "ai-documents"

[vars]
ENVIRONMENT = "production"

[[durable_objects.bindings]]
name = "CHAT_AGENT"
class_name = "ChatAgent"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["ChatAgent"]
```

**Project Structure for Workers:**

```
app-01-rag-chat/
├── src/
│   ├── index.ts              # Main Worker entry point
│   ├── agents/
│   │   └── ChatAgent.ts      # Durable Object Agent class
│   ├── lib/
│   │   ├── ai.ts             # AI model integration
│   │   ├── vectorize.ts      # Vector operations
│   │   └── rag.ts            # RAG logic
│   └── types.ts              # TypeScript types
├── wrangler.jsonc            # Wrangler configuration
├── package.json
├── tsconfig.json
└── .dev.vars                 # Local development secrets
```

### 1.3 Environment Variables and Secrets Management

Cloudflare Workers distinguishes between **environment variables** (non-secret) and **secrets** (encrypted).

**Environment Variables (Non-Secret):**

Defined in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "ENVIRONMENT": "production",
    "DEFAULT_MODEL": "minimax-abab6.5",
    "MAX_TOKENS": "4096",
  },
}
```

**Secrets (Encrypted):**

Set via Wrangler CLI or dashboard:

```bash
# Set secrets via Wrangler
echo "your-api-key" | wrangler secret put MINIMAX_API_KEY
echo "your-api-key" | wrangler secret put DEEPSEEK_API_KEY
echo "your-api-key" | wrangler secret put ANTHROPIC_API_KEY

# List secrets
wrangler secret list

# Delete a secret
wrangler secret delete MINIMAX_API_KEY
```

**Local Development with .dev.vars:**

Create a `.dev.vars` file (never commit this):

```ini
# .dev.vars - Local development secrets (use your own keys)
MINIMAX_API_KEY=sk-your-minimax-api-key
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
OPENAI_API_KEY=sk-your-openai-key
```

**Accessing Environment Variables in Workers:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Access environment variables
    const minimaxKey = env.MINIMAX_API_KEY; // Secret
    const environment = env.ENVIRONMENT; // Variable

    // Access service bindings
    const ai = env.AI; // Workers AI
    const vectorize = env.VECTORIZE; // Vectorize
    const db = env.DB; // D1
    const bucket = env.BUCKET; // R2

    return new Response("OK");
  },
};

// TypeScript types for env
interface Env {
  // Secrets
  MINIMAX_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  ANTHROPIC_API_KEY: string;

  // Variables
  ENVIRONMENT: string;
  DEFAULT_MODEL: string;

  // Service bindings
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
  BUCKET: R2Bucket;
  CHAT_AGENT: DurableObjectNamespace;
}
```

### 1.4 Deployment Workflow with `wrangler deploy`

**Development Workflow:**

```bash
# 1. Install dependencies
npm install

# 2. Run locally with dev server
wrangler dev
# This starts a local server at http://localhost:8787
# Connects to REAL Cloudflare services (D1, R2, Vectorize)
# Uses .dev.vars for secrets

# 3. Test with remote preview (uses production data)
wrangler dev --remote

# 4. Deploy to production
wrangler deploy

# 5. Deploy with a specific environment
wrangler deploy --env staging
```

**Deployment Output:**

```bash
$ wrangler deploy

 ⛅️ wrangler 3.28.0
-------------------
Total Upload: 45.67 KiB / gzip: 12.34 KiB
Uploaded ai-chat-worker (2.3 sec)
Published ai-chat-worker (0.2 sec)
  https://ai-chat-worker.your-subdomain.workers.dev
Current Deployment ID: abc123-def456-ghi789
```

**Viewing Logs:**

```bash
# Stream logs in real-time
wrangler tail

# View logs from dashboard
wrangler tail --format pretty

# Filter logs
wrangler tail --status ok
wrangler tail --method POST
```

**Deployment Best Practices:**

1. **Always test locally first**: `wrangler dev`
2. **Use staging environments**: Separate `--env staging` and `--env production`
3. **Monitor deployments**: `wrangler tail` after deploying
4. **Version your deployments**: Use git tags for tracking
5. **Rollback if needed**: Redeploy previous version

**Multi-Environment Setup:**

```jsonc
{
  "name": "ai-chat-worker",
  "main": "src/index.ts",

  "env": {
    "staging": {
      "name": "ai-chat-worker-staging",
      "vars": {
        "ENVIRONMENT": "staging",
      },
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "ai-chat-db-staging",
          "database_id": "staging-db-id",
        },
      ],
    },

    "production": {
      "name": "ai-chat-worker",
      "vars": {
        "ENVIRONMENT": "production",
      },
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "ai-chat-db-prod",
          "database_id": "prod-db-id",
        },
      ],
    },
  },
}
```

Deploy to specific environment:

```bash
wrangler deploy --env staging
wrangler deploy --env production
```

---

## Part 2: AI Provider Integration (YOUR Providers First)

**⚠️ CRITICAL PRINCIPLE**: We use YOUR AI providers (MiniMax, Claude, Gemini, DeepSeek) for all AI inference. Cloudflare Workers AI is used ONLY for embeddings or as a fallback.

### 2.1 Complete AI Provider Configuration

**Your AI Providers - Priority Order:**

| Priority     | Provider             | Models                | Best For                       | API Endpoint                        |
| ------------ | -------------------- | --------------------- | ------------------------------ | ----------------------------------- |
| **1**        | MiniMax              | abab-6.5, abab-6.5s   | Chat, creative writing         | `api.minimax.chat/v1`               |
| **2**        | Claude (Copilot API) | Sonnet, Opus          | Complex reasoning, code        | GitHub Copilot endpoint             |
| **3**        | Google Gemini        | flash-exp, pro        | Multimodal, large context      | `generativelanguage.googleapis.com` |
| **4**        | DeepSeek             | chat, coder, reasoner | Code generation, reasoning     | `api.deepseek.com`                  |
| **Fallback** | Workers AI           | llama-3.1, bge        | Embeddings, emergency fallback | Cloudflare binding                  |

**TypeScript Types for All Providers:**

```typescript
// src/types/ai.ts

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export type AIProvider =
  | "minimax"
  | "claude"
  | "gemini"
  | "deepseek"
  | "workers-ai";

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// Environment bindings type
export interface Env {
  // YOUR API Keys (secrets)
  MINIMAX_API_KEY: string;
  GITHUB_COPILOT_TOKEN: string; // For Claude access
  GEMINI_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  ANTHROPIC_API_KEY: string; // Direct Anthropic access

  // Cloudflare bindings (fallback only)
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
  BUCKET: R2Bucket;

  // Configuration
  DEFAULT_AI_PROVIDER: string;
  ENVIRONMENT: string;
}
```

### 2.2 Provider Implementation Classes

**MiniMax Provider (Primary):**

```typescript
// src/lib/providers/minimax.ts

import { Message, AIResponse } from "../types/ai";

export class MiniMaxProvider {
  private apiKey: string;
  private baseUrl = "https://api.minimax.chat/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Message[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {},
  ): Promise<AIResponse> {
    const {
      model = "abab6.5-chat",
      temperature = 0.7,
      maxTokens = 4096,
      stream = false,
    } = options;

    const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MiniMax API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      model,
      provider: "minimax",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  async chatStream(
    messages: Message[],
    options: { model?: string; temperature?: number } = {},
  ): Promise<ReadableStream> {
    const { model = "abab6.5-chat", temperature = 0.7 } = options;

    const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`MiniMax streaming error: ${response.status}`);
    }

    return response.body!;
  }
}
```

**Claude via Copilot API:**

```typescript
// src/lib/providers/claude.ts

import { Message, AIResponse } from "../types/ai";

export class ClaudeProvider {
  private token: string;
  // GitHub Copilot API provides access to Claude models
  private baseUrl = "https://api.githubcopilot.com";

  constructor(copilotToken: string) {
    this.token = copilotToken;
  }

  async chat(
    messages: Message[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<AIResponse> {
    const {
      model = "claude-3-5-sonnet", // or "claude-3-opus"
      temperature = 0.7,
      maxTokens = 4096,
    } = options;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        "Copilot-Integration-Id": "cloudflare-workers",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      model,
      provider: "claude",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }
}

// Alternative: Direct Anthropic API
export class AnthropicProvider {
  private apiKey: string;
  private baseUrl = "https://api.anthropic.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Message[],
    options: {
      model?: string;
      maxTokens?: number;
    } = {},
  ): Promise<AIResponse> {
    const { model = "claude-3-5-sonnet-20241022", maxTokens = 4096 } = options;

    // Anthropic uses a different message format
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemMessage?.content,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.content[0].text,
      model,
      provider: "claude",
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
    };
  }
}
```

**Google Gemini Provider:**

```typescript
// src/lib/providers/gemini.ts

import { Message, AIResponse } from "../types/ai";

export class GeminiProvider {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Message[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<AIResponse> {
    const {
      model = "gemini-2.0-flash-exp",
      temperature = 0.7,
      maxTokens = 4096,
    } = options;

    // Convert to Gemini format
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === "system");

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction.content }] }
            : undefined,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.candidates[0].content.parts[0].text,
      model,
      provider: "gemini",
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: data.usageMetadata.totalTokenCount,
          }
        : undefined,
    };
  }
}
```

**DeepSeek Provider:**

```typescript
// src/lib/providers/deepseek.ts

import { Message, AIResponse } from "../types/ai";

export class DeepSeekProvider {
  private apiKey: string;
  private baseUrl = "https://api.deepseek.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Message[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<AIResponse> {
    const {
      model = "deepseek-chat", // or "deepseek-coder", "deepseek-reasoner"
      temperature = 0.7,
      maxTokens = 4096,
    } = options;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      model,
      provider: "deepseek",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }
}
```

### 2.3 Unified AI Router (Use This in All Apps)

**The AI Router routes requests to YOUR providers with automatic fallback:**

```typescript
// src/lib/ai-router.ts

import { MiniMaxProvider } from "./providers/minimax";
import { ClaudeProvider, AnthropicProvider } from "./providers/claude";
import { GeminiProvider } from "./providers/gemini";
import { DeepSeekProvider } from "./providers/deepseek";
import { Message, AIResponse, AIProvider, Env } from "./types/ai";

export class AIRouter {
  private minimax: MiniMaxProvider;
  private claude: ClaudeProvider | AnthropicProvider;
  private gemini: GeminiProvider;
  private deepseek: DeepSeekProvider;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.minimax = new MiniMaxProvider(env.MINIMAX_API_KEY);
    this.claude = env.GITHUB_COPILOT_TOKEN
      ? new ClaudeProvider(env.GITHUB_COPILOT_TOKEN)
      : new AnthropicProvider(env.ANTHROPIC_API_KEY);
    this.gemini = new GeminiProvider(env.GEMINI_API_KEY);
    this.deepseek = new DeepSeekProvider(env.DEEPSEEK_API_KEY);
  }

  /**
   * Smart routing based on task type
   */
  async chat(
    messages: Message[],
    options: {
      provider?: AIProvider;
      task?: "chat" | "code" | "reasoning" | "creative" | "multimodal";
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {},
  ): Promise<AIResponse> {
    const provider = options.provider || this.selectProvider(options.task);

    try {
      return await this.routeToProvider(provider, messages, options);
    } catch (error) {
      console.error(`Provider ${provider} failed:`, error);
      return await this.fallbackChain(provider, messages, options);
    }
  }

  /**
   * Task-based provider selection (YOUR preferences)
   */
  private selectProvider(task?: string): AIProvider {
    switch (task) {
      case "code":
        return "deepseek"; // DeepSeek Coder is excellent for code
      case "reasoning":
        return "claude"; // Claude Opus for complex reasoning
      case "multimodal":
        return "gemini"; // Gemini for images/video
      case "creative":
        return "minimax"; // MiniMax for creative writing
      case "chat":
      default:
        return "minimax"; // MiniMax as default (your primary)
    }
  }

  /**
   * Route to specific provider
   */
  private async routeToProvider(
    provider: AIProvider,
    messages: Message[],
    options: any,
  ): Promise<AIResponse> {
    switch (provider) {
      case "minimax":
        return await this.minimax.chat(messages, options);
      case "claude":
        return await this.claude.chat(messages, options);
      case "gemini":
        return await this.gemini.chat(messages, options);
      case "deepseek":
        return await this.deepseek.chat(messages, options);
      case "workers-ai":
        // FALLBACK ONLY - use Workers AI
        return await this.workersAIFallback(messages, options);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Fallback chain when primary provider fails
   */
  private async fallbackChain(
    failedProvider: AIProvider,
    messages: Message[],
    options: any,
  ): Promise<AIResponse> {
    // YOUR fallback order preference
    const fallbackOrder: AIProvider[] = [
      "minimax",
      "gemini",
      "deepseek",
      "claude",
      "workers-ai", // Workers AI is LAST resort
    ];

    const remaining = fallbackOrder.filter((p) => p !== failedProvider);

    for (const provider of remaining) {
      try {
        console.log(`Trying fallback provider: ${provider}`);
        return await this.routeToProvider(provider, messages, options);
      } catch (error) {
        console.error(`Fallback ${provider} also failed:`, error);
        continue;
      }
    }

    throw new Error("All AI providers failed");
  }

  /**
   * Workers AI fallback (ONLY when all your providers fail)
   */
  private async workersAIFallback(
    messages: Message[],
    options: any,
  ): Promise<AIResponse> {
    console.warn("⚠️ Using Workers AI fallback - all primary providers failed");

    const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages,
    });

    return {
      content: response.response,
      model: "@cf/meta/llama-3.1-8b-instruct",
      provider: "workers-ai",
    };
  }

  /**
   * Generate embeddings (Workers AI is fine for this - it's free)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [text],
    });
    return response.data[0];
  }

  /**
   * Batch embeddings
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await this.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: texts,
    });
    return response.data;
  }
}

// Export a factory function
export function createAIRouter(env: Env): AIRouter {
  return new AIRouter(env);
}
```

### 2.4 Using the AI Router in Your Apps

**Example: Chat Endpoint Using YOUR Providers**

```typescript
// src/index.ts

import { createAIRouter } from "./lib/ai-router";
import { Env } from "./types/ai";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Create router with YOUR providers
    const ai = createAIRouter(env);

    if (url.pathname === "/chat") {
      const { message, task } = await request.json();

      // This routes to YOUR providers, NOT Workers AI
      const response = await ai.chat(
        [{ role: "user", content: message }],
        { task }, // "chat" | "code" | "reasoning" | "creative"
      );

      return Response.json({
        content: response.content,
        provider: response.provider, // Shows which provider was used
        model: response.model,
      });
    }

    if (url.pathname === "/embed") {
      const { text } = await request.json();

      // Embeddings use Workers AI (free and fast)
      const embedding = await ai.generateEmbedding(text);

      return Response.json({ embedding });
    }

    return new Response("Not found", { status: 404 });
  },
};
```

**wrangler.jsonc with YOUR Provider Configuration:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-ai-app",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  // Workers AI binding (for embeddings/fallback ONLY)
  "ai": {
    "binding": "AI",
  },

  // Environment variables
  "vars": {
    "DEFAULT_AI_PROVIDER": "minimax",
    "ENVIRONMENT": "production",
  },

  // SECRETS are set via CLI (see Part 0):
  // wrangler secret put MINIMAX_API_KEY
  // wrangler secret put GITHUB_COPILOT_TOKEN
  // wrangler secret put GEMINI_API_KEY
  // wrangler secret put DEEPSEEK_API_KEY
  // wrangler secret put ANTHROPIC_API_KEY
}
```

### 2.5 Provider Selection Guide

**When to Use Each Provider:**

| Task                  | Provider   | Model          | Why                              |
| --------------------- | ---------- | -------------- | -------------------------------- |
| General chat          | MiniMax    | abab-6.5       | Fast, good quality, your primary |
| Creative writing      | MiniMax    | abab-6.5s      | Excellent creative capabilities  |
| Code generation       | DeepSeek   | deepseek-coder | Specialized for code             |
| Code review           | DeepSeek   | deepseek-coder | Understands code patterns        |
| Complex reasoning     | Claude     | Opus           | Best reasoning capabilities      |
| Step-by-step thinking | Claude     | Sonnet         | Great balance of speed/quality   |
| Image analysis        | Gemini     | 2.0-flash      | Native multimodal                |
| Large documents       | Gemini     | 2.0-pro        | 1M+ token context                |
| Embeddings            | Workers AI | bge-base       | Free, fast, sufficient quality   |
| Fallback              | Workers AI | llama-3.1      | When all else fails              |

**Cost Optimization:**

```typescript
// Use task-based routing to optimize costs
const response = await ai.chat(messages, {
  task: "code", // Routes to DeepSeek (often cheaper for code)
});

// Or explicitly choose a provider
const response = await ai.chat(messages, {
  provider: "minimax", // Force specific provider
  model: "abab6.5-chat",
});
```

---

## Part 3: Agents SDK - Building Stateful AI Agents

### 3.1 Agents SDK Architecture and Concepts

The Agents SDK is built on top of **Durable Objects**, which are Cloudflare's stateful micro-servers. Each Agent:

- Has a **globally-unique ID**
- Maintains **persistent state** via SQLite
- Can handle **WebSocket connections** for real-time communication
- Can **schedule tasks** for future execution
- Runs **workflows** that can take minutes, hours, or days

**Agent vs Worker:**

| Worker                        | Agent (Durable Object)                          |
| ----------------------------- | ----------------------------------------------- |
| Stateless                     | Stateful                                        |
| Handles one request at a time | Can coordinate multiple requests                |
| No persistent storage         | Built-in SQLite storage                         |
| Global instances              | Single instance per unique ID                   |
| Good for: API routes          | Good for: User sessions, chat rooms, game state |

**Core Agent Concepts:**

1. **Agent Class**: Extends `Agent` from `agents` package
2. **Unique ID**: Each agent instance has a unique identifier (e.g., user ID, chat room ID)
3. **State Management**: Use `this.setState()` and `this.sql` for persistence
4. **WebSocket Support**: Real-time bidirectional communication
5. **Scheduling**: `this.schedule()` for future tasks
6. **Workflows**: Long-running asynchronous operations

### 3.2 Creating Your First Agent with Durable Objects

**Install the Agents SDK:**

```bash
npm install agents
```

**Define an Agent:**

```typescript
// src/agents/ChatAgent.ts
import { Agent } from "agents";

export class ChatAgent extends Agent {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/message") {
      return await this.handleMessage(request);
    }

    if (url.pathname === "/websocket") {
      return await this.handleWebSocket(request);
    }

    return new Response("Not found", { status: 404 });
  }

  private async handleMessage(request: Request): Promise<Response> {
    const { message } = await request.json();

    // Get current conversation history from state
    const history = (await this.getState<Message[]>("history")) || [];

    // Add user message
    history.push({ role: "user", content: message });

    // Call AI - DEMO ONLY using Workers AI
    // For production, use the AI Router from Part 2 to route to YOUR providers!
    const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: history,
    });

    // Add AI response to history
    history.push({ role: "assistant", content: response.response });

    // Save updated history
    await this.setState("history", history);

    return Response.json({ response: response.response });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    // WebSocket implementation covered in section 2.4
    return new Response("WebSocket endpoint", { status: 200 });
  }
}
```

**Configure Durable Objects in wrangler.jsonc:**

```jsonc
{
  "name": "chat-app",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",

  "durable_objects": {
    "bindings": [
      {
        "name": "CHAT_AGENT",
        "class_name": "ChatAgent",
      },
    ],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["ChatAgent"],
    },
  ],

  "ai": {
    "binding": "AI",
  },
}
```

**Worker that Routes to Agent:**

```typescript
// src/index.ts
import { ChatAgent } from "./agents/ChatAgent";

export { ChatAgent };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Extract user ID from request (e.g., from JWT token or header)
    const userId = request.headers.get("X-User-ID") || "anonymous";

    // Get the Durable Object stub for this user
    const id = env.CHAT_AGENT.idFromName(userId);
    const stub = env.CHAT_AGENT.get(id);

    // Forward the request to the Agent
    return await stub.fetch(request);
  },
};

interface Env {
  CHAT_AGENT: DurableObjectNamespace;
  AI: Ai;
}
```

**Deploy:**

```bash
wrangler deploy
```

**Test the Agent:**

```bash
# Send a message
curl https://chat-app.your-subdomain.workers.dev/message \
  -H "X-User-ID: user-123" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, AI!"}'

# Response
{
  "response": "Hello! How can I help you today?"
}

# Send another message (conversation continues)
curl https://chat-app.your-subdomain.workers.dev/message \
  -H "X-User-ID: user-123" \
  -H "Content-Type: application/json" \
  -d '{"message": "What did I just say?"}'

# Response (Agent remembers previous message)
{
  "response": "You said 'Hello, AI!'"
}
```

### 3.3 State Management (this.setState, this.sql)

Agents provide two ways to persist state:

1. **Key-Value State**: `this.setState()` and `this.getState()`
2. **SQL Database**: `this.sql`

**Key-Value State:**

```typescript
export class ChatAgent extends Agent {
  async initialize() {
    // Set initial state
    await this.setState("messageCount", 0);
    await this.setState("createdAt", Date.now());
    await this.setState("history", []);
  }

  async incrementMessages() {
    const count = (await this.getState<number>("messageCount")) || 0;
    await this.setState("messageCount", count + 1);
  }

  async getHistory(): Promise<Message[]> {
    return (await this.getState<Message[]>("history")) || [];
  }
}
```

**SQL Database:**

Every Agent has access to a built-in SQLite database via `this.sql`:

```typescript
export class ChatAgent extends Agent {
  async initialize() {
    // Create tables on first use
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_created_at ON messages(created_at);
    `);
  }

  async saveMessage(role: string, content: string) {
    await this.sql.exec({
      sql: "INSERT INTO messages (role, content, created_at) VALUES (?, ?, ?)",
      bind: [role, content, Date.now()],
    });
  }

  async getRecentMessages(limit: number = 10): Promise<Message[]> {
    const result = await this.sql.exec({
      sql: "SELECT role, content FROM messages ORDER BY created_at DESC LIMIT ?",
      bind: [limit],
    });

    return result.results
      .map((row) => ({
        role: row[0] as string,
        content: row[1] as string,
      }))
      .reverse();
  }

  async searchMessages(query: string): Promise<Message[]> {
    const result = await this.sql.exec({
      sql: "SELECT role, content FROM messages WHERE content LIKE ? ORDER BY created_at DESC",
      bind: [`%${query}%`],
    });

    return result.results.map((row) => ({
      role: row[0] as string,
      content: row[1] as string,
    }));
  }
}
```

**When to use which:**

- **Key-Value**: Simple state, frequently updated, small data (< 128 KB per key)
- **SQL**: Complex queries, large datasets, relational data, search

### 3.4 WebSocket Support for Real-Time Communication

Agents support WebSocket connections for real-time, bidirectional communication:

```typescript
export class ChatAgent extends Agent {
  private connections: Set<WebSocket> = new Set();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/websocket") {
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      // Create WebSocket pair
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      // Accept the connection
      this.ctx.acceptWebSocket(server);
      this.connections.add(server);

      // Handle messages
      server.addEventListener("message", async (event) => {
        const message = JSON.parse(event.data);
        await this.handleWebSocketMessage(message, server);
      });

      server.addEventListener("close", () => {
        this.connections.delete(server);
      });

      // Return client side to user
      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return new Response("Not found", { status: 404 });
  }

  private async handleWebSocketMessage(message: any, ws: WebSocket) {
    // Save to database
    await this.saveMessage("user", message.content);

    // Get AI response (streaming)
    // NOTE: This demo uses Workers AI directly.
    // For production, use createAIRouter(env).stream() from Part 2!
    const stream = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: await this.getRecentMessages(),
      stream: true,
    });

    // Stream tokens back to client
    const reader = stream.getReader();
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      fullResponse += text;

      // Send token to client
      ws.send(
        JSON.stringify({
          type: "token",
          content: text,
        }),
      );
    }

    // Save AI response
    await this.saveMessage("assistant", fullResponse);

    // Send completion
    ws.send(
      JSON.stringify({
        type: "complete",
      }),
    );
  }

  // Broadcast to all connected clients
  private broadcast(message: any) {
    for (const ws of this.connections) {
      ws.send(JSON.stringify(message));
    }
  }
}
```

**Client-Side WebSocket Usage:**

```typescript
// Frontend code
const ws = new WebSocket(
  "wss://chat-app.your-subdomain.workers.dev/websocket",
  {
    headers: {
      "X-User-ID": "user-123",
    },
  },
);

ws.onopen = () => {
  console.log("Connected");

  // Send a message
  ws.send(
    JSON.stringify({
      type: "message",
      content: "Hello, AI!",
    }),
  );
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "token") {
    // Append token to UI
    appendToken(data.content);
  } else if (data.type === "complete") {
    console.log("Response complete");
  }
};

ws.onclose = () => {
  console.log("Disconnected");
};
```

### 3.5 Scheduling and Asynchronous Workflows

Agents can schedule tasks for future execution:

**Simple Scheduling:**

```typescript
export class ChatAgent extends Agent {
  async handleMessage(request: Request): Promise<Response> {
    const { message } = await request.json();

    // Process message
    await this.saveMessage("user", message);

    // Schedule a reminder in 5 minutes
    await this.schedule({
      fn: this.sendReminder,
      args: [message],
      delayMs: 5 * 60 * 1000, // 5 minutes
    });

    return Response.json({ ok: true });
  }

  async sendReminder(originalMessage: string) {
    // This runs 5 minutes later
    console.log("Reminder:", originalMessage);

    // Broadcast to connected clients
    this.broadcast({
      type: "reminder",
      content: `Remember: ${originalMessage}`,
    });
  }
}
```

**Recurring Tasks (Alarms):**

```typescript
export class ChatAgent extends Agent {
  async initialize() {
    // Set an alarm to run daily
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM

    await this.storage.setAlarm(tomorrow.getTime());
  }

  async alarm() {
    // This runs when the alarm fires
    console.log("Daily summary alarm triggered");

    // Generate daily summary
    await this.generateDailySummary();

    // Schedule next alarm (24 hours later)
    const nextAlarm = Date.now() + 24 * 60 * 60 * 1000;
    await this.storage.setAlarm(nextAlarm);
  }

  async generateDailySummary() {
    const messages = await this.getRecentMessages(100);

    // Use AI to summarize
    // NOTE: Demo uses Workers AI. For production, use AI Router from Part 2!
    const summary = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "Summarize the following conversation in 2-3 sentences.",
        },
        {
          role: "user",
          content: JSON.stringify(messages),
        },
      ],
    });

    // Save summary
    await this.setState("lastSummary", summary.response);

    // Notify connected clients
    this.broadcast({
      type: "summary",
      content: summary.response,
    });
  }
}
```

**Long-Running Workflows:**

For workflows that need to run for minutes, hours, or days, use Cloudflare Workflows:

```typescript
import {
  WorkflowEntrypoint,
  WorkflowStep,
  WorkflowEvent,
} from "cloudflare:workers";

export class ResearchWorkflow extends WorkflowEntrypoint {
  async run(event: WorkflowEvent<{ topic: string }>, step: WorkflowStep) {
    const { topic } = event.payload;

    // Step 1: Decompose topic into questions
    // NOTE: Demo uses Workers AI. For production, use AI Router from Part 2!
    const questions = await step.do("decompose", async () => {
      return await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "user",
            content: `Break down "${topic}" into 5 research questions.`,
          },
        ],
      });
    });

    // Step 2: Research each question (in parallel)
    const research = await step.do("research", async () => {
      return await Promise.all(questions.map((q) => this.researchQuestion(q)));
    });

    // Step 3: Wait for human approval
    await step.sleep("wait-for-approval", 24 * 60 * 60 * 1000); // 24 hours

    // Step 4: Generate final report
    // NOTE: Demo uses Workers AI. For production, use AI Router from Part 2!
    const report = await step.do("generate-report", async () => {
      return await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "user",
            content: `Synthesize this research into a report: ${JSON.stringify(research)}`,
          },
        ],
      });
    });

    return report;
  }

  private async researchQuestion(question: string): Promise<string> {
    // Implementation
    return "";
  }
}
```

---

## Part 4: Data Layer - Vectorize, D1, and R2

### 4.1 Vectorize: Vector Database for RAG Applications

Vectorize is Cloudflare's native vector database for semantic search, RAG, and similarity matching.

**Creating a Vectorize Index:**

```bash
# Create an index for embeddings
wrangler vectorize create ai-chat-embeddings --dimensions=768 --metric=cosine

# Output
✅ Created index 'ai-chat-embeddings'
📐 Dimensions: 768
📏 Metric: cosine
🆔 Index ID: abc123-def456-ghi789
```

**Configure in wrangler.jsonc:**

```jsonc
{
  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "ai-chat-embeddings",
    },
  ],
}
```

**Using Vectorize for RAG:**

```typescript
// src/lib/rag.ts
export class RAGSystem {
  constructor(
    private ai: Ai,
    private vectorize: VectorizeIndex,
  ) {}

  async addDocument(text: string, metadata: Record<string, any> = {}) {
    // Generate embedding using Workers AI
    const embedding = await this.generateEmbedding(text);

    // Insert into Vectorize
    await this.vectorize.insert([
      {
        id: crypto.randomUUID(),
        values: embedding,
        metadata: {
          text,
          ...metadata,
          createdAt: Date.now(),
        },
      },
    ]);
  }

  async addDocuments(
    documents: Array<{ text: string; metadata?: Record<string, any> }>,
  ) {
    // Batch process
    const vectors = await Promise.all(
      documents.map(async (doc) => ({
        id: crypto.randomUUID(),
        values: await this.generateEmbedding(doc.text),
        metadata: {
          text: doc.text,
          ...doc.metadata,
          createdAt: Date.now(),
        },
      })),
    );

    // Insert in batches of 1000
    const batchSize = 1000;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await this.vectorize.insert(batch);
    }
  }

  async search(query: string, topK: number = 5) {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);

    // Search Vectorize
    const results = await this.vectorize.query(queryEmbedding, {
      topK,
      returnMetadata: true,
    });

    return results.matches.map((match) => ({
      id: match.id,
      text: match.metadata.text,
      score: match.score,
      metadata: match.metadata,
    }));
  }

  async answerWithRAG(question: string, topK: number = 3): Promise<string> {
    // 1. Search for relevant context
    const context = await this.search(question, topK);

    // 2. Build prompt with context
    const contextText = context.map((c) => c.text).join("\n\n");

    const prompt = `
Context:
${contextText}

Question: ${question}

Answer the question using only the information from the context above. If you cannot answer based on the context, say so.
    `.trim();

    // 3. Generate answer
    // NOTE: This demo uses Workers AI. For production, use AI Router from Part 2!
    // In Project 5.1, we show the proper pattern with createAIRouter(env).chat()
    const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "user", content: prompt }],
    });

    return response.response;
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Workers AI for embeddings is FINE - it's free and sufficient quality
    const response = await this.ai.run("@cf/baai/bge-base-en-v1.5", {
      text: [text],
    });

    return response.data[0];
  }
}
```

**Using RAG in an Agent:**

```typescript
export class RAGChatAgent extends Agent {
  private rag: RAGSystem;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.rag = new RAGSystem(env.AI, env.VECTORIZE);
  }

  async handleMessage(request: Request): Promise<Response> {
    const { message } = await request.json();

    // Answer using RAG
    const answer = await this.rag.answerWithRAG(message);

    // Save to history
    await this.saveMessage("user", message);
    await this.saveMessage("assistant", answer);

    return Response.json({ answer });
  }

  async uploadDocument(request: Request): Promise<Response> {
    const { text, metadata } = await request.json();

    // Add to vector database
    await this.rag.addDocument(text, metadata);

    return Response.json({ ok: true });
  }
}
```

### 4.2 D1: Serverless SQLite Databases

D1 is Cloudflare's serverless SQL database based on SQLite.

**Creating a D1 Database:**

```bash
# Create database
wrangler d1 create ai-chat-db

# Output
✅ Created database 'ai-chat-db'
🆔 Database ID: abc123-def456-ghi789

# Add to wrangler.jsonc:
[[d1_databases]]
binding = "DB"
database_name = "ai-chat-db"
database_id = "abc123-def456-ghi789"
```

**Initialize Schema:**

```sql
-- schema.sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  last_active INTEGER
);

CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE INDEX idx_user_id ON conversations(user_id);
CREATE INDEX idx_conversation_id ON messages(conversation_id);
CREATE INDEX idx_created_at ON messages(created_at);
```

**Apply Schema:**

```bash
wrangler d1 execute ai-chat-db --file=schema.sql --remote
```

**Using D1 in Workers:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/user/create") {
      return await this.createUser(request, env);
    }

    if (url.pathname === "/conversations") {
      return await this.listConversations(request, env);
    }

    return new Response("Not found", { status: 404 });
  },

  async createUser(request: Request, env: Env): Promise<Response> {
    const { userId } = await request.json();

    const result = await env.DB.prepare(
      "INSERT INTO users (user_id, created_at) VALUES (?, ?)",
    )
      .bind(userId, Date.now())
      .run();

    return Response.json({
      success: result.success,
      userId,
    });
  },

  async listConversations(request: Request, env: Env): Promise<Response> {
    const userId = request.headers.get("X-User-ID");

    const result = await env.DB.prepare(
      "SELECT id, title, created_at FROM conversations WHERE user_id = ? ORDER BY created_at DESC",
    )
      .bind(userId)
      .all();

    return Response.json(result.results);
  },
};

interface Env {
  DB: D1Database;
}
```

**Batch Operations:**

```typescript
async function saveBatchMessages(
  messages: Array<{ conversationId: number; role: string; content: string }>,
  db: D1Database,
) {
  const batch = db.batch(
    messages.map((msg) =>
      db
        .prepare(
          "INSERT INTO messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)",
        )
        .bind(msg.conversationId, msg.role, msg.content, Date.now()),
    ),
  );

  await batch;
}
```

### 4.3 R2: Object Storage for Documents and Media

R2 is Cloudflare's object storage (S3-compatible) with zero egress fees.

**Creating an R2 Bucket:**

```bash
wrangler r2 bucket create ai-documents

# Add to wrangler.jsonc:
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "ai-documents"
```

**Uploading Files:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/upload" && request.method === "POST") {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      // Upload to R2
      const key = `uploads/${crypto.randomUUID()}-${file.name}`;
      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      return Response.json({ key, url: `/download/${key}` });
    }

    if (url.pathname.startsWith("/download/")) {
      const key = url.pathname.slice(10);
      const object = await env.BUCKET.get(key);

      if (!object) {
        return new Response("Not found", { status: 404 });
      }

      return new Response(object.body, {
        headers: {
          "Content-Type":
            object.httpMetadata?.contentType || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

interface Env {
  BUCKET: R2Bucket;
}
```

**Processing Documents for RAG:**

```typescript
async function processDocumentForRAG(file: File, env: Env): Promise<void> {
  // 1. Upload to R2
  const key = `documents/${crypto.randomUUID()}-${file.name}`;
  await env.BUCKET.put(key, file.stream());

  // 2. Extract text (assuming text file)
  const text = await file.text();

  // 3. Chunk text
  const chunks = chunkText(text, 512);

  // 4. Generate embeddings and store in Vectorize
  const rag = new RAGSystem(env.AI, env.VECTORIZE);
  await rag.addDocuments(
    chunks.map((chunk) => ({
      text: chunk,
      metadata: {
        fileName: file.name,
        fileKey: key,
        fileType: file.type,
      },
    })),
  );
}

function chunkText(text: string, chunkSize: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}
```

### 4.4 Hyperdrive: Global Database Acceleration

Hyperdrive accelerates connections to external databases (Postgres, MySQL) by:

- Connection pooling
- Query caching
- Global distribution

**Creating a Hyperdrive Configuration:**

```bash
wrangler hyperdrive create my-postgres \
  --connection-string="postgres://user:password@db.example.com:5432/mydb"

# Output
✅ Created Hyperdrive 'my-postgres'
🆔 Hyperdrive ID: abc123-def456

# Add to wrangler.jsonc:
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "abc123-def456"
```

**Using Hyperdrive:**

```typescript
import postgres from "postgres";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Connect to database via Hyperdrive
    const sql = postgres(env.HYPERDRIVE.connectionString);

    try {
      const users = await sql`
        SELECT id, name, email FROM users WHERE active = true
      `;

      return Response.json(users);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  },
};

interface Env {
  HYPERDRIVE: Hyperdrive;
}
```

---

## Part 5: Project Implementations

### 5.1 Project 1: RAG Chat Agent with Vectorize + YOUR AI Providers

**Complete implementation of a production-ready RAG chat system using YOUR AI providers for inference.**

**Key Architecture:**

- **Workers AI**: Used ONLY for embeddings (text → vectors)
- **YOUR Providers**: MiniMax/Gemini/DeepSeek for all chat/inference
- **Vectorize**: Vector database for semantic search
- **Durable Objects**: Per-user conversation state

**Project Structure:**

```
apps/app-01-rag-chat/
├── src/
│   ├── index.ts                # Worker entry point
│   ├── agents/
│   │   └── RAGChatAgent.ts     # Agent with conversation state
│   ├── lib/
│   │   ├── rag.ts              # RAG implementation (uses Workers AI for embeddings)
│   │   ├── ai-router.ts        # YOUR AI providers router (from Part 2)
│   │   └── chunking.ts         # Text chunking utilities
│   └── types.ts
├── wrangler.jsonc
├── package.json
└── schema.sql
```

**wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "app-01-rag-chat",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  // Workers AI binding - used ONLY for embeddings (not chat inference)
  "ai": {
    "binding": "AI",
  },

  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "rag-chat-embeddings",
    },
  ],

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "rag-chat-db",
      "database_id": "your-database-id",
    },
  ],

  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "rag-documents",
    },
  ],

  "durable_objects": {
    "bindings": [
      {
        "name": "RAG_CHAT_AGENT",
        "class_name": "RAGChatAgent",
      },
    ],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["RAGChatAgent"],
    },
  ],

  // IMPORTANT: Set these secrets via wrangler secret put:
  // - MINIMAX_API_KEY (primary provider)
  // - GEMINI_API_KEY (secondary)
  // - DEEPSEEK_API_KEY (tertiary)
  // - ANTHROPIC_API_KEY (optional backup)
}
```

**src/agents/RAGChatAgent.ts:**

```typescript
import { Agent } from "agents";
import { RAGSystem } from "../lib/rag";
import { createAIRouter, type AIRouter } from "../lib/ai-router";

// Env interface with YOUR AI provider keys
interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
  BUCKET: R2Bucket;
  RAG_CHAT_AGENT: DurableObjectNamespace;
  // YOUR AI Providers (secrets set via wrangler secret put)
  MINIMAX_API_KEY?: string;
  GEMINI_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

export class RAGChatAgent extends Agent {
  private rag: RAGSystem;
  private aiRouter: AIRouter;
  private connections: Set<WebSocket> = new Set();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // RAGSystem uses Workers AI ONLY for embeddings
    this.rag = new RAGSystem(env.AI, env.VECTORIZE);
    // AI Router uses YOUR providers for chat/inference
    this.aiRouter = createAIRouter(env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Initialize on first access
    if (!(await this.getState<boolean>("initialized"))) {
      await this.initialize();
    }

    if (url.pathname === "/chat") {
      return await this.handleChat(request);
    }

    if (url.pathname === "/upload") {
      return await this.handleUpload(request);
    }

    if (url.pathname === "/websocket") {
      return await this.handleWebSocket(request);
    }

    if (url.pathname === "/history") {
      return await this.getHistory();
    }

    return new Response("Not found", { status: 404 });
  }

  private async initialize() {
    // Create messages table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        sources TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    await this.setState("initialized", true);
    await this.setState("createdAt", Date.now());
  }

  private async handleChat(request: Request): Promise<Response> {
    const { message } = await request.json();

    // Save user message
    await this.saveMessage("user", message);

    // Get answer using RAG
    const answer = await this.rag.answerWithRAG(message);

    // Save AI response
    await this.saveMessage("assistant", answer);

    return Response.json({ answer });
  }

  private async handleUpload(request: Request): Promise<Response> {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to R2
    const key = `uploads/${crypto.randomUUID()}-${file.name}`;
    await this.env.BUCKET.put(key, file.stream());

    // Extract and index content
    const text = await file.text();
    await this.rag.addDocument(text, {
      fileName: file.name,
      fileKey: key,
      uploadedAt: Date.now(),
    });

    return Response.json({ success: true, key });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    this.connections.add(server);

    server.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        await this.handleWebSocketChat(data.message, server);
      }
    });

    server.addEventListener("close", () => {
      this.connections.delete(server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private async handleWebSocketChat(message: string, ws: WebSocket) {
    // Save user message
    await this.saveMessage("user", message);

    // Search for context using Vectorize
    const context = await this.rag.search(message, 3);

    // Build prompt with context
    const contextText = context.map((c) => c.text).join("\n\n");
    const systemPrompt = `You are a helpful assistant. Answer questions based on the provided context.
If the context doesn't contain relevant information, say so honestly.`;
    const userPrompt = `Context:\n${contextText}\n\nQuestion: ${message}`;

    // Stream response using YOUR AI providers (not Workers AI!)
    try {
      const stream = await this.aiRouter.stream({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        // Prefer MiniMax for streaming, fallback to Gemini/DeepSeek
        provider: "minimax",
      });

      let fullResponse = "";
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        fullResponse += text;

        ws.send(
          JSON.stringify({
            type: "token",
            content: text,
          }),
        );
      }

      // Save response
      await this.saveMessage("assistant", fullResponse);
      ws.send(JSON.stringify({ type: "done" }));
    } catch (streamError) {
      // Fallback to non-streaming if streaming fails
      console.error(
        "Streaming failed, using non-streaming fallback:",
        streamError,
      );

      const response = await this.aiRouter.chat({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      await this.saveMessage("assistant", response);
      ws.send(JSON.stringify({ type: "token", content: response }));
      ws.send(JSON.stringify({ type: "done" }));
    }
  }

  private async saveMessage(role: string, content: string, sources?: any[]) {
    await this.sql.exec({
      sql: "INSERT INTO messages (role, content, sources, created_at) VALUES (?, ?, ?, ?)",
      bind: [
        role,
        content,
        sources ? JSON.stringify(sources) : null,
        Date.now(),
      ],
    });
  }

  private async getHistory(): Promise<Response> {
    const result = await this.sql.exec({
      sql: "SELECT role, content, created_at FROM messages ORDER BY created_at DESC LIMIT 50",
    });

    const messages = result.results
      .map((row) => ({
        role: row[0],
        content: row[1],
        createdAt: row[2],
      }))
      .reverse();

    return Response.json({ messages });
  }
}
```

**src/index.ts:**

```typescript
import { RAGChatAgent } from "./agents/RAGChatAgent";

export { RAGChatAgent };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Extract user ID
    const userId = request.headers.get("X-User-ID") || "anonymous";

    // Get Agent instance
    const id = env.RAG_CHAT_AGENT.idFromName(userId);
    const stub = env.RAG_CHAT_AGENT.get(id);

    // Route to Agent
    return await stub.fetch(request);
  },
};

interface Env {
  RAG_CHAT_AGENT: DurableObjectNamespace;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
  BUCKET: R2Bucket;
  // YOUR AI Providers - set via wrangler secret put
  MINIMAX_API_KEY?: string;
  GEMINI_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}
```

**Deployment:**

```bash
# 1. Create Vectorize index (768 dimensions for Workers AI embeddings)
wrangler vectorize create rag-chat-embeddings --dimensions=768 --metric=cosine

# 2. Create D1 database
wrangler d1 create rag-chat-db

# 3. Create R2 bucket
wrangler r2 bucket create rag-documents

# 4. Update wrangler.jsonc with database ID from step 2

# 5. Set YOUR AI provider secrets (priority order)
echo "your-minimax-key" | wrangler secret put MINIMAX_API_KEY
echo "your-gemini-key" | wrangler secret put GEMINI_API_KEY
echo "your-deepseek-key" | wrangler secret put DEEPSEEK_API_KEY
# Optional: Direct Anthropic API as backup
echo "your-anthropic-key" | wrangler secret put ANTHROPIC_API_KEY

# 6. Deploy
wrangler deploy

# Verify secrets are set
wrangler secret list
```

**Testing:**

```bash
# Upload a document
curl https://app-01-rag-chat.your-subdomain.workers.dev/upload \
  -H "X-User-ID: user-123" \
  -F "file=@document.txt"

# Ask a question
curl https://app-01-rag-chat.your-subdomain.workers.dev/chat \
  -H "X-User-ID: user-123" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is in the document?"}'

# Get history
curl https://app-01-rag-chat.your-subdomain.workers.dev/history \
  -H "X-User-ID: user-123"
```

---

### 5.2 Project 2: Autonomous Research Agent with Cloudflare Workflows

**A multi-step research agent that decomposes questions, researches in parallel, and synthesizes comprehensive reports.**

**Key Cloudflare Features Showcased:**

- **Workflows**: Long-running, durable executions with automatic retries
- **Browser Rendering**: Web scraping and content extraction
- **Queues**: Async task processing for parallel research
- **D1**: Store research progress and final reports
- **R2**: Store extracted documents and screenshots

**Project Structure:**

```
apps/app-02-research-agent/
├── src/
│   ├── index.ts                    # Worker entry point
│   ├── workflows/
│   │   └── ResearchWorkflow.ts     # Main research workflow
│   ├── agents/
│   │   └── ResearchAgent.ts        # Durable Object for state
│   ├── lib/
│   │   ├── scraper.ts              # Browser Rendering integration
│   │   ├── synthesis.ts            # AI synthesis logic
│   │   └── search.ts               # Web search utilities
│   └── types.ts
├── wrangler.jsonc
├── package.json
└── schema.sql
```

**wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "app-02-research-agent",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  "ai": {
    "binding": "AI",
  },

  "browser": {
    "binding": "BROWSER",
  },

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "research-agent-db",
      "database_id": "your-database-id",
    },
  ],

  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "research-documents",
    },
  ],

  "queues": {
    "producers": [
      {
        "binding": "RESEARCH_QUEUE",
        "queue": "research-tasks",
      },
    ],
    "consumers": [
      {
        "queue": "research-tasks",
        "max_batch_size": 10,
        "max_retries": 3,
      },
    ],
  },

  "workflows": [
    {
      "binding": "RESEARCH_WORKFLOW",
      "name": "research-workflow",
      "class_name": "ResearchWorkflow",
    },
  ],

  "durable_objects": {
    "bindings": [
      {
        "name": "RESEARCH_AGENT",
        "class_name": "ResearchAgent",
      },
    ],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["ResearchAgent"],
    },
  ],
}
```

**src/workflows/ResearchWorkflow.ts:**

```typescript
import {
  WorkflowEntrypoint,
  WorkflowStep,
  WorkflowEvent,
} from "cloudflare:workers";

interface ResearchPayload {
  topic: string;
  userId: string;
  depth: "quick" | "standard" | "comprehensive";
}

interface ResearchResult {
  topic: string;
  questions: string[];
  findings: Array<{
    question: string;
    sources: Array<{ url: string; title: string; excerpt: string }>;
    answer: string;
  }>;
  synthesis: string;
  createdAt: number;
}

export class ResearchWorkflow extends WorkflowEntrypoint<Env, ResearchPayload> {
  async run(
    event: WorkflowEvent<ResearchPayload>,
    step: WorkflowStep,
  ): Promise<ResearchResult> {
    const { topic, userId, depth } = event.payload;
    const questionCount = depth === "quick" ? 3 : depth === "standard" ? 5 : 8;

    // Step 1: Decompose topic into research questions
    const questions = await step.do("decompose-topic", async () => {
      const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content: `You are a research assistant. Break down the given topic into ${questionCount} specific, researchable questions. Return ONLY a JSON array of strings.`,
          },
          {
            role: "user",
            content: `Topic: "${topic}"\n\nGenerate ${questionCount} research questions as a JSON array.`,
          },
        ],
      });

      try {
        return JSON.parse(response.response);
      } catch {
        // Fallback: split by newlines if not valid JSON
        return response.response
          .split("\n")
          .filter((q: string) => q.trim())
          .slice(0, questionCount);
      }
    });

    // Step 2: Research each question in parallel
    const findings = await step.do("research-questions", async () => {
      const results = await Promise.all(
        questions.map(async (question: string) => {
          // Search the web using Browser Rendering
          const sources = await this.searchAndScrape(question);

          // Synthesize answer from sources
          const answer = await this.synthesizeAnswer(question, sources);

          return { question, sources, answer };
        }),
      );

      return results;
    });

    // Step 3: Optional wait for human review (for comprehensive depth)
    if (depth === "comprehensive") {
      // Sleep for up to 24 hours waiting for human approval
      // In production, you'd check for an approval signal
      await step.sleep("wait-for-review", "1h");
    }

    // Step 4: Generate final synthesis
    const synthesis = await step.do("synthesize-report", async () => {
      const findingsText = findings
        .map(
          (f: any) =>
            `Question: ${f.question}\nAnswer: ${f.answer}\nSources: ${f.sources.map((s: any) => s.url).join(", ")}`,
        )
        .join("\n\n");

      const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content:
              "You are a research synthesizer. Create a comprehensive, well-structured report from the research findings. Include an executive summary, key findings, and conclusions.",
          },
          {
            role: "user",
            content: `Topic: "${topic}"\n\nResearch Findings:\n${findingsText}\n\nGenerate a comprehensive research report.`,
          },
        ],
      });

      return response.response;
    });

    // Step 5: Save to database
    await step.do("save-report", async () => {
      await this.env.DB.prepare(
        `INSERT INTO research_reports (user_id, topic, questions, findings, synthesis, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          userId,
          topic,
          JSON.stringify(questions),
          JSON.stringify(findings),
          synthesis,
          Date.now(),
        )
        .run();
    });

    return {
      topic,
      questions,
      findings,
      synthesis,
      createdAt: Date.now(),
    };
  }

  private async searchAndScrape(
    query: string,
  ): Promise<Array<{ url: string; title: string; excerpt: string }>> {
    // Use Browser Rendering to search and extract content
    const browser = await this.env.BROWSER.newPage();

    try {
      // Navigate to a search engine (or use your preferred search API)
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      await browser.goto(searchUrl, { waitUntil: "networkidle0" });

      // Extract search results
      const results = await browser.evaluate(() => {
        const links = document.querySelectorAll(".result__a");
        const snippets = document.querySelectorAll(".result__snippet");

        return Array.from(links)
          .slice(0, 3)
          .map((link, i) => ({
            url: (link as HTMLAnchorElement).href,
            title: link.textContent || "",
            excerpt: snippets[i]?.textContent || "",
          }));
      });

      return results;
    } finally {
      await browser.close();
    }
  }

  private async synthesizeAnswer(
    question: string,
    sources: Array<{ url: string; title: string; excerpt: string }>,
  ): Promise<string> {
    const context = sources
      .map((s) => `Source: ${s.title}\n${s.excerpt}`)
      .join("\n\n");

    const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "Answer the question based on the provided sources. Be concise but thorough. Cite sources when possible.",
        },
        {
          role: "user",
          content: `Question: ${question}\n\nSources:\n${context}\n\nProvide a well-researched answer.`,
        },
      ],
    });

    return response.response;
  }
}
```

**src/agents/ResearchAgent.ts:**

```typescript
import { Agent } from "agents";

interface ResearchSession {
  id: string;
  topic: string;
  status: "pending" | "running" | "completed" | "failed";
  workflowId?: string;
  result?: any;
  createdAt: number;
  updatedAt: number;
}

export class ResearchAgent extends Agent<Env> {
  private connections: Set<WebSocket> = new Set();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (!(await this.getState<boolean>("initialized"))) {
      await this.initialize();
    }

    switch (url.pathname) {
      case "/start":
        return await this.startResearch(request);
      case "/status":
        return await this.getStatus(request);
      case "/history":
        return await this.getHistory();
      case "/websocket":
        return await this.handleWebSocket(request);
      default:
        return new Response("Not found", { status: 404 });
    }
  }

  private async initialize() {
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        status TEXT NOT NULL,
        workflow_id TEXT,
        result TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    await this.setState("initialized", true);
  }

  private async startResearch(request: Request): Promise<Response> {
    const { topic, depth = "standard" } = await request.json();
    const sessionId = crypto.randomUUID();

    // Create workflow instance
    const workflow = await this.env.RESEARCH_WORKFLOW.create({
      id: sessionId,
      params: {
        topic,
        userId: this.ctx.id.toString(),
        depth,
      },
    });

    // Save session
    await this.sql.exec({
      sql: `INSERT INTO sessions (id, topic, status, workflow_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      bind: [sessionId, topic, "running", workflow.id, Date.now(), Date.now()],
    });

    // Notify connected clients
    this.broadcast({ type: "research-started", sessionId, topic });

    // Schedule status check
    await this.schedule({
      fn: this.checkWorkflowStatus,
      args: [sessionId, workflow.id],
      delayMs: 5000,
    });

    return Response.json({
      sessionId,
      workflowId: workflow.id,
      status: "running",
    });
  }

  private async checkWorkflowStatus(sessionId: string, workflowId: string) {
    const workflow = await this.env.RESEARCH_WORKFLOW.get(workflowId);
    const status = await workflow.status();

    if (status.status === "running") {
      // Check again in 5 seconds
      await this.schedule({
        fn: this.checkWorkflowStatus,
        args: [sessionId, workflowId],
        delayMs: 5000,
      });
    } else if (status.status === "complete") {
      const result = status.output;

      await this.sql.exec({
        sql: `UPDATE sessions SET status = ?, result = ?, updated_at = ? WHERE id = ?`,
        bind: ["completed", JSON.stringify(result), Date.now(), sessionId],
      });

      this.broadcast({
        type: "research-complete",
        sessionId,
        result,
      });
    } else if (status.status === "errored") {
      await this.sql.exec({
        sql: `UPDATE sessions SET status = ?, updated_at = ? WHERE id = ?`,
        bind: ["failed", Date.now(), sessionId],
      });

      this.broadcast({
        type: "research-failed",
        sessionId,
        error: status.error,
      });
    }
  }

  private async getStatus(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("id");

    if (!sessionId) {
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    const result = await this.sql.exec({
      sql: "SELECT * FROM sessions WHERE id = ?",
      bind: [sessionId],
    });

    if (result.results.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const session = result.results[0];
    return Response.json({
      id: session[0],
      topic: session[1],
      status: session[2],
      result: session[4] ? JSON.parse(session[4] as string) : null,
      createdAt: session[5],
      updatedAt: session[6],
    });
  }

  private async getHistory(): Promise<Response> {
    const result = await this.sql.exec({
      sql: "SELECT id, topic, status, created_at FROM sessions ORDER BY created_at DESC LIMIT 20",
    });

    const sessions = result.results.map((row) => ({
      id: row[0],
      topic: row[1],
      status: row[2],
      createdAt: row[3],
    }));

    return Response.json({ sessions });
  }

  private async handleWebSocket(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    this.connections.add(server);

    server.addEventListener("close", () => {
      this.connections.delete(server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private broadcast(message: any) {
    const data = JSON.stringify(message);
    for (const ws of this.connections) {
      ws.send(data);
    }
  }
}
```

**src/index.ts:**

```typescript
import { ResearchAgent } from "./agents/ResearchAgent";
import { ResearchWorkflow } from "./workflows/ResearchWorkflow";

export { ResearchAgent, ResearchWorkflow };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const userId = request.headers.get("X-User-ID") || "anonymous";

    // Route to Research Agent
    const id = env.RESEARCH_AGENT.idFromName(userId);
    const stub = env.RESEARCH_AGENT.get(id);

    return await stub.fetch(request);
  },

  // Queue consumer for async research tasks
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const { type, payload } = message.body;

      if (type === "scrape") {
        // Handle scraping tasks
        const browser = await env.BROWSER.newPage();
        try {
          await browser.goto(payload.url);
          const content = await browser.content();

          // Store in R2
          await env.BUCKET.put(`scrapes/${payload.id}.html`, content);

          message.ack();
        } catch (error) {
          message.retry();
        } finally {
          await browser.close();
        }
      }
    }
  },
};

interface Env {
  AI: Ai;
  BROWSER: Browser;
  DB: D1Database;
  BUCKET: R2Bucket;
  RESEARCH_QUEUE: Queue;
  RESEARCH_WORKFLOW: Workflow;
  RESEARCH_AGENT: DurableObjectNamespace;
}
```

**schema.sql:**

```sql
CREATE TABLE IF NOT EXISTS research_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  questions TEXT NOT NULL,
  findings TEXT NOT NULL,
  synthesis TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_user_id ON research_reports(user_id);
CREATE INDEX idx_created_at ON research_reports(created_at);
```

**Deployment:**

```bash
# 1. Create D1 database
wrangler d1 create research-agent-db
wrangler d1 execute research-agent-db --file=schema.sql --remote

# 2. Create R2 bucket
wrangler r2 bucket create research-documents

# 3. Create Queue
wrangler queues create research-tasks

# 4. Deploy
wrangler deploy

# 5. Test
curl https://app-02-research-agent.workers.dev/start \
  -H "X-User-ID: user-123" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Impact of AI on software development", "depth": "standard"}'
```

---

### 5.3 Project 3: Real-Time Collaborative Editor with Durable Objects

**A real-time collaborative document editor using Durable Objects for state synchronization and conflict resolution.**

**Key Cloudflare Features Showcased:**

- **Durable Objects**: Single-point-of-truth for document state
- **WebSockets**: Real-time bidirectional communication
- **Workers AI**: AI-powered autocomplete and suggestions
- **D1**: Version history and document storage

**wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "app-03-collaborative-editor",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  "ai": {
    "binding": "AI",
  },

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "editor-db",
      "database_id": "your-database-id",
    },
  ],

  "durable_objects": {
    "bindings": [
      {
        "name": "DOCUMENT",
        "class_name": "DocumentObject",
      },
    ],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["DocumentObject"],
    },
  ],
}
```

**src/agents/DocumentObject.ts:**

```typescript
import { Agent } from "agents";

interface Operation {
  type: "insert" | "delete" | "replace";
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

interface Cursor {
  userId: string;
  position: number;
  name: string;
  color: string;
}

export class DocumentObject extends Agent<Env> {
  private content: string = "";
  private cursors: Map<string, Cursor> = new Map();
  private connections: Map<WebSocket, string> = new Map();
  private operationHistory: Operation[] = [];

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (!(await this.getState<boolean>("initialized"))) {
      await this.initialize();
    }

    switch (url.pathname) {
      case "/connect":
        return await this.handleConnect(request);
      case "/content":
        return Response.json({ content: this.content });
      case "/suggest":
        return await this.getAISuggestion(request);
      case "/history":
        return await this.getVersionHistory();
      default:
        return new Response("Not found", { status: 404 });
    }
  }

  private async initialize() {
    // Load content from state
    this.content = (await this.getState<string>("content")) || "";
    this.operationHistory =
      (await this.getState<Operation[]>("operations")) || [];

    // Create version history table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        user_id TEXT NOT NULL,
        message TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    await this.setState("initialized", true);
  }

  private async handleConnect(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") || crypto.randomUUID();
    const userName = url.searchParams.get("name") || "Anonymous";
    const userColor = this.generateColor(userId);

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    this.connections.set(server, userId);

    // Add cursor for new user
    this.cursors.set(userId, {
      userId,
      position: 0,
      name: userName,
      color: userColor,
    });

    // Send initial state
    server.send(
      JSON.stringify({
        type: "init",
        content: this.content,
        cursors: Array.from(this.cursors.values()),
        userId,
      }),
    );

    // Notify others of new user
    this.broadcast(
      {
        type: "user-joined",
        cursor: this.cursors.get(userId),
      },
      server,
    );

    // Handle messages
    server.addEventListener("message", async (event) => {
      const message = JSON.parse(event.data);
      await this.handleMessage(message, userId, server);
    });

    // Handle disconnect
    server.addEventListener("close", () => {
      this.connections.delete(server);
      this.cursors.delete(userId);

      this.broadcast({
        type: "user-left",
        userId,
      });
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private async handleMessage(message: any, userId: string, ws: WebSocket) {
    switch (message.type) {
      case "operation":
        await this.applyOperation(message.operation, userId);
        break;

      case "cursor":
        this.updateCursor(userId, message.position);
        break;

      case "save":
        await this.saveVersion(userId, message.message);
        break;
    }
  }

  private async applyOperation(op: Operation, userId: string) {
    op.userId = userId;
    op.timestamp = Date.now();

    // Apply operation to content
    switch (op.type) {
      case "insert":
        this.content =
          this.content.slice(0, op.position) +
          op.content +
          this.content.slice(op.position);
        break;

      case "delete":
        this.content =
          this.content.slice(0, op.position) +
          this.content.slice(op.position + (op.length || 1));
        break;

      case "replace":
        this.content =
          this.content.slice(0, op.position) +
          op.content +
          this.content.slice(op.position + (op.length || 0));
        break;
    }

    // Save state
    this.operationHistory.push(op);
    await this.setState("content", this.content);
    await this.setState("operations", this.operationHistory.slice(-1000)); // Keep last 1000 ops

    // Transform and broadcast operation
    this.broadcast({
      type: "operation",
      operation: op,
    });
  }

  private updateCursor(userId: string, position: number) {
    const cursor = this.cursors.get(userId);
    if (cursor) {
      cursor.position = position;
      this.cursors.set(userId, cursor);

      this.broadcast({
        type: "cursor",
        cursor,
      });
    }
  }

  private async saveVersion(userId: string, message?: string) {
    await this.sql.exec({
      sql: "INSERT INTO versions (content, user_id, message, created_at) VALUES (?, ?, ?, ?)",
      bind: [this.content, userId, message || null, Date.now()],
    });

    this.broadcast({
      type: "version-saved",
      userId,
      message,
      timestamp: Date.now(),
    });
  }

  private async getAISuggestion(request: Request): Promise<Response> {
    const { context, cursorPosition } = await request.json();

    // Get text around cursor for context
    const beforeCursor = this.content.slice(
      Math.max(0, cursorPosition - 500),
      cursorPosition,
    );
    const afterCursor = this.content.slice(
      cursorPosition,
      cursorPosition + 100,
    );

    const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a writing assistant. Complete the text naturally. Return ONLY the completion, no explanation.",
        },
        {
          role: "user",
          content: `Continue this text naturally:\n\n${beforeCursor}[CURSOR]${afterCursor}\n\nProvide a short, natural continuation (1-2 sentences max).`,
        },
      ],
    });

    return Response.json({ suggestion: response.response.trim() });
  }

  private async getVersionHistory(): Promise<Response> {
    const result = await this.sql.exec({
      sql: "SELECT id, user_id, message, created_at FROM versions ORDER BY created_at DESC LIMIT 50",
    });

    const versions = result.results.map((row) => ({
      id: row[0],
      userId: row[1],
      message: row[2],
      createdAt: row[3],
    }));

    return Response.json({ versions });
  }

  private broadcast(message: any, exclude?: WebSocket) {
    const data = JSON.stringify(message);
    for (const [ws] of this.connections) {
      if (ws !== exclude) {
        ws.send(data);
      }
    }
  }

  private generateColor(userId: string): string {
    // Generate consistent color from userId
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }
}
```

**Deployment:**

```bash
wrangler d1 create editor-db
wrangler deploy

# Test WebSocket connection
wscat -c "wss://app-03-collaborative-editor.workers.dev/connect?userId=user1&name=Alice"
```

---

### 5.4 Project 4: Multi-Modal AI with Browser Rendering

**An AI-powered web scraper and content analyzer that captures screenshots, extracts content, and provides AI analysis.**

**Key Cloudflare Features:**

- **Browser Rendering**: Headless Chrome for screenshots and scraping
- **Workers AI**: Vision models for image analysis
- **R2**: Store screenshots and extracted content
- **D1**: Index scraped pages

**wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "app-04-multimodal-ai",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  "ai": {
    "binding": "AI",
  },

  "browser": {
    "binding": "BROWSER",
  },

  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "screenshots",
    },
  ],

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "scraper-db",
      "database_id": "your-database-id",
    },
  ],
}
```

**src/index.ts:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/screenshot":
        return await takeScreenshot(request, env);
      case "/analyze":
        return await analyzeUrl(request, env);
      case "/extract":
        return await extractContent(request, env);
      case "/pdf":
        return await generatePdf(request, env);
      default:
        return new Response("Not found", { status: 404 });
    }
  },
};

async function takeScreenshot(request: Request, env: Env): Promise<Response> {
  const {
    url,
    fullPage = false,
    width = 1280,
    height = 720,
  } = await request.json();

  const browser = await env.BROWSER.newPage();

  try {
    await browser.setViewport({ width, height });
    await browser.goto(url, { waitUntil: "networkidle0" });

    const screenshot = await browser.screenshot({
      fullPage,
      type: "png",
    });

    // Store in R2
    const key = `screenshots/${crypto.randomUUID()}.png`;
    await env.BUCKET.put(key, screenshot, {
      httpMetadata: { contentType: "image/png" },
    });

    return Response.json({
      success: true,
      key,
      url: `/image/${key}`,
    });
  } finally {
    await browser.close();
  }
}

async function analyzeUrl(request: Request, env: Env): Promise<Response> {
  const { url } = await request.json();

  const browser = await env.BROWSER.newPage();

  try {
    await browser.goto(url, { waitUntil: "networkidle0" });

    // Take screenshot for vision analysis
    const screenshot = await browser.screenshot({ type: "png" });

    // Extract text content
    const textContent = await browser.evaluate(() => {
      return document.body.innerText;
    });

    // Extract metadata
    const metadata = await browser.evaluate(() => {
      return {
        title: document.title,
        description:
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") || "",
        keywords:
          document
            .querySelector('meta[name="keywords"]')
            ?.getAttribute("content") || "",
        links: Array.from(document.querySelectorAll("a"))
          .map((a) => ({
            text: a.textContent?.trim(),
            href: a.href,
          }))
          .filter((l) => l.text && l.href)
          .slice(0, 20),
      };
    });

    // AI analysis of content
    const analysis = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "Analyze the following webpage content. Provide: 1) Summary, 2) Key topics, 3) Sentiment, 4) Target audience. Be concise.",
        },
        {
          role: "user",
          content: `URL: ${url}\nTitle: ${metadata.title}\nContent:\n${textContent.slice(0, 3000)}`,
        },
      ],
    });

    // Store screenshot
    const key = `analysis/${crypto.randomUUID()}.png`;
    await env.BUCKET.put(key, screenshot);

    // Store in database
    await env.DB.prepare(
      `INSERT INTO pages (url, title, content, metadata, analysis, screenshot_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        url,
        metadata.title,
        textContent.slice(0, 10000),
        JSON.stringify(metadata),
        analysis.response,
        key,
        Date.now(),
      )
      .run();

    return Response.json({
      url,
      metadata,
      analysis: analysis.response,
      screenshotKey: key,
    });
  } finally {
    await browser.close();
  }
}

async function extractContent(request: Request, env: Env): Promise<Response> {
  const { url, selector, format = "text" } = await request.json();

  const browser = await env.BROWSER.newPage();

  try {
    await browser.goto(url, { waitUntil: "networkidle0" });

    let content;
    if (selector) {
      content = await browser.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, selector);
    } else {
      content = await browser.evaluate(() => document.body.innerHTML);
    }

    if (format === "markdown") {
      // Convert HTML to markdown using AI
      const markdown = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content:
              "Convert the following HTML to clean Markdown. Preserve structure, links, and formatting.",
          },
          {
            role: "user",
            content: content?.slice(0, 5000) || "",
          },
        ],
      });

      return Response.json({ content: markdown.response });
    }

    return Response.json({ content });
  } finally {
    await browser.close();
  }
}

async function generatePdf(request: Request, env: Env): Promise<Response> {
  const { url, format = "A4" } = await request.json();

  const browser = await env.BROWSER.newPage();

  try {
    await browser.goto(url, { waitUntil: "networkidle0" });

    const pdf = await browser.pdf({
      format,
      printBackground: true,
    });

    const key = `pdfs/${crypto.randomUUID()}.pdf`;
    await env.BUCKET.put(key, pdf, {
      httpMetadata: { contentType: "application/pdf" },
    });

    return Response.json({ key, url: `/file/${key}` });
  } finally {
    await browser.close();
  }
}

interface Env {
  AI: Ai;
  BROWSER: Browser;
  BUCKET: R2Bucket;
  DB: D1Database;
}
```

---

### 5.5 Project 5: AI Agent Swarm Orchestrator

**A multi-agent system where specialized agents collaborate to solve complex tasks.**

**Key Cloudflare Features:**

- **Multiple Durable Objects**: Each agent type is a separate DO class
- **Inter-agent communication**: Agents call each other via stubs
- **Workflows**: Orchestrate multi-agent tasks
- **Queues**: Async task distribution

**wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "app-05-agent-swarm",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-22",
  "compatibility_flags": ["nodejs_compat"],

  "ai": {
    "binding": "AI",
  },

  "queues": {
    "producers": [
      {
        "binding": "TASK_QUEUE",
        "queue": "agent-tasks",
      },
    ],
  },

  "durable_objects": {
    "bindings": [
      {
        "name": "COORDINATOR",
        "class_name": "CoordinatorAgent",
      },
      {
        "name": "RESEARCHER",
        "class_name": "ResearcherAgent",
      },
      {
        "name": "WRITER",
        "class_name": "WriterAgent",
      },
      {
        "name": "CRITIC",
        "class_name": "CriticAgent",
      },
    ],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": [
        "CoordinatorAgent",
        "ResearcherAgent",
        "WriterAgent",
        "CriticAgent",
      ],
    },
  ],
}
```

**src/agents/CoordinatorAgent.ts:**

```typescript
import { Agent } from "agents";

interface Task {
  id: string;
  type: "research" | "write" | "review";
  input: any;
  status: "pending" | "assigned" | "completed" | "failed";
  result?: any;
  assignedTo?: string;
}

export class CoordinatorAgent extends Agent<Env> {
  private tasks: Map<string, Task> = new Map();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/execute":
        return await this.executeTask(request);
      case "/status":
        return await this.getStatus(request);
      default:
        return new Response("Not found", { status: 404 });
    }
  }

  async executeTask(request: Request): Promise<Response> {
    const { goal, context } = await request.json();
    const taskId = crypto.randomUUID();

    // Decompose goal into subtasks
    const plan = await this.planExecution(goal, context);

    // Execute plan
    const results = [];
    for (const step of plan.steps) {
      const result = await this.delegateToAgent(step);
      results.push(result);

      // Check if critic approves
      if (step.requiresReview) {
        const review = await this.requestReview(result);
        if (!review.approved) {
          // Retry with feedback
          const revised = await this.delegateToAgent({
            ...step,
            feedback: review.feedback,
          });
          results.push(revised);
        }
      }
    }

    return Response.json({
      taskId,
      goal,
      results,
      status: "completed",
    });
  }

  private async planExecution(
    goal: string,
    context: any,
  ): Promise<{ steps: any[] }> {
    const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: `You are a task planner. Break down the goal into steps.
          Available agents: researcher (for gathering info), writer (for creating content), critic (for reviewing).
          Return a JSON array of steps: [{"agent": "researcher|writer|critic", "task": "description", "requiresReview": true|false}]`,
        },
        {
          role: "user",
          content: `Goal: ${goal}\nContext: ${JSON.stringify(context)}`,
        },
      ],
    });

    try {
      return { steps: JSON.parse(response.response) };
    } catch {
      return {
        steps: [
          { agent: "researcher", task: goal, requiresReview: false },
          {
            agent: "writer",
            task: "Synthesize findings",
            requiresReview: true,
          },
        ],
      };
    }
  }

  private async delegateToAgent(step: any): Promise<any> {
    let stub;

    switch (step.agent) {
      case "researcher":
        const researcherId = this.env.RESEARCHER.idFromName("default");
        stub = this.env.RESEARCHER.get(researcherId);
        break;
      case "writer":
        const writerId = this.env.WRITER.idFromName("default");
        stub = this.env.WRITER.get(writerId);
        break;
      case "critic":
        const criticId = this.env.CRITIC.idFromName("default");
        stub = this.env.CRITIC.get(criticId);
        break;
      default:
        throw new Error(`Unknown agent: ${step.agent}`);
    }

    const response = await stub.fetch(
      new Request("http://internal/execute", {
        method: "POST",
        body: JSON.stringify(step),
      }),
    );

    return await response.json();
  }

  private async requestReview(
    content: any,
  ): Promise<{ approved: boolean; feedback?: string }> {
    const criticId = this.env.CRITIC.idFromName("default");
    const critic = this.env.CRITIC.get(criticId);

    const response = await critic.fetch(
      new Request("http://internal/review", {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
    );

    return await response.json();
  }
}

// ResearcherAgent, WriterAgent, CriticAgent follow similar patterns
// Each specialized for their domain
```

---

### 5.6 Projects 6-10: Additional Implementations

Brief implementations showcasing different Cloudflare Workers patterns:

**Project 6: Email Processing Agent**

- Uses **Email Workers** to process incoming emails
- AI classification and auto-response
- Attachments stored in R2

**Project 7: Code Generation Platform**

- **Containers** for running generated code safely
- Workers AI for code generation
- Sandboxed execution environment

**Project 8: Content Moderation Pipeline**

- **Queues** for async processing at scale
- Workers AI for content classification
- D1 for moderation logs

**Project 9: Intelligent API Gateway**

- **Workers** as smart proxy
- AI Gateway for caching and routing
- Rate limiting and authentication

**Project 10: AI Analytics Dashboard**

- **Analytics Engine** for custom metrics
- Real-time WebSocket updates
- D1 for data aggregation

---

## Part 6: Advanced Patterns

### 6.1 Containers: Running Custom Runtimes

Containers allow running Docker containers on Cloudflare's network when Workers aren't sufficient.

**Use Cases:**

- Custom Python ML models
- Resource-intensive processing
- Applications requiring full filesystem access

**Basic Container Setup:**

```typescript
// src/index.ts
import { Container, getContainer } from "@cloudflare/containers";

export class MLContainer extends Container {
  defaultPort = 8000;
  sleepAfter = "5m"; // Stop after 5 minutes of inactivity
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const sessionId = request.headers.get("X-Session-ID") || "default";
    const container = getContainer(env.ML_CONTAINER, sessionId);

    // Forward request to container
    return container.fetch(request);
  },
};
```

**wrangler.jsonc:**

```jsonc
{
  "containers": [
    {
      "class_name": "MLContainer",
      "image": "./Dockerfile",
      "max_instances": 10,
    },
  ],
  "durable_objects": {
    "bindings": [
      {
        "name": "ML_CONTAINER",
        "class_name": "MLContainer",
      },
    ],
  },
}
```

### 6.2 Browser Rendering: Advanced Patterns

**Session Reuse for Performance:**

```typescript
export class BrowserSession extends Agent<Env> {
  private browser?: Browser;

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await this.env.BROWSER.newPage();
    }
    return this.browser;
  }

  async scrapeMultiple(urls: string[]): Promise<any[]> {
    const browser = await this.getBrowser();
    const results = [];

    for (const url of urls) {
      await browser.goto(url);
      const content = await browser.evaluate(() => document.body.innerText);
      results.push({ url, content });
    }

    return results;
  }
}
```

### 6.3 Email Workers

**Processing Incoming Emails:**

```typescript
export default {
  async email(message: EmailMessage, env: Env): Promise<void> {
    const { from, to, subject } = message;

    // Get email content
    const content = await message.text();

    // Classify with AI
    const classification = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "Classify this email: spam, urgent, normal, or promotional. Return ONLY the category.",
        },
        {
          role: "user",
          content: `From: ${from}\nSubject: ${subject}\n\n${content.slice(0, 1000)}`,
        },
      ],
    });

    // Store in D1
    await env.DB.prepare(
      "INSERT INTO emails (from_addr, subject, category, received_at) VALUES (?, ?, ?, ?)",
    )
      .bind(from, subject, classification.response.trim(), Date.now())
      .run();

    // Forward urgent emails
    if (classification.response.includes("urgent")) {
      await message.forward("urgent@yourdomain.com");
    }
  },
};
```

### 6.4 Workflows: Long-Running Tasks

**Multi-Day Research Pipeline:**

```typescript
export class LongResearchWorkflow extends WorkflowEntrypoint<
  Env,
  { topic: string }
> {
  async run(event: WorkflowEvent<{ topic: string }>, step: WorkflowStep) {
    // Day 1: Initial research
    const initialFindings = await step.do("initial-research", async () => {
      return await this.gatherInitialData(event.payload.topic);
    });

    // Wait for human review (up to 7 days)
    await step.sleep("human-review-period", "7d");

    // Day 8: Deep dive based on feedback
    const deepDive = await step.do("deep-research", async () => {
      return await this.conductDeepResearch(initialFindings);
    });

    // Day 9: Generate report
    const report = await step.do("generate-report", async () => {
      return await this.generateFinalReport(deepDive);
    });

    return report;
  }
}
```

### 6.5 Queues: Async Processing at Scale

**Batch Processing Pattern:**

```typescript
export default {
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    const results = await Promise.allSettled(
      batch.messages.map(async (message) => {
        try {
          await processMessage(message.body, env);
          message.ack();
        } catch (error) {
          if (message.attempts < 3) {
            message.retry({ delaySeconds: Math.pow(2, message.attempts) * 60 });
          } else {
            // Send to dead letter queue
            await env.DLQ.send({
              original: message.body,
              error: error.message,
              attempts: message.attempts,
            });
            message.ack();
          }
        }
      }),
    );

    console.log(`Processed ${results.length} messages`);
  },
};
```

---

## Part 7: Deployment & Operations

### 7.1 GitHub Actions CI/CD

**.github/workflows/deploy.yml:**

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        env:
          MINIMAX_API_KEY: ${{ secrets.MINIMAX_API_KEY }}
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
```

### 7.2 Multi-Environment Deployment

```jsonc
{
  "name": "ai-app",
  "env": {
    "staging": {
      "name": "ai-app-staging",
      "vars": { "ENVIRONMENT": "staging" },
      "routes": [{ "pattern": "staging.example.com/*" }],
    },
    "production": {
      "name": "ai-app",
      "vars": { "ENVIRONMENT": "production" },
      "routes": [{ "pattern": "app.example.com/*" }],
    },
  },
}
```

```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

### 7.3 Monitoring & Observability

**Custom Logging:**

```typescript
function log(level: "info" | "warn" | "error", message: string, data?: any) {
  console.log(
    JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...data,
    }),
  );
}

// Usage
log("info", "Request processed", { userId, duration: Date.now() - start });
```

**Viewing Logs:**

```bash
# Real-time logs
wrangler tail

# Filter by status
wrangler tail --status error

# JSON format for parsing
wrangler tail --format json
```

### 7.4 Security Best Practices

**Rate Limiting:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ip = request.headers.get("CF-Connecting-IP");
    const key = `rate:${ip}`;

    // Check rate limit (using KV or D1)
    const count = parseInt((await env.KV.get(key)) || "0");

    if (count > 100) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    await env.KV.put(key, String(count + 1), { expirationTtl: 60 });

    // Process request...
  },
};
```

**JWT Authentication:**

```typescript
import { verify } from "@tsndr/cloudflare-worker-jwt";

async function authenticate(
  request: Request,
  env: Env,
): Promise<string | null> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const valid = await verify(token, env.JWT_SECRET);
    if (!valid) return null;

    const { payload } = decode(token);
    return payload.sub as string;
  } catch {
    return null;
  }
}
```

---

## Conclusion

This comprehensive guide covers deploying **10 AI portfolio applications** using the **Cloudflare Workers ecosystem**.

### Key Technologies Covered:

| Service               | Purpose                           |
| --------------------- | --------------------------------- |
| **Workers**           | Serverless compute at the edge    |
| **Durable Objects**   | Stateful coordination and storage |
| **Agents SDK**        | High-level AI agent framework     |
| **Workers AI**        | Serverless GPU inference          |
| **Vectorize**         | Vector database for RAG           |
| **D1**                | Serverless SQLite                 |
| **R2**                | Object storage                    |
| **Browser Rendering** | Headless Chrome                   |
| **Workflows**         | Long-running executions           |
| **Queues**            | Async task processing             |
| **Containers**        | Custom Docker runtimes            |
| **AI Gateway**        | AI observability and caching      |

### What Makes This Stack Powerful:

✅ **Global by default** - 300+ edge locations  
✅ **Zero cold starts** - <5ms startup times  
✅ **Integrated platform** - No external dependencies needed  
✅ **Stateful when needed** - Durable Objects for coordination  
✅ **AI-native** - Workers AI, Vectorize, AI Gateway  
✅ **Cost-effective** - Generous free tiers, pay-per-use  
✅ **Simple deployment** - `wrangler deploy`

### Quick Reference Commands:

```bash
# Development
wrangler dev                    # Local development
wrangler dev --remote           # Remote preview

# Deployment
wrangler deploy                 # Deploy to production
wrangler deploy --env staging   # Deploy to staging

# Database
wrangler d1 create <name>       # Create D1 database
wrangler d1 execute <name> --file=schema.sql

# Storage
wrangler r2 bucket create <name>
wrangler vectorize create <name> --dimensions=768

# Secrets
echo "key" | wrangler secret put SECRET_NAME

# Logs
wrangler tail                   # Stream logs
wrangler tail --format json     # JSON format
```

**This is the future of AI application development. Ship globally, scale infinitely, pay only for what you use.**
