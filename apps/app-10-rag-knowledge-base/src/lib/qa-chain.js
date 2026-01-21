import { chat } from 'ai-providers'

export async function answerQuestion(question, relevantDocs) {
  if (relevantDocs.length === 0) {
    return {
      answer: "I couldn't find any relevant information to answer your question. Please try rephrasing or add more documents to the knowledge base.",
      sources: [],
      confidence: 0
    }
  }

  const context = relevantDocs
    .map((doc, idx) => `[Source ${idx + 1}: ${doc.document.title}]\n${doc.chunk.content}`)
    .join('\n\n---\n\n')

  const prompt = `You are a helpful AI assistant. Answer the question based ONLY on the provided context. If the context doesn't contain enough information to answer the question, say so.

Context:
${context}

Question: ${question}

Instructions:
1. Provide a clear, concise answer based on the context
2. Cite which sources you used (e.g., "According to Source 1...")
3. If information is insufficient, state what's missing
4. Be accurate and don't make assumptions

Answer:`

  try {
    const response = await chat([
      { role: 'system', content: 'You are a precise RAG assistant that only answers based on provided context.' },
      { role: 'user', content: prompt }
    ])

    const sources = relevantDocs.map(doc => ({
      title: doc.document.title,
      content: doc.chunk.content.slice(0, 200) + '...',
      relevance: doc.relevance,
      metadata: doc.document.metadata
    }))

    return {
      answer: response.content,
      sources,
      confidence: calculateConfidence(relevantDocs)
    }
  } catch (error) {
    return {
      answer: `Error generating answer: ${error.message}. Here's what I found:\n\n${relevantDocs[0].chunk.content.slice(0, 300)}...`,
      sources: relevantDocs.map(doc => ({
        title: doc.document.title,
        content: doc.chunk.content.slice(0, 200) + '...',
        relevance: doc.relevance
      })),
      confidence: 0.5
    }
  }
}

export function calculateConfidence(relevantDocs) {
  if (relevantDocs.length === 0) return 0
  
  const avgRelevance = relevantDocs.reduce((sum, doc) => 
    sum + (doc.relevance || 0), 0
  ) / relevantDocs.length

  const numSources = Math.min(relevantDocs.length / 3, 1)
  
  return (avgRelevance * 0.7) + (numSources * 0.3)
}

export async function generateFollowUpQuestions(question, answer, context) {
  const prompt = `Based on this Q&A, suggest 3 relevant follow-up questions:

Question: ${question}
Answer: ${answer.slice(0, 200)}

Generate 3 follow-up questions that would help explore this topic deeper.
Format: Return only the questions, one per line.`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
      .split('\n')
      .filter(q => q.trim().length > 0)
      .slice(0, 3)
  } catch (error) {
    return []
  }
}

export async function summarizeContext(documents) {
  const combinedContent = documents
    .map(doc => doc.content)
    .join('\n\n')
    .slice(0, 10000)

  const prompt = `Provide a brief summary (3-5 sentences) of the following documents:

${combinedContent}

Summary:`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    return "Unable to generate summary at this time."
  }
}

export function formatSourceCitations(sources) {
  return sources.map((source, idx) => 
    `[${idx + 1}] ${source.title} (Relevance: ${Math.round((source.relevance || 0) * 100)}%)`
  ).join('\n')
}
