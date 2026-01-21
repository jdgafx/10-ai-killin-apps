/**
 * Question-Answering System
 * Uses Gemini to answer questions about document content
 */

export async function answerQuestion(documentContent, question) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file')
  }

  // Truncate document if too long
  const maxDocLength = 15000
  const truncatedDoc = documentContent.length > maxDocLength
    ? documentContent.substring(0, maxDocLength) + '\n\n[Document truncated for length]'
    : documentContent

  const prompt = `Based on the following document, answer this question: "${question}"

Provide a clear, concise answer based only on the information in the document. If the document doesn't contain the information needed to answer the question, say so.

Document:
${truncatedDoc}`

  try {
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
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate answer'
  } catch (error) {
    console.error('Question answering error:', error)
    throw error
  }
}

export async function generateQuestions(documentContent, count = 5) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Generate ${count} insightful questions that could be asked about this document. These should be questions that can be answered based on the document's content.

Return the questions as a numbered list.

Document:
${documentContent.substring(0, 10000)}`

  try {
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
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Parse numbered list
    return content
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(q => q.length > 0)
  } catch (error) {
    console.error('Question generation error:', error)
    throw error
  }
}

export async function findRelevantSections(documentContent, query) {
  // Simple keyword-based section finding
  // In a production app, this would use embeddings and semantic search
  
  const paragraphs = documentContent.split(/\n\n+/)
  const queryWords = query.toLowerCase().split(/\s+/)
  
  const scored = paragraphs.map(para => {
    const paraLower = para.toLowerCase()
    const score = queryWords.reduce((sum, word) => {
      const count = (paraLower.match(new RegExp(word, 'g')) || []).length
      return sum + count
    }, 0)
    
    return { text: para, score }
  })
  
  return scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(p => p.text)
}
