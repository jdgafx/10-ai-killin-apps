# Master Deployment Guide

> **Complete step-by-step guide for deploying all 10 AI applications to GitHub Pages, Vercel, and Coolify/Docker.**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Vercel Deployment](#vercel-deployment)
5. [Coolify/Docker Deployment](#coolifydocker-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Post-Deployment Verification](#post-deployment-verification)

---

## Prerequisites

### Required Software

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** >= 2.30.0
- **Docker** >= 20.10.0 (for Docker deployment)
- **Docker Compose** >= 2.0.0 (for Docker deployment)

### Required Accounts

- **GitHub Account** - For GitHub Pages and repository
- **Vercel Account** - For Vercel deployment (free tier available)
- **Coolify Account** - For self-hosted deployment (optional)

### API Keys Required

Before deploying, obtain API keys from:

1. **MiniMax** - https://api.minimax.chat
2. **DeepSeek** - https://platform.deepseek.com
3. **Google Gemini** (optional) - https://console.cloud.google.com

See [API_KEYS_SETUP.md](API_KEYS_SETUP.md) for detailed setup instructions.

---

## Pre-Deployment Checklist

Before deploying any application, ensure:

### 1. **Code Quality**

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### 2. **Build Verification**

```bash
# Build all apps to verify no build errors
npm run build

# Or build specific app
npm run build:app-01
```

### 3. **Environment Variables**

Ensure all required environment variables are set:

```bash
# Check .env.example for required variables
cat .env.example

# Verify your .env.local has all required keys
cat .env.local
```

### 4. **Git Repository**

```bash
# Ensure all changes are committed
git status

# Commit any pending changes
git add .
git commit -m "feat: Prepare for deployment"

# Push to remote
git push origin main
```

---

## GitHub Pages Deployment

GitHub Pages provides free static site hosting for all your apps.

### Method 1: Automatic Deployment (Recommended)

**Using GitHub Actions workflow:**

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

#### Step 2: Configure GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

```
VITE_MINIMAX_API_KEY=sk-cp-xxxxxxxxxx
VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxx
VITE_GEMINI_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com
```

#### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy-gh-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build all apps
        env:
          VITE_MINIMAX_API_KEY: ${{ secrets.VITE_MINIMAX_API_KEY }}
          VITE_DEEPSEEK_API_KEY: ${{ secrets.VITE_DEEPSEEK_API_KEY }}
          VITE_GEMINI_CLIENT_ID: ${{ secrets.VITE_GEMINI_CLIENT_ID }}
        run: npm run build

      - name: Create deployment directory
        run: |
          mkdir -p deploy
          cp -r apps/app-01-ai-code-reviewer/dist deploy/code-reviewer
          cp -r apps/app-02-document-chat/dist deploy/document-chat
          cp -r apps/app-03-image-generator/dist deploy/image-generator
          cp -r apps/app-04-voice-assistant/dist deploy/voice-assistant
          cp -r apps/app-05-code-explainer/dist deploy/code-explainer
          cp -r apps/app-06-test-generator/dist deploy/test-generator
          cp -r apps/app-07-api-integrator/dist deploy/api-integrator
          cp -r apps/app-08-data-visualizer/dist deploy/data-visualizer
          cp -r apps/app-09-autonomous-agent/dist deploy/autonomous-agent
          cp -r apps/app-10-rag-knowledge-base/dist deploy/rag-knowledge-base

      - name: Create index page
        run: |
          cat > deploy/index.html << 'EOF'
          <!DOCTYPE html>
          <html>
          <head>
            <title>AI Portfolio - 10 Applications</title>
            <style>
              body { font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 2rem; }
              h1 { color: #2563eb; }
              .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
              .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; }
              .card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              a { color: #2563eb; text-decoration: none; font-weight: 600; }
            </style>
          </head>
          <body>
            <h1>🚀 AI Portfolio - 10 Applications</h1>
            <div class="grid">
              <div class="card"><h3>🔍 AI Code Reviewer</h3><a href="/code-reviewer/">Launch App →</a></div>
              <div class="card"><h3>📄 Document Chat</h3><a href="/document-chat/">Launch App →</a></div>
              <div class="card"><h3>🎨 Image Generator</h3><a href="/image-generator/">Launch App →</a></div>
              <div class="card"><h3>🎙️ Voice Assistant</h3><a href="/voice-assistant/">Launch App →</a></div>
              <div class="card"><h3>💡 Code Explainer</h3><a href="/code-explainer/">Launch App →</a></div>
              <div class="card"><h3>🧪 Test Generator</h3><a href="/test-generator/">Launch App →</a></div>
              <div class="card"><h3>🔌 API Integrator</h3><a href="/api-integrator/">Launch App →</a></div>
              <div class="card"><h3>📊 Data Visualizer</h3><a href="/data-visualizer/">Launch App →</a></div>
              <div class="card"><h3>🤖 Autonomous Agent</h3><a href="/autonomous-agent/">Launch App →</a></div>
              <div class="card"><h3>📚 RAG Knowledge Base</h3><a href="/rag-knowledge-base/">Launch App →</a></div>
            </div>
          </body>
          </html>
          EOF

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './deploy'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Step 4: Push and Deploy

```bash
git add .github/workflows/deploy-gh-pages.yml
git commit -m "ci: Add GitHub Pages deployment workflow"
git push origin main
```

The workflow will automatically build and deploy your apps. Check the **Actions** tab for progress.

#### Step 5: Access Your Apps

Your apps will be available at:
```
https://YOUR_USERNAME.github.io/10-ai-killin-apps/
https://YOUR_USERNAME.github.io/10-ai-killin-apps/code-reviewer/
https://YOUR_USERNAME.github.io/10-ai-killin-apps/document-chat/
... etc
```

### Method 2: Manual Deployment

```bash
# Build all apps
npm run build

# Install gh-pages utility
npm install -g gh-pages

# Deploy to gh-pages branch
gh-pages -d dist -b gh-pages
```

---

## Vercel Deployment

Vercel provides instant deployment with automatic HTTPS and CDN.

### Method 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy Each App

```bash
# Navigate to app directory
cd apps/app-01-ai-code-reviewer

# Deploy to Vercel
vercel

# Follow prompts:
# - Set project name
# - Choose root directory: ./
# - Override settings? No
```

#### Step 4: Set Environment Variables

```bash
# Set environment variables for production
vercel env add VITE_MINIMAX_API_KEY production
vercel env add VITE_DEEPSEEK_API_KEY production
vercel env add VITE_GEMINI_CLIENT_ID production

# Or set via Vercel Dashboard
```

#### Step 5: Deploy to Production

```bash
vercel --prod
```

#### Step 6: Repeat for All Apps

```bash
# Script to deploy all apps
for app in apps/app-*/; do
  cd "$app"
  vercel --prod
  cd ../..
done
```

### Method 2: Vercel Git Integration (Automatic)

#### Step 1: Connect Repository

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository

#### Step 2: Configure Build Settings

For each app, create a `vercel.json` in the app directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_MINIMAX_API_KEY": "@vite_minimax_api_key",
    "VITE_DEEPSEEK_API_KEY": "@vite_deepseek_api_key",
    "VITE_GEMINI_CLIENT_ID": "@vite_gemini_client_id"
  }
}
```

#### Step 3: Set Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add variables for **Production**, **Preview**, and **Development**
3. Save settings

#### Step 4: Deploy

Push to main branch:

```bash
git push origin main
```

Vercel will automatically build and deploy your apps.

### Custom Domains (Optional)

```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS
# Add CNAME record: your-domain.com → cname.vercel-dns.com
```

---

## Coolify/Docker Deployment

Coolify provides self-hosted deployment with Docker.

### Prerequisites

- Docker and Docker Compose installed
- Coolify instance set up (https://coolify.io)
- Server with at least 2GB RAM

### Method 1: Docker Compose Deployment

#### Step 1: Configure Environment Variables

Create `.env` file in project root:

```bash
# Copy from template
cp .env.example .env

# Edit with your API keys
nano .env
```

#### Step 2: Build Docker Images

```bash
# Build all images
docker-compose build

# Or build specific app
docker-compose build app-01-ai-code-reviewer
```

#### Step 3: Start Services

```bash
# Start all services
docker-compose up -d

# Or start specific service
docker-compose up -d app-01-ai-code-reviewer
```

#### Step 4: Verify Deployment

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f app-01-ai-code-reviewer

# Test endpoints
curl http://localhost:8001
curl http://localhost:8002
# ... etc
```

### Method 2: Coolify Dashboard Deployment

#### Step 1: Connect GitHub Repository

1. Log in to Coolify dashboard
2. Click **New Resource** → **Application**
3. Select **GitHub Repository**
4. Choose your repository

#### Step 2: Configure Application

For each app:

1. **Name:** `ai-code-reviewer` (or app name)
2. **Port:** `8080`
3. **Build Pack:** `nixpacks` or `docker`
4. **Base Directory:** `apps/app-01-ai-code-reviewer`
5. **Build Command:** `npm install && npm run build`
6. **Start Command:** `npm run preview`

#### Step 3: Set Environment Variables

In Coolify dashboard:

1. Navigate to **Environment Variables**
2. Add variables:
   ```
   VITE_MINIMAX_API_KEY=sk-cp-xxx
   VITE_DEEPSEEK_API_KEY=sk-xxx
   VITE_GEMINI_CLIENT_ID=xxx.apps.googleusercontent.com
   ```
3. Save and deploy

#### Step 4: Configure Domain (Optional)

1. Go to **Domains** section
2. Add your domain: `code-reviewer.yourdomain.com`
3. Coolify will automatically configure HTTPS with Let's Encrypt

#### Step 5: Deploy

Click **Deploy** button. Coolify will:
1. Clone repository
2. Build Docker image
3. Start container
4. Configure reverse proxy
5. Enable HTTPS

### Docker Configuration Files

**Dockerfile (for each app):**

Create `Dockerfile` in each app directory:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../packages ./packages

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### Scaling with Docker Swarm (Optional)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml ai-portfolio

# Scale services
docker service scale ai-portfolio_app-01=3
```

---

## Environment Configuration

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_MINIMAX_API_KEY` | Yes | MiniMax API key | `sk-cp-xxxxxxxx` |
| `VITE_DEEPSEEK_API_KEY` | Yes | DeepSeek API key | `sk-xxxxxxxx` |
| `VITE_GEMINI_CLIENT_ID` | No | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `VITE_ENABLE_RAG` | No | Enable RAG features | `true` |
| `VITE_ENABLE_VOICE` | No | Enable voice features | `true` |
| `VITE_DEFAULT_PROVIDER` | No | Default AI provider | `minimax` |
| `NODE_ENV` | No | Node environment | `production` |

### Platform-Specific Configuration

#### GitHub Pages

Set in **Settings** → **Secrets and variables** → **Actions**

#### Vercel

Set in **Project Settings** → **Environment Variables**

Options:
- **Production** - Used for production deployments
- **Preview** - Used for preview deployments
- **Development** - Used for local development

#### Coolify

Set in **Application** → **Environment Variables**

Environment variables are encrypted and securely stored.

### Base URL Configuration

For GitHub Pages deployments, update Vite config:

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/10-ai-killin-apps/code-reviewer/' 
    : '/',
  // ... other config
});
```

---

## Troubleshooting

### Common Issues

#### 1. **Build Failures**

**Error:** `Module not found` or `Cannot find module`

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force

# Rebuild
npm run build
```

