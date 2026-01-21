import { createSimpleEmbedding, bm25Score } from './vector-store'

export async function searchDocuments(query, documents, topK = 3) {
  if (documents.length === 0) {
    return []
  }

  const avgDocLength = documents.reduce((sum, doc) => 
    sum + doc.content.split(/\s+/).length, 0
  ) / documents.length

  const results = documents.map(doc => {
    const chunks = doc.chunks || [{ content: doc.content }]
    
    const chunkScores = chunks.map(chunk => {
      const semanticScore = calculateSemanticSimilarity(query, chunk.content)
      const keywordScore = bm25Score(query, chunk.content, avgDocLength)
      
      return {
        chunk,
        score: (semanticScore * 0.6) + (keywordScore * 0.4),
        semanticScore,
        keywordScore
      }
    })

    const bestChunk = chunkScores.reduce((best, current) => 
      current.score > best.score ? current : best
    )

    return {
      document: doc,
      chunk: bestChunk.chunk,
      score: bestChunk.score,
      relevance: Math.min(bestChunk.score / 10, 1)
    }
  })

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

export function calculateSemanticSimilarity(query, text) {
  const queryWords = new Set(query.toLowerCase().split(/\s+/))
  const textWords = text.toLowerCase().split(/\s+/)
  
  let matches = 0
  textWords.forEach(word => {
    if (queryWords.has(word)) matches++
  })

  const overlap = matches / queryWords.size
  const coverage = matches / textWords.length
  
  return (overlap * 0.7) + (coverage * 0.3)
}

export function rerankResults(results, query) {
  const queryWords = query.toLowerCase().split(/\s+/)
  
  return results.map(result => {
    let boost = 1.0
    
    const titleMatch = queryWords.some(word => 
      result.document.title.toLowerCase().includes(word)
    )
    if (titleMatch) boost *= 1.3
    
    const exactMatch = result.chunk.content.toLowerCase().includes(query.toLowerCase())
    if (exactMatch) boost *= 1.5
    
    if (result.document.metadata?.tags) {
      const tagMatch = result.document.metadata.tags.some(tag =>
        queryWords.some(word => tag.toLowerCase().includes(word))
      )
      if (tagMatch) boost *= 1.2
    }

    return {
      ...result,
      score: result.score * boost,
      relevance: Math.min((result.relevance || 0) * boost, 1)
    }
  }).sort((a, b) => b.score - a.score)
}

export function extractRelevantPassages(document, query, maxLength = 300) {
  const sentences = document.content.split(/[.!?]+/)
  const queryWords = new Set(query.toLowerCase().split(/\s+/))
  
  const scoredSentences = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/)
    const matches = sentenceWords.filter(word => queryWords.has(word)).length
    
    return {
      sentence: sentence.trim(),
      score: matches / Math.sqrt(sentenceWords.length)
    }
  })

  const relevant = scoredSentences
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return relevant.map(s => s.sentence).join('. ')
}

export function highlightMatches(text, query) {
  const queryWords = query.toLowerCase().split(/\s+/)
  let highlighted = text

  queryWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    highlighted = highlighted.replace(regex, match => `**${match}**`)
  })

  return highlighted
}
