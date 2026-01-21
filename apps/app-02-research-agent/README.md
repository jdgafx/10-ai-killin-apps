# Autonomous Research Agent

A multi-step autonomous research agent that breaks down complex topics, performs parallel research, and synthesizes comprehensive reports.

## Features

- 🧠 **Intelligent Decomposition**: Automatically breaks down research topics into sub-questions
- ⚡ **Parallel Processing**: Research multiple sub-topics simultaneously for faster results
- 📊 **Data Analysis**: Analyze findings with confidence scores and themes
- 📝 **Report Synthesis**: Generate comprehensive reports with executive summaries
- 🎯 **Progress Tracking**: Real-time progress updates during research
- 📈 **Analytics Dashboard**: Visual analysis of research findings

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Lucide React Icons
- AI Providers Package (workspace dependency)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start development server:
```bash
npm run dev
```

## How It Works

### Research Pipeline

1. **Topic Decomposition**: Break down main topic into 5 specific sub-questions
2. **Parallel Research**: Research each sub-question simultaneously (or sequentially)
3. **Finding Collection**: Gather findings with confidence scores and sources
4. **Report Synthesis**: Combine findings into structured report with:
   - Executive Summary
   - Key Findings (organized by theme)
   - Conclusions
   - Areas for Further Research
5. **Analysis**: Analyze research quality with metrics and statistics

### Agent Architecture

The research agent uses a multi-step workflow:
- **Planner**: Decomposes topics into research questions
- **Researcher**: Executes individual research tasks
- **Synthesizer**: Combines findings into cohesive reports
- **Analyzer**: Evaluates research quality and insights

## Usage

1. **Enter Topic**: Type a research topic (e.g., "Quantum Computing")
2. **Choose Mode**: Enable parallel processing for faster results
3. **Start Research**: Click "Start Research" and watch progress
4. **Review Report**: Examine the comprehensive research report
5. **Analyze Results**: Check analytics sidebar for research quality metrics

## Project Structure

```
src/
├── App.jsx                          # Main application component
├── agents/
│   └── ResearchAgent.js            # Core research agent logic
├── tools/
│   ├── WebSearch.js                # Web search tool
│   └── DataAnalysis.js             # Analysis tool
├── components/
│   └── ResearchReport.jsx          # Report display component
└── main.jsx                        # Entry point
```

## Deployment

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

### Vercel
```bash
vercel deploy
```

### Coolify
Use the provided Dockerfile for deployment.

## Environment Variables

- `VITE_MINIMAX_API_KEY`: MiniMax API key
- `VITE_GEMINI_API_KEY`: Google Gemini API key
- `VITE_DEEPSEEK_API_KEY`: DeepSeek API key
- `VITE_BASE_PATH`: Base path for deployment (e.g., `/app-02-research-agent`)

## Future Enhancements

- [ ] Real web search integration (SerpAPI, Brave Search)
- [ ] PDF report export
- [ ] Research history and bookmarks
- [ ] Advanced citation management
- [ ] Multi-language support
- [ ] Collaborative research sessions

## License

MIT
