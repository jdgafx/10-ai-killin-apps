# Deployment Guide

> **Cloudflare Pages** is the primary deployment platform for all 10 AI applications.

---

## Quick Start

```bash
# 1. Set Cloudflare credentials
export CLOUDFLARE_API_TOKEN="your-api-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"

# 2. Build and deploy an app
cd apps/app-01-rag-chat
npm run build
npx wrangler pages deploy dist --project-name="app-01-rag-chat"
```

---

## Deployment Options

### 1. Cloudflare Pages (Primary - Recommended)

**Best for**: Edge deployment, global CDN, serverless functions, zero cold starts

| Feature                   | Details                        |
| ------------------------- | ------------------------------ |
| **Cost**                  | Free tier (unlimited requests) |
| **SSL**                   | Automatic                      |
| **Deployment Time**       | ~1 min                         |
| **Custom Domain**         | Yes                            |
| **Environment Variables** | Yes (encrypted)                |
| **Serverless Functions**  | Yes (Workers)                  |
| **Global CDN**            | 300+ edge locations            |

**URLs**: `https://app-name.pages.dev`

See [Cloudflare Deployment](#cloudflare-deployment-details) below for complete instructions.

---

### 2. Vercel (Alternative)

**Best for**: Quick deployments, preview URLs, if Cloudflare is unavailable

```bash
npm install -g vercel
vercel login
cd apps/app-01-rag-chat
vercel --prod
```

---

### 3. Docker (Local Development)

**Best for**: Local testing, self-hosted production

```bash
cp .env.example .env
./scripts/docker-deploy.sh
```

See [docs/DOCKER_QUICKSTART.md](docs/DOCKER_QUICKSTART.md).

---

## Cloudflare Deployment Details

### Prerequisites

1. **Cloudflare Account**: [Sign up](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**: `npm install -g wrangler`
3. **API Token**: Create at [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Use template: "Edit Cloudflare Workers"
   - Permissions needed: Workers Scripts (Edit), Pages (Edit)

### Step 1: Authenticate

```bash
# Interactive login (opens browser)
wrangler login

# Verify authentication
wrangler whoami
```

Or use environment variables for CI/CD:

```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
```

### Step 2: Deploy a Single App

```bash
cd apps/app-01-rag-chat
npm run build
npx wrangler pages deploy dist --project-name="app-01-rag-chat" --commit-dirty=true
```

### Step 3: Deploy All Apps

```bash
# Deploy all 10 apps
./scripts/deploy-cloudflare.sh

# Or manually:
for app in apps/app-*/; do
  cd "$app"
  npm run build
  npx wrangler pages deploy dist --project-name="$(basename $app)"
  cd ../..
done
```

### Step 4: Set Environment Variables (Secrets)

```bash
# Navigate to app directory
cd apps/app-01-rag-chat

# Set secrets (encrypted at rest)
echo "your-api-key" | wrangler secret put MINIMAX_API_KEY
echo "your-api-key" | wrangler secret put DEEPSEEK_API_KEY
echo "your-api-key" | wrangler secret put GEMINI_API_KEY

# List secrets
wrangler secret list
```

Or via Cloudflare Dashboard: **Pages > Project > Settings > Environment Variables**

---

## GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
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

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy apps/app-01-rag-chat/dist --project-name=app-01-rag-chat
```

### Setting GitHub Secrets

```bash
gh secret set CLOUDFLARE_API_TOKEN --body "your-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"
gh secret set MINIMAX_API_KEY --body "your-key"
gh secret set DEEPSEEK_API_KEY --body "your-key"
gh secret set GEMINI_API_KEY --body "your-key"
```

---

## Environment Variables

### Required API Keys

| Variable            | Provider            | Required |
| ------------------- | ------------------- | -------- |
| `MINIMAX_API_KEY`   | MiniMax (primary)   | Yes      |
| `DEEPSEEK_API_KEY`  | DeepSeek (fallback) | Yes      |
| `GEMINI_API_KEY`    | Google Gemini       | Optional |
| `ANTHROPIC_API_KEY` | Anthropic Claude    | Optional |

### Configuration

| Variable              | Default      | Description         |
| --------------------- | ------------ | ------------------- |
| `DEFAULT_AI_PROVIDER` | `minimax`    | Primary AI provider |
| `ENVIRONMENT`         | `production` | Environment name    |

### Local Development

Create `.env.local` (never commit):

```bash
VITE_MINIMAX_API_KEY=sk-cp-your-key
VITE_DEEPSEEK_API_KEY=sk-your-key
VITE_GEMINI_API_KEY=your-key
```

---

## Current Deployment Status

See [CLOUDFLARE_DEPLOYMENT_STATUS.md](CLOUDFLARE_DEPLOYMENT_STATUS.md) for live URLs.

### Live URLs

| App                       | URL                                         |
| ------------------------- | ------------------------------------------- |
| app-01-rag-chat           | https://app-01-rag-chat.pages.dev           |
| app-10-rag-knowledge-base | https://app-10-rag-knowledge-base.pages.dev |

---

## Troubleshooting

### Build Fails

```bash
rm -rf node_modules dist
npm install
npm run build
```

### Authentication Issues

```bash
# Re-authenticate
wrangler logout
wrangler login

# Verify
wrangler whoami
```

### Environment Variables Not Loading

- Cloudflare: Check in Pages > Project > Settings > Environment Variables
- Verify variable names match code (case-sensitive)
- Rebuild and redeploy after adding variables

### Deployment Stuck

```bash
# List deployments
npx wrangler pages deployment list --project-name="app-01-rag-chat"

# Check Wrangler version
wrangler --version
```

---

## Platform Comparison

| Feature                  | Cloudflare Pages   | Vercel               | Docker             |
| ------------------------ | ------------------ | -------------------- | ------------------ |
| **Cost**                 | Free (unlimited)   | Free (limited)       | Free (self-hosted) |
| **Edge CDN**             | 300+ locations     | 30+ locations        | N/A                |
| **Cold Starts**          | None               | ~100ms               | N/A                |
| **Serverless Functions** | Workers (included) | Serverless Functions | N/A                |
| **Custom Domain**        | Yes                | Yes                  | Yes                |
| **SSL**                  | Automatic          | Automatic            | Manual/Caddy       |
| **Best For**             | Production         | Quick deploys        | Local/Testing      |

---

## Additional Documentation

- [CLOUDFLARE_DEVELOPER_GUIDE.md](CLOUDFLARE_DEVELOPER_GUIDE.md) - Cloudflare Workers/Functions development
- [docs/API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md) - API key configuration
- [docs/DOCKER_QUICKSTART.md](docs/DOCKER_QUICKSTART.md) - Docker deployment
- [ai_portfolio_deployment_guide_comprehensive.md](ai_portfolio_deployment_guide_comprehensive.md) - Complete Cloudflare Workers SDK guide

---

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys obtained and tested
- [ ] Build succeeds locally (`npm run build`)
- [ ] Wrangler authenticated (`wrangler whoami`)
- [ ] Secrets not committed to git

---

**Recommended Platform: Cloudflare Pages**

For edge performance, global CDN, and zero cold starts.
