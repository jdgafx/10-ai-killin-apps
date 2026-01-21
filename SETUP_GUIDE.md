# Monorepo Setup & Getting Started Guide

## 📋 What Was Created

This document summarizes the monorepo structure that has been set up for the AI Portfolio projects.

### Directory Structure

```
ai-portfolio-monorepo/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                    # CI/CD pipeline configuration
├── apps/                                # 10 AI application projects
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
├── packages/                            # Shared packages
│   ├── shared-ui/                       # React components
│   ├── ai-providers/                    # AI provider abstraction
│   └── utils/                           # Utility functions
├── config/                              # Shared configurations
│   ├── eslint/
│   │   └── eslint.config.js
│   ├── prettier/
│   │   └── prettier.config.js
│   └── vite/
│       └── vite.config.base.js
├── .gitignore                           # Comprehensive git rules
├── package.json                         # Monorepo root configuration
├── tsconfig.json                        # TypeScript configuration
├── README.md                            # Main documentation
├── CONTRIBUTING.md                      # Contributing guidelines
└── TEMPLATE-app-package.json            # Template for new apps
```

## 🚀 Next Steps

### 1. Initialize Git Repository

```bash
cd /home/chris/dev/10-ai-killin-apps

# Initialize git if not already done
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "chore: Initialize monorepo structure with 10 projects"
```

### 2. Create GitHub Repository

```bash
# Option A: Using GitHub CLI (recommended)
gh repo create ai-portfolio-monorepo \
  --public \
  --description "10 production-ready AI applications" \
  --source=. \
  --remote=origin \
  --push

# Option B: Manual creation
# 1. Go to https://github.com/new
# 2. Create repository named "ai-portfolio-monorepo"
# 3. Follow the instructions to add remote and push
```

### 3. Configure Secrets for CI/CD

Create GitHub Secrets for automatic deployments:

```bash
# Set API keys as GitHub secrets
gh secret set VITE_MINIMAX_API_KEY --body "sk-cp-..."
gh secret set VITE_DEEPSEEK_API_KEY --body "sk-..."
gh secret set VITE_GITHUB_COPILOT_TOKEN --body "ghp_..."
gh secret set VITE_GEMINI_CLIENT_ID --body "your-client-id"
```

Or manually in GitHub:
1. Go to Repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret from the environment variables list

### 4. Set Up Development Environment

```bash
# Install all dependencies
npm install

# Verify installation
npm run lint
npm run type-check
```

### 5. Create Your First Application

Copy the template for a new app:

```bash
# Copy template package.json
cp TEMPLATE-app-package.json apps/app-01-ai-code-reviewer/package.json

# Update the package name in package.json
sed -i 's/"app-template"/"app-01-ai-code-reviewer"/' \
  apps/app-01-ai-code-reviewer/package.json

# Create vite config
cp config/vite/vite.config.base.js apps/app-01-ai-code-reviewer/vite.config.js

# Create source directory
mkdir -p apps/app-01-ai-code-reviewer/src/{components,lib,hooks}

# Create entry point
cat > apps/app-01-ai-code-reviewer/src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

# Create HTML entry
cat > apps/app-01-ai-code-reviewer/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Code Reviewer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF
```

### 6. Configure Environment Variables

Create `.env.local` in the root (for local development):

```bash
cat > .env.local << 'EOF'
# AI Providers
VITE_MINIMAX_API_KEY=sk-cp-...
VITE_DEEPSEEK_API_KEY=sk-...
VITE_GITHUB_COPILOT_TOKEN=ghp_...

# Google Gemini OAuth
VITE_GEMINI_CLIENT_ID=...apps.googleusercontent.com

# Feature Flags
VITE_ENABLE_RAG=true
VITE_ENABLE_VOICE=true
VITE_DEFAULT_PROVIDER=minimax
EOF
```

Create `.env.local` in each app directory:

```bash
for app in apps/app-*/; do
  cp .env.local "$app.env.local"
done
```

### 7. Verify Everything Works

```bash
# Check all linting
npm run lint

# Type check
npm run type-check

# Try building (if apps have content)
npm run build 2>/dev/null || echo "Apps ready for development"
```

## 📁 Key Files Explained

### Root `package.json`
- Defines npm workspaces for `apps/*` and `packages/*`
- Provides monorepo-level scripts for building, linting, testing
- Specifies shared dev dependencies

**Key scripts:**
```bash
npm run dev          # Run all apps in dev mode
npm run dev:app-01   # Run specific app
npm run build        # Build all apps
npm run lint         # Lint everything
npm run format       # Format code
```

