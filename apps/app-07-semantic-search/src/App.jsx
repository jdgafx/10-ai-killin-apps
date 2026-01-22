import React, { useState } from 'react'
import { Search, Globe } from 'lucide-react'

const SAMPLE_DOCUMENTS = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
    url: 'example.com/ml-intro',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'React Best Practices',
    content: 'React is a popular JavaScript library for building user interfaces. Best practices include using functional components and proper state management.',
    url: 'example.com/react-best',
    date: '2024-01-20'
  },
  {
    id: 3,
    title: 'Database Design Principles',
    content: 'Good database design is crucial for application performance and scalability. Key principles include normalization and proper indexing.',
    url: 'example.com/db-design',
    date: '2024-02-01'
  },
  {
    id: 4,
    title: 'Neural Networks Explained',
    content: 'Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes that process information.',
    url: 'example.com/neural-nets',
    date: '2024-02-10'
  },
  {
    id: 5,
    title: 'API Design Guidelines',
    content: 'RESTful API design should follow conventions for HTTP methods, use proper status codes, and implement versioning.',
    url: 'example.com/api-guide',
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
    await new Promise(resolve => setTimeout(resolve, 600))

    const query = searchQuery.toLowerCase()
    const results = documents
      .map(doc => {
        const titleMatch = doc.title.toLowerCase().includes(query)
        const contentMatch = doc.content.toLowerCase().includes(query)
        const score = (titleMatch ? 0.6 : 0) + (contentMatch ? 0.4 : 0)
        return { ...doc, score }
      })
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)

    setSearchResults(results)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Center Column - Google-like minimal layout */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Logo/Header - centered top */}
        <div className="pt-32 mb-12 text-center animate-in fade-in duration-700">
          <h1 className="text-7xl font-light bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4 tracking-tight">
            Semantic Search
          </h1>
          <p className="text-slate-600 text-lg">Find exactly what you're looking for</p>
        </div>

        {/* Search Bar - centered, prominent */}
        <div className="mb-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-500 transition-all duration-300 group-hover:scale-110" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search documents..."
              className="w-full pl-16 pr-6 py-5 border-2 border-slate-300 rounded-full hover:shadow-xl focus:shadow-2xl focus:outline-none focus:border-blue-500 transition-all duration-300 text-lg"
            />
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:scale-105 font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={() => {
                setSearchQuery('')
                setSearchResults([])
              }}
              className="px-8 py-3 backdrop-blur-lg bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-all duration-300 hover:scale-105 font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Info */}
        {searchResults.length > 0 && (
          <div className="text-base text-slate-600 mb-6 pl-2">
            About <span className="font-semibold text-blue-600">{searchResults.length}</span> results
          </div>
        )}

        {/* Results List - simple cards */}
        <div className="space-y-8 pb-16">
          {searchResults.map((doc) => (
            <div key={doc.id} className="group transition-all duration-300 hover:translate-x-2">
              <div className="flex items-start gap-4 mb-2">
                <Globe className="w-5 h-5 text-blue-500 mt-1.5 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <span>{doc.url}</span>
                </div>
              </div>
              <h3 className="text-2xl text-blue-600 hover:underline cursor-pointer mb-2 pl-9 font-medium transition-colors duration-300 hover:text-cyan-500">
                {doc.title}
              </h3>
              <p className="text-base text-slate-700 leading-relaxed pl-9">
                {doc.content}
              </p>
            </div>
          ))}

          {searchQuery && !loading && searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-2">Try different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
