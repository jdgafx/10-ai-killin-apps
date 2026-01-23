/**
 * Conversation Management
 * Handles AI conversation logic with MiniMax
 */

const conversationHistory = [];
const MAX_HISTORY = 10;

export async function sendMessage(userMessage) {
  // Add user message to history
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  // Keep only recent messages
  if (conversationHistory.length > MAX_HISTORY * 2) {
    conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY * 2);
  }

  try {
    // Call Cloudflare Function (API keys stored securely server-side)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        messages: conversationHistory.slice(-MAX_HISTORY * 2), // Send recent history
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const aiResponse =
      data.response || data.content || "Sorry, I did not understand that.";

    // Add AI response to history
    conversationHistory.push({
      role: "assistant",
      content: aiResponse,
    });

    return aiResponse;
  } catch (error) {
    console.error("Conversation error:", error);
    throw error;
  }
}

export function clearHistory() {
  conversationHistory.length = 0;
}

export function getHistory() {
  return [...conversationHistory];
}

export { conversationHistory };
