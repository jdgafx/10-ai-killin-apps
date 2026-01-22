interface Env {
  MINIMAX_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GEMINI_API_KEY: string;
  DEEPSEEK_API_KEY: string;
}

type AIProvider = "minimax" | "claude" | "gemini" | "deepseek";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface Agent {
  name: string;
  role: string;
  provider: AIProvider;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function callMiniMax(
  messages: Message[],
  apiKey: string,
): Promise<string> {
  const response = await fetch(
    "https://api.minimax.chat/v1/text/chatcompletion_v2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "abab6.5-chat",
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0].message.content;
}

async function callAnthropic(
  messages: Message[],
  apiKey: string,
): Promise<string> {
  const systemMessage = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemMessage?.content,
      messages: chatMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    content: Array<{ text: string }>;
  };
  return data.content[0].text;
}

async function callGemini(
  messages: Message[],
  apiKey: string,
): Promise<string> {
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const systemInstruction = messages.find((m) => m.role === "system");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction.content }] }
          : undefined,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };
  return data.candidates[0].content.parts[0].text;
}

async function callDeepSeek(
  messages: Message[],
  apiKey: string,
): Promise<string> {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0].message.content;
}

async function callProvider(
  messages: Message[],
  provider: AIProvider,
  env: Env,
): Promise<string> {
  switch (provider) {
    case "minimax":
      return callMiniMax(messages, env.MINIMAX_API_KEY);
    case "claude":
      return callAnthropic(messages, env.ANTHROPIC_API_KEY);
    case "gemini":
      return callGemini(messages, env.GEMINI_API_KEY);
    case "deepseek":
      return callDeepSeek(messages, env.DEEPSEEK_API_KEY);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

async function chat(
  messages: Message[],
  provider: AIProvider,
  env: Env,
): Promise<{ content: string; provider: AIProvider }> {
  const providers: AIProvider[] = ["claude", "minimax", "gemini", "deepseek"];
  const startIndex = providers.indexOf(provider);
  const orderedProviders = [
    ...providers.slice(startIndex),
    ...providers.slice(0, startIndex),
  ];

  for (const p of orderedProviders) {
    try {
      const content = await callProvider(messages, p, env);
      return { content, provider: p };
    } catch (error) {
      console.error(`Provider ${p} failed:`, error);
      continue;
    }
  }

  throw new Error("All AI providers failed");
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await request.json()) as {
      message: string;
      task?: string;
      agents?: string[];
      mode?: "sequential" | "parallel" | "debate";
      provider?: AIProvider;
      messages?: Message[];
    };

    const mode = body.mode || "sequential";
    const availableAgents: Agent[] = [
      {
        name: "Analyst",
        role: "Analyze the task and break it down into components",
        provider: "claude",
      },
      {
        name: "Researcher",
        role: "Research relevant information and context",
        provider: "gemini",
      },
      {
        name: "Developer",
        role: "Provide technical implementation details",
        provider: "deepseek",
      },
      {
        name: "Reviewer",
        role: "Review and critique the outputs",
        provider: "minimax",
      },
    ];

    const results: Array<{
      agent: string;
      output: string;
      provider: AIProvider;
    }> = [];
    const taskDescription = body.message || body.task || "";

    // Run orchestrator first
    const orchestratorPrompt = `You are the orchestrator of a multi-agent system. Coordinate these agents to solve the task.

Task: ${taskDescription}

Available agents: ${availableAgents.map((a) => `${a.name} (${a.role})`).join(", ")}

Mode: ${mode}

Provide a coordination plan and initial analysis.`;

    const orchestratorResult = await chat(
      [{ role: "user", content: orchestratorPrompt }],
      body.provider || "claude",
      env,
    );

    results.push({
      agent: "Orchestrator",
      output: orchestratorResult.content,
      provider: orchestratorResult.provider,
    });

    // Run agents based on mode
    if (mode === "sequential") {
      // Run Analyst
      const analystMessages: Message[] = [
        { role: "system", content: availableAgents[0].role },
        { role: "user", content: taskDescription },
      ];
      const analystResult = await chat(analystMessages, "claude", env);
      results.push({
        agent: "Analyst",
        output: analystResult.content,
        provider: analystResult.provider,
      });

      // Run Developer with Analyst's output
      const devMessages: Message[] = [
        { role: "system", content: availableAgents[2].role },
        {
          role: "user",
          content: `Task: ${taskDescription}\n\nAnalyst's breakdown: ${analystResult.content}`,
        },
      ];
      const devResult = await chat(devMessages, "deepseek", env);
      results.push({
        agent: "Developer",
        output: devResult.content,
        provider: devResult.provider,
      });
    } else if (mode === "parallel") {
      // Run all agents in parallel
      const agentPromises = availableAgents.map(async (agent) => {
        const messages: Message[] = [
          { role: "system", content: agent.role },
          { role: "user", content: taskDescription },
        ];
        const result = await chat(messages, agent.provider, env);
        return {
          agent: agent.name,
          output: result.content,
          provider: result.provider,
        };
      });

      const parallelResults = await Promise.all(agentPromises);
      results.push(...parallelResults);
    }

    return new Response(
      JSON.stringify({
        response: orchestratorResult.content,
        content: orchestratorResult.content,
        task: taskDescription,
        mode,
        results,
        summary: orchestratorResult.content,
        provider: orchestratorResult.provider,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("Orchestration error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
}
