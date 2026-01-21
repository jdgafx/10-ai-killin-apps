import { useState } from 'react'
import { Copy, Download, Check } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism-tomorrow.css'

export default function CodeExport({ code, description }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Component.jsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const highlightedCode = code 
    ? Prism.highlight(code, Prism.languages.jsx, 'jsx')
    : ''

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">Generated Code</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
            disabled={!code}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm"
            disabled={!code}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {description && (
        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{description}</p>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-gray-900 rounded-lg">
        {code ? (
          <pre className="p-4 text-sm">
            <code 
              className="language-jsx"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No code generated yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
