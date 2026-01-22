# AI Portfolio Monorepo

A comprehensive collection of **10 production-ready AI applications** showcasing full-stack engineering capabilities with modern web technologies and multi-provider AI integrations.

## 📁 Repository Structure

```
ai-portfolio-monorepo/
├── apps/                          # Application projects
│   ├── app-01-ai-code-reviewer/   # AI-Powered Code Reviewer
│   ├── app-02-document-chat/      # Intelligent Document Chat with RAG
│   ├── app-03-image-generator/    # AI Image Generation Studio
│   ├── app-04-voice-assistant/    # Voice-First AI Conversation
│   ├── app-05-code-explainer/     # Intelligent Code Explainer
│   ├── app-06-test-generator/     # Automated Test Generator
│   ├── app-07-api-integrator/     # Multi-Provider API Playground
│   ├── app-08-data-visualizer/    # AI Data Visualization
│   ├── app-09-autonomous-agent/   # Multi-Agent Orchestrator
│   └── app-10-rag-knowledge-base/ # RAG Knowledge Base System
├── packages/                      # Shared packages
│   ├── shared-ui/                 # Reusable React components
│   ├── ai-providers/              # Unified AI provider layer
│   └── utils/                     # Shared utility functions
├── config/                        # Shared configurations
│   ├── eslint/                    # ESLint rules
│   ├── prettier/                  # Prettier formatting
│   └── vite/                      # Vite build configuration
├── .github/workflows/             # CI/CD pipelines
├── package.json                   # Monorepo workspace configuration
├── .gitignore                     # Git exclusion rules
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-portfolio-monorepo.git
cd ai-portfolio-monorepo

# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Run all projects in development mode
npm run dev

# Run specific project
npm run dev:app-01    # AI Code Reviewer
npm run dev:app-02    # Document Chat
npm run dev:app-03    # Image Generator
# ... and so on

# Lint and format code
npm run lint
npm run lint:fix
npm run format
```

### Building

```bash
# Build all projects
npm run build

# Build specific project
npm run build:app-01
npm run build:app-02
# ... and so on

# Clean build artifacts
npm run clean
```

## 🎯 Applications Overview

### 1. **AI Code Reviewer** (`app-01-ai-code-reviewer`)
Automated code analysis and improvement suggestions using DeepSeek for code-specific models. Analyzes pull requests, identifies bugs, security issues, and suggests optimizations.

**Key Features:**
- GitHub repository integration
- Multi-language code support
- Security vulnerability detection
- Performance optimization suggestions

### 2. **Document Chat** (`app-02-document-chat`)
Intelligent document understanding with Retrieval-Augmented Generation (RAG). Upload documents and have conversations about their content.

**Key Features:**
- Multi-document support
- Vector embeddings with local storage
- Real-time semantic search
- Multi-provider AI responses

### 3. **Image Generator** (`app-03-image-generator`)
AI image generation and analysis studio with prompt engineering support. Generate, edit, and analyze images.

**Key Features:**
- Text-to-image generation
- Image analysis with Gemini Vision
- Prompt enhancement
- Gallery management

### 4. **Voice Assistant** (`app-04-voice-assistant`)
Real-time voice conversation platform using Web Speech API. Speak naturally to the AI and receive spoken responses.

**Key Features:**
- Speech-to-text transcription
- Text-to-speech synthesis
- Real-time audio streaming
- Multiple language support

### 5. **Code Explainer** (`app-05-code-explainer`)
Intelligent code documentation generator. Paste code to receive clear, comprehensive explanations.

**Key Features:**
- Multi-language code support
- Multiple explanation levels
- Dependency analysis
- Pattern recognition

### 6. **Test Generator** (`app-06-test-generator`)
Automated unit and integration test creation. Generate comprehensive test suites from code.

**Key Features:**
- Unit test generation
- Integration test creation
- Test coverage analysis
- Edge case identification

### 7. **API Integrator** (`app-07-api-integrator`)
Multi-provider API experimentation playground. Test APIs from various providers without SDK setup.

**Key Features:**
- API endpoint testing
- Request/response formatting
- Header management
- Multi-provider support

### 8. **Data Visualizer** (`app-08-data-visualizer`)
AI-enhanced data visualization and insights. Upload data and generate interactive charts with AI-powered analysis.

**Key Features:**
- Multiple chart types
- Real-time data transformation
- AI-powered insights
- Export capabilities

### 9. **Autonomous Agent** (`app-09-autonomous-agent`)
Multi-agent orchestration system. Complex task decomposition and parallel execution.

**Key Features:**
- Agent role specialization
- Task decomposition
- Parallel processing
- Multi-step reasoning

### 10. **RAG Knowledge Base** (`app-10-rag-knowledge-base`)
Advanced retrieval-augmented generation system. Create knowledge bases and ask complex questions.

**Key Features:**
- Knowledge base creation
- Semantic search
- Context-aware responses
- Batch document processing

## 🤖 AI Providers Configuration

The monorepo supports three AI providers for flexibility and fallback capabilities:

### Primary Provider: MiniMax
- **Base URL:** `https://api.minimax.chat/v1`
- **Models:** minimax-abab6.5 (chat), minimax-abab6.5s (reasoning), minimax-emb (embeddings)
- **API Key:** Set via `VITE_MINIMAX_API_KEY`

### Secondary Provider: Google Gemini
- **Base URL:** `https://generativelanguage.googleapis.com/v1beta`
- **Models:** gemini-2.0-flash-exp (chat), gemini-2.0-pro-exp (reasoning)
- **OAuth Client ID:** Set via `VITE_GEMINI_CLIENT_ID`

### Fallback Provider: DeepSeek
- **Base URL:** `https://api.deepseek.com`
- **Models:** deepseek-chat, deepseek-coder, deepseek-reasoner
- **API Key:** Set via `VITE_DEEPSEEK_API_KEY`

