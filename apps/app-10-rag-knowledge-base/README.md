# RAG Knowledge Base

Intelligent document search and question-answering system powered by Retrieval-Augmented Generation (RAG).

## Features

- **Document Ingestion**: Upload and process documents into searchable chunks
- **Semantic Search**: AI-powered document retrieval based on meaning, not just keywords
- **Question Answering**: Get accurate answers with source citations
- **Source Attribution**: Every answer includes relevant source documents
- **Intelligent Chunking**: Automatic document segmentation for optimal retrieval
- **Hybrid Search**: Combines semantic similarity with keyword matching (BM25)
- **Real-time Processing**: Instant document indexing and search

## Tech Stack

- React 18 with Hooks
- Vite for development
- Tailwind CSS for styling
- Lucide React for icons
- Multi-model AI support (MiniMax, Gemini, DeepSeek)
- Client-side vector storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env
```

### Development

```bash
# Start development server (port 3010)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```
VITE_MINIMAX_API_KEY=your_minimax_api_key
VITE_MINIMAX_GROUP_ID=your_minimax_group_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Usage

### Adding Documents

1. Click "Manage Documents" tab
2. Click "Add Document" button
3. Enter title and paste content
4. Optionally add tags for better organization
5. Click "Add Document" to ingest

### Asking Questions

1. Switch to "Search & Ask" tab
2. Type your question in the search box
3. Click "Get Answer" to process
4. View AI-generated answer with source citations

### Example Workflows

**Building a Knowledge Base**
1. Add multiple documents on related topics
2. The system automatically chunks and indexes them
3. Ask questions spanning multiple documents
4. Get synthesized answers with citations

**Research Assistant**
1. Upload research papers or articles
2. Ask analytical questions
3. Get summaries and insights
4. Explore with follow-up questions

## How RAG Works

### 1. Document Ingestion Pipeline
```
Document → Preprocessing → Chunking → Embedding → Vector Store
```

- **Preprocessing**: Clean and normalize text
- **Chunking**: Split into 500-word segments with 50-word overlap
- **Embedding**: Convert text to vector representations
- **Storage**: Index in searchable vector store

### 2. Retrieval Process
```
Question → Embedding → Vector Search → Re-ranking → Top-K Results
```

- **Semantic Search**: Find documents by meaning
- **BM25 Scoring**: Keyword-based relevance
- **Hybrid Approach**: Combine both methods (60% semantic, 40% keyword)
- **Re-ranking**: Boost results with title/tag matches

### 3. Answer Generation
```
Question + Context → LLM → Answer + Citations
```

- **Context Building**: Combine top retrieved chunks
- **Prompt Engineering**: Instruct LLM to answer from context only
- **Source Attribution**: Include document references
- **Confidence Scoring**: Estimate answer reliability

## Project Structure

```
src/
├── App.jsx                  # Main application
├── main.jsx                # Entry point
├── index.css               # Global styles
├── components/
│   ├── DocumentManager.jsx    # Document CRUD interface
│   ├── KnowledgeSearch.jsx    # Search and question UI
│   └── AnswerDisplay.jsx      # Answer with sources display
└── lib/
    ├── ingestion.js           # Document processing pipeline
    ├── vector-store.js        # Vector storage and similarity
    ├── retrieval.js           # Search and ranking algorithms
    └── qa-chain.js            # Question-answering logic
```

## Key Algorithms

### Document Chunking
- Fixed-size chunks with overlap
- Preserves context across boundaries
- Optimizes for retrieval accuracy

### Hybrid Search
- **Semantic**: Cosine similarity on embeddings
- **Lexical**: BM25 keyword scoring
- **Weighted**: 60% semantic + 40% lexical

### Relevance Scoring
```javascript
score = (semanticSimilarity * 0.6) + (bm25Score * 0.4)
```

### Re-ranking Boosts
- Title match: 1.3x
- Exact phrase match: 1.5x
- Tag match: 1.2x

## API Integration

Uses the shared `ai-providers` package:

```javascript
import { chat } from 'ai-providers'

const response = await chat([
  { role: 'system', content: 'You are a RAG assistant' },
  { role: 'user', content: prompt }
])
```

## Advanced Features

### Custom Chunking Strategy
```javascript
chunkDocument(content, chunkSize = 500, overlap = 50)
```

### Metadata Extraction
- Word count, character count
- Estimated read time
- Automatic heading detection

### Document Validation
- Title and content requirements
- Length constraints
- Format validation

## Performance Optimization

- Client-side vector storage for fast access
- Lazy loading for large document collections
- Efficient similarity calculations
- Optimized chunk sizes for retrieval

## Error Handling

- Graceful degradation when AI unavailable
- Fallback to direct content display
- Comprehensive error messages
- Network failure recovery

## Deployment

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

### Coolify
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables configured in dashboard

## Use Cases

- **Research Assistant**: Search academic papers and research documents
- **Documentation Search**: Enterprise knowledge base for teams
- **Customer Support**: FAQ and support document retrieval
- **Content Analysis**: Analyze and query large document collections
- **Study Aid**: Personal knowledge base for learning materials

## Limitations

- Client-side storage (localStorage) has size limits
- Simple embedding algorithm (for production use real embeddings)
- No persistence beyond browser storage
- Limited to text documents

## Future Enhancements

- Real vector embeddings (OpenAI, Cohere)
- Server-side vector database (Pinecone, Weaviate)
- File upload support (PDF, DOCX)
- Multi-language support
- Advanced analytics and insights
- Export/import knowledge bases
- Collaborative features

## Technical Details

### Vector Store
- Simple cosine similarity implementation
- In-memory storage for fast access
- Suitable for up to ~1000 documents

### Search Algorithm
- Hybrid retrieval combining multiple signals
- Top-K selection with configurable K
- Relevance scoring with multiple factors

### Answer Quality
- Context-aware prompting
- Source citation enforcement
- Confidence estimation
- Fallback mechanisms

## License

MIT

## Author

Part of the 10 AI Killin' Apps Portfolio
