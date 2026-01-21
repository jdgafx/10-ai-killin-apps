import { useState } from 'react'
import { Search, Loader, BarChart, Brain, BookOpen, TrendingUp, FileText, Sparkles } from 'lucide-react'
import { ResearchAgent } from './agents/ResearchAgent'
import ResearchReport from './components/ResearchReport'
import { dataAnalysis } from './tools/DataAnalysis'

function App() {
  const [topic, setTopic] = useState('')
  const [isResearching, setIsResearching] = useState(false)
  const [progress, setProgress] = useState(null)
  const [result, setResult] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [parallelMode, setParallelMode] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const handleResearch = async () => {
    if (!topic.trim() || isResearching) return

    setIsResearching(true)
    setProgress({ stage: 'starting', message: 'Initializing research...' })
    setResult(null)
    setAnalysis(null)

    try {
      const agent = new ResearchAgent({
        maxSubqueries: 5,
        onProgress: (prog) => setProgress(prog),
      })

      const researchResult = await agent.research(topic, {
        depth: 2,
        parallel: parallelMode,
      })

      setResult(researchResult)
      
      const analysisResult = dataAnalysis.analyzeFindings(researchResult.findings)
      setAnalysis(analysisResult)
      
    } catch (error) {
      setProgress({ stage: 'error', message: error.message })
    } finally {
      setIsResearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
      <div className="min-h-screen backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 border border-white/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Research Agent
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Multi-agent research with parallel processing & synthesis
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                  placeholder="Enter your research topic... (e.g., Quantum Computing, AI Ethics, Climate Solutions)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all text-lg"
                  disabled={isResearching}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={parallelMode}
                    onChange={(e) => setParallelMode(e.target.checked)}
                    disabled={isResearching}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Parallel Processing (Faster)
                  </span>
                </label>

                <button
                  onClick={handleResearch}
                  disabled={isResearching || !topic.trim()}
                  className="sm:ml-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none"
                >
                  {isResearching ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Start Research
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            {progress && (
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  {isResearching && <Loader className="w-5 h-5 animate-spin text-blue-600" />}
                  <span className="text-base font-bold text-blue-800">
                    {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-blue-700 font-medium">{progress.message}</p>
                {progress.subquestions && (
                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-300">
                    {progress.subquestions.map((q, idx) => (
                      <div key={idx} className="text-sm text-blue-600 flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          {(result || analysis) && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl mb-6 border border-white/20 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="hidden sm:inline">Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'analysis'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart className="w-5 h-5" />
                  <span className="hidden sm:inline">Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab('report')}
                  className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'report'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="hidden sm:inline">Full Report</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'overview' && (
              <>
                <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-600" />
                    Research Summary
                  </h2>
                  <ResearchReport report={result?.report} isLoading={isResearching} />
                </div>

                {analysis && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-2xl p-6 text-white">
                      <h3 className="font-bold text-xl mb-5 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        Quick Stats
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-sm opacity-90 mb-1">Total Findings</div>
                          <div className="text-4xl font-bold">{analysis.total}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-sm opacity-90 mb-1">Avg Confidence</div>
                          <div className="text-4xl font-bold">
                            {(analysis.avgConfidence * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-sm opacity-90 mb-1">High Confidence</div>
                          <div className="text-4xl font-bold">{analysis.highConfidence}</div>
                        </div>
                      </div>
                    </div>

                    {result?.subquestions && (
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Research Topics</h3>
                        <ul className="space-y-3">
                          {result.subquestions.map((q, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-sm text-gray-700 font-medium">{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'analysis' && analysis && (
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-gray-800 mb-2">{analysis.total}</div>
                  <div className="text-gray-600 font-semibold">Total Findings</div>
                </div>
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-gray-800 mb-2">
                    {(analysis.avgConfidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-gray-600 font-semibold">Average Confidence</div>
                </div>
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-gray-800 mb-2">{analysis.highConfidence}</div>
                  <div className="text-gray-600 font-semibold">High Confidence Items</div>
                </div>
              </div>
            )}

            {activeTab === 'report' && (
              <div className="lg:col-span-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                  Complete Research Report
                </h2>
                <ResearchReport report={result?.report} isLoading={isResearching} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
