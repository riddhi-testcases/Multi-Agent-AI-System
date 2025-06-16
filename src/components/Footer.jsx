import React from 'react';
import { Github, Linkedin, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-blue-800/30 bg-black/20 backdrop-blur-md mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white mb-2">
              Multi-Agent AI System
            </h3>
            <p className="text-sm text-gray-300 max-w-md">
              Advanced intelligent agents working to solve complex problems 
              through real-time data enrichment and collaborative decision making.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-2">
  <a
    href="https://github.com/riddhi-testcases"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
  >
    <Github className="h-5 w-5 text-gray-400 hover:text-black transition-colors" />
  </a>
  <a
    href="https://www.linkedin.com/in/riddhi-chakraborty-334069279"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
  >
    <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
  </a>
  <a
    href="https://leetcode.com/u/Riddzz_stack/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LeetCode"
  >
    <Code className="h-5 w-5 text-gray-400 hover:text-yellow-500 transition-colors" />
  </a>
</div>

            <p className="text-sm text-gray-300">
              Built by{' '}
              <span className="font-semibold text-blue-400">Riddhi Chakraborty</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;