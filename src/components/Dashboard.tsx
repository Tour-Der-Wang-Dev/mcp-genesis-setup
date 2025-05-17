
import React, { useState, useEffect } from 'react';
import StatusDisplay from './StatusDisplay';
import CommandConsole from './CommandConsole';
import ResourceMonitor from './ResourceMonitor';
import NetworkGraph from './NetworkGraph';
import SecurityStatus from './SecurityStatus';
import CommandHelpPanel from './CommandHelpPanel';
import { Separator } from '@/components/ui/separator';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div className="min-h-screen mcp-grid-pattern p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 mcp-panel py-2 px-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-mcp-accent animate-pulse-glow font-['Orbitron']">
            Modern Master Control Program
          </h1>
          <p className="text-xs text-mcp-text-dim">v1.0.0 - Security Level: Alpha - Master Prompting Enabled</p>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-bold font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-xs text-mcp-text-dim">
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="mb-6">
        <h2 className="text-md font-semibold mb-3 font-['Orbitron']">System Status</h2>
        <StatusDisplay />
      </div>
      
      <Separator className="my-6 bg-mcp-accent bg-opacity-30" />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <CommandConsole />
        </div>
        <div className="space-y-6">
          <ResourceMonitor />
          <CommandHelpPanel />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkGraph />
        <SecurityStatus />
      </div>
    </div>
  );
};

export default Dashboard;
