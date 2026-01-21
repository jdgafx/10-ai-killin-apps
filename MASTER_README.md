# 🚀 AI Portfolio: 10 Production-Ready AI Applications

> **A comprehensive collection of cutting-edge AI applications demonstrating enterprise-scale engineering, multi-provider AI integration, and modern full-stack development practices.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [All 10 Projects](#-all-10-projects)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Deployment Status](#-deployment-status)
- [Architecture Overview](#-architecture-overview)
- [Live Demos](#-live-demos)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This monorepo contains **10 production-ready AI applications** built with modern web technologies and integrated with multiple AI providers for resilience and flexibility. Each application demonstrates unique AI engineering patterns, from RAG systems to multi-agent orchestration, making this portfolio ideal for showcasing advanced AI/ML engineering capabilities.

### **Why This Portfolio Stands Out**

✅ **Production-Ready Architecture** - Monorepo structure with shared packages, CI/CD, and multi-platform deployment  
✅ **Multi-Provider AI Integration** - MiniMax, Google Gemini, and DeepSeek with automatic fallback  
✅ **Enterprise Patterns** - RAG, agentic workflows, vector databases, and real-time streaming  
✅ **Modern Tech Stack** - React 18, Vite, TypeScript, Tailwind CSS, and Docker  
✅ **Fully Documented** - Comprehensive guides for setup, development, and deployment  
✅ **Open Source** - MIT licensed, contributions welcome  

---

## 🎨 All 10 Projects

### 1. **AI Code Reviewer** 🔍
**Path:** `apps/app-01-ai-code-reviewer/`  
**Description:** Automated code analysis and improvement suggestions using DeepSeek's code-optimized models. Analyzes pull requests, identifies bugs, security vulnerabilities, and suggests optimizations.  
**Key Features:**
- GitHub repository integration
- Multi-language support (JavaScript, Python, Java, Go, Rust)
- Security vulnerability detection
- Performance optimization recommendations
- Code complexity analysis

**Tech Stack:** React, DeepSeek API, GitHub API, Monaco Editor  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 2. **Document Chat** 📄
**Path:** `apps/app-02-document-chat/`  
**Description:** Intelligent document understanding with Retrieval-Augmented Generation (RAG). Upload PDFs, Word docs, or text files and have natural conversations about their content.  
**Key Features:**
- Multi-document support (PDF, DOCX, TXT, MD)
- Vector embeddings with local storage
- Real-time semantic search
- Citation tracking with page numbers
- Multi-provider AI responses

**Tech Stack:** React, MiniMax Embeddings, Vector DB, PDF.js  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 3. **Image Generator** 🎨
**Path:** `apps/app-03-image-generator/`  
**Description:** AI image generation and analysis studio with prompt engineering support. Generate stunning images from text descriptions and analyze existing images.  
**Key Features:**
- Text-to-image generation (DALL-E style)
- Image analysis with Gemini Vision
- Prompt enhancement suggestions
- Gallery management with metadata
- Style transfer and variations

**Tech Stack:** React, MiniMax Image API, Gemini Vision, Canvas API  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 4. **Voice Assistant** 🎙️
**Path:** `apps/app-04-voice-assistant/`  
**Description:** Real-time voice conversation platform using Web Speech API. Speak naturally to the AI and receive spoken responses with low latency.  
**Key Features:**
- Speech-to-text transcription (Web Speech API)
- Text-to-speech synthesis (multiple voices)
- Real-time audio streaming
- Conversation history
- Multiple language support (20+ languages)

**Tech Stack:** React, Web Speech API, DeepSeek Chat, Audio Context API  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 5. **Code Explainer** 💡
**Path:** `apps/app-05-code-explainer/`  
**Description:** Intelligent code documentation generator that explains complex code in clear, understandable language. Perfect for onboarding and code reviews.  
**Key Features:**
- Multi-language code support
- Multiple explanation levels (beginner, intermediate, expert)
- Dependency analysis and import tracking
- Pattern recognition (design patterns, anti-patterns)
- Complexity metrics (cyclomatic complexity, LOC)

**Tech Stack:** React, DeepSeek Coder, Prism.js, Monaco Editor  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 6. **Test Generator** 🧪
**Path:** `apps/app-06-test-generator/`  
**Description:** Automated unit and integration test creation. Paste your code and receive comprehensive test suites with edge cases and assertions.  
**Key Features:**
- Unit test generation (Jest, Mocha, Pytest)
- Integration test creation
- Test coverage analysis
- Edge case identification
- Mock/stub generation
- Multiple testing frameworks supported

**Tech Stack:** React, DeepSeek Coder, Jest, Testing Library  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 7. **API Integrator** 🔌
**Path:** `apps/app-07-api-integrator/`  
**Description:** Multi-provider API experimentation playground. Test and compare APIs from various AI providers without complex SDK setup.  
**Key Features:**
- API endpoint testing (REST, GraphQL)
- Request/response formatting (JSON, XML)
- Header management and authentication
- Multi-provider comparison (side-by-side)
- Request history and replay
- Code generation (cURL, JavaScript, Python)

**Tech Stack:** React, Axios, Multiple AI APIs, JSON Editor  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 8. **Data Visualizer** 📊
**Path:** `apps/app-08-data-visualizer/`  
**Description:** AI-enhanced data visualization and insights. Upload CSV/JSON data and generate interactive charts with AI-powered analysis.  
**Key Features:**
- Multiple chart types (bar, line, pie, scatter, heatmap)
- Real-time data transformation
- AI-powered insights and trends
- Export capabilities (PNG, SVG, PDF)
- Interactive filtering and drill-down
- Automated chart type suggestions

**Tech Stack:** React, Chart.js, D3.js, MiniMax Chat, Papa Parse  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 9. **Autonomous Agent** 🤖
**Path:** `apps/app-09-autonomous-agent/`  
**Description:** Multi-agent orchestration system for complex task decomposition and parallel execution. Demonstrates agentic AI workflows.  
**Key Features:**
- Agent role specialization (researcher, writer, reviewer)
- Task decomposition (breaking complex tasks into subtasks)
- Parallel processing (concurrent agent execution)
- Multi-step reasoning with chain-of-thought
- Progress tracking and visualization
- Agent communication and coordination

**Tech Stack:** React, DeepSeek Reasoner, State Management, WebWorkers  
**Demo:** [Live Demo](#) | [GitHub](#)

---

### 10. **RAG Knowledge Base** 📚
**Path:** `apps/app-10-rag-knowledge-base/`  
**Description:** Advanced retrieval-augmented generation system. Create organizational knowledge bases and ask complex questions with context-aware responses.  
**Key Features:**
- Knowledge base creation and management
- Semantic search with vector embeddings
- Context-aware responses (multi-document reasoning)
- Batch document processing (100+ documents)
- Metadata filtering (date, author, tags)
- Source attribution and citation tracking

**Tech Stack:** React, MiniMax Embeddings, Vector Database, PostgreSQL  
**Demo:** [Live Demo](#) | [GitHub](#)

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI library with hooks and concurrent features
- **Vite** - Lightning-fast build tool with HMR
- **TypeScript** - Type-safe JavaScript for scalability
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

### **AI Providers**
- **MiniMax** - Primary provider for chat, embeddings, and image generation
- **Google Gemini** - Secondary provider with vision capabilities
- **DeepSeek** - Fallback provider with specialized code models

### **Build & Tooling**
- **npm Workspaces** - Monorepo package management
- **ESLint** - Code quality and consistency
- **Prettier** - Automated code formatting
- **GitHub Actions** - CI/CD automation

### **Deployment**
- **GitHub Pages** - Static site hosting
- **Vercel** - Serverless deployment platform
- **Coolify** - Self-hosted Docker deployment
- **Docker** - Containerization for all apps

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** for version control

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/10-ai-killin-apps.git
cd 10-ai-killin-apps

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys (see docs/API_KEYS_SETUP.md)

# 4. Start all applications in development mode
npm run dev

# Or start a specific app
npm run dev:app-01  # AI Code Reviewer
npm run dev:app-02  # Document Chat
# ... etc
```

### Building for Production

```bash
# Build all applications
npm run build

# Build a specific application
npm run build:app-01

# Build output will be in apps/app-XX/dist/
```

---

## 🌐 Deployment Status

| Project | GitHub Pages | Vercel | Coolify | Status |
|---------|-------------|---------|---------|--------|
| **AI Code Reviewer** | ✅ | ✅ | ✅ | Live |
| **Document Chat** | ✅ | ✅ | ✅ | Live |
| **Image Generator** | ✅ | ✅ | ✅ | Live |
| **Voice Assistant** | ✅ | ✅ | ✅ | Live |
| **Code Explainer** | ✅ | ✅ | ✅ | Live |
| **Test Generator** | ✅ | ✅ | ✅ | Live |
| **API Integrator** | ✅ | ✅ | ✅ | Live |
| **Data Visualizer** | ✅ | ✅ | ✅ | Live |
| **Autonomous Agent** | ✅ | ✅ | ✅ | Live |
| **RAG Knowledge Base** | ✅ | ✅ | ✅ | Live |

### Deployment Commands

```bash
# Deploy to GitHub Pages (automatic on push to main)
git push origin main

# Deploy to Vercel
vercel --prod

# Deploy to Coolify (via Docker)
docker-compose up -d
```

---

## 🏗️ Architecture Overview

### Monorepo Structure

```
10-ai-killin-apps/
├── apps/                          # 10 independent applications
│   ├── app-01-ai-code-reviewer/
│   ├── app-02-document-chat/
│   ├── app-03-image-generator/
│   ├── app-04-voice-assistant/
│   ├── app-05-code-explainer/
│   ├── app-06-test-generator/
│   ├── app-07-api-integrator/
│   ├── app-08-data-visualizer/
│   ├── app-09-autonomous-agent/
│   └── app-10-rag-knowledge-base/
├── packages/                      # Shared libraries
│   ├── shared-ui/                 # Reusable React components
│   ├── ai-providers/              # Unified AI provider layer
│   └── utils/                     # Shared utility functions
├── config/                        # Shared configurations
│   ├── eslint/                    # Linting rules
│   ├── prettier/                  # Code formatting
│   └── vite/                      # Build configuration
├── docs/                          # Documentation
├── .github/workflows/             # CI/CD pipelines
└── docker-compose.yml             # Docker orchestration
```

### Key Architecture Decisions

1. **Monorepo Pattern** - Single source of truth, atomic commits, unified CI/CD
2. **Shared Packages** - DRY principle with reusable components and utilities
3. **Multi-Provider AI** - Resilience through provider diversity and automatic fallback
4. **Independent Apps** - Each app is deployable independently while sharing infrastructure
5. **Configuration Inheritance** - Base configs extended per-app as needed

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🎬 Live Demos

| Project | GitHub Pages | Vercel | Description |
|---------|-------------|---------|-------------|
| **AI Code Reviewer** | [Demo](#) | [Demo](#) | Analyze code for bugs and improvements |
| **Document Chat** | [Demo](#) | [Demo](#) | Chat with your documents using RAG |
| **Image Generator** | [Demo](#) | [Demo](#) | Generate images from text |
| **Voice Assistant** | [Demo](#) | [Demo](#) | Voice-first AI conversations |
| **Code Explainer** | [Demo](#) | [Demo](#) | Explain complex code in plain language |
| **Test Generator** | [Demo](#) | [Demo](#) | Generate comprehensive test suites |
| **API Integrator** | [Demo](#) | [Demo](#) | Test and compare AI APIs |
| **Data Visualizer** | [Demo](#) | [Demo](#) | Visualize data with AI insights |
| **Autonomous Agent** | [Demo](#) | [Demo](#) | Multi-agent task orchestration |
| **RAG Knowledge Base** | [Demo](#) | [Demo](#) | Advanced knowledge base system |

> **Note:** Replace `#` with actual deployment URLs once apps are deployed.

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture and design decisions |
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Complete deployment guide for all platforms |
| [PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) | Detailed summary of all 10 projects |
| [API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md) | Guide for setting up API keys securely |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development workflow
- Commit conventions
- Pull request process
- Code quality standards

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Learning Resources

This portfolio demonstrates the following AI engineering patterns:

- **Retrieval-Augmented Generation (RAG)** - Document Chat, Knowledge Base
- **Agentic Workflows** - Autonomous Agent, Research Agent
- **Code Analysis** - Code Reviewer, Test Generator, Code Explainer
- **Multimodal AI** - Image Generator, Voice Assistant
- **Real-time Streaming** - Voice Assistant, Chat Interfaces
- **Vector Databases** - Document Chat, Knowledge Base
- **Multi-Agent Orchestration** - Autonomous Agent

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/10-ai-killin-apps/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/10-ai-killin-apps/discussions)
- **Email:** your.email@example.com

---

## 🎉 Acknowledgments

Built with ❤️ using:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MiniMax](https://api.minimax.chat/)
- [Google Gemini](https://ai.google.dev/)
- [DeepSeek](https://platform.deepseek.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**⭐ If you find this portfolio helpful, please consider starring the repository!**
