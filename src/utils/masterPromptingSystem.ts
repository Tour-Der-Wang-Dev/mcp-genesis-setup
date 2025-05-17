
// Master Prompting System - Enhanced command processing for the MCP
import { CommandResponse } from './mcpCommands';

// Command categories for organizing available commands
export enum CommandCategory {
  SYSTEM = 'system',
  RESOURCE = 'resource',
  SECURITY = 'security',
  NETWORK = 'network',
  HELP = 'help',
  AUTOMATION = 'automation',
}

// Extended command interface with more metadata
export interface CommandDefinition {
  name: string;
  aliases: string[];
  category: CommandCategory;
  description: string;
  usage: string;
  examples: string[];
}

// Define available commands with extended metadata
export const commandDefinitions: CommandDefinition[] = [
  {
    name: 'status',
    aliases: ['health', 'diagnostics'],
    category: CommandCategory.SYSTEM,
    description: 'Display the current status of MCP systems',
    usage: 'status [component]',
    examples: ['status', 'status network', 'health']
  },
  {
    name: 'allocate',
    aliases: ['resource', 'assign'],
    category: CommandCategory.RESOURCE,
    description: 'Optimize resource allocation based on current workloads',
    usage: 'allocate [resource] [amount]',
    examples: ['allocate', 'resource optimize', 'assign quantum 80']
  },
  {
    name: 'security',
    aliases: ['secure', 'threat', 'protection'],
    category: CommandCategory.SECURITY,
    description: 'Manage security systems and threat assessment',
    usage: 'security [scan|config|status]',
    examples: ['security', 'security scan', 'threat analyze']
  },
  {
    name: 'network',
    aliases: ['connect', 'topology', 'route'],
    category: CommandCategory.NETWORK,
    description: 'Manage network configuration and connections',
    usage: 'network [status|optimize|diagram]',
    examples: ['network', 'connect status', 'topology map']
  },
  {
    name: 'help',
    aliases: ['?', 'guide', 'docs'],
    category: CommandCategory.HELP,
    description: 'Display help information for available commands',
    usage: 'help [command]',
    examples: ['help', 'help security', '?']
  },
  {
    name: 'macro',
    aliases: ['script', 'automate', 'batch'],
    category: CommandCategory.AUTOMATION,
    description: 'Record, manage and run command macros',
    usage: 'macro [record|stop|run|list] [name]',
    examples: ['macro record daily_check', 'macro stop', 'macro run daily_check']
  },
];

// Command history for smart suggestions
export interface CommandHistoryItem {
  command: string;
  timestamp: Date;
  response: CommandResponse;
}

// Command macro for automation
export interface CommandMacro {
  name: string;
  commands: string[];
  description?: string;
}

// Suggestions based on command history and context
export const generateSuggestions = (
  input: string,
  history: CommandHistoryItem[]
): string[] => {
  const lowercaseInput = input.toLowerCase().trim();
  
  // If empty, suggest most used commands or last used
  if (!lowercaseInput) {
    return history.length > 0 
      ? [history[history.length - 1].command]
      : ['status', 'help'];
  }
  
  // Command completion suggestions
  const commandSuggestions = commandDefinitions
    .filter(cmd => 
      cmd.name.startsWith(lowercaseInput) || 
      cmd.aliases.some(alias => alias.startsWith(lowercaseInput))
    )
    .map(cmd => cmd.name);
  
  // Parameter suggestions for recognized commands
  const commandParts = lowercaseInput.split(' ');
  if (commandParts.length > 1) {
    const baseCommand = commandParts[0];
    
    // Add context-specific parameter suggestions
    if (baseCommand === 'status' || baseCommand === 'health') {
      return ['status network', 'status security', 'status resources', 'status ai'];
    }
    
    if (baseCommand === 'network') {
      return ['network status', 'network optimize', 'network diagram', 'network scan'];
    }
    
    if (baseCommand === 'security') {
      return ['security scan', 'security threat-level', 'security protocols'];
    }
  }
  
  return commandSuggestions.length > 0 ? commandSuggestions : [];
};

