export class AnalysisAgent {
  constructor() {
    this.name = 'Analysis';
  }
//goal
  async synthesizeResults(goal, results) {
    const { launchData, weatherData, newsAnalysis } = results;
    
    let analysis = '';
    
    // Analyze based on goal type
    if (goal.toLowerCase().includes('delay')) {
      analysis = this.assessDelayRisk(launchData, weatherData, newsAnalysis);
    } else if (goal.toLowerCase().includes('bitcoin') || goal.toLowerCase().includes('crypto')) {
      analysis = this.analyzeCryptoTrend(newsAnalysis);
    } else {
      analysis = this.generateComprehensiveAnalysis(goal, launchData, weatherData, newsAnalysis);
    }

    return analysis;
  }

  assessDelayRisk(launchData, weatherData, newsAnalysis) {
    let riskFactors = [];
    let riskLevel = 'LOW';
    let riskScore = 0;

    // Weather risk assessment
    if (weatherData) {
      const weatherRisk = weatherData.launchConditions;
      
      if (weatherRisk.riskLevel === 'HIGH') {
        riskFactors.push(`High weather risk: ${weatherRisk.conditions.join(', ')}`);
        riskScore += 4;
        riskLevel = 'HIGH';
      } else if (weatherRisk.riskLevel === 'MEDIUM') {
        riskFactors.push(`Moderate weather concerns: ${weatherRisk.conditions.join(', ')}`);
        riskScore += 2;
        riskLevel = riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM';
      }

      // Specific weather checks
      if (weatherData.windSpeed > 20) {
        riskFactors.push(`Very high wind speeds: ${weatherData.windSpeed} m/s`);
        riskScore += 3;
      } else if (weatherData.windSpeed > 15) {
        riskFactors.push(`High wind speeds: ${weatherData.windSpeed} m/s`);
        riskScore += 2;
      }
      
      if (weatherData.main.includes('Rain') || weatherData.main.includes('Storm')) {
        riskFactors.push(`Adverse weather: ${weatherData.description}`);
        riskScore += 3;
      }

      if (weatherData.temperature < 0 || weatherData.temperature > 35) {
        riskFactors.push(`Extreme temperature: ${weatherData.temperature}°C`);
        riskScore += 2;
      }
    }

    // News sentiment analysis
    if (newsAnalysis) {
      if (newsAnalysis.sentiment === 'NEGATIVE') {
        riskFactors.push('Negative news sentiment suggesting potential issues');
        riskScore += 2;
      }
      
      // Check for delay-related keywords in headlines
      const delayKeywords = newsAnalysis.headlines?.some(headline => 
        headline.toLowerCase().includes('delay') || 
        headline.toLowerCase().includes('postpone') ||
        headline.toLowerCase().includes('scrub') ||
        headline.toLowerCase().includes('abort')
      );
      
      if (delayKeywords) {
        riskFactors.push('Recent news mentions potential delays or issues');
        riskScore += 3;
      }
    }

    // Mission-specific factors
    if (launchData) {
      if (launchData.missionStatus === 'IMMINENT') {
        riskFactors.push('Launch is imminent - higher sensitivity to conditions');
        riskScore += 1;
      }
      
      // Check if it's a critical mission (crew, expensive payload, etc.)
      if (launchData.payloadDetails?.some(payload => 
        payload.type?.toLowerCase().includes('crew') || 
        payload.customers?.some(customer => customer.toLowerCase().includes('nasa'))
      )) {
        riskFactors.push('Critical mission - higher safety standards apply');
        riskScore += 1;
      }
    }

    // Determine final risk level
    if (riskScore >= 6) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 3) {
      riskLevel = 'MEDIUM';
    }

    if (riskFactors.length === 0) {
      riskFactors.push('No significant risk factors identified');
    }

    const launchDate = launchData ? new Date(launchData.date_utc).toLocaleDateString() : 'Unknown';
    const timeUntil = launchData?.timeUntilLaunch || 'Unknown';
    