#### 2. **Environment Variables Not Working**

**Error:** `import.meta.env.VITE_* is undefined`

**Solution:**
- Ensure variables are prefixed with `VITE_`
- Rebuild after adding environment variables
- Check GitHub Secrets are correctly named
- Verify Vercel environment variables are set for the correct environment

#### 3. **GitHub Pages 404 Errors**

**Error:** 404 on page navigation

**Solution:**
- Add 404.html that redirects to index.html
- Ensure base URL is configured correctly
- Check GitHub Pages is enabled for the correct branch

#### 4. **Docker Build Failures**

**Error:** `Docker build failed` or `Image build error`

**Solution:**
```bash
# Check Docker daemon
docker info

# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker-compose logs app-01-ai-code-reviewer
```

#### 5. **Port Already in Use (Docker)**

**Error:** `Bind for 0.0.0.0:8001 failed: port is already allocated`

**Solution:**
```bash
# Find process using port
lsof -i :8001

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

#### 6. **CORS Errors**

**Error:** `Access-Control-Allow-Origin` error

**Solution:**
- Ensure API endpoints allow your domain
- Configure CORS in nginx.conf
- Check Vercel `vercel.json` headers configuration

### Debugging Commands

```bash
# Check build output
npm run build -- --debug

# Analyze bundle size
npm run build -- --analyze

