# Docker Deployment Quick Start

> **NOTE**: Cloudflare Pages is now the primary deployment platform.
> See [DEPLOYMENT.md](../DEPLOYMENT.md) for current deployment instructions.
>
> This guide remains available for local development and self-hosted deployments.

---

## Quick Deploy (5 minutes)

### 1. Prerequisites Check

```bash
# Verify Docker is installed
docker --version
docker-compose --version

# Verify you're in the project root
pwd  # Should show: /path/to/10-ai-killin-apps
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your API keys
nano .env
# OR
vim .env
```

### 3. Deploy All Applications

```bash
# One-command deployment
./scripts/docker-deploy.sh
```

**That's it!** All 10 apps will be available at:

- http://localhost:8001 - AI Code Reviewer
- http://localhost:8002 - Document Chat
- http://localhost:8003 - Image Generator
- http://localhost:8004 - Voice Assistant
- http://localhost:8005 - Code Explainer
- http://localhost:8006 - Test Generator
- http://localhost:8007 - API Integrator
- http://localhost:8008 - Data Visualizer
- http://localhost:8009 - Autonomous Agent
- http://localhost:8010 - RAG Knowledge Base

---

## 📋 Alternative Deployment Methods

### Deploy Single Application

```bash
./scripts/docker-deploy.sh --single app-01-ai-code-reviewer
```

### Build Without Deploying

```bash
./scripts/docker-deploy.sh --build-only
```

### Deploy Without Building (if images exist)

```bash
./scripts/docker-deploy.sh --deploy-only
```

### Push to Docker Registry

```bash
# Set registry URL in .env or pass as argument
./scripts/docker-deploy.sh --push --registry registry.example.com
```

---

## 🛠️ Common Commands

### View Running Containers

```bash
docker-compose ps
```

### View Logs

```bash
# All applications
docker-compose logs -f

# Specific application
docker-compose logs -f app-01-ai-code-reviewer

# Last 100 lines
docker-compose logs --tail=100 app-02-document-chat
```

### Restart Application

```bash
# Restart all
docker-compose restart

# Restart specific app
docker-compose restart app-01-ai-code-reviewer
```

### Stop All Applications

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### Rebuild Application

```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific app
docker-compose build --no-cache app-01-ai-code-reviewer
```

---

## 🔍 Health Checks

### Manual Health Check

```bash
# Check all apps (8001-8010)
for port in {8001..8010}; do
  echo "Checking port $port..."
  curl -f http://localhost:$port/health && echo "✓ OK" || echo "✗ FAILED"
done
```

### Container Status

```bash
docker-compose ps
```

### Resource Usage

```bash
docker stats
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -ti:8001

# Kill process
lsof -ti:8001 | xargs kill -9
```

### Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### Container Won't Start

```bash
# Check logs
docker-compose logs app-01-ai-code-reviewer

# Check environment variables
docker-compose config
```

### Out of Memory

```bash
# Check Docker memory limits
docker system info | grep -i memory

# Increase limits in docker-compose.yml:
# deploy:
#   resources:
#     limits:
#       memory: 1G
```

---

## 📦 Directory Structure

```
10-ai-killin-apps/
├── config/
│   ├── docker/
│   │   └── Dockerfile.template    # Multi-stage Dockerfile
│   └── nginx/
│       ├── nginx.conf            # Main Nginx config
│       └── default.conf          # Site config
├── scripts/
│   └── docker-deploy.sh          # Deployment script
├── apps/
│   ├── app-01-ai-code-reviewer/
│   ├── app-02-document-chat/
│   └── ...
├── docker-compose.yml            # Orchestration file
├── .env                          # Environment variables (create this)
└── .env.example                  # Template
```

---

## 🔐 Security Checklist

- [ ] .env file created and not committed to git
- [ ] API keys added to .env
- [ ] .env permissions set to 600 (`chmod 600 .env`)
- [ ] Firewall configured (only expose necessary ports)
- [ ] SSL/TLS certificates configured (for production)
- [ ] Regular security updates enabled
- [ ] Non-root user configured in containers ✓ (already done)
- [ ] Security headers enabled ✓ (already configured)

---

## 🎯 Production Deployment

For production deployment with Coolify, see:

- **[docs/COOLIFY_DEPLOYMENT.md](docs/COOLIFY_DEPLOYMENT.md)** - Complete Coolify guide

For other platforms:

- **GitHub Pages**: See `.github/workflows/deploy.yml`
- **Vercel**: See `vercel.json` in each app
- **AWS/Azure/GCP**: Use the Docker images created by this setup

---

## 📞 Support

**Issues?**

- Check logs: `docker-compose logs -f [service]`
- Review docs: `docs/COOLIFY_DEPLOYMENT.md`
- GitHub Issues: [Create an issue](https://github.com/your-username/ai-portfolio-monorepo/issues)

**Performance?**

- Monitor resources: `docker stats`
- Optimize images: Already using multi-stage builds
- Scale horizontally: `docker-compose up -d --scale app-01=3`

---

**Happy Deploying! 🚀**