## 🌐 Deployment Platforms

All applications can be deployed to multiple platforms:

### Cloudflare Pages (Recommended)
- **Deployment:** GitHub integration or Wrangler CLI
- **Configuration:** `wrangler.toml` in each project
- **URL:** `https://your-app.pages.dev` or custom domain
- **Features:** Global CDN, Cloudflare Workers/Functions, Edge deployment, Automatic HTTPS
- **Functions:** API endpoints via `/functions` directory

### GitHub Pages
- **Deployment:** Automatic via GitHub Actions
- **Configuration:** `.github/workflows/deploy.yml`
- **URL:** `https://YOUR_USERNAME.github.io/PROJECT_NAME/`

### Coolify
- **Deployment:** Docker-based deployment
- **Configuration:** `Dockerfile` in each project
- **URL:** `https://PROJECT_NAME.YOUR_DOMAIN.com/`

## 🔧 Development Workflow

### Creating a Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/add-new-feature

# Make changes...
git add .
git commit -m "feat: Add new feature description"
git push origin feature/add-new-feature
```

### Commit Convention
Follow Conventional Commits format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Maintenance tasks
- `perf:` Performance improvements

### Code Quality
```bash
# Check for linting issues
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

## 📝 Environment Variables

Create a `.env.local` file in each project:

```bash
# AI Providers (Required)
VITE_MINIMAX_API_KEY=sk-cp-...
VITE_DEEPSEEK_API_KEY=sk-...
VITE_GITHUB_COPILOT_TOKEN=ghp_...

# Google Gemini OAuth (Optional)
VITE_GEMINI_CLIENT_ID=...apps.googleusercontent.com

# Feature Flags
VITE_ENABLE_RAG=true
VITE_ENABLE_VOICE=true
VITE_DEFAULT_PROVIDER=minimax
```

## 🏗️ Project Setup for New Applications

To add a new application to the monorepo:

```bash
# 1. Create project directory
mkdir -p apps/app-XX-project-name

# 2. Copy package.json template from another app
cp apps/app-01-ai-code-reviewer/package.json apps/app-XX-project-name/

# 3. Update package name
# Edit package.json and change name to "app-xx-project-name"

# 4. Create src directory
mkdir -p apps/app-XX-project-name/src

# 5. Copy vite config
cp config/vite/vite.config.base.js apps/app-XX-project-name/vite.config.js

# 6. Install dependencies
npm install
```

## 📦 Shared Packages

### `packages/shared-ui`
Common React components used across applications.
```bash
npm run dev --workspace=shared-ui
```

### `packages/ai-providers`
Unified AI provider layer with all three providers configured.
```bash
import { minimaxChat } from '@ai/minimax'
import { geminiChat } from '@ai/gemini'
import { deepseekChat } from '@ai/deepseek'
```

### `packages/utils`
Shared utility functions and helpers.
```bash
import { formatDate, parseJSON } from '@utils'
```

## 🔒 Security Best Practices

1. **Never commit secrets:** Use `.env.local` for local development
2. **GitHub Secrets:** Configure all API keys in GitHub repository settings
3. **Cloudflare Secrets:** Set environment variables in Pages dashboard or via Wrangler CLI
4. **Coolify Secrets:** Use Coolify's environment variable management
5. **Token rotation:** Regularly rotate API keys and tokens
6. **HTTPS only:** All deployments use HTTPS (automatic with Cloudflare)
7. **CORS configuration:** Properly configure CORS headers in Cloudflare Workers/Functions
8. **Input validation:** Always validate user input

## 📊 Monitoring and Analytics

Track deployments and performance:

```bash
# View build logs
npm run build -- --debug

# Check bundle size
npm run build -- --analyze

# Performance profiling
npm run dev -- --profile
```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make focused, incremental commits
3. Push changes frequently (after each meaningful change)
4. Create pull requests with clear descriptions
5. Ensure all checks pass before merging

## 📚 Documentation

Detailed implementation guides are available in:
- **`CLOUDFLARE_DEVELOPER_GUIDE.md`** - Complete Cloudflare Pages + Workers deployment guide
- **`DEPLOYMENT.md`** - Comprehensive deployment guide for all platforms
- **`ai_portfolio_deployment_guide_comprehensive.md`** - Complete deployment guide for all projects
- **Per-project READMEs** - Instructions in each `apps/*/README.md`
- **Configuration guides** - Details in `config/*/README.md`

## 🎓 Learning Resources

Each project demonstrates different AI engineering patterns:

- **RAG systems:** Document chat, knowledge base
- **Agentic workflows:** Autonomous agent, research agent
- **Code analysis:** Code reviewer, test generator
- **Multimodal AI:** Image generator, voice assistant
- **Real-time streaming:** Voice assistant, chat interfaces
- **Vector databases:** Document chat, knowledge base

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Build Failures
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## 📞 Support

For issues and questions:
1. Check existing documentation
2. Search GitHub issues
3. Create a new issue with detailed description
4. Include environment and reproduction steps

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] No linting errors
- [ ] Environment variables configured
- [ ] Secrets properly set in each platform
- [ ] Build succeeds locally
- [ ] Code reviewed and approved
- [ ] Changelog updated
- [ ] Version bumped if needed
- [ ] Documentation updated
- [ ] Performance benchmarks acceptable

## 🚀 Quick Deployment Summary

| Platform | Command | Time |
|----------|---------|------|
| **Cloudflare Pages** | `wrangler pages deploy dist --project-name=app` | ~1 min |
| **GitHub Pages** | `git push origin main` | ~2 min |
| **Coolify** | Push to main → automatic | ~3 min |

---

Built with ❤️ for the modern AI engineering portfolio.
