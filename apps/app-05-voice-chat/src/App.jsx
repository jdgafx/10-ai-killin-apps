import React, { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, AlertCircle } from 'lucide-react'
import VoiceInput from './components/VoiceInput'
import AudioWaveform from './components/AudioWaveform'
import { VoiceProcessor } from './lib/speech'
import { sendMessage, conversationHistory } from './lib/conversation'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState(null)
  const [voiceProcessor] = useState(() => new VoiceProcessor())
  const [autoSpeak, setAutoSpeak] = useState(true)

  useEffect(() => {
    voiceProcessor.initialize()
  }, [voiceProcessor])

  const handleStartRecording = () => {
    setError(null)
    setIsRecording(true)
    
    voiceProcessor.startRecording(
      (text) => {
        setTranscript(text)
      },
      (err) => {
        setError(`Voice recognition error: ${err}`)
        setIsRecording(false)
      }
    )
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    voiceProcessor.stopRecording()

    if (transcript.trim()) {
      const userMessage = { role: 'user', content: transcript, timestamp: Date.now() }
      setConversation(prev => [...prev, userMessage])
      
      try {
        const aiResponse = await sendMessage(transcript)
        const aiMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() }
        setConversation(prev => [...prev, aiMessage])

        if (autoSpeak) {
          setIsSpeaking(true)
          await voiceProcessor.speak(aiResponse)
          setIsSpeaking(false)
        }
      } catch (err) {
        setError(`AI response error: ${err.message}`)
      }

      setTranscript('')
    }
  }

  const handleTextSubmit = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text, timestamp: Date.now() }
    setConversation(prev => [...prev, userMessage])
    
    try {
      const aiResponse = await sendMessage(text)
      const aiMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() }
      setConversation(prev => [...prev, aiMessage])

      if (autoSpeak) {
        setIsSpeaking(true)
        await voiceProcessor.speak(aiResponse)
        setIsSpeaking(false)
      }
    } catch (err) {
      setError(`AI response error: ${err.message}`)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MessageCircle size={32} color="#667eea" />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Voice AI Chat
            </h1>
          </div>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            style={{
              padding: '0.5rem',
              background: autoSpeak ? '#10b981' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
          >
            {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
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

        <div style={{
          height: '400px',
          overflowY: 'auto',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          {conversation.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              textAlign: 'center'
            }}>
              <div>
                <Mic size={48} style={{ margin: '0 auto 1rem' }} />
                <p>Start a conversation by speaking or typing</p>
              </div>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  background: message.role === 'user' ? '#dbeafe' : '#d1fae5',
                  borderRadius: '8px',
                  marginLeft: message.role === 'user' ? '2rem' : '0',
                  marginRight: message.role === 'assistant' ? '2rem' : '0'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: message.role === 'user' ? '#1e40af' : '#047857',
                  marginBottom: '0.25rem'
                }}>
                  {message.role === 'user' ? 'You' : 'AI'}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1f2937',
                  lineHeight: '1.5'
                }}>
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isSpeaking && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#fef3c7',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#78350f',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Volume2 size={16} />
              AI is speaking...
            </div>
          )}
        </div>

        {isRecording && (
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '8px'
          }}>
            <AudioWaveform isActive={isRecording} />
            {transcript && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#78350f'
              }}>
                {transcript}
              </p>
            )}
          </div>
        )}

        <VoiceInput
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onTextSubmit={handleTextSubmit}
        />
      </div>
    </div>
  )
}

export default App
