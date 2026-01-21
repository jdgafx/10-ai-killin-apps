# Quick Reference Guide - Projects 4-7

## 🚀 Installation (One-Line Commands)

### Install All Dependencies
```bash
cd /home/chris/dev/10-ai-killin-apps && \
  (cd apps/app-04-sql-generator && npm install) && \
  (cd apps/app-05-voice-chat && npm install) && \
  (cd apps/app-06-doc-processor && npm install) && \
  (cd apps/app-07-semantic-search && npm install)
```

### Configure All Environment Variables
```bash
cd /home/chris/dev/10-ai-killin-apps && \
  echo "VITE_MINIMAX_API_KEY=your_minimax_key" > apps/app-04-sql-generator/.env && \
  echo "VITE_MINIMAX_API_KEY=your_minimax_key" > apps/app-05-voice-chat/.env && \
  echo "VITE_GEMINI_API_KEY=your_gemini_key" > apps/app-06-doc-processor/.env && \
  echo "VITE_GEMINI_API_KEY=your_gemini_key" > apps/app-07-semantic-search/.env
```

## 🎯 Quick Start Each Project

### Project 4: SQL Generator
```bash
cd /home/chris/dev/10-ai-killin-apps/apps/app-04-sql-generator
npm install
echo "VITE_MINIMAX_API_KEY=your_key" > .env
npm run dev
# Open http://localhost:3004
```

### Project 5: Voice Chat
```bash
cd /home/chris/dev/10-ai-killin-apps/apps/app-05-voice-chat
npm install
echo "VITE_MINIMAX_API_KEY=your_key" > .env
npm run dev
# Open http://localhost:3005
```

### Project 6: Document Processor
```bash
cd /home/chris/dev/10-ai-killin-apps/apps/app-06-doc-processor
npm install
echo "VITE_GEMINI_API_KEY=your_key" > .env
npm run dev
# Open http://localhost:3006
```

### Project 7: Semantic Search
```bash
cd /home/chris/dev/10-ai-killin-apps/apps/app-07-semantic-search
npm install
echo "VITE_GEMINI_API_KEY=your_key" > .env
npm run dev
# Open http://localhost:3007
```

## 🏗️ Build for Production

```bash
# Build all projects
cd /home/chris/dev/10-ai-killin-apps
for app in app-04-sql-generator app-05-voice-chat app-06-doc-processor app-07-semantic-search; do
  (cd apps/$app && npm run build)
done
```

## 🚢 Deploy to Vercel

```bash
# Deploy each project (requires Vercel CLI)
cd apps/app-04-sql-generator && vercel --prod
cd ../app-05-voice-chat && vercel --prod
cd ../app-06-doc-processor && vercel --prod
cd ../app-07-semantic-search && vercel --prod
```

## 🔑 API Keys Required

| Project | Provider | Get Key From |
|---------|----------|--------------|
| 4 & 5   | MiniMax  | https://api.minimax.chat |
| 6 & 7   | Gemini   | https://makersuite.google.com/app/apikey |

## 📁 Project Structure

```
apps/
├── app-04-sql-generator/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SchemaBuilder.jsx
│   │   │   └── QueryDisplay.jsx
│   │   ├── lib/
│   │   │   ├── sql-generator.js
│   │   │   └── query-validator.js
│   │   └── App.jsx
│   └── package.json
│
├── app-05-voice-chat/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx
│   │   │   └── AudioWaveform.jsx
│   │   ├── lib/
│   │   │   ├── speech.js
│   │   │   └── conversation.js
│   │   └── App.jsx
│   └── package.json
│
├── app-06-doc-processor/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUpload.jsx
│   │   │   └── DocumentAnalysis.jsx
│   │   ├── lib/
│   │   │   ├── parser.js
│   │   │   ├── summarizer.js
│   │   │   └── qa.js
│   │   └── App.jsx
│   └── package.json
│
└── app-07-semantic-search/
    ├── src/
    │   ├── components/
    │   │   ├── SearchBar.jsx
    │   │   └── SearchResults.jsx
    │   ├── lib/
    │   │   ├── indexer.js
    │   │   └── search.js
    │   └── App.jsx
    └── package.json
```

## 🧪 Testing Checklist

### Project 4
- [ ] Open http://localhost:3004
- [ ] Create a table in schema builder
- [ ] Ask: "Show me all users who registered last week"
- [ ] Verify SQL query is generated
- [ ] Copy query to clipboard

### Project 5
- [ ] Open http://localhost:3005 (Chrome/Edge)
- [ ] Grant microphone permissions
- [ ] Click microphone and say "Hello, how are you?"
- [ ] Verify AI responds with voice
- [ ] Test text input as alternative

### Project 6
- [ ] Open http://localhost:3006
- [ ] Drag a PDF or TXT file to upload
- [ ] Verify analysis shows (summary, keywords, sentiment)
- [ ] Ask a question about the document
- [ ] Verify answer is relevant

### Project 7
- [ ] Open http://localhost:3007
- [ ] Wait for documents to index
- [ ] Search: "machine learning concepts"
- [ ] Verify results with relevance scores
- [ ] Click "Add" to add new document

## 🐛 Common Issues & Fixes

### API Key Not Working
```bash
# Make sure .env file is in the correct directory
ls apps/app-04-sql-generator/.env

# Check env variable name (must start with VITE_)
cat apps/app-04-sql-generator/.env
```

### Port Already in Use
```bash
# Kill process on port 3004
lsof -ti:3004 | xargs kill -9

# Or change port in vite.config.js
```

### Voice Chat Not Working
- **Solution**: Use Chrome or Edge browser
- **Solution**: Ensure HTTPS (required for mic access)
- **Solution**: Grant microphone permissions

### PDF Not Parsing
- **Issue**: PDF must contain text (not scanned images)
- **Solution**: Test with text-based PDFs
- **Solution**: Check file size (max 10MB)

## 📖 Documentation Files

- `IMPLEMENTATION_SUMMARY_PROJECTS_4-7.md` - Complete implementation details
- `PROJECT_STATUS.md` - Overall progress and roadmap
- `apps/app-04-sql-generator/README.md` - SQL Generator guide
- `apps/app-05-voice-chat/README.md` - Voice Chat guide
- `apps/app-06-doc-processor/README.md` - Document Processor guide
- `apps/app-07-semantic-search/README.md` - Semantic Search guide

## 💡 Pro Tips

1. **Run Multiple Projects**: Use tmux or multiple terminals
2. **Hot Reload**: Vite auto-reloads on file changes
3. **Build Optimization**: Run `npm run build` before deployment
4. **Environment Variables**: Never commit .env files
5. **Browser Console**: Check for errors during testing

## 🆘 Need Help?

1. Check the project's README.md
2. Review .env.example for configuration
3. Verify API keys are correct
4. Check browser console for errors
5. Review IMPLEMENTATION_SUMMARY_PROJECTS_4-7.md

## ✅ Ready to Ship

All projects include:
- ✅ Production builds
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Deployment configs
- ✅ Documentation

---

**Happy Coding! 🚀**
