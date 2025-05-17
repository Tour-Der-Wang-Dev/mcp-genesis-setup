
# MCP System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          Client Browser                                  │
│                                                                          │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                             React Frontend                               │
│                                                                          │
│  ┌──────────────┐   ┌───────────────┐   ┌───────────────┐   ┌──────────┐ │
│  │              │   │               │   │               │   │          │ │
│  │  Dashboard   │◄──┤ Command       │◄──┤ Master        │   │ Status   │ │
│  │  (Main UI)   │   │ Console       │   │ Prompting     │   │ Displays │ │
│  │              │   │               │   │ System        │   │          │ │
│  └──────┬───────┘   └───────┬───────┘   └───────────────┘   └──────────┘ │
│         │                   │                                            │
│         │         ┌─────────▼───────────┐                                │
│         │         │                     │                                │
│         └────────►│  UI Components      │                                │
│                   │  (shadcn/ui)        │                                │
│                   │                     │                                │
│                   └─────────────────────┘                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     Core Logic (Utils & Hooks)                           │
│                                                                          │
│  ┌──────────────────────┐   ┌──────────────┐   ┌─────────────────────┐   │
│  │                      │   │              │   │                     │   │
│  │  Command Definitions │   │  Command     │   │  Response           │   │
│  │  & Processing        │   │  History     │   │  Formatting         │   │
│  │                      │   │              │   │                     │   │
│  └──────────────────────┘   └──────────────┘   └─────────────────────┘   │
│                                                                          │
│  ┌──────────────────────┐   ┌──────────────┐                             │
│  │                      │   │              │                             │
│  │  Macro Recording     │   │  Suggestion  │                             │
│  │  & Playback          │   │  Engine      │                             │
│  │                      │   │              │                             │
│  └──────────────────────┘   └──────────────┘                             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                            Future Extensions                             │
│                                                                          │
│  ┌──────────────┐   ┌───────────────┐   ┌───────────────┐   ┌──────────┐ │
│  │              │   │               │   │               │   │          │ │
│  │  API         │   │ Authentication│   │ Backend       │   │ Storage  │ │
│  │  Integration │   │ & User Roles  │   │ Services      │   │ Layer    │ │
│  │              │   │               │   │               │   │          │ │
│  └──────────────┘   └───────────────┘   └───────────────┘   └──────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Key Components:

1. **Client Browser**
   - End-user access point

2. **React Frontend**
   - **Dashboard**: Main UI container for all components
   - **Command Console**: Interactive CLI for user input
   - **Master Prompting System**: Enhanced command processing
   - **Status Displays**: Various monitoring panels
   - **UI Components**: Reusable shadcn/ui elements

3. **Core Logic**
   - **Command Definitions & Processing**: Command parsing and execution
   - **Command History**: Storage of past commands
   - **Response Formatting**: Structured output generation
   - **Macro Recording & Playback**: Command automation
   - **Suggestion Engine**: Intelligent command suggestions

4. **Future Extensions** (potential growth areas)
   - **API Integration**: Connection to external services
   - **Authentication & User Roles**: Access control
   - **Backend Services**: Server-side processing
   - **Storage Layer**: Persistent data storage
