import { MessageSquare, Bot } from 'lucide-react'

export default function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {isUser ? 'You' : message.provider || 'AI Assistant'}
          </span>
          {message.timestamp && (
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="text-gray-800 whitespace-pre-wrap">{message.content}</div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs font-semibold text-gray-600">Sources:</div>
            {message.sources.map((source, idx) => (
              <div key={idx} className="text-xs bg-white p-2 rounded border border-gray-200">
                <div className="text-gray-700">{source.text}</div>
                <div className="text-gray-500 mt-1">
                  Relevance: {(source.similarity * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
