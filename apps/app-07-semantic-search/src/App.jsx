import React, { useState, useEffect } from 'react'
import { Search, Database, AlertCircle, Plus } from 'lucide-react'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import { indexDocuments, getIndexSize, clearIndex } from './lib/indexer'
import { semanticSearch } from './lib/search'

// Sample documents for demonstration
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
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [indexed, setIndexed] = useState(false)
  const [newDoc, setNewDoc] = useState({ title: '', content: '', category: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // Auto-index documents on mount
    handleIndexDocuments()
  }, [])

  const handleIndexDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      await indexDocuments(documents)
      setIndexed(true)
    } catch (err) {
      setError('Failed to index documents: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    if (!indexed) {
      setError('Please index documents first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await semanticSearch(searchQuery, documents)
      setSearchResults(results)
    } catch (err) {
      setError('Search failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDocument = async () => {
    if (!newDoc.title.trim() || !newDoc.content.trim()) {
      setError('Title and content are required')
      return
    }

    const doc = {
      id: documents.length + 1,
      ...newDoc,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedDocs = [...documents, doc]
    setDocuments(updatedDocs)
    setNewDoc({ title: '', content: '', category: '' })
    setShowAddForm(false)

    // Re-index with new document
    await indexDocuments(updatedDocs)
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Search size={32} color="#667eea" />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Semantic Search Engine
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{
              padding: '0.5rem 1rem',
              background: indexed ? '#d1fae5' : '#fee2e2',
              color: indexed ? '#047857' : '#991b1b',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Database size={16} />
              {getIndexSize()} documents indexed
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '0.5rem 1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </header>

        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {showAddForm && (
          <div style={{
            padding: '1.5rem',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Add New Document
            </h3>
            <input
              type="text"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              placeholder="Document title"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                fontSize: '1rem'
              }}
            />
            <textarea
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              placeholder="Document content"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <input
              type="text"
              value={newDoc.category}
              onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              placeholder="Category (optional)"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                fontSize: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleAddDocument}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Add Document
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          onSearch={handleSearch}
          loading={loading}
          disabled={!indexed}
        />

        <SearchResults
          results={searchResults}
          query={searchQuery}
        />
      </div>
    </div>
  )
}

export default App
