/**
 * Conversation Management
 * Handles AI conversation logic with MiniMax
 */

const conversationHistory = []
const MAX_HISTORY = 10

export async function sendMessage(userMessage) {
  // Check for API key
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY
  if (!apiKey) {
    throw new Error('MiniMax API key not configured. Please add VITE_MINIMAX_API_KEY to your .env file')
  }

  // Add user message to history
  conversationHistory.push({
    role: 'user',
    content: userMessage
  })

  // Keep only recent messages
  if (conversationHistory.length > MAX_HISTORY * 2) {
    conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY * 2)
  }

  try {
    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'abab6.5-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and friendly AI assistant having a natural voice conversation. Keep responses concise and conversational (2-3 sentences maximum). Be warm and engaging.'
          },
          ...conversationHistory
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I did not understand that.'

    // Add AI response to history
    conversationHistory.push({
      role: 'assistant',
      content: aiResponse
    })

    return aiResponse
  } catch (error) {
    console.error('Conversation error:', error)
    throw error
  }
}

export function clearHistory() {
  conversationHistory.length = 0
}

export function getHistory() {
  return [...conversationHistory]
}

export { conversationHistory }
