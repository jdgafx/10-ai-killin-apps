export class Orchestrator {
  constructor() {
    this.agents = []
    this.tasks = []
    this.logs = []
  }

  registerAgent(agent) {
    this.agents.push(agent)
    this.addLog(`Agent registered: ${agent.name} (${agent.specialty || 'coordinator'})`)
  }

  addTask(task) {
    this.tasks.push({
      ...task,
      id: Date.now() + Math.random(),
      status: 'pending',
      assignedTo: null,
      startTime: null,
      endTime: null,
      result: null
    })
    this.addLog(`Task added: ${task.description}`)
  }

  async executeTask(taskId, agent) {
    const task = this.tasks.find(t => t.id === taskId)
    if (!task) throw new Error('Task not found')

    task.status = 'in-progress'
    task.assignedTo = agent.name
    task.startTime = Date.now()
    this.addLog(`Task started: ${task.description} by ${agent.name}`)

    try {
      const result = await agent.executeTask(task)
      task.status = 'completed'
      task.result = result
      task.endTime = Date.now()
      this.addLog(`Task completed: ${task.description}`)
      return result
    } catch (error) {
      task.status = 'failed'
      task.result = error.message
      task.endTime = Date.now()
      this.addLog(`Task failed: ${task.description} - ${error.message}`, 'error')
      throw error
    }
  }

  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status)
  }

  getAgentsBySpecialty(specialty) {
    return this.agents.filter(a => a.specialty === specialty)
  }

  getSystemStats() {
    return {
      totalAgents: this.agents.length,
      totalTasks: this.tasks.length,
      pendingTasks: this.getTasksByStatus('pending').length,
      inProgressTasks: this.getTasksByStatus('in-progress').length,
      completedTasks: this.getTasksByStatus('completed').length,
      failedTasks: this.getTasksByStatus('failed').length,
      averageTaskTime: this.calculateAverageTaskTime()
    }
  }

  calculateAverageTaskTime() {
    const completedTasks = this.getTasksByStatus('completed')
    if (completedTasks.length === 0) return 0

    const totalTime = completedTasks.reduce((sum, task) => {
      return sum + (task.endTime - task.startTime)
    }, 0)

    return totalTime / completedTasks.length
  }

  addLog(message, type = 'info') {
    this.logs.push({
      timestamp: new Date().toISOString(),
      message,
      type
    })
  }

  reset() {
    this.tasks = []
    this.logs = []
    this.addLog('System reset')
  }
}
