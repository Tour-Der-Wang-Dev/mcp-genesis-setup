
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { commandDefinitions, CommandCategory } from '@/utils/masterPromptingSystem';

const CommandHelpPanel: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    [CommandCategory.SYSTEM]: true  // Default expand system category
  });
  
  const categorizedCommands = Object.values(CommandCategory).map(category => ({
    category,
    commands: commandDefinitions.filter(cmd => cmd.category === category)
  }));
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  return (
    <Card className="mcp-panel">
      <div className="flex items-center mb-4">
        <HelpCircle className="h-5 w-5 text-mcp-accent mr-2" />
        <h3 className="text-sm font-semibold font-['Orbitron']">Command Reference</h3>
      </div>
      
      <div className="space-y-4 text-sm">
        {categorizedCommands.map(group => (
          <div key={group.category} className="space-y-2">
            <button 
              onClick={() => toggleCategory(group.category)}
              className="flex items-center w-full text-left text-xs uppercase text-mcp-accent-dim font-semibold tracking-wider hover:text-mcp-accent transition-colors"
            >
              {expandedCategories[group.category] ? 
                <ChevronDown className="h-3 w-3 mr-1" /> : 
                <ChevronRight className="h-3 w-3 mr-1" />
              }
              {group.category}
              <span className="ml-1 text-mcp-text-dim">({group.commands.length})</span>
            </button>
            
            {expandedCategories[group.category] && (
              <div className="grid grid-cols-1 gap-2 pl-4 border-l border-mcp-accent border-opacity-20">
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
            )}
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
