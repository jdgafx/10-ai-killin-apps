import { chat } from 'ai-providers'

export async function generateEmail(topic, tone, keywords = [], emailType = 'general') {
  const emailTypes = {
    marketing: 'promotional email with clear value proposition',
    newsletter: 'informative newsletter with multiple sections',
    outreach: 'cold outreach email that builds rapport',
    followup: 'follow-up email that maintains conversation',
    announcement: 'announcement email with important news',
    general: 'professional email'
  }

  const typeDescription = emailTypes[emailType] || emailTypes.general
  const keywordText = keywords.length > 0 ? `\nKey points to cover: ${keywords.join(', ')}` : ''

  const prompt = `Write a ${typeDescription} about: ${topic}

Tone: ${tone}${keywordText}

Include:
- Compelling subject line
- Personalized greeting
- Clear opening
- Well-structured body (2-4 paragraphs)
- Clear call-to-action
- Professional closing
- Signature placeholder

Keep it concise and action-oriented.`

  try {
    const response = await chat([
      { role: 'system', content: `You are an expert email copywriter. Create ${tone} emails that drive responses and achieve their goals.` },
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Email generation failed: ${error.message}`)
  }
}

export async function generateSubjectLines(emailContent, count = 5) {
  const prompt = `Generate ${count} compelling subject lines for this email:

${emailContent.slice(0, 500)}

Requirements:
- Attention-grabbing
- Clear value proposition
- 6-8 words ideal
- No spam trigger words
- Action-oriented

Return only subject lines, one per line.`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Subject line generation failed: ${error.message}`)
  }
}

export async function personalizeEmail(template, recipientInfo) {
  const prompt = `Personalize this email template for the recipient:

Template:
${template}

Recipient Info:
${JSON.stringify(recipientInfo, null, 2)}

Replace placeholders and add personal touches while maintaining the core message.`

  try {
    const response = await chat([
      { role: 'user', content: prompt }
    ])

    return response.content
  } catch (error) {
    throw new Error(`Email personalization failed: ${error.message}`)
  }
}
