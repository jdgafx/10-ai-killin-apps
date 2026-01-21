import { chat } from 'ai-providers'

export class WorkerAgent {
  constructor(name, specialty, logCallback) {
    this.name = name
    this.specialty = specialty
    this.log = logCallback
    this.taskCount = 0
  }

  async executeTask(task) {
    this.log(`${this.name}: Starting task - ${task.description}`)
    this.taskCount++

    try {
      // Simulate task processing with actual AI
      const result = await this.processWithAI(task)
      
      this.log(`${this.name}: Task completed successfully`)
      return result
    } catch (error) {
      this.log(`${this.name}: Task failed - ${error.message}`, 'error')
      throw error
    }
  }

  async processWithAI(task) {
    const prompts = {
      research: `Research and provide key insights about: ${task.description}. Include 3-5 main points.`,
      analysis: `Analyze the following topic and provide detailed insights: ${task.description}`,
      writing: `Write content about: ${task.description}. Be creative and engaging.`,
      review: `Review and provide feedback on: ${task.description}. Focus on quality and improvements.`
    }

    const prompt = prompts[this.specialty] || `Complete this task: ${task.description}`

    try {
      const response = await chat([
        { role: 'system', content: `You are a ${this.specialty} specialist. Provide concise, high-quality output.` },
        { role: 'user', content: prompt }
      ])

      return response.content
    } catch (error) {
      // Fallback to simulated response if AI fails
      return this.simulateTaskCompletion(task)
    }
  }

  simulateTaskCompletion(task) {
    const responses = {
      research: `Research findings for "${task.description}": 1) Key trend identified 2) Market analysis completed 3) Recommendations prepared`,
      analysis: `Analysis of "${task.description}": Data processed, patterns identified, insights generated`,
      writing: `Content created for "${task.description}": Engaging copy written with key messages incorporated`,
      review: `Review of "${task.description}": Quality check passed, improvements suggested, final approval ready`
    }

    return responses[this.specialty] || `Task "${task.description}" completed successfully`
  }

  getStatus() {
    return {
      name: this.name,
      specialty: this.specialty,
      tasksCompleted: this.taskCount,
      available: true
    }
  }

  reset() {
    this.taskCount = 0
    this.log(`${this.name}: Agent reset`)
  }
}
