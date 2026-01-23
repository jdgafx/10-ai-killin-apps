import { getIndex } from "./indexer";

export async function semanticSearch(query, documents, options = {}) {
  const { limit = 10, threshold = 0.1, useAI = true } = options;

  if (!query || !query.trim()) {
    throw new Error("Search query is required");
  }

  const index = getIndex();
  if (index.length === 0) {
    throw new Error("No documents indexed");
  }

  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      documents: index.map((doc) => `[${doc.id}] ${doc.title}\n${doc.content}`),
      topK: limit,
    }),
  });

  if (!response.ok) {
    console.warn("AI search failed, falling back to keyword search");
    return keywordSearch(query, index, limit, threshold);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return keywordSearch(query, index, limit, threshold);
  }

  return data.results
    .map((result) => {
      const doc = index[result.id];
      return doc
        ? {
            ...doc,
            score: result.score,
            relevanceReason: result.reason,
          }
        : null;
    })
    .filter((doc) => doc !== null);
}

function keywordSearch(query, index, limit, threshold) {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  const scored = index.map((doc) => {
    const score = calculateRelevanceScore(queryTokens, doc);
    return {
      ...doc,
      score: score,
    };
  });

  return scored
    .filter((doc) => doc.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      date: doc.date,
      score: doc.score,
    }));
}

function calculateRelevanceScore(queryTokens, document) {
  let score = 0;
  const { tokens, titleTokens, contentTokens } = document;

  const titleScore = calculateTokenOverlap(queryTokens, titleTokens) * 2.0;
  const contentScore = calculateTokenOverlap(queryTokens, contentTokens);

  score = titleScore + contentScore;

  const maxPossibleScore = queryTokens.length * 3.0;
  return Math.min(score / maxPossibleScore, 1.0);
}

function calculateTokenOverlap(queryTokens, docTokens) {
  let overlap = 0;

  for (const token of queryTokens) {
    if (docTokens.includes(token)) {
      overlap += 1;
    } else {
      const partialMatch = docTokens.some(
        (docToken) => docToken.includes(token) || token.includes(docToken),
      );
      if (partialMatch) {
        overlap += 0.5;
      }
    }
  }

  return overlap;
}

function tokenize(text) {
  if (!text) return [];

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function findSimilarDocuments(documentId, limit = 5) {
  const index = getIndex();
  const targetDoc = index.find((doc) => doc.id === documentId);

  if (!targetDoc) {
    throw new Error("Document not found");
  }

  const queryTokens = targetDoc.tokens;

  const scored = index
    .filter((doc) => doc.id !== documentId)
    .map((doc) => ({
      ...doc,
      score: calculateRelevanceScore(queryTokens, doc),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

export function searchByCategory(category) {
  const index = getIndex();
  return index.filter(
    (doc) =>
      doc.category && doc.category.toLowerCase() === category.toLowerCase(),
  );
}
