import { useState } from 'react'
import { BookOpen, Search, Plus, FileText, Trash2, ChevronRight, Home, Library, Archive } from 'lucide-react'

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

const CATEGORIES = ['All', 'AI/ML', 'Development', 'Database']

export default function App() {
  const [documents, setDocuments] = useState(SAMPLE_DOCS)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDoc, setNewDoc] = useState({ title: '', content: '', category: '' })

  const handleSearch = async () => {
    if (!question.trim()) return

    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockAnswer = `Based on your knowledge base, ${question.toLowerCase().includes('machine learning') ? 'machine learning uses algorithms to parse data and learn from it to make informed decisions.' : 'the information in your documents provides comprehensive guidance on this topic.'}`

    setAnswer({
      question,
      answer: mockAnswer,
      sources: documents.slice(0, 2)
    })

    setIsSearching(false)
  }

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

  const filteredDocs = activeCategory === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50">
      <div className="flex">
        {/* Left Sidebar - Library navigation */}
        <div className="w-72 bg-gradient-to-b from-amber-100 to-amber-200 border-r-4 border-amber-700 min-h-screen p-7 shadow-2xl">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center shadow-lg shadow-amber-700/50 transition-all duration-300 hover:scale-110">
                <BookOpen className="w-7 h-7 text-amber-100" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Knowledge Base</h1>
              </div>
            </div>
            <p className="text-xs text-amber-700 uppercase tracking-wide font-bold">RAG Library System</p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 mb-10">
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl font-bold shadow-lg shadow-amber-700/50 transition-all duration-300 hover:scale-105">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-amber-800 hover:bg-amber-200 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 font-semibold">
              <Library className="w-5 h-5" />
              <span>Collections</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-amber-800 hover:bg-amber-200 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 font-semibold">
              <Archive className="w-5 h-5" />
              <span>Archives</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-wide text-amber-700 font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold shadow-lg shadow-yellow-600/50 scale-105'
                      : 'text-amber-800 hover:bg-amber-200 hover:scale-105 font-semibold'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border-4 border-amber-700 rounded-xl p-6 shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">{documents.length}</div>
            <div className="text-xs uppercase tracking-wide text-amber-600 font-bold mt-2">Total Documents</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Breadcrumbs */}
          <div className="bg-white border-b-2 border-stone-300 px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-amber-700 font-semibold">{activeCategory}</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-8">
            <div className="bg-white border-l-4 border-amber-700 rounded-r shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Knowledge Base</h2>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ask a question..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-stone-300 focus:border-yellow-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !question.trim()}
                  className="px-8 py-3 bg-amber-700 text-white font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Answer Display */}
            {answer && (
              <div className="bg-yellow-50 border-2 border-yellow-600 rounded p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-2 text-lg">Answer</h3>
                <p className="text-gray-700 mb-4">{answer.answer}</p>
                {answer.sources && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Sources:</p>
                    <div className="space-y-2">
                      {answer.sources.map((doc) => (
                        <div key={doc.id} className="text-sm text-gray-600 pl-4 border-l-2 border-yellow-600">
                          • {doc.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Document Management */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {activeCategory === 'All' ? 'All Documents' : `${activeCategory} Documents`}
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white font-bold hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Document
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-white border-2 border-amber-700 rounded p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">New Document</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder="Document title"
                    className="w-full px-4 py-2 border-2 border-stone-300 focus:border-yellow-600 focus:outline-none"
                  />
                  <textarea
                    value={newDoc.content}
                    onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                    placeholder="Document content"
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-stone-300 focus:border-yellow-600 focus:outline-none resize-none"
                  />
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-stone-300 focus:border-yellow-600 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Development">Development</option>
                    <option value="Database">Database</option>
                  </select>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddDocument}
                      disabled={!newDoc.title.trim() || !newDoc.content.trim()}
                      className="px-6 py-2 bg-amber-700 text-white font-bold hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-stone-300 text-gray-700 font-bold hover:bg-stone-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document List */}
            <div className="space-y-4">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-12 bg-white border-2 border-stone-300 rounded">
                  <FileText className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents in this category</p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div key={doc.id} className="bg-white border-l-4 border-amber-700 rounded-r shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">{doc.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 font-semibold">
                              {doc.category}
                            </span>
                            <span>{doc.createdAt}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}
                          className="p-2 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{doc.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
