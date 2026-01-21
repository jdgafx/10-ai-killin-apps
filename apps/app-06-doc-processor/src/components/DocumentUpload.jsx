import React, { useRef } from 'react'
import { Upload, FileText, Loader } from 'lucide-react'

function DocumentUpload({ onFileUpload, loading, hasDocument }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = React.useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{
        padding: '3rem',
        border: `2px dashed ${dragActive ? '#667eea' : '#d1d5db'}`,
        borderRadius: '12px',
        background: dragActive ? '#f0f4ff' : '#f9fafb',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: loading ? 0.6 : 1
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        onChange={handleChange}
        disabled={loading}
        style={{ display: 'none' }}
      />

      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Loader size={48} color="#667eea" className="animate-spin" />
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            Processing document...
          </p>
        </div>
      ) : hasDocument ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <FileText size={48} color="#10b981" />
          <div>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Document loaded successfully!
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Click or drag to upload a new document
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Upload size={48} color="#9ca3af" />
          <div>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Upload a document to analyze
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Drag and drop or click to browse
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '0.5rem'
            }}>
              Supports PDF and TXT files (max 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentUpload
