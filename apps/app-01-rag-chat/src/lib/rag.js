/**
 * Vector Store Implementation
 * Client-side vector storage using localStorage with cosine similarity search
 */

class LocalVectorStore {
  constructor() {
    this.store = new Map()
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return
    
    const stored = localStorage.getItem('vectorStore')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        Object.entries(data).forEach(([id, vector]) => {
          this.store.set(id, vector)
        })
      } catch (error) {
        console.error('Failed to load vector store:', error)
      }
    }
    this.initialized = true
  }

  async addDocument(id, text, embedding, metadata = {}) {
    await this.initialize()
    this.store.set(id, {
      text,
      embedding,
      metadata,
      timestamp: Date.now(),
    })
    this.persist()
  }

  async addDocuments(documents) {
    await this.initialize()
    for (const doc of documents) {
      this.store.set(doc.id, {
        text: doc.text,
        embedding: doc.embedding,
        metadata: doc.metadata || {},
        timestamp: Date.now(),
      })
    }
    this.persist()
  }

  async search(queryEmbedding, topK = 5) {
    await this.initialize()
    
    const results = []
    for (const [id, doc] of this.store) {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding)
      results.push({ id, ...doc, similarity })
    }
    
    results.sort((a, b) => b.similarity - a.similarity)
    return results.slice(0, topK)
  }

  async getAllDocuments() {
    await this.initialize()
    return Array.from(this.store.entries()).map(([id, doc]) => ({ id, ...doc }))
  }

  async deleteDocument(id) {
    await this.initialize()
    this.store.delete(id)
    this.persist()
  }

  persist() {
    const data = {}
    this.store.forEach((value, key) => {
      data[key] = value
    })
    localStorage.setItem('vectorStore', JSON.stringify(data))
  }

  clear() {
    this.store.clear()
    localStorage.removeItem('vectorStore')
  }

  size() {
    return this.store.size
  }
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

export const vectorStore = new LocalVectorStore()
