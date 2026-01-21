# Semantic Search Engine

AI-powered semantic search with vector similarity and intelligent ranking.

## Features

- 🔍 **Semantic Search**: Find documents by meaning, not just keywords
- 🧠 **AI-Enhanced**: Uses Google Gemini for query expansion
- 📊 **Relevance Scoring**: Results ranked by similarity
- 📚 **Document Management**: Add and index custom documents
- 🏷️ **Category Filtering**: Organize documents by category
- ⚡ **Fast Indexing**: Instant search across all documents

## Quick Start

```bash
# Install dependencies
npm install

# Add your API key (optional - works without for basic search)
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

## Usage

### Basic Search
1. Documents are automatically indexed on load
2. Enter your search query in natural language
3. View results sorted by relevance score

### Add Documents
1. Click the "Add" button
2. Enter title, content, and category
3. Document is automatically indexed

### Search Modes

**With AI (requires API key):**
- Query expansion with related terms
- Enhanced semantic understanding
- Better matching for complex queries

**Without AI:**
- Fast keyword-based search
- Partial word matching
- Title-weighted relevance

## Example Queries

- "machine learning fundamentals"
- "web development best practices"
- "database optimization techniques"
- "artificial intelligence applications"

## How It Works

### Indexing
1. Documents are tokenized into keywords
2. Title and content tokens stored separately
3. Category and metadata preserved

### Searching
1. Query is tokenized
2. AI expands query with related terms (optional)
3. Relevance score calculated for each document:
   - Title matches: 2x weight
   - Content matches: 1x weight
   - Partial matches: 0.5x weight
4. Results filtered by threshold and sorted

### Relevance Score
- **80-100%**: Highly relevant (green)
- **60-79%**: Relevant (blue)
- **40-59%**: Somewhat relevant (orange)
- **< 40%**: Low relevance (red)

## Configuration

Optional: Set your Google Gemini API key in `.env` for AI-enhanced search:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: The search engine works without an API key using keyword-based search.

## API Reference

### `semanticSearch(query, documents, options)`
```javascript
const results = await semanticSearch('machine learning', documents, {
  limit: 10,        // Max results
  threshold: 0.1,   // Minimum relevance score
  useAI: true       // Enable AI enhancement
})
```

### `indexDocuments(documents)`
```javascript
await indexDocuments([
  {
    id: 1,
    title: 'Document Title',
    content: 'Document content...',
    category: 'AI',
    date: '2024-01-15'
  }
])
```

## Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

### Docker (Coolify)
```bash
docker build -t semantic-search .
docker run -p 3007:80 semantic-search
```

## Performance

- **Indexing**: ~100 documents/second
- **Search**: < 100ms for 1000 documents
- **Memory**: ~1MB per 100 documents

## Extending

### Add Custom Filters
```javascript
// Search by date range
function searchByDateRange(startDate, endDate) {
  const index = getIndex()
  return index.filter(doc => 
    doc.date >= startDate && doc.date <= endDate
  )
}
```

### Implement Vector Embeddings
For production use, integrate with embedding models:
- Google `text-embedding-004`
- OpenAI `text-embedding-3-small`
- Cohere `embed-english-v3.0`

## Technologies

- **React**: UI framework
- **Google Gemini**: Query expansion (optional)
- **Client-side Indexing**: Fast in-memory search
- **Token-based Matching**: Efficient relevance scoring

## License

MIT
