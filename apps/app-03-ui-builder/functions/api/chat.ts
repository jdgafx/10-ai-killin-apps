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
        max_tokens: 4096,
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
      max_tokens: 4096,
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
          maxOutputTokens: 4096,
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
      max_tokens: 4096,
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

async function chat(
  messages: Message[],
  provider: AIProvider,
  env: Env,
): Promise<{ content: string; provider: AIProvider }> {
  const providers: AIProvider[] = ["minimax", "gemini", "deepseek", "claude"];
  const startIndex = providers.indexOf(provider);
  const orderedProviders = [
    ...providers.slice(startIndex),
    ...providers.slice(0, startIndex),
  ];

  for (const p of orderedProviders) {
    try {
      let content: string;
      switch (p) {
        case "minimax":
          content = await callMiniMax(messages, env.MINIMAX_API_KEY);
          break;
        case "claude":
          content = await callAnthropic(messages, env.ANTHROPIC_API_KEY);
          break;
        case "gemini":
          content = await callGemini(messages, env.GEMINI_API_KEY);
          break;
        case "deepseek":
          content = await callDeepSeek(messages, env.DEEPSEEK_API_KEY);
          break;
      }
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
      description?: string;
      framework?: string;
      provider?: AIProvider;
      messages?: Message[];
    };

    const framework = body.framework || "react";
    const systemPrompt = `You are an expert UI developer. Generate production-ready ${framework} code with Tailwind CSS.

Requirements:
- Use shadcn/ui components where applicable
- Include proper TypeScript types
- Use modern React patterns (hooks, functional components)
- Implement responsive design
- Add proper accessibility attributes
- Include inline comments for complex logic

Output ONLY the code wrapped in code blocks, no explanations before or after.`;

    const userMessage = body.message || body.description || "";

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      ...(body.messages || []),
      {
        role: "user",
        content: `Generate a ${framework} component for: ${userMessage}`,
      },
    ];

    const provider = body.provider || "minimax";
    const result = await chat(messages, provider, env);

    return new Response(
      JSON.stringify({
        response: result.content,
        content: result.content,
        code: result.content,
        framework,
        provider: result.provider,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("UI generation error:", error);
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
