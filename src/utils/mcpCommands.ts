
// MCP Command system for processing user inputs and providing responses

export interface CommandResponse {
  message: string;
  status: 'success' | 'warning' | 'error' | 'info';
  data?: any;
}

// Simple command processor for the MCP system
export const processCommand = (command: string): CommandResponse => {
  const lowerCommand = command.toLowerCase().trim();
  
  // System status commands
  if (lowerCommand.includes('status') || lowerCommand.includes('health')) {
    return {
      message: 'All MCP systems operating within normal parameters.',
      status: 'success',
      data: {
        cpu: 24,
        memory: 42,
        network: 78,
        security: 'optimal'
      }
    };
  }
  
  // Resource allocation commands
  if (lowerCommand.includes('allocate') || lowerCommand.includes('resource')) {
    return {
      message: 'Resource allocation optimized based on current workloads.',
      status: 'success',
      data: {
        allocated: true,
        efficiency: 92.7
      }
    };
  }
  
  // Security related commands
  if (lowerCommand.includes('security') || lowerCommand.includes('threat')) {
    return {
      message: 'Security systems active. No immediate threats detected.',
      status: 'info',
      data: {
        threatLevel: 'low',
        scanResults: {
          network: 'secure',
          endpoints: 'monitored',
          quantum: 'stable'
        }
      }
    };
  }
  
  // Network commands
  if (lowerCommand.includes('network') || lowerCommand.includes('connect')) {
    return {
      message: 'Network topology mapped and optimized.',
      status: 'success',
      data: {
        nodes: 42,
        connections: 128,
        bandwidth: '10.4 TB/s'
      }
    };
  }
  
  // Help command
  if (lowerCommand === 'help' || lowerCommand === '?') {
    return {
      message: 'Available commands: status, allocate resources, security scan, network topology, help',
      status: 'info'
    };
  }
  
  // Unknown command
  return {
    message: `Command not recognized: "${command}". Type "help" for available commands.`,
    status: 'warning'
  };
};

// Sample system status data
export const getSystemStatus = () => {
  return {
    cpu: {
      usage: Math.floor(Math.random() * 30) + 20,
      temperature: Math.floor(Math.random() * 10) + 60,
      cores: 16
    },
    memory: {
      usage: Math.floor(Math.random() * 20) + 30,
      total: '128 TB',
      available: '86 TB'
    },
    network: {
      bandwidth: Math.floor(Math.random() * 40) + 60,
      activeConnections: Math.floor(Math.random() * 200) + 800,
      packetLoss: (Math.random() * 0.4).toFixed(2)
    },
    security: {
      status: 'optimal',
      threatLevel: 'low',
      activeDefenses: ['quantum encryption', 'neural firewall', 'heuristic scanning']
    },
    ai: {
      status: 'operational',
      processes: Math.floor(Math.random() * 50) + 100,
      confidence: Math.floor(Math.random() * 10) + 90
    }
  };
};

// Sample resource allocation data
export const getResourceAllocation = () => {
  return [
    { name: 'Quantum Computing', allocation: Math.floor(Math.random() * 30) + 50 },
    { name: 'Neural Processing', allocation: Math.floor(Math.random() * 20) + 70 },
    { name: 'Data Storage', allocation: Math.floor(Math.random() * 40) + 30 },
    { name: 'Network Bandwidth', allocation: Math.floor(Math.random() * 25) + 60 },
    { name: 'Security Systems', allocation: Math.floor(Math.random() * 15) + 75 },
    { name: 'User Interfaces', allocation: Math.floor(Math.random() * 50) + 20 },
  ];
};

// Sample network data for visualization
export const getNetworkData = () => {
  return {
    nodes: Array.from({ length: 20 }, (_, i) => ({
      id: `node-${i}`,
      name: `Node ${String.fromCharCode(65 + i)}`,
      type: ['server', 'gateway', 'endpoint', 'security', 'storage'][Math.floor(Math.random() * 5)],
      status: Math.random() > 0.9 ? 'warning' : 'operational',
      connections: Math.floor(Math.random() * 5) + 1
    })),
    connections: []
  };
};
