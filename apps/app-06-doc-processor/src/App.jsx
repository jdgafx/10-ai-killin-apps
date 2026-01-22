import React, { useState } from 'react'
import { FileText, Upload, X, FileCheck, Folder, File, ChevronRight, Eye } from 'lucide-react'

function App() {
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)

  const handleFileUpload = async (file) => {
    if (!file) return
    
    setLoading(true)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockText = "This is a sample document about artificial intelligence and machine learning. It discusses neural networks, deep learning algorithms, and their applications in natural language processing. The document covers topics like transformers, attention mechanisms, and recent advances in AI technology."

    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      text: mockText,
      uploadedAt: Date.now()
    }

    setDocuments(prev => [...prev, newDoc])
    setSelectedDoc(newDoc)

    // Auto-analyze
    const mockAnalysis = {
      summary: "This document provides a comprehensive overview of artificial intelligence and machine learning technologies, focusing on neural networks and their modern applications.",
      topics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Natural Language Processing"],
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
    if (!question.trim() || !selectedDoc) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setAnswer(`Based on the document, ${question.toLowerCase().includes('what') ? 'it discusses' : 'the answer is related to'} artificial intelligence and machine learning concepts. The document covers neural networks, deep learning algorithms, and their applications in natural language processing.`)
    setLoading(false)
  }

  const handleRemoveDoc = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId))
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null)
      setAnalysis(null)
      setAnswer(null)
      setQuestion('')
    }
  }

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc)
    setQuestion('')
    setAnswer(null)
    // Re-run analysis
    const mockAnalysis = {
      summary: "This document provides a comprehensive overview of artificial intelligence and machine learning technologies, focusing on neural networks and their modern applications.",
      topics: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Natural Language Processing"],
      wordCount: 52,
      keyPhrases: ["artificial intelligence", "machine learning", "neural networks", "deep learning", "transformers"]
    }
    setAnalysis(mockAnalysis)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* macOS-style Header Bar */}
      <div className="bg-gradient-to-r from-white to-slate-50 border-b border-slate-200 px-6 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-110">
            <Folder className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Document Processor</h1>
            <p className="text-sm text-slate-500">Intelligent File Manager</p>
          </div>
          <div className="ml-auto">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                disabled={loading}
              />
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:scale-105">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Add File
                  </>
                )}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content Area - Finder Style */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File List */}
        <div className="w-72 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-indigo-200 overflow-y-auto shadow-xl">
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b border-indigo-200 backdrop-blur-lg bg-white/50">
            <div className="flex items-center gap-3 text-indigo-600 text-sm font-bold uppercase tracking-wider">
              <Folder className="w-5 h-5 animate-pulse" />
              My Documents
            </div>
          </div>

          {/* File List */}
          <div className="p-3">
            {documents.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-400 text-sm">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No documents yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedDoc?.id === doc.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                        : 'text-slate-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <File className="w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{doc.name}</div>
                      <div className={`text-xs ${selectedDoc?.id === doc.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {(doc.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveDoc(doc.id)
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 transition-all ${
                        selectedDoc?.id === doc.id ? 'hover:bg-white/20' : ''
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 overflow-y-auto">
          {!selectedDoc ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`h-full flex flex-col items-center justify-center p-8 transition-all ${
                isDragging ? 'bg-indigo-50' : ''
              }`}
            >
              <div className={`p-8 rounded-2xl border-2 border-dashed transition-all ${
                isDragging ? 'border-indigo-500 bg-indigo-100/50 scale-105' : 'border-slate-300'
              }`}>
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium mb-2 text-center">Drop files here</p>
                <p className="text-slate-500 text-sm text-center">or use the Add File button</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Document Header */}
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-800">{selectedDoc.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {(selectedDoc.size / 1024).toFixed(2)} KB • {new Date(selectedDoc.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis Section */}
              {analysis && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-white rounded-lg border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-violet-600" />
                      <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Summary</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{analysis.summary}</p>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                      <div className="text-2xl font-bold text-indigo-600">{analysis.wordCount}</div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide mt-1">Words</div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                      <div className="text-2xl font-bold text-violet-600">{analysis.topics.length}</div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide mt-1">Topics</div>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="bg-white rounded-lg border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-3">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topics.map((topic, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Phrases */}
                  <div className="bg-white rounded-lg border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-3">Key Phrases</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyPhrases.map((phrase, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Q&A Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ChevronRight className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Ask Questions</h3>
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    placeholder="Ask about this document..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={loading || !question.trim()}
                    className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? '...' : 'Ask'}
                  </button>
                </div>
                {answer && (
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <p className="text-slate-700 text-sm leading-relaxed">{answer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
