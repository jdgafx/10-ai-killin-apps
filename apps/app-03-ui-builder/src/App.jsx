import { useState } from "react";
import { Code2, Eye, Layers, Terminal, Play, FileCode } from "lucide-react";
import ComponentGenerator from "./components/ComponentGenerator";
import LivePreview from "./components/LivePreview";
import CodeExport from "./components/CodeExport";
import { getAllTemplates } from "./lib/component-templates";

function App() {
  const [generatedComponent, setGeneratedComponent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  const handleGenerate = async (component) => {
    setIsGenerating(true);
    setGeneratedComponent(component);
    setActiveTab("preview");
    setIsGenerating(false);
  };

  const templates = getAllTemplates();

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar - VS Code Style */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 flex items-center justify-between border-b border-emerald-500/30 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/50 transition-all duration-300 hover:scale-110">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-mono text-lg font-bold bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">
              UI Builder Studio
            </span>
            <span className="text-xs text-slate-400 font-mono ml-3">
              v1.0.0 PRO
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono backdrop-blur-lg bg-white/10 px-4 py-2 rounded-full border border-emerald-500/30">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span className="text-emerald-400 uppercase tracking-wider font-semibold">
              ● READY
            </span>
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Component List & Generator */}
        <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col overflow-hidden shadow-2xl">
          {/* Panel Header */}
          <div className="bg-gray-900 px-5 py-4 border-b border-emerald-500/30 backdrop-blur-lg">
            <div className="flex items-center gap-3 text-white">
              <Layers className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="font-mono text-base font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                Explorer
              </span>
            </div>
          </div>

          {/* Generator Section */}
          <div className="p-5 border-b border-gray-700 backdrop-blur-lg bg-white/5">
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                Generate Component
              </span>
            </div>
            <ComponentGenerator
              onGenerate={handleGenerate}
              isLoading={isGenerating}
            />
          </div>

          {/* Template List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                Templates
              </span>
            </div>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.key}
                  onClick={() =>
                    handleGenerate({
                      code: template.code,
                      description: template.description,
                      example: template.example,
                      dependencies: ["react"],
                    })
                  }
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-purple-500/20 rounded-lg font-mono text-xs transition-all duration-300 hover:scale-105 group flex items-center gap-3 border border-gray-700 hover:border-emerald-500/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <Code2 className="w-4 h-4 text-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {template.name}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate group-hover:text-purple-400 transition-colors">
                      {template.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Preview/Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="bg-gray-800 border-b border-gray-700 flex items-center backdrop-blur-lg">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-8 py-3 font-mono text-sm font-bold flex items-center gap-2 border-r border-gray-700 transition-all duration-300 ${
                activeTab === "preview"
                  ? "bg-gradient-to-b from-white to-gray-100 text-gray-900 shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Eye className="w-5 h-5" />
              <span className="uppercase tracking-wider">PREVIEW</span>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-8 py-3 font-mono text-sm font-bold flex items-center gap-2 border-r border-gray-700 transition-all duration-300 ${
                activeTab === "code"
                  ? "bg-gray-900 text-emerald-400 shadow-lg shadow-emerald-500/20 border-emerald-500/50"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Code2 className="w-5 h-5" />
              <span className="uppercase tracking-wider">CODE</span>
            </button>
            {generatedComponent && (
              <div className="ml-auto px-6 flex items-center gap-2 backdrop-blur-lg bg-emerald-500/20 mr-4 py-2 rounded-full border border-emerald-500/30">
                <Play className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  ● COMPILED
                </span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div
            className={`flex-1 overflow-auto ${activeTab === "preview" ? "bg-white" : "bg-gray-900"}`}
          >
            {!generatedComponent ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 font-mono">
                    No Component Selected
                  </h2>
                  <p className="text-gray-500 text-sm font-mono">
                    Generate a component or select a template from the explorer
                  </p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "preview" && (
                  <div className="p-6">
                    <div className="mb-4 px-4 py-2 bg-emerald-50 border-l-4 border-emerald-500 flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-mono text-emerald-900 font-semibold">
                        LIVE PREVIEW
                      </span>
                    </div>
                    <LivePreview
                      code={generatedComponent.code}
                      example={generatedComponent.example}
                    />
                  </div>
                )}
                {activeTab === "code" && (
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
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-emerald-900/50 text-emerald-400 rounded text-[10px] font-bold"
                    >
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
  );
}

export default App;
