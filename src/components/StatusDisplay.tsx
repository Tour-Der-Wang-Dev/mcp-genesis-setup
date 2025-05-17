
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getSystemStatus } from '@/utils/mcpCommands';
import { Activity, Cpu, Server, Shield, Network } from 'lucide-react';

const StatusDisplay: React.FC = () => {
  const [status, setStatus] = useState(getSystemStatus());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getSystemStatus());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatusCard 
        title="CPU"
        icon={<Cpu className="h-5 w-5 text-mcp-accent" />}
        value={`${status.cpu.usage}%`}
        details={[
          `${status.cpu.cores} Cores`,
          `${status.cpu.temperature}°C`
        ]}
        color="accent"
      />
      
      <StatusCard 
        title="Memory"
        icon={<Server className="h-5 w-5 text-mcp-accent-dim" />}
        value={`${status.memory.usage}%`}
        details={[
          `Total: ${status.memory.total}`,
          `Available: ${status.memory.available}`
        ]}
        color="accent"
      />
      
      <StatusCard 
        title="Network"
        icon={<Network className="h-5 w-5 text-mcp-success" />}
        value={`${status.network.bandwidth}%`}
        details={[
          `${status.network.activeConnections} Connections`,
          `${status.network.packetLoss}% Loss`
        ]}
        color="success"
      />
      
      <StatusCard 
        title="Security"
        icon={<Shield className="h-5 w-5 text-mcp-warning" />}
        value={status.security.status}
        details={[
          `Threat Level: ${status.security.threatLevel}`,
          `${status.security.activeDefenses.length} Active Defenses`
        ]}
        color="warning"
      />
      
      <StatusCard 
        title="AI Systems"
        icon={<Activity className="h-5 w-5 text-mcp-accent" />}
        value={status.ai.status}
        details={[
          `${status.ai.processes} Processes`,
          `${status.ai.confidence}% Confidence`
        ]}
        color="accent"
      />
    </div>
  );
};

interface StatusCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  details: string[];
  color: 'accent' | 'success' | 'warning' | 'danger';
}

const StatusCard: React.FC<StatusCardProps> = ({ title, icon, value, details, color }) => {
  const colorMap = {
    accent: 'text-mcp-accent border-mcp-accent',
    success: 'text-mcp-success border-mcp-success',
    warning: 'text-mcp-warning border-mcp-warning',
    danger: 'text-mcp-danger border-mcp-danger'
  };
  
  return (
    <Card className="mcp-panel">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="text-sm font-semibold ml-2">{title}</h3>
        </div>
        <div className={`px-2 rounded-full border ${colorMap[color]} text-xs animate-pulse-glow`}>
          Active
        </div>
      </div>
      
      <div className="text-xl font-bold mb-2 font-['Orbitron']">{value}</div>
      
      <div className="text-xs text-mcp-text-dim">
        {details.map((detail, index) => (
          <div key={index} className="mb-1">{detail}</div>
        ))}
      </div>
    </Card>
  );
};

export default StatusDisplay;
