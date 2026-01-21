import { useState } from 'react'
import { Sparkles, Code, Eye, Wand2, Layout, Zap, Copy } from 'lucide-react'
import ComponentGenerator from './components/ComponentGenerator'
import LivePreview from './components/LivePreview'
import CodeExport from './components/CodeExport'
import { getAllTemplates } from './lib/component-templates'

function App() {
  const [generatedComponent, setGeneratedComponent] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')

  const handleGenerate = async (component) => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setGeneratedComponent(component)
    setActiveTab('preview')
    setIsGenerating(false)
  }

  const templates = getAllTemplates()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
      <div className="min-h-screen backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border border-white/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Component Builder
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Transform ideas into beautiful React components instantly
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Generate</h2>
                </div>
                <ComponentGenerator 
                  onGenerate={handleGenerate}
                  isLoading={isGenerating}
                />
              </div>

              {/* Template Library */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-lg text-gray-800">Templates</h3>
                </div>
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
                      className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl transition-all border border-purple-200 hover:border-purple-400 hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-sm text-gray-800 group-hover:text-purple-600 transition-colors">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {template.description}
                          </div>
                        </div>
                        <Sparkles className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="bg-white/95 backdrop-blur-md rounded-t-2xl shadow-2xl border border-white/20 border-b-0 overflow-hidden">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'code'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <Code className="w-5 h-5" />
                    <span>Source Code</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white/95 backdrop-blur-md rounded-b-2xl shadow-2xl p-6 border border-white/20 min-h-[600px]">
                {!generatedComponent ? (
                  <div className="h-[550px] flex flex-col items-center justify-center text-gray-400">
                    <div className="p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-6">
                      <Sparkles className="w-20 h-20 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-600 mb-2">Ready to Create Magic?</p>
                    <p className="text-base text-gray-500">
                      Describe a component or choose a template to begin
                    </p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'preview' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            <span className="font-bold text-gray-800">Interactive Preview</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              Live
                            </span>
                          </div>
                        </div>
                        <LivePreview 
                          code={generatedComponent.code}
                          example={generatedComponent.example}
                        />
                      </div>
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
                <div className="mt-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Component Details
                      </h3>
                      <p className="text-sm text-gray-600">
                        {generatedComponent.description}
                      </p>
                    </div>
                    {generatedComponent.dependencies && (
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-gray-500 mb-2 font-semibold">Dependencies:</div>
                        <div className="flex flex-wrap gap-2">
                          {generatedComponent.dependencies.map((dep, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full font-bold border border-purple-200"
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
    </div>
  )
}

export default App
