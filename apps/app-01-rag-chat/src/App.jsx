import { useState, useRef, useEffect } from 'react'
import { Send, Upload, Database, Trash2 } from 'lucide-react'
import ChatMessage from './components/ChatMessage'
import { vectorStore } from './lib/rag'
import { chatWithRAG, PROVIDERS, PROVIDER_NAMES, generateEmbedding } from './lib/chat'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [provider, setProvider] = useState(PROVIDERS.MINIMAX)
  const [isLoading, setIsLoading] = useState(false)
  const [docCount, setDocCount] = useState(0)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    vectorStore.initialize().then(() => {
      setDocCount(vectorStore.size())
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await chatWithRAG(provider, input, vectorStore, messages)
      setMessages(prev => [...prev, { ...response, timestamp: Date.now() }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: Date.now(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const chunks = text.match(/.{1,500}/g) || []
      
      for (let i = 0; i < chunks.length; i++) {
        const embedding = generateEmbedding(chunks[i])
        await vectorStore.addDocument(
          `${file.name}-chunk-${i}`,
          chunks[i],
          embedding,
          { filename: file.name, chunk: i }
        )
      }
      
      setDocCount(vectorStore.size())
      alert(`Uploaded ${chunks.length} chunks from ${file.name}`)
    } catch (error) {
      alert(`Upload failed: ${error.message}`)
    }
  }

  const handleClearStore = () => {
    if (confirm('Clear all documents from vector store?')) {
      vectorStore.clear()
      setDocCount(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Multi-Model AI Chat with RAG
          </h1>
          
          <div className="flex gap-4 items-center flex-wrap">
            {/* Provider Selector */}
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(PROVIDER_NAMES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            {/* File Upload */}
            <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Document Count */}
            <div className="flex items-center gap-2 text-gray-600">
              <Database className="w-4 h-4" />
              <span>{docCount} documents</span>
            </div>

            {/* Clear Store */}
            {docCount > 0 && (
              <button
                onClick={handleClearStore}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-4 mb-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Database className="w-16 h-16 mx-auto mb-4" />
                <p>Upload documents and start chatting!</p>
                <p className="text-sm mt-2">RAG-powered responses with source citations</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  message={msg}
                  isUser={msg.role === 'user'}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  </div>
                  <div className="text-gray-500">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
