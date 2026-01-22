import React, { useState } from 'react'
import { Database, Terminal, AlertTriangle, ChevronRight } from 'lucide-react'
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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Terminal Header Bar */}
      <div className="bg-slate-950 border-b border-green-500/30 px-6 py-3 flex items-center gap-3 shadow-lg shadow-green-500/20">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow-lg shadow-red-500/50"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer shadow-lg shadow-yellow-500/50"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer shadow-lg shadow-green-500/50 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <Terminal className="w-5 h-5 text-green-400 animate-pulse" />
          <span className="text-green-400 font-mono text-base font-bold uppercase tracking-wider">SQL Generator Terminal</span>
          <span className="text-cyan-400 font-mono text-xs backdrop-blur-lg bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30">v2.0.0</span>
        </div>
      </div>

      {/* Main Terminal Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Top Schema Sidebar */}
        <div className="lg:w-1/3 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-green-500/30 p-5 overflow-y-auto shadow-2xl">
          <div className="mb-6">
            <div className="flex items-center gap-3 text-green-400 mb-3">
              <Database className="w-6 h-6 animate-pulse" />
              <span className="font-mono text-base uppercase tracking-widest font-bold">Database Schema</span>
            </div>
            <div className="h-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full shadow-lg shadow-green-400/50"></div>
          </div>
          <SchemaBuilder schema={schema} setSchema={setSchema} />
        </div>

        {/* Right Query Area */}
        <div className="flex-1 bg-black p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Terminal Prompt */}
          <div className="font-mono text-sm">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <span className="text-lime-300">user@sqlgen</span>
              <span className="text-slate-500">:</span>
              <span className="text-blue-400">~/query</span>
              <span className="text-slate-500">$</span>
            </div>
          </div>

          {/* Query Input Area */}
          <div className="border-2 border-green-400/30 bg-slate-900/70 backdrop-blur-lg rounded-lg shadow-xl shadow-green-500/20 transition-all duration-300 hover:border-green-400/50">
            <div className="bg-gradient-to-r from-green-400/20 to-cyan-400/20 border-b border-green-400/30 px-4 py-2 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="font-mono text-sm text-green-400 uppercase tracking-wider font-bold">Natural Language Input</span>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleGenerate()
                }
              }}
              placeholder="// Enter query in plain English... (CTRL+ENTER to execute)"
              className="w-full min-h-[140px] bg-transparent text-lime-300 font-mono text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none placeholder:text-slate-600"
              spellCheck={false}
            />
            <div className="border-t border-green-400/30 px-4 py-3 flex items-center justify-between bg-slate-900">
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 font-bold">CTRL+ENTER</span>
                <span>to execute</span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading || !question.trim()}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-mono text-xs uppercase tracking-widest font-bold hover:shadow-lg hover:shadow-green-400/50 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                {loading ? '>>> PROCESSING...' : '>>> GENERATE SQL'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="border border-red-500/50 bg-red-950/30">
              <div className="bg-red-500/20 border-b border-red-500/50 px-3 py-1 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span className="font-mono text-xs text-red-400 uppercase">Error</span>
              </div>
              <div className="px-3 py-2 font-mono text-sm text-red-300">
                {error}
              </div>
            </div>
          )}

          {/* Query Output */}
          {sqlResult && (
            <div className="border border-green-400/30 bg-slate-900/50">
              <div className="bg-green-400/10 border-b border-green-400/30 px-3 py-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-green-400" />
                  <span className="font-mono text-xs text-green-400 uppercase">Generated SQL Query</span>
                </div>
                <span className="font-mono text-xs text-lime-300">[READY]</span>
              </div>
              <div className="p-3">
                <QueryDisplay result={sqlResult} />
              </div>
            </div>
          )}

          {/* Example Commands */}
          {!sqlResult && !loading && (
            <div className="border border-slate-700 bg-slate-900/30">
              <div className="bg-slate-800/50 border-b border-slate-700 px-3 py-1">
                <span className="font-mono text-xs text-slate-400 uppercase">Example Queries</span>
              </div>
              <div className="p-3 space-y-2">
                {[
                  'Show me all users who signed up in the last 7 days',
                  'Find users with gmail addresses',
                  'Count total number of users by creation date',
                  'Get the 10 most recent users'
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(example)}
                    className="block w-full text-left px-3 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-green-400/50 transition-all group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-mono text-xs mt-0.5">$</span>
                      <span className="text-slate-300 font-mono text-xs group-hover:text-lime-300 transition-colors">
                        {example}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="bg-slate-900 border-t border-slate-700 px-4 py-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex gap-4">
            <span className="text-slate-500">CONN: <span className="text-green-400">●</span></span>
            <span className="text-slate-500">TABLES: <span className="text-lime-300">{schema.tables.length}</span></span>
          </div>
          <div className="text-slate-500">
            <span className="text-green-400">UTF-8</span> | SQL MODE
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
