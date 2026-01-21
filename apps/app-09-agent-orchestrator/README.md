# Multi-Agent Orchestrator

Coordinate multiple AI agents to handle complex distributed tasks with intelligent task allocation and real-time monitoring.

## Features

- **Agent Coordination**: Centralized coordinator manages multiple worker agents
- **Task Distribution**: Intelligent task assignment based on agent specialties
- **Real-time Monitoring**: Live visualization of agent network and task status
- **Activity Logging**: Comprehensive logging of all orchestration activities
- **Multiple Strategies**: Round-robin, least-busy, specialized, and priority-based distribution
- **Network Visualization**: Visual representation of agent communication
- **Performance Analytics**: Track completion rates and agent performance

## Tech Stack

- React 18 with Hooks
- Zustand for state management
- Vite for development
- Tailwind CSS for styling
- Lucide React for icons
- Multi-model AI support (MiniMax, Gemini, DeepSeek)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env
```

### Development

```bash
# Start development server (port 3009)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```
VITE_MINIMAX_API_KEY=your_minimax_api_key
VITE_MINIMAX_GROUP_ID=your_minimax_group_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Agent Types

### Coordinator Agent
- Central orchestration point
- Task assignment and distribution
- Progress monitoring
- Load balancing

### Worker Agents
- **Researcher**: Handles research and information gathering tasks
- **Analyzer**: Performs data analysis and insight generation
- **Writer**: Creates content and written materials
- **Reviewer**: Reviews and provides feedback on work

## Usage

1. **Initialize System**: Agents are automatically initialized on startup
2. **Add Tasks**: Click "Add Sample Tasks" or create custom tasks
3. **Start Orchestration**: Click "Start Orchestration" to begin processing
4. **Monitor Progress**: Watch real-time updates in the network visualization
5. **Review Logs**: Check the activity log for detailed execution history

## Task Distribution Strategies

### Specialized Distribution (Default)
Assigns tasks to agents based on their specialty, with fallback to least-busy agent.

### Round Robin
Distributes tasks evenly across all agents in rotation.

### Least Busy
Assigns tasks to the agent with the lowest current workload.

### Priority-Based
Processes high-priority tasks first with optimal agent assignment.

## Architecture

```
┌─────────────┐
│ Coordinator │
│   Agent     │
└──────┬──────┘
       │
   ┌───┼───┬───┐
   │   │   │   │
┌──▼┐ ┌▼─┐ ┌▼─┐ ┌▼──┐
│Res││Ana││Wri││Rev│
│ear││lyz││ter││iew│
│cher││er │└───┘└───┘
└───┘└───┘
```

## Project Structure

```
src/
├── App.jsx                    # Main application
├── main.jsx                   # Entry point
├── index.css                  # Global styles
├── components/
│   ├── AgentCard.jsx         # Individual agent display
│   ├── TaskQueue.jsx         # Task management UI
│   └── AgentNetwork.jsx      # Network visualization
├── agents/
│   ├── CoordinatorAgent.js   # Coordinator implementation
│   └── WorkerAgent.js        # Worker agent base class
└── lib/
    ├── orchestration.js      # Orchestration logic
    └── task-distribution.js  # Task allocation algorithms
```

## API Integration

Uses the shared `ai-providers` package:

```javascript
import { chat } from 'ai-providers'

const response = await chat([
  { role: 'system', content: 'You are a specialist agent' },
  { role: 'user', content: prompt }
])
```

## Key Concepts

### Agent Lifecycle
1. Registration
2. Task Assignment
3. Task Execution
4. Result Reporting
5. Status Update

### Task States
- **Pending**: Waiting for assignment
- **Assigning**: Being assigned to an agent
- **In Progress**: Currently being executed
- **Completed**: Successfully finished
- **Failed**: Execution failed

### Orchestration Flow
1. Coordinator receives tasks
2. Analyzes agent availability and specialties
3. Distributes tasks using selected strategy
4. Monitors execution progress
5. Collects results
6. Reports completion status

## Performance Optimization

- Parallel task execution
- Intelligent load balancing
- Agent specialty matching
- Automatic redistribution
- Performance analytics

## Error Handling

- Graceful agent failure recovery
- Task retry mechanisms
- Comprehensive error logging
- Fallback strategies

## Deployment

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

### Coolify
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables configured in dashboard

## Advanced Features

### Custom Agents
Extend `WorkerAgent` class to create custom agent types:

```javascript
class CustomAgent extends WorkerAgent {
  constructor(name, logCallback) {
    super(name, 'custom', logCallback)
  }

  async processWithAI(task) {
    // Custom implementation
  }
}
```

### Custom Distribution Strategy
Add new strategies to `TaskDistributor`:

```javascript
customStrategy(tasks, agents) {
  // Your distribution logic
  return assignments
}
```

## License

MIT

## Author

Part of the 10 AI Killin' Apps Portfolio
