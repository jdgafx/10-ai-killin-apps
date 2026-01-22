import { useState } from 'react'
import { FileText, Mail, MessageSquare, Copy, Download, Type } from 'lucide-react'

const CONTENT_TYPES = [
  { id: 'article', label: 'Article', icon: FileText },
  { id: 'social', label: 'Social Post', icon: MessageSquare },
  { id: 'email', label: 'Email', icon: Mail },
]

export default function App() {
  const [contentType, setContentType] = useState('article')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const contents = {
      article: `${topic}\n\nIn today's rapidly evolving landscape, ${topic.toLowerCase()} has emerged as a crucial element for success. This comprehensive guide explores the key aspects and provides valuable insights.\n\nUnderstanding the Fundamentals\n\nThe foundation of ${topic.toLowerCase()} rests on several core principles that drive meaningful results. By leveraging these strategies, organizations can achieve remarkable outcomes.\n\nKey Takeaways:\n• Implement best practices for optimal results\n• Stay ahead of industry trends\n• Foster innovation and creativity\n• Build sustainable growth strategies\n\nConclusion\n\nAs we continue to navigate this dynamic environment, ${topic.toLowerCase()} remains a critical factor in achieving long-term success.`,
      social: `🚀 ${topic}\n\nDid you know that ${topic.toLowerCase()} is revolutionizing the way we work? Here's what you need to know:\n\n✨ Innovation at its finest\n💪 Proven strategies that work\n🎯 Results you can measure\n\nLet's discuss! 👇`,
      email: `Subject: ${topic}\n\nDear Team,\n\nI wanted to reach out regarding ${topic.toLowerCase()}, which has significant implications for our upcoming initiatives.\n\nKey Points:\n• Strategic alignment with our goals\n• Actionable insights for implementation\n• Timeline and next steps\n\nI'd love to hear your thoughts.\n\nBest regards`
    }

    setGeneratedContent(contents[contentType] || contents.article)
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto p-10">
        {/* Magazine Header */}
        <div className="text-center border-b-4 border-red-500 pb-10 mb-10 backdrop-blur-lg bg-white/80 rounded-t-2xl shadow-2xl">
          <h1 className="text-7xl font-serif font-bold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent mb-4 tracking-tight">
            CONTENT STUDIO
          </h1>
          <p className="text-sm uppercase tracking-widest text-amber-700 font-bold">Editorial • Publishing • Creative Writing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Controls - Magazine style */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border-l-4 border-red-600 p-6 shadow-xl rounded-r-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <h3 className="text-xs uppercase tracking-widest text-red-600 mb-5 font-bold">Content Type</h3>
              <div className="space-y-3">
                {CONTENT_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`w-full p-3 text-left flex items-center gap-3 transition-all ${
                        contentType === type.id
                          ? 'bg-red-500 text-white font-semibold'
                          : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {type.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border-l-4 border-amber-600 p-6 shadow-xl rounded-r-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <h3 className="text-xs uppercase tracking-widest text-amber-700 mb-5 font-bold">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 mb-2 font-semibold">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Your topic..."
                    className="w-full px-3 py-2 border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-700 mb-2 font-semibold">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold uppercase tracking-widest hover:from-red-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-300 rounded-xl shadow-xl shadow-red-500/50 hover:scale-105"
            >
              {isGenerating ? 'Generating...' : '✍️ Generate'}
            </button>
          </div>

          {/* Main Preview Area - Large magazine-style layout */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-2xl min-h-[600px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
              {/* Preview Header */}
              <div className="border-b-2 border-stone-200 p-8 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Type className="w-8 h-8 text-red-500 animate-pulse" />
                    <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">Preview</h2>
                  </div>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedContent)}
                        className="p-2 hover:bg-white transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-white transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Display */}
              <div className="p-8">
                {generatedContent ? (
                  <div className="prose prose-lg max-w-none">
                    <div className="font-serif text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 text-gray-400">
                    <FileText className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                    <p className="text-xl font-serif">Your content will appear here</p>
                    <p className="text-sm mt-2">Enter a topic and click generate</p>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              {generatedContent && (
                <div className="border-t-2 border-gray-200 p-6 bg-orange-50 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{generatedContent.split(' ').length}</div>
                    <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold">Words</div>
                  </div>
                  <div className="text-center border-l border-r border-gray-300">
                    <div className="text-3xl font-bold text-red-500">{generatedContent.length}</div>
                    <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold">Characters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{generatedContent.split('\n\n').length}</div>
                    <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold">Sections</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
