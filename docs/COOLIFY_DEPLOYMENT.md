# Coolify Deployment Guide for AI Portfolio

Complete guide to deploying all 10 AI Portfolio applications using Coolify, a self-hosted alternative to Heroku/Netlify/Vercel.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Coolify Setup](#coolify-setup)
- [Project Configuration](#project-configuration)
- [Deployment Process](#deployment-process)
- [Environment Variables](#environment-variables)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Logs](#monitoring--logs)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## 🔧 Prerequisites

### Server Requirements

- **VPS/Cloud Server**: 
  - Minimum: 2 CPU cores, 4GB RAM, 50GB storage
  - Recommended: 4 CPU cores, 8GB RAM, 100GB storage
- **Operating System**: Ubuntu 22.04 LTS or Debian 11+
- **Domain**: A domain pointed to your server (optional but recommended)
- **SSH Access**: Root or sudo access to your server

### Local Requirements

- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: For repository access
- **Node.js**: Version 18+ (for local testing)

## 🚀 Coolify Setup

### 1. Install Coolify on Your Server

```bash
# SSH into your server
ssh root@your-server-ip

# Install Coolify (automated installation)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Wait for installation to complete (5-10 minutes)
# Coolify will be available at: http://your-server-ip:8000
```

### 2. Initial Coolify Configuration

1. **Access Coolify Dashboard**:
   ```
   http://your-server-ip:8000
   ```

2. **Create Admin Account**:
   - Email: your-email@example.com
   - Password: Strong password (save securely)
   - Enable 2FA (recommended)

3. **Configure Server**:
   - Go to **Settings** → **Server**
   - Set server name (e.g., "AI Portfolio Server")
   - Configure timezone
   - Enable automatic updates

4. **Setup Git Integration** (Optional):
   - Go to **Settings** → **Git**
   - Connect GitHub account
   - Generate deployment keys

## 🏗️ Project Configuration

### 1. Prepare Docker Configuration

The repository includes production-ready Docker configurations:

```
ai-portfolio-monorepo/
├── config/
│   ├── docker/
│   │   └── Dockerfile.template
│   └── nginx/
│       ├── nginx.conf
│       └── default.conf
├── docker-compose.yml
└── scripts/
    └── docker-deploy.sh
```

### 2. Environment Variables Setup

Create a `.env` file in the project root:

```bash
# Copy template
cp .env.example .env

# Edit with your API keys
nano .env
```

**Required Environment Variables**:

```env
# AI Provider API Keys (REQUIRED)
VITE_MINIMAX_API_KEY=sk-cp-xxxxxxxxxxxxxxxxxx
VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxx
VITE_GEMINI_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com

# Feature Flags
VITE_ENABLE_RAG=true
VITE_ENABLE_VOICE=true
VITE_DEFAULT_PROVIDER=minimax

# Node Environment
NODE_ENV=production
```

### 3. Dockerfile per Application

Coolify requires a Dockerfile in each app directory or at the root. We use a shared template:

```dockerfile
# config/docker/Dockerfile.template
# Multi-stage build for optimized production images
# See file for full configuration
```

## 📦 Deployment Process

### Method 1: Deploy via Coolify Dashboard (Recommended)

#### Step 1: Create Projects in Coolify

For each of the 10 applications:

1. **Navigate to Projects**:
   - Click **+ New Project**
   - Name: `app-01-ai-code-reviewer` (repeat for apps 02-10)

2. **Configure Source**:
   - **Type**: Git Repository
   - **Repository URL**: `https://github.com/your-username/ai-portfolio-monorepo.git`
   - **Branch**: `main`
   - **Build Pack**: Docker
   - **Dockerfile Path**: `config/docker/Dockerfile.template`

3. **Set Build Arguments**:
   ```
   APP_NAME=app-01-ai-code-reviewer
   NODE_ENV=production
   ```

4. **Configure Ports**:
   - **Container Port**: `8080`
   - **Public Port**: `8001` (increment for each app: 8002, 8003, etc.)

5. **Add Environment Variables**:
   - Click **Environment** tab
   - Add each variable from your `.env` file
   - Enable **Secret** for API keys

6. **Configure Health Checks**:
   - **Path**: `/health`
   - **Interval**: `30s`
   - **Timeout**: `10s`
   - **Retries**: `3`

7. **Deploy**:
   - Click **Deploy**
   - Monitor build logs in real-time

#### Step 2: Repeat for All 10 Apps

| App # | Name | Port |
|-------|------|------|
| 01 | app-01-ai-code-reviewer | 8001 |
| 02 | app-02-document-chat | 8002 |
| 03 | app-03-image-generator | 8003 |
| 04 | app-04-voice-assistant | 8004 |
| 05 | app-05-code-explainer | 8005 |
| 06 | app-06-test-generator | 8006 |
| 07 | app-07-api-integrator | 8007 |
| 08 | app-08-data-visualizer | 8008 |
| 09 | app-09-autonomous-agent | 8009 |
| 10 | app-10-rag-knowledge-base | 8010 |

### Method 2: Deploy via Docker Compose (Advanced)

```bash
# 1. SSH into your Coolify server
ssh root@your-server-ip

# 2. Clone repository
git clone https://github.com/your-username/ai-portfolio-monorepo.git
cd ai-portfolio-monorepo

# 3. Create .env file
nano .env
# Add your environment variables

# 4. Make deployment script executable
chmod +x scripts/docker-deploy.sh

# 5. Build and deploy all apps
./scripts/docker-deploy.sh

# Or deploy single app
./scripts/docker-deploy.sh --single app-01-ai-code-reviewer
```

### Method 3: Automated CI/CD with GitHub Actions

Create `.github/workflows/coolify-deploy.yml`:

```yaml
name: Deploy to Coolify

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Coolify
        env:
          COOLIFY_TOKEN: ${{ secrets.COOLIFY_TOKEN }}
          COOLIFY_URL: ${{ secrets.COOLIFY_URL }}
        run: |
          curl -X POST "$COOLIFY_URL/api/deploy" \
            -H "Authorization: Bearer $COOLIFY_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"project": "ai-portfolio"}'
```

## 🌐 Domain Configuration

### 1. Configure DNS Records

For each application, add DNS records:

```
Type: A
Name: app-01 (or subdomain)
Value: your-server-ip
TTL: 3600
```

Example subdomains:
- `code-reviewer.yourdomain.com` → App 01
- `document-chat.yourdomain.com` → App 02
- `image-gen.yourdomain.com` → App 03
- etc.

### 2. Configure Domains in Coolify

For each project in Coolify:

1. **Navigate to Project** → **Domains**
2. **Add Domain**: `code-reviewer.yourdomain.com`
3. **Enable HTTPS**:
   - Coolify automatically provisions Let's Encrypt SSL
   - Certificate renewal is automatic
4. **Configure Redirects** (optional):
   - HTTP → HTTPS redirect
   - www → non-www redirect

### 3. Wildcard Domain Setup (Alternative)

Configure a wildcard domain for all apps:

```
Type: A
Name: *.apps
Value: your-server-ip
TTL: 3600
```

Access apps at:
- `app-01.apps.yourdomain.com`
- `app-02.apps.yourdomain.com`
- etc.

## 📊 Monitoring & Logs

### View Container Logs

**In Coolify Dashboard**:
1. Navigate to **Project**
2. Click **Logs** tab
3. View real-time logs
4. Filter by severity: Info, Warning, Error

**Via SSH**:
```bash
# View all logs
docker-compose logs -f

# View specific app logs
docker-compose logs -f app-01-ai-code-reviewer

# View last 100 lines
docker-compose logs --tail=100 app-02-document-chat
```

### Health Monitoring

**Built-in Health Checks**:
- Endpoint: `http://localhost:8001/health`
- Returns: `200 OK` if healthy
- Automated restart on failure

**Monitor Container Status**:
```bash
# Check all containers
docker-compose ps

# Check specific container
docker ps | grep app-01
```

### Resource Usage

**In Coolify Dashboard**:
- Navigate to **Monitoring**
- View CPU, Memory, Disk usage
- Set up alerts for thresholds

**Via SSH**:
```bash
# Real-time resource usage
docker stats

# Disk usage
docker system df
```

## 🔥 Troubleshooting

### Build Failures

**Issue**: Docker build fails

```bash
# Check build logs
docker-compose build app-01-ai-code-reviewer

# Clean build cache
docker system prune -a
docker-compose build --no-cache app-01-ai-code-reviewer
```

### Container Won't Start

**Issue**: Container exits immediately

```bash
# Check container logs
docker logs app-01-ai-code-reviewer

# Common issues:
# 1. Missing environment variables
# 2. Port already in use
# 3. Configuration errors

# Verify environment variables
docker exec app-01-ai-code-reviewer env

# Check port availability
netstat -tuln | grep 8001
```

### Memory Issues

**Issue**: Out of memory errors

```bash
# Increase container memory limit
# Edit docker-compose.yml
services:
  app-01-ai-code-reviewer:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### SSL Certificate Issues

**Issue**: HTTPS not working

1. **Check DNS propagation**:
   ```bash
   dig code-reviewer.yourdomain.com
   ```

2. **Verify Coolify SSL settings**:
   - Project → Domains → SSL Status

3. **Force certificate renewal**:
   ```bash
   # In Coolify dashboard
   Project → Domains → Renew Certificate
   ```

### Database Connection Issues

**Issue**: App can't connect to external services

```bash
# Check network connectivity
docker exec app-01-ai-code-reviewer ping api.minimax.chat

# Check DNS resolution
docker exec app-01-ai-code-reviewer nslookup api.minimax.chat

# Verify firewall rules
sudo ufw status
```

## ⚙️ Advanced Configuration

### Custom Nginx Configuration

Override default Nginx settings:

```nginx
# config/nginx/custom.conf
server {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
    }
}
```

### Multi-Stage Deployment

**Development** → **Staging** → **Production**

```bash
# Deploy to staging
./scripts/docker-deploy.sh --registry staging.yourdomain.com

# Test staging environment
curl https://staging-app-01.yourdomain.com/health

# Promote to production
./scripts/docker-deploy.sh --registry prod.yourdomain.com
```

### Backup Strategy

```bash
# Backup script
#!/bin/bash
# scripts/backup-docker.sh

BACKUP_DIR="/backups/docker"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup volumes
docker run --rm \
  -v ai-portfolio_app-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/app-data-$DATE.tar.gz /data

# Backup configurations
tar czf $BACKUP_DIR/config-$DATE.tar.gz \
  docker-compose.yml .env config/
```

### Horizontal Scaling

Scale individual services:

```bash
# Scale to 3 instances
docker-compose up -d --scale app-01-ai-code-reviewer=3

# Load balancer configuration (nginx)
upstream app01 {
    least_conn;
    server app-01-1:8080;
    server app-01-2:8080;
    server app-01-3:8080;
}
```

### Performance Optimization

**1. Enable Caching**:
```nginx
# Add to nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m;
```

**2. Optimize Docker Images**:
```dockerfile
# Multi-stage builds reduce image size by 60-80%
# Already implemented in Dockerfile.template
```

**3. Resource Limits**:
```yaml
# docker-compose.yml
services:
  app-01:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🔐 Security Best Practices

### 1. Secure Secrets Management

```bash
# Use Docker secrets instead of environment variables
echo "sk-xxxx" | docker secret create minimax_api_key -

# Reference in docker-compose.yml
secrets:
  minimax_api_key:
    external: true
```

### 2. Network Isolation

```yaml
# docker-compose.yml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### 3. Regular Updates

```bash
# Auto-update script
#!/bin/bash
# scripts/auto-update.sh

# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d

# Clean old images
docker image prune -f
```

## 📞 Support & Resources

### Official Documentation
- **Coolify Docs**: https://coolify.io/docs
- **Docker Docs**: https://docs.docker.com
- **Nginx Docs**: https://nginx.org/en/docs/

### Community
- **Coolify Discord**: https://coolify.io/discord
- **GitHub Issues**: https://github.com/coollabsio/coolify/issues

### Monitoring Tools
- **Portainer**: Container management UI
- **Grafana**: Metrics dashboard
- **Sentry**: Error tracking

## 🎉 Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] SSL certificates provisioned
- [ ] Health checks passing
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Logs retention configured
- [ ] Resource limits set
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Documentation updated

## 📈 Post-Deployment

### Test All Applications

```bash
# Health check script
#!/bin/bash
for port in {8001..8010}; do
  echo "Testing port $port..."
  curl -f http://localhost:$port/health || echo "FAILED: Port $port"
done
```

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test application
ab -n 1000 -c 10 http://localhost:8001/
```

### Set Up Monitoring

1. **Uptime Monitoring**: Use UptimeRobot or Pingdom
2. **Error Tracking**: Integrate Sentry
3. **Analytics**: Add Google Analytics or Plausible

---

**Deployment Complete! 🚀**

All 10 AI Portfolio applications are now running on Coolify with production-grade configuration, security, and monitoring.

For support, open an issue or contact the maintainers.
