import { Message, AIResponse } from "../types/ai";

export class MiniMaxProvider {
  private apiKey: string;
  private baseUrl = "https://api.minimax.chat/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(
    messages: Message[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {},
  ): Promise<AIResponse> {
    const {
      model = "abab6.5-chat",
      temperature = 0.7,
      maxTokens = 4096,
      stream = false,
    } = options;

    const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MiniMax API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
      usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    };

    return {
      content: data.choices[0].message.content,
      model,
      provider: "minimax",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  async chatStream(
    messages: Message[],
    options: { model?: string; temperature?: number } = {},
  ): Promise<ReadableStream> {
    const { model = "abab6.5-chat", temperature = 0.7 } = options;

    const response = await fetch(`${this.baseUrl}/text/chatcompletion_v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`MiniMax streaming error: ${response.status}`);
    }

    return response.body!;
  }
}
