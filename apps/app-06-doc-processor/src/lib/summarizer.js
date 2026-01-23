/**
 * Document Summarizer using Backend API
 * Provides comprehensive document analysis
 */

export async function summarizeDocument(documentContent, mode = "brief") {
  if (!documentContent || typeof documentContent !== "string") {
    throw new Error("Valid document content is required");
  }

  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document: documentContent,
      task: "summarize",
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

export async function analyzeDocument(documentContent) {
  if (!documentContent || typeof documentContent !== "string") {
    throw new Error("Valid document content is required");
  }

  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document: documentContent,
      task: "analyze",
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Try to parse JSON from response
  try {
    const jsonMatch =
      data.result.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) ||
      data.result.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (typeof parsed.keywords === "string") {
        parsed.keywords = parsed.keywords.split(",").map((k) => k.trim());
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse analysis JSON:", e);
  }

  return {
    summary: data.result,
    themes: [],
    keywords: [],
    sentiment: "Neutral",
    type: "Document",
    entities: [],
  };
}

export async function extractKeywords(documentContent, count = 15) {
  if (!documentContent || typeof documentContent !== "string") {
    throw new Error("Valid document content is required");
  }

  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      document: documentContent.substring(0, 10000),
      task: "extract",
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data.result
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
    .slice(0, count);
}
