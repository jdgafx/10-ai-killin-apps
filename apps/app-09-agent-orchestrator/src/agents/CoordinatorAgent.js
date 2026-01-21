export class CoordinatorAgent {
  constructor(name, logCallback) {
    this.name = name
    this.log = logCallback
  }

  assignTask(task, availableAgents) {
    // Find agent with matching specialty
    const specializedAgent = availableAgents.find(
      agent => agent.specialty === task.type
    )

    if (specializedAgent) {
      this.log(`Coordinator: Assigned ${task.type} task to ${specializedAgent.name}`)
      return specializedAgent
    }

    // Fallback to least busy agent
    const leastBusyAgent = availableAgents.reduce((prev, curr) => 
      (prev.taskCount || 0) < (curr.taskCount || 0) ? prev : curr
    )

    this.log(`Coordinator: No specialist found, assigned to ${leastBusyAgent.name}`)
    return leastBusyAgent
  }

  coordinateAgents(agents, tasks) {
    this.log('Coordinator: Starting task distribution...')
    
    const assignments = tasks.map(task => ({
      task,
      agent: this.assignTask(task, agents)
    }))

    this.log(`Coordinator: Distributed ${assignments.length} tasks`)
    return assignments
  }

  monitorProgress(tasks) {
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const pending = tasks.filter(t => t.status === 'pending').length

    return {
      completed,
      inProgress,
      pending,
      total: tasks.length,
      completionRate: (completed / tasks.length) * 100
    }
  }

  optimizeDistribution(agents, tasks) {
    // Analyze agent performance and redistribute if needed
    const agentStats = agents.map(agent => ({
      agent,
      load: tasks.filter(t => t.assignedTo === agent.name).length,
      completed: tasks.filter(t => t.assignedTo === agent.name && t.status === 'completed').length
    }))

    // Find overloaded and underutilized agents
    const avgLoad = agentStats.reduce((sum, stat) => sum + stat.load, 0) / agentStats.length
    const overloaded = agentStats.filter(stat => stat.load > avgLoad * 1.5)
    const underutilized = agentStats.filter(stat => stat.load < avgLoad * 0.5)

    if (overloaded.length > 0 && underutilized.length > 0) {
      this.log('Coordinator: Rebalancing task distribution...')
      return true
    }

    return false
  }
}
