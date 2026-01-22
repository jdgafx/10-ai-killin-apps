# Cloudflare Developer Platform Guide

## Comprehensive Guide for AI App Deployment

### Platform Overview

**Cloudflare Workers**

- Edge-based serverless functions
- V8 JavaScript runtime
- Global deployment (200+ locations)
- Zero cold starts
- HTTP/WebSocket support
- KV storage integration

**Cloudflare Pages**

- Static site hosting + Functions
- Git-based deployments
- Automatic HTTPS
- Global CDN
- Preview deployments
- Built-in analytics

**Cloudflare Pages Functions**

- Workers integrated with Pages
- File-based routing (/functions directory)
- Middleware support
- Environment variables
- Secrets management
- TypeScript support

### Deployment Architecture

```
GitHub Repository
    ↓
Cloudflare Pages (Frontend)
    +
Cloudflare Workers (API/Backend)
    ↓
Global CDN (Edge Locations)
```

### API Endpoints

**Base URL:** `https://api.cloudflare.com/client/v4`

**Authentication:**

```bash
Authorization: Bearer {API_TOKEN}
```

**Key Endpoints:**

- `/accounts/{account_id}/pages/projects` - Pages projects
- `/accounts/{account_id}/workers/scripts` - Worker scripts
- `/accounts/{account_id}/storage/kv/namespaces` - KV storage

### Pages Functions Structure

```
my-app/
├── public/           # Static assets
├── functions/        # Cloudflare Workers
│   ├── api/
│   │   └── chat.ts   # /api/chat endpoint
│   └── _middleware.ts # Global middleware
└── wrangler.toml     # Configuration
```

### Function Example

```typescript
// functions/api/chat.ts
export async function onRequest(context: PagesFunction) {
  const { request, env } = context;

  // Handle CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const body = await request.json();

    // Call AI API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: body.message }],
      }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        content: data.content[0].text,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
```

### Environment Variables

**Setting Secrets:**

```bash
# Via Wrangler CLI
echo "your-api-key" | wrangler secret put ANTHROPIC_API_KEY --project-name=my-app

# Via Dashboard
# https://dash.cloudflare.com → Pages → Project → Settings → Environment Variables
```

**Accessing in Code:**

```typescript
export async function onRequest(context) {
  const apiKey = context.env.ANTHROPIC_API_KEY;
  // Use apiKey...
}
```

### Deployment Methods

#### Method 1: Wrangler CLI (Recommended)

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
cd my-app
npm run build
wrangler pages deploy dist --project-name=my-app
```

#### Method 2: GitHub Integration

1. Connect GitHub repo to Cloudflare Pages
2. Configure build settings
3. Push to main branch → Auto-deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: my-app
          directory: dist
```

#### Method 3: Cloudflare TypeScript SDK

```typescript
import Cloudflare from "cloudflare";

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

// Create Pages project
await client.pages.projects.create({
  account_id: "account-id",
  name: "my-app",
  production_branch: "main",
});

// Deploy
await client.pages.projects.deployments.create({
  account_id: "account-id",
  project_name: "my-app",
  branch: "main",
  // Upload files...
});
```

### Best Practices

**1. Use TypeScript**

```typescript
// functions/api/types.ts
export interface RequestBody {
  message: string;
}

export interface ResponseBody {
  content: string;
}
```

**2. Error Handling**

```typescript
try {
  // API call
} catch (error) {
  console.error("Error:", error);
  return new Response(
    JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }),
    { status: 500 },
  );
}
```

**3. CORS Configuration**

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Apply to all responses
return new Response(body, { headers: corsHeaders });
```

**4. Rate Limiting**

```typescript
// Use Cloudflare Rate Limiting
// Configure in dashboard or via API
```

**5. Caching**

```typescript
return new Response(data, {
  headers: {
    "Cache-Control": "public, max-age=3600",
  },
});
```

### Common Patterns

**Middleware Pattern**

```typescript
// functions/_middleware.ts
export async function onRequest(context) {
  // Auth check
  const token = context.request.headers.get("Authorization");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Continue to next handler
  return context.next();
}
```

**Proxy Pattern**

```typescript
export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.hostname = "api.external-service.com";

  return fetch(url.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  });
}
```

**AI Streaming Pattern**

```typescript
export async function onRequest(context) {
  const { readable, writable } = new TransformStream();

  // Stream AI response
  fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      /* ... */
    },
    body: JSON.stringify({ stream: true /* ... */ }),
  }).then((response) => {
    response.body.pipeTo(writable);
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

### Performance Optimization

**1. Bundle Size**

- Use tree-shaking
- Minimize dependencies
- Use dynamic imports

**2. Edge Caching**

- Cache static assets
- Use stale-while-revalidate
- Implement cache keys

**3. Request Optimization**

- Batch API calls
- Use connection pooling
- Implement request deduplication

### Monitoring & Debugging

**Logs:**

```bash
# View real-time logs
wrangler pages deployment tail
```

**Analytics:**

- Access via Cloudflare Dashboard
- Track requests, errors, latency
- Set up alerts

**Debugging:**

```typescript
// Local development
wrangler pages dev dist

// Console logs appear in Cloudflare dashboard
console.log('Debug info:', data);
```

### Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [TypeScript SDK](https://github.com/cloudflare/cloudflare-typescript)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
