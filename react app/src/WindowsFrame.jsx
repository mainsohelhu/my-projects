import React from 'react';

const WindowsFrame = ({ children, title = "Untitled_Project" }) => {
  return (
    <div className="relative group max-w-4xl mx-auto">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
      
      {/* Window Container */}
      <div className="relative bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="h-10 bg-[#161b22] border-b border-gray-800 flex items-center px-4 justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-gray-500 text-xs font-mono tracking-wider">{title}</div>
          <div className="w-10"></div>
        </div>

        {/* Content Area */}
        <div className="p-1 bg-[#0d1117]">
            {children}
        </div>
      </div>
    </div>
  );
};

export default WindowsFrame;