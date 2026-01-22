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

interface Document {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
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
        temperature: 0.3,
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
          temperature: 0.3,
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
      temperature: 0.3,
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

async function chat(
  messages: Message[],
  provider: AIProvider,
  env: Env,
): Promise<{ content: string; provider: AIProvider }> {
  const providers: AIProvider[] = ["claude", "gemini", "minimax", "deepseek"];
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
      query?: string;
      documents?: Document[];
      topK?: number;
      includeSource?: boolean;
      provider?: AIProvider;
      messages?: Message[];
    };

    const topK = body.topK || 3;
    const query = body.message || body.query || "";
    let relevantDocs: Document[] = [];

    // Step 1: Retrieve relevant documents if provided
    if (body.documents && body.documents.length > 0) {
      const retrievalPrompt = `Given this query: "${query}"
      
Find the ${topK} most relevant documents and return ONLY their IDs as a JSON array.

Documents:
${body.documents.map((doc) => `[${doc.id}] ${doc.content.substring(0, 200)}...`).join("\n\n")}

Output format: ["id1", "id2", "id3"]`;

      const retrievalResult = await chat(
        [{ role: "user", content: retrievalPrompt }],
        body.provider || "claude",
        env,
      );

      try {
        const relevantIds = JSON.parse(retrievalResult.content);
        relevantDocs = body.documents.filter((doc) =>
          relevantIds.includes(doc.id),
        );
      } catch {
        relevantDocs = body.documents.slice(0, topK);
      }
    }

    // Step 2: Generate answer using retrieved context
    const context = relevantDocs.map((doc) => doc.content).join("\n\n---\n\n");

    const answerSystemPrompt = `You are a RAG (Retrieval-Augmented Generation) assistant. Answer questions using ONLY the provided context. If the answer is not in the context, say so clearly.

Be:
- Accurate and factual
- Concise but complete
- Cite sources when applicable`;

    const answerPrompt = context
      ? `Context:\n${context}\n\nQuestion: ${query}\n\nProvide a clear, accurate answer with citations to the source documents when applicable.`
      : query;

    const messages: Message[] = [
      { role: "system", content: answerSystemPrompt },
      ...(body.messages || []),
      { role: "user", content: answerPrompt },
    ];

    const result = await chat(messages, body.provider || "claude", env);

    return new Response(
      JSON.stringify({
        response: result.content,
        content: result.content,
        answer: result.content,
        sources:
          body.includeSource !== false
            ? relevantDocs.map((doc) => ({
                id: doc.id,
                snippet: doc.content.substring(0, 200) + "...",
                metadata: doc.metadata,
              }))
            : undefined,
        provider: result.provider,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error("RAG error:", error);
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
