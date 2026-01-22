import { useState } from 'react'
import { Search, Loader, BarChart, Brain, BookOpen, TrendingUp, FileText, Target, Activity, Database } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Stats Bar */}
      <div className="bg-gradient-to-r from-amber-500 to-red-500 text-white px-6 py-3 shadow-lg shadow-amber-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="uppercase tracking-wider">STATUS: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <Database className="w-5 h-5" />
              <span className="uppercase tracking-wider">AGENTS: {parallelMode ? '⚡ PARALLEL' : '→ SEQUENTIAL'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 backdrop-blur-lg bg-white/20 px-4 py-1.5 rounded-full">
            <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse shadow-lg shadow-green-300/50" />
            <span className="uppercase tracking-wider">SYSTEM READY</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Dashboard */}
        <div className="bg-white rounded-lg shadow-lg border border-stone-200 p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center shadow-2xl shadow-amber-500/50 transition-all duration-300 hover:scale-105">
                <Brain className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">Research Analytics Dashboard</h1>
                <p className="text-stone-600 text-lg">Multi-Agent Intelligence Platform</p>
              </div>
            </div>
            <Target className="w-12 h-12 text-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-12" />
          </div>

          {/* Search Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-amber-500 transition-all duration-300 hover:scale-110" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isResearching && handleResearch()}
                placeholder="Enter research topic... (Press Enter)"
                className="w-full pl-14 pr-6 py-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 hover:shadow-md text-lg"
                disabled={isResearching}
              />
            </div>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-amber-200 hover:to-orange-200 transition-all duration-300 hover:scale-105">
                <input
                  type="checkbox"
                  checked={parallelMode}
                  onChange={(e) => setParallelMode(e.target.checked)}
                  disabled={isResearching}
                  className="w-5 h-5 text-amber-600 rounded"
                />
                <span className="text-sm font-bold text-stone-800 uppercase tracking-wider">⚡ PARALLEL</span>
              </label>
              <button
                onClick={handleResearch}
                disabled={isResearching || !topic.trim()}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:scale-105"
              >
                {isResearching ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  'ANALYZE'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Panel */}
        {progress && (
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-amber-500 p-6 mb-6 backdrop-blur-lg bg-white/90 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-3">
              {isResearching && <Loader className="w-6 h-6 animate-spin text-amber-500" />}
              <span className="text-base font-bold bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent uppercase tracking-wider">
                {progress.stage}
              </span>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed">{progress.message}</p>
            {progress.subquestions && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                {progress.subquestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-orange-50 p-2 rounded">
                    <span className="text-orange-500 font-bold">{idx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        {(result || analysis) && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>OVERVIEW</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 px-6 py-3 font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <BarChart className="w-5 h-5" />
              <span>ANALYTICS</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 px-6 py-3 font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${
                activeTab === 'report'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>REPORT</span>
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Report */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <FileText className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">RESEARCH SUMMARY</h2>
              </div>
              <ResearchReport report={result?.report} isLoading={isResearching} />
            </div>

            {/* Stat Cards */}
            <div className="space-y-4">
              {analysis && (
                <>
                  <div className="bg-gradient-to-br from-amber-500 to-red-500 rounded-xl shadow-lg shadow-amber-500/50 p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <TrendingUp className="w-7 h-7" />
                      <span className="text-xs font-bold backdrop-blur-lg bg-white/30 px-3 py-1.5 rounded-full animate-pulse">● LIVE</span>
                    </div>
                    <div className="text-4xl font-bold mb-2">{analysis.total}</div>
                    <div className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Findings</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border-2 border-amber-300 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-amber-400">
                    <div className="flex items-center justify-between mb-3">
                      <BarChart className="w-7 h-7 text-amber-500" />
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                      {(analysis.avgConfidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Avg Confidence</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg border-2 border-red-300 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-red-400">
                    <div className="flex items-center justify-between mb-3">
                      <Target className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">{analysis.highConfidence}</div>
                    <div className="text-sm font-semibold text-stone-600 uppercase tracking-wide">High Confidence</div>
                  </div>
                </>
              )}
              {result?.subquestions && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-bold text-sm mb-3 text-gray-900 uppercase tracking-wide">Research Topics</h3>
                  <ul className="space-y-2">
                    {result.subquestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs p-2 bg-orange-50 rounded border border-orange-100">
                        <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && analysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">{analysis.total}</div>
              <div className="text-gray-600 font-semibold uppercase text-sm tracking-wide">Total Findings</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-amber-500" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {(analysis.avgConfidence * 100).toFixed(0)}%
              </div>
              <div className="text-gray-600 font-semibold uppercase text-sm tracking-wide">Average Confidence</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">{analysis.highConfidence}</div>
              <div className="text-gray-600 font-semibold uppercase text-sm tracking-wide">High Confidence Items</div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-500" />
              COMPLETE RESEARCH REPORT
            </h2>
            <ResearchReport report={result?.report} isLoading={isResearching} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
