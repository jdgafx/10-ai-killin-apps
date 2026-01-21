import { ListTodo, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'

export default function TaskQueue({ tasks }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'in-progress':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-200 bg-yellow-50'
      case 'in-progress':
        return 'border-blue-200 bg-blue-50'
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <ListTodo className="w-5 h-5" />
        <h3 className="text-xl font-bold">Task Queue</h3>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ListTodo className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No tasks in queue</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`border-2 rounded-lg p-3 ${getStatusColor(task.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className="font-semibold capitalize text-sm">{task.status}</span>
                </div>
                <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                  {task.type}
                </span>
              </div>
              <p className="text-sm mb-2">{task.description}</p>
              {task.assignedTo && (
                <div className="text-xs text-gray-600">
                  Assigned to: <span className="font-semibold">{task.assignedTo}</span>
                </div>
              )}
              {task.result && (
                <div className="mt-2 text-xs text-gray-700 bg-white p-2 rounded">
                  Result: {task.result.slice(0, 100)}...
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
