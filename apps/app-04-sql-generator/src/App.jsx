import React, { useState } from 'react'
import { Database, Code, AlertCircle, Sparkles, Table, Zap, Play } from 'lucide-react'
import SchemaBuilder from './components/SchemaBuilder'
import QueryDisplay from './components/QueryDisplay'
import { generateSQL } from './lib/sql-generator'

function App() {
  const [schema, setSchema] = useState({
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'email', type: 'VARCHAR(255)', unique: true },
          { name: 'name', type: 'VARCHAR(100)' },
          { name: 'created_at', type: 'TIMESTAMP' }
        ]
      }
    ]
  })
  const [question, setQuestion] = useState('')
  const [sqlResult, setSqlResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await generateSQL(question, schema)
      setSqlResult(result)
    } catch (err) {
      setError(err.message || 'Failed to generate SQL query')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
      <div className="min-h-screen backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI SQL Generator
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Natural language to SQL queries with schema builder
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Schema Builder */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <Table className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Schema</h2>
                </div>
                <SchemaBuilder schema={schema} setSchema={setSchema} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Query Input */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <label className="text-xl font-bold text-gray-800">
                    Natural Language Query
                  </label>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleGenerate()
                      }
                    }}
                    placeholder="E.g., Show me all users who signed up in the last 7 days with their email addresses..."
                    className="w-full min-h-[120px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none text-base"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-gray-700 font-mono">Ctrl</kbd>
                      {' + '}
                      <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-gray-700 font-mono">Enter</kbd>
                      {' to generate'}
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={loading || !question.trim()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <Sparkles className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Generate Query
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-bold text-red-800">Error</div>
                    <div className="text-red-700 text-sm">{error}</div>
                  </div>
                </div>
              )}

              {/* Query Result */}
              {sqlResult && (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <Play className="w-5 h-5" />
                        <span className="font-bold text-lg">Generated Query</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-bold">
                          SQL
                        </span>
                        <span className="px-3 py-1 bg-green-400/80 text-green-900 rounded-full text-xs font-bold">
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <QueryDisplay result={sqlResult} />
                  </div>
                </div>
              )}

              {/* Example Queries */}
              {!sqlResult && !loading && (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                  <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Example Queries
                  </h3>
                  <div className="grid gap-3">
                    {[
                      'Show me all users who signed up in the last 7 days',
                      'Find users with gmail addresses',
                      'Count total number of users by creation date',
                      'Get the 10 most recent users'
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuestion(example)}
                        className="text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all border border-blue-200 hover:border-blue-400 hover:shadow-md group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm text-gray-700 font-medium">{example}</span>
                          <Code className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
