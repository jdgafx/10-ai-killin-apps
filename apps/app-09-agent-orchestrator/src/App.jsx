import { useState, useEffect } from 'react'
import { Network, PlayCircle, PauseCircle, RotateCcw, Activity } from 'lucide-react'
import AgentCard from './components/AgentCard'
import TaskQueue from './components/TaskQueue'
import AgentNetwork from './components/AgentNetwork'
import { CoordinatorAgent } from './agents/CoordinatorAgent'
import { WorkerAgent } from './agents/WorkerAgent'

export default function App() {
  const [coordinator, setCoordinator] = useState(null)
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    initializeOrchestrator()
  }, [])

  const initializeOrchestrator = () => {
    const coord = new CoordinatorAgent('Coordinator', addLog)
    setCoordinator(coord)

    const workerAgents = [
      new WorkerAgent('Researcher', 'research', addLog),
      new WorkerAgent('Analyzer', 'analysis', addLog),
      new WorkerAgent('Writer', 'writing', addLog),
      new WorkerAgent('Reviewer', 'review', addLog),
    ]

    setAgents(workerAgents)
    addLog('System initialized with 1 coordinator and 4 worker agents')
  }

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }])
  }

  const addTask = (description, type) => {
    const task = {
      id: Date.now(),
      description,
      type,
      status: 'pending',
      assignedTo: null,
      result: null,
    }
    setTasks(prev => [...prev, task])
    addLog(`New task added: ${description}`, 'success')
  }

  const handleStartOrchestration = async () => {
    if (tasks.filter(t => t.status === 'pending').length === 0) {
      addLog('No pending tasks to process', 'warning')
      return
    }

    setIsRunning(true)
    addLog('Starting orchestration...', 'success')

    for (const task of tasks) {
      if (task.status === 'pending') {
        await processTask(task)
      }
    }

    setIsRunning(false)
    addLog('Orchestration complete', 'success')
  }

  const processTask = async (task) => {
    try {
      updateTaskStatus(task.id, 'assigning')
      addLog(`Coordinator assigning task: ${task.description}`)
      
      const assignedAgent = coordinator.assignTask(task, agents)
      updateTaskStatus(task.id, 'in-progress', assignedAgent.name)
      addLog(`Task assigned to ${assignedAgent.name}`, 'info')

      const result = await assignedAgent.executeTask(task)
      
      updateTaskStatus(task.id, 'completed', assignedAgent.name, result)
      addLog(`Task completed by ${assignedAgent.name}`, 'success')
    } catch (error) {
      updateTaskStatus(task.id, 'failed', null, error.message)
      addLog(`Task failed: ${error.message}`, 'error')
    }
  }

  const updateTaskStatus = (taskId, status, assignedTo = null, result = null) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status, assignedTo: assignedTo || t.assignedTo, result: result || t.result }
        : t
    ))
  }

  const handleReset = () => {
    setTasks([])
    setLogs([])
    setIsRunning(false)
    addLog('System reset', 'info')
  }

  const handleQuickTask = () => {
    const quickTasks = [
      { description: 'Research latest AI trends', type: 'research' },
      { description: 'Analyze market data', type: 'analysis' },
      { description: 'Write blog post summary', type: 'writing' },
      { description: 'Review content quality', type: 'review' },
    ]
    
    quickTasks.forEach(task => addTask(task.description, task.type))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Network className="w-8 h-8 text-blue-300" />
            <h1 className="text-4xl font-bold text-white">Multi-Agent Orchestrator</h1>
          </div>
          <p className="text-blue-100">Coordinate AI agents for complex distributed tasks</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Control Panel</h2>
            <div className="flex gap-2">
              <button
                onClick={handleQuickTask}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add Sample Tasks
              </button>
              <button
                onClick={handleStartOrchestration}
                disabled={isRunning || tasks.filter(t => t.status === 'pending').length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <PauseCircle className="w-5 h-5" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Start Orchestration
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{agents.length + 1}</div>
              <div className="text-sm text-gray-600">Total Agents</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Tasks</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {tasks.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Active Agents</h3>
            {coordinator && (
              <AgentCard
                agent={{ name: coordinator.name, type: 'coordinator', status: 'active' }}
                isCoordinator={true}
              />
            )}
            {agents.map((agent, idx) => (
              <AgentCard
                key={idx}
                agent={{ 
                  name: agent.name, 
                  type: agent.specialty, 
                  status: 'active',
                  tasksCompleted: tasks.filter(t => t.assignedTo === agent.name && t.status === 'completed').length
                }}
              />
            ))}
          </div>

          {/* Task Queue */}
          <div>
            <TaskQueue tasks={tasks} />
          </div>
        </div>

        {/* Agent Network Visualization */}
        <div className="mt-6">
          <AgentNetwork 
            coordinator={coordinator} 
            agents={agents} 
            tasks={tasks}
          />
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg shadow-xl p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5" />
            <h3 className="text-xl font-bold">Activity Log</h3>
          </div>
          <div className="h-48 overflow-y-auto bg-gray-900 rounded-lg p-4 font-mono text-sm">
            {logs.slice().reverse().map((log, idx) => (
              <div key={idx} className={`mb-1 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                log.type === 'warning' ? 'text-yellow-400' :
                'text-gray-300'
              }`}>
                <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
