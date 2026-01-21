# AI-Powered SQL Query Generator

Convert natural language questions into SQL queries using AI.

## Features

- 🗣️ **Natural Language to SQL**: Convert plain English questions to SQL queries
- 🏗️ **Visual Schema Builder**: Design your database schema with an intuitive interface
- ✅ **Query Validation**: Automatic safety checks for SQL injection and dangerous operations
- 📋 **Syntax Highlighting**: Beautiful SQL code display with copy functionality
- 🔍 **Query Explanation**: Understand what each generated query does

## Quick Start

```bash
# Install dependencies
npm install

# Add your API key
echo "VITE_MINIMAX_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

## Usage

1. **Define Your Schema**: Use the visual schema builder to create tables and columns
2. **Ask a Question**: Type your question in natural language (e.g., "Show me all users who signed up in the last 7 days")
3. **Generate SQL**: Click "Generate SQL Query" to create the query
4. **Review & Copy**: Check the explanation, warnings, and copy the SQL to use

## Example Questions

- "Find all users who registered in the last 7 days"
- "Show total sales by category for 2024"
- "Get users with more than 5 orders"
- "List products with low stock (less than 10 items)"

## Security Features

- **Parameterized Queries**: All queries use parameters to prevent SQL injection
- **Dangerous Operation Detection**: Blocks DROP, TRUNCATE, and unsafe patterns
- **Validation Checks**: Syntax validation before execution

## Configuration

Set your MiniMax API key in `.env`:

```env
VITE_MINIMAX_API_KEY=your_api_key_here
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
docker build -t sql-generator .
docker run -p 3004:80 sql-generator
```

## Technologies

- **React**: UI framework
- **MiniMax AI**: Natural language processing
- **Vite**: Build tool
- **Lucide React**: Icons

## License

MIT
