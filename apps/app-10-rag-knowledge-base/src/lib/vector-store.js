export class SimpleVectorStore {
  constructor() {
    this.vectors = new Map()
    this.documents = new Map()
  }

  async addDocument(id, content, embedding) {
    this.vectors.set(id, embedding)
    this.documents.set(id, content)
  }

  async search(queryEmbedding, topK = 5) {
    const results = []

    for (const [id, docEmbedding] of this.vectors) {
      const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding)
      results.push({
        id,
        similarity,
        content: this.documents.get(id)
      })
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
  }

  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  delete(id) {
    this.vectors.delete(id)
    this.documents.delete(id)
  }

  clear() {
    this.vectors.clear()
    this.documents.clear()
  }

  size() {
    return this.vectors.size
  }
}

export function createSimpleEmbedding(text) {
  const words = text.toLowerCase().split(/\s+/)
  const wordFreq = new Map()

  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })

  const dimensions = 384
  const embedding = new Array(dimensions).fill(0)

  words.forEach((word, idx) => {
    const hash = simpleHash(word)
    for (let i = 0; i < dimensions; i++) {
      embedding[i] += Math.sin(hash + i * 0.1) * (wordFreq.get(word) || 1)
    }
  })

  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map(val => val / (norm || 1))
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function bm25Score(query, document, avgDocLength, k1 = 1.5, b = 0.75) {
  const queryTerms = query.toLowerCase().split(/\s+/)
  const docTerms = document.toLowerCase().split(/\s+/)
  const docLength = docTerms.length

  const termFreq = new Map()
  docTerms.forEach(term => {
    termFreq.set(term, (termFreq.get(term) || 0) + 1)
  })

  let score = 0
  queryTerms.forEach(term => {
    const tf = termFreq.get(term) || 0
    const numerator = tf * (k1 + 1)
    const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength))
    score += numerator / denominator
  })

  return score
}
