export class TaskDistributor {
  constructor() {
    this.strategies = {
      roundRobin: this.roundRobinDistribution.bind(this),
      leastBusy: this.leastBusyDistribution.bind(this),
      specialized: this.specializedDistribution.bind(this),
      priority: this.priorityDistribution.bind(this)
    }
  }

  distribute(tasks, agents, strategy = 'specialized') {
    const distributionFn = this.strategies[strategy] || this.strategies.specialized
    return distributionFn(tasks, agents)
  }

  roundRobinDistribution(tasks, agents) {
    const assignments = []
    let agentIndex = 0

    tasks.forEach(task => {
      assignments.push({
        task,
        agent: agents[agentIndex]
      })
      agentIndex = (agentIndex + 1) % agents.length
    })

    return assignments
  }

  leastBusyDistribution(tasks, agents) {
    const agentLoads = new Map(agents.map(agent => [agent, 0]))
    const assignments = []

    tasks.forEach(task => {
      // Find agent with minimum load
      let minLoad = Infinity
      let selectedAgent = agents[0]

      agentLoads.forEach((load, agent) => {
        if (load < minLoad) {
          minLoad = load
          selectedAgent = agent
        }
      })

      assignments.push({
        task,
        agent: selectedAgent
      })

      agentLoads.set(selectedAgent, minLoad + 1)
    })

    return assignments
  }

  specializedDistribution(tasks, agents) {
    const assignments = []

    tasks.forEach(task => {
      // Try to find agent with matching specialty
      const specializedAgent = agents.find(
        agent => agent.specialty === task.type
      )

      if (specializedAgent) {
        assignments.push({
          task,
          agent: specializedAgent
        })
      } else {
        // Fallback to least busy if no specialist
        const leastBusy = this.findLeastBusyAgent(agents, assignments)
        assignments.push({
          task,
          agent: leastBusy
        })
      }
    })

    return assignments
  }

  priorityDistribution(tasks, agents) {
    // Sort tasks by priority (assuming tasks have a priority field)
    const sortedTasks = [...tasks].sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    )

    // Assign high-priority tasks first to best available agents
    return this.specializedDistribution(sortedTasks, agents)
  }

  findLeastBusyAgent(agents, currentAssignments) {
    const loads = agents.map(agent => ({
      agent,
      load: currentAssignments.filter(a => a.agent === agent).length
    }))

    return loads.reduce((prev, curr) => 
      curr.load < prev.load ? curr : prev
    ).agent
  }

  analyzeDistribution(assignments) {
    const stats = new Map()

    assignments.forEach(({ agent }) => {
      const current = stats.get(agent) || 0
      stats.set(agent, current + 1)
    })

    const loads = Array.from(stats.values())
    const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length
    const maxLoad = Math.max(...loads)
    const minLoad = Math.min(...loads)

    return {
      avgLoad,
      maxLoad,
      minLoad,
      balance: 1 - (maxLoad - minLoad) / maxLoad, // 1 = perfect balance
      agentLoads: Array.from(stats.entries()).map(([agent, load]) => ({
        agent: agent.name,
        load
      }))
    }
  }

  optimizeDistribution(assignments, threshold = 0.7) {
    const analysis = this.analyzeDistribution(assignments)
    
    if (analysis.balance < threshold) {
      // Redistribution needed
      const tasks = assignments.map(a => a.task)
      const agents = [...new Set(assignments.map(a => a.agent))]
      
      // Use least busy strategy for better balance
      return this.leastBusyDistribution(tasks, agents)
    }

    return assignments
  }
}

export function createTaskPriority(description, type, priority = 5) {
  return {
    description,
    type,
    priority,
    createdAt: Date.now()
  }
}

export function calculateTaskComplexity(task) {
  // Simple heuristic based on description length and type
  const baseComplexity = {
    research: 3,
    analysis: 4,
    writing: 2,
    review: 2
  }

  const typeComplexity = baseComplexity[task.type] || 3
  const lengthFactor = Math.min(task.description.length / 100, 2)

  return typeComplexity * (1 + lengthFactor)
}
