# Contributing to AI Portfolio Monorepo

Thank you for your interest in contributing to this AI portfolio project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

Be respectful, professional, and constructive in all interactions. We're building a portfolio that demonstrates excellence.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-portfolio-monorepo.git
cd ai-portfolio-monorepo

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Pull Latest Changes
```bash
git checkout main
git pull origin main
```

### 2. Create Feature Branch
```bash
git checkout -b feature/add-feature
# or
git checkout -b bugfix/fix-issue
# or
git checkout -b docs/update-readme
```

### 3. Make Changes

Edit files in the relevant `apps/` or `packages/` directory.

```bash
# Develop your feature
npm run dev:app-01  # Run specific app
npm run dev        # Run all apps
```

### 4. Commit Frequently
Make small, focused commits after each meaningful change:

```bash
git add .
git commit -m "feat: Add new feature description"
git push origin feature/add-feature
```

### 5. Lint & Format Before Push
```bash
npm run lint:fix
npm run format
npm run type-check
```

### 6. Push to Remote
```bash
git push origin feature/add-feature
```

## Commit Guidelines

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Build, dependencies, etc.
- `perf`: Performance improvements
- `ci`: CI/CD configuration

### Scope
Specify which project/package is affected:
- `app-01`, `app-02`, etc. for applications
- `shared-ui`, `ai-providers`, `utils` for packages
- `config` for configuration changes
- `repo` for repository-level changes

### Examples
```bash
git commit -m "feat(app-01): Add code review feature"
git commit -m "fix(ai-providers): Handle API timeout errors"
git commit -m "docs(repo): Update deployment guide"
git commit -m "refactor(utils): Improve error handling"
```

## Pull Request Process

1. **Create Pull Request**
   - Push your branch to GitHub
   - Click "Compare & pull request"
   - Fill in the PR template (if available)

2. **PR Description**
   Include:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Any breaking changes
   - Screenshots (if UI changes)

3. **Example PR Description**
   ```markdown
   ## Changes
   - Added code review functionality to app-01
   - Integrated DeepSeek for code analysis
   - Added comprehensive error handling

   ## Testing
   - Tested with sample code files
   - Verified error handling for invalid input
   - Checked performance with large files

   ## Checklist
   - [ ] Tests pass locally
   - [ ] Code is linted
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

4. **Code Review**
   - Address feedback promptly
   - Push updates to the same branch
   - Mark conversations as resolved after addressing

5. **Merge**
   - Ensure all checks pass
   - Use "Squash and merge" for clean history
   - Delete the feature branch

## Code Style

### JavaScript/TypeScript

```javascript
// Use camelCase for variables and functions
const myVariable = 42
function myFunction() {}

// Use PascalCase for components and classes
function MyComponent() {}
class MyClass {}

// Use UPPER_SNAKE_CASE for constants
const MAX_RETRIES = 3
const API_KEY = process.env.API_KEY

// Prefer const, then let (avoid var)
const immutable = true
let mutable = false

// Use arrow functions
const add = (a, b) => a + b

// Use destructuring
const { name, age } = user
const [first, ...rest] = array

// Use template literals
const message = `Hello, ${name}!`
```

### React Components

```jsx
// Functional components with hooks
import { useState, useEffect } from 'react'

export default function MyComponent() {
  const [state, setState] = useState(null)

  useEffect(() => {
    // Side effects
  }, [])

  return (
    <div>
      <h1>Component</h1>
    </div>
  )
}

// Props interface
interface MyComponentProps {
  title: string
  onClose?: () => void
}

function MyComponent({ title, onClose }: MyComponentProps) {
  // Implementation
}
```

### CSS/Tailwind

Use Tailwind CSS classes for styling:

```jsx
<div className="flex items-center justify-between p-4 bg-blue-600 rounded-lg">
  <h1 className="text-white font-bold">Title</h1>
  <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
    Click me
  </button>
</div>
```

## Testing

### Running Tests
```bash
npm run test                    # Run all tests
npm run test:unit --if-present # Unit tests
npm run test:e2e --if-present  # E2E tests
```

### Writing Tests
Create `*.test.ts` or `*.spec.ts` files alongside source code:

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from './myFunction'

describe('myFunction', () => {
  it('should return correct value', () => {
    expect(myFunction(2, 3)).toBe(5)
  })

  it('should handle edge cases', () => {
    expect(myFunction(0, 0)).toBe(0)
    expect(myFunction(-1, 1)).toBe(0)
  })
})
```

## Documentation

### Updating Documentation
1. Update relevant `.md` files
2. Keep documentation in sync with code changes
3. Include examples and use cases

### Code Comments
Write comments only for "why", not "what":

```javascript
// ✅ Good - explains why
// Use a Set for O(1) lookup performance
const uniqueIds = new Set(ids)

// ❌ Bad - just restates code
// Create a new Set from ids
const uniqueIds = new Set(ids)
```

### README Files
Each project should have:
- Project overview
- Installation instructions
- Usage examples
- API documentation (if applicable)
- Deployment instructions
- Troubleshooting section

## Performance Considerations

### Code Review Checks
- [ ] No unnecessary re-renders (React)
- [ ] API calls are debounced/throttled
- [ ] Large lists use virtualization
- [ ] Images are optimized
- [ ] Bundle size hasn't significantly increased

### Common Issues
```javascript
// ❌ Bad - creates new function on every render
<button onClick={() => handleClick()}>Click</button>

// ✅ Good - stable reference
<button onClick={handleClick}>Click</button>

// ❌ Bad - causes infinite loop
useEffect(() => {
  setState(data)
}, [data]) // ← data changes, triggers effect again

// ✅ Good - specific dependency
useEffect(() => {
  if (userId) {
    fetchUser(userId)
  }
}, [userId])
```

## Common Issues & Solutions

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Failures
```bash
npm run clean
npm install
npm run build
```

### Git Conflicts
```bash
git fetch origin
git rebase origin/main
# Fix conflicts in editor
git add .
git rebase --continue
git push origin feature/branch --force-with-lease
```

## Need Help?

- Check existing issues and discussions
- Review documentation
- Ask in PR comments
- Create a new issue with detailed information

## Recognition

Contributors will be recognized in:
- Project README
- GitHub contributors page
- Release notes for significant contributions

---

Thank you for contributing to making this an excellent AI portfolio project! 🎉
