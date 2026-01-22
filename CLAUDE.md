# CLAUDE.md - Project Configuration for 10 AI Killer Apps

## TEMPLATE-FIRST DEVELOPMENT (CRITICAL)

**ALWAYS use templates as the starting point. 99% of projects should begin from a template.**

### Template Sources

| Framework              | Template Source                                                        | Command                                                      |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Next.js**            | https://github.com/vercel/next.js/tree/canary/packages/create-next-app | `npx create-next-app@latest --example [template-name]`       |
| **Cloudflare Workers** | https://workers.new/templates/                                         | `npm create cloudflare@latest -- --template [template-name]` |

### Workflow

1. **FIRST**: Find the best matching template
2. **SECOND**: Customize from the template
3. **NEVER**: Start from scratch when a template exists

### Next.js Templates (Most Used)

```bash
# With App Router (recommended)
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --use-npm

# With specific template
npx create-next-app@latest my-app --example with-tailwindcss
npx create-next-app@latest my-app --example with-supabase
npx create-next-app@latest my-app --example ai-chatbot

# Browse all templates
# https://github.com/vercel/next.js/tree/canary/examples
```

### Cloudflare Workers Templates

**Command Format:**

```bash
npm create cloudflare@latest my-app -- --template=cloudflare/templates/TEMPLATE-NAME
```

**All Available Templates (38 total):**

| Template                                  | Description                     | Use Case                                        |
| ----------------------------------------- | ------------------------------- | ----------------------------------------------- |
| **next-starter-template** ⭐              | Next.js full-stack app          | **MOST USED - Full-stack Next.js with Workers** |
| **react-router-starter-template**         | React Router 7 full-stack       | Modern React applications                       |
| **react-router-hono-fullstack-template**  | React Router + Hono + shadcn/ui | Full-stack with beautiful UI                    |
| **remix-starter-template**                | Remix full-stack app            | Remix applications                              |
| **astro-blog-starter-template**           | Astro blog/portfolio            | Personal websites, blogs                        |
| **vite-react-template**                   | Vite + React + Hono             | Fast React development                          |
| **chanfana-openapi-template**             | Hono + Chanfana + D1 + Vitest   | Complete backend API with OpenAPI               |
| **llm-chat-app-template**                 | Workers AI chat app             | AI chat applications                            |
| **text-to-image-template**                | Text-to-image generation        | AI image generation                             |
| **d1-template**                           | D1 serverless SQLite            | Database applications                           |
| **d1-starter-sessions-api-template**      | D1 with Sessions API            | Read replication with D1                        |
| **durable-chat-template**                 | Durable Objects + PartyKit      | Real-time chat                                  |
| **hello-world-do-template**               | Durable Objects starter         | Learning Durable Objects                        |
| **multiplayer-globe-template**            | Real-time visitor locations     | Multiplayer/real-time apps                      |
| **r2-explorer-template**                  | R2 bucket browser               | Google Drive-like interface for R2              |
| **to-do-list-kv-template**                | To-do app with KV               | Simple CRUD with KV                             |
| **postgres-hyperdrive-template**          | Postgres with Hyperdrive        | External Postgres acceleration                  |
| **mysql-hyperdrive-template**             | MySQL with Hyperdrive           | External MySQL acceleration                     |
| **react-postgres-fullstack-template**     | React + Postgres fullstack      | Full-stack with external DB                     |
| **react-router-postgres-ssr-template**    | React Router + Postgres SSR     | SSR with Postgres                               |
| **containers-template**                   | Container-enabled Worker        | Custom runtime containers                       |
| **nodejs-http-server-template**           | Node.js HTTP server             | Node.js compatibility                           |
| **openauth-template**                     | OpenAuth server                 | Authentication server                           |
| **saas-admin-template**                   | Astro + shadcn admin dashboard  | SaaS admin panels                               |
| **microfrontend-template**                | Route-based microfrontends      | Microfrontend architecture                      |
| **workflows-starter-template**            | Cloudflare Workflows demo       | Long-running workflows                          |
| **workers-for-platforms-template**        | Website hosting platform        | Multi-tenant platforms                          |
| **worker-publisher-template**             | Deploy Workers via API          | Workers management                              |
| **workers-builds-notifications-template** | Build status notifications      | CI/CD notifications                             |
| **x402-proxy-template**                   | Payment-gated proxy             | Monetization with x402                          |
| **nlweb-template**                        | Nl Web components               | Natural language web                            |
| **cli**                                   | Template development CLI        | Creating new templates                          |

**Quick Commands (Most Used):**

```bash
# Next.js (MOST COMMON)
npm create cloudflare@latest my-app -- --template=cloudflare/templates/next-starter-template

# React Router + Hono + shadcn/ui
npm create cloudflare@latest my-app -- --template=cloudflare/templates/react-router-hono-fullstack-template

# LLM Chat App
npm create cloudflare@latest my-chat -- --template=cloudflare/templates/llm-chat-app-template

# D1 Database
npm create cloudflare@latest my-db-app -- --template=cloudflare/templates/d1-template

# Real-time Chat
npm create cloudflare@latest my-chat -- --template=cloudflare/templates/durable-chat-template

# Backend API (Hono + OpenAPI)
npm create cloudflare@latest my-api -- --template=cloudflare/templates/chanfana-openapi-template

# Interactive picker (shows all templates)
npm create cloudflare@latest
```

**Browse All Templates:**

- Official Docs: https://developers.cloudflare.com/workers/get-started/quickstarts/
- GitHub Repo: https://github.com/cloudflare/templates
- Quick Deploy: https://workers.new/templates/

### Why Templates First?

- Best practices built-in
- Proper project structure
- Correct dependencies and versions
- Working examples to modify
- Saves hours of boilerplate setup

---

## AI Provider Priority

1. **MiniMax** (primary)
2. **Claude via Copilot API** (secondary)
3. **Gemini** (tertiary)
4. **DeepSeek** (quaternary)
5. **Workers AI** (FALLBACK ONLY - for embeddings or emergency)

---

## Project Structure

```
apps/           # 10 AI applications
packages/       # Shared utilities (ai-providers, shared-ui, utils)
config/         # Shared configs
```

---

## Key Files

- `ai_portfolio_deployment_guide_comprehensive.md` - Complete deployment guide
- `cloudflare-developers-full-llms.txt` - Cloudflare SDK reference
