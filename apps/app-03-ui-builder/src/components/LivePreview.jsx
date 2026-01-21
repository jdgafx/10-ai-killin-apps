import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Maximize2 } from 'lucide-react'

export default function LivePreview({ code, example }) {
  const iframeRef = useRef(null)
  const [error, setError] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!iframeRef.current || !code) return

    try {
      const html = generatePreviewHTML(code, example)
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow.document
      
      doc.open()
      doc.write(html)
      doc.close()
      
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [code, example])

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">Live Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex-1 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-center">
            <p className="text-red-800 font-semibold mb-2">Preview Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      ) : (
        <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
          <iframe
            ref={iframeRef}
            className="w-full h-full border border-gray-300 rounded-lg bg-white"
            sandbox="allow-scripts"
            title="Component Preview"
          />
        </div>
      )}
    </div>
  )
}

function generatePreviewHTML(code, example) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body {
        margin: 0;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const { useState } = React;
      
      ${code}
      
      function App() {
        return (
          <div className="p-4">
            ${example || '<Component />'}
          </div>
        );
      }
      
      ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
  </body>
</html>`
}
