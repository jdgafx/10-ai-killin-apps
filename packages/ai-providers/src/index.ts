/**
 * Unified AI Provider Layer
 * Supports MiniMax, Google Gemini, and DeepSeek
 */

// Provider types
export type { AIProvider, ChatMessage, ChatResponse } from './types'

// Provider implementations
export * from './minimax'
export * from './gemini'
export * from './deepseek'

// Configuration
export { AI_PROVIDERS, AI_MODELS, CONFIG } from './config'

// Hooks
export { useAIProvider } from './hooks/useAIProvider'
