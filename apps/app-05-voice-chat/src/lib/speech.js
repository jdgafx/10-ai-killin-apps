/**
 * Voice Processing with Web Speech API
 * Handles speech-to-text and text-to-speech
 */

export class VoiceProcessor {
  constructor() {
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.isRecording = false
  }

  initialize() {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
      this.recognition.maxAlternatives = 1
    } else {
      console.warn('Speech Recognition not supported in this browser')
    }
  }

  startRecording(onResult, onError) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser')
      return
    }
    
    this.isRecording = true
    
    this.recognition.onresult = (event) => {
      const last = event.results.length - 1
      const transcript = event.results[last][0].transcript
      onResult(transcript)
    }
    
    this.recognition.onerror = (event) => {
      onError(event.error)
      this.isRecording = false
    }
    
    this.recognition.onend = () => {
      this.isRecording = false
    }
    
    try {
      this.recognition.start()
    } catch (error) {
      onError(error.message)
      this.isRecording = false
    }
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop()
    }
    this.isRecording = false
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = options.lang || 'en-US'
      utterance.rate = options.rate || 1.0
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onend = () => resolve()
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        reject(event)
      }

      this.synthesis.speak(utterance)
    })
  }

  stopSpeaking() {
    this.synthesis.cancel()
  }

  getVoices() {
    return this.synthesis.getVoices()
  }

  isSupported() {
    return !!this.recognition && !!this.synthesis
  }
}

export function checkBrowserSupport() {
  const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  const hasSynthesis = 'speechSynthesis' in window

  return {
    recognition: hasRecognition,
    synthesis: hasSynthesis,
    fullSupport: hasRecognition && hasSynthesis
  }
}

export function requestMicrophonePermission() {
  return navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => true)
    .catch((error) => {
      console.error('Microphone permission denied:', error)
      return false
    })
}
