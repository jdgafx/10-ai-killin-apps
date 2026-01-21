# Comprehensive AI Portfolio Deployment Guide
## MiniMax, Google Gemini, DeepSeek + GitHub Pages + Vercel + Coolify

---

## Part 0: Monorepo Setup and Git Workflow

### 0.1 Monorepo Architecture Overview

This section establishes the foundational structure for managing all ten AI portfolio projects within a single Git repository using a monorepo architecture. The monorepo approach provides several significant advantages for portfolio development and deployment, including unified version control, simplified dependency management, atomic commits across projects, and streamlined CI/CD pipelines. Each of the ten projects will reside as a self-contained subdirectory within a unified `apps/` folder, allowing you to maintain clear project boundaries while benefiting from shared tooling configurations and consistent development practices across your entire portfolio.

The monorepo structure follows industry-standard patterns popularized by companies like Google, Meta, and Microsoft, demonstrating your familiarity with enterprise-scale development workflows. This architectural decision signals to potential employers that you understand the complexities of managing multiple projects at scale and can implement best practices for code organization, dependency management, and deployment automation. The structure also enables powerful cross-project refactoring capabilities and simplifies the process of extracting common components or utilities that can be shared across multiple applications.

The complete directory structure positions each project with its own isolated environment while maintaining shared configuration files at the repository root. This separation ensures that changes to one project do not inadvertently affect others, while still allowing you to maintain consistent tooling configurations, linting rules, and deployment pipelines across the entire portfolio. The structure also facilitates future expansion, making it straightforward to add additional projects or extract shared libraries as your portfolio grows.

```
ai-portfolio-monorepo/
├── .github/
│   └── workflows/
│       └── deploy-all.yml          # Global deployment workflows
├── apps/
│   ├── app-01-ai-code-reviewer/    # AI-Powered Code Reviewer
│   ├── app-02-document-chat/       # Intelligent Document Chat
│   ├── app-03-image-generator/     # AI Image Generator
│   ├── app-04-voice-assistant/     # Voice-Powered AI Assistant
│   ├── app-05-code-explainer/      # Intelligent Code Explainer
│   ├── app-06-test-generator/      # Automated Test Generator
│   ├── app-07-api-integrator/      # API Integration Playground
│   ├── app-08-data-visualizer/     # AI Data Visualization
│   ├── app-09-autonomous-agent/    # Multi-Agent Orchestrator
│   └── app-10-rag-knowledge-base/  # RAG Knowledge Base
├── packages/
│   ├── shared-ui/                  # Shared React components
│   ├── ai-providers/               # Unified AI provider layer
│   └── utils/                      # Shared utility functions
├── config/
│   ├── eslint/                     # ESLint configurations
│   ├── prettier/                   # Prettier configurations
│   └── vite/                       # Vite configurations
├── .gitignore
├── package.json                    # Root workspace configuration
└── README.md                       # Project documentation
```

### 0.2 Initial Repository Setup

The following step-by-step guide walks you through initializing the monorepo structure and establishing the Git workflow that will govern all portfolio development activities. These commands assume you are working on a fresh development environment and need to create the entire repository structure from scratch. Execute each command in sequence, paying close attention to the prompts and ensuring each step completes successfully before proceeding to the next.

The setup process begins with creating the repository root directory and initializing Git with appropriate configurations. These initial steps establish the foundation for your monorepo and ensure that Git is properly configured to track changes across all future projects. The global Git configuration settings ensure that your commits are properly attributed and that the repository maintains a clean, professional history throughout its lifetime.

```bash
# Step 1: Create the repository root directory
mkdir ai-portfolio-monorepo
cd ai-portfolio-monorepo

# Step 2: Configure Git identity (replace with your information)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Step 3: Initialize the Git repository
git init

# Step 4: Create the monorepo directory structure
mkdir -p apps/{app-01-ai-code-reviewer,app-02-document-chat,app-03-image-generator,app-04-voice-assistant,app-05-code-explainer,app-06-test-generator,app-07-api-integrator,app-08-data-visualizer,app-09-autonomous-agent,app-10-rag-knowledge-base}
mkdir -p packages/{shared-ui,ai-provers,utils}
mkdir -p config/{eslint,prettier,vite}
mkdir -p .github/workflows

# Step 5: Create the root package.json for workspace management
cat > package.json << 'EOF'
{
  "name": "ai-portfolio-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "echo 'Use npm run dev --workspace=app-name'",
    "build": "echo 'Use npm run build --workspace=app-name'",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "prettier": "^3.2.5"
  }
}
EOF

# Step 6: Create a comprehensive .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.local

# Environment files
.env
.env.local
.env.*.local

# IDE and editor settings
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Temporary files
tmp/
temp/
EOF

# Step 7: Create the initial README
cat > README.md << 'EOF'
# AI Portfolio Monorepo

A comprehensive collection of 10 production-ready AI applications demonstrating full-stack engineering capabilities.

## Projects

1. AI Code Reviewer - Automated code analysis and improvement suggestions
2. Document Chat - Intelligent document understanding and Q&A
3. Image Generator - AI-powered image creation and manipulation
4. Voice Assistant - Speech-enabled AI interactions
5. Code Explainer - Intelligent code documentation generation
6. Test Generator - Automated unit and integration test creation
7. API Integration Playground - Multi-provider API experimentation
8. Data Visualization - AI-enhanced data insights and charting
9. Autonomous Agent - Multi-agent orchestration system
10. RAG Knowledge Base - Retrieval-augmented generation system

## Tech Stack

- Frontend: React + Vite
- AI Providers: MiniMax, Google Gemini, DeepSeek
- Deployment: GitHub Pages, Vercel, Coolify

## Getting Started

See the comprehensive deployment guide for detailed instructions.
EOF

# Step 8: Stage all files and create the initial commit
git add .
git commit -m "Initial commit: Monorepo structure with 10 project directories"

# Step 9: Create the remote repository on GitHub (requires GitHub CLI or manual creation)
# Option A: Using GitHub CLI (install from https://cli.github.com/)
gh repo create ai-portfolio-monorepo --public --description "A comprehensive collection of 10 production-ready AI applications"

# Option B: Manual creation - visit https://github.com/new and create the repository first

# Step 10: Add the remote and push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/ai-portfolio-monorepo.git
git branch -M main
git push -u origin main
```

### 0.3 Git Workflow Philosophy: Push After Every Change