# Test production build locally
npm run preview

# Docker debugging
docker-compose logs -f
docker exec -it <container_id> sh

# Vercel debugging
vercel logs
vercel inspect
```

---

## Post-Deployment Verification

### Verification Checklist

After deploying, verify each app:

#### 1. **Accessibility**

```bash
# Test endpoints
curl https://your-deployment-url.com

# Check health endpoint (if configured)
curl https://your-deployment-url.com/health
```

#### 2. **Functionality**

- [ ] App loads without errors
- [ ] UI renders correctly
- [ ] AI features work (chat, generation, etc.)
- [ ] File uploads work (for Document Chat, etc.)
- [ ] Voice features work (for Voice Assistant)
- [ ] Navigation works correctly

#### 3. **Performance**

Use Lighthouse or WebPageTest:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-deployment-url.com --output html --output-path ./report.html
```

Target scores:
- **Performance:** > 90
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 90

#### 4. **Security**

- [ ] HTTPS enabled
- [ ] API keys not exposed in client bundle (check Network tab)
- [ ] CSP headers configured
- [ ] No security warnings in console

#### 5. **Monitoring**

Set up monitoring for:
- Uptime (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)

---

## Continuous Deployment

### Automatic Deployments

All platforms support automatic deployments on push:

**GitHub Pages:**
- Automatic on push to `main` branch via GitHub Actions

