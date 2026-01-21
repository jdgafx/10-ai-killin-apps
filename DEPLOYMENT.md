# Deployment Guide

This repository includes complete deployment infrastructure for all platforms.

## 🚀 Deployment Options

### 1. Docker (Local/Production)
**Best for**: Local testing, production servers, VPS hosting

```bash
# Quick start
cp .env.example .env
./scripts/docker-deploy.sh
```

📖 **Full Guide**: [docs/DOCKER_QUICKSTART.md](docs/DOCKER_QUICKSTART.md)

---

### 2. Coolify (Recommended for Production)
**Best for**: Self-hosted production, automatic deployments, SSL management

Coolify provides Heroku/Vercel-like experience with full control.

📖 **Full Guide**: [docs/COOLIFY_DEPLOYMENT.md](docs/COOLIFY_DEPLOYMENT.md)

**Features**:
- ✅ Automatic SSL certificates (Let's Encrypt)
- ✅ One-click deployments
- ✅ Built-in monitoring
- ✅ Auto-scaling ready
- ✅ Zero-downtime updates

---

### 3. GitHub Pages
**Best for**: Free static hosting, portfolio showcase

```bash
# Automatic deployment on push to main
git push origin main
```

📖 **Configuration**: `.github/workflows/deploy.yml`

---

### 4. Vercel
**Best for**: Fastest deployment, edge functions, preview deployments

```bash
npm install -g vercel
vercel --prod
```

📖 **Full Guide**: [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

---

## 📊 Platform Comparison

| Feature | Docker | Coolify | GitHub Pages | Vercel |
|---------|--------|---------|--------------|--------|
| **Cost** | Free | Free (self-hosted) | Free | Free tier |
| **SSL** | Manual | Automatic | Automatic | Automatic |
| **Deployment Time** | 5 min | 3 min | 2 min | 1 min |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |
| **Environment Variables** | ✅ | ✅ | ❌ | ✅ |
| **Auto-scaling** | Manual | ✅ | N/A | ✅ |
| **Build Control** | Full | Full | Limited | Limited |
| **Best For** | Production | Production | Static sites | Edge deployments |

---

## 🎯 Recommended Setup

### Development
```bash
# Local Docker deployment
./scripts/docker-deploy.sh
```

### Staging
```bash
# Coolify staging environment
# Automatic deployment from 'staging' branch
```

### Production
```bash
# Coolify production environment
# Automatic deployment from 'main' branch
```

---

## 🔑 Environment Variables

All deployments require API keys:

```env
VITE_MINIMAX_API_KEY=your_key_here
VITE_DEEPSEEK_API_KEY=your_key_here
VITE_GEMINI_CLIENT_ID=your_client_id_here
```

**Setup**:
1. Copy `.env.example` to `.env`
2. Add your API keys
3. For Coolify: Add in dashboard
4. For Vercel: Use `vercel env add`
5. For GitHub Pages: Add in repo secrets

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys obtained and tested
- [ ] Domain DNS configured (if applicable)
- [ ] SSL certificate ready (for custom domains)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests passing (`npm run test`)
- [ ] Documentation updated
- [ ] Secrets not committed to git

---

## 🆘 Quick Troubleshooting

### Build Fails
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Environment Variables Not Loading
```bash
# Docker: Check .env file exists
ls -la .env

# Coolify: Verify in dashboard
# Vercel: Check with `vercel env ls`
```

### Port Already in Use
```bash
# Find process using port
lsof -i:8001

# Kill specific process (use actual PID)
kill -9 <PID>
```

---

## 📚 Detailed Documentation

- **[Infrastructure Summary](docs/INFRASTRUCTURE_SUMMARY.md)** - Overview of all deployment infrastructure
- **[Docker Quick Start](docs/DOCKER_QUICKSTART.md)** - Docker deployment guide
- **[Coolify Guide](docs/COOLIFY_DEPLOYMENT.md)** - Complete Coolify setup
- **[Vercel Guide](docs/VERCEL_DEPLOYMENT.md)** - Vercel deployment guide

---

## 🎉 Success!

After successful deployment, your applications will be available at:

**Local Docker**:
- http://localhost:8001 through http://localhost:8010

**Coolify/Production**:
- https://app-01.yourdomain.com
- https://app-02.yourdomain.com
- etc.

**GitHub Pages**:
- https://username.github.io/app-01-ai-code-reviewer
- etc.

**Vercel**:
- https://app-01-ai-code-reviewer.vercel.app
- etc.

---

Built with ❤️ by Coolify-01 & Coolify-02 Agents
