import { CheckCircle, FileText, ExternalLink, Copy } from 'lucide-react'

export default function AnswerDisplay({ answer }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer.answer)
      alert('Answer copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-green-900">Answer</h3>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Copy answer"
        >
          <Copy className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Question */}
      <div className="mb-4 pb-4 border-b border-green-200">
        <div className="text-sm font-semibold text-green-700 mb-1">Question:</div>
        <div className="text-gray-800">{answer.question}</div>
      </div>

      {/* Answer */}
      <div className="mb-6">
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {answer.answer}
        </div>
      </div>

      {/* Sources */}
      {answer.sources && answer.sources.length > 0 && (
        <div className="border-t border-green-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Sources</h4>
          </div>
          <div className="space-y-3">
            {answer.sources.map((source, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border border-green-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-800">
                    {source.title}
                  </div>
                  {source.relevance && (
                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {Math.round(source.relevance * 100)}% relevant
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {source.content}
                </p>
                {source.metadata?.page && (
                  <div className="text-xs text-gray-500 mt-2">
                    Page {source.metadata.page}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-gray-500 mt-4 text-right">
        {new Date(answer.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