The cardinal rule governing all development activities in this monorepo is straightforward but transformative: **push to GitHub after each and every change**. This practice, while seemingly excessive to developers accustomed to batching commits, represents a fundamental shift toward continuous integration, transparent development, and reliable deployment pipelines. Understanding the rationale behind this rule and implementing it consistently will significantly enhance both your development experience and the professionalism of your portfolio.

Continuous deployment to GitHub Pages and Coolify depends entirely on your ability to maintain synchronization between your local repository and the remote GitHub repository. Both platforms monitor your GitHub repository for changes and automatically trigger deployment workflows whenever new commits appear. By pushing after every meaningful change, you ensure that your deployed applications always reflect your latest work, eliminating the frustrating gaps between local development and live deployment that plague many portfolio projects. This immediate feedback loop accelerates your development cycle and allows you to verify deployment configurations in real-time rather than discovering issues after pushing large batches of changes.

The psychological and workflow benefits of frequent commits extend far beyond deployment automation. Each commit creates a natural checkpoint, allowing you to experiment freely knowing that you can always roll back to a known good state. The discipline of committing after every change encourages smaller, more focused modifications that are easier to reason about, test, and review. This approach transforms the development process from a series of risky, high-stakes operations into a continuous flow of small, manageable improvements. When presenting your portfolio to potential employers, the commit history itself becomes evidence of your systematic approach to software development.

```bash
# Daily Development Workflow Example

# 1. Start by pulling any remote changes
git pull origin main

# 2. Create a feature branch for your current project
git checkout -b feature/add-api-integration

# 3. Make your first change (e.g., update configuration)
cd apps/app-07-api-integrator
echo "new configuration" >> config.json

# 4. Commit and push immediately
git add config.json
git commit -m "feat: Add API endpoint configuration for DeepSeek integration"
git push origin feature/add-api-integration

# 5. Make another change (e.g., update the UI)
echo "updated button" >> src/components/Button.jsx

# 6. Commit and push again
git add src/components/Button.jsx
git commit -m "fix: Update button styling for better accessibility"
git push origin feature/add-api-integration

# 7. When the feature is complete, merge to main
git checkout main
git pull origin main
git merge feature/add-api-integration
git push origin main
```

The automated deployment workflows configured in this repository will automatically detect new commits on the main branch and trigger deployments to GitHub Pages and Coolify. This automation means that your changes become visible to the world within minutes of being pushed, creating a truly continuous deployment pipeline. The transparency this provides is invaluable during portfolio development, as you can share working URLs with mentors, recruiters, or potential employers and know that they will see exactly what you have built, not an outdated version from days or weeks ago.

### 0.4 Branching Strategy and Commit Conventions

Maintaining a consistent branching strategy and commit message format enhances the professionalism of your repository and demonstrates familiarity with modern development practices. This section outlines the recommended workflow for managing changes across the ten projects in your portfolio while maintaining a clean, traceable history that showcases your engineering discipline to prospective employers.

The branching strategy follows a simplified GitFlow model adapted for the scale of a personal portfolio. The main branch always contains production-ready code that is actively deployed to all platforms. Feature branches are created for each discrete unit of work, whether that work spans a single project or involves changes to shared packages used across multiple applications. This approach ensures that the main branch remains stable while allowing you to experiment freely on feature branches without risking disruption to your deployed applications.

```bash
# Recommended branch naming conventions
# feature/project-name-description -> feature/app-01-add-code-review
# bugfix/project-name-issue -> bugfix/app-02-fix-chat-scroll
# chore/cleanup-description -> chore/update-dependencies
# docs/documentation-update -> docs/add-deployment-readme

# Creating a feature branch for a new project
git checkout main
git pull origin main
git checkout -b feature/app-10-setup-rag-system

# Making incremental changes with descriptive commits
git add apps/app-10-rag-knowledge-base/src/
git commit -m "feat(rag): Initialize vector database configuration"
git push origin feature/app-10-setup-rag-system

git add apps/app-10-rag-knowledge-base/src/
git commit -m "feat(rag): Implement document ingestion pipeline"
git push origin feature/app-10-setup-rag-system

# Merge when the feature is complete and tested
git checkout main
git merge feature/app-10-setup-rag-system
git push origin main
```

Commit messages should follow the Conventional Commits specification, which provides a structured format that communicates the nature of changes to both humans and automated tools. Each commit message begins with a type (feat, fix, chore, docs, style, refactor, test, or perf) followed by an optional scope in parentheses and a clear, concise description. This format enables automated changelog generation, helps you track progress across projects, and demonstrates your familiarity with industry-standard development practices.

---

## Document Overview

This comprehensive deployment guide provides implementation-ready instructions for deploying all ten high-traction AI portfolio projects using MiniMax as the primary AI provider, Google Gemini via OAuth authentication, and DeepSeek as a fallback option. Each project includes complete deployment instructions for GitHub Pages, Vercel, and Coolify platforms, enabling you to demonstrate full-stack engineering capabilities across multiple deployment environments.

The AI providers in this guide are configured as follows: MiniMax serves as the primary model with the provided API key, Google Gemini provides OAuth-authenticated access to Google's AI models without requiring API keys, and DeepSeek offers backup capabilities with its API key. This multi-provider architecture demonstrates production-grade resilience patterns that enterprise employers actively seek in AI engineering candidates.

All projects in this guide are designed to showcase production-ready AI engineering skills including vector database integration, real-time streaming interfaces, multimodal processing, autonomous agent orchestration, and secure API integration. By deploying these projects across all three platforms, you demonstrate not only AI implementation skills but also DevOps and infrastructure engineering capabilities that distinguish senior candidates from junior practitioners.

---

## Part 1: Global AI Provider Configuration

### 1.1 AI Provider Architecture

The portfolio projects implement a unified AI provider architecture that enables dynamic switching between MiniMax, Google Gemini, and DeepSeek based on task requirements and availability. This architecture demonstrates production-grade patterns for AI service resilience and cost optimization.

