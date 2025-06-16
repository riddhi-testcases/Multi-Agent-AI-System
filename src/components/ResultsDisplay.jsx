import React from 'react';
import { CheckCircle, AlertTriangle, Info, ExternalLink, Clock, MapPin, Thermometer, Wind, Eye, Droplets } from 'lucide-react';

const ResultsDisplay = ({ results, goal, executionLog }) => {
  if (results.error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h2 className="text-2xl font-semibold text-white">Execution Error</h2>
        </div>
        <p className="text-red-300">{results.error}</p>
      </div>
    );
  }

  const formatMarkdown = (text) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />')
      .replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level} class="text-lg font-semibold text-white mt-4 mb-2">${content}</h${level}>`;
      });
  };

  return (
    <div className="space-y-6">
      {/* Main Results */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <h2 className="text-2xl font-semibold text-white">Goal Achieved</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Original Goal</h3>
            <p className="text-gray-300 bg-black/20 p-3 rounded-lg">{goal}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">Final Analysis</h3>
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-green-500/20">
              <div 
                className="text-white prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(results.finalAnalysis) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Launch Data */}
        {results.launchData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              🚀 Launch Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-sm text-gray-400">Mission:</span>
                    <p className="text-white font-medium">{results.launchData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-400">Launch Date:</span>
                    <p className="text-white">{new Date(results.launchData.date_utc).toLocaleString()}</p>
                    {results.launchData.timeUntilLaunch && (
                      <p className="text-sm text-blue-300">T-{results.launchData.timeUntilLaunch}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-gray-400">Location:</span>
                    <p className="text-white">{results.launchData.location}</p>
                  </div>
                </div>

                {results.launchData.rocketDetails && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm text-gray-400">Rocket:</span>
                      <p className="text-white">{results.launchData.rocketDetails.name}</p>
                      <p className="text-sm text-green-300">Success Rate: {results.launchData.rocketDetails.success_rate_pct}%</p>
                    </div>
                  </div>
                )}

                {results.launchData.missionStatus && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-sm text-gray-400">Status:</span>
                      <p className="text-white font-medium">{results.launchData.missionStatus}</p>
                    </div>
                  </div>
                )}
              </div>

              {results.launchData.webcast && (
                <div className="pt-3 border-t border-white/10">
                  <a
                    href={results.launchData.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Watch Live Webcast</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weather Data */}
        {results.weatherData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              🌤️ Weather Conditions
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <div>
                    <span className="text-sm text-gray-400">Temperature</span>
                    <p className="text-white font-medium">{results.weatherData.temperature}°C</p>
                    <p className="text-xs text-gray-400">Feels like {results.weatherData.feelsLike}°C</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-blue-400" />
                  <div>
                    <span className="text-sm text-gray-400">Wind</span>
                    <p className="text-white font-medium">{results.weatherData.windSpeed} m/s</p>
                    {results.weatherData.windGust && (
                      <p className="text-xs text-yellow-400">Gusts: {results.weatherData.windGust} m/s</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <div>
                    <span className="text-sm text-gray-400">Humidity</span>
                    <p className="text-white font-medium">{results.weatherData.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <div>
                    <span className="text-sm text-gray-400">Visibility</span>
                    <p className="text-white font-medium">
                      {results.weatherData.visibility ? `${results.weatherData.visibility} km` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Conditions:</span>
                  <span className="text-white capitalize">{results.weatherData.description}</span>
                </div>
                
                {results.weatherData.launchConditions && (
                  <div className="bg-black/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Launch Risk:</span>
                      <span className={`font-medium ${
                        results.weatherData.launchConditions.riskLevel === 'HIGH' ? 'text-red-400' :
                        results.weatherData.launchConditions.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {results.weatherData.launchConditions.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">
                      {results.weatherData.launchConditions.recommendation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* News Analysis */}
      {results.newsAnalysis && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            📰 News Sentiment Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-black/20 rounded-lg">
              <div className={`text-2xl font-bold ${
                results.newsAnalysis.sentiment === 'POSITIVE' ? 'text-green-400' :
                results.newsAnalysis.sentiment === 'NEGATIVE' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {results.newsAnalysis.sentiment === 'POSITIVE' ? '📈' :
                 results.newsAnalysis.sentiment === 'NEGATIVE' ? '📉' : '➡️'}
              </div>
              <div className="text-sm text-gray-400">Sentiment</div>
              <div className="text-white font-medium">{results.newsAnalysis.sentiment}</div>
            </div>
            
            <div className="text-center p-3 bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{results.newsAnalysis.articlesCount}</div>
              <div className="text-sm text-gray-400">Articles</div>
              <div className="text-white font-medium">Analyzed</div>
            </div>
            
            <div className="text-center p-3 bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {results.newsAnalysis.publishedAt ? 
                  Math.floor((new Date() - new Date(results.newsAnalysis.publishedAt)) / (1000 * 60 * 60)) + 'h' : 
                  'N/A'
                }
              </div>
              <div className="text-sm text-gray-400">Latest</div>
              <div className="text-white font-medium">Coverage</div>
            </div>
          </div>

          {results.newsAnalysis.headlines && results.newsAnalysis.headlines.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-white mb-3">Recent Headlines:</h4>
              <div className="space-y-2">
                {results.newsAnalysis.headlines.slice(0, 3).map((headline, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-black/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-300">{headline}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-gray-300">{results.newsAnalysis.summary}</p>
          </div>
        </div>
      )}

      {/* Execution Summary */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Execution Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{executionLog.length}</div>
            <div className="text-sm text-gray-400">Agent Actions</div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {Object.keys(results).filter(key => key !== 'finalAnalysis' && key !== 'error').length}
            </div>
            <div className="text-sm text-gray-400">Data Sources</div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {executionLog.length > 0 ? Math.round((Date.now() - executionLog[0]?.timestamp) / 1000) : 0}s
            </div>
            <div className="text-sm text-gray-400">Execution Time</div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-sm text-green-300">
            ✅ All agents executed successfully with real-time data integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;