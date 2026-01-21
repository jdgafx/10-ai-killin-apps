import { chat } from 'ai-providers'

export async function generateSocialPost(topic, tone, keywords = [], platform = 'general') {
  const platformLimits = {
    twitter: '280 characters',
    linkedin: '1-2 paragraphs',
    facebook: '2-3 paragraphs',
    instagram: '2-3 paragraphs with hashtags',
    general: '2-3 paragraphs'
  }

  const limit = platformLimits[platform] || platformLimits.general
  const keywordText = keywords.length > 0 ? `\nKeywords: ${keywords.join(', ')}` : ''

  const prompt = `Create an engaging social media post about: ${topic}

Tone: ${tone}
Length: ${limit}${keywordText}

Requirements:
- Attention-grabbing hook
- Clear message
- Call-to-action
- Relevant hashtags (3-5)
- Emoji usage where appropriate`

  try {
    const response = await chat([
      { role: 'system', content: `You are a social media expert. Create ${tone} posts that drive engagement and convey messages concisely.` },
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Social post generation failed: ${error.message}`)
  }
}

export async function generateThreadedPost(topic, threadLength = 5) {
  const prompt = `Create a Twitter/X thread (${threadLength} tweets) about: ${topic}

Requirements:
- Each tweet under 280 characters
- Numbered (1/X format)
- Cohesive narrative
- Strong opening tweet
- Clear conclusion
- Relevant hashtags in first and last tweet`

  try {
    const response = await chat([
      { role: 'system', content: 'You are a social media expert specializing in threaded content.' },
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Thread generation failed: ${error.message}`)
  }
}

export async function generateHashtags(content, count = 5) {
  const prompt = `Generate ${count} relevant hashtags for this content:

${content}

Return only hashtags, one per line, with # symbol.`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Hashtag generation failed: ${error.message}`)
  }
}
