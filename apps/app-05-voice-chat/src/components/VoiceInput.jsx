import React, { useState } from 'react'
import { Mic, MicOff, Send } from 'lucide-react'

function VoiceInput({ isRecording, onStartRecording, onStopRecording, onTextSubmit }) {
  const [textInput, setTextInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (textInput.trim()) {
      onTextSubmit(textInput)
      setTextInput('')
    }
  }

  const handleVoiceToggle = () => {
    if (isRecording) {
      onStopRecording()
    } else {
      onStartRecording()
    }
  }

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    }}>
      <button
        onClick={handleVoiceToggle}
        style={{
          padding: '1rem',
          background: isRecording ? '#ef4444' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none'
        }}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Or type your message..."
          disabled={isRecording}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            opacity: isRecording ? 0.5 : 1
          }}
        />
        <button
          type="submit"
          disabled={!textInput.trim() || isRecording}
          style={{
            padding: '0.75rem 1rem',
            background: textInput.trim() && !isRecording ? '#667eea' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: textInput.trim() && !isRecording ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

export default VoiceInput
