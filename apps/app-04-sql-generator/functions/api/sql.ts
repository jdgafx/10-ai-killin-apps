// Cloudflare Worker for SQL Generator with DeepSeek
interface Env {
  DEEPSEEK_API_KEY: string;
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
      schema?: string;
      database?: 'postgresql' | 'mysql' | 'sqlite';
    };
    console.log('SQL generation request:', body);

    const database = body.database || 'postgresql';
    const systemPrompt = `You are an expert SQL developer specializing in ${database}.

${body.schema ? `Database schema:\n${body.schema}\n\n` : ''}

Generate production-ready SQL queries that:
- Follow best practices
- Are optimized for performance
- Include proper indexing hints
- Use parameterized queries to prevent SQL injection
- Include comments for complex logic

Output format:
1. SQL query
2. Explanation
3. Performance considerations`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: body.query },
        ],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', error);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json() as any;

    return new Response(
      JSON.stringify({
        sql: data.choices[0].message.content,
        database,
        model: data.model,
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
    console.error('SQL generation error:', error);
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
