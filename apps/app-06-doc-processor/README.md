# AI Document Processing System

Comprehensive document analysis with PDF/text parsing, summarization, and Q&A.

## Features

- 📄 **PDF & Text Support**: Extract text from PDF and TXT files
- 🧠 **AI Analysis**: Automatic summarization, keyword extraction, and sentiment analysis
- 💬 **Q&A System**: Ask questions about your documents
- 🎯 **Document Classification**: Automatic type detection
- 📊 **Key Entity Extraction**: Identify people, organizations, dates, and locations
- 🎨 **Drag & Drop**: Easy file upload interface

## Quick Start

```bash
# Install dependencies
npm install

# Add your API key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

## Usage

1. **Upload Document**: Drag and drop or click to upload PDF or TXT files (max 10MB)
2. **Auto-Analysis**: The system automatically analyzes the document
3. **Review Results**: Check summary, keywords, sentiment, and document type
4. **Ask Questions**: Type questions about the document in the Q&A section

## Supported File Types

- **PDF**: `.pdf` files with text content
- **Text**: `.txt` plain text files

## Analysis Features

### Summary
Concise 3-5 sentence overview of document content

### Keywords
10-15 important terms automatically extracted

### Sentiment
Overall tone and emotional context of the document

### Document Type
Classification (report, article, legal, technical, etc.)

### Key Entities
People, organizations, dates, and locations mentioned

## Example Questions

- "What is the main topic of this document?"
- "Who are the key people mentioned?"
- "What are the main conclusions?"
- "When was this document created?"
- "What recommendations are made?"

## Configuration

Set your Google Gemini API key in `.env`:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key at: https://makersuite.google.com/app/apikey

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
docker build -t doc-processor .
docker run -p 3006:80 doc-processor
```

## Technical Details

- **PDF Parsing**: PDF.js library for client-side extraction
- **AI Model**: Google Gemini Pro for analysis
- **Context Window**: Handles documents up to 15,000 characters
- **Processing**: All processing done client-side (except AI API calls)

## Limitations

- Maximum file size: 10MB
- PDF must contain text (not scanned images)
- Best results with documents under 10,000 words

## Technologies

- **React**: UI framework
- **PDF.js**: PDF text extraction
- **Google Gemini**: AI analysis and Q&A
- **Vite**: Build tool

## License

MIT
