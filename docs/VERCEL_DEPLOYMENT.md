# Vercel Deployment Guide

Complete guide for deploying all 10 AI applications to Vercel with automated configuration, environment management, and troubleshooting.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [1. Vercel CLI Installation](#1-vercel-cli-installation)
  - [2. Authentication](#2-authentication)
  - [3. Project Configuration](#3-project-configuration)
  - [4. Environment Variables](#4-environment-variables)
  - [5. Deployment](#5-deployment)
- [Individual Project Deployment](#individual-project-deployment)
- [Configuration Details](#configuration-details)
- [Environment Variables Reference](#environment-variables-reference)
- [Hot Reload & Preview Deployments](#hot-reload--preview-deployments)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)

---

## Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ **Node.js** >= 18.0.0
- ✅ **npm** >= 9.0.0
- ✅ **Git** installed and configured
- ✅ **Vercel Account** (free tier works)
- ✅ **API Keys** for AI providers:
  - MiniMax API Key
  - DeepSeek API Key
  - GitHub Copilot Token (optional)
  - Google Gemini Client ID (optional)

---

## Quick Start

Deploy all 10 projects with one command:

```bash
# Navigate to repository root
cd /home/chris/dev/10-ai-killin-apps/

# Make script executable
chmod +x scripts/setup-vercel.sh

# Run automated setup (config + link + secrets + deploy)
./scripts/setup-vercel.sh all
```

**That's it!** The script will:
1. Generate `vercel.json` for each project
2. Link projects to your Vercel account
3. Set up environment variables
4. Deploy all 10 projects to production

---

## Detailed Setup

### 1. Vercel CLI Installation

Install the Vercel CLI globally:

```bash
npm install -g vercel
```

Verify installation:

```bash
vercel --version
# Should output: Vercel CLI 33.0.0 (or newer)
```

### 2. Authentication

Authenticate with Vercel using one of these methods:

#### Method A: Interactive Login (Recommended for local development)

```bash
vercel login
```

Follow the browser prompts to authenticate.

#### Method B: Token Authentication (Recommended for CI/CD)

```bash
# Set token as environment variable
export VERCEL_TOKEN=fTMEClc5ZZ8z7ov1iE26R8JT

# Verify authentication
vercel whoami
```

**For CI/CD:** Add `VERCEL_TOKEN` to your GitHub Secrets or environment variables.

### 3. Project Configuration

#### Automated Configuration (Recommended)

Generate `vercel.json` for all projects:

```bash
./scripts/setup-vercel.sh config
```

This creates a `vercel.json` in each app directory based on the template.

#### Manual Configuration

For individual projects:

```bash
cd apps/app-01-ai-code-reviewer
cp ../../config/vercel/vercel-template.json ./vercel.json
```

### 4. Environment Variables

#### Required Environment Variables

All projects require these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_MINIMAX_API_KEY` | MiniMax API key | `sk-cp-...` |
| `VITE_DEEPSEEK_API_KEY` | DeepSeek API key | `sk-...` |
| `VITE_GITHUB_COPILOT_TOKEN` | GitHub Copilot token | `ghp_...` |
| `VITE_GEMINI_CLIENT_ID` | Google OAuth client ID | `....apps.googleusercontent.com` |

#### Setting Variables - Automated

```bash
# Export variables first
export VITE_MINIMAX_API_KEY="your_minimax_key"
export VITE_DEEPSEEK_API_KEY="your_deepseek_key"
export VITE_GITHUB_COPILOT_TOKEN="your_copilot_token"
export VITE_GEMINI_CLIENT_ID="your_gemini_client_id"

# Run secrets setup
./scripts/setup-vercel.sh secrets
```

#### Setting Variables - Manual

For each project:

```bash
cd apps/app-01-ai-code-reviewer

# Add environment variables
vercel env add VITE_MINIMAX_API_KEY production
# Paste your key when prompted

vercel env add VITE_DEEPSEEK_API_KEY production
vercel env add VITE_GITHUB_COPILOT_TOKEN production
vercel env add VITE_GEMINI_CLIENT_ID production
```

#### Setting Variables - Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable for **Production**, **Preview**, and **Development**

### 5. Deployment

#### Deploy All Projects

```bash
# Production deployment
./scripts/setup-vercel.sh deploy

# Preview deployment
./scripts/setup-vercel.sh preview
```

#### Deploy Individual Project

```bash
cd apps/app-01-ai-code-reviewer

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

---

## Individual Project Deployment

Detailed commands for each of the 10 projects:

### 1. AI Code Reviewer

```bash
cd apps/app-01-ai-code-reviewer
vercel --prod
# URL: https://ai-code-reviewer.vercel.app
```

### 2. Document Chat

```bash
cd apps/app-02-document-chat
vercel --prod
# URL: https://document-chat.vercel.app
```

### 3. Image Generator

```bash
cd apps/app-03-image-generator
vercel --prod
# URL: https://image-generator.vercel.app
```

### 4. Voice Assistant

```bash
cd apps/app-04-voice-assistant
vercel --prod
# URL: https://voice-assistant.vercel.app
```

### 5. Code Explainer

```bash
cd apps/app-05-code-explainer
vercel --prod
# URL: https://code-explainer.vercel.app
```

### 6. Test Generator

```bash
cd apps/app-06-test-generator
vercel --prod
# URL: https://test-generator.vercel.app
```

### 7. API Integrator

```bash
cd apps/app-07-api-integrator
vercel --prod
# URL: https://api-integrator.vercel.app
```

### 8. Data Visualizer

```bash
cd apps/app-08-data-visualizer
vercel --prod
# URL: https://data-visualizer.vercel.app
```

### 9. Autonomous Agent

```bash
cd apps/app-09-autonomous-agent
vercel --prod
# URL: https://autonomous-agent.vercel.app
```

### 10. RAG Knowledge Base

```bash
cd apps/app-10-rag-knowledge-base
vercel --prod
# URL: https://rag-knowledge-base.vercel.app
```

---

## Configuration Details

### vercel.json Structure

Each project's `vercel.json` includes:

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Key Configuration Features

1. **Framework Detection**: Automatically uses Vite preset
2. **Build Optimization**: Configured for optimal build performance
3. **SPA Routing**: All routes redirect to `index.html`
4. **Asset Caching**: Static assets cached for 1 year
5. **Security Headers**: CSP, CORS, XSS protection enabled
6. **Environment Variables**: Injected at build time via `VITE_*` prefix

### Routes Configuration

```json
"routes": [
  {
    "src": "/assets/(.*)",
    "headers": {
      "cache-control": "public, max-age=31536000, immutable"
    }
  },
  {
    "handle": "filesystem"
  },
  {
    "src": "/(.*)",
    "dest": "/index.html"
  }
]
```

This ensures:
- Assets are cached for 1 year
- All routes fallback to `index.html` (SPA support)
- Static files served directly

---

## Environment Variables Reference

### AI Provider Configuration

```bash
# MiniMax (Primary)
VITE_MINIMAX_API_KEY=sk-cp-...
VITE_MINIMAX_BASE_URL=https://api.minimax.chat/v1

# DeepSeek (Fallback)
VITE_DEEPSEEK_API_KEY=sk-...
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com

# Google Gemini (Optional)
VITE_GEMINI_CLIENT_ID=....apps.googleusercontent.com

# GitHub Copilot (Optional)
VITE_GITHUB_COPILOT_TOKEN=ghp_...
```

### Feature Flags

```bash
# Enable/disable features
VITE_ENABLE_RAG=true
VITE_ENABLE_VOICE=true
VITE_DEFAULT_PROVIDER=minimax
```

### Build Configuration

```bash
# Node.js version
NODE_VERSION=18

# Build environment
NODE_ENV=production
```

---

## Hot Reload & Preview Deployments

### Preview Deployments

Vercel automatically creates preview deployments for:
- Every `git push` to non-main branches
- Every pull request

**Accessing Previews:**

```bash
# Deploy to preview
vercel

# Output example:
# ✓ Production: https://ai-code-reviewer.vercel.app
# ✓ Preview: https://ai-code-reviewer-git-feature-branch.vercel.app
```

### Hot Reload in Development

For local hot reload:

```bash
cd apps/app-01-ai-code-reviewer
vercel dev
```

This starts:
- Local development server on `http://localhost:3000`
- Hot module replacement (HMR) enabled
- Environment variables from Vercel
- Serverless functions simulation

**Benefits:**
- Test with production environment variables
- Simulate Vercel's production environment locally
- Fast refresh on code changes

### Preview Deployment Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Commit and push
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature

# 4. Vercel automatically deploys preview
# Check deployment status:
vercel inspect <deployment-url>
```

### Automatic GitHub Integration

Enable GitHub integration for:
- Automatic preview deployments on PR
- Deployment status checks
- Comment with preview URL on PR

**Setup:**

1. Go to https://vercel.com/dashboard
2. Select project → **Settings** → **Git**
3. Connect GitHub repository
4. Enable:
   - ✅ Automatic deployments
   - ✅ Preview deployments
   - ✅ Production deployments on main branch

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures

**Error:** `Build failed with exit code 1`

**Solution:**

```bash
# Test build locally first
cd apps/app-01-ai-code-reviewer
npm run build

# Check build logs
vercel logs <deployment-url>

# Common fixes:
# - Clear cache: vercel --force
# - Check Node version: ensure >= 18
# - Verify dependencies: npm install
```

#### 2. Environment Variables Not Loading

**Error:** `API key is undefined`

**Solution:**

```bash
# Verify variables are set
vercel env ls

# Pull environment variables locally
vercel env pull .env.local

# Re-add missing variables
vercel env add VITE_MINIMAX_API_KEY production
```

#### 3. 404 on Routes

**Error:** Routes other than `/` return 404

**Solution:**

Ensure `vercel.json` includes SPA rewrites:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

#### 4. CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**

Add CORS headers in `vercel.json`:

```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      {
        "key": "Access-Control-Allow-Origin",
        "value": "*"
      }
    ]
  }
]
```

#### 5. Deployment Timeout

**Error:** `Build exceeded maximum duration`

**Solution:**

```bash
# Optimize build:
# 1. Reduce bundle size
# 2. Use production build
# 3. Disable source maps

# In vite.config.js:
build: {
  sourcemap: false,
  minify: 'terser',
  reportCompressedSize: false
}
```

#### 6. Out of Memory

**Error:** `JavaScript heap out of memory`

**Solution:**

```bash
# Increase Node memory (locally)
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# For Vercel, optimize build:
# - Reduce dependencies
# - Use dynamic imports
# - Split vendor chunks
```

#### 7. API Rate Limiting

**Error:** `429 Too Many Requests`

**Solution:**

```javascript
// Add retry logic with exponential backoff
const fetchWithRetry = async (url, options, retries = 3) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000 * (4 - retries)));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};
```

### Debugging Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# Inspect deployment
vercel inspect <deployment-url>

# List all deployments
vercel ls

# Remove deployment
vercel remove <deployment-url>

# Check build output
vercel build --debug

# Test locally with production env
vercel dev
```

### Getting Help

If issues persist:

1. **Check Vercel Status:** https://www.vercel-status.com/
2. **Vercel Documentation:** https://vercel.com/docs
3. **Community Support:** https://github.com/vercel/vercel/discussions
4. **Contact Support:** https://vercel.com/support

---

## Advanced Topics

### Custom Domains

Add custom domains to your deployments:

```bash
# Add domain
vercel domains add example.com

# Assign to project
vercel domains assign example.com ai-code-reviewer
```

**DNS Configuration:**

For `example.com`:
```
Type: A
Name: @
Value: 76.76.21.21
```

For `www.example.com`:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Monorepo Deployment

Deploy from monorepo root:

```bash
# Set root directory for each project
vercel --prod --cwd apps/app-01-ai-code-reviewer

# Or configure in vercel.json:
{
  "buildCommand": "cd ../.. && npm run build:app-01",
  "outputDirectory": "apps/app-01-ai-code-reviewer/dist"
}
```

### Serverless Functions

Add serverless functions to any project:

```bash
mkdir -p apps/app-01-ai-code-reviewer/api

# Create function
cat > apps/app-01-ai-code-reviewer/api/hello.js << EOF
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
EOF
```

Access at: `https://your-app.vercel.app/api/hello`

### Edge Functions

Use Edge Functions for ultra-low latency:

```javascript
// api/edge-hello.js
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  return new Response(JSON.stringify({ message: 'Hello from Edge!' }), {
    headers: { 'content-type': 'application/json' },
  });
}
```

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/app-01-ai-code-reviewer
```

### Performance Optimization

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "images": {
    "domains": ["example.com"],
    "formats": ["image/avif", "image/webp"]
  }
}
```

### Analytics Integration

Enable Vercel Analytics:

```bash
npm install @vercel/analytics

# Add to main.jsx or index.jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Security Best Practices

1. **Rotate Secrets Regularly**
   ```bash
   # Remove old secret
   vercel env rm VITE_MINIMAX_API_KEY production
   
   # Add new secret
   vercel env add VITE_MINIMAX_API_KEY production
   ```

2. **Use Environment-Specific Secrets**
   ```bash
   # Set different values for preview vs production
   vercel env add VITE_API_URL preview
   # Value: https://api-staging.example.com
   
   vercel env add VITE_API_URL production
   # Value: https://api.example.com
   ```

3. **Enable Password Protection**
   ```json
   {
     "public": false
   }
   ```

4. **Set Security Headers**
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "X-XSS-Protection", "value": "1; mode=block" }
         ]
       }
     ]
   }
   ```

---

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] All tests passing (`npm run test`)
- [ ] `vercel.json` configured correctly
- [ ] Security headers enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled (optional)
- [ ] Performance optimized (bundle size, caching)
- [ ] GitHub integration enabled
- [ ] Preview deployments working
- [ ] Documentation updated

---

## Quick Reference

### Common Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel dev` | Start local dev server with Vercel env |
| `vercel logs <url>` | View deployment logs |
| `vercel inspect <url>` | Inspect deployment details |
| `vercel env ls` | List environment variables |
| `vercel env add <KEY>` | Add environment variable |
| `vercel env pull` | Pull env vars to `.env.local` |
| `vercel link` | Link local project to Vercel |
| `vercel domains` | Manage domains |
| `vercel whoami` | Check authentication status |

### URLs After Deployment

| Project | Production URL |
|---------|---------------|
| AI Code Reviewer | `https://ai-code-reviewer.vercel.app` |
| Document Chat | `https://document-chat.vercel.app` |
| Image Generator | `https://image-generator.vercel.app` |
| Voice Assistant | `https://voice-assistant.vercel.app` |
| Code Explainer | `https://code-explainer.vercel.app` |
| Test Generator | `https://test-generator.vercel.app` |
| API Integrator | `https://api-integrator.vercel.app` |
| Data Visualizer | `https://data-visualizer.vercel.app` |
| Autonomous Agent | `https://autonomous-agent.vercel.app` |
| RAG Knowledge Base | `https://rag-knowledge-base.vercel.app` |

---

## Support & Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Vite Documentation:** https://vitejs.dev/
- **GitHub Repository:** https://github.com/YOUR_USERNAME/10-ai-killin-apps
- **Issue Tracker:** https://github.com/YOUR_USERNAME/10-ai-killin-apps/issues

---

**Last Updated:** January 2024

**Version:** 1.0.0

**Maintained by:** Vercel-01 & Vercel-02 Agents 🤖
