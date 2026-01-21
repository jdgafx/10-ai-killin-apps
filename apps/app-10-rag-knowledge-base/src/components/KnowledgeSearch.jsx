import { Search, Sparkles, HelpCircle } from 'lucide-react'

export default function KnowledgeSearch({ 
  question, 
  onQuestionChange, 
  onSearch, 
  isSearching,
  documentsCount 
}) {
  const exampleQuestions = [
    "What are the main topics covered?",
    "Summarize the key points",
    "What are the important takeaways?",
    "Explain the methodology used"
  ]

  const handleExampleClick = (example) => {
    onQuestionChange(example)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ask Questions</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSearching || documentsCount === 0}
          className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Get Answer
            </span>
          )}
        </button>
      </form>

      {documentsCount === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-yellow-800">
            <HelpCircle className="w-5 h-5" />
            <p className="font-semibold">No documents available</p>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Add some documents first to start asking questions
          </p>
        </div>
      )}

      {/* Example Questions */}
      {documentsCount > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Example Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleQuestions.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