```javascript
// src/lib/ai-providers/index.js
/**
 * AI Provider Configuration
 * Primary: MiniMax (API Key)
 * Secondary: Google Gemini (OAuth)
 * Backup: DeepSeek (API Key)
 */

export const AI_PROVIDERS = {
  MINIMAX: 'minimax',
  GEMINI: 'gemini',
  DEEPSEEK: 'deepseek',
}

export const AI_MODELS = {
  [AI_PROVIDERS.MINIMAX]: {
    default: 'minimax-abab6.5',
    chat: 'minimax-abab6.5',
    reasoning: 'minimax-abab6.5s',
    embedding: 'minimax-emb',
  },
  [AI_PROVIDERS.GEMINI]: {
    default: 'gemini-2.0-flash-exp',
    chat: 'gemini-2.0-flash-exp',
    reasoning: 'gemini-2.0-pro-exp',
    vision: 'gemini-2.0-flash-exp',
  },
  [AI_PROVIDERS.DEEPSEEK]: {
    default: 'deepseek-chat',
    chat: 'deepseek-chat',
    coder: 'deepseek-coder',
    reasoning: 'deepseek-reasoner',
  },
}

// API Keys from environment variables
const CONFIG = {
  minimaxApiKey: import.meta.env.VITE_MINIMAX_API_KEY || 'sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw',
  deepseekApiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-dee6a5873cb1471b8ed2be7f1303359d',
  githubToken: import.meta.env.VITE_GITHUB_COPILOT_TOKEN || 'YOUR_GITHUB_TOKEN_HERE',
  geminiOAuthClientId: import.meta.env.VITE_GEMINI_CLIENT_ID,
  vercelToken: import.meta.env.VERCEL_TOKEN || 'fTMEClc5ZZ8z7ov1iE26R8JT',
}

export default CONFIG
```

### 1.2 MiniMax API Integration

```javascript
// src/lib/ai-providers/minimax.js
/**
 * MiniMax API Provider
 * Base URL: https://api.minimax.chat/v1
 */

const MINIMAX_BASE_URL = 'https://api.minimax.chat/v1'

export async function minimaxChat(messages, options = {}) {
  const { model = 'minimax-abab6.5', temperature = 0.7, maxTokens = 4096 } = options
  
  const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.minimaxApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_output_tokens: maxTokens,
      stream: options.stream || false,
    }),
  })

  if (!response.ok) {
    throw new Error(`MiniMax API Error: ${response.status}`)
  }

  return response.json()
}

export async function minimaxStreamChat(messages, onToken, options = {}) {
  const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.minimaxApiKey}`,
    },
    body: JSON.stringify({
      model: options.model || 'minimax-abab6.5',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature || 0.7,
      max_output_tokens: options.maxTokens || 4096,
      stream: true,
    }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.choices?.[0]?.delta?.content) {
            onToken(data.choices[0].delta.content)
          }
        } catch (e) {
          // Skip invalid JSON chunks
        }
      }
    }
  }
}

export async function minimaxEmbeddings(texts) {
  const response = await fetch(`${MINIMAX_BASE_URL}/text/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.minimaxApiKey}`,
    },
    body: JSON.stringify({
      model: 'minimax-emb',
      texts,
    }),
  })

  return response.json()
}
```

### 1.3 Google Gemini OAuth Integration

```javascript
// src/lib/ai-providers/gemini.js
/**
 * Google Gemini Provider via OAuth
 * No API key required - uses OAuth client-side authentication
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

let oauthToken = null

export async function initGeminiOAuth(clientId) {
  return new Promise((resolve, reject) => {
    // Load Google Identity Services
    if (!window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/generative-language',
          callback: (response) => {
            if (response.access_token) {
              oauthToken = response.access_token
              resolve(response)
            } else {
              reject(new Error('OAuth failed'))
            }
          },
        })
      }
      document.head.appendChild(script)
    } else {
      window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/generative-language',
        callback: (response) => {
          if (response.access_token) {
            oauthToken = response.access_token
            resolve(response)
          } else {
            reject(new Error('OAuth failed'))
          }
        },
      })
    }
  })
}

export async function geminiChat(messages, options = {}) {
  const { model = 'gemini-2.0-flash-exp', temperature = 0.7 } = options
  
  // Convert messages to Gemini format
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }))

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${model}:generateContent?key=`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oauthToken}`,
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  const data = await response.json()
  
  if (data.error) {
    throw new Error(`Gemini API Error: ${data.error.message}`)
  }

  return {
    choices: [{
      message: {
        role: 'assistant',
        content: data.candidates[0].content.parts[0].text,
      },
    }],
  }
}

export async function geminiStreamChat(messages, onToken, options = {}) {
  const { model = 'gemini-2.0-flash-exp' } = options
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }))

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${model}:streamGenerateContent?key=`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oauthToken}`,
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    try {
      const data = JSON.parse(chunk)
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        onToken(data.candidates[0].content.parts[0].text)
      }
    } catch (e) {
      // Skip invalid chunks
    }
  }
}

export async function geminiVision(imageBase64, prompt) {
  const { model = 'gemini-2.0-flash-exp' } = options
  
  const response = await fetch(
    `${GEMINI_API_BASE}/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oauthToken}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64.split(',')[1],
              },
            },
          ],
        }],
      }),
    }
  )

  return response.json()
}
```

### 1.4 DeepSeek Integration

```javascript
// src/lib/ai-providers/deepseek.js
/**
 * DeepSeek API Provider
 * Base URL: https://api.deepseek.com
 */

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

export async function deepseekChat(messages, options = {}) {
  const { model = 'deepseek-chat', temperature = 0.7, maxTokens = 4096 } = options
  
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.deepseekApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_tokens: maxTokens,
      stream: options.stream || false,
    }),
  })

  return response.json()
}

export async function deepseekStreamChat(messages, onToken, options = {}) {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.deepseekApiKey}`,
    },
    body: JSON.stringify({
      model: options.model || 'deepseek-chat',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4096,
      stream: true,
    }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.choices?.[0]?.delta?.content) {
            onToken(data.choices[0].delta.content)
          }
        } catch (e) {
          // Skip invalid chunks
        }
      }
    }
  }
}

export async function deepseekCoder(messages, options = {}) {
  return deepseekChat(messages, { ...options, model: 'deepseek-coder' })
}
```

### 1.5 Unified AI Provider Hook

