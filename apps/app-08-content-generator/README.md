# AI Content Generator

Multi-purpose AI content generation platform for creating blog posts, social media content, and professional emails.

## Features

- **Blog Post Generator**: Create comprehensive, SEO-optimized blog posts
- **Social Media Generator**: Generate engaging posts for various platforms
- **Email Generator**: Write professional emails with customizable tones
- **Tone Control**: Multiple tone options (professional, casual, friendly, formal, enthusiastic, informative)
- **Keyword Integration**: Incorporate specific keywords naturally
- **Real-time Editing**: Edit generated content directly in the app
- **Export Options**: Copy to clipboard or download as text file

## Tech Stack

- React 18 with Hooks
- Vite for blazing-fast development
- Tailwind CSS for styling
- Lucide React for icons
- Multi-model AI support (MiniMax, Gemini, DeepSeek)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env
```

### Development

```bash
# Start development server (port 3008)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```
VITE_MINIMAX_API_KEY=your_minimax_api_key
VITE_MINIMAX_GROUP_ID=your_minimax_group_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Usage

1. **Select Content Type**: Choose between Blog Post, Social Media, or Email
2. **Enter Topic**: Describe what you want to write about
3. **Add Keywords**: (Optional) Include specific keywords to incorporate
4. **Choose Tone**: Select the writing style that fits your needs
5. **Generate**: Click to create AI-powered content
6. **Edit**: Modify the generated content as needed
7. **Export**: Copy or download your content

## Content Types

### Blog Posts
- 800-1200 words
- SEO-optimized structure
- Engaging titles and hooks
- Multiple sections with subheadings
- Conclusion with CTA

### Social Media Posts
- Platform-optimized length
- Attention-grabbing hooks
- Relevant hashtags
- Emoji integration
- Clear call-to-action

### Emails
- Compelling subject lines
- Professional structure
- Clear messaging
- Action-oriented CTAs
- Multiple email types supported

## Deployment

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

### Coolify
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables configured in Coolify dashboard

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles
├── components/
│   ├── ContentTypeSelector.jsx  # Content type selection
│   ├── ContentEditor.jsx        # Content editing interface
│   └── ToneSelector.jsx         # Tone/style controls
└── lib/
    └── generators/
        ├── BlogGenerator.js     # Blog post generation logic
        ├── SocialGenerator.js   # Social media generation logic
        └── EmailGenerator.js    # Email generation logic
```

## API Integration

Uses the shared `ai-providers` package for unified AI provider access:

```javascript
import { chat } from 'ai-providers'

const response = await chat([
  { role: 'system', content: 'System prompt' },
  { role: 'user', content: 'User prompt' }
])
```

## Error Handling

- Network error recovery
- API failure fallbacks
- User-friendly error messages
- Input validation

## Performance

- Lazy loading for components
- Optimized bundle size
- Fast initial load
- Efficient re-renders

## License

MIT

## Author

Part of the 10 AI Killin' Apps Portfolio