// Enhanced command processor with context awareness
export const processEnhancedCommand = (
  command: string,
  history: CommandHistoryItem[]
): CommandResponse => {
  const lowerCommand = command.toLowerCase().trim();
  const parts = lowerCommand.split(' ');
  const baseCommand = parts[0];
  
  // Check if this is a macro command first
  if (baseCommand === 'macro') {
    return processMacroCommand(command, parts, history);
  }
  
  // Find matching command definition
  const matchingCommand = commandDefinitions.find(cmd => 
    cmd.name === baseCommand || cmd.aliases.includes(baseCommand)
  );
  
  if (matchingCommand) {
    // Route to appropriate handler based on category
    switch (matchingCommand.category) {
      case CommandCategory.SYSTEM:
        return processSystemCommand(command, parts);
      case CommandCategory.RESOURCE:
        return processResourceCommand(command, parts);
      case CommandCategory.SECURITY:
        return processSecurityCommand(command, parts);
      case CommandCategory.NETWORK:
        return processNetworkCommand(command, parts);
      case CommandCategory.HELP:
        return processHelpCommand(command, parts);
    }
  }
  
  // Unknown command with smart suggestion
  const suggestions = generateSuggestions(lowerCommand, history);
  return {
    message: `Command not recognized: "${command}".`,
    status: 'warning',
    data: {
      suggestions: suggestions.length > 0 
        ? { text: "Did you mean:", commands: suggestions } 
        : null
    }
  };
};

// Process automation/macro commands
const processMacroCommand = (
  command: string, 
  parts: string[], 
  history: CommandHistoryItem[]
): CommandResponse => {
  // Mock implementation - would be expanded with actual recording/playback
  const subCommand = parts[1] || '';
  
  if (subCommand === 'record') {
    const macroName = parts[2] || 'unnamed_macro';
    return {
      message: `Started recording macro "${macroName}". Type "macro stop" to finish recording.`,
      status: 'info',
      data: {
        recording: true,
        macroName
      }
    };
  }
  
  if (subCommand === 'stop') {
    return {
      message: `Macro recording stopped and saved.`,
      status: 'success',
      data: {
        recording: false
      }
    };
  }
  
  if (subCommand === 'run') {
    const macroName = parts[2] || '';
    if (!macroName) {
      return {
        message: `Please specify a macro name to run.`,
        status: 'warning'
      };
    }
    
    return {
      message: `Executed macro "${macroName}" with 3 commands.`,
      status: 'success',
      data: {
        executed: true,
        commandCount: 3
      }
    };
  }
  
  if (subCommand === 'list') {
    return {
      message: `Available macros:`,
      status: 'info',
      data: {
        macros: [
          { name: 'daily_check', commandCount: 3 },
          { name: 'security_scan', commandCount: 2 }
        ]
      }
    };
  }
  
  return {
    message: `Unknown macro command. Available options: record, stop, run, list`,
    status: 'warning'
  };
};

// System status command handler
const processSystemCommand = (command: string, parts: string[]): CommandResponse => {
  const subCommand = parts[1] || '';
  
  if (subCommand === 'network') {
    return {
      message: 'Network systems operating at optimal efficiency.',
      status: 'success',
      data: {
        network: {
          status: 'optimal',
          throughput: '12.7 TB/s',
          latency: '0.8ms',
          activeNodes: 42
        }
      }
    };
  }
  
  if (subCommand === 'security') {
    return {
      message: 'Security systems active. Threat assessment ongoing.',
      status: 'info',
      data: {
        security: {
          status: 'vigilant',
          threatLevel: 'minimal',
          activeProtocols: 7,
          lastBreach: 'none detected'
        }
      }
    };
  }
  
  if (subCommand === 'resources') {
    return {
      message: 'System resources are balanced and available.',
      status: 'success',
      data: {
        cpu: 32,
        memory: 47,
        storage: 28,
        quantum: 63
      }
    };
  }
  
  // Default system status (no subcommand)
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
};

