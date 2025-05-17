
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, ArrowUp, X, Play, Square, List, Clock } from 'lucide-react';
import { CommandResponse } from '@/utils/mcpCommands';
import { 
  processEnhancedCommand, 
  generateSuggestions,
  CommandHistoryItem,
  CommandMacro
} from '@/utils/masterPromptingSystem';
import { useToast } from '@/components/ui/use-toast';
import CommandSuggestions from './CommandSuggestions';

const CommandConsole: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandResponse[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryFull, setCommandHistoryFull] = useState<CommandHistoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMacro, setCurrentMacro] = useState<string>('');
  const [macroCommands, setMacroCommands] = useState<string[]>([]);
  const [savedMacros, setSavedMacros] = useState<CommandMacro[]>([]);
  
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
  
  // Generate suggestions when command changes
  useEffect(() => {
    const newSuggestions = generateSuggestions(command, commandHistoryFull);
    setSuggestions(newSuggestions);
  }, [command, commandHistoryFull]);
  
  // Update recent commands list
  useEffect(() => {
    if (commandHistory.length > 0) {
      // Get unique recent commands (last 5)
      const recent = Array.from(new Set(commandHistory.slice(-10).reverse()));
      setRecentCommands(recent.slice(0, 5));
    }
  }, [commandHistory]);

  const handleSendCommand = () => {
    if (!command.trim()) return;
    
    const trimmedCommand = command.trim();
    const response = processEnhancedCommand(trimmedCommand, commandHistoryFull);
    
    // Add to history
    setHistory(prev => [...prev, response]);
    setCommandHistory(prev => [...prev, trimmedCommand]);
    
    // Add to full history with timestamp
    setCommandHistoryFull(prev => [
      ...prev, 
      { 
        command: trimmedCommand, 
        timestamp: new Date(), 
        response 
      }
    ]);
    
    // Handle macro recording if active
    if (isRecording) {
      setMacroCommands(prev => [...prev, trimmedCommand]);
      
      // Check if this command stops the recording
      if (trimmedCommand.toLowerCase().startsWith('macro stop')) {
        finishMacroRecording();
      }
    } else if (trimmedCommand.toLowerCase().startsWith('macro record')) {
      // Start recording a new macro
      startMacroRecording(trimmedCommand);
    } else if (trimmedCommand.toLowerCase().startsWith('macro run')) {
      // Run a macro
      const macroName = trimmedCommand.split(' ')[2];
      if (macroName) {
        const macro = savedMacros.find(m => m.name === macroName);
        if (macro) {
          runMacro(macro);
        }
      }
    }
    
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
  
  const startMacroRecording = (cmd: string) => {
    const parts = cmd.split(' ');
    const macroName = parts[2] || `macro_${new Date().getTime()}`;
    setCurrentMacro(macroName);
    setIsRecording(true);
    setMacroCommands([]);
    toast({
      title: 'Recording Started',
      description: `Now recording macro "${macroName}"`,
    });
  };
  
  const finishMacroRecording = () => {
    // Filter out the macro stop command
    const commands = macroCommands.filter(cmd => !cmd.toLowerCase().startsWith('macro stop'));
    
    if (commands.length > 0) {
      const newMacro: CommandMacro = {
        name: currentMacro,
        commands: commands,
        description: `Macro with ${commands.length} commands`
      };
      
      setSavedMacros(prev => [...prev, newMacro]);
      
      toast({
        title: 'Macro Saved',
        description: `Recorded macro "${currentMacro}" with ${commands.length} commands`,
      });
    } else {
      toast({
        title: 'Empty Macro',
        description: 'No commands were recorded for the macro',
        variant: 'destructive'
      });
    }
    
    setIsRecording(false);
    setCurrentMacro('');
    setMacroCommands([]);
  };
  
  const runMacro = (macro: CommandMacro) => {
    toast({
      title: 'Running Macro',
      description: `Executing macro "${macro.name}" with ${macro.commands.length} commands`,
    });
    
    // Execute each command with a small delay
    macro.commands.forEach((cmd, index) => {
      setTimeout(() => {
        setCommand(cmd);
        setTimeout(() => {
          handleSendCommand();
        }, 100);
      }, index * 500);
    });
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

  const selectSuggestion = (suggestion: string) => {
    setCommand(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
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
    message: 'MCP v1.0 initialized with Master Prompting system. Type "help" for available commands.',
    status: 'info'
  };

  return (
    <Card className="mcp-panel h-96 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Terminal className="h-5 w-5 text-mcp-accent mr-2" />
          <h3 className="text-sm font-semibold font-['Orbitron']">Master Command Console</h3>
          {isRecording && (
            <div className="flex items-center ml-3 animate-pulse">
              <Square className="h-3 w-3 text-mcp-danger mr-1" />
              <span className="text-xs text-mcp-danger">Recording: {currentMacro}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {isRecording ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCommand('macro stop')} 
              className="h-6 w-6" 
              title="Stop recording"
            >
              <Square className="h-4 w-4 text-mcp-danger" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCommand('macro record new_macro')} 
              className="h-6 w-6" 
              title="Start recording macro"
            >
              <Play className="h-4 w-4 text-mcp-success" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCommand('macro list')} 
            className="h-6 w-6"
            title="List saved macros"
          >
            <List className="h-4 w-4 text-mcp-text-dim" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommand('help')}
            className="h-6 w-6"
            title="Show help"
          >
            <HelpCircle className="h-4 w-4 text-mcp-text-dim" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearConsole} 
            className="h-6 w-6"
            title="Clear console"
          >
            <X className="h-4 w-4 text-mcp-text-dim hover:text-mcp-danger" />
          </Button>
        </div>
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
              
              {/* Show suggestions from response if available */}
              {item.data?.suggestions && (
                <div className="ml-4 mt-1">
                  <CommandSuggestions
                    suggestions={item.data.suggestions.commands}
                    onSelectSuggestion={selectSuggestion}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="space-y-2">
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
        
        {/* Command suggestions based on input */}
        {command && suggestions.length > 0 && (
          <CommandSuggestions
            suggestions={suggestions}
            onSelectSuggestion={selectSuggestion}
          />
        )}
        
        {/* Recent commands */}
        {!command && recentCommands.length > 0 && (
          <CommandSuggestions
            suggestions={recentCommands}
            onSelectSuggestion={selectSuggestion}
            title="Recent commands:"
          />
        )}
      </div>
    </Card>
  );
};

export default CommandConsole;
