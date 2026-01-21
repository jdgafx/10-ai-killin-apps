/**
 * Document Summarizer using Google Gemini
 * Provides comprehensive document analysis
 */

export async function summarizeDocument(documentContent, mode = 'brief') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file')
  }

  const prompts = {
    brief: 'Provide a concise 3-5 sentence summary of this document.',
    detailed: 'Provide a comprehensive summary of this document in 2-3 paragraphs.',
    bullet: 'Summarize this document as 5-7 bullet points highlighting the key information.'
  }

  const prompt = `${prompts[mode] || prompts.brief}\n\nDocument:\n${documentContent}`

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
            temperature: 0.4,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Summary unavailable'
  } catch (error) {
    console.error('Summarization error:', error)
    throw error
  }
}

export async function analyzeDocument(documentContent) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file')
  }

  const prompt = `Analyze this document comprehensively and provide:
1. Summary (3-5 sentences)
2. Key Themes (5-7 bullet points)
3. Keywords (10-15 important terms, comma-separated)
4. Sentiment Analysis (overall tone and emotion)
5. Document Type Classification (e.g., report, article, legal, technical, etc.)
6. Key Entities (people, organizations, dates, locations if applicable)

Format your response as JSON with keys: summary, themes, keywords, sentiment, type, entities

Document:
${documentContent.substring(0, 15000)}`

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
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'

    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       content.match(/(\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[1] : content
      const parsed = JSON.parse(jsonStr)
      
      // Ensure keywords is an array
      if (typeof parsed.keywords === 'string') {
        parsed.keywords = parsed.keywords.split(',').map(k => k.trim())
      }
      
      return parsed
    } catch (parseError) {
      console.error('JSON parse error, returning raw content')
      return {
        summary: content,
        themes: [],
        keywords: [],
        sentiment: 'Unable to parse',
        type: 'Unknown',
        entities: []
      }
    }
  } catch (error) {
    console.error('Analysis error:', error)
    throw error
  }
}

export async function extractKeywords(documentContent, count = 15) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Extract the ${count} most important keywords and key phrases from this document. Return them as a comma-separated list.

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
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    return content
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, count)
  } catch (error) {
    console.error('Keyword extraction error:', error)
    throw error
  }
}
