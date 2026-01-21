import React, { useState } from 'react'
import { FileText, AlertCircle } from 'lucide-react'
import DocumentUpload from './components/DocumentUpload'
import DocumentAnalysis from './components/DocumentAnalysis'
import { extractTextFromPDF, extractTextFromFile } from './lib/parser'
import { summarizeDocument, analyzeDocument } from './lib/summarizer'
import { answerQuestion } from './lib/qa'

function App() {
  const [document, setDocument] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)

  const handleFileUpload = async (file) => {
    setLoading(true)
    setError(null)
    setAnalysis(null)
    setAnswer(null)

    try {
      let text = ''

      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await extractTextFromFile(file)
      } else {
        throw new Error('Unsupported file type. Please upload PDF or TXT files.')
      }

      if (!text.trim()) {
        throw new Error('No text content found in the document')
      }

      setDocument({
        name: file.name,
        type: file.type,
        size: file.size,
        text: text,
        uploadedAt: Date.now()
      })

      // Automatically analyze the document
      const analysisResult = await analyzeDocument(text)
      setAnalysis(analysisResult)
    } catch (err) {
      setError(err.message || 'Failed to process document')
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim() || !document) return

    setLoading(true)
    setError(null)

    try {
      const response = await answerQuestion(document.text, question)
      setAnswer(response)
      setQuestion('')
    } catch (err) {
      setError(err.message || 'Failed to answer question')
    } finally {
      setLoading(false)
    }
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
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <FileText size={32} color="#667eea" />
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            AI Document Processor
          </h1>
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

        <DocumentUpload
          onFileUpload={handleFileUpload}
          loading={loading}
          hasDocument={!!document}
        />

        {document && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Document: {document.name}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Size: {(document.size / 1024).toFixed(2)} KB | 
              Characters: {document.text.length.toLocaleString()}
            </p>
          </div>
        )}

        {analysis && (
          <DocumentAnalysis
            analysis={analysis}
            document={document}
            question={question}
            setQuestion={setQuestion}
            onAskQuestion={handleAskQuestion}
            answer={answer}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

export default App