    return `**Launch Delay Risk Assessment**

**Mission:** ${launchData?.name || 'Upcoming Launch'}
**Scheduled:** ${launchDate} ${timeUntil ? `(T-${timeUntil})` : ''}
**Overall Risk Level:** ${this.getRiskEmoji(riskLevel)} **${riskLevel}** (Score: ${riskScore}/10)

**Risk Factors Analysis:**
${riskFactors.map(factor => `• ${factor}`).join('\n')}

**Weather Impact:**
${weatherData ? `
• Current: ${weatherData.temperature}°C, ${weatherData.description}
• Wind: ${weatherData.windSpeed} m/s ${weatherData.windGust ? `(gusts to ${weatherData.windGust} m/s)` : ''}
• Conditions: ${weatherData.launchConditions.recommendation}
` : 'Weather data unavailable'}

**News Sentiment:**
${newsAnalysis ? `
• Overall sentiment: ${newsAnalysis.sentiment}
• Articles analyzed: ${newsAnalysis.articlesCount}
• Latest coverage: ${newsAnalysis.publishedAt ? this.getTimeAgo(newsAnalysis.publishedAt) : 'Unknown'}
` : 'News analysis unavailable'}

**Final Recommendation:**
${this.getDelayRecommendation(riskLevel, riskScore, weatherData, newsAnalysis)}

---
*Analysis generated at ${new Date().toLocaleString()} using real-time data*`;
  }

  analyzeCryptoTrend(newsAnalysis) {
    if (!newsAnalysis) {
      return '**Cryptocurrency Analysis**\n\nUnable to analyze cryptocurrency trends due to insufficient news data.';
    }

    const sentiment = newsAnalysis.sentiment;
    let prediction = '';
    let confidence = 'Low';

    // Determine confidence based on article count and sentiment strength
    if (newsAnalysis.articlesCount > 15) {
      confidence = 'High';
    } else if (newsAnalysis.articlesCount > 8) {
      confidence = 'Medium';
    }

    switch (sentiment) {
      case 'POSITIVE':
        prediction = 'Short-term bullish trend expected based on positive news sentiment';
        break;
      case 'NEGATIVE':
        prediction = 'Short-term bearish trend possible due to negative news coverage';
        break;
      default:
        prediction = 'Mixed signals - trend unclear, monitor for developments';
    }

    const latestNews = newsAnalysis.publishedAt ? this.getTimeAgo(newsAnalysis.publishedAt) : 'Unknown';

    return `**Cryptocurrency Market Analysis**

**News Sentiment:** ${this.getSentimentEmoji(sentiment)} ${sentiment}
**Confidence Level:** ${confidence}
**Articles Analyzed:** ${newsAnalysis.articlesCount}
**Latest Coverage:** ${latestNews}

**Short-term Prediction:** ${prediction}

**Key Headlines:**
${newsAnalysis.headlines?.slice(0, 3).map(headline => `• ${headline}`).join('\n') || 'No headlines available'}

**Market Insights:**
${newsAnalysis.summary}

**Technical Indicators from News:**
• Positive mentions: ${newsAnalysis.positiveScore || 0}
• Negative mentions: ${newsAnalysis.negativeScore || 0}
• Sentiment strength: ${confidence}

**Disclaimer:** This analysis is based on news sentiment only and should not be considered financial advice. Always conduct your own research before making investment decisions.

---
*Analysis generated at ${new Date().toLocaleString()} using real-time news data*`;
  }

  generateComprehensiveAnalysis(goal, launchData, weatherData, newsAnalysis) {
    let analysis = `**Comprehensive Analysis**\n\n**Goal:** "${goal}"\n\n`;

    if (launchData) {
      analysis += `**Mission Details:**\n`;
      analysis += `• **Mission:** ${launchData.name}\n`;
      analysis += `• **Launch Date:** ${new Date(launchData.date_utc).toLocaleString()}\n`;
      analysis += `• **Location:** ${launchData.location}\n`;
      analysis += `• **Status:** ${launchData.missionStatus}\n`;
      
      if (launchData.timeUntilLaunch) {
        analysis += `• **Time Until Launch:** ${launchData.timeUntilLaunch}\n`;
      }
      
      if (launchData.rocketDetails) {
        analysis += `• **Rocket:** ${launchData.rocketDetails.name}\n`;
        analysis += `• **Success Rate:** ${launchData.rocketDetails.success_rate_pct}%\n`;
      }
      
      if (launchData.payloadDetails && launchData.payloadDetails.length > 0) {
        analysis += `• **Primary Payload:** ${launchData.payloadDetails[0].name}\n`;
      }
      
      analysis += '\n';
    }

    if (weatherData) {
      analysis += `**Weather Analysis:**\n`;
      analysis += `• **Current Conditions:** ${weatherData.temperature}°C, ${weatherData.description}\n`;
      analysis += `• **Feels Like:** ${weatherData.feelsLike}°C\n`;
      analysis += `• **Wind:** ${weatherData.windSpeed} m/s`;
      
      if (weatherData.windGust) {
        analysis += ` (gusts to ${weatherData.windGust} m/s)`;
      }
      analysis += '\n';
      
      analysis += `• **Humidity:** ${weatherData.humidity}%\n`;
      analysis += `• **Cloud Cover:** ${weatherData.cloudiness}%\n`;
      
      if (weatherData.visibility) {
        analysis += `• **Visibility:** ${weatherData.visibility} km\n`;
      }
      
      // Weather impact assessment
      const weatherRisk = weatherData.launchConditions;
      analysis += `\n**Weather Impact:** ${this.getRiskEmoji(weatherRisk.riskLevel)} ${weatherRisk.riskLevel} Risk\n`;
      analysis += `• ${weatherRisk.recommendation}\n`;
      analysis += `• Risk Score: ${weatherRisk.riskScore}/10\n\n`;
    }

    if (newsAnalysis) {
      analysis += `**News Analysis:**\n`;
      analysis += `• **Sentiment:** ${this.getSentimentEmoji(newsAnalysis.sentiment)} ${newsAnalysis.sentiment}\n`;
      analysis += `• **Articles Analyzed:** ${newsAnalysis.articlesCount}\n`;
      
      if (newsAnalysis.publishedAt) {
        analysis += `• **Latest Coverage:** ${this.getTimeAgo(newsAnalysis.publishedAt)}\n`;
      }
      
      analysis += `• **Summary:** ${newsAnalysis.summary}\n`;
      
      if (newsAnalysis.headlines && newsAnalysis.headlines.length > 0) {
        analysis += `\n**Recent Headlines:**\n`;
        newsAnalysis.headlines.slice(0, 3).forEach(headline => {
          analysis += `• ${headline}\n`;
        });
      }
      
      analysis += '\n';
    }

    // Final assessment
    analysis += `**Executive Summary:**\n`;
    if (launchData && weatherData && newsAnalysis) {
      const overallRisk = this.calculateOverallRisk(weatherData, newsAnalysis);
      analysis += `Based on current conditions and available data, the overall assessment is **${overallRisk}**.\n\n`;
      
      if (goal.toLowerCase().includes('delay')) {
        analysis += this.getDelayProbability(weatherData, newsAnalysis);
      } else {
        analysis += 'All monitored systems and conditions have been analyzed. ';
        
        if (overallRisk === 'HIGH RISK') {
          analysis += 'Significant concerns identified that require attention.';
        } else if (overallRisk === 'MODERATE RISK') {
          analysis += 'Some concerns noted but manageable with proper monitoring.';
        } else {
          analysis += 'Conditions appear favorable for planned operations.';
        }
      }
    } else {
      analysis += 'Analysis completed with available data sources. Some data may be limited.';
    }

    analysis += `\n\n---\n*Analysis completed at ${new Date().toLocaleString()} using real-time data*`;

    return analysis;
  }

  getRiskEmoji(riskLevel) {
    switch (riskLevel) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  }

  getSentimentEmoji(sentiment) {
    switch (sentiment) {
      case 'POSITIVE': return '📈';
      case 'NEGATIVE': return '📉';
      case 'NEUTRAL': return '➡️';
      default: return '❓';
    }
  }

  getDelayRecommendation(riskLevel, riskScore, weatherData, newsAnalysis) {
    if (riskLevel === 'HIGH') {
      return `**High probability of delays or mission adjustments.** With a risk score of ${riskScore}/10, multiple factors suggest potential issues. Mission planners should have contingency plans ready and consider postponement if conditions don't improve.`;
    } else if (riskLevel === 'MEDIUM') {
      return `**Moderate delay risk requires close monitoring.** Current risk score of ${riskScore}/10 indicates some concerns. Continue monitoring conditions and be prepared for potential schedule adjustments.`;
    } else {
      return `**Low delay probability - conditions appear favorable.** Risk score of ${riskScore}/10 suggests minimal concerns. Mission appears likely to proceed as scheduled barring unexpected developments.`;
    }
  }

  calculateOverallRisk(weatherData, newsAnalysis) {
    let riskScore = 0;

    // Weather risk factors
    if (weatherData?.launchConditions) {
      riskScore += weatherData.launchConditions.riskScore;
    }

    // News sentiment risk
    if (newsAnalysis) {
      if (newsAnalysis.sentiment === 'NEGATIVE') riskScore += 2;
      if (newsAnalysis.sentiment === 'POSITIVE') riskScore -= 0.5;
    }

    if (riskScore >= 5) return 'HIGH RISK';
    if (riskScore >= 2.5) return 'MODERATE RISK';
    return 'LOW RISK';
  }

  getDelayProbability(weatherData, newsAnalysis) {
    const weatherRisk = weatherData?.launchConditions?.riskLevel || 'UNKNOWN';
    const newsRisk = newsAnalysis?.sentiment === 'NEGATIVE';
    
    if (weatherRisk === 'HIGH') {
      return 'High probability of weather-related delays due to unfavorable conditions.';
    } else if (newsRisk && weatherRisk === 'MEDIUM') {
      return 'Moderate probability of delays due to combined weather and operational factors.';
    } else if (newsRisk) {
      return 'Low to moderate probability of delays based on news indicators and operational concerns.';
    } else {
      return 'Low probability of delays - conditions appear favorable for scheduled operations.';
    }
  }

  getTimeAgo(publishedAt) {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'less than an hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }
}
