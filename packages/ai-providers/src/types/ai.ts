/**
 * AI Provider Types
 * Supports MiniMax, Claude (Anthropic), Gemini, DeepSeek, and Workers AI (fallback)
 */

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export type AIProvider =
  | "minimax"
  | "claude"
  | "gemini"
  | "deepseek"
  | "workers-ai";

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export type TaskType =
  | "chat"
  | "code"
  | "reasoning"
  | "creative"
  | "multimodal";

export interface ChatOptions {
  provider?: AIProvider;
  task?: TaskType;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// Environment bindings type for Cloudflare Workers
export interface Env {
  // API Keys (secrets)
  MINIMAX_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GEMINI_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  GITHUB_COPILOT_TOKEN?: string; // Optional: for Claude via Copilot API

  // Cloudflare bindings (fallback only)
  AI?: any; // Workers AI
  VECTORIZE?: any; // Vectorize
  DB?: any; // D1
  BUCKET?: any; // R2

  // Configuration
  DEFAULT_AI_PROVIDER?: string;
  ENVIRONMENT?: string;
}
