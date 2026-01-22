# Multi-Model AI Chat Platform with RAG

A production-ready vector-powered chat application with Retrieval-Augmented Generation (RAG) using Anthropic Claude via Cloudflare Workers.

## Features

- 🤖 **Real AI Integration**: Anthropic Claude 3.5 Sonnet via Cloudflare Workers
- 📚 **RAG Implementation**: Vector-based document retrieval for context-aware responses
- 💾 **Client-Side Vector Store**: LocalStorage-based vector database with cosine similarity
- 📄 **Document Upload**: Upload and index text documents for RAG queries
- 🎯 **Source Citations**: See which documents were used to answer your questions
- 🎨 **Modern UI**: Clean, responsive interface with Tailwind CSS
- ⚡ **Edge Computing**: Global deployment with zero cold starts

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Lucide React Icons
- LocalStorage Vector Store
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

### RAG Pipeline

1. **Document Ingestion**: Upload documents → Split into chunks → Generate embeddings → Store in vector DB
2. **Query Processing**: User query → Generate query embedding → Retrieve top-K similar chunks
3. **Context-Augmented Generation**: Combine retrieved context + user query → Send to AI provider
4. **Response with Sources**: Display AI response + show source documents with similarity scores

### Vector Store

The application uses a client-side vector store implementation:
- Embeddings generated using text hashing (production should use real embedding APIs)
- Cosine similarity for semantic search
- LocalStorage persistence
- Support for metadata and chunking

## API Endpoint

**POST /api/chat**

Real Anthropic Claude API integration via Cloudflare Workers.

**Request:**
```json
{
  "message": "Your question here",
  "context": "Retrieved document context (optional)"
}
```

**Response:**
```json
{
  "content": "AI response text",
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 200
  }
}
```

**Environment Variables (Cloudflare):**
- `ANTHROPIC_API_KEY`: Your Anthropic API key

## Deployment

### Cloudflare Pages (Recommended)

**Using Wrangler CLI:**
```bash
npm run build
wrangler pages deploy dist --project-name=app-01-rag-chat
```

**Environment Setup:**
```bash
# Set secrets in Cloudflare dashboard or via CLI
wrangler pages secret put ANTHROPIC_API_KEY
```

**See full guide:** `/CLOUDFLARE_DEVELOPER_GUIDE.md`

### Alternative Deployments

**Vercel:**
```bash
vercel deploy
```

**GitHub Pages:**
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

## Project Structure

```
src/
├── App.jsx                    # Main application component
├── components/
│   └── ChatMessage.jsx       # Message display component
├── lib/
│   ├── chat.js              # Chat logic with provider switching
│   └── rag.js               # RAG implementation (vector store, embeddings)
└── main.jsx                 # Entry point
```

## Usage

1. **Upload Documents**: Click "Upload Document" to add context
2. **Select Provider**: Choose between MiniMax, Gemini, or DeepSeek
3. **Ask Questions**: Type your question and get RAG-powered responses
4. **View Sources**: See which documents were used with relevance scores

## Future Enhancements

- [ ] Real embedding APIs (OpenAI, Cohere, etc.)
- [ ] Cloud vector database (Pinecone, Weaviate)
- [ ] Multi-modal support (images, PDFs)
- [ ] Conversation memory and export
- [ ] Advanced chunking strategies
- [ ] Streaming responses

## License

MIT
