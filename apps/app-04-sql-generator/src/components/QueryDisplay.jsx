import React from 'react'
import { CheckCircle, AlertTriangle, Copy } from 'lucide-react'
import { validateSQL } from '../lib/query-validator'

function QueryDisplay({ result }) {
  const validation = validateSQL(result.query)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.query)
  }

  return (
    <div style={{
      padding: '1.5rem',
      background: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          Generated SQL Query
        </h2>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '0.5rem 1rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Copy size={16} />
          Copy
        </button>
      </div>

      <div style={{
        padding: '1rem',
        background: '#1f2937',
        borderRadius: '8px',
        marginBottom: '1rem',
        overflow: 'auto'
      }}>
        <pre style={{
          margin: 0,
          color: '#e5e7eb',
          fontSize: '0.875rem',
          fontFamily: 'Courier New, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {result.query}
        </pre>
      </div>

      {result.parameters && result.parameters.length > 0 && (
        <div style={{
          padding: '1rem',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#92400e',
            marginBottom: '0.5rem'
          }}>
            Parameters:
          </h3>
          <code style={{
            color: '#78350f',
            fontSize: '0.875rem'
          }}>
            {JSON.stringify(result.parameters)}
          </code>
        </div>
      )}

      {result.explanation && (
        <div style={{
          padding: '1rem',
          background: '#dbeafe',
          border: '1px solid #93c5fd',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '0.5rem'
          }}>
            Explanation:
          </h3>
          <p style={{
            color: '#1e3a8a',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {result.explanation}
          </p>
        </div>
      )}

      {result.warning && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'start',
          gap: '0.5rem'
        }}>
          <AlertTriangle size={20} color="#991b1b" />
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#991b1b',
              marginBottom: '0.5rem'
            }}>
              Warning:
            </h3>
            <p style={{
              color: '#7f1d1d',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {result.warning}
            </p>
          </div>
        </div>
      )}

      <div style={{
        padding: '1rem',
        background: validation.valid ? '#d1fae5' : '#fee2e2',
        border: `1px solid ${validation.valid ? '#6ee7b7' : '#fca5a5'}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <CheckCircle
          size={20}
          color={validation.valid ? '#059669' : '#dc2626'}
        />
        <span style={{
          color: validation.valid ? '#047857' : '#991b1b',
          fontWeight: '600'
        }}>
          {validation.message}
        </span>
      </div>
    </div>
  )
}

export default QueryDisplay
