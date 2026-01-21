# Quick Start Guide for Projects 1-3

## Installation & Setup

### 1. Install Dependencies for All Projects

```bash
# From repository root
npm install

# Install project dependencies
cd apps/app-01-rag-chat && npm install && cd ../..
cd apps/app-02-research-agent && npm install && cd ../..
cd apps/app-03-ui-builder && npm install && cd ../..
```

### 2. Configure Environment Variables

```bash
# Project 1: RAG Chat
cp apps/app-01-rag-chat/.env.example apps/app-01-rag-chat/.env

# Project 2: Research Agent
cp apps/app-02-research-agent/.env.example apps/app-02-research-agent/.env

# Project 3: UI Builder
cp apps/app-03-ui-builder/.env.example apps/app-03-ui-builder/.env
```

Edit each `.env` file with your API keys.

### 3. Run Projects

**Option A: Run all projects simultaneously**
```bash
# Terminal 1 - RAG Chat (Port 3001)
npm run dev --workspace=app-01-rag-chat

# Terminal 2 - Research Agent (Port 3002)
npm run dev --workspace=app-02-research-agent

# Terminal 3 - UI Builder (Port 3003)
npm run dev --workspace=app-03-ui-builder
```

**Option B: Run individually**
```bash
cd apps/app-01-rag-chat && npm run dev
```

### 4. Access Applications

- **RAG Chat**: http://localhost:3001
- **Research Agent**: http://localhost:3002
- **UI Builder**: http://localhost:3003

## Quick Feature Tests

### Project 1: Multi-Model AI Chat with RAG
1. Upload a text document (.txt or .md)
2. Ask a question about the document
3. See RAG-powered response with source citations
4. Switch between AI providers (MiniMax, Gemini, DeepSeek)

### Project 2: Autonomous Research Agent
1. Enter a research topic (e.g., "Quantum Computing")
2. Toggle parallel processing mode
3. Click "Start Research"
4. Watch progress and view comprehensive report

### Project 3: Generative UI Component Builder
1. Describe a component (e.g., "A pricing card with gradient")
2. Click "Generate Component"
3. View live preview
4. Switch to Code tab and copy/download

## Build for Production

```bash
# Build all projects
npm run build --workspace=app-01-rag-chat
npm run build --workspace=app-02-research-agent
npm run build --workspace=app-03-ui-builder

# Output will be in each project's dist/ folder
```

## Troubleshooting

**Issue**: Dependencies not installing
- Solution: Delete `node_modules` and `package-lock.json`, run `npm install` again

**Issue**: Port already in use
- Solution: Change port in `vite.config.js`

**Issue**: Tailwind styles not loading
- Solution: Check `tailwind.config.js` content paths and restart dev server

**Issue**: AI providers not working
- Solution: Verify API keys in `.env` files and check console for errors

## Project Structure Quick Reference

```
apps/
├── app-01-rag-chat/              # Vector-powered chat
├── app-02-research-agent/        # Autonomous research
└── app-03-ui-builder/            # Component generator
```

Each project is self-contained with:
- `package.json` - Dependencies
- `src/` - Source code
- `vite.config.js` - Build config
- `README.md` - Full documentation
