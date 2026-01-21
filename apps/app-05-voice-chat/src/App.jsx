import React, { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, AlertCircle, Send, Sparkles, Bot, User } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="min-h-screen backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-4xl w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Voice AI Chat
                  </h1>
                  <p className="text-white/80 text-sm">
                    Speak naturally, get intelligent responses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  autoSpeak 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
              >
                {autoSpeak ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-bold text-red-800">Error</div>
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {conversation.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="p-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
                  <Mic className="w-20 h-20 text-indigo-400" />
                </div>
                <p className="text-2xl font-bold text-gray-600 mb-2">Ready to Chat!</p>
                <p className="text-base text-gray-500 text-center max-w-md">
                  Press the microphone button to speak or type your message below
                </p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-br-sm'
                        : 'bg-white border-2 border-gray-200 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1 opacity-80">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="text-base leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isSpeaking && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="px-5 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl rounded-bl-sm flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-yellow-700 animate-pulse" />
                  <span className="text-yellow-800 font-medium">AI is speaking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="mx-6 mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-red-800">Recording...</span>
              </div>
              <AudioWaveform isActive={isRecording} />
              {transcript && (
                <p className="mt-3 text-sm text-red-800 font-medium p-3 bg-white/50 rounded-lg">
                  {transcript}
                </p>
              )}
            </div>
          )}

          {/* Voice Input */}
          <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
            <VoiceInput
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onTextSubmit={handleTextSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
