// Cloudflare Worker for Content Generator with Claude
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
      topic: string;
      type: 'blog' | 'social' | 'email' | 'ad';
      tone?: 'professional' | 'casual' | 'technical' | 'creative';
      length?: 'short' | 'medium' | 'long';
    };
    console.log('Content generation request:', body);

    const lengthGuide = {
      short: '100-300 words',
      medium: '300-800 words',
      long: '800-2000 words',
    };

    const typeTemplates = {
      blog: 'Write an engaging blog post with an introduction, main points with subheadings, and a conclusion.',
      social: 'Write compelling social media content optimized for engagement, with hashtags and call-to-action.',
      email: 'Write a professional email with subject line, greeting, body, and signature.',
      ad: 'Write persuasive ad copy with headline, body text, and strong call-to-action.',
    };

    const systemPrompt = `You are an expert content creator specializing in ${body.type} content.

Requirements:
- Topic: ${body.topic}
- Type: ${body.type}
- Tone: ${body.tone || 'professional'}
- Length: ${lengthGuide[body.length || 'medium']}

${typeTemplates[body.type]}

Make it:
- Engaging and readable
- SEO-friendly (for blog)
- Action-oriented
- Professional yet approachable`;

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
            content: `Create ${body.type} content about: ${body.topic}`,
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

    return new Response(
      JSON.stringify({
        content: data.content[0].text,
        type: body.type,
        tone: body.tone || 'professional',
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
    console.error('Content generation error:', error);
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
