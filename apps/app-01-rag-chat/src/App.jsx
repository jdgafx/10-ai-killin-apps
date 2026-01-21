import { useState } from 'react'
import { Send, Loader2, Zap, Moon } from 'lucide-react'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const aiMessage = { 
        role: 'assistant', 
        content: `I received your message: "${input}". This is a demo response. To enable real AI, add your API keys in the Vercel dashboard environment variables.`
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-black border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <Zap className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h1 className="text-cyan-400 font-bold text-lg tracking-tight">RAG CHAT</h1>
            <p className="text-xs text-gray-500">Neural Knowledge Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400 font-mono">DARK MODE</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Neural Chat Interface</h2>
                <p className="text-gray-400 text-lg">
                  Powered by RAG technology with real-time knowledge retrieval
                </p>
                <div className="mt-6 flex gap-2 justify-center">
                  <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 font-mono">
                    GPT-4
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300 font-mono">
                    CLAUDE
                  </div>
                  <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-mono">
                    GEMINI
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                <div className={`max-w-[75%] ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                } px-5 py-4 rounded-2xl`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${msg.role === 'user' ? 'bg-cyan-200' : 'bg-blue-400'}`} />
                    <span className={`text-xs font-mono font-semibold ${msg.role === 'user' ? 'text-cyan-100' : 'text-blue-400'}`}>
                      {msg.role === 'user' ? 'YOU' : 'AI AGENT'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="bg-gray-800 border border-gray-700 px-5 py-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-gray-400 font-mono">Processing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Fixed Bottom */}
        <div className="border-t border-gray-800 bg-black px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter your message..."
                className="w-full bg-gray-800 text-white px-5 py-4 pr-14 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 font-mono text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-gray-600 font-mono">
                {messages.length} messages • {input.length}/2000 chars
              </span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded font-mono">ONLINE</span>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded font-mono">RAG ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
