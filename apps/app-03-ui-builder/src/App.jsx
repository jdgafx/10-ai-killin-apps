import { useState } from 'react'
import { Sparkles, Code, Eye } from 'lucide-react'
import ComponentGenerator from './components/ComponentGenerator'
import LivePreview from './components/LivePreview'
import CodeExport from './components/CodeExport'
import { getAllTemplates } from './lib/component-templates'

function App() {
  const [generatedComponent, setGeneratedComponent] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')

  const handleGenerate = async (component) => {
    setIsGenerating(true)
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setGeneratedComponent(component)
    setActiveTab('preview')
    setIsGenerating(false)
  }

  const templates = getAllTemplates()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Generative UI Component Builder
          </h1>
          <p className="text-gray-600">
            Transform natural language into React components with live preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Generator */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                Generate Component
              </h2>
              <ComponentGenerator 
                onGenerate={handleGenerate}
                isLoading={isGenerating}
              />
            </div>

            {/* Template Library */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-lg mb-3">Template Library</h3>
              <div className="space-y-2">
                {templates.slice(0, 6).map((template) => (
                  <button
                    key={template.key}
                    onClick={() => handleGenerate({
                      code: template.code,
                      description: template.description,
                      example: template.example,
                      dependencies: ['react'],
                    })}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors border border-gray-200 hover:border-purple-300"
                  >
                    <div className="font-semibold text-sm text-gray-800">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-t-lg shadow-lg">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 px-6 py-3 font-semibold flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'preview'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex-1 px-6 py-3 font-semibold flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'code'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Code className="w-5 h-5" />
                  Code
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-lg shadow-lg p-6" style={{ height: '600px' }}>
              {!generatedComponent ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Sparkles className="w-16 h-16 mb-4" />
                  <p className="text-lg font-semibold">No Component Generated Yet</p>
                  <p className="text-sm mt-2">
                    Describe a component or select a template to get started
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === 'preview' && (
                    <LivePreview 
                      code={generatedComponent.code}
                      example={generatedComponent.example}
                    />
                  )}
                  {activeTab === 'code' && (
                    <CodeExport 
                      code={generatedComponent.code}
                      description={generatedComponent.description}
                    />
                  )}
                </>
              )}
            </div>

            {/* Component Info */}
            {generatedComponent && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Component Details</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {generatedComponent.description}
                    </p>
                  </div>
                  {generatedComponent.dependencies && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Dependencies:</div>
                      <div className="flex gap-2">
                        {generatedComponent.dependencies.map((dep, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
