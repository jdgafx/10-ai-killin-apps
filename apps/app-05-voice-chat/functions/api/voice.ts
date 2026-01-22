// Cloudflare Worker for Voice Chat with Groq Whisper + Claude
interface Env {
  GROQ_API_KEY: string;
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
      audio?: string; // base64 encoded audio
      text?: string; // direct text input
      mode: 'transcribe' | 'chat' | 'full';
    };
    console.log('Voice chat request:', { mode: body.mode });

    let transcript = body.text || '';

    // Step 1: Transcribe audio if provided
    if (body.mode !== 'chat' && body.audio) {
      const audioBuffer = Uint8Array.from(atob(body.audio), c => c.charCodeAt(0));
      const formData = new FormData();
      formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
      formData.append('model', 'whisper-large-v3');

      const whisperResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: formData,
      });

      if (!whisperResponse.ok) {
        const error = await whisperResponse.text();
        console.error('Groq Whisper error:', error);
        throw new Error(`Transcription error: ${whisperResponse.status}`);
      }

      const whisperData = await whisperResponse.json() as any;
      transcript = whisperData.text;
    }

    if (body.mode === 'transcribe') {
      return new Response(
        JSON.stringify({ transcript }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Step 2: Generate response with Claude
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: transcript }],
      }),
    });

    if (!claudeResponse.ok) {
      const error = await claudeResponse.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json() as any;

    return new Response(
      JSON.stringify({
        transcript,
        response: claudeData.content[0].text,
        usage: claudeData.usage,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Voice chat error:', error);
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
