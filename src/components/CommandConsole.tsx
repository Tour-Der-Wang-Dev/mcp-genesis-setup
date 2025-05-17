
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, ArrowUp, X } from 'lucide-react';
import { processCommand, CommandResponse } from '@/utils/mcpCommands';
import { useToast } from '@/components/ui/use-toast';

const CommandConsole: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandResponse[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendCommand = () => {
    if (!command.trim()) return;
    
    const trimmedCommand = command.trim();
    const response = processCommand(trimmedCommand);
    
    // Add to history
    setHistory(prev => [...prev, response]);
    setCommandHistory(prev => [...prev, trimmedCommand]);
    
    // Show toast for important responses
    if (response.status === 'error' || response.status === 'warning') {
      toast({
        title: response.status === 'error' ? 'Command Error' : 'Command Warning',
        description: response.message,
        variant: response.status === 'error' ? 'destructive' : 'default'
      });
    }
    
    // Reset
    setCommand('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    } else if (e.key === 'ArrowUp') {
      // Navigate command history
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate command history (forward)
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const clearConsole = () => {
    setHistory([]);
    toast({
      title: 'Console Cleared',
      description: 'Command history has been cleared',
    });
  };

  const initialPrompt: CommandResponse = {
    message: 'MCP v1.0 initialized. Type "help" for available commands.',
    status: 'info'
  };

  return (
    <Card className="mcp-panel h-96 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Terminal className="h-5 w-5 text-mcp-accent mr-2" />
          <h3 className="text-sm font-semibold font-['Orbitron']">Command Console</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={clearConsole} className="h-6 w-6">
          <X className="h-4 w-4 text-mcp-text-dim hover:text-mcp-danger" />
        </Button>
      </div>
      
      <ScrollArea 
        className="flex-grow rounded bg-mcp-bg-dark p-2 mb-2 mcp-scrollbar"
        ref={scrollAreaRef}
      >
        <div className="space-y-2 font-mono text-sm">
          {/* Initial prompt */}
          <div className="flex">
            <span className="text-mcp-accent-dim mr-1">$</span>
            <span className="text-mcp-text-dim">{initialPrompt.message}</span>
          </div>
          
          {/* Command history */}
          {history.map((item, i) => (
            <div key={i} className="space-y-1 animate-fade-in">
              <div className="flex">
                <span className="text-mcp-accent mr-1">&gt;</span>
                <span className="text-mcp-text">{commandHistory[i]}</span>
              </div>
              <div className={`ml-4 ${
                item.status === 'error' ? 'text-mcp-danger' : 
                item.status === 'warning' ? 'text-mcp-warning' : 
                item.status === 'success' ? 'text-mcp-success' : 'text-mcp-text-dim'
              }`}>
                {item.message}
              </div>
              {item.data && (
                <pre className="ml-4 text-xs bg-mcp-bg-medium p-2 rounded">
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="bg-mcp-bg-dark border-mcp-accent border-opacity-30 text-mcp-text pr-8"
          />
          {historyIndex >= 0 && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <ArrowUp className="h-3 w-3 text-mcp-accent-dim" />
            </span>
          )}
        </div>
        <Button 
          onClick={handleSendCommand}
          className="bg-mcp-accent hover:bg-mcp-accent-dim text-black"
        >
          Execute
        </Button>
      </div>
    </Card>
  );
};

export default CommandConsole;
