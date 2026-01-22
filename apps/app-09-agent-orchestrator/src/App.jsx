import { useState } from 'react'
import { PlayCircle, RotateCcw, Activity, Zap, Radio } from 'lucide-react'

const AGENTS = [
  { id: 1, name: 'Alpha', type: 'research', x: 200, y: 150, status: 'idle' },
  { id: 2, name: 'Beta', type: 'analysis', x: 500, y: 150, status: 'idle' },
  { id: 3, name: 'Gamma', type: 'writing', x: 350, y: 350, status: 'idle' },
  { id: 4, name: 'Delta', type: 'review', x: 650, y: 300, status: 'idle' },
]

const SAMPLE_TASKS = [
  { id: 1, description: 'Research AI trends', agent: 'Alpha' },
  { id: 2, description: 'Analyze market data', agent: 'Beta' },
  { id: 3, description: 'Write summary', agent: 'Gamma' },
  { id: 4, description: 'Review output', agent: 'Delta' },
]

export default function App() {
  const [agents, setAgents] = useState(AGENTS)
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [activeConnections, setActiveConnections] = useState([])

  const addLog = (message) => {
    setLogs(prev => [...prev, {
      message,
      timestamp: new Date().toLocaleTimeString()
    }].slice(-15))
  }

  const handleStart = async () => {
    setIsRunning(true)
    addLog('>> System initialized')
    
    for (let i = 0; i < SAMPLE_TASKS.length; i++) {
      const task = SAMPLE_TASKS[i]
      const agentIndex = agents.findIndex(a => a.name === task.agent)
      
      // Update agent status
      setAgents(prev => prev.map((a, idx) => 
        idx === agentIndex ? { ...a, status: 'active' } : a
      ))
      
      addLog(`>> ${task.agent}: ${task.description}`)
      
      // Show connection to next agent if not last
      if (i < SAMPLE_TASKS.length - 1) {
        setActiveConnections(prev => [...prev, { from: agentIndex, to: agentIndex + 1 }])
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAgents(prev => prev.map((a, idx) =>
        idx === agentIndex ? { ...a, status: 'complete' } : a
      ))
    }
    
    setIsRunning(false)
    addLog('>> All tasks completed')
  }

  const handleReset = () => {
    setAgents(AGENTS)
    setLogs([])
    setActiveConnections([])
    setIsRunning(false)
    addLog('>> System reset')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in duration-700">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3 tracking-wider">
            AGENT ORCHESTRATOR
          </h1>
          <p className="text-cyan-300/70 text-base uppercase tracking-widest backdrop-blur-lg bg-cyan-500/20 inline-block px-4 py-2 rounded-full border border-cyan-400/30">Network Coordination System</p>
        </div>

        {/* Control Bar */}
        <div className="backdrop-blur-lg bg-blue-900/50 border-2 border-cyan-400/30 rounded-xl p-6 mb-8 shadow-2xl shadow-cyan-500/20 transition-all duration-300 hover:border-cyan-400/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 backdrop-blur-lg bg-cyan-500/20 px-5 py-3 rounded-xl border border-cyan-400/30">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-cyan-300 text-base font-mono font-bold uppercase tracking-wider">
                  {isRunning ? '● SYSTEM ACTIVE' : '○ SYSTEM IDLE'}
                </span>
              </div>
              <div className="text-teal-300 text-base font-mono backdrop-blur-lg bg-teal-500/20 px-5 py-3 rounded-xl border border-teal-400/30">
                <span className="font-bold">Agents:</span> {agents.length}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-blue-950 font-bold rounded-xl hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-xl shadow-cyan-500/50 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                START SYSTEM
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="px-6 py-3 backdrop-blur-lg bg-blue-800 border-2 border-cyan-400/50 text-cyan-400 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-blue-900/30 border border-cyan-400/30 rounded backdrop-blur-sm p-8 h-[500px] relative">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {activeConnections.map((conn, idx) => {
                  const fromAgent = agents[conn.from]
                  const toAgent = agents[conn.to]
                  return (
                    <line
                      key={idx}
                      x1={fromAgent.x}
                      y1={fromAgent.y}
                      x2={toAgent.x}
                      y2={toAgent.y}
                      stroke="rgb(34, 211, 238)"
                      strokeWidth="2"
                      className="animate-pulse"
                      strokeDasharray="5,5"
                    />
                  )
                })}
              </svg>

              {/* Agent nodes */}
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="absolute"
                  style={{ left: agent.x - 40, top: agent.y - 40 }}
                >
                  <div
                    className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                      agent.status === 'active'
                        ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50 animate-pulse'
                        : agent.status === 'complete'
                        ? 'border-teal-300 bg-teal-300/20'
                        : 'border-cyan-400/50 bg-blue-900/50'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-teal-300/70 uppercase">
                      {agent.type}
                    </div>
                  </div>
                  {agent.status === 'active' && (
                    <div className="absolute -top-2 -right-2">
                      <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-1">
            <div className="bg-blue-900/30 border border-cyan-400/30 rounded backdrop-blur-sm p-4 h-[500px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-cyan-300 font-bold uppercase tracking-wide">Activity Log</h3>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <div className="text-cyan-400/50 text-center py-8">
                    Awaiting commands...
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="text-teal-300">
                      <span className="text-cyan-400/70">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-blue-900/30 border border-cyan-400/30 rounded backdrop-blur-sm p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-300 font-bold uppercase text-sm">{agent.name}</div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    agent.status === 'active'
                      ? 'bg-cyan-400 animate-pulse'
                      : agent.status === 'complete'
                      ? 'bg-teal-300'
                      : 'bg-cyan-400/30'
                  }`}
                />
              </div>
              <div className="text-teal-300/70 text-xs uppercase">{agent.type}</div>
              <div className="text-cyan-400/50 text-xs uppercase mt-1">{agent.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

