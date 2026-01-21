# Monorepo Architecture Summary

## Overview

This is a **production-ready monorepo** for managing 10 AI-powered web applications with shared infrastructure, configuration, and utilities. The structure demonstrates enterprise-scale development practices suitable for a senior AI engineering portfolio.

## Architecture Decisions

### 1. **Monorepo Pattern (npm workspaces)**

**Why Monorepo?**
- Single source of truth for shared code
- Atomic commits across projects
- Simplified dependency management
- Unified CI/CD pipelines
- Clear project boundaries with shared infrastructure

**Workspace Structure:**
```
root/
├── apps/          # 10 independent applications
├── packages/      # 3 shared libraries
└── config/        # Shared configurations
```

### 2. **Tech Stack**

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + Vite | Modern, fast, developer-friendly |
| **Build** | Vite | Fast HMR, optimized production builds |
| **Language** | TypeScript | Type safety, scalability |
| **Styling** | Tailwind CSS | Utility-first, consistent design |
| **AI Providers** | MiniMax, Gemini, DeepSeek | Multi-vendor resilience |
| **Deployment** | GitHub Pages, Vercel, Coolify | Multiple platform options |

### 3. **Directory Organization**

#### `/apps` - Applications Layer
10 independent Vite + React projects, each with:
- Own `package.json` (local dependencies)
- Own `vite.config.js` (build configuration)
- Own source code structure
- Own build output

**Principle:** Each app is deployable independently while sharing infrastructure.

#### `/packages` - Shared Libraries

**`shared-ui/`** - Component Library
- Reusable React components (Button, Card, Modal, etc.)
- Consistent design system
- TypeScript types
- Tailwind CSS styling

**`ai-providers/`** - AI Integration Layer
- Unified interface for MiniMax, Gemini, DeepSeek
- Provider abstraction (easy to switch)
- Error handling and retries
- Stream support for real-time responses
- Custom React hook: `useAIProvider()`

**`utils/`** - Utility Functions
- String manipulation (format, validate, parse)
- Array operations (chunk, flatten, unique)
- Object utilities (merge, pick, omit)
- API helpers (fetch with retries, error handling)
- Storage wrappers (localStorage with JSON support)
- Custom hooks and types

#### `/config` - Shared Configuration

**`eslint/`** - Linting Rules
- JavaScript/TypeScript rules
- React and React Hooks rules
- Consistent code quality across projects

**`prettier/`** - Code Formatting
- 100 character line width
- Single quotes, 2-space indentation
- Consistent across all projects

**`vite/`** - Build Configuration
- Base Vite config for React
- Path aliases (`@`, `@shared`, `@utils`, `@ai`)
- Optimization settings
- Can be extended per app

#### `/.github/workflows` - CI/CD Pipelines

**`ci-cd.yml`** - Automated Pipeline
- Lint on every push
- Type checking
- Test running (if tests exist)
- Build verification
- Security scanning
- Multi-app parallel building
- Automatic deployment to GitHub Pages

## Data Flow Architecture

### Application Architecture

Each application follows this pattern:

```
User Interface (React Components)
       ↓
Custom Hooks (useAIProvider, useChat, etc.)
       ↓
Business Logic (lib/)
       ↓
Shared Packages (@shared/ui, @ai, @utils)
       ↓
External Services (AI APIs, GitHub, Database)
```

### AI Provider Architecture

```
Application Component
       ↓
useAIProvider() Hook
       ↓
Provider Selection (MiniMax/Gemini/DeepSeek)
       ↓
API Call (with error handling & retries)
       ↓
Stream Response (real-time updates)
       ↓
UI Update
```

## Dependency Management

### Workspace Dependencies

```json
{
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

### Scoping Commands to Workspaces

```bash
# Run script in specific workspace
npm run dev --workspace=app-01-ai-code-reviewer

# Install package in specific workspace
npm install axios --workspace=app-01-ai-code-reviewer

# Install package in all apps
npm install @headlessui/react --workspaces
```

## Configuration Inheritance

### ESLint Configuration

Each app inherits from shared config:

```javascript
// apps/app-01-ai-code-reviewer/eslint.config.js
import baseConfig from '../../config/eslint/eslint.config.js'

export default [
  ...baseConfig,
  {
    // App-specific overrides
  }
]
```

### Vite Configuration

Each app extends base config:

```javascript
// apps/app-01-ai-code-reviewer/vite.config.js
import baseConfig from '../../config/vite/vite.config.base.js'
import { mergeConfig } from 'vite'

export default mergeConfig(baseConfig, {
  // App-specific configuration
})
```

### TypeScript Configuration

Root `tsconfig.json` with path aliases:

```json
{
  "paths": {
    "@/*": ["packages/*"],
    "@shared/*": ["packages/shared-ui/*"],
    "@utils/*": ["packages/utils/*"],
    "@ai/*": ["packages/ai-providers/*"]
  }
}
```

## Build & Deployment Strategy

### Development Workflow

```bash
npm install              # Install all workspaces
npm run dev:app-01       # Run specific app
npm run lint             # Lint everything
npm run format           # Format all code
```

### Production Build

```bash
npm run build            # Build all apps
npm run build:app-01     # Build specific app
# Outputs: apps/app-XX/dist/
```

### Deployment Options

| Platform | Method | URL |
|----------|--------|-----|
| **GitHub Pages** | GitHub Actions → Artifacts → Pages | `https://username.github.io/repo/` |
| **Vercel** | GitHub Integration or CLI | `https://app.vercel.app/` |
| **Coolify** | Docker + Git | `https://app.domain.com/` |

