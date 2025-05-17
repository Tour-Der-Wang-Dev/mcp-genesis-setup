
# Project Files Structure

This document provides an overview of all files in the Modern Master Control Program (MCP) project with emoji indicators:
- 🟢 (Green): Few imports, focused functionality
- 🟡 (Yellow): Moderate imports, some complexity
- 🔴 (Red): Many imports, high complexity

## Root Files
- `README.md` 🟢 - Project overview and setup instructions
- `package.json` 🟡 - Contains project dependencies and scripts

## src/
- `App.tsx` 🟡 - Main application component that sets up routing and providers
- `main.tsx` 🟢 - Entry point for the application
- `index.css` 🟢 - Global CSS styles for the application

## src/components/
- `CommandConsole.tsx` 🔴 - Interactive console component for entering and executing MCP commands
- `CommandHelpPanel.tsx` 🟡 - Panel displaying available commands and their documentation
- `CommandSuggestions.tsx` 🟢 - Component for displaying suggested commands to users
- `Dashboard.tsx` 🟡 - Main dashboard layout component that integrates all MCP panels
- `NetworkGraph.tsx` 🟡 - Visualization component for network topology and connections
- `ResourceMonitor.tsx` 🟡 - Component for monitoring and displaying system resource usage
- `SecurityStatus.tsx` 🟡 - Component for displaying security status and threat information
- `StatusDisplay.tsx` 🟢 - Component for showing the overall system status

## src/components/ui/
- Various UI components 🟢 - Reusable UI elements built with shadcn/ui (button, card, input, etc.)

## src/hooks/
- `use-toast.ts` 🟢 - Custom hook for displaying toast notifications
- `use-mobile.tsx` 🟢 - Hook for detecting mobile devices and responsive behavior

## src/lib/
- `utils.ts` 🟢 - General utility functions used throughout the application

## src/pages/
- `Index.tsx` 🟢 - Main page component that renders the Dashboard
- `NotFound.tsx` 🟢 - 404 page for handling non-existent routes

## src/utils/
- `masterPromptingSystem.ts` 🔴 - Core logic for the Master Prompting System with command processing
- `mcpCommands.ts` 🟡 - Definitions and handlers for MCP commands
