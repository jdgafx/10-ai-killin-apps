import React from 'react'
import { Brain, MessageCircle, Send, Loader } from 'lucide-react'

function DocumentAnalysis({ analysis, document, question, setQuestion, onAskQuestion, answer, loading }) {
  return (
    <div style={{
      marginTop: '2rem',
      display: 'grid',
      gap: '1.5rem'
    }}>
      <div style={{
        padding: '1.5rem',
        background: '#f0f4ff',
        borderRadius: '12px',
        border: '1px solid #c7d2fe'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Brain size={24} color="#667eea" />
          Document Analysis
        </h2>

        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {analysis.summary && (
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                Summary
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#1f2937',
                lineHeight: '1.6'
              }}>
                {analysis.summary}
              </p>
            </div>
          )}

          {analysis.keywords && (
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                Key Terms
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.sentiment && (
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                Sentiment
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#1f2937'
              }}>
                {analysis.sentiment}
              </p>
            </div>
          )}

          {analysis.type && (
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                Document Type
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#1f2937'
              }}>
                {analysis.type}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{
        padding: '1.5rem',
        background: '#f0fdf4',
        borderRadius: '12px',
        border: '1px solid #bbf7d0'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <MessageCircle size={24} color="#10b981" />
          Ask Questions
        </h2>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                onAskQuestion()
              }
            }}
            placeholder="Ask a question about the document..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={onAskQuestion}
            disabled={loading || !question.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading || !question.trim() ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>

        {answer && (
          <div style={{
            padding: '1rem',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#047857',
              marginBottom: '0.5rem'
            }}>
              Answer:
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#1f2937',
              lineHeight: '1.6'
            }}>
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentAnalysis
