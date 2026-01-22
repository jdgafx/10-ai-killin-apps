# Deployment Guide

> **This document has been consolidated. See the main [DEPLOYMENT.md](../DEPLOYMENT.md) for complete instructions.**

---

## Quick Reference

### Primary Platform: Cloudflare Pages

```bash
# Deploy to Cloudflare Pages
cd apps/app-01-rag-chat
npm run build
npx wrangler pages deploy dist --project-name="app-01-rag-chat"
```

### Alternative: Vercel

```bash
cd apps/app-01-rag-chat
vercel --prod
```

### Local Development: Docker

```bash
./scripts/docker-deploy.sh
```

---

## Full Documentation

| Topic                            | Document                                                              |
| -------------------------------- | --------------------------------------------------------------------- |
| **Complete Deployment Guide**    | [DEPLOYMENT.md](../DEPLOYMENT.md)                                     |
| **Cloudflare Workers/Functions** | [CLOUDFLARE_DEVELOPER_GUIDE.md](../CLOUDFLARE_DEVELOPER_GUIDE.md)     |
| **API Key Setup**                | [API_KEYS_SETUP.md](API_KEYS_SETUP.md)                                |
| **Docker Quick Start**           | [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)                          |
| **Deployment Status**            | [CLOUDFLARE_DEPLOYMENT_STATUS.md](../CLOUDFLARE_DEPLOYMENT_STATUS.md) |

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Wrangler** CLI: `npm install -g wrangler`
- **Cloudflare Account**: [Sign up](https://dash.cloudflare.com/sign-up)

---

## Required API Keys

| Provider            | Variable           | Documentation                    |
| ------------------- | ------------------ | -------------------------------- |
| MiniMax (primary)   | `MINIMAX_API_KEY`  | https://api.minimax.chat         |
| DeepSeek (fallback) | `DEEPSEEK_API_KEY` | https://platform.deepseek.com    |
| Google Gemini       | `GEMINI_API_KEY`   | https://console.cloud.google.com |

See [API_KEYS_SETUP.md](API_KEYS_SETUP.md) for detailed setup instructions.

---

## Platform Comparison

| Platform             | Use Case                 | Cost      |
| -------------------- | ------------------------ | --------- |
| **Cloudflare Pages** | Production (recommended) | Free      |
| **Vercel**           | Quick deployments        | Free tier |
| **Docker**           | Local development        | Free      |

---

**For complete deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md).**
