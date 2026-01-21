# Multi-Model AI Chat Platform with RAG

A vector-powered chat application with Retrieval-Augmented Generation (RAG) supporting multiple AI providers (MiniMax, Google Gemini, DeepSeek).

## Features

- 🤖 **Multi-Provider Support**: Switch between MiniMax, Gemini, and DeepSeek
- 📚 **RAG Implementation**: Vector-based document retrieval for context-aware responses
- 💾 **Client-Side Vector Store**: LocalStorage-based vector database with cosine similarity
- 📄 **Document Upload**: Upload and index text documents for RAG queries
- 🎯 **Source Citations**: See which documents were used to answer your questions
- 🎨 **Modern UI**: Clean, responsive interface with Tailwind CSS

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
- `VITE_MINIMAX_GROUP_ID`: MiniMax group ID
- `VITE_GEMINI_API_KEY`: Google Gemini API key
- `VITE_DEEPSEEK_API_KEY`: DeepSeek API key
- `VITE_BASE_PATH`: Base path for deployment (e.g., `/app-01-rag-chat`)

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
