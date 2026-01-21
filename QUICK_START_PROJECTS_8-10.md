# Quick Start Guide: Projects 8-10

## Prerequisites
- Node.js 18+
- npm or yarn
- API keys for MiniMax, Gemini, or DeepSeek

## Setup Instructions

### 1. Install Dependencies

From the monorepo root:
```bash
# Install all dependencies
npm install

# Or install per project
npm install --workspace=app-08-content-generator
npm install --workspace=app-09-agent-orchestrator
npm install --workspace=app-10-rag-knowledge-base
```

### 2. Configure Environment Variables

For each project, copy the example file and add your API keys:

```bash
# Project 8
cp apps/app-08-content-generator/.env.example apps/app-08-content-generator/.env

# Project 9
cp apps/app-09-agent-orchestrator/.env.example apps/app-09-agent-orchestrator/.env

# Project 10
cp apps/app-10-rag-knowledge-base/.env.example apps/app-10-rag-knowledge-base/.env
```

Edit each `.env` file and add your API keys:
```env
VITE_MINIMAX_API_KEY=your_actual_key_here
VITE_MINIMAX_GROUP_ID=your_group_id_here
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_key_here
```

### 3. Start Development Servers

Each project runs on a different port:

```bash
# Project 8: AI Content Generator (http://localhost:3008)
npm run dev --workspace=app-08-content-generator

# Project 9: Multi-Agent Orchestrator (http://localhost:3009)
npm run dev --workspace=app-09-agent-orchestrator

# Project 10: RAG Knowledge Base (http://localhost:3010)
npm run dev --workspace=app-10-rag-knowledge-base
```

## Quick Test Guide

### Project 8: AI Content Generator

1. Open http://localhost:3008
2. Select "Blog Post" content type
3. Enter topic: "The Future of AI"
4. Add keywords: "artificial intelligence, machine learning, innovation"
5. Select tone: "Professional"
6. Click "Generate Content"
7. Wait for AI to generate content
8. Edit if needed, copy or download

**Expected Result**: A well-structured blog post about AI with your keywords naturally incorporated.

### Project 9: Multi-Agent Orchestrator

1. Open http://localhost:3009
2. Click "Add Sample Tasks" to load example tasks
3. Observe the task queue filling up with 4 tasks
4. Click "Start Orchestration"
5. Watch agents execute tasks in real-time
6. Check the network visualization for active connections
7. Review activity log for detailed execution history

**Expected Result**: All 4 tasks distributed to specialized agents, processed, and completed with visible network activity.

### Project 10: RAG Knowledge Base

1. Open http://localhost:3010
2. Switch to "Manage Documents" tab
3. Click "Add Document"
4. Enter title: "Introduction to AI"
5. Paste sample content (500+ words about AI)
6. Add tags: "ai, technology"
7. Click "Add Document"
8. Switch to "Search & Ask" tab
9. Ask question: "What is artificial intelligence?"
10. Click "Get Answer"

**Expected Result**: AI-generated answer based on your document with source citations.

## Common Issues & Solutions

### Issue: "Failed to fetch" or network errors
**Solution**: Check that your API keys are correctly set in `.env` files and the AI provider services are accessible.

### Issue: "Cannot find module 'ai-providers'"
**Solution**: Ensure the shared packages are installed:
```bash
npm install --workspace=packages/ai-providers
```

### Issue: Port already in use
**Solution**: Change port in `vite.config.js`:
```javascript
server: {
  port: 3011  // Use different port
}
```

### Issue: Build fails
**Solution**: 
1. Clear cache: `rm -rf node_modules/.vite`
2. Reinstall: `npm install`
3. Try building again: `npm run build`

## Development Tips

### Hot Module Replacement
All projects support HMR - changes appear instantly without page reload.

### Debugging
- Open browser DevTools
- Check Console for errors
- Network tab shows AI API calls
- React DevTools for component inspection

### Styling Changes
- Modify Tailwind classes directly in components
- Changes reflect immediately
- Check `tailwind.config.js` for theme customization

## Production Build

Build all projects:
```bash
npm run build --workspace=app-08-content-generator
npm run build --workspace=app-09-agent-orchestrator
npm run build --workspace=app-10-rag-knowledge-base
```

Output directory for each: `dist/`

## Deployment

### Vercel
```bash
cd apps/app-08-content-generator
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Upload dist/ folder to gh-pages branch
```

### Coolify
1. Connect Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in dashboard

## Testing Checklist

### Project 8
- [ ] Generate blog post
- [ ] Generate social media post
- [ ] Generate email
- [ ] Try different tones
- [ ] Test keyword integration
- [ ] Copy content to clipboard
- [ ] Download as text file

### Project 9
- [ ] Load sample tasks
- [ ] Start orchestration
- [ ] Verify task completion
- [ ] Check activity log
- [ ] Observe network visualization
- [ ] Test reset functionality

### Project 10
- [ ] Add document
- [ ] Add multiple documents
- [ ] Ask question
- [ ] Verify answer quality
- [ ] Check source citations
- [ ] Test different questions
- [ ] Delete document

## Next Steps

1. **Customize**: Modify prompts, add features, adjust styling
2. **Extend**: Add new content types, agents, or document formats
3. **Integrate**: Connect to your own AI models or vector databases
4. **Deploy**: Choose deployment platform and go live
5. **Monitor**: Add analytics and error tracking

## Support

- Check individual README.md files for detailed documentation
- Review IMPLEMENTATION_SUMMARY_PROJECTS_8-10.md for architecture details
- Consult ai_portfolio_deployment_guide_comprehensive.md for deployment guides

## Project URLs (Development)

- **Project 8**: http://localhost:3008
- **Project 9**: http://localhost:3009
- **Project 10**: http://localhost:3010

---

**Ready to start?** Run `npm install` from the root directory, configure your API keys, and launch the development servers!
