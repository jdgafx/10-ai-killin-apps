import React from 'react'
import { Search, Loader } from 'lucide-react'

function SearchBar({ query, setQuery, onSearch, loading, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!disabled && query.trim()) {
      onSearch()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <div style={{
          flex: 1,
          position: 'relative'
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything... (e.g., 'machine learning concepts' or 'web development best practices')"
            disabled={disabled || loading}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: '2px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              opacity: disabled ? 0.6 : 1,
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
            }}
          />
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || loading || !query.trim()}
          style={{
            padding: '1rem 2rem',
            background: (disabled || loading || !query.trim()) ? '#9ca3af' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: (disabled || loading || !query.trim()) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '120px',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!disabled && !loading && query.trim()) {
              e.target.style.background = '#5568d3'
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !loading && query.trim()) {
              e.target.style.background = '#667eea'
            }
          }}
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Searching
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>
      
      {disabled && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444',
          textAlign: 'center'
        }}>
          Documents are being indexed. Please wait...
        </p>
      )}
    </form>
  )
}

export default SearchBar
