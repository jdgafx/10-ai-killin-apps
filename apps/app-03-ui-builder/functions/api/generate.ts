// Cloudflare Worker for UI Builder with Claude
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
    const body = await request.json() as { description: string; framework?: string };
    console.log('UI generation request:', body);

    const framework = body.framework || 'react';
    const systemPrompt = `You are an expert UI developer. Generate production-ready ${framework} code with Tailwind CSS.

Requirements:
- Use shadcn/ui components where applicable
- Include proper TypeScript types
- Use modern React patterns (hooks, functional components)
- Implement responsive design
- Add proper accessibility attributes
- Include inline comments for complex logic

Output ONLY the code, no explanations.`;

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
        messages: [
          {
            role: 'user',
            content: `Generate a ${framework} component for: ${body.description}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const code = data.content[0].text;

    return new Response(
      JSON.stringify({
        code,
        framework,
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
    console.error('UI generation error:', error);
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
