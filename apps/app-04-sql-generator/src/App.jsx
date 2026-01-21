import React, { useState } from 'react'
import { Database, Code, AlertCircle } from 'lucide-react'
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
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <Database size={32} color="#667eea" />
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            AI SQL Query Generator
          </h1>
        </header>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <SchemaBuilder schema={schema} setSchema={setSchema} />

          <div style={{
            padding: '1.5rem',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              <Code size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Natural Language Query
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g., Show me all users who signed up in the last 7 days"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#5568d3'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#667eea'
              }}
            >
              {loading ? 'Generating...' : 'Generate SQL Query'}
            </button>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#991b1b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {sqlResult && <QueryDisplay result={sqlResult} />}
        </div>
      </div>
    </div>
  )
}

export default App
