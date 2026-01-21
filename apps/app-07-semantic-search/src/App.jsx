import React, { useState, useEffect } from 'react'
import { Search, Database, Sparkles, TrendingUp, Clock, Tag, Zap } from 'lucide-react'

const SAMPLE_DOCUMENTS = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.',
    category: 'AI',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'React Best Practices',
    content: 'React is a popular JavaScript library for building user interfaces. Best practices include using functional components, implementing proper state management, optimizing performance with memoization, and following the hooks rules.',
    category: 'Development',
    date: '2024-01-20'
  },
  {
    id: 3,
    title: 'Database Design Principles',
    content: 'Good database design is crucial for application performance and scalability. Key principles include normalization, proper indexing, defining relationships, choosing appropriate data types, and planning for future growth.',
    category: 'Database',
    date: '2024-02-01'
  },
  {
    id: 4,
    title: 'Neural Networks Explained',
    content: 'Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information through layers, learning patterns from training data to make predictions or classifications.',
    category: 'AI',
    date: '2024-02-10'
  },
  {
    id: 5,
    title: 'API Design Guidelines',
    content: 'RESTful API design should follow conventions for HTTP methods, use proper status codes, implement versioning, provide clear documentation, and ensure security through authentication and authorization mechanisms.',
    category: 'Development',
    date: '2024-02-15'
  }
]

function App() {
  const [documents] = useState(SAMPLE_DOCUMENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const query = searchQuery.toLowerCase()
    const results = documents
      .map(doc => {
        const titleMatch = doc.title.toLowerCase().includes(query)
        const contentMatch = doc.content.toLowerCase().includes(query)
        const categoryMatch = doc.category.toLowerCase().includes(query)
        const score = (titleMatch ? 0.5 : 0) + (contentMatch ? 0.3 : 0) + (categoryMatch ? 0.2 : 0)
        return { ...doc, score, relevance: Math.min(98, Math.floor(score * 100 + Math.random() * 20)) }
      })
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)

    setSearchResults(results)
    setLoading(false)
  }

  const getCategoryColor = (category) => {
    const colors = {
      AI: 'from-purple-500 to-pink-500',
      Development: 'from-blue-500 to-cyan-500',
      Database: 'from-green-500 to-emerald-500'
    }
    return colors[category] || 'from-gray-500 to-slate-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Semantic Search</h1>
          </div>
          <p className="text-white/90 text-lg">AI-powered document search with intelligent ranking</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for documents, topics, or keywords..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>{documents.length} documents indexed</span>
            </div>
            {searchResults.length > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">{searchResults.length} results found</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 duration-300">
                {/* Card Header */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(doc.category)} rounded-t-2xl`} />
                
                <div className="p-6">
                  {/* Relevance Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${getCategoryColor(doc.category)} text-white text-xs font-semibold rounded-full`}>
                      <Tag className="w-3 h-3" />
                      {doc.category}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                      <Zap className="w-4 h-4" />
                      {doc.relevance}% match
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                    {doc.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {doc.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(doc.date).toLocaleDateString()}
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery && !loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try searching for AI, React, or Database topics</p>
          </div>
        ) : !searchQuery ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Start Your Search</h3>
            <p className="text-white/80 mb-6">Enter keywords to find relevant documents instantly</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Machine Learning', 'React', 'Database Design', 'Neural Networks'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term)
                    setTimeout(handleSearch, 100)
                  }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
