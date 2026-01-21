import React, { useState } from 'react'
import { FileText, Upload, X, FileCheck, Sparkles, MessageCircle, Zap, BarChart3 } from 'lucide-react'

function App() {
  const [document, setDocument] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)

  const handleFileUpload = async (file) => {
    if (!file) return
    
    setLoading(true)
    setAnalysis(null)
    setAnswer(null)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockText = "This is a sample document about artificial intelligence and machine learning. It discusses neural networks, deep learning algorithms, and their applications in natural language processing. The document covers topics like transformers, attention mechanisms, and recent advances in AI technology."

    setDocument({
      name: file.name,
      type: file.type,
      size: file.size,
      text: mockText,
      uploadedAt: Date.now()
    })

    // Auto-analyze
    const mockAnalysis = {
      summary: "This document provides a comprehensive overview of artificial intelligence and machine learning technologies, focusing on neural networks and their modern applications.",
      topics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Natural Language Processing"],
      sentiment: "Informative",
      wordCount: 52,
      keyPhrases: ["artificial intelligence", "machine learning", "neural networks", "deep learning", "transformers"]
    }

    setAnalysis(mockAnalysis)
    setLoading(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleAskQuestion = async () => {
    if (!question.trim() || !document) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setAnswer(`Based on the document, ${question.toLowerCase().includes('what') ? 'it discusses' : 'the answer is related to'} artificial intelligence and machine learning concepts. The document covers neural networks, deep learning algorithms, and their applications in natural language processing.`)
    setLoading(false)
  }

  const handleReset = () => {
    setDocument(null)
    setAnalysis(null)
    setAnswer(null)
    setQuestion('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">AI Document Processor</h1>
          </div>
          <p className="text-white/90 text-lg">Upload, analyze, and extract insights from your documents</p>
        </div>

        {/* Upload Area */}
        {!document ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Drop your document here</h3>
              <p className="text-gray-600 mb-6">or click to browse files</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  disabled={loading}
                />
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Select Document
                    </>
                  )}
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-4">Supports PDF, TXT, DOC, DOCX (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{document.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {(document.size / 1024).toFixed(2)} KB • Uploaded {new Date(document.uploadedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-800 text-lg">AI Summary</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <BarChart3 className="w-5 h-5 text-purple-600 mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{analysis.wordCount}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                      <Zap className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{analysis.topics.length}</div>
                      <div className="text-sm text-gray-600">Topics</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <FileText className="w-5 h-5 text-green-600 mb-2" />
                      <div className="text-2xl font-bold text-green-600">{analysis.keyPhrases.length}</div>
                      <div className="text-sm text-gray-600">Key Phrases</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                      <Sparkles className="w-5 h-5 text-orange-600 mb-2" />
                      <div className="text-xl font-bold text-orange-600">{analysis.sentiment}</div>
                      <div className="text-sm text-gray-600">Sentiment</div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Detected Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topics.map((topic, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Phrases */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Key Phrases</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyPhrases.map((phrase, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Q&A Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">Ask Questions</h3>
              </div>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask anything about this document..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={loading || !question.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {loading ? 'Thinking...' : 'Ask'}
                </button>
              </div>
              {answer && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                  <p className="text-gray-700 leading-relaxed">{answer}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