// Resource allocation command handler
const processResourceCommand = (command: string, parts: string[]): CommandResponse => {
  const resource = parts[1] || '';
  const amount = parts[2] ? parseInt(parts[2], 10) : null;
  
  if (resource && amount !== null) {
    return {
      message: `Allocated ${amount}% to ${resource} systems.`,
      status: 'success',
      data: {
        allocated: true,
        resource,
        amount,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // Default resource allocation (no specific resource)
  return {
    message: 'Resource allocation optimized based on current workloads.',
    status: 'success',
    data: {
      allocated: true,
      efficiency: 92.7
    }
  };
};

// Security command handler
const processSecurityCommand = (command: string, parts: string[]): CommandResponse => {
  const subCommand = parts[1] || '';
  
  if (subCommand === 'scan') {
    return {
      message: 'Security scan complete. No vulnerabilities detected.',
      status: 'success',
      data: {
        scanned: true,
        vulnerabilities: 0,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  if (subCommand === 'threat-level') {
    return {
      message: 'Current threat level: MINIMAL',
      status: 'info',
      data: {
        threatLevel: 'minimal',
        factors: [
          'No unusual network activity',
          'All authentication systems secure',
          'Quantum encryption stable'
        ]
      }
    };
  }
  
  // Default security status
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
};

// Network command handler
const processNetworkCommand = (command: string, parts: string[]): CommandResponse => {
  const subCommand = parts[1] || '';
  
  if (subCommand === 'optimize') {
    return {
      message: 'Network routes optimized for maximum throughput.',
      status: 'success',
      data: {
        optimized: true,
        improvement: '23%',
        timestamp: new Date().toISOString()
      }
    };
  }
  
  if (subCommand === 'diagram') {
    return {
      message: 'Generating network topology visualization.',
      status: 'info',
      data: {
        visualization: true,
        nodes: 42,
        connections: 128
      }
    };
  }
  
  // Default network status
  return {
    message: 'Network topology mapped and optimized.',
    status: 'success',
    data: {
      nodes: 42,
      connections: 128,
      bandwidth: '10.4 TB/s'
    }
  };
};

// Help command handler
const processHelpCommand = (command: string, parts: string[]): CommandResponse => {
  const helpTopic = parts[1] || '';
  
  if (helpTopic) {
    // Find matching command for help
    const matchingCommand = commandDefinitions.find(cmd => 
      cmd.name === helpTopic || cmd.aliases.includes(helpTopic)
    );
    
    if (matchingCommand) {
      return {
        message: `Help for command: ${matchingCommand.name}`,
        status: 'info',
        data: {
          command: matchingCommand.name,
          description: matchingCommand.description,
          usage: matchingCommand.usage,
          examples: matchingCommand.examples,
          aliases: matchingCommand.aliases
        }
      };
    }
    
    return {
      message: `No help available for: "${helpTopic}"`,
      status: 'warning'
    };
  }
  
  // General help - list all command categories
  return {
    message: 'MCP Command System - Available Categories',
    status: 'info',
    data: {
      categories: [
        { name: 'System', commands: commandDefinitions.filter(cmd => cmd.category === CommandCategory.SYSTEM).map(cmd => cmd.name) },
        { name: 'Resource', commands: commandDefinitions.filter(cmd => cmd.category === CommandCategory.RESOURCE).map(cmd => cmd.name) },
        { name: 'Security', commands: commandDefinitions.filter(cmd => cmd.category === CommandCategory.SECURITY).map(cmd => cmd.name) },
        { name: 'Network', commands: commandDefinitions.filter(cmd => cmd.category === CommandCategory.NETWORK).map(cmd => cmd.name) },
        { name: 'Help', commands: commandDefinitions.filter(cmd => cmd.category === CommandCategory.HELP).map(cmd => cmd.name) },
        { name: 'Automation', commands: commandDefinitions.filter(cmd => cmd.category === CommandCategory.AUTOMATION).map(cmd => cmd.name) }
      ],
      tip: 'Type "help [command]" for detailed information on a specific command.'
    }
  };
};
