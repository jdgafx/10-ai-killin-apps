import { useState, useEffect } from 'react'
import { BookOpen, Search, Plus, Database } from 'lucide-react'
import DocumentManager from './components/DocumentManager'
import KnowledgeSearch from './components/KnowledgeSearch'
import AnswerDisplay from './components/AnswerDisplay'
import { ingestDocument, deleteDocument } from './lib/ingestion'
import { searchDocuments } from './lib/retrieval'
import { answerQuestion } from './lib/qa-chain'

export default function App() {
  const [documents, setDocuments] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('search')
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    const stored = localStorage.getItem('rag-documents')
    if (stored) {
      setDocuments(JSON.parse(stored))
    }
  }

  const saveDocuments = (docs) => {
    localStorage.setItem('rag-documents', JSON.stringify(docs))
    setDocuments(docs)
  }

  const handleAddDocument = async (title, content, metadata = {}) => {
    try {
      const document = await ingestDocument(title, content, metadata)
      const newDocs = [...documents, document]
      saveDocuments(newDocs)
      return document
    } catch (err) {
      setError('Failed to add document: ' + err.message)
      throw err
    }
  }

  const handleDeleteDocument = (docId) => {
    deleteDocument(docId)
    const newDocs = documents.filter(doc => doc.id !== docId)
    saveDocuments(newDocs)
  }

  const handleSearch = async () => {
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    if (documents.length === 0) {
      setError('Please add some documents first')
      return
    }

    setIsSearching(true)
    setError(null)
    
    try {
      // Search for relevant documents
      const relevantDocs = await searchDocuments(question, documents)
      
      // Generate answer using RAG
      const result = await answerQuestion(question, relevantDocs)
      
      setAnswer({
        question,
        answer: result.answer,
        sources: result.sources,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      setError('Search failed: ' + err.message)
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-green-300" />
            <h1 className="text-4xl font-bold text-white">RAG Knowledge Base</h1>
          </div>
          <p className="text-green-100">Intelligent document search with AI-powered answers</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow-xl">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'search'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Search className="w-5 h-5 inline mr-2" />
              Search & Ask
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'documents'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database className="w-5 h-5 inline mr-2" />
              Manage Documents
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg shadow-xl p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {activeTab === 'search' ? (
            <div className="space-y-6">
              {/* Search Interface */}
              <KnowledgeSearch
                question={question}
                onQuestionChange={setQuestion}
                onSearch={handleSearch}
                isSearching={isSearching}
                documentsCount={documents.length}
              />

              {/* Answer Display */}
              {answer && (
                <AnswerDisplay answer={answer} />
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">{documents.length}</div>
                  <div className="text-sm text-gray-600">Documents</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {documents.reduce((sum, doc) => sum + (doc.chunks?.length || 1), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Chunks</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {documents.reduce((sum, doc) => sum + doc.content.split(' ').length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
              </div>
            </div>
          ) : (
            <DocumentManager
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">How RAG Knowledge Base Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">1. Document Ingestion</div>
              <p className="text-green-100">Add documents to build your knowledge base</p>
            </div>
            <div>
              <div className="font-semibold mb-1">2. Semantic Search</div>
              <p className="text-green-100">Find relevant content using AI-powered search</p>
            </div>
            <div>
              <div className="font-semibold mb-1">3. AI Answers</div>
              <p className="text-green-100">Get accurate answers with source citations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
