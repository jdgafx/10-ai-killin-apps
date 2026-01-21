import { useState } from 'react'
import { Plus, Trash2, FileText, Calendar, Hash } from 'lucide-react'

export default function DocumentManager({ documents, onAddDocument, onDeleteDocument }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsAdding(true)

    try {
      await onAddDocument(title, content, {
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        addedAt: new Date().toISOString()
      })
      
      setTitle('')
      setContent('')
      setTags('')
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to add document:', err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Document Library</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Document
        </button>
      </div>

      {/* Add Document Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">New Document</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter document title..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Paste or type document content..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ai, technology, research..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isAdding}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add Document'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No documents yet</p>
            <p className="text-sm">Add your first document to start building your knowledge base</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold">{doc.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {doc.content.slice(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <div>{doc.content.split(' ').length} words</div>
                    {doc.chunks && <div>{doc.chunks.length} chunks</div>}
                    {doc.metadata?.tags && (
                      <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        {doc.metadata.tags.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete document"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