```javascript
// src/hooks/useAIProvider.js
import { useState, useCallback } from 'react'
import { AI_PROVIDERS, AI_MODELS } from '../lib/ai-providers'
import { minimaxChat, minimaxStreamChat } from '../lib/ai-providers/minimax'
import { geminiChat, geminiStreamChat, initGeminiOAuth } from '../lib/ai-providers/gemini'
import { deepseekChat, deepseekStreamChat } from '../lib/ai-providers/deepseek'

export function useAIProvider() {
  const [provider, setProvider] = useState(AI_PROVIDERS.MINIMAX)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const chat = useCallback(async (messages, options = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const model = options.model || AI_MODELS[provider].default
      const result = await sendRequest(provider, 'chat', messages, { ...options, model })
      return result
    } catch (err) {
      // Try fallback providers
      if (provider === AI_PROVIDERS.MINIMAX) {
        try {
          return await deepseekChat(messages, options)
        } catch fallbackErr) {
          throw fallbackErr
        }
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [provider])

  const streamChat = useCallback(async (messages, onToken, options = {}) => {
    setIsLoading(true)
    
    const model = options.model || AI_MODELS[provider].default
    
    if (provider === AI_PROVIDERS.MINIMAX) {
      await minimaxStreamChat(messages, onToken, { ...options, model })
    } else if (provider === AI_PROVIDERS.GEMINI) {
      await geminiStreamChat(messages, onToken, { ...options, model })
    } else {
      await deepseekStreamChat(messages, onToken, { ...options, model })
    }
    
    setIsLoading(false)
  }, [provider])

  const switchProvider = useCallback((newProvider) => {
    setProvider(newProvider)
  }, [])

  return {
    provider,
    setProvider: switchProvider,
    chat,
    streamChat,
    isLoading,
    error,
    models: AI_MODELS,
  }
}
```

---

## Part 2: GitHub Pages Deployment Configuration

