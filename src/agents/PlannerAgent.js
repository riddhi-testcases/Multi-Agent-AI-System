export class PlannerAgent {
  constructor() {
    this.name = 'Planner';
  }

  async createPlan(goal) {
    // Analyze the goal and create an execution plan
    const goalLower = goal.toLowerCase();
    const steps = [];
    
    // Determine what data we need based on the goal
    if (goalLower.includes('spacex') || goalLower.includes('launch') || goalLower.includes('rocket')) {
      steps.push({
        agent: 'SpaceX',
        action: 'getNextLaunch',
        dependencies: []
      });
    }
//weather
    if (goalLower.includes('weather') || goalLower.includes('condition')) {
      steps.push({
        agent: 'Weather',
        action: 'getWeatherData',
        dependencies: goalLower.includes('launch') ? ['launchData'] : []
      });
    }

    if (goalLower.includes('news') || goalLower.includes('sentiment') || goalLower.includes('delay')) {
      steps.push({
        agent: 'News',
        action: 'analyzeNews',
        dependencies: ['launchData']
      });
    }

    // If no specific agents identified, create a default plan
    if (steps.length === 0) {
      if (goalLower.includes('bitcoin') || goalLower.includes('crypto')) {
        steps.push({
          agent: 'News',
          action: 'getCryptoNews',
          dependencies: []
        });
      } else {
        // Default to SpaceX launch analysis
        steps.push(
          {
            agent: 'SpaceX',
            action: 'getNextLaunch',
            dependencies: []
          },
          {
            agent: 'Weather',
            action: 'getWeatherData',
            dependencies: ['launchData']
          },
          {
            agent: 'News',
            action: 'analyzeNews',
            dependencies: ['launchData']
          }
        );
      }
    }

    return {
      goal,
      steps,
      estimatedTime: steps.length * 3 // seconds
    };
  }
}