**Vercel:**
- Automatic on push to any branch
- Production deployment on push to `main`
- Preview deployments on pull requests

**Coolify:**
- Automatic on push to configured branch
- Webhook integration with GitHub

### Deployment Monitoring

```bash
# GitHub Actions
# Check workflow status: https://github.com/USER/REPO/actions

# Vercel
vercel logs --follow

# Docker
docker-compose logs -f
```

---

## Rollback Procedures

### GitHub Pages Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or redeploy from specific commit
git checkout <commit-hash>
git push origin main --force
```

### Vercel Rollback

```bash
# Via CLI
vercel rollback

# Or via dashboard
# Deployments → Select previous deployment → Promote to Production
```

### Docker Rollback

```bash
# Stop current containers
docker-compose down

# Checkout previous version
git checkout <previous-tag>

# Rebuild and restart
docker-compose up -d --build
```

---

## Conclusion

You now have comprehensive deployment guides for all three platforms:

✅ **GitHub Pages** - Free, automatic, git-based deployment  
✅ **Vercel** - Fast, optimized, with preview deployments  
✅ **Coolify** - Self-hosted, full control, Docker-based  

Choose the platform that best fits your needs, or deploy to all three for maximum availability and showcase value.

For additional help:
- Check platform-specific documentation
- Review troubleshooting section
- Open an issue on GitHub
- Consult community forums

Happy deploying! 🚀
