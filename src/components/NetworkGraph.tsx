
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { getNetworkData } from '@/utils/mcpCommands';

const NetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const networkData = getNetworkData();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw network nodes
    const nodes = networkData.nodes;
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    // Calculate node positions
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;
      const x = canvas.width / 2 + radius * Math.cos(angle);
      const y = canvas.height / 2 + radius * Math.sin(angle);
      
      nodePositions[node.id] = { x, y };
    });
    
    // Draw connections
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Create connections between nearby nodes
    Object.entries(nodePositions).forEach(([nodeId, pos], index) => {
      const connections = nodes[index].connections;
      const connectedNodes = Object.entries(nodePositions)
        .filter(([otherId]) => otherId !== nodeId)
        .sort(() => Math.random() - 0.5) // Randomize connections
        .slice(0, connections);
      
      connectedNodes.forEach(([_, otherPos]) => {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(otherPos.x, otherPos.y);
        ctx.stroke();
        
        // Add data flow animation
        const midX = (pos.x + otherPos.x) / 2;
        const midY = (pos.y + otherPos.y) / 2;
        const size = Math.random() * 3 + 1;
        
        ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(midX, midY, size, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    
    // Draw nodes
    nodes.forEach((node, index) => {
      const { x, y } = nodePositions[node.id];
      
      // Node status color
      const nodeColor = node.status === 'warning' ? '#FFD600' : '#00E5FF';
      
      // Draw glow
      const gradient = ctx.createRadialGradient(x, y, 2, x, y, 15);
      gradient.addColorStop(0, nodeColor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw node
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw node label
      ctx.fillStyle = '#E0F7FA';
      ctx.font = '10px Roboto Mono';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, x, y - 10);
    });
    
    // Center node
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#00E676';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Text for MCP
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('MCP', canvas.width / 2, canvas.height / 2 + 20);
    
  }, [networkData]);
  
  return (
    <Card className="mcp-panel">
      <div className="flex items-center mb-4">
        <Network className="h-5 w-5 text-mcp-accent mr-2" />
        <h3 className="text-sm font-semibold font-['Orbitron']">Network Topology</h3>
      </div>
      
      <div className="relative aspect-video">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-mcp-text-dim">
        <div>Nodes: {networkData.nodes.length}</div>
        <div>Status: Active</div>
      </div>
    </Card>
  );
};

export default NetworkGraph;