### CI/CD Pipeline

```
Push to GitHub
    ↓
Lint Check
    ↓
Type Check
    ↓
Run Tests
    ↓
Build All Apps (parallel)
    ↓
Security Scan
    ↓
Deploy to GitHub Pages (if main branch)
```

## Scalability Considerations

### Adding New Applications

The monorepo structure supports easy addition of new apps:

```bash
mkdir -p apps/app-11-new-project/src
cp TEMPLATE-app-package.json apps/app-11-new-project/package.json
# ... minimal setup, inherits all shared configs
npm install
```

### Extracting Shared Code

When multiple apps need same feature:

1. Create new package: `packages/feature-name/`
2. Implement shared logic
3. Export from `packages/feature-name/src/index.ts`
4. Import in apps: `import { Feature } from '@feature-name'`
5. Update workspace dependencies if needed

### Monorepo Growth

The structure handles growth through:
- **Clear boundaries:** Apps don't directly depend on each other
- **Shared infrastructure:** config/, packages/ grow as needed
- **Parallel building:** CI/CD builds apps in parallel
- **Modular packages:** Extract common patterns to packages/

## Security Architecture

### API Keys & Secrets

```
GitHub Secrets (for CI/CD)
    ↓
GitHub Actions → Environment Variables
    ↓
Build Process → Embedded in JS
    ↓
Client-side API calls

⚠️ Frontend API keys are client-exposed (expected for public APIs)
```

### Environment Variables

**Root `.env.local` (local development):**
```bash
VITE_MINIMAX_API_KEY=...
VITE_DEEPSEEK_API_KEY=...
```

**GitHub Secrets (CI/CD):**
```
Settings → Secrets and variables → Actions
```

**Vercel Secrets:**
```
Project Settings → Environment Variables
```

**Coolify Secrets:**
```
Project → Environment Variables
```

## Performance Architecture

### Code Splitting

- Vite automatically splits vendor code (`react`, `react-dom`)
- Lazy load heavy components with React.lazy()
- Route-based code splitting with react-router

### Caching Strategy

- Static assets: 1 year cache (immutable hashes)
- HTML: No cache (always fresh)
- JS/CSS: Long cache with content hashing

### Bundle Optimization

- Terser minification
- Tree-shaking of unused code
- Gzip compression via web server

## Testing Architecture

### Test Structure

```
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx      # Unit tests
├── hooks/
│   ├── useChat.js
│   └── useChat.test.js
└── __tests__/
    └── integration.test.js  # Integration tests
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests
npm run test:e2e          # E2E tests
```

## Documentation Architecture

| Document | Purpose | Audience |
|----------|---------|----------|
| `README.md` | Project overview | Everyone |
| `SETUP_GUIDE.md` | Initial setup | New developers |
| `DEVELOPMENT.md` | Development practices | Developers |
| `CONTRIBUTING.md` | Contribution guidelines | Contributors |
| `ARCHITECTURE_SUMMARY.md` | System design | Architects |
| `DEPLOYMENT_GUIDE.md` | Deployment instructions | DevOps |
| App-specific README | App details | Feature owners |

## Monitoring & Observability

### Logging

```javascript
import { logger } from '@utils/logger'

logger.info('User action', { userId, action })
logger.error('Failed API call', { endpoint, error })
```

### Error Tracking

```javascript
try {
  await minimaxChat(messages)
} catch (error) {
  logger.error('Chat failed', { provider: 'minimax', error })
  // Switch to fallback provider
}
```

### Performance Monitoring

```javascript
const startTime = performance.now()
const result = await expensiveOperation()
const duration = performance.now() - startTime
logger.info('Operation completed', { duration })
```

## Design Principles

1. **Single Responsibility:** Each package has one clear purpose
2. **DRY (Don't Repeat Yourself):** Shared code lives in packages/
3. **Separation of Concerns:** Apps don't depend on each other
4. **Configuration as Code:** All settings in version control
5. **Progressive Enhancement:** Base functionality works, advanced features enhance
6. **Fail Gracefully:** Fallback providers, error handling
7. **Performance First:** Lazy loading, code splitting, caching
8. **Developer Experience:** Clear structure, good tooling, documentation

## Summary

This monorepo architecture provides:

✅ **Scalability** - Support 10+ applications easily  
✅ **Maintainability** - Shared config and packages reduce duplication  
✅ **Reliability** - Multi-provider AI resilience, comprehensive CI/CD  
✅ **Developer Experience** - Clear structure, good tooling, fast feedback  
✅ **Production Readiness** - Security, performance, monitoring built-in  
✅ **Portfolio Value** - Demonstrates enterprise engineering practices  

The structure is designed to be production-ready while remaining understandable for a portfolio context.
