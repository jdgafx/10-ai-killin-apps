# Generative UI Component Builder

AI-powered React component generator with live preview, code export, and template library.

## Features

- ✨ **Natural Language Generation**: Describe components in plain English
- 👁️ **Live Preview**: See your components render in real-time
- 📝 **Code Export**: Copy or download generated component code
- 📚 **Template Library**: Pre-built templates for common components
- 🎨 **Tailwind CSS**: All components use Tailwind for styling
- 🔧 **Customizable**: Adjust generation options and component types

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- PrismJS for syntax highlighting
- Lucide React Icons
- AI Providers Package (workspace dependency)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start development server:
```bash
npm run dev
```

## How It Works

### Component Generation Pipeline

1. **Input**: User describes component in natural language
2. **Type Detection**: Auto-detect component type or use selection
3. **Code Generation**: 
   - Check template library for matches
   - Generate custom component if no match
   - Apply Tailwind CSS styling
4. **Live Preview**: Render component in sandboxed iframe
5. **Export**: Copy to clipboard or download as .jsx file

### Template Library

Built-in templates include:
- **Button**: Interactive buttons with variants
- **Card**: Container components with headers/footers
- **Input**: Form inputs with labels and validation
- **Modal**: Overlay dialog components
- **Badge**: Status indicators and labels
- **Alert**: Notification messages

### Live Preview

The preview uses an iframe sandbox with:
- React 18 (UMD build)
- ReactDOM 18
- Tailwind CSS (CDN)
- Babel Standalone for JSX transformation

## Usage

### Generate from Description

1. Enter a component description: "A pricing card with three tiers"
2. Optional: Select component type
3. Toggle options (props, styles)
4. Click "Generate Component"
5. View live preview and code

### Use Templates

1. Browse template library in sidebar
2. Click any template to load
3. Customize in preview
4. Export code when ready

### Export Component

**Copy to Clipboard:**
- Click "Copy" button in Code tab
- Paste into your project

**Download File:**
- Click "Download" button
- Saves as Component.jsx
- Import into your React app

## Project Structure

```
src/
├── App.jsx                          # Main application
├── components/
│   ├── ComponentGenerator.jsx      # Generation interface
│   ├── LivePreview.jsx             # Preview iframe
│   └── CodeExport.jsx              # Code display & export
├── lib/
│   └── component-templates.js      # Template library
└── main.jsx                        # Entry point
```

## Deployment

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

### Vercel
```bash
vercel deploy
```

### Coolify
Use the provided Dockerfile for deployment.

## Environment Variables

- `VITE_DEEPSEEK_API_KEY`: DeepSeek API key (for advanced generation)
- `VITE_BASE_PATH`: Base path for deployment (e.g., `/app-03-ui-builder`)

## Customization

### Add Custom Templates

Edit `src/lib/component-templates.js`:

```javascript
export const COMPONENT_TEMPLATES = {
  myComponent: {
    name: 'My Component',
    description: 'Description here',
    code: `export default function MyComponent() { ... }`,
    example: `<MyComponent />`,
  },
}
```

### Modify Generation Logic

Edit `src/components/ComponentGenerator.jsx`:
- Adjust `generateComponent()` function
- Add more options
- Integrate with AI providers

## Future Enhancements

- [ ] Real AI-powered generation (DeepSeek Coder)
- [ ] Multi-file component exports
- [ ] TypeScript support
- [ ] Component composition
- [ ] Style preset library
- [ ] Component testing utilities
- [ ] Storybook integration

## License

MIT
