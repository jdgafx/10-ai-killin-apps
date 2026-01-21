import { useState, useEffect } from 'react'
import { Network, PlayCircle, PauseCircle, RotateCcw, Activity, Cpu, CheckCircle, Clock, Zap, Users, TrendingUp } from 'lucide-react'

const AGENTS = [
  { id: 1, name: 'Researcher', type: 'research', color: 'purple', icon: '🔍' },
  { id: 2, name: 'Analyzer', type: 'analysis', color: 'blue', icon: '📊' },
  { id: 3, name: 'Writer', type: 'writing', color: 'green', icon: '✍️' },
  { id: 4, name: 'Reviewer', type: 'review', color: 'orange', icon: '✅' },
]

const SAMPLE_TASKS = [
  { description: 'Research latest AI trends', type: 'research' },
  { description: 'Analyze market data', type: 'analysis' },
  { description: 'Write blog post summary', type: 'writing' },
  { description: 'Review content quality', type: 'review' },
]

export default function App() {
  const [tasks, setTasks] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }].slice(-20))
  }

  const addTask = (description, type) => {
    const task = {
      id: Date.now() + Math.random(),
      description,
      type,
      status: 'pending',
      assignedTo: null,
      progress: 0,
    }
    setTasks(prev => [...prev, task])
    addLog(`New task added: ${description}`, 'success')
  }

  const handleStartOrchestration = async () => {
    const pendingTasks = tasks.filter(t => t.status === 'pending')
    if (pendingTasks.length === 0) {
      addLog('No pending tasks to process', 'warning')
      return
    }

    setIsRunning(true)
    addLog('🚀 Starting orchestration...', 'success')

    for (const task of pendingTasks) {
      await processTask(task)
    }

    setIsRunning(false)
    addLog('✨ Orchestration complete!', 'success')
  }

  const processTask = async (task) => {
    const agent = AGENTS.find(a => a.type === task.type) || AGENTS[0]
    
    updateTaskStatus(task.id, 'assigning')
    addLog(`📋 Assigning task to ${agent.name}...`)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    updateTaskStatus(task.id, 'in-progress', agent.name)
    addLog(`🔄 ${agent.name} is processing: ${task.description}`, 'info')
    
    for (let i = 0; i <= 100; i += 25) {
      updateTaskProgress(task.id, i)
      await new Promise(resolve => setTimeout(resolve, 400))
    }
    
    updateTaskStatus(task.id, 'completed', agent.name)
    addLog(`✅ Task completed by ${agent.name}!`, 'success')
  }

  const updateTaskStatus = (taskId, status, assignedTo = null) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status, assignedTo: assignedTo || t.assignedTo } : t
    ))
  }

  const updateTaskProgress = (taskId, progress) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, progress } : t
    ))
  }

  const handleReset = () => {
    setTasks([])
    setLogs([])
    setIsRunning(false)
    addLog('System reset', 'info')
  }

  const handleQuickTask = () => {
    SAMPLE_TASKS.forEach(task => addTask(task.description, task.type))
  }

  const getAgentColor = (name) => {
    const agent = AGENTS.find(a => a.name === name)
    return agent?.color || 'gray'
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Network className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Agent Orchestrator</h1>
          </div>
          <p className="text-white/90 text-lg">Coordinate AI agents for complex distributed tasks</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Control Center</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleQuickTask}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold shadow-lg"
              >
                Add Sample Tasks
              </button>
              <button
                onClick={handleStartOrchestration}
                disabled={isRunning || stats.pending === 0}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2 font-semibold shadow-lg"
              >
                {isRunning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Start
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-gray-600 font-medium">Active Agents</div>
              </div>
              <div className="text-3xl font-bold text-blue-600">{AGENTS.length}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div className="text-sm text-gray-600 font-medium">Pending</div>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <div className="text-sm text-gray-600 font-medium">In Progress</div>
              </div>
              <div className="text-3xl font-bold text-purple-600">{stats.inProgress}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="text-sm text-gray-600 font-medium">Completed</div>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Active Agents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENTS.map((agent) => {
                const agentTasks = tasks.filter(t => t.assignedTo === agent.name)
                const completedTasks = agentTasks.filter(t => t.status === 'completed').length
                return (
                  <div key={agent.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl p-3 bg-gradient-to-br from-${agent.color}-50 to-${agent.color}-100 rounded-xl`}>
                          {agent.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{agent.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{agent.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 bg-gradient-to-r from-${agent.color}-500 to-${agent.color}-600 text-white text-xs font-semibold rounded-full`}>
                        Active
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tasks Completed</span>
                        <span className="font-bold text-gray-800">{completedTasks}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r from-${agent.color}-500 to-${agent.color}-600 h-2 rounded-full transition-all`}
                          style={{ width: `${Math.min(100, completedTasks * 25)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Task Queue */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              Task Queue
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No tasks yet</p>
                  <p className="text-sm">Add tasks to get started</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className={`p-4 rounded-xl border-2 transition-all ${
                    task.status === 'completed' ? 'bg-green-50 border-green-200' :
                    task.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800 flex-1">{task.description}</p>
                      {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                      {task.status === 'in-progress' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
                    </div>
                    {task.assignedTo && (
                      <p className="text-xs text-gray-600 mb-2">
                        Assigned to: <span className="font-semibold">{task.assignedTo}</span>
                      </p>
                    )}
                    {task.status === 'in-progress' && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`bg-gradient-to-r from-${getAgentColor(task.assignedTo)}-500 to-${getAgentColor(task.assignedTo)}-600 h-1.5 rounded-full transition-all`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-800">Activity Log</h3>
          </div>
          <div className="h-48 overflow-y-auto bg-gray-900 rounded-xl p-4 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activity yet</p>
            ) : (
              logs.slice().reverse().map((log, idx) => (
                <div key={idx} className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-gray-300'
                }`}>
                  <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
