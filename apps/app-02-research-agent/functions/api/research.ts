// Cloudflare Worker for Research Agent with OpenRouter
interface Env {
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
    const body = await request.json() as { query: string; depth?: 'quick' | 'deep' };
    console.log('Research request:', body);

    const systemPrompt = `You are a research agent. Analyze the query and provide comprehensive research findings.
    
Research depth: ${body.depth || 'quick'}

Provide:
1. Key findings
2. Relevant sources (URLs if applicable)
3. Summary
4. Recommendations for further research`;

    // Call OpenRouter API with Claude
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ai-killin-apps.pages.dev',
        'X-Title': 'AI Research Agent',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: body.query },
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json() as any;

    return new Response(
      JSON.stringify({
        findings: data.choices[0].message.content,
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
    console.error('Research error:', error);
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