### `config/eslint/eslint.config.js`
ESLint configuration shared across all projects:
- JavaScript/TypeScript rules
- React and React Hooks rules
- Consistent code style enforcement

Usage in app's `.eslintrc.js`:
```javascript
import baseConfig from '../../config/eslint/eslint.config.js'
export default [...baseConfig]
```

### `config/prettier/prettier.config.js`
Code formatting configuration:
- 100 character line width
- Single quotes
- 2 space indentation
- Trailing commas (ES5 compatible)

### `config/vite/vite.config.base.js`
Base Vite configuration for SPA applications:
- Path aliases (`@`, `@shared`, `@utils`, `@ai`)
- Terser minification
- React plugin setup
- Development server on port 3000

### `tsconfig.json`
TypeScript configuration for the monorepo:
- ES2020 target
- Strict mode enabled
- Path mapping for imports
- JSX support

## 🔧 Useful Commands

### Development
```bash
npm run dev:app-01        # Run app-01 locally
npm run dev:app-02        # Run app-02 locally
npm run dev               # Run all apps
```

### Building
```bash
npm run build:app-01      # Build specific app
npm run build             # Build all apps
npm run clean             # Clean all build artifacts
```

### Code Quality
```bash
npm run lint              # Check linting issues
npm run lint:fix          # Fix linting issues
npm run format            # Format all code
npm run type-check        # TypeScript type checking
```

### Testing
```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests only
npm run test:e2e          # E2E tests only
```

## 📦 Adding a New Application

1. Create project directory:
```bash
mkdir -p apps/app-XX-project-name/src
```

2. Copy template files:
```bash
cp TEMPLATE-app-package.json apps/app-XX-project-name/package.json
cp config/vite/vite.config.base.js apps/app-XX-project-name/vite.config.js
```

3. Update package.json:
```bash
sed -i 's/"app-template"/"app-xx-project-name"/' \
  apps/app-XX-project-name/package.json
```

4. Create entry files:
```bash
# HTML entry
echo '<html><head></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>' \
  > apps/app-XX-project-name/index.html

# JavaScript entry
mkdir -p apps/app-XX-project-name/src/{components,lib,hooks}
touch apps/app-XX-project-name/src/main.jsx
touch apps/app-XX-project-name/src/App.jsx
```

5. Install dependencies:
```bash
npm install
```

## 🚀 Deployment Checklist

Before deploying any application:

- [ ] Code passes linting: `npm run lint`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Tests pass: `npm run test --if-present`
- [ ] Build succeeds: `npm run build:app-XX`
- [ ] Environment variables configured
- [ ] GitHub secrets set (for CI/CD)
- [ ] README updated with deployment instructions
- [ ] Git changes committed and pushed

## 📝 Git Workflow

### Push After Every Change
The cardinal rule of this portfolio: **push to GitHub after each meaningful change**.

```bash
# Edit files...
git add .
git commit -m "feat(app-01): Add new feature"
git push origin feature-branch
```

### Branching Strategy
```bash
# Feature branch
git checkout -b feature/app-01-add-review-ui

# Bug fix
git checkout -b bugfix/app-02-fix-chat-scroll

# Documentation
git checkout -b docs/update-api-docs

# Maintenance
git checkout -b chore/update-dependencies
```

### Commit Messages
Follow Conventional Commits:
```bash
git commit -m "feat(app-01): Add code review functionality"
git commit -m "fix(app-02): Fix memory leak in chat component"
git commit -m "docs(repo): Update deployment guide"
```

## 🔗 Important Resources

- **Deployment Guide:** See `ai_portfolio_deployment_guide_comprehensive.md`
- **Contributing:** See `CONTRIBUTING.md`
- **Main README:** See `README.md`
- **App Templates:** See `TEMPLATE-app-package.json`

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### Git Setup Issues
```bash
# Configure Git globally
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Build Failures
```bash
# Full clean rebuild
npm run clean
npm install
npm run build
```

## ✅ Verification

To verify everything is set up correctly:

```bash
# 1. Check directory structure
ls -la apps/
ls -la packages/
ls -la config/

# 2. Verify npm workspaces
npm ls

# 3. Check linting configuration
npm run lint -- --version

# 4. Verify TypeScript
npx tsc --version

# 5. Test a development environment
npm run dev:app-01  # Should start dev server (even if app is empty)
```

---

## 🎯 Next: Building Your First App

You're now ready to:

1. Create your first application in `apps/app-01-ai-code-reviewer/`
2. Implement React components
3. Integrate with AI providers
4. Deploy to GitHub Pages, Vercel, or Coolify

See the comprehensive deployment guide for detailed instructions on building and deploying each of the 10 applications.

**Happy building! 🚀**
