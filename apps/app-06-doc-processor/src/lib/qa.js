/**
 * Q&A System using Backend API
 * Document question answering and question generation
 */

export async function answerQuestion(documentContent, question) {
  if (!documentContent || !question) {
    throw new Error("Document content and question are required");
  }

  const prompt = `Based on this document, answer: "${question}"\n\nDocument:\n${documentContent.substring(0, 15000)}`;

  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document: prompt,
      task: "analyze",
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

export async function generateQuestions(documentContent, count = 5) {
  if (!documentContent) {
    throw new Error("Document content is required");
  }

  const prompt = `Generate ${count} insightful questions about this document:\n\n${documentContent.substring(0, 10000)}`;

  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document: prompt,
      task: "extract",
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data.result
    .split("\n")
    .filter((line) => /^\d+\./.test(line.trim()))
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((q) => q.length > 0);
}

export async function chatWithDocument(documentContent, conversation) {
  if (!documentContent || !conversation || conversation.length === 0) {
    throw new Error("Document content and conversation history are required");
  }

  const lastMessage = conversation[conversation.length - 1];
  if (!lastMessage || !lastMessage.content) {
    throw new Error("Invalid conversation format");
  }

  return answerQuestion(documentContent, lastMessage.content);
}
