import { useState } from 'react'
import { Sparkles, FileText, Mail, MessageSquare, Instagram, Smile, Briefcase, Heart, Zap, Copy, Download } from 'lucide-react'

const CONTENT_TYPES = [
  { id: 'blog', label: 'Blog Post', icon: FileText, gradient: 'from-purple-500 to-pink-500' },
  { id: 'social', label: 'Social Media', icon: Instagram, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'email', label: 'Email', icon: Mail, gradient: 'from-green-500 to-emerald-500' },
]

const TONES = [
  { id: 'professional', label: 'Professional', icon: Briefcase, color: 'blue' },
  { id: 'casual', label: 'Casual', icon: Smile, color: 'green' },
  { id: 'enthusiastic', label: 'Enthusiastic', icon: Zap, color: 'yellow' },
  { id: 'friendly', label: 'Friendly', icon: Heart, color: 'pink' },
]

export default function App() {
  const [contentType, setContentType] = useState('blog')
  const [tone, setTone] = useState('professional')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const contents = {
      blog: `# ${topic}\n\nIn today's rapidly evolving landscape, ${topic.toLowerCase()} has emerged as a crucial element for success. This comprehensive guide will explore the key aspects and provide valuable insights.\n\n## Understanding the Fundamentals\n\nThe foundation of ${topic.toLowerCase()} rests on several core principles that drive meaningful results. By leveraging these strategies, organizations can achieve remarkable outcomes.\n\n## Key Takeaways\n\n- Implement best practices for optimal results\n- Stay ahead of industry trends\n- Foster innovation and creativity\n- Build sustainable growth strategies\n\n## Conclusion\n\nAs we continue to navigate this dynamic environment, ${topic.toLowerCase()} remains a critical factor in achieving long-term success.`,
      social: `🚀 Exciting insights on ${topic}! 💡\n\n${tone === 'enthusiastic' ? '🔥 This is game-changing! ' : ''}Did you know that ${topic.toLowerCase()} is revolutionizing the way we work?\n\nHere's what you need to know:\n✨ Innovation at its finest\n💪 Proven strategies that work\n🎯 Results you can measure\n\n${tone === 'casual' ? 'Pretty cool, right? ' : ''}Let's discuss in the comments! 👇\n\n#${topic.replace(/\s+/g, '')} #Innovation #Success ${keywords ? keywords.split(',').map(k => '#' + k.trim().replace(/\s+/g, '')).join(' ') : ''}`,
      email: `Subject: Important Update on ${topic}\n\nDear Team,\n\nI hope this message finds you well. I wanted to reach out regarding ${topic.toLowerCase()}, which has significant implications for our upcoming initiatives.\n\nKey Points:\n• Strategic alignment with our goals\n• Actionable insights for implementation\n• Timeline and next steps\n\nI believe this presents an excellent opportunity for us to drive meaningful progress. I'd love to hear your thoughts and schedule a time to discuss further.\n\nBest regards,\nYour AI Assistant`
    }

    setGeneratedContent(contents[contentType] || contents.blog)
    setIsGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  const getToneColor = (toneId) => {
    const colors = {
      professional: 'blue',
      casual: 'green',
      enthusiastic: 'yellow',
      friendly: 'pink'
    }
    return colors[toneId] || 'blue'
  }

  const getCurrentType = () => CONTENT_TYPES.find(t => t.id === contentType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">AI Content Generator</h1>
          </div>
          <p className="text-white/90 text-lg">Create engaging content in seconds with AI power</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-500" />
              Content Settings
            </h2>
            
            {/* Content Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Content Type</label>
              <div className="grid grid-cols-3 gap-3">
                {CONTENT_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        contentType === type.id
                          ? 'border-transparent bg-gradient-to-br ' + type.gradient + ' text-white shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${contentType === type.id ? 'text-white' : 'text-gray-600'}`} />
                      <div className="text-sm font-semibold">{type.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your topic..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Keywords Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords (comma-separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="AI, technology, innovation..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Tone</label>
              <div className="grid grid-cols-2 gap-3">
                {TONES.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        tone === t.id
                          ? `border-${t.color}-500 bg-${t.color}-50 text-${t.color}-700 font-semibold`
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Magic...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Generate Content
                </span>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {getCurrentType() && <getCurrentType().icon className="w-6 h-6" />}
                Generated Content
              </h2>
              {generatedContent && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {generatedContent ? (
              <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {generatedContent}
                </pre>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12">
                <div className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-4">
                    <MessageSquare className="w-12 h-12 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Ready to Create</h3>
                  <p className="text-gray-500">Enter a topic and click generate to see the magic</p>
                </div>
              </div>
            )}

            {/* Stats */}
            {generatedContent && (
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{generatedContent.split(' ').length}</div>
                  <div className="text-xs text-gray-600">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{generatedContent.length}</div>
                  <div className="text-xs text-gray-600">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{generatedContent.split('\n\n').length}</div>
                  <div className="text-xs text-gray-600">Paragraphs</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
