export class WorkerAgent {
  constructor(name, specialty, logCallback) {
    this.name = name;
    this.specialty = specialty;
    this.log = logCallback;
    this.taskCount = 0;
  }

  async executeTask(task) {
    this.log(`${this.name}: Starting task - ${task.description}`);
    this.taskCount++;

    try {
      const result = await this.processWithAI(task);

      this.log(`${this.name}: Task completed successfully`);
      return result;
    } catch (error) {
      this.log(`${this.name}: Task failed - ${error.message}`, "error");
      throw error;
    }
  }

  async processWithAI(task) {
    const response = await fetch("/api/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: task.description,
        mode: "sequential",
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const relevantResult =
        data.results.find(
          (r) => r.agent.toLowerCase() === this.specialty.toLowerCase(),
        ) || data.results[data.results.length - 1];

      return relevantResult.output || data.summary;
    }

    return data.summary || "Task completed";
  }

  getStatus() {
    return {
      name: this.name,
      specialty: this.specialty,
      tasksCompleted: this.taskCount,
      available: true,
    };
  }

  reset() {
    this.taskCount = 0;
    this.log(`${this.name}: Agent reset`);
  }
}
