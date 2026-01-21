/**
 * Document Indexer
 * Creates and manages the search index
 */

let documentIndex = []

export async function indexDocuments(documents) {
  if (!documents || documents.length === 0) {
    throw new Error('No documents to index')
  }

  console.log(`Indexing ${documents.length} documents...`)

  // Create index with document metadata
  documentIndex = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    category: doc.category,
    date: doc.date,
    // Pre-compute tokens for faster searching
    tokens: tokenize(doc.title + ' ' + doc.content),
    titleTokens: tokenize(doc.title),
    contentTokens: tokenize(doc.content)
  }))

  console.log(`Successfully indexed ${documentIndex.length} documents`)
  return documentIndex
}

export function getIndex() {
  return documentIndex
}

export function getIndexSize() {
  return documentIndex.length
}

export function clearIndex() {
  documentIndex = []
  console.log('Index cleared')
}

export function addToIndex(document) {
  const indexed = {
    id: document.id,
    title: document.title,
    content: document.content,
    category: document.category,
    date: document.date,
    tokens: tokenize(document.title + ' ' + document.content),
    titleTokens: tokenize(document.title),
    contentTokens: tokenize(document.content)
  }

  documentIndex.push(indexed)
  console.log(`Added document ${document.id} to index`)
  return indexed
}

export function removeFromIndex(documentId) {
  const initialLength = documentIndex.length
  documentIndex = documentIndex.filter(doc => doc.id !== documentId)
  const removed = initialLength - documentIndex.length
  console.log(`Removed ${removed} document(s) from index`)
  return removed > 0
}

function tokenize(text) {
  if (!text) return []
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2) // Remove short words
}

export function getDocumentById(id) {
  return documentIndex.find(doc => doc.id === id)
}

export function getDocumentsByCategory(category) {
  return documentIndex.filter(doc => 
    doc.category && doc.category.toLowerCase() === category.toLowerCase()
  )
}

export function getAllCategories() {
  const categories = new Set()
  documentIndex.forEach(doc => {
    if (doc.category) {
      categories.add(doc.category)
    }
  })
  return Array.from(categories)
}

export function getIndexStats() {
  const totalDocs = documentIndex.length
  const totalTokens = documentIndex.reduce((sum, doc) => sum + doc.tokens.length, 0)
  const avgTokens = totalDocs > 0 ? totalTokens / totalDocs : 0
  const categories = getAllCategories()

  return {
    documentCount: totalDocs,
    totalTokens,
    averageTokensPerDocument: Math.round(avgTokens),
    categories: categories.length,
    categoryList: categories
  }
}
