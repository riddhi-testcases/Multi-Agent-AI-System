import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GoalInput from './components/GoalInput';
import AgentDashboard from './components/AgentDashboard';
import ResultsDisplay from './components/ResultsDisplay';
import Footer from './components/Footer';
import { MultiAgentOrchestrator } from './agents/MultiAgentOrchestrator';

function App() {
  const [orchestrator] = useState(() => new MultiAgentOrchestrator());
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState('');
  const [agentStatuses, setAgentStatuses] = useState({});
  const [results, setResults] = useState(null);
  const [executionLog, setExecutionLog] = useState([]);

  useEffect(() => {
    orchestrator.onStatusUpdate = (agentId, status, data) => {
      setAgentStatuses(prev => ({
        ...prev,
        [agentId]: { status, data, timestamp: Date.now() }
      }));
    };

    orchestrator.onLogUpdate = (log) => {
      setExecutionLog(prev => [...prev, { ...log, timestamp: Date.now() }]);
    };
  }, [orchestrator]);

  const handleExecuteGoal = async (goal) => {
    setCurrentGoal(goal);
    setIsProcessing(true);
    setResults(null);
    setExecutionLog([]);
    setAgentStatuses({});

    try {
      const result = await orchestrator.executeGoal(goal);
      setResults(result);
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="min-h-screen backdrop-blur-sm">
        <Header />
        
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Multi-Agent AI System
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Intelligent agents working together to achieve complex goals through 
              real-time data enrichment and collaborative planning
            </p>
          </div>

          <GoalInput 
            onExecute={handleExecuteGoal}
            isProcessing={isProcessing}
            currentGoal={currentGoal}
          />

          {(isProcessing || Object.keys(agentStatuses).length > 0) && (
            <AgentDashboard 
              agentStatuses={agentStatuses}
              executionLog={executionLog}
              isProcessing={isProcessing}
            />
          )}

          {results && (
            <ResultsDisplay 
              results={results}
              goal={currentGoal}
              executionLog={executionLog}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;