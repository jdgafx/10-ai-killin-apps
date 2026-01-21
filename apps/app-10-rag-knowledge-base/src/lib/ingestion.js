export async function ingestDocument(title, content, metadata = {}) {
  const document = {
    id: Date.now().toString(),
    title,
    content,
    metadata,
    createdAt: new Date().toISOString(),
    chunks: chunkDocument(content)
  }

  return document
}

export function chunkDocument(content, chunkSize = 500, overlap = 50) {
  const words = content.split(/\s+/)
  const chunks = []
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim().length > 0) {
      chunks.push({
        id: `chunk-${i}`,
        content: chunk,
        startIndex: i,
        wordCount: chunk.split(/\s+/).length
      })
    }
  }

  return chunks
}

export function deleteDocument(docId) {
  // In a real implementation, this would delete from vector store
  console.log(`Deleting document ${docId}`)
}

export function preprocessText(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
}

export function extractMetadata(content) {
  const metadata = {
    wordCount: content.split(/\s+/).length,
    charCount: content.length,
    paragraphs: content.split(/\n\n+/).length,
    estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200) // 200 words per minute
  }

  // Extract potential headings (lines ending with : or all caps)
  const lines = content.split('\n')
  const headings = lines.filter(line => {
    const trimmed = line.trim()
    return trimmed.length > 0 && (
      trimmed.endsWith(':') || 
      (trimmed === trimmed.toUpperCase() && trimmed.length > 3)
    )
  })

  if (headings.length > 0) {
    metadata.headings = headings
  }

  return metadata
}

export function validateDocument(title, content) {
  const errors = []

  if (!title || title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required')
  }

  if (content && content.trim().length < 50) {
    errors.push('Content too short (minimum 50 characters)')
  }

  if (content && content.trim().length > 1000000) {
    errors.push('Content too large (maximum 1MB)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
