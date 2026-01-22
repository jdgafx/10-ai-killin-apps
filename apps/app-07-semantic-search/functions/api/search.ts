// Cloudflare Worker for Semantic Search with Embeddings
interface Env {
  ANTHROPIC_API_KEY: string;
  OPENROUTER_API_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const body = await request.json() as {
      query: string;
      documents?: string[];
      topK?: number;
    };
    console.log('Semantic search request:', body);

    // For demo purposes, using Claude for semantic understanding
    // In production, you'd use a proper embedding model and vector DB
    const systemPrompt = `You are a semantic search engine. Analyze the query and documents to find the most relevant matches.

Query: ${body.query}

${body.documents ? `Documents to search:\n${body.documents.map((doc, i) => `[${i}] ${doc}`).join('\n\n')}` : ''}

Provide:
1. Top ${body.topK || 3} most relevant document IDs
2. Relevance scores (0-1)
3. Brief explanation of why each is relevant
4. Key matching concepts

Output as JSON with structure:
{
  "results": [
    { "id": 0, "score": 0.95, "reason": "..." }
  ],
  "concepts": ["concept1", "concept2"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: systemPrompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json() as any;
    let results;

    try {
      results = JSON.parse(data.content[0].text);
    } catch {
      results = {
        results: [],
        rawResponse: data.content[0].text,
      };
    }

    return new Response(
      JSON.stringify({
        ...results,
        query: body.query,
        usage: data.usage,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Semantic search error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
