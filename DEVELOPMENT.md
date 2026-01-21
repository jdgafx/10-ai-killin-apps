# Development Guide

This guide provides detailed information for developing within the AI Portfolio monorepo.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Setup](#development-setup)
3. [Working with Applications](#working-with-applications)
4. [Working with Shared Packages](#working-with-shared-packages)
5. [Common Development Tasks](#common-development-tasks)
6. [Debugging](#debugging)
7. [Performance Optimization](#performance-optimization)

## Project Structure

### Applications (`apps/`)

Each application is a standalone Vite + React project with its own:
- `src/` - Source code (components, hooks, utilities)
- `public/` - Static assets
- `index.html` - HTML entry point
- `package.json` - Project dependencies
- `vite.config.js` - Vite build configuration
- `.env.local` - Local environment variables
- `README.md` - Project documentation

```
app-01-ai-code-reviewer/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Business logic
│   ├── styles/          # CSS modules
│   ├── App.jsx
│   └── main.jsx
├── public/              # Static assets
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Shared Packages (`packages/`)

Reusable packages used across multiple applications:

#### `shared-ui/`
React components library with:
- Button, Card, Modal, Input components
- Common UI patterns
- Tailwind CSS styling

Usage:
```javascript
import { Button, Card } from '@shared/button'
```

#### `ai-providers/`
Unified AI provider abstraction supporting:
- MiniMax (primary)
- Google Gemini (secondary)
- DeepSeek (fallback)

Usage:
```javascript
import { minimaxChat, deepseekChat } from '@ai/providers'
import { useAIProvider } from '@ai/hooks'
```

#### `utils/`
Utility functions including:
- String manipulation (format, parse, validate)
- Array operations (chunk, flatten, unique)
- Object utilities (merge, pick, omit)
- API helpers (fetch, retry, error handling)
- Storage utilities (localStorage wrapper)

Usage:
```javascript
import { formatDate, validateEmail } from '@utils'
import { fetchJSON, retryFetch } from '@utils/api'
```

## Development Setup

### Initial Setup

```bash
# Clone and install
git clone <repository-url>
cd ai-portfolio-monorepo
npm install

# Verify setup
npm run type-check
npm run lint
```

### Environment Variables

Create `.env.local` in the root:

```bash
VITE_MINIMAX_API_KEY=sk-cp-...
VITE_DEEPSEEK_API_KEY=sk-...
VITE_GITHUB_COPILOT_TOKEN=ghp_...
VITE_GEMINI_CLIENT_ID=...
VITE_DEFAULT_PROVIDER=minimax
```

Each app can override with its own `.env.local`.

### VS Code Setup (Recommended)

Install extensions:
- ESLint
- Prettier - Code formatter
- Vite
- ES7+ React/Redux/React-Native snippets

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Working with Applications

### Running a Development Server

```bash
# Run specific app
npm run dev:app-01

# Run all apps (starts multiple servers)
npm run dev

# With custom port
cd apps/app-01-ai-code-reviewer
npm run dev -- --port 3001
```

### Project-Specific Development

```bash
# Install dependencies for specific app
npm install -w app-01-ai-code-reviewer

# Run scripts for specific app
npm run build --workspace=app-01-ai-code-reviewer
npm run lint --workspace=app-01-ai-code-reviewer
```

### Building for Production

```bash
# Build specific app
npm run build:app-01

# Build all apps
npm run build

# Preview production build
cd apps/app-01-ai-code-reviewer
npm run preview
```

### Project Structure Best Practices

Organize code in a scalable way:

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Modal.jsx
│   ├── features/         # Feature-specific components
│   │   ├── ReviewPanel/
│   │   └── CodeViewer/
│   └── layout/           # Layout components
│       ├── Header.jsx
│       └── Sidebar.jsx
├── hooks/
│   ├── useAIProvider.js
│   ├── useCodeReview.js
│   └── custom-hooks.js
├── lib/
│   ├── ai-providers/     # AI integration
│   ├── api/              # API utilities
│   └── utils/            # Helpers
├── styles/
│   ├── globals.css
│   └── variables.css
├── App.jsx
├── main.jsx
└── index.css
```

## Working with Shared Packages

### Using Shared UI Components

```javascript
import { Button, Card, Modal } from '@shared/ui'

export function MyComponent() {
  return (
    <Card>
      <h1>Title</h1>
      <Button onClick={() => {}}>Click me</Button>
    </Card>
  )
}
```

### Using AI Providers

```javascript
import { useAIProvider } from '@ai/hooks'

export function ChatComponent() {
  const { chat, streamChat, provider, setProvider } = useAIProvider()

  const handleChat = async (message) => {
    const response = await chat([
      { role: 'user', content: message }
    ])
    console.log(response)
  }

  return (
    <div>
      <select value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="minimax">MiniMax</option>
        <option value="deepseek">DeepSeek</option>
        <option value="gemini">Gemini</option>
      </select>
      <button onClick={() => handleChat('Hello')}>Chat</button>
    </div>
  )
}
```

### Using Utilities

```javascript
import { formatDate, validateEmail } from '@utils'
import { fetchJSON, retryFetch } from '@utils/api'

// Format dates
const formatted = formatDate(new Date(), 'YYYY-MM-DD')

// Validate input
if (!validateEmail(email)) {
  console.error('Invalid email')
}

// Fetch with retry
const data = await retryFetch('/api/data', { retries: 3 })
```

### Creating New Shared Components

1. Create component in `packages/shared-ui/src/components/`

```javascript
// packages/shared-ui/src/components/Button.jsx
import PropTypes from 'prop-types'

export default function Button({ children, onClick, variant = 'primary', ...props }) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
}
```

2. Export from `packages/shared-ui/src/index.ts`:

```typescript
export { default as Button } from './components/Button'
```

3. Use in any app:

```javascript
import { Button } from '@shared/ui'
```

## Common Development Tasks

### Adding a New Feature to an App

```bash
# 1. Create feature branch
git checkout -b feature/app-01-add-github-integration

# 2. Create necessary files
mkdir -p apps/app-01-ai-code-reviewer/src/components/GithubIntegration

# 3. Implement component
# (Edit files...)

# 4. Add tests
# (Create test files...)

# 5. Commit with conventional message
git add apps/app-01-ai-code-reviewer/
git commit -m "feat(app-01): Add GitHub repository integration"

# 6. Push frequently
git push origin feature/app-01-add-github-integration
```

### Updating Shared Package

```bash
# 1. Make changes to shared package
# (Edit files in packages/...)

# 2. Build the package
npm run build --workspace=ai-providers

# 3. Update apps that use it
# (No changes needed - workspaces link automatically)

# 4. Test in dependent app
npm run dev:app-01

# 5. Commit
git add packages/ai-providers/
git commit -m "feat(ai-providers): Add retry logic for API calls"
git push origin feature/improve-ai-providers
```

### Managing Dependencies

```bash
# Add to specific app
npm install axios --workspace=app-01-ai-code-reviewer

# Add to shared package
npm install react-markdown --workspace=shared-ui

# Add to root (dev dependencies)
npm install --save-dev vitest

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Debugging

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/apps/app-01-ai-code-reviewer/src",
      "sourceMaps": true
    }
  ]
}
```

### Browser DevTools

1. Open app in development mode: `npm run dev:app-01`
2. Press F12 to open DevTools
3. Use React DevTools extension for component inspection
4. Use Console for debugging
5. Use Network tab to inspect API calls

### Logging

```javascript
// Use console for development
console.log('Value:', value)
console.error('Error:', error)
console.warn('Warning:', warning)

// Use custom logger for production tracking
import { logger } from '@utils/logger'
logger.info('App initialized')
logger.error('Critical error', { context: errorDetails })
```

### Network Debugging

```bash
# Monitor API calls
# 1. Open DevTools → Network tab
# 2. Filter by XHR/Fetch
# 3. Inspect request/response

# Use cURL to test APIs
curl -X POST http://api.example.com/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

## Performance Optimization

### React Performance

```javascript
// ✅ Use memo for expensive components
import { memo } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>
})

// ✅ Use useCallback to prevent unnecessary re-renders
import { useCallback } from 'react'

function Component() {
  const handleClick = useCallback(() => {
    // Expensive operation
  }, [dependency])

  return <button onClick={handleClick}>Click</button>
}

// ✅ Use useMemo for expensive calculations
import { useMemo } from 'react'

function Component({ items }) {
  const sorted = useMemo(() => {
    return items.sort((a, b) => a.value - b.value)
  }, [items])

  return <div>{sorted.map(item => <div key={item.id}>{item.value}</div>)}</div>
}
```

### Bundle Size

```bash
# Analyze bundle size
npm run build:app-01
npx vite-bundle-visualizer apps/app-01-ai-code-reviewer/dist

# Check gzip size
npm install -g gzip-size-cli
gzip-size apps/app-01-ai-code-reviewer/dist/assets/*.js
```

### Code Splitting

```javascript
// ✅ Lazy load components
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}

// ✅ Lazy load routes
import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const ReviewPage = lazy(() => import('./pages/ReviewPage'))
const HomePage = lazy(() => import('./pages/HomePage'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### API Optimization

```javascript
// ✅ Debounce API calls
import { debounce } from '@utils'

const handleSearch = debounce((query) => {
  fetchSearchResults(query)
}, 300)

// ✅ Cancel previous requests
const abortController = new AbortController()

async function fetchData() {
  try {
    const response = await fetch('/api/data', {
      signal: abortController.signal
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled')
    }
  }
}

// Cancel if component unmounts
onCleanup(() => abortController.abort())
```

---

## Summary

This development guide covers:
- Monorepo structure and navigation
- Development environment setup
- Working with applications and packages
- Common development workflows
- Debugging techniques
- Performance optimization strategies

For additional help, refer to:
- `README.md` - Overview and quick start
- `CONTRIBUTING.md` - Contribution guidelines
- `SETUP_GUIDE.md` - Initial setup instructions
- `ai_portfolio_deployment_guide_comprehensive.md` - Deployment details

Happy coding! 🚀
