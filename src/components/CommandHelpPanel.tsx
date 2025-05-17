
import React from 'react';
import { Card } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { commandDefinitions, CommandCategory } from '@/utils/masterPromptingSystem';

const CommandHelpPanel: React.FC = () => {
  const categorizedCommands = Object.values(CommandCategory).map(category => ({
    category,
    commands: commandDefinitions.filter(cmd => cmd.category === category)
  }));
  
  return (
    <Card className="mcp-panel">
      <div className="flex items-center mb-4">
        <HelpCircle className="h-5 w-5 text-mcp-accent mr-2" />
        <h3 className="text-sm font-semibold font-['Orbitron']">Command Reference</h3>
      </div>
      
      <div className="space-y-4 text-sm">
        {categorizedCommands.map(group => (
          <div key={group.category} className="space-y-2">
            <h4 className="text-xs uppercase text-mcp-accent-dim font-semibold tracking-wider">
              {group.category}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {group.commands.map(cmd => (
                <div key={cmd.name} className="space-y-1">
                  <div className="font-mono text-mcp-text-bright">{cmd.name}</div>
                  <div className="text-xs text-mcp-text-dim">{cmd.description}</div>
                  <div className="flex gap-2">
                    {cmd.aliases.slice(0, 3).map(alias => (
                      <span 
                        key={alias} 
                        className="text-xs bg-mcp-bg-dark px-2 py-0.5 rounded-sm text-mcp-accent-dim"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-4 pt-3 border-t border-mcp-accent border-opacity-10 text-xs text-mcp-text-dim">
          Type <span className="font-mono text-mcp-accent">"help [command]"</span> in the console for detailed usage
        </div>
      </div>
    </Card>
  );
};

export default CommandHelpPanel;
