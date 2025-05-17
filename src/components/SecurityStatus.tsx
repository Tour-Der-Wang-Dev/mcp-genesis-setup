
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Check, AlertTriangle, AlertCircle } from 'lucide-react';

const SecurityStatus: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState({
    overall: 'optimal',
    quantum: {
      status: 'secure',
      lastChecked: new Date().toISOString(),
    },
    firewall: {
      status: 'active',
      blockedAttempts: 42,
    },
    authentication: {
      status: 'verified',
      sessions: 7,
    },
    anomaly: {
      status: 'clear',
      lastScan: new Date().toISOString(),
    }
  });
  
  // Simulate security status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUpdate = Math.random();
      
      setSecurityStatus(prev => {
        // Occasionally show warning or alert states
        if (randomUpdate > 0.95) {
          return {
            ...prev,
            overall: 'attention',
            anomaly: {
              status: 'detected',
              lastScan: new Date().toISOString(),
            }
          };
        } else if (randomUpdate > 0.9) {
          return {
            ...prev,
            firewall: {
              status: 'active',
              blockedAttempts: prev.firewall.blockedAttempts + Math.floor(Math.random() * 5) + 1,
            }
          };
        } else {
          return {
            ...prev,
            quantum: {
              status: 'secure',
              lastChecked: new Date().toISOString(),
            },
            overall: 'optimal',
            anomaly: {
              status: 'clear',
              lastScan: new Date().toISOString(),
            }
          };
        }
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="mcp-panel">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 text-mcp-accent mr-2" />
        <h3 className="text-sm font-semibold font-['Orbitron']">Security Systems</h3>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
          securityStatus.overall === 'optimal' ? 'text-mcp-success bg-mcp-success bg-opacity-20' :
          securityStatus.overall === 'attention' ? 'text-mcp-warning bg-mcp-warning bg-opacity-20' :
          'text-mcp-danger bg-mcp-danger bg-opacity-20'
        }`}>
          {securityStatus.overall.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-4">
        <SecurityComponent 
          name="Quantum-Resistant Encryption" 
          status={securityStatus.quantum.status}
          details={`Last Verified: ${new Date(securityStatus.quantum.lastChecked).toLocaleTimeString()}`}
        />
        
        <SecurityComponent 
          name="Neural Firewall" 
          status={securityStatus.firewall.status}
          details={`Blocked Attempts: ${securityStatus.firewall.blockedAttempts}`}
        />
        
        <SecurityComponent 
          name="Biometric Authentication" 
          status={securityStatus.authentication.status}
          details={`Active Sessions: ${securityStatus.authentication.sessions}`}
        />
        
        <SecurityComponent 
          name="Anomaly Detection" 
          status={securityStatus.anomaly.status}
          details={`Last Scan: ${new Date(securityStatus.anomaly.lastScan).toLocaleTimeString()}`}
        />
      </div>
    </Card>
  );
};

interface SecurityComponentProps {
  name: string;
  status: string;
  details: string;
}

const SecurityComponent: React.FC<SecurityComponentProps> = ({ name, status, details }) => {
  const getStatusInfo = (status: string) => {
    switch(status.toLowerCase()) {
      case 'secure':
      case 'active':
      case 'verified':
      case 'clear':
        return {
          icon: <Check className="h-4 w-4 text-mcp-success" />,
          color: 'text-mcp-success',
          bgColor: 'bg-mcp-success bg-opacity-10'
        };
      case 'warning':
      case 'attention':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-mcp-warning" />,
          color: 'text-mcp-warning',
          bgColor: 'bg-mcp-warning bg-opacity-10'
        };
      case 'breach':
      case 'danger':
      case 'detected':
        return {
          icon: <AlertCircle className="h-4 w-4 text-mcp-danger" />,
          color: 'text-mcp-danger',
          bgColor: 'bg-mcp-danger bg-opacity-10'
        };
      default:
        return {
          icon: <Check className="h-4 w-4 text-mcp-success" />,
          color: 'text-mcp-success',
          bgColor: 'bg-mcp-success bg-opacity-10'
        };
    }
  };
  
  const { icon, color, bgColor } = getStatusInfo(status);
  
  return (
    <div className={`p-2 rounded ${bgColor} border-l-2 ${color.replace('text-', 'border-')}`}>
      <div className="flex items-center">
        {icon}
        <span className="text-xs font-semibold ml-2">{name}</span>
        <span className={`ml-auto text-xs ${color}`}>{status}</span>
      </div>
      <div className="text-xs text-mcp-text-dim mt-1 ml-6">{details}</div>
    </div>
  );
};

export default SecurityStatus;
