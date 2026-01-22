# Documentation Index

Welcome to the AI Portfolio documentation! This index helps you quickly find the documentation you need.

---

## Quick Navigation

| Document                                                              | Purpose                      | When to Use                                   |
| --------------------------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| [**DEPLOYMENT.md**](../DEPLOYMENT.md)                                 | **Primary deployment guide** | Deploying apps to Cloudflare Pages            |
| [**MASTER_README.md**](../MASTER_README.md)                           | Portfolio overview           | First-time visitors, overview of all projects |
| [**ARCHITECTURE.md**](ARCHITECTURE.md)                                | Technical architecture       | Understanding system design, interviews       |
| [**API_KEYS_SETUP.md**](API_KEYS_SETUP.md)                            | API key configuration        | Setting up MiniMax, Gemini, DeepSeek          |
| [**CLOUDFLARE_DEVELOPER_GUIDE.md**](../CLOUDFLARE_DEVELOPER_GUIDE.md) | Cloudflare Workers/Functions | Building serverless functions                 |

---

## Getting Started (New Users)

**First time here?** Follow this path:

1. **Start with:** [MASTER_README.md](../MASTER_README.md)
   - Get overview of all 10 projects
   - Understand the technology stack
   - See deployment status

2. **Then read:** [API_KEYS_SETUP.md](API_KEYS_SETUP.md)
   - Set up your API keys
   - Configure environment variables
   - Test your setup

3. **Next:** Install and run

   ```bash
   npm install
   npm run dev:app-01  # Start your first app
   ```

4. **When ready to deploy:** [DEPLOYMENT.md](../DEPLOYMENT.md)

---

## Deployment Documentation

| Document                                                          | Platform                   | Status      |
| ----------------------------------------------------------------- | -------------------------- | ----------- |
| [**DEPLOYMENT.md**](../DEPLOYMENT.md)                             | Cloudflare Pages (primary) | **Current** |
| [CLOUDFLARE_DEVELOPER_GUIDE.md](../CLOUDFLARE_DEVELOPER_GUIDE.md) | Cloudflare Workers         | Current     |
| [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)                      | Docker                     | Available   |
| [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)                      | Vercel                     | Deprecated  |
| [COOLIFY_DEPLOYMENT.md](COOLIFY_DEPLOYMENT.md)                    | Coolify                    | Available   |

---

## For Developers

**Contributing to the project?**

1. Read: [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
2. Review: [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the codebase
3. Reference: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - See all projects

---

## For DevOps Engineers

**Deploying the applications?**

1. Read: [DEPLOYMENT.md](../DEPLOYMENT.md) - Complete Cloudflare deployment guide
2. Setup: [API_KEYS_SETUP.md](API_KEYS_SETUP.md) - Environment configuration
3. Reference: [CLOUDFLARE_DEVELOPER_GUIDE.md](../CLOUDFLARE_DEVELOPER_GUIDE.md) - Functions development

---

## Search by Topic

### Installation & Setup

- [Quick Start](../MASTER_README.md#-quick-start)
- [Prerequisites](../DEPLOYMENT.md#prerequisites)
- [API Keys Setup](API_KEYS_SETUP.md)

### Deployment

- [Cloudflare Pages (Recommended)](../DEPLOYMENT.md#cloudflare-deployment-details)
- [Docker](DOCKER_QUICKSTART.md)
- [Vercel](VERCEL_DEPLOYMENT.md)

### Architecture

- [Monorepo Structure](ARCHITECTURE.md#monorepo-structure)
- [AI Provider Architecture](ARCHITECTURE.md#ai-provider-architecture)

### Security

- [API Key Security](API_KEYS_SETUP.md#security-best-practices)
- [Environment Variables](API_KEYS_SETUP.md#environment-variable-setup)

---

## Documentation Updates

**Last Updated:** January 2026

**Primary Platform:** Cloudflare Pages

---

**Need Help?**

- Check the documentation above
- Search GitHub Issues
- Ask in GitHub Discussions
