import { Network } from 'lucide-react'

export default function AgentNetwork({ coordinator, agents, tasks }) {
  const getAgentActivity = (agentName) => {
    return tasks.filter(t => t.assignedTo === agentName && t.status === 'in-progress').length
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Network className="w-5 h-5" />
        <h3 className="text-xl font-bold">Agent Network Visualization</h3>
      </div>
      
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
        {/* Coordinator in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
            <div className="text-center">
              <div className="text-xs">Coordinator</div>
            </div>
          </div>
        </div>

        {/* Worker agents in circle around coordinator */}
        {agents && agents.map((agent, idx) => {
          const angle = (idx / agents.length) * 2 * Math.PI
          const radius = 100
          const x = 50 + radius * Math.cos(angle)
          const y = 50 + radius * Math.sin(angle)
          const isActive = getAgentActivity(agent.name) > 0

          return (
            <div key={idx}>
              {/* Connection line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke={isActive ? "#3b82f6" : "#e5e7eb"}
                  strokeWidth={isActive ? "3" : "2"}
                  strokeDasharray={isActive ? "5,5" : "0"}
                  className={isActive ? "animate-pulse" : ""}
                />
              </svg>

              {/* Agent node */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%` 
                }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${
                  isActive ? 'bg-blue-600 animate-pulse' : 'bg-blue-400'
                }`}>
                  <div className="text-center">
                    <div className="text-xs">{agent.name}</div>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
        Active • 
        <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mx-1"></span>
        Idle
      </div>
    </div>
  )
}
