import React from 'react';
import { Bot, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

const AgentDashboard = ({ agentStatuses, executionLog, isProcessing }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-400/30 bg-green-400/10';
      case 'processing':
        return 'border-blue-400/30 bg-blue-400/10';
      case 'error':
        return 'border-red-400/30 bg-red-400/10';
      default:
        return 'border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Status Grid */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Bot className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">Agent Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(agentStatuses).map(([agentId, status]) => (
            <div
              key={agentId}
              className={`p-4 rounded-xl border ${getStatusColor(status.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{agentId}</span>
                {getStatusIcon(status.status)}
              </div>
              <p className="text-sm text-gray-300 capitalize">{status.status}</p>
              {status.data && (
                <p className="text-xs text-gray-400 mt-1">
                  {typeof status.data === 'string' 
                    ? status.data.substring(0, 50) + '...'
                    : 'Data received'
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Execution Log</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {executionLog.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-300">{log.agent}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;