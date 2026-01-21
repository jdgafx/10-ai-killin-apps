import { useState } from 'react'
import { Search, Loader, BarChart, Brain } from 'lucide-react'
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
      
      // Analyze results
      const analysisResult = dataAnalysis.analyzeFindings(researchResult.findings)
      setAnalysis(analysisResult)
      
    } catch (error) {
      setProgress({ stage: 'error', message: error.message })
    } finally {
      setIsResearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            Autonomous Research Agent
          </h1>
          <p className="text-gray-600">
            Multi-step research with parallel processing and report synthesis
          </p>
        </div>

        {/* Research Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Research Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                placeholder="e.g., Quantum Computing, Climate Change, AI Ethics..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isResearching}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parallelMode}
                  onChange={(e) => setParallelMode(e.target.checked)}
                  disabled={isResearching}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm text-gray-700">
                  Parallel Processing (faster)
                </span>
              </label>

              <button
                onClick={handleResearch}
                disabled={isResearching || !topic.trim()}
                className="ml-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
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

          {/* Progress */}
          {progress && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {isResearching && <Loader className="w-4 h-4 animate-spin text-blue-600" />}
                <span className="text-sm font-semibold text-blue-800">
                  {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
                </span>
              </div>
              <p className="text-sm text-blue-700">{progress.message}</p>
              {progress.subquestions && (
                <div className="mt-2 space-y-1">
                  {progress.subquestions.map((q, idx) => (
                    <div key={idx} className="text-xs text-blue-600">• {q}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Report */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Research Report</h2>
            <ResearchReport report={result?.report} isLoading={isResearching} />
          </div>

          {/* Analysis Sidebar */}
          <div className="space-y-6">
            {/* Findings Analysis */}
            {analysis && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-purple-600" />
                  Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Total Findings</div>
                    <div className="text-2xl font-bold text-gray-800">{analysis.total}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Avg Confidence</div>
                    <div className="text-2xl font-bold text-green-600">
                      {(analysis.avgConfidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">High Confidence</div>
                    <div className="text-2xl font-bold text-blue-600">{analysis.highConfidence}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-questions */}
            {result?.subquestions && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-3">Research Topics</h3>
                <ul className="space-y-2">
                  {result.subquestions.map((q, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-purple-600 font-semibold">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
