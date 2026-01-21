import { Bot, Crown, CheckCircle, Activity } from 'lucide-react'

export default function AgentCard({ agent, isCoordinator = false }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      isCoordinator ? 'border-yellow-500' : 'border-blue-500'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCoordinator ? (
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{agent.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isCoordinator && agent.tasksCompleted !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{agent.tasksCompleted}</div>
              <div className="text-xs text-gray-500">Tasks Done</div>
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
            agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {agent.status === 'active' && <Activity className="w-4 h-4 animate-pulse" />}
            {agent.status}
          </div>
        </div>
      </div>
    </div>
  )
}
