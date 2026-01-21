import React from 'react'
import { FileText, TrendingUp, Calendar, Tag } from 'lucide-react'

function SearchResults({ results, query }) {
  if (!query) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        <FileText size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <p style={{ fontSize: '1.125rem' }}>
          Enter a search query to find relevant documents
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        <p style={{ fontSize: '1.125rem' }}>
          No results found for "{query}"
        </p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Try different keywords or add more documents
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        background: '#f0f4ff',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: '#374151',
          fontWeight: '600'
        }}>
          Found {results.length} relevant {results.length === 1 ? 'document' : 'documents'}
        </p>
        <p style={{
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          Sorted by relevance
        </p>
      </div>

      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {results.map((result, index) => (
          <div
            key={result.id || index}
            style={{
              padding: '1.5rem',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '0.75rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                {result.title}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: getScoreColor(result.score),
                borderRadius: '9999px'
              }}>
                <TrendingUp size={14} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {(result.score * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.875rem',
              color: '#4b5563',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              {result.content}
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              {result.category && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Tag size={14} />
                  {result.category}
                </span>
              )}
              {result.date && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Calendar size={14} />
                  {result.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getScoreColor(score) {
  if (score >= 0.8) return '#10b981'
  if (score >= 0.6) return '#3b82f6'
  if (score >= 0.4) return '#f59e0b'
  return '#ef4444'
}

export default SearchResults
