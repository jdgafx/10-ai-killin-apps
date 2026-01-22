// Cloudflare Worker for Document Processor with Claude
interface Env {
  ANTHROPIC_API_KEY: string;
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
      document: string;
      task: 'summarize' | 'extract' | 'analyze' | 'translate';
      language?: string;
    };
    console.log('Document processing request:', { task: body.task });

    const taskPrompts = {
      summarize: 'Provide a concise summary of the key points in this document.',
      extract: 'Extract key information including: entities, dates, numbers, important facts, and actionable items.',
      analyze: 'Provide a detailed analysis including: main themes, sentiment, structure, and recommendations.',
      translate: `Translate this document to ${body.language || 'Spanish'} while preserving formatting and meaning.`,
    };

    const systemPrompt = `You are an expert document processor. ${taskPrompts[body.task]}

Output should be:
- Well-structured
- Accurate
- Actionable
- Professional`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: body.document }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json() as any;

    return new Response(
      JSON.stringify({
        result: data.content[0].text,
        task: body.task,
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
    console.error('Document processing error:', error);
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
