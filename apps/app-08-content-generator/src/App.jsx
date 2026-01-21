import { useState } from 'react'
import { FileText, Mail, MessageSquare, Sparkles } from 'lucide-react'
import ContentTypeSelector from './components/ContentTypeSelector'
import ContentEditor from './components/ContentEditor'
import ToneSelector from './components/ToneSelector'
import { generateBlogPost } from './lib/generators/BlogGenerator'
import { generateSocialPost } from './lib/generators/SocialGenerator'
import { generateEmail } from './lib/generators/EmailGenerator'

export default function App() {
  const [contentType, setContentType] = useState('blog')
  const [tone, setTone] = useState('professional')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setIsGenerating(true)
    setError(null)
    
    try {
      let content
      const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean)
      
      switch (contentType) {
        case 'blog':
          content = await generateBlogPost(topic, tone, keywordList)
          break
        case 'social':
          content = await generateSocialPost(topic, tone, keywordList)
          break
        case 'email':
          content = await generateEmail(topic, tone, keywordList)
          break
        default:
          content = 'Invalid content type'
      }
      
      setGeneratedContent(content)
    } catch (err) {
      setError(err.message || 'Failed to generate content')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h1 className="text-4xl font-bold text-white">AI Content Generator</h1>
          </div>
          <p className="text-purple-100">Create engaging content with AI-powered generation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Content Settings</h2>
            
            <ContentTypeSelector 
              value={contentType} 
              onChange={setContentType} 
            />

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your topic..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="AI, technology, innovation..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <ToneSelector value={tone} onChange={setTone} />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </span>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <ContentEditor
            content={generatedContent}
            onChange={setGeneratedContent}
            contentType={contentType}
          />
        </div>
      </div>
    </div>
  )
}
