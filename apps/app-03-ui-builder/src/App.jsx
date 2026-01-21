import { useState } from 'react'
import { Code2, Eye, Layers, Terminal, Play, FileCode } from 'lucide-react'
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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar - VS Code Style */}
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <span className="font-mono text-sm font-semibold">UI Builder Studio</span>
          <span className="text-xs text-gray-400 font-mono">v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-emerald-400">READY</span>
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Component List & Generator */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-2 text-white">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-sm font-semibold uppercase tracking-wide">Explorer</span>
            </div>
          </div>

          {/* Generator Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-gray-300 font-semibold uppercase">Generate</span>
            </div>
            <ComponentGenerator 
              onGenerate={handleGenerate}
              isLoading={isGenerating}
            />
          </div>

          {/* Template List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-gray-300 font-semibold uppercase">Templates</span>
            </div>
            <div className="space-y-1">
              {templates.map((template) => (
                <button
                  key={template.key}
                  onClick={() => handleGenerate({
                    code: template.code,
                    description: template.description,
                    example: template.example,
                    dependencies: ['react'],
                  })}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded font-mono text-xs transition-colors group flex items-center gap-2"
                >
                  <Code2 className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold">{template.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Preview/Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="bg-gray-800 border-b border-gray-700 flex items-center">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-2.5 font-mono text-xs font-semibold flex items-center gap-2 border-r border-gray-700 transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>PREVIEW</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-6 py-2.5 font-mono text-xs font-semibold flex items-center gap-2 border-r border-gray-700 transition-colors ${
                activeTab === 'code'
                  ? 'bg-gray-900 text-emerald-400'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>CODE</span>
            </button>
            {generatedComponent && (
              <div className="ml-auto px-4 flex items-center gap-2">
                <Play className="w-3 h-3 text-green-400" />
                <span className="text-[10px] font-mono text-green-400 font-semibold">COMPILED</span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className={`flex-1 overflow-auto ${activeTab === 'preview' ? 'bg-white' : 'bg-gray-900'}`}>
            {!generatedComponent ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 font-mono">No Component Selected</h2>
                  <p className="text-gray-500 text-sm font-mono">
                    Generate a component or select a template from the explorer
                  </p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'preview' && (
                  <div className="p-6">
                    <div className="mb-4 px-4 py-2 bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-mono text-emerald-900 font-semibold">LIVE PREVIEW</span>
                    </div>
                    <LivePreview 
                      code={generatedComponent.code}
                      example={generatedComponent.example}
                    />
                  </div>
                )}
                {activeTab === 'code' && (
                  <div className="h-full">
                    <CodeExport 
                      code={generatedComponent.code}
                      description={generatedComponent.description}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom Status Bar */}
          {generatedComponent && (
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-gray-400">
                <span>{generatedComponent.description}</span>
              </div>
              {generatedComponent.dependencies && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Dependencies:</span>
                  {generatedComponent.dependencies.map((dep, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-emerald-900/50 text-emerald-400 rounded text-[10px] font-bold">
                      {dep}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
