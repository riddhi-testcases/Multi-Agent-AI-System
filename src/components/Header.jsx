import React from 'react';
import { Bot, Zap, Network } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-blue-800/30 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AgentFlow</h1>
              <p className="text-sm text-blue-200">Multi-Agent Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-400">Live APIs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;