// Cloudflare Worker for Agent Orchestrator - Multi-Agent System
interface Env {
  ANTHROPIC_API_KEY: string;
  OPENROUTER_API_KEY: string;
  DEEPSEEK_API_KEY: string;
}

interface Agent {
  name: string;
  role: string;
  model: string;
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
      task: string;
      agents?: string[];
      mode?: 'sequential' | 'parallel' | 'debate';
    };
    console.log('Agent orchestration request:', body);

    const availableAgents: Agent[] = [
      { name: 'Analyst', role: 'Analyze the task and break it down into components', model: 'claude' },
      { name: 'Researcher', role: 'Research relevant information and context', model: 'openrouter' },
      { name: 'Developer', role: 'Provide technical implementation details', model: 'deepseek' },
      { name: 'Reviewer', role: 'Review and critique the outputs', model: 'claude' },
    ];

    const mode = body.mode || 'sequential';
    const results: any[] = [];

    // Orchestrator prompt
    const orchestratorPrompt = `You are the orchestrator of a multi-agent system. Coordinate these agents to solve the task.

Task: ${body.task}

Available agents: ${availableAgents.map(a => `${a.name} (${a.role})`).join(', ')}

Mode: ${mode}

Provide a coordination plan and synthesize the results.`;

    // Run orchestrator with Claude
    const orchestratorResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: orchestratorPrompt }],
      }),
    });

    const orchestratorData = await orchestratorResponse.json() as any;
    results.push({
      agent: 'Orchestrator',
      output: orchestratorData.content[0].text,
    });

    // Execute agents based on mode
    if (mode === 'sequential') {
      // Run Analyst first
      const analystResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: availableAgents[0].role,
          messages: [{ role: 'user', content: body.task }],
        }),
      });

      const analystData = await analystResponse.json() as any;
      results.push({
        agent: 'Analyst',
        output: analystData.content[0].text,
      });

      // Run Developer with Analyst's output
      const devResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: availableAgents[2].role },
            {
              role: 'user',
              content: `Task: ${body.task}\n\nAnalyst's breakdown: ${analystData.content[0].text}`,
            },
          ],
          max_tokens: 1024,
        }),
      });

      const devData = await devResponse.json() as any;
      results.push({
        agent: 'Developer',
        output: devData.choices[0].message.content,
      });
    }

    return new Response(
      JSON.stringify({
        task: body.task,
        mode,
        results,
        summary: orchestratorData.content[0].text,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Orchestration error:', error);
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