### 2.1 GitHub Actions Workflow Template (All Projects)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build for GitHub Pages
        run: npm run build
        env:
          VITE_MINIMAX_API_KEY: ${{ secrets.VITE_MINIMAX_API_KEY }}
          VITE_DEEPSEEK_API_KEY: ${{ secrets.VITE_DEEPSEEK_API_KEY }}
          VITE_GITHUB_COPILOT_TOKEN: ${{ secrets.VITE_GITHUB_COPILOT_TOKEN }}
          VITE_GEMINI_CLIENT_ID: ${{ secrets.VITE_GEMINI_CLIENT_ID }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2.2 Vite Configuration for GitHub Pages

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

### 2.3 Environment Variables for GitHub Pages

Create a `.env.example` file for all projects:

```bash
# AI Providers (Required)
VITE_MINIMAX_API_KEY=sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw
VITE_DEEPSEEK_API_KEY=sk-dee6a5873cb1471b8ed2be7f1303359d

# GitHub Integration (Required)
VITE_GITHUB_COPILOT_TOKEN=YOUR_GITHUB_TOKEN_HERE

# Google Gemini OAuth (Optional - for OAuth flow)
VITE_GEMINI_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com

# Feature Flags
VITE_ENABLE_RAG=true
VITE_ENABLE_VOICE=false
VITE_DEFAULT_PROVIDER=minimax
```

---

## Part 3: Vercel Deployment Configuration

### 3.1 Vercel Configuration File

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 3.2 Vercel Environment Variables

Add these in Vercel Project Settings → Environment Variables:

| Name | Value | Type |
|------|-------|------|
| VITE_MINIMAX_API_KEY | sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw | Secret |
| VITE_DEEPSEEK_API_KEY | sk-dee6a5873cb1471b8ed2be7f1303359d | Secret |
| VITE_GITHUB_COPILOT_TOKEN | YOUR_GITHUB_TOKEN_HERE | Secret |
| VITE_GEMINI_CLIENT_ID | (your Google OAuth Client ID) | Secret |
| VERCEL_TOKEN | fTMEClc5ZZ8z7ov1iE26R8JT | Secret |
| VERCEL_ORG_ID | (from Vercel Dashboard Settings) | Secret |
| VERCEL_PROJECT_ID | (from Vercel Project Settings) | Secret |

---

## Part 4: Coolify Deployment Configuration

### 4.1 Dockerfile Template (All Projects)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build arguments
ARG VITE_MINIMAX_API_KEY
ARG VITE_DEEPSEEK_API_KEY
ARG VITE_GITHUB_COPILOT_TOKEN
ARG VITE_GEMINI_CLIENT_ID

# Set environment variables for build
ENV VITE_MINIMAX_API_KEY=$VITE_MINIMAX_API_KEY
ENV VITE_DEEPSEEK_API_KEY=$VITE_DEEPSEEK_API_KEY
ENV VITE_GITHUB_COPILOT_TOKEN=$VITE_GITHUB_COPILOT_TOKEN
ENV VITE_GEMINI_CLIENT_ID=$VITE_GEMINI_CLIENT_ID

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 4.3 Coolify Environment Variables

Add these in Coolify Project → Environment Variables:

```
VITE_MINIMAX_API_KEY=sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw
VITE_DEEPSEEK_API_KEY=sk-dee6a5873cb1471b8ed2be7f1303359d
VITE_GITHUB_COPILOT_TOKEN=YOUR_GITHUB_TOKEN_HERE
VITE_GEMINI_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

---

## Part 5: Project 1 - Multi-Model AI Chat Platform with RAG

### 5.1 Project Structure

```
chat-rag/
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── DocumentUpload.jsx
│   │   ├── ProviderSelector.jsx
│   │   └── VectorSearchPanel.jsx
│   ├── lib/
│   │   ├── ai-providers/
│   │   │   ├── index.js
│   │   │   ├── minimax.js
│   │   │   ├── gemini.js
│   │   │   └── deepseek.js
│   │   ├── rag/
│   │   │   ├── vectorStore.js
│   │   │   ├── embeddings.js
│   │   │   └── retrieval.js
│   │   └── storage/
│   │       └── localStorage.js
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useAIProvider.js
│   │   └── useDocumentStore.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── vercel.json
├── Dockerfile
├── nginx.conf
└── .env.example
```

### 5.2 RAG Implementation

```javascript
// src/lib/rag/embeddings.js
import { minimaxEmbeddings } from '../ai-providers/minimax'

export async function generateEmbedding(text) {
  const result = await minimaxEmbeddings([text])
  return result.embeddings[0]
}

export async function generateEmbeddingsBatch(texts) {
  const result = await minimaxEmbeddings(texts)
  return result.embeddings
}
```

```javascript
// src/lib/rag/vectorStore.js
/**
 * Client-side Vector Store using localStorage
 * For production, replace with Pinecone/Weaviate
 */

class LocalVectorStore {
  constructor() {
    this.store = new Map()
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return
    
    const stored = localStorage.getItem('vectorStore')
    if (stored) {
      const data = JSON.parse(stored)
      Object.entries(data).forEach(([id, vector]) => {
        this.store.set(id, vector)
      })
    }
    this.initialized = true
  }

  async addDocument(id, text, embedding, metadata = {}) {
    await this.initialize()
    this.store.set(id, {
      text,
      embedding,
      metadata,
      timestamp: Date.now(),
    })
    this.persist()
  }

  async addDocuments(documents) {
    await this.initialize()
    for (const doc of documents) {
      const embedding = await generateEmbedding(doc.text)
      this.store.set(doc.id, {
        text: doc.text,
        embedding,
        metadata: doc.metadata || {},
        timestamp: Date.now(),
      })
    }
    this.persist()
  }

  async search(query, topK = 5) {
    await this.initialize()
    const queryEmbedding = await generateEmbedding(query)
    
    const results = []
    for (const [id, doc] of this.store) {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding)
      results.push({ id, ...doc, similarity })
    }
    
    results.sort((a, b) => b.similarity - a.similarity)
    return results.slice(0, topK)
  }

  persist() {
    const data = {}
    this.store.forEach((value, key) => {
      data[key] = value
    })
    localStorage.setItem('vectorStore', JSON.stringify(data))
  }

  clear() {
    this.store.clear()
    localStorage.removeItem('vectorStore')
  }
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export const vectorStore = new LocalVectorStore()
```

### 5.3 Chat Component

```jsx
// src/components/ChatWindow.jsx
import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import MessageBubble from './MessageBubble'
import ProviderSelector from './ProviderSelector'

export default function ChatWindow() {
  const { messages, sendMessage, isLoading, provider, setProvider } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const message = input
    setInput('')
    await sendMessage(message)
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">AI Chat with RAG</h1>
        <ProviderSelector 
          provider={provider} 
          onChange={setProvider}
        />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble 
            key={index}
            role={msg.role}
            content={msg.content}
            provider={msg.provider}
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <span className="animate-spin">◌</span>
            <span>AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
```

### 5.4 GitHub Pages Deployment Instructions

**Step 1: Repository Setup**
```bash
# Create repository on GitHub
# Clone locally
git clone https://github.com/YOUR_USERNAME/chat-rag.git
cd chat-rag
```

**Step 2: Initialize Project**
```bash
npm create vite@latest . -- --template react
npm install
npm install @vitejs/plugin-react react-router-dom framer-motion lucide-react
```

**Step 3: Create Files**
Copy the structure above with all components and hooks.

**Step 4: Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

**Step 5: Update vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 6: Create GitHub Actions Workflow**
Create `.github/workflows/deploy.yml` with the template from Section 2.1.

**Step 7: Push and Deploy**
```bash
git add .
git commit -m "Initial commit: Chat RAG platform"
git push origin main
```

**Step 8: Enable GitHub Pages**
1. Go to Repository Settings → Pages
2. Select "GitHub Actions" as source
3. Wait for workflow to complete
4. Access at `https://YOUR_USERNAME.github.io/chat-rag`

### 5.5 Vercel Deployment Instructions

**Step 1: Import to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Set Vercel token for authentication
export VERCEL_TOKEN=fTMEClc5ZZ8z7ov1iE26R8JT

# Deploy using token
vercel --token $VERCEL_TOKEN
```

**Step 2: Configure for Production**
```bash
# Set Vercel token
export VERCEL_TOKEN=fTMEClc5ZZ8z7ov1iE26R8JT

# Deploy to production with all environment variables
vercel --prod --token $VERCEL_TOKEN \
  --env VITE_MINIMAX_API_KEY=sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw \
  --env VITE_DEEPSEEK_API_KEY=sk-dee6a5873cb1471b8ed2be7f1303359d \
  --env VITE_GITHUB_COPILOT_TOKEN=YOUR_GITHUB_TOKEN_HERE
```

**Step 3: Configure Environment Variables in Vercel Dashboard**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.example`
3. Redeploy to apply changes

**Step 4: Custom Domain (Optional)**
1. Project Settings → Domains
2. Add your custom domain
3. Configure DNS records

### 5.6 Coolify Deployment Instructions

**Step 1: Prepare Server**
```bash
# SSH into your server
ssh deploy@YOUR_SERVER_IP

# Install Coolify (if not already installed)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

**Step 2: Create Coolify Project**
1. Access Coolify dashboard at `http://YOUR_SERVER_IP:8000`
2. Create new project: "chat-rag"
3. Connect GitHub repository

**Step 3: Configure Build Settings**
```
Build Pack: Dockerfile
Dockerfile: Dockerfile
Port: 80
```

**Step 4: Add Environment Variables**
```
VITE_MINIMAX_API_KEY=sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw
VITE_DEEPSEEK_API_KEY=sk-dee6a5873cb1471b8ed2be7f1303359d
VITE_GITHUB_COPILOT_TOKEN=YOUR_GITHUB_TOKEN_HERE
```

**Step 5: Deploy**
1. Click "Deploy" button
2. Wait for build and startup
3. Access at `http://chat-rag.YOUR_DOMAIN.com`

---

## Part 6: Project 2 - Autonomous Research Agent

### 6.1 Project Overview

The Research Agent breaks down complex topics into sub-queries, performs parallel research, and synthesizes comprehensive reports. This project demonstrates agentic workflows, parallel processing, and multi-step reasoning chains.

### 6.2 Core Implementation

```javascript
// src/lib/research-agent.js
import { minimaxChat } from './ai-providers/minimax'

class ResearchAgent {
  constructor() {
    this.maxDepth = 3
    this.maxSubqueries = 5
  }

  async research(topic, options = {}) {
    const { depth = 2, parallel = true } = options
    
    // Step 1: Decompose topic into sub-questions
    const subquestions = await this.decomposeTopic(topic, depth)
    
    // Step 2: Research each sub-question
    let findings = []
    if (parallel) {
      const results = await Promise.all(
        subquestions.map(q => this.researchSubquestion(q))
      )
      findings = results.flat()
    } else {
      for (const q of subquestions) {
        const result = await this.researchSubquestion(q)
        findings.push(...result)
      }
    }
    
    // Step 3: Synthesize findings into report
    const report = await this.synthesizeReport(topic, findings)
    
    return {
      topic,
      subquestions,
      findings,
      report,
      timestamp: new Date().toISOString(),
    }
  }

  async decomposeTopic(topic, depth) {
    const prompt = `
      You are a research planning agent. Break down the following topic into ${this.maxSubqueries} specific research questions.
      
      Topic: ${topic}
      Depth: ${depth}
      
      Return a JSON array of research questions:
      ["Question 1", "Question 2", ...]
    `
    
    const result = await minimaxChat([
      { role: 'system', content: 'You are a research planning assistant. Always respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ])
    
    try {
      return JSON.parse(result.choices[0].message.content)
    } catch {
      // Fallback: return topic as single question
      return [topic]
    }
  }

  async researchSubquestion(question) {
    const prompt = `
      Research the following question thoroughly. Provide detailed findings with sources.
      
      Question: ${question}
      
      Format as JSON array of findings:
      [
        {
          "finding": "Detailed finding description",
          "source": "Source URL or reference",
          "confidence": 0.95
        }
      ]
    `
    
    const result = await minimaxChat([
      { role: 'system', content: 'You are a research assistant. Provide accurate, sourced information. Respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ])
    
    try {
      return JSON.parse(result.choices[0].message.content)
    } catch {
      return [{ finding: question, source: 'Direct research', confidence: 0.5 }]
    }
  }

  async synthesizeReport(topic, findings) {
    const prompt = `
      Synthesize the following research findings into a comprehensive report about "${topic}".
      
      Findings: ${JSON.stringify(findings, null, 2)}
      
      Provide a well-structured report with:
      1. Executive Summary
      2. Key Findings (organized by theme)
      3. Conclusions
      4. Areas for Further Research
      
      Format as JSON:
      {
        "summary": "2-3 sentence summary",
        "findings": [{"theme": "...", "points": [...]}],
        "conclusions": [...],
        "future_research": [...]
      }
    `
    
    const result = await minimaxChat([
      { role: 'system', content: 'You are a research synthesis expert. Create clear, comprehensive reports. Respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ])
    
    try {
      return JSON.parse(result.choices[0].message.content)
    } catch {
      return { summary: topic, findings: [], conclusions: [], future_research: [] }
    }
  }
}

export const researchAgent = new ResearchAgent()
```

### 6.3 GitHub Pages Deployment

Same structure as Project 1 with:
- `src/lib/research-agent.js` for agent logic
- `src/components/ResearchForm.jsx` for topic input
- `src/components/ReportViewer.jsx` for report display
- `src/components/ProgressPanel.jsx` for research progress

### 6.4 Vercel Deployment

Follow Project 1 Vercel instructions. Add environment variables in Vercel dashboard.

### 6.5 Coolify Deployment

Follow Project 1 Coolify instructions. No special configuration needed beyond standard Vite build.

---

## Part 7: Project 3 - Generative UI Component Builder

### 7.1 Project Overview

Transforms natural language descriptions into React components with live preview. Demonstrates prompt engineering for code generation and real-time code execution.

### 7.2 Component Generator

```javascript
// src/lib/component-generator.js
import { deepseekCoder } from './ai-providers/deepseek'

const COMPONENT_SYSTEM_PROMPT = `
You are an expert React developer. Generate clean, modern React components using Tailwind CSS.

Rules:
1. Use functional components with hooks when needed
2. Use Tailwind CSS for all styling
3. Include proper TypeScript types if applicable
4. Make components accessible (aria attributes, keyboard navigation)
5. Handle edge cases and loading states
6. Export as default function

Respond with valid JSON only:
{
  "code": "complete component code",
  "dependencies": ["react", "lucide-react", etc.],
  "description": "what the component does"
}
`

export async function generateComponent(description, options = {}) {
  const prompt = `
    Generate a React component for: "${description}"
    
    Framework: React + Tailwind CSS
    ${options.includeTypes ? 'TypeScript: Yes' : 'TypeScript: No'}
    
    ${COMPONENT_SYSTEM_PROMPT}
  `
  
  const result = await deepseekCoder([
    { role: 'system', content: COMPONENT_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ])
  
  try {
    return JSON.parse(result.choices[0].message.content)
  } catch {
    return {
      code: `// Failed to generate component for: ${description}`,
      dependencies: [],
      description: 'Generation failed',
    }
  }
}
```

### 7.3 Live Preview Component

```jsx
// src/components/LivePreview.jsx
import { useState, useEffect, useRef } from 'react'

