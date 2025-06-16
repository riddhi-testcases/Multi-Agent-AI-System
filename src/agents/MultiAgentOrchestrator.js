import { PlannerAgent } from './PlannerAgent';
import { SpaceXAgent } from './SpaceXAgent';
import { WeatherAgent } from './WeatherAgent';
import { NewsAgent } from './NewsAgent';
import { AnalysisAgent } from './AnalysisAgent';

export class MultiAgentOrchestrator {
  constructor() {
    this.agents = {
      planner: new PlannerAgent(),
      spacex: new SpaceXAgent(),
      weather: new WeatherAgent(),
      news: new NewsAgent(),
      analysis: new AnalysisAgent()
    };

    this.onStatusUpdate = null;
    this.onLogUpdate = null;
    this.executionContext = {};
  }

  updateStatus(agentId, status, data = null) {
    if (this.onStatusUpdate) {
      this.onStatusUpdate(agentId, status, data);
    }
  }

  log(agent, message) {
    if (this.onLogUpdate) {
      this.onLogUpdate({ agent, message });
    }
  }

  async executeGoal(goal) {
    this.log('Orchestrator', `Starting execution of goal: ${goal}`);
    this.executionContext = { goal, results: {} };

    try {
      // Step 1: Plan the execution
      this.updateStatus('Planner', 'processing');
      this.log('Planner', 'Analyzing goal and creating execution plan...');
      
      const plan = await this.agents.planner.createPlan(goal);
      this.updateStatus('Planner', 'completed', plan);
      this.log('Planner', `Plan created with ${plan.steps.length} steps`);

      // Step 2: Execute the plan
      for (const step of plan.steps) {
        await this.executeStep(step);
      }

      // Step 3: Final analysis
      this.updateStatus('Analysis', 'processing');
      this.log('Analysis', 'Performing final analysis of all collected data...');
      
      const finalAnalysis = await this.agents.analysis.synthesizeResults(
        goal,
        this.executionContext.results
      );
      
      this.updateStatus('Analysis', 'completed', finalAnalysis);
      this.log('Analysis', 'Final analysis completed');

      return {
        ...this.executionContext.results,
        finalAnalysis
      };

    } catch (error) {
      this.log('Orchestrator', `Execution failed: ${error.message}`);
      throw error;
    }
  }

  async executeStep(step) {
    const { agent, action, dependencies = [] } = step;
    
    this.log(agent, `Starting step: ${action}`);
    this.updateStatus(agent, 'processing');

    try {
      // Gather dependency data
      const dependencyData = {};
      for (const dep of dependencies) {
        if (this.executionContext.results[dep]) {
          dependencyData[dep] = this.executionContext.results[dep];
        }
      }

      // Execute the agent action
      let result;
      switch (agent) {
        case 'SpaceX':
          result = await this.agents.spacex.execute(action, dependencyData);
          this.executionContext.results.launchData = result;
          break;
        case 'Weather':
          result = await this.agents.weather.execute(action, dependencyData);
          this.executionContext.results.weatherData = result;
          break;
        case 'News':
          result = await this.agents.news.execute(action, dependencyData);
          this.executionContext.results.newsAnalysis = result;
          break;
        default:
          throw new Error(`Unknown agent: ${agent}`);
      }

      this.updateStatus(agent, 'completed', result);
      this.log(agent, `Step completed successfully`);

    } catch (error) {
      this.updateStatus(agent, 'error', error.message);
      this.log(agent, `Step failed: ${error.message}`);
      throw error;
    }
  }
}