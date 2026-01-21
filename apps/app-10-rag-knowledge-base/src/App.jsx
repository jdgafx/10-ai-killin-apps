import { useState, useEffect } from 'react'
import { BookOpen, Search, Plus, Database, FileText, Trash2, MessageCircle, Sparkles, Brain, BookMarked } from 'lucide-react'

const SAMPLE_DOCS = [
  {
    id: 1,
    title: 'Machine Learning Fundamentals',
    content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience. It uses algorithms to parse data, learn from it, and make informed decisions.',
    category: 'AI/ML',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'React Hooks Guide',
    content: 'React Hooks are functions that let you use state and other React features without writing a class. The most common hooks are useState and useEffect.',
    category: 'Development',
    createdAt: '2024-01-20'
  },
]

export default function App() {
  const [documents, setDocuments] = useState(SAMPLE_DOCS)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('search')
  const [newDoc, setNewDoc] = useState({ title: '', content: '', category: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddDocument = () => {
    if (!newDoc.title.trim() || !newDoc.content.trim()) return
    
    const doc = {
      id: Date.now(),
      ...newDoc,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setDocuments(prev => [...prev, doc])
    setNewDoc({ title: '', content: '', category: '' })
    setShowAddForm(false)
  }

  const handleDeleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const handleSearch = async () => {
    if (!question.trim() || documents.length === 0) return

    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const relevantDocs = documents.slice(0, 2)
    const mockAnswer = `Based on your knowledge base, ${question.toLowerCase().includes('how') ? 'here is how' : 'the answer is that'} ${question.toLowerCase().includes('machine learning') ? 'machine learning uses algorithms to parse data and learn from it to make informed decisions. It is a subset of artificial intelligence that improves through experience.' : question.toLowerCase().includes('react') ? 'React Hooks like useState and useEffect allow you to use state and other React features without writing classes. They make functional components more powerful.' : 'the information in your documents suggests that understanding fundamentals is key to success in any field.'}`

    setAnswer({
      question,
      answer: mockAnswer,
      sources: relevantDocs,
      timestamp: new Date().toISOString()
    })

    setIsSearching(false)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'AI/ML': 'purple',
      'Development': 'blue',
      'Database': 'green',
      'Other': 'gray'
    }
    return colors[category] || 'gray'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-green-500 to-emerald-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">RAG Knowledge Base</h1>
          </div>
          <p className="text-white/90 text-lg">Intelligent document search with AI-powered answers</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-2xl">
          <div className="flex border-b-2 border-gray-100">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 px-6 py-4 font-bold transition-all ${
                activeTab === 'search'
                  ? 'border-b-4 border-green-600 text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Search className="w-5 h-5 inline mr-2" />
              Search & Ask
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-6 py-4 font-bold transition-all ${
                activeTab === 'documents'
                  ? 'border-b-4 border-green-600 text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Database className="w-5 h-5 inline mr-2" />
              Manage Documents ({documents.length})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-2xl shadow-2xl p-6">
          {activeTab === 'search' ? (
            <div className="space-y-6">
              {/* Search Interface */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Ask Your Knowledge Base</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="What would you like to know?"
                    className="flex-1 px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !question.trim() || documents.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {isSearching ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
                {documents.length === 0 && (
                  <p className="text-sm text-orange-600 mt-3">⚠️ Add documents to start searching</p>
                )}
              </div>

              {/* Answer Display */}
              {answer && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                      <h4 className="text-lg font-bold text-gray-800">AI Answer</h4>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">Question:</p>
                      <p className="text-gray-700 italic">"{answer.question}"</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-semibold">Answer:</p>
                      <p className="text-gray-800 leading-relaxed">{answer.answer}</p>
                    </div>
                  </div>

                  {/* Sources */}
                  {answer.sources && answer.sources.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-green-600" />
                        Sources Used
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {answer.sources.map((doc) => (
                          <div key={doc.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-bold text-gray-800 text-sm">{doc.title}</h5>
                              <span className={`px-2 py-1 bg-${getCategoryColor(doc.category)}-100 text-${getCategoryColor(doc.category)}-700 text-xs font-semibold rounded-full`}>
                                {doc.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{doc.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-100 text-center">
                  <Database className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">{documents.length}</div>
                  <div className="text-sm text-gray-600 font-medium">Documents</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-100 text-center">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">
                    {documents.reduce((sum, doc) => sum + doc.content.split(' ').length, 0)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total Words</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100 text-center">
                  <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">{answer ? 1 : 0}</div>
                  <div className="text-sm text-gray-600 font-medium">Queries</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add Document Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Your Documents</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Document
                </button>
              </div>

              {/* Add Document Form */}
              {showAddForm && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                  <h4 className="font-bold text-gray-800 mb-4">New Document</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newDoc.title}
                      onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                      placeholder="Document title"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <textarea
                      value={newDoc.content}
                      onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                      placeholder="Document content"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                    />
                    <input
                      type="text"
                      value={newDoc.category}
                      onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                      placeholder="Category (e.g., AI/ML, Development)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddDocument}
                        disabled={!newDoc.title.trim() || !newDoc.content.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all"
                      >
                        Add Document
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Document List */}
              {documents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-600 mb-2">No Documents Yet</h4>
                  <p className="text-gray-500">Add your first document to build your knowledge base</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg mb-2">{doc.title}</h4>
                          <span className={`inline-block px-3 py-1 bg-${getCategoryColor(doc.category)}-100 text-${getCategoryColor(doc.category)}-700 text-xs font-semibold rounded-full`}>
                            {doc.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{doc.content}</p>
                      <p className="text-xs text-gray-500">Added: {doc.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            How RAG Knowledge Base Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-bold mb-1">1. Document Ingestion</div>
              <p className="text-white/80">Add documents to build your knowledge base</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-bold mb-1">2. Semantic Search</div>
              <p className="text-white/80">Find relevant content using AI-powered search</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-bold mb-1">3. AI Answers</div>
              <p className="text-white/80">Get accurate answers with source citations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
