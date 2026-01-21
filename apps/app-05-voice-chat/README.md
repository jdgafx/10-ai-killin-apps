# Voice-First AI Conversation Platform

Real-time voice conversations with AI using Web Speech API and MiniMax.

## Features

- 🎤 **Speech-to-Text**: Real-time voice recognition
- 🔊 **Text-to-Speech**: Natural AI voice responses
- 💬 **Dual Input**: Voice or text input
- 🌊 **Visual Feedback**: Animated waveforms during recording
- 🔄 **Conversation Memory**: Maintains context across messages
- 🎚️ **Auto-Speak Toggle**: Enable/disable automatic voice responses

## Quick Start

```bash
# Install dependencies
npm install

# Add your API key
echo "VITE_MINIMAX_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

## Browser Requirements

**Required for full functionality:**
- Chrome, Edge, Safari, or Opera (latest versions)
- HTTPS connection (required for microphone access in production)
- Microphone permissions

**Note**: Firefox has limited Web Speech API support.

## Usage

1. **Voice Input**: Click the microphone button and speak
2. **Text Input**: Type your message in the input field
3. **Auto-Speak**: Toggle speaker icon to enable/disable voice responses
4. **View History**: Scroll through conversation history

## Features in Detail

### Speech Recognition
- Continuous listening while button is pressed
- Real-time transcript display
- Automatic stop after speech ends

### Voice Synthesis
- Natural-sounding AI voice
- Adjustable rate, pitch, and volume
- Multiple voice options (browser-dependent)

### Conversation Management
- Maintains last 10 message pairs
- Context-aware responses
- Concise, conversational AI replies

## Configuration

Set your MiniMax API key in `.env`:

```env
VITE_MINIMAX_API_KEY=your_api_key_here
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```
✅ Automatic HTTPS for microphone access

### GitHub Pages
Requires HTTPS configuration for microphone permissions.

### Docker (Coolify)
```bash
docker build -t voice-chat .
docker run -p 3005:80 voice-chat
```

## Troubleshooting

**Microphone not working:**
- Ensure HTTPS is enabled
- Check browser permissions
- Try Chrome/Edge for best support

**No voice output:**
- Check system volume
- Enable auto-speak toggle
- Verify browser supports speech synthesis

## Technologies

- **React**: UI framework
- **Web Speech API**: Voice recognition and synthesis
- **MiniMax AI**: Conversation intelligence
- **Canvas API**: Waveform visualization

## License

MIT
