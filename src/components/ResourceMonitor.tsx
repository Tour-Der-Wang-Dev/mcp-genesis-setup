
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getResourceAllocation } from '@/utils/mcpCommands';
import { Layers } from 'lucide-react';

interface Resource {
  name: string;
  allocation: number;
}

const ResourceMonitor: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(getResourceAllocation());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(getResourceAllocation());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mcp-panel">
      <div className="flex items-center mb-4">
        <Layers className="h-5 w-5 text-mcp-accent mr-2" />
        <h3 className="text-sm font-semibold font-['Orbitron']">Resource Allocation</h3>
      </div>
      
      <div className="space-y-4">
        {resources.map((resource, index) => (
          <ResourceBar 
            key={index} 
            name={resource.name} 
            value={resource.allocation} 
          />
        ))}
      </div>
    </Card>
  );
};

interface ResourceBarProps {
  name: string;
  value: number;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ name, value }) => {
  // Determine color based on allocation level
  const getColor = (value: number): string => {
    if (value >= 80) return 'text-mcp-danger bg-mcp-danger';
    if (value >= 60) return 'text-mcp-warning bg-mcp-warning';
    return 'text-mcp-success bg-mcp-success';
  };
  
  const barColor = getColor(value);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs">{name}</span>
        <span className="text-xs font-mono">{value}%</span>
      </div>
      <div className="h-2 bg-mcp-bg-dark rounded overflow-hidden">
        <div 
          className={`h-full ${barColor} bg-opacity-70`} 
          style={{ width: `${value}%`, transition: 'width 1s ease-in-out' }}
        />
      </div>
    </div>
  );
};

export default ResourceMonitor;
