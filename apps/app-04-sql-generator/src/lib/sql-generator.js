/**
 * AI-Powered SQL Query Generator
 * Converts natural language to SQL using MiniMax AI
 */

const SQL_SYSTEM_PROMPT = `You are an expert SQL developer. Generate accurate, optimized SQL queries based on natural language requests.

Rules:
1. Use parameterized queries to prevent SQL injection
2. Include proper JOIN conditions
3. Use appropriate indexes and optimize for performance
4. Handle NULL values safely
5. Use standard SQL syntax (PostgreSQL compatible)

Response format (JSON only):
{
  "query": "SELECT * FROM users WHERE id = $1",
  "parameters": [1],
  "explanation": "This query retrieves all columns from the users table where the id matches the parameter",
  "warning": "Any caveats or performance considerations (or null)"
}`

export async function generateSQL(question, schema) {
  // Check for API key
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY
  if (!apiKey) {
    throw new Error('MiniMax API key not configured. Please add VITE_MINIMAX_API_KEY to your .env file')
  }

  const schemaDescription = formatSchemaForAI(schema)
  
  const prompt = `Convert this natural language request to SQL:
"${question}"

Database Schema:
${schemaDescription}

Generate SQL following the rules above. Return ONLY valid JSON.`

  try {
    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'abab6.5-chat',
        messages: [
          { role: 'system', content: SQL_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    // Try to parse JSON response
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       content.match(/(\{[\s\S]*?\})/)
      const jsonStr = jsonMatch ? jsonMatch[1] : content
      return JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return {
        query: '-- Failed to generate SQL: Invalid response format',
        parameters: [],
        explanation: 'The AI response could not be parsed. Please try again.',
        warning: 'Response parsing failed'
      }
    }
  } catch (error) {
    console.error('SQL generation error:', error)
    return {
      query: '-- Failed to generate SQL',
      parameters: [],
      explanation: error.message || 'An error occurred during generation',
      warning: 'Generation failed'
    }
  }
}

function formatSchemaForAI(schema) {
  if (!schema?.tables || schema.tables.length === 0) {
    return 'No tables defined'
  }

  return schema.tables.map(table => {
    const columns = table.columns.map(col => {
      const parts = [col.name, col.type]
      if (col.primaryKey) parts.push('PRIMARY KEY')
      if (col.unique) parts.push('UNIQUE')
      if (col.notNull) parts.push('NOT NULL')
      return `  ${parts.join(' ')}`
    }).join('\n')

    return `Table: ${table.name}\n${columns}`
  }).join('\n\n')
}
