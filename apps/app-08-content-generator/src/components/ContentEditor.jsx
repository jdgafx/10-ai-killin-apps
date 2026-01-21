import { Copy, Download, FileText } from 'lucide-react'

export default function ContentEditor({ content, onChange, contentType }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      alert('Content copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contentType}-content-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Generated Content</h2>
        {content && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download as text file"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {!content ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <FileText className="w-16 h-16 mb-4" />
          <p className="text-lg">Your generated content will appear here</p>
          <p className="text-sm mt-2">Fill in the settings and click Generate Content</p>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
          placeholder="Generated content will appear here..."
        />
      )}

      {content && (
        <div className="mt-4 text-sm text-gray-500">
          {content.split(/\s+/).length} words • {content.length} characters
        </div>
      )}
    </div>
  )
}
