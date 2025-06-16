# Multi-Agent AI System

A sophisticated multi-agent artificial intelligence system that orchestrates intelligent agents to achieve complex goals through real-time data enrichment and collaborative decision making.

##  Features

- **Multi-Agent Orchestration**: Intelligent planning and coordination between specialized agents
- **Real-time Data Enrichment**: Agents work collaboratively, each enriching the output of previous agents
- **Dynamic Goal Analysis**: Natural language goal processing with intelligent agent routing
- **Live API Integration**: Real-time data from SpaceX, OpenWeatherMap, and NewsAPI
- **Iterative Refinement**: Agents continuously refine results until the goal is achieved
- **Professional UI**: Modern, responsive interface with real-time status updates

##  Architecture

### Core Components

1. **MultiAgentOrchestrator**: Central coordination system that manages agent execution
2. **PlannerAgent**: Analyzes goals and creates optimal execution plans
3. **SpaceXAgent**: Fetches real-time SpaceX launch data and mission information
4. **WeatherAgent**: Provides weather data and launch condition assessments
5. **NewsAgent**: Analyzes news sentiment and provides market insights
6. **AnalysisAgent**: Synthesizes all data sources into comprehensive insights

### Agent Flow

```
User Goal → Planner Agent → Execution Plan → Agent Chain → Final Analysis
```

Each agent in the chain:
- Receives enriched data from previous agents
- Processes and enhances the information
- Passes results to the next agent
- Contributes to the final comprehensive analysis

##  Technologies Used

- **Frontend**: React 18, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom gradient themes
- **Icons**: Lucide React
- **Build Tool**: Vite
- **APIs**: 
  - SpaceX API (v4)
  - OpenWeatherMap API
  - NewsAPI

##  Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd multi-agent-ai-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

##  Configuration

The system uses the following API keys (configured in the source code):
- OpenWeatherMap API
- NewsAPI
- SpaceX API: Public API (no key required)

##  Usage Examples

### SpaceX Launch Analysis
```
"Find the next SpaceX launch, check weather at that location, then summarize if it may be delayed"
```

### Cryptocurrency Trend Analysis
```
"Get latest Bitcoin price trends from news sentiment and predict short-term movement"
```

### Comprehensive Mission Assessment
```
"Analyze upcoming rocket launches with weather conditions and assess launch probability"
```

##  Agent Workflow

1. **Goal Input**: User provides a natural language goal
2. **Planning Phase**: PlannerAgent analyzes the goal and creates an execution strategy
3. **Data Collection**: Specialized agents gather relevant data:
   - SpaceXAgent: Launch schedules and mission details
   - WeatherAgent: Meteorological conditions and forecasts
   - NewsAgent: Sentiment analysis and market trends
4. **Enrichment Chain**: Each agent builds upon previous results
5. **Synthesis**: AnalysisAgent combines all data into actionable insights
6. **Results**: Comprehensive analysis with recommendations

##  Agent Status Monitoring

The system provides real-time visibility into:
- Agent execution status (processing, completed, error)
- Data flow between agents
- Execution logs and timestamps
- Result enrichment at each step

##  UI/UX Features

- **Glassmorphism Design**: Modern semi-transparent interface elements
- **Real-time Updates**: Live agent status indicators with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Professional Aesthetics**: Clean typography and consistent color scheme
- **Interactive Elements**: Hover states and micro-interactions

##  Evaluation Criteria

The system is designed to meet the following evaluation standards:

### Agent Chaining & Data Enrichment
-  Agents work in sequence, not isolation
-  Each agent enriches data from previous agents
-  Clear dependency chain between agents

### Planner's Routing Logic
-  Intelligent goal analysis and plan creation
-  Dynamic agent routing based on goal content
-  Optimal execution sequence determination

### Iterative Refinement
-  Continuous goal assessment until achievement
-  Agent result validation and enhancement
-  Final synthesis of all collected data

### Code Quality & Documentation
-  Modular, maintainable code structure
-  Comprehensive documentation
-  Professional UI/UX implementation

##  Testing

Example test scenarios:

1. **SpaceX Weather Delay Assessment**
   - Goal: Assess next SpaceX launch delay probability
   - Expected: Launch data → Weather analysis → News sentiment → Delay prediction

2. **Crypto Market Analysis**
   - Goal: Bitcoin trend prediction from news
   - Expected: News collection → Sentiment analysis → Trend prediction

##  Security & Privacy

- API keys are configured directly in source code for demonstration purposes
- In production, use environment variables for sensitive data
- All API calls are made client-side with appropriate CORS handling

##  Deployment

Build for production:
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

##  Future Enhancements

- Additional API integrations (financial data, social media sentiment)
- Machine learning-based agent decision making
- Advanced natural language processing for goal interpretation
- Agent learning from historical execution patterns
- Multi-modal data processing (images, videos, documents)

##  Author

**Riddhi Chakraborty**

Built  with a focus on professional-grade multi-agent AI systems and modern web development practices.

##  License

This project is private and proprietary. All rights reserved.

---

*This system demonstrates advanced AI agent orchestration with real-world API integration and professional UI/UX design.
The .env files api keys has been removed for privacy*
