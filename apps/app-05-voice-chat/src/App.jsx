import React, { useState, useEffect } from 'react'
import { Mic, Volume2, VolumeX, AlertCircle } from 'lucide-react'
import VoiceInput from './components/VoiceInput'
import AudioWaveform from './components/AudioWaveform'
import { VoiceProcessor } from './lib/speech'
import { sendMessage } from './lib/conversation'

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-400/30 via-transparent to-transparent animate-pulse"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in duration-700">
          <h1 className="text-6xl font-bold text-white mb-3 drop-shadow-2xl bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">Voice Chat AI</h1>
          <p className="text-white/90 text-xl backdrop-blur-lg bg-white/10 inline-block px-6 py-2 rounded-full border border-white/30 shadow-lg">Speak naturally with AI</p>
        </div>

        {/* Central Circular Mic Area */}
        <div className="relative mb-10">
          {/* Outer Glow Ring */}
          <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 ${
            isRecording ? 'bg-yellow-300 animate-pulse scale-150' : 'bg-white/30 scale-125'
          }`}></div>
          
          {/* Waveform Circle */}
          <div className="relative">
            <div className={`w-80 h-80 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isRecording 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/50 scale-110' 
                : isSpeaking
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/50 scale-110'
                : 'bg-gradient-to-br from-white to-gray-100 shadow-purple-500/50'
            }`}>
              {/* Inner Waveform Ring */}
              {(isRecording || isSpeaking) && (
                <div className="absolute inset-8">
                  <AudioWaveform isActive={isRecording || isSpeaking} />
                </div>
              )}
              
              {/* Mic Button */}
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 shadow-2xl ${
                  isRecording 
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                }`}
              >
                <Mic className={`w-24 h-24 text-white ${isRecording ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          {/* Audio Toggle - Floating */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 p-4 rounded-full shadow-xl transition-all transform hover:scale-110 ${
              autoSpeak 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title={autoSpeak ? 'Audio enabled' : 'Audio disabled'}
          >
            {autoSpeak ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="bg-yellow-300 text-yellow-900 px-6 py-3 rounded-full font-bold shadow-lg mb-4 animate-pulse">
            🎙️ Listening...
          </div>
        )}
        {isSpeaking && (
          <div className="bg-green-300 text-green-900 px-6 py-3 rounded-full font-bold shadow-lg mb-4 animate-pulse">
            🔊 Speaking...
          </div>
        )}

        {/* Transcript Display */}
        {transcript && isRecording && (
          <div className="max-w-2xl bg-white/95 backdrop-blur rounded-2xl px-6 py-4 shadow-xl mb-4">
            <p className="text-gray-800 text-center italic">"{transcript}"</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl bg-red-500 text-white px-6 py-4 rounded-2xl shadow-xl mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Messages Below - Circular Cards */}
        <div className="w-full max-w-3xl space-y-4 max-h-80 overflow-y-auto px-4">
          {conversation.length === 0 ? (
            <div className="text-center text-white/80 py-8">
              <p className="text-xl font-medium">Press the mic to start</p>
              <p className="text-sm mt-2">Your conversation will appear here</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-6 py-4 rounded-3xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-white text-gray-800'
                      : 'bg-gradient-to-br from-pink-400 to-purple-500 text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 opacity-75">
                    {message.role === 'user' ? '🎤 You' : '🤖 AI'}
                  </div>
                  <div className="text-base leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Text Input Alternative - Below messages */}
        <div className="mt-8 w-full max-w-2xl">
          <VoiceInput
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onTextSubmit={handleTextSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default App
