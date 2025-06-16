import React, { useState } from 'react';
import { Play, Loader2, Target } from 'lucide-react';

const GoalInput = ({ onExecute, isProcessing, currentGoal }) => {
  const [goal, setGoal] = useState('');

  const exampleGoals = [
    "Find the next SpaceX launch, check weather at that location, then summarize if it may be delayed",
    "Get latest Bitcoin price, find related news sentiment, and predict short-term trend",
    "Find upcoming rocket launches, check weather conditions, and assess launch probability"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim() && !isProcessing) {
      onExecute(goal.trim());
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">Set Your Goal</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe what you want to achieve..."
            className="w-full p-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isProcessing}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={!goal.trim() || isProcessing}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Execute Goal</span>
              </>
            )}
          </button>

          {currentGoal && (
            <div className="flex items-center px-4 py-3 bg-green-600/20 text-green-300 rounded-xl">
              <span className="text-sm">Currently: {currentGoal.substring(0, 50)}...</span>
            </div>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Example Goals:</h3>
        <div className="space-y-2">
          {exampleGoals.map((example, index) => (
            <button
              key={index}
              onClick={() => setGoal(example)}
              disabled={isProcessing}
              className="w-full text-left p-3 bg-black/20 hover:bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalInput;