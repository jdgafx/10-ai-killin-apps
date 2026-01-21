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
    <div className="min-h-screen bg-white">
      {/* Center Column - Google-like minimal layout */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Logo/Header - centered top */}
        <div className="pt-24 mb-8 text-center">
          <h1 className="text-5xl font-light text-gray-800 mb-2">
            Semantic Search
          </h1>
        </div>

        {/* Search Bar - centered, prominent */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search documents..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full hover:shadow-md focus:shadow-md focus:outline-none transition-shadow text-base"
            />
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={() => {
                setSearchQuery('')
                setSearchResults([])
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Info */}
        {searchResults.length > 0 && (
          <div className="text-sm text-gray-600 mb-4 pl-1">
            About {searchResults.length} results
          </div>
        )}

        {/* Results List - simple cards */}
        <div className="space-y-6 pb-12">
          {searchResults.map((doc) => (
            <div key={doc.id} className="group">
              <div className="flex items-start gap-3 mb-1">
                <Globe className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <div className="text-xs text-gray-600">{doc.url}</div>
              </div>
              <h3 className="text-xl text-blue-600 hover:underline cursor-pointer mb-1 pl-7">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed pl-7">
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
