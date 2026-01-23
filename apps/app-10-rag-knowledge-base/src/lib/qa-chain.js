export async function answerQuestion(question, relevantDocs) {
  if (relevantDocs.length === 0) {
    return {
      answer:
        "I couldn't find any relevant information to answer your question. Please try rephrasing or add more documents to the knowledge base.",
      sources: [],
      confidence: 0,
    };
  }

  const documents = relevantDocs.map((doc) => ({
    id: doc.document.id || String(Math.random()),
    content: `${doc.document.title}\n\n${doc.chunk.content}`,
    metadata: doc.document.metadata || {},
  }));

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: question,
      documents: documents,
      topK: Math.min(relevantDocs.length, 5),
      includeSource: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  const sources = relevantDocs.map((doc) => ({
    title: doc.document.title,
    content: doc.chunk.content.slice(0, 200) + "...",
    relevance: doc.relevance,
    metadata: doc.document.metadata,
  }));

  return {
    answer: data.response || data.answer,
    sources,
    confidence: calculateConfidence(relevantDocs),
  };
}

export function calculateConfidence(relevantDocs) {
  if (relevantDocs.length === 0) return 0;

  const avgRelevance =
    relevantDocs.reduce((sum, doc) => sum + (doc.relevance || 0), 0) /
    relevantDocs.length;

  const numSources = Math.min(relevantDocs.length / 3, 1);

  return avgRelevance * 0.7 + numSources * 0.3;
}

export async function generateFollowUpQuestions(question, answer, context) {
  const prompt = `Based on this Q&A, suggest 3 relevant follow-up questions:

Question: ${question}
Answer: ${answer.slice(0, 200)}

Generate 3 follow-up questions that would help explore this topic deeper.
Format: Return only the questions, one per line.`;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: prompt,
    }),
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return (data.response || data.answer)
    .split("\n")
    .filter((q) => q.trim().length > 0)
    .slice(0, 3);
}

export async function summarizeContext(documents) {
  const combinedContent = documents
    .map((doc) => doc.content)
    .join("\n\n")
    .slice(0, 10000);

  const prompt = `Provide a brief summary (3-5 sentences) of the following documents:

${combinedContent}

Summary:`;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: prompt,
    }),
  });

  if (!response.ok) {
    return "Unable to generate summary at this time.";
  }

  const data = await response.json();
  return data.response || data.answer;
}

export function formatSourceCitations(sources) {
  return sources
    .map(
      (source, idx) =>
        `[${idx + 1}] ${source.title} (Relevance: ${Math.round((source.relevance || 0) * 100)}%)`,
    )
    .join("\n");
}
