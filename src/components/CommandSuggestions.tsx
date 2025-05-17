
import React from 'react';
import { Button } from '@/components/ui/button';

interface CommandSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  title?: string;
}

const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({ 
  suggestions, 
  onSelectSuggestion,
  title = "Suggested commands:"
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-2 space-y-1 animate-fade-in">
      <div className="text-xs text-mcp-accent-dim mb-1">{title}</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="bg-mcp-bg-dark border-mcp-accent-dim text-mcp-text text-xs py-0 h-6 hover:bg-mcp-accent hover:text-black transition-colors duration-200"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommandSuggestions;