export default function LivePreview({ code }) {
  const iframeRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!iframeRef.current || !code) return
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${code}
          </script>
        </body>
      </html>
    `
    
    iframeRef.current.srcdoc = html
    setError(null)
  }, [code])

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="ml-2 text-sm text-gray-600">Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-96"
        sandbox="allow-scripts"
        title="Component Preview"
      />
      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
```

### 7.4 Deployment Instructions

All three platforms follow the standard pattern from Project 1. No special configuration needed.

---

## Part 8: Project 4 - AI-Powered SQL Query Generator

### 8.1 Project Overview

Converts natural language to SQL queries with schema introspection, query execution, and visualization. Demonstrates secure database access patterns and data visualization.

### 8.2 SQL Generator Implementation

```javascript
// src/lib/sql-generator.js
import { minimaxChat } from './ai-providers/minimax'

const SQL_SYSTEM_PROMPT = `
You are an expert SQL developer. Generate accurate, optimized SQL queries based on natural language requests.

Rules:
1. Use parameterized queries to prevent SQL injection
2. Include proper JOIN conditions
3. Use appropriate indexes and optimize for performance
4. Handle NULL values safely
5. Use standard SQL syntax (PostgreSQL compatible)

Response format:
{
  "query": "SELECT * FROM users WHERE id = ?",
  "parameters": [1],
  "explanation": "This query retrieves all columns from the users table where the id matches the parameter",
  "warning": "Any caveats or performance considerations"
}
`

export async function generateSQL(question, schema) {
  const prompt = `
    Convert this natural language request to SQL:
    "${question}"
    
    Database Schema:
    ${JSON.stringify(schema, null, 2)}
    
    ${SQL_SYSTEM_PROMPT}
  `
  
  const result = await minimaxChat([
    { role: 'system', content: SQL_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ])
  
  try {
    return JSON.parse(result.choices[0].message.content)
  } catch {
    return {
      query: '-- Failed to generate SQL',
      parameters: [],
      explanation: 'Generation failed',
      warning: null,
    }
  }
}
```

### 8.3 Schema Introspection

