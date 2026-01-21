import { chat } from 'ai-providers'

export async function generateBlogPost(topic, tone, keywords = []) {
  const keywordText = keywords.length > 0 ? `\nKeywords to include: ${keywords.join(', ')}` : ''
  
  const prompt = `Write a comprehensive blog post about: ${topic}

Tone: ${tone}${keywordText}

Include:
1. Engaging title
2. Introduction hook
3. 3-4 main sections with subheadings
4. Conclusion with call-to-action
5. SEO-optimized content

Word count: 800-1200 words`

  try {
    const response = await chat([
      { role: 'system', content: `You are an expert content writer. Create ${tone} blog posts that are engaging, well-structured, and SEO-optimized.` },
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Blog generation failed: ${error.message}`)
  }
}

export async function generateBlogOutline(topic) {
  const prompt = `Create a detailed outline for a blog post about: ${topic}

Include:
- Title
- Introduction points
- Main sections (3-5)
- Key points for each section
- Conclusion summary`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Outline generation failed: ${error.message}`)
  }
}

export async function improveBlogSection(section, improvement) {
  const prompt = `Improve this blog section based on: ${improvement}

Section:
${section}

Provide the improved version maintaining the same structure.`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Section improvement failed: ${error.message}`)
  }
}
