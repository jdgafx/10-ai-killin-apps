/**
 * Semantic Search Engine
 * Uses AI embeddings for vector similarity search
 */

import { getIndex } from './indexer'

export async function semanticSearch(query, documents, options = {}) {
  const {
    limit = 10,
    threshold = 0.1,
    useAI = true
  } = options

  if (!query || !query.trim()) {
    throw new Error('Search query is required')
  }

  const index = getIndex()
  if (index.length === 0) {
    throw new Error('No documents indexed')
  }

  console.log(`Searching for: "${query}"`)

  // Use AI embeddings if available, otherwise fall back to keyword search
  if (useAI) {
    try {
      return await aiSemanticSearch(query, index, limit, threshold)
    } catch (error) {
      console.warn('AI search failed, falling back to keyword search:', error.message)
      return keywordSearch(query, index, limit, threshold)
    }
  } else {
    return keywordSearch(query, index, limit, threshold)
  }
}

async function aiSemanticSearch(query, index, limit, threshold) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    console.warn('Gemini API key not configured, using keyword search')
    return keywordSearch(query, index, limit, threshold)
  }

  // For this implementation, we'll use Gemini to enhance keyword matching
  // In a production system, you'd use embedding models like text-embedding-004
  
  try {
    // Generate semantic variations of the query using AI
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate 5 alternative phrasings or related terms for this search query: "${query}". Return only the terms, separated by commas.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('AI request failed')
    }

    const data = await response.json()
    const variations = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const expandedQuery = query + ' ' + variations

    // Use expanded query for better semantic matching
    return keywordSearch(expandedQuery, index, limit, threshold)
  } catch (error) {
    console.error('AI semantic search error:', error)
    return keywordSearch(query, index, limit, threshold)
  }
}

function keywordSearch(query, index, limit, threshold) {
  const queryTokens = tokenize(query)
  
  if (queryTokens.length === 0) {
    return []
  }

  // Calculate relevance scores for each document
  const scored = index.map(doc => {
    const score = calculateRelevanceScore(queryTokens, doc)
    return {
      ...doc,
      score: score
    }
  })

  // Filter by threshold and sort by score
  return scored
    .filter(doc => doc.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      date: doc.date,
      score: doc.score
    }))
}

function calculateRelevanceScore(queryTokens, document) {
  let score = 0
  const { tokens, titleTokens, contentTokens } = document

  // Title matches are weighted higher
  const titleScore = calculateTokenOverlap(queryTokens, titleTokens) * 2.0
  const contentScore = calculateTokenOverlap(queryTokens, contentTokens)

  score = titleScore + contentScore

  // Normalize score to 0-1 range
  const maxPossibleScore = queryTokens.length * 3.0
  return Math.min(score / maxPossibleScore, 1.0)
}

function calculateTokenOverlap(queryTokens, docTokens) {
  let overlap = 0

  for (const token of queryTokens) {
    if (docTokens.includes(token)) {
      overlap += 1
    } else {
      // Partial matching for related terms
      const partialMatch = docTokens.some(docToken => 
        docToken.includes(token) || token.includes(docToken)
      )
      if (partialMatch) {
        overlap += 0.5
      }
    }
  }

  return overlap
}

function tokenize(text) {
  if (!text) return []
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2)
}

export function findSimilarDocuments(documentId, limit = 5) {
  const index = getIndex()
  const targetDoc = index.find(doc => doc.id === documentId)
  
  if (!targetDoc) {
    throw new Error('Document not found')
  }

  // Use the document's tokens as the query
  const queryTokens = targetDoc.tokens

  const scored = index
    .filter(doc => doc.id !== documentId)
    .map(doc => ({
      ...doc,
      score: calculateRelevanceScore(queryTokens, doc)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored
}

export function searchByCategory(category) {
  const index = getIndex()
  return index.filter(doc => 
    doc.category && doc.category.toLowerCase() === category.toLowerCase()
  )
}