```javascript
// src/lib/schema-introspection.js
export async function getSchemaFromSQL(sql) {
  // Parse SQL to extract table names and relationships
  const tables = []
  const createTableRegex = /CREATE TABLE\s+(\w+)/gi
  let match
  
  while ((match = createTableRegex.exec(sql)) !== null) {
    tables.push(match[1])
  }
  
  return {
    tables,
    raw: sql,
  }
}

export function describeSchema(schema) {
  // Convert schema to natural language description
  if (typeof schema === 'string') {
    return `Database with schema: ${schema}`
  }
  
  return `Database with ${schema.tables?.length || 0} tables`
}
```

### 8.4 Deployment Instructions

All three platforms follow the standard pattern. For GitHub Pages, API calls must route to a backend (Coolify recommended) for database security.

---

## Part 9: Project 5 - Voice-First AI Conversation Platform

### 9.1 Project Overview

Real-time voice conversation using Web Speech API for STT/TTS, connected to MiniMax for AI responses. Demonstrates multimodal integration and real-time audio streaming.

### 9.2 Voice Integration

```javascript
// src/lib/voice-processor.js
export class VoiceProcessor {
  constructor() {
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.isRecording = false
  }

  initialize() {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
    }
  }

  startRecording(onResult, onError) {
    if (!this.recognition) {
      onError('Speech recognition not supported')
      return
    }
    
    this.isRecording = true
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      onResult(transcript)
    }
    
    this.recognition.onerror = (event) => {
      onError(event.error)
    }
    
    this.recognition.start()
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop()
    }
    this.isRecording = false
  }

  speak(text) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = resolve
      utterance.onerror = reject
      this.synthesis.speak(utterance)
    })
  }
}
```

### 9.3 Deployment Considerations

**GitHub Pages**: Voice features require HTTPS and microphone permissions. Works on supported browsers.
**Vercel**: Standard deployment with voice processing in client.
**Coolify**: Standard Docker deployment.

---

## Part 10: Project 6 - AI Document Processing System

### 10.1 Project Overview

Processes PDF and text documents with summarization, keyword extraction, and sentiment analysis using Google Gemini's large context window.

### 10.2 Document Processor

```javascript
// src/lib/document-processor.js
import { geminiChat } from './ai-providers/gemini'

export async function processDocument(documentContent, options = {}) {
  const { mode = 'full' } = options
  
  const prompts = {
    summary: 'Provide a concise 3-5 sentence summary of this document.',
    keywords: 'Extract 10-15 key terms and phrases from this document.',
    sentiment: 'Analyze the sentiment and tone of this document.',
    full: `
      Analyze this document comprehensively:
      1. Summary (3-5 sentences)
      2. Key Themes (5-7 bullet points)
      3. Keywords (10-15 terms)
      4. Sentiment Analysis
      5. Document Type Classification
      6. Key Entities (people, organizations, dates)
    `,
  }
  
  const result = await geminiChat([
    { role: 'user', content: `${prompts[mode] || prompts.full}\n\nDocument:\n${documentContent}` },
  ])
  
  return result.choices[0].message.content
}
```

### 10.3 PDF Text Extraction

```javascript
// src/lib/pdf-extractor.js
export async function extractTextFromPDF(file) {
  // For client-side PDF extraction, use pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist')
  
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  let fullText = ''
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => item.str).join(' ')
    fullText += pageText + '\n'
  }
  
  return fullText
}
```

### 10.4 Deployment Instructions

All three platforms support document upload with appropriate file size limits (10MB recommended for GitHub Pages).

---

## Part 11: Project 7 - AI Code Review Assistant

### 11.1 Project Overview

Connects to GitHub repositories using the provided Copilot token, fetches pull requests, and generates AI-powered code reviews with specific feedback.

### 11.2 GitHub Integration

```javascript
// src/lib/github-integration.js
import { Octokit } from '@octokit/rest'

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_COPILOT_TOKEN || 'YOUR_GITHUB_TOKEN_HERE'

export const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

export async function fetchPullRequest(owner, repo, pullNumber) {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  })
  
  return data
}

export async function fetchPRDiff(owner, repo, pullNumber) {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: { format: 'diff' },
  })
  
  return data
}

export async function fetchChangedFiles(owner, repo, pullNumber) {
  const { data } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  })
  
  return data
}

export async function postReviewComment(owner, repo, pullNumber, body, commitId, path, line) {
  const { data } = await octokit.pulls.createReviewComment({
    owner,
    repo,
    pull_number: pullNumber,
    body,
    commit_id: commitId,
    path,
    line,
  })
  
  return data
}
```

### 11.3 Code Review Generator

```javascript
// src/lib/code-review.js
import { deepseekCoder } from './ai-providers/deepseek'

export async function generateCodeReview(diff, language = 'javascript') {
  const prompt = `
    Review the following code changes and provide constructive feedback.
    
    Language: ${language}
    Changes:
    ${diff}
    
    Provide feedback in this JSON format:
    {
      "summary": "Overall assessment",
      "issues": [
        {
          "severity": "error|warning|info",
          "file": "filename",
          "line": lineNumber,
          "message": "description",
          "suggestion": "improvement recommendation"
        }
      ],
      "positives": ["what's done well"],
      "security_concerns": ["potential security issues"],
      "performance_notes": ["performance considerations"]
    }
  `
  
  const result = await deepseekCoder([
    { role: 'system', content: 'You are a senior code reviewer. Be constructive and thorough.' },
    { role: 'user', content: prompt },
  ])
  
  try {
    return JSON.parse(result.choices[0].message.content)
  } catch {
    return {
      summary: 'Review generation failed',
      issues: [],
      positives: [],
      security_concerns: [],
      performance_notes: [],
    }
  }
}
```

### 11.4 Deployment Instructions

All three platforms support GitHub integration. API calls use the provided token for authentication.

---

## Part 12: Project 8 - Multimodal Image Generation Studio

### 12.1 Project Overview

Prompt engineering interface for image generation with gallery management. Uses Gemini Vision for image analysis when needed.

### 12.2 Image Analysis

```javascript
// src/lib/image-analyzer.js
import { geminiVision } from './ai-providers/gemini'

export async function analyzeImage(imageBase64, prompt = 'Describe this image in detail') {
  return geminiVision(imageBase64, prompt)
}

export async function generateImagePrompt(idea) {
  const prompt = `
    Expand this image idea into a detailed prompt suitable for AI image generation:
    
    Original idea: ${idea}
    
    Provide:
    1. Enhanced prompt (100-200 words)
    2. Style recommendations
    3. Color palette suggestions
    4. Technical parameters (aspect ratio, quality indicators)
  `
  
  const result = await minimaxChat([
    { role: 'user', content: prompt },
  ])
  
  return result.choices[0].message.content
}
```

