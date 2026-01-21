import { FileText, Mail, MessageSquare } from 'lucide-react'

export default function ContentTypeSelector({ value, onChange }) {
  const types = [
    { id: 'blog', label: 'Blog Post', icon: FileText, description: 'Long-form articles' },
    { id: 'social', label: 'Social Media', icon: MessageSquare, description: 'Quick engaging posts' },
    { id: 'email', label: 'Email', icon: Mail, description: 'Professional emails' },
  ]

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3">Content Type</label>
      <div className="grid grid-cols-3 gap-3">
        {types.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                value === type.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${
                value === type.id ? 'text-purple-600' : 'text-gray-600'
              }`} />
              <div className="text-sm font-semibold">{type.label}</div>
              <div className="text-xs text-gray-500 mt-1">{type.description}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
