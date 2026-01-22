import { MiniMaxProvider } from "./providers/minimax";
import { AnthropicProvider } from "./providers/anthropic";
import { GeminiProvider } from "./providers/gemini";
import { DeepSeekProvider } from "./providers/deepseek";
import {
  Message,
  AIResponse,
  AIProvider,
  Env,
  ChatOptions,
  TaskType,
} from "./types/ai";

export class AIRouter {
  private minimax: MiniMaxProvider;
  private claude: AnthropicProvider;
  private gemini: GeminiProvider;
  private deepseek: DeepSeekProvider;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.minimax = new MiniMaxProvider(env.MINIMAX_API_KEY);
    this.claude = new AnthropicProvider(env.ANTHROPIC_API_KEY);
    this.gemini = new GeminiProvider(env.GEMINI_API_KEY);
    this.deepseek = new DeepSeekProvider(env.DEEPSEEK_API_KEY);
  }

  async chat(
    messages: Message[],
    options: ChatOptions = {},
  ): Promise<AIResponse> {
    const provider = options.provider || this.selectProvider(options.task);

    try {
      return await this.routeToProvider(provider, messages, options);
    } catch (error) {
      console.error(`Provider ${provider} failed:`, error);
      return await this.fallbackChain(provider, messages, options);
    }
  }

  private selectProvider(task?: TaskType): AIProvider {
    switch (task) {
      case "code":
        return "deepseek";
      case "reasoning":
        return "claude";
      case "multimodal":
        return "gemini";
      case "creative":
        return "minimax";
      case "chat":
      default:
        return "minimax";
    }
  }

  private async routeToProvider(
    provider: AIProvider,
    messages: Message[],
    options: ChatOptions,
  ): Promise<AIResponse> {
    switch (provider) {
      case "minimax":
        return await this.minimax.chat(messages, options);
      case "claude":
        return await this.claude.chat(messages, options);
      case "gemini":
        return await this.gemini.chat(messages, options);
      case "deepseek":
        return await this.deepseek.chat(messages, options);
      case "workers-ai":
        return await this.workersAIFallback(messages);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async fallbackChain(
    failedProvider: AIProvider,
    messages: Message[],
    options: ChatOptions,
  ): Promise<AIResponse> {
    const fallbackOrder: AIProvider[] = [
      "minimax",
      "gemini",
      "deepseek",
      "claude",
      "workers-ai",
    ];

    const remaining = fallbackOrder.filter((p) => p !== failedProvider);

    for (const provider of remaining) {
      try {
        console.log(`Trying fallback provider: ${provider}`);
        return await this.routeToProvider(provider, messages, options);
      } catch (error) {
        console.error(`Fallback ${provider} also failed:`, error);
        continue;
      }
    }

    throw new Error("All AI providers failed");
  }

  private async workersAIFallback(messages: Message[]): Promise<AIResponse> {
    if (!this.env.AI) {
      throw new Error("Workers AI not available");
    }

    console.warn("Using Workers AI fallback - all primary providers failed");

    const response = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages,
    });

    return {
      content: response.response,
      model: "@cf/meta/llama-3.1-8b-instruct",
      provider: "workers-ai",
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.env.AI) {
      throw new Error("Workers AI not available for embeddings");
    }

    const response = await this.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [text],
    });
    return response.data[0];
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.env.AI) {
      throw new Error("Workers AI not available for embeddings");
    }

    const response = await this.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: texts,
    });
    return response.data;
  }
}

export function createAIRouter(env: Env): AIRouter {
  return new AIRouter(env);
}