### 12.3 Gallery Component

```jsx
// src/components/ImageGallery.jsx
export default function ImageGallery({ images }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4">
      {images.map((image) => (
        <div key={image.id} className="break-inside-avoid mb-4">
          <div className="relative group">
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4">
              <p className="text-white text-sm">{image.prompt}</p>
              <div className="mt-2 flex gap-2">
                <button className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                  Download
                </button>
                <button className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 12.4 Deployment Instructions

All three platforms support image gallery functionality. Use object storage (S3, Cloudinary) for production image hosting.

---

## Part 13: Project 9 - Sentiment Analysis Dashboard

### 13.1 Project Overview

Real-time sentiment analysis with visualization charts and trend analysis over time.

### 13.2 Sentiment Analyzer

```javascript
// src/lib/sentiment-analyzer.js
import { minimaxChat } from './ai-providers/minimax'

export async function analyzeSentiment(text) {
  const prompt = `
    Analyze the sentiment of this text. Respond with JSON only:
    {
      "sentiment": "positive|negative|neutral",
      "confidence": 0.95,
      "emotions": ["joy", "frustration", etc],
      "key_phrases": ["phrase1", "phrase2"]
    }
    
    Text: ${text}
  `
  
  const result = await minimaxChat([
    { role: 'system', content: 'You are a sentiment analysis expert. Respond with valid JSON only.' },
    { role: 'user', content: prompt },
  ])
  
  try {
    return JSON.parse(result.choices[0].message.content)
  } catch {
    return { sentiment: 'neutral', confidence: 0.5, emotions: [], key_phrases: [] }
  }
}

export async function batchAnalyzeSentiment(texts) {
  const results = await Promise.all(texts.map(t => analyzeSentiment(t)))
  return results
}
```

### 13.3 Dashboard Component

```jsx
// src/components/SentimentChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SentimentChart({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="sentiment" 
            stroke="#8884d8" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### 13.4 Deployment Instructions

All three platforms support chart visualization using Recharts or similar library.

---

## Part 14: Project 10 - Academic Paper Simplifier

### 14.1 Project Overview

Multi-level explanations of academic papers using hierarchical simplification.

### 14.2 Paper Simplifier

```javascript
// src/lib/paper-simplifier.js
import { minimaxChat } from './ai-providers/minimax'

export async function simplifyPaper(paperContent, level = 'intermediate') {
  const levels = {
    simple: 'Explain like I\'m 5 years old. Use simple words and analogies.',
    intermediate: 'Explain for a college student in a related but different field.',
    advanced: 'Explain for an expert in the field.',
    technical: 'Provide technical details with mathematical notation where appropriate.',
  }
  
  const prompt = `
    Simplify this academic content at level: ${level}
    
    Level description: ${levels[level]}
    
    Content:
    ${paperContent.slice(0, 15000)} ${paperContent.length > 15000 ? '...(truncated)' : ''}
    
    Provide:
    1. Simplified explanation
    2. Key takeaways (3-5 bullet points)
    3. Questions for deeper understanding
    4. Related concepts to explore
  `
  
  const result = await minimaxChat([
    { role: 'user', content: prompt },
  ])
  
  return result.choices[0].message.content
}

export async function answerPaperQuestion(paperContent, question) {
  const prompt = `
    Based on this paper, answer the following question:
    
    Question: ${question}
    
    Paper content:
    ${paperContent.slice(0, 15000)}
    
    Provide a detailed answer with citations to specific sections if possible.
  `
  
  const result = await minimaxChat([
    { role: 'user', content: prompt },
  ])
  
  return result.choices[0].message.content
}
```

### 14.3 Deployment Instructions

All three platforms support paper simplification. Large papers may require chunking for GitHub Pages due to memory constraints.

---

## Part 15: Quick Reference Summary

### 15.1 Deployment URLs

After deployment, your projects will be accessible at:

| Platform | URL Pattern |
|----------|-------------|
| GitHub Pages | `https://YOUR_USERNAME.github.io/REPO_NAME/` |
| Vercel | `https://PROJECT_NAME.vercel.app/` |
| Coolify | `https://PROJECT_NAME.YOUR_DOMAIN.com/` |

### 15.2 Environment Variables Summary

| Variable | Value | Required For |
|----------|-------|--------------|
| VITE_MINIMAX_API_KEY | sk-cp-Avxj5o7NA3UDyU-c5pbagf0X9ac_eTRlEAkLxPr1Kc-u2mytyb5CgmL3NaIvboJ6ZWX-8DCChZ9AotiwFDX5bsIyyhDu4K5yeqNBThmdu17C8kr7yRLETlw | All AI features |
| VITE_DEEPSEEK_API_KEY | sk-dee6a5873cb1471b8ed2be7f1303359d | Fallback AI |
| VITE_GITHUB_COPILOT_TOKEN | YOUR_GITHUB_TOKEN_HERE | GitHub integration |
| VITE_GEMINI_CLIENT_ID | (from Google Cloud Console) | Gemini OAuth |
| VERCEL_TOKEN | fTMEClc5ZZ8z7ov1iE26R8JT | Vercel CLI deployment |

### 15.3 Build Commands

**All Projects - GitHub Pages:**
```bash
npm run build
# Output: dist/ folder
```

**All Projects - Vercel:**
```bash
vercel --prod
```

**All Projects - Coolify:**
```bash
docker build -t project-name .
docker run -p 80:80 project-name
```

---

## Conclusion

This comprehensive deployment guide provides complete implementation instructions for all ten AI portfolio projects using MiniMax, Google Gemini, and DeepSeek as AI providers, deployed across GitHub Pages, Vercel, and Coolify platforms. Each project section includes source code, configuration files, and step-by-step deployment instructions sufficient for handing off to an LLM or implementing directly.

The multi-provider AI architecture demonstrates production-grade resilience patterns, while the three-platform deployment strategy showcases full-stack engineering capabilities across different infrastructure paradigms. Deploying these projects successfully and documenting your work in portfolio presentations will demonstrate the comprehensive skill set that senior AI engineering positions require.