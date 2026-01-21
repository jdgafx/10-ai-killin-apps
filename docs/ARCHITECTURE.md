# Technical Architecture Documentation

> **Comprehensive technical architecture for the AI Portfolio monorepo, detailing system design, infrastructure, and engineering decisions.**

---

## Table of Contents

1. [Overview](#overview)
2. [Monorepo Structure](#monorepo-structure)
3. [AI Provider Architecture](#ai-provider-architecture)
4. [Shared Packages Design](#shared-packages-design)
5. [Build & Deployment Pipeline](#build--deployment-pipeline)
6. [Environment Variable Management](#environment-variable-management)
7. [Data Flow Architecture](#data-flow-architecture)
8. [Security Architecture](#security-architecture)
9. [Performance Optimization](#performance-optimization)
10. [Scalability Considerations](#scalability-considerations)

---

## Overview

This AI Portfolio is built as a **production-ready monorepo** managing 10 independent AI applications with shared infrastructure. The architecture demonstrates enterprise-scale development practices suitable for a senior AI engineering portfolio.

### Core Principles

1. **Separation of Concerns** - Apps don't depend on each other
2. **DRY (Don't Repeat Yourself)** - Shared code lives in packages/
3. **Configuration as Code** - All settings in version control
4. **Progressive Enhancement** - Base functionality works, advanced features enhance
5. **Fail Gracefully** - Fallback providers, comprehensive error handling
6. **Performance First** - Lazy loading, code splitting, caching

---

## Monorepo Structure

### Directory Organization

```
10-ai-killin-apps/
├── apps/                          # Application layer (10 apps)
│   ├── app-01-ai-code-reviewer/
│   │   ├── src/
│   │   │   ├── components/        # React components
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── lib/               # Business logic
│   │   │   ├── utils/             # App-specific utilities
│   │   │   ├── App.jsx            # Root component
│   │   │   └── main.jsx           # Entry point
│   │   ├── public/                # Static assets
│   │   ├── package.json           # App dependencies
│   │   ├── vite.config.js         # Build configuration
│   │   └── README.md              # App documentation
│   ├── app-02-document-chat/
│   └── ... (8 more apps)
│
├── packages/                      # Shared libraries
│   ├── shared-ui/                 # Component library
│   │   ├── src/
│   │   │   ├── components/        # Button, Card, Modal, etc.
│   │   │   ├── styles/            # Global styles
│   │   │   └── index.ts           # Package exports
│   │   └── package.json
│   ├── ai-providers/              # AI integration layer
│   │   ├── src/
│   │   │   ├── minimax/           # MiniMax provider
│   │   │   ├── gemini/            # Gemini provider
│   │   │   ├── deepseek/          # DeepSeek provider
│   │   │   ├── types.ts           # Shared types
│   │   │   └── index.ts           # Provider exports
│   │   └── package.json
│   └── utils/                     # Utility functions
│       ├── src/
│       │   ├── string.ts          # String utilities
│       │   ├── array.ts           # Array utilities
│       │   ├── storage.ts         # localStorage wrapper
│       │   └── index.ts           # Utility exports
│       └── package.json
│
├── config/                        # Shared configurations
│   ├── eslint/
│   │   └── eslint.config.js       # Base ESLint rules
│   ├── prettier/
│   │   └── prettier.config.js     # Code formatting rules
│   └── vite/
│       └── vite.config.base.js    # Base Vite config
│
├── .github/workflows/             # CI/CD pipelines
│   ├── ci-cd.yml                  # Main pipeline
│   └── deploy-*.yml               # Deployment workflows
│
├── docker-compose.yml             # Docker orchestration
├── package.json                   # Root workspace config
├── tsconfig.json                  # TypeScript configuration
└── .env.example                   # Environment template
```

### Workspace Configuration

**Root `package.json` workspace setup:**

```json
{
  "name": "ai-portfolio-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Benefits:**
- Single `node_modules` (disk space efficient)
- Linked packages (changes reflected immediately)
- Consistent versions across workspace
- `npm install` installs all workspaces

---

## AI Provider Architecture

### Multi-Provider Strategy

The system supports three AI providers with automatic fallback:

```
┌─────────────────────────────────────────────────┐
│         Application Component                   │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│         useAIProvider() Hook                    │
│  - Provider selection logic                     │
│  - Error handling & retries                     │
│  - Stream management                            │
└───────────────┬─────────────────────────────────┘
                │
                ▼
        ┌───────┴───────┐
        │  Provider      │
        │  Selection     │
        └───────┬────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌────────┐  ┌─────────┐  ┌──────────┐
│MiniMax │  │ Gemini  │  │DeepSeek  │
│Primary │  │Secondary│  │ Fallback │
└────────┘  └─────────┘  └──────────┘
```

### Provider Implementation

**packages/ai-providers/src/minimax/chat.ts:**

```typescript
export async function minimaxChat(
  messages: Message[],
  options?: ChatOptions
): Promise<ChatResponse> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
  
  try {
    const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || 'minimax-abab6.5',
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 2048,
        stream: options?.stream || false,
      }),
    });

    if (!response.ok) {
      throw new Error(`MiniMax API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('MiniMax chat error:', error);
    throw error;
  }
}
```

### Provider Abstraction

**Unified interface for all providers:**

```typescript
export interface AIProvider {
  name: string;
  chat: (messages: Message[], options?: ChatOptions) => Promise<ChatResponse>;
  embed: (text: string) => Promise<number[]>;
  image?: (prompt: string, options?: ImageOptions) => Promise<ImageResponse>;
}

export const providers: Record<string, AIProvider> = {
  minimax: minimaxProvider,
  gemini: geminiProvider,
  deepseek: deepseekProvider,
};
```

### Automatic Fallback Logic

```typescript
async function chatWithFallback(
  messages: Message[],
  options?: ChatOptions
): Promise<ChatResponse> {
  const providers = ['minimax', 'gemini', 'deepseek'];
  
  for (const providerName of providers) {
    try {
      const provider = providers[providerName];
      const response = await provider.chat(messages, options);
      return response;
    } catch (error) {
      console.warn(`Provider ${providerName} failed, trying next...`);
      if (providerName === 'deepseek') {
        throw new Error('All providers failed');
      }
    }
  }
}
```

---

## Shared Packages Design

### 1. **shared-ui** - Component Library

**Purpose:** Reusable React components for consistent UI across all apps.

**Structure:**
```
packages/shared-ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Input/
│   │   └── index.ts
│   ├── styles/
│   │   └── global.css
│   └── index.ts
└── package.json
```

**Usage in apps:**
```typescript
import { Button, Card, Modal } from '@shared/ui';

function App() {
  return (
    <Card>
      <Button onClick={() => {}}>Click me</Button>
    </Card>
  );
}
```

### 2. **ai-providers** - AI Integration Layer

**Purpose:** Unified interface for MiniMax, Gemini, and DeepSeek APIs.

**Key Features:**
- Provider abstraction (easy to switch)
- Error handling and retries
- Stream support for real-time responses
- Custom React hook: `useAIProvider()`

**Usage:**
```typescript
import { useAIProvider } from '@ai/providers';

function ChatComponent() {
  const { chat, isLoading, error } = useAIProvider('minimax');
  
  const handleSend = async (message: string) => {
    const response = await chat([{ role: 'user', content: message }]);
    console.log(response);
  };
  
  return <ChatUI onSend={handleSend} />;
}
```

### 3. **utils** - Utility Functions

**Purpose:** Common utilities used across multiple apps.

**Categories:**
- **String:** format, validate, slugify, truncate
- **Array:** chunk, flatten, unique, groupBy
- **Object:** merge, pick, omit, deepClone
- **API:** fetchWithRetry, handleError
- **Storage:** localStorage wrapper with JSON support
- **Hooks:** useDebounce, useLocalStorage, useAsync

**Usage:**
```typescript
import { useDebounce, fetchWithRetry } from '@utils';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    fetchWithRetry('/api/search', { query: debouncedSearch });
  }, [debouncedSearch]);
}
```

---

## Build & Deployment Pipeline

### Development Workflow

```bash
# Install all dependencies
npm install

# Start specific app in development mode
npm run dev:app-01

# Lint all code
npm run lint

# Format all code
npm run format

# Type check
npm run type-check
```

### Production Build Process

```
┌──────────────┐
│  npm build   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Build each app  │
│  in parallel     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Vite build      │
│  - Tree shaking  │
│  - Minification  │
│  - Code splitting│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Output to       │
│  apps/*/dist/    │
└──────────────────┘
```

### CI/CD Pipeline (GitHub Actions)

**`.github/workflows/ci-cd.yml`:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run type-check

  build:
    runs-on: ubuntu-latest
    needs: [lint, type-check]
    strategy:
      matrix:
        app: [app-01, app-02, app-03, app-04, app-05, 
              app-06, app-07, app-08, app-09, app-10]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build:${{ matrix.app }}
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.app }}-dist
          path: apps/${{ matrix.app }}-*/dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Deployment Targets

| Platform | Method | Configuration | URL Format |
|----------|--------|---------------|------------|
| **GitHub Pages** | GitHub Actions | `.github/workflows/deploy.yml` | `username.github.io/repo/` |
| **Vercel** | Git Integration | `vercel.json` per app | `app.vercel.app` |
| **Coolify** | Docker Compose | `docker-compose.yml` | `app.domain.com` |

---

## Environment Variable Management

### Environment Variable Flow

```
Development:
  .env.local (gitignored)
    ↓
  Vite loads VITE_* variables
    ↓
  Available as import.meta.env.VITE_*

Production:
  GitHub Secrets
    ↓
  GitHub Actions environment
    ↓
  Build process (embedded in JS)
    ↓
  Runtime access via import.meta.env
```

### Variable Naming Convention

- **VITE_*** - Client-side variables (exposed to browser)
- **NODE_ENV** - Environment (development/production)
- **API Keys** - Always prefixed with `VITE_` for Vite apps

### Security Considerations

⚠️ **Important:** All `VITE_*` variables are embedded in the client bundle and exposed to browsers. This is expected for client-side API calls but means:

1. Never store sensitive server-side secrets in `VITE_*` variables
2. Use appropriate API key restrictions (domain whitelist, rate limits)
3. Rotate keys regularly
4. Monitor API usage for anomalies

### Environment Setup

**Local Development:**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

**GitHub Pages:**
```
Repository Settings → Secrets and variables → Actions
Add: VITE_MINIMAX_API_KEY, VITE_DEEPSEEK_API_KEY, etc.
```

**Vercel:**
```
Project Settings → Environment Variables
Add variables for Production, Preview, Development
```

**Coolify:**
```
Project → Environment Variables
Add variables in the UI
```

---

## Data Flow Architecture

### Application Data Flow

```
┌──────────────────────────────────────────────────────┐
│                   User Interface                      │
│          (React Components + Tailwind CSS)            │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│               Custom React Hooks                      │
│     useAIProvider, useChat, useRAG, useVoice         │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│              Business Logic Layer                     │
│        (lib/ directory in each app)                   │
└─────────────────────┬────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │Shared UI│ │AI Provider│ │Utils   │
    │Package  │ │Package    │ │Package │
    └────┬────┘ └────┬─────┘ └────┬────┘
         │           │            │
         └───────────┼────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  External Services     │
        │  - AI APIs             │
        │  - GitHub API          │
        │  - Vector Database     │
        └────────────────────────┘
```

### RAG System Data Flow (Document Chat & Knowledge Base)

```
1. Document Upload
   ↓
2. Text Extraction (PDF.js, Docx parser)
   ↓
3. Text Chunking (500-1000 tokens per chunk)
   ↓
4. Vector Embeddings (MiniMax Embeddings API)
   ↓
5. Vector Storage (Local IndexedDB or PostgreSQL)
   ↓
6. User Query
   ↓
7. Query Embedding
   ↓
8. Semantic Search (Cosine similarity)
   ↓
9. Context Retrieval (Top-k chunks)
   ↓
10. LLM Query + Context (MiniMax Chat API)
    ↓
11. Response with Citations
```

### Real-time Streaming Flow (Voice Assistant, Chat)

```
User Input (Voice/Text)
   ↓
Speech-to-Text (if voice)
   ↓
Message → AI Provider (stream: true)
   ↓
Server-Sent Events (SSE) or WebSocket
   ↓
Chunk-by-chunk response
   ↓
UI updates in real-time
   ↓
Text-to-Speech (if voice mode)
```

---

## Security Architecture

### API Key Security

1. **Client-side API Keys** (Expected pattern for public APIs)
   - Store in environment variables
   - Never commit to Git
   - Use domain restrictions
   - Implement rate limiting

2. **GitHub Secrets** (For CI/CD)
   - Store in repository secrets
   - Never logged in console
   - Scoped to specific workflows

3. **Key Rotation**
   - Rotate keys quarterly
   - Update in all deployment platforms
   - Monitor for unauthorized usage

### CORS Configuration

```typescript
// Example CORS setup for API calls
const corsHeaders = {
  'Access-Control-Allow-Origin': import.meta.env.VITE_ALLOWED_ORIGINS,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### Input Validation

All user inputs are validated before processing:

```typescript
function validateInput(input: string): boolean {
  // Length validation
  if (input.length > 10000) return false;
  
  // XSS prevention
  const sanitized = input.replace(/<script.*?>.*?<\/script>/gi, '');
  
  // SQL injection prevention (if using database)
  const escaped = sanitized.replace(/['";\\]/g, '\\$&');
  
  return true;
}
```

### Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://api.minimax.chat https://api.deepseek.com;">
```

---

## Performance Optimization

### Code Splitting

```typescript
// Route-based code splitting
const CodeReviewer = lazy(() => import('./apps/app-01-ai-code-reviewer'));
const DocumentChat = lazy(() => import('./apps/app-02-document-chat'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/code-reviewer" element={<CodeReviewer />} />
        <Route path="/document-chat" element={<DocumentChat />} />
      </Routes>
    </Suspense>
  );
}
```

### Bundle Size Optimization

- **Tree shaking** - Remove unused code
- **Minification** - Terser for production builds
- **Gzip compression** - Serve compressed assets
- **Code splitting** - Load only what's needed

### Caching Strategy

```typescript
// Service Worker caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ai-portfolio-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/main.js',
        '/static/css/main.css',
      ]);
    })
  );
});
```

### Performance Metrics

Target metrics:
- **First Contentful Paint (FCP)** < 1.8s
- **Time to Interactive (TTI)** < 3.8s
- **Largest Contentful Paint (LCP)** < 2.5s
- **Cumulative Layout Shift (CLS)** < 0.1

---

## Scalability Considerations

### Horizontal Scaling

Each app can be scaled independently:

```yaml
# Docker Compose scaling
docker-compose up --scale app-01-ai-code-reviewer=3
```

### Database Scaling (for RAG apps)

```
PostgreSQL with pgvector extension
   ↓
Read replicas for queries
   ↓
Master for writes
   ↓
Connection pooling (PgBouncer)
```

### CDN Integration

```typescript
// Serve static assets from CDN
const CDN_URL = import.meta.env.VITE_CDN_URL || '';

function getAssetUrl(path: string): string {
  return `${CDN_URL}${path}`;
}
```

### Load Balancing

```
Nginx Load Balancer
   ↓
┌──────┬──────┬──────┐
│App 1 │App 2 │App 3 │
└──────┴──────┴──────┘
```

---

## Monitoring & Observability

### Logging Strategy

```typescript
import { logger } from '@utils/logger';

logger.info('User action', { userId, action, timestamp });
logger.error('API call failed', { provider, endpoint, error });
logger.warn('Rate limit approaching', { current, limit });
```

### Error Tracking

Integrate with Sentry or similar:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV,
});
```

### Performance Monitoring

```typescript
const startTime = performance.now();
await expensiveOperation();
const duration = performance.now() - startTime;
logger.info('Operation completed', { operation: 'expensiveOp', duration });
```

---

## Conclusion

This architecture provides:

✅ **Scalability** - Support 10+ applications with ease  
✅ **Maintainability** - Shared configs reduce duplication  
✅ **Reliability** - Multi-provider resilience and comprehensive error handling  
✅ **Developer Experience** - Clear structure, good tooling, fast feedback  
✅ **Production Readiness** - Security, performance, monitoring built-in  
✅ **Portfolio Value** - Demonstrates enterprise engineering practices  

The structure is designed to be production-ready while remaining understandable for portfolio purposes.
