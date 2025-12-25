# 🚁 AIPilot - Enterprise Multi-Agent AI Platform

**Your Intelligent Co-Pilot for AI-Powered Conversations**

AIPilot is a production-ready, enterprise-grade multi-agent AI platform with dynamic AI provider management and Model Context Protocol (MCP) support. Built with React, Redux Observable (RxJS), and TypeScript following clean architecture principles for scalable, maintainable AI agent orchestration.

> **Latest Update (Dec 2025)**: Complete refactor to pure Redux with Redux-Observable, dynamic AI provider configuration, and enterprise-grade architecture pattern.

## 🚀 Key Features

### 🎯 Dynamic AI Provider Management (NEW!)
- **UI-Based Configuration**: Configure AI providers, endpoints, and models through intuitive UI
- **Multiple Providers**: Support for Azure OpenAI, OpenAI, Anthropic, and custom providers
- **Model Management**: Add and manage multiple models per provider
- **Active Provider Selection**: Easily switch between configured providers
- **Single API Key**: Unified `AI_PROVIDER_API_KEY` for all providers

### 🤖 Multi-Agent Architecture
- **Multiple AI Personas**: Create, manage, and switch between multiple specialized AI agents
- **Pre-built Templates**: Ready-to-use agent templates (Assistant, Code Expert, Writer, Analyst, Creative)
- **Custom Agents**: Build and configure custom agents with unique personalities and capabilities
- **Per-Agent Configuration**: Each agent can use different providers and models
- **Agent Persistence**: Agents and configurations persist across sessions via local storage

### ⚡ Advanced AI Integration
- **Streaming Responses**: Real-time streaming of AI responses with token-by-token updates
- **Tool Calling**: Full support for Azure OpenAI function calling and tool execution
- **Configurable Models**: Per-agent model configuration with fine-tuned parameters
- **Dynamic Initialization**: AI service initializes automatically based on agent configuration
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 🔌 MCP (Model Context Protocol) Support
- **HTTP Transport**: StreamableHTTPClientTransport with Bearer token authentication
- **Multiple MCP Servers**: Connect and manage multiple MCP server instances
- **Dynamic Tool Discovery**: Automatic detection and registration of available MCP tools
- **Real-time Tool Execution**: Execute MCP tools seamlessly within agent conversations
- **Server Health Monitoring**: Track connection status and health of MCP servers

### 🏗️ Enterprise-Ready Architecture
- **Pure Redux + Redux Observable**: Clean separation of concerns with reactive state management
- **Enterprise Pattern**: Action Types → Actions → Epics → Reducers → Dispatchers
- **TypeScript**: Full type safety across the entire codebase
- **Service Layer**: Clean business logic separation from UI
- **Ready for REST API**: Easy migration from localStorage to backend API
- **Scalable**: Modular architecture supporting future enhancements

## 📋 Architecture Overview

### 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ ChatInterface│  │ AgentManager │  │ AIProviderSettings   │  │
│  │              │  │              │  │                      │  │
│  │ - Messages   │  │ - CRUD Ops   │  │ - Provider Config    │  │
│  │ - Streaming  │  │ - Templates  │  │ - Model Management   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │                  │                      │
          │  dispatch(action)│                      │
          ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    REDUX STORE                          │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │    │
│  │  │ agents      │  │ aiProviders  │  │ mcpServers    │  │    │
│  │  │ - list      │  │ - providers  │  │ - connections │  │    │
│  │  │ - active    │  │ - active     │  │ - tools       │  │    │
│  │  └─────────────┘  └──────────────┘  └───────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ACTION TYPES → ACTIONS → DISPATCHERS                            │
│         ↓           ↓            ↓                                │
│  ┌──────────────────────────────────────────┐                   │
│  │           REDUX OBSERVABLE EPICS          │                   │
│  │  ┌────────────┐  ┌────────────────────┐  │                   │
│  │  │ agentEpics │  │ aiProvidersEpics   │  │                   │
│  │  │ - sendMsg  │  │ - fetch/CRUD       │  │                   │
│  │  │ - streaming│  │ - setActive        │  │                   │
│  │  └─────┬──────┘  └──────┬─────────────┘  │                   │
│  └────────┼─────────────────┼────────────────┘                   │
│           │                 │                                     │
└───────────┼─────────────────┼─────────────────────────────────────┘
            │                 │
            ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                              │
│  ┌──────────────────┐  ┌───────────────────┐  ┌──────────────┐ │
│  │ azureOpenAI      │  │ storageService    │  │ mcpManager   │ │
│  │ Service          │  │                   │  │ Service      │ │
│  │ - initialize()   │  │ - saveProvider()  │  │ - connect()  │ │
│  │ - streamMessage()│  │ - saveAgent()     │  │ - listTools()│ │
│  │ - sendMessage()  │  │ - saveMCPServer() │  │ - callTool() │ │
│  └────────┬─────────┘  └─────────┬─────────┘  └──────┬───────┘ │
└───────────┼────────────────────────┼────────────────────┼─────────┘
            │                        │                    │
            ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Azure OpenAI │  │ localStorage │  │ MCP Servers          │  │
│  │ REST API     │  │ (JSON)       │  │ (HTTP/WebSocket)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 🔄 Message Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  USER TYPES MESSAGE                                               │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │  1. User Input       │
         │  - ChatInterface     │
         │  - Validation        │
         └──────────┬───────────┘
                    │ dispatch(SEND_MESSAGE)
                    ▼
         ┌──────────────────────┐
         │  2. Redux Store      │
         │  - Action received   │
         │  - State updated     │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────────────────┐
         │  3. Redux Observable Epic         │
         │  - Intercepts SEND_MESSAGE        │
         │  - Get active agent config        │
         │  - Get AI provider config         │
         └──────────┬───────────────────────┘
                    │
                    ▼
         ┌──────────────────────────────────┐
         │  4. Initialize AI Service         │
         │  - Load provider endpoint         │
         │  - Load API key from env          │
         │  - Set deployment/model           │
         │  - Initialize Azure OpenAI client │
         └──────────┬───────────────────────┘
                    │
                    ▼
         ┌──────────────────────────────────┐
         │  5. Call AI Service               │
         │  - Inject agent system prompt     │
         │  - Prepare messages               │
         │  - Call streamMessage()           │
         └──────────┬───────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
┌────────────────┐    ┌──────────────────┐
│ 6a. Streaming  │    │ 6b. Tool Call?   │
│ - Token-by-token│    │ - Function call  │
│ - UI updates   │    │ - MCP tool exec  │
│ - Real-time    │    │ - Result to AI   │
└────────┬───────┘    └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
         ┌──────────────────────┐
         │  7. Complete          │
         │  - Final message      │
         │  - Save to history    │
         │  - Update UI          │
         └───────────────────────┘
```

### 🏢 Enterprise Redux Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    REDUX ARCHITECTURE                         │
│                                                               │
│  1. ACTION TYPES (Constants)                                 │
│     src/redux/actionTypes/                                   │
│     ├── agentsActionTypes.ts                                 │
│     ├── aiProvidersActionTypes.ts                            │
│     └── mcpServersActionTypes.ts                             │
│                                                               │
│  2. ACTIONS (Action Creators)                                │
│     src/redux/actions/                                       │
│     ├── agentsActions.ts                                     │
│     ├── aiProvidersActions.ts                                │
│     └── mcpServersActions.ts                                 │
│                                                               │
│  3. EPICS (Async Logic - RxJS)                               │
│     src/redux/epics/                                         │
│     ├── agentEpics.ts          ← Handles AI calls            │
│     ├── agentsEpics.ts         ← Handles CRUD ops            │
│     ├── aiProvidersEpics.ts    ← Provider management         │
│     └── mcpServersEpics.ts     ← MCP operations              │
│                                                               │
│  4. REDUCERS (State Updates)                                 │
│     src/redux/reducers/                                      │
│     ├── agentsReducer.ts       ← Agent state                 │
│     ├── aiProvidersReducer.ts  ← Provider state              │
│     └── mcpServersReducer.ts   ← MCP state                   │
│                                                               │
│  5. DISPATCHERS (Convenience Layer)                          │
│     src/redux/dispatchers/                                   │
│     ├── agentsDispatchers.ts                                 │
│     ├── aiProvidersDispatchers.ts                            │
│     └── mcpServersDispatchers.ts                             │
│                                                               │
│  6. STORE (Combines Everything)                              │
│     src/redux/store.ts                                       │
│     └── Configures: reducers + epics + middleware            │
└─────────────────────────────────────────────────────────────┘
```

### 📁 Project Structure

```
src/
├── components/                      # React UI Components
│   ├── AgentManager.tsx            # Agent creation and configuration
│   ├── AgentSelector.tsx           # Agent switching interface
│   ├── AIProviderSettings.tsx      # AI Provider configuration UI (NEW!)
│   ├── ChatInterface.tsx           # Main chat UI with message history
│   ├── MCPServerManager.tsx        # MCP server management UI
│   └── MessageRenderer.tsx         # Markdown message rendering
│
├── redux/                           # State Management (Enterprise Pattern)
│   ├── actionTypes/                # Action Type Constants
│   │   ├── agentsActionTypes.ts   # Agent action types
│   │   ├── aiProvidersActionTypes.ts  # Provider action types (NEW!)
│   │   └── mcpServersActionTypes.ts   # MCP action types
│   │
│   ├── actions/                    # Action Creators
│   │   ├── agentsActions.ts       # Agent actions
│   │   ├── aiProvidersActions.ts  # Provider actions (NEW!)
│   │   └── mcpServersActions.ts   # MCP actions
│   │
│   ├── epics/                      # Redux Observable Epics (Async Logic)
│   │   ├── agentEpics.ts          # Active agent operations & AI calls
│   │   ├── agentsEpics.ts         # Multi-agent CRUD operations
│   │   ├── aiProvidersEpics.ts    # Provider CRUD operations (NEW!)
│   │   └── mcpServersEpics.ts     # MCP operations
│   │
│   ├── reducers/                   # State Reducers
│   │   ├── agentsReducer.ts       # Agent list state
│   │   ├── aiProvidersReducer.ts  # Provider state (NEW!)
│   │   ├── mcpServersReducer.ts   # MCP server state
│   │   └── index.ts               # Root reducer
│   │
│   ├── dispatchers/                # Convenience Dispatcher Layer
│   │   ├── agentsDispatchers.ts   # Agent dispatchers
│   │   ├── aiProvidersDispatchers.ts  # Provider dispatchers (NEW!)
│   │   └── mcpServersDispatchers.ts   # MCP dispatchers
│   │
│   ├── slices/                     # Legacy Redux Toolkit Slices
│   │   ├── agentSlice.ts          # Active agent state
│   │   ├── agentsSlice.ts         # Multi-agent state
│   │   └── mcpServersSlice.ts     # MCP state
│   │
│   └── store.ts                    # Redux store configuration
│
├── services/                        # Business Logic Layer
│   ├── agentManagerService.ts      # Agent lifecycle management
│   ├── agentTemplates.ts           # Pre-built agent templates
│   ├── azureOpenAIService.ts       # Azure OpenAI API integration
│   ├── mcpManagerService.ts        # MCP server lifecycle
│   ├── mcpService.ts               # MCP protocol implementation
│   ├── storageService.ts           # LocalStorage abstraction (NEW!)
│   └── restApiAdapter.ts           # Future REST API adapter (NEW!)
│
├── types/                           # TypeScript Definitions
│   ├── index.ts                    # Core types
│   ├── multiAgent.ts               # Multi-agent types
│   └── aiProvider.ts               # AI Provider types (NEW!)
│
├── styles/                          # Styles
│   ├── global.css                  # Global styles
│   └── AIProviderSettings.css      # Provider UI styles (NEW!)
│
├── constants/                       # Application Constants
│   └── index.ts                    # UI config, colors, defaults
│
├── utils/                           # Utility Functions
│   └── localStorage.ts             # Storage helpers
│
├── App.tsx                          # Root Application Component
└── index.tsx                        # Application Entry Point
```

### 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.2.3 | Modern UI framework with hooks |
| **State Management** | Redux + Redux Observable | 5.0.1 + 3.0.0 | Pure Redux with reactive side effects |
| **Async Handling** | RxJS | 7.8.2 | Reactive programming for complex async flows |
| **Type Safety** | TypeScript | 5.9.3 | Full type coverage and IDE support |
| **AI Integration** | OpenAI SDK | 6.14.0 | Azure OpenAI API client |
| **Azure SDK** | @azure/openai | 2.0.0 | Azure-specific integrations |
| **Protocol** | MCP SDK | 1.25.1 | Model Context Protocol implementation |
| **Markdown** | react-markdown | 10.1.0 | Rich text rendering |
| **Code Highlight** | rehype-highlight | 7.0.2 | Syntax highlighting for code blocks |
| **HTTP Client** | Axios | 1.13.2 | HTTP requests for APIs |
| **Build Tool** | Webpack | 5.104.0 | Module bundling and dev server |
| **Transpiler** | Babel | 7.x | ES6+ to ES5 transpilation |

## 🔧 Prerequisites

- **Node.js**: 16.x or higher
- **npm**: 7.x or higher
- **AI Provider**: One of the following:
  - Azure OpenAI resource with API key
  - OpenAI API key
  - Anthropic API key
  - Custom OpenAI-compatible endpoint
- **MCP Server** (Optional): HTTP-based MCP server endpoint for tool execution

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd aipilot

# Install dependencies
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with a **single required variable**:

```env
# AI Provider API Key (REQUIRED)
# This key will be used for all configured AI providers
AI_PROVIDER_API_KEY=your-api-key-here
```

**That's it!** All other configurations (endpoints, models, deployments, MCP servers) are now managed through the UI.

### ✨ New Configuration Flow (v2.0)

**Old Way (Hardcoded in .env):**
```env
REACT_APP_AZURE_ENDPOINT=https://...
REACT_APP_AZURE_API_KEY=...
REACT_APP_DEPLOYMENT_NAME=gpt-4
REACT_APP_MCP_ENDPOINT=...
REACT_APP_MCP_BEARER_TOKEN=...
```

**New Way (UI-Based Configuration):**
1. **Single API Key**: Only `AI_PROVIDER_API_KEY` in .env
2. **Configure Providers**: Use 🔧 AI Providers UI to add endpoints and models
3. **Configure MCP**: Use 🔌 MCP Servers UI to add server connections  
4. **Configure Agents**: Use 🤖 Manage Agents UI to create agents with specific providers

### 📝 .env.example

```env
# AI Provider API Key (REQUIRED)
# This key will be used for all configured AI providers
AI_PROVIDER_API_KEY=your-api-key-here

# All other configurations are now managed via UI:
# 🔧 AI Providers - Configure AI provider endpoints and models
# 🔌 MCP Servers - Configure MCP server connections
# 🤖 Agents - Configure AI agents with specific providers and models
```

## 🚀 Running the Application

### Development Mode
```bash
npm start
# Opens at http://localhost:3000 with hot reload
```

### Production Build
```bash
npm run build
# Creates optimized build in /dist folder
```

### Development with Auto-open
```bash
npm run dev
# Starts dev server and opens browser automatically
```

## 💡 Usage Guide

### 🎯 Getting Started (5 Minutes)

#### Step 1: Configure an AI Provider

1. Start the application: `npm start`
2. Open http://localhost:3000
3. Click **🔧 AI Providers** button (top-right)
4. Click **"+ Add Provider"**
5. Fill in the form:
   ```
   Provider Name: Azure OpenAI Production
   Endpoint URL: https://your-resource.openai.azure.com
   ```
6. **Add Models**:
   - Click "Add Model"
   - Model Name: `gpt-4` (deployment name)
   - Display Name: `GPT-4`
   - Add more models as needed
7. Click **"Create Provider"**
8. Click **"Set Active"** to activate the provider

#### Step 2: Create Your First Agent

1. Click **🤖 Manage Agents** button
2. Click **"+ New Agent"**
3. Choose a template (e.g., "Code Expert") or create custom
4. Select your configured AI Provider from dropdown
5. Select a model from dropdown
6. Customize:
   - Name and icon
   - System prompt (personality)
   - Model parameters (temperature, max tokens)
7. Click **"Create Agent"**

#### Step 3: Start Chatting!

1. Select your agent from the dropdown (top-left)
2. Type a message in the input box
3. Press Enter or click Send
4. Watch the AI respond in real-time! 🎉

### 🔧 AI Provider Management

**View Providers:**
- Click 🔧 AI Providers
- See list of all configured providers
- Active provider is highlighted

**Add New Provider:**
```
1. Click "+ Add Provider"
2. Enter details:
   - Provider Name (friendly name)
   - Endpoint URL (API endpoint)
3. Add Models:
   - Model Name (deployment/model ID)
   - Display Name (UI display name)
4. Click "Create Provider"
```

**Edit Provider:**
```
1. Click "Edit" on any provider
2. Modify endpoint, add/remove models
3. Click "Update Provider"
```

**Set Active Provider:**
```
1. Click "Set Active" on desired provider
2. Provider becomes default for new agents
```

**Delete Provider:**
```
1. Click "Delete" on provider
2. Confirm deletion
Note: Cannot delete if agents are using it
```

### 🤖 Agent Management

**Create from Template:**
```
1. Click 🤖 Manage Agents
2. Click "+ New Agent"
3. Select a template:
   - 💼 Assistant: General purpose helper
   - 💻 Code Expert: Programming specialist  
   - ✍️ Writer: Content creation
   - 📊 Analyst: Data analysis
   - 🎨 Creative: Creative tasks
4. Template auto-fills settings
5. Customize as needed
6. Click "Create Agent"
```

**Create Custom Agent:**
```
1. Click 🤖 Manage Agents
2. Click "+ New Agent"
3. Scroll to "Or Create Custom Agent"
4. Fill in:
   - Name: Your agent name
   - Description: What it does
   - System Prompt: Personality/instructions
   - Icon: Emoji (⭐🤖💡 etc.)
   - AI Provider: Select configured provider
   - Model: Select model from provider
   - Temperature: 0-2 (0=focused, 2=creative)
   - Max Tokens: Response length limit
   - Advanced: Top P, Frequency Penalty, Presence Penalty
5. Click "Create Agent"
```

**Edit Agent:**
```
1. Click 🤖 Manage Agents
2. Click "Edit" on any agent
3. Modify settings
4. Click "Save Changes"
```

**Delete Agent:**
```
1. Click 🤖 Manage Agents
2. Click "Delete" on custom agent
3. Confirm deletion
Note: Built-in agents cannot be deleted
```

**Switch Agents:**
```
1. Use dropdown in top-left corner
2. Select different agent
3. Conversation history switches automatically
4. Each agent has separate history
```

### 🔌 MCP Server Management

**Add MCP Server:**
```
1. Click 🔌 MCP Servers button
2. Click "Add Server"
3. Enter:
   - Server Name: Friendly identifier
   - Endpoint URL: https://your-mcp-server.com
   - Bearer Token: Authentication token
4. Click "Add"
5. Server connects automatically
```

**View Available Tools:**
```
1. Click 🔌 MCP Servers
2. Expand any connected server
3. See list of available tools
4. Tools are auto-available to AI
```

**Disconnect Server:**
```
1. Click 🔌 MCP Servers
2. Click "Disconnect" on server
3. Tools become unavailable
```

**Using Tools in Conversation:**
```
Tools are used automatically by AI when relevant.

Example:
  User: "What's the weather in Paris?"
  AI: [Calls weather tool] → "It's 22°C and sunny in Paris"
  
The AI decides when to use tools, executes them
transparently, and integrates results into responses.
```

### 💬 Message Features

- **Markdown Support**: Full markdown formatting
  - **Bold**, *italic*, `code`, [links](url)
  - Headers, lists, blockquotes
  
- **Code Blocks**: Syntax highlighted
  ````markdown
  ```python
  def hello():
      print("Hello, World!")
  ```
  ````

- **Copy Code**: Click copy button on code blocks

- **Streaming**: Real-time token-by-token responses

- **Tool Results**: Automatically formatted and integrated

- **Error Handling**: Clear error messages with retry options

## 🏗️ System Architecture Details

### Component Responsibilities

#### UI Layer (components/)
| Component | Responsibility |
|-----------|---------------|
| `App.tsx` | Root component, layout orchestration |
| `ChatInterface.tsx` | Message display, user input, conversation flow |
| `MessageRenderer.tsx` | Markdown rendering with syntax highlighting |
| `AgentSelector.tsx` | Agent switching dropdown |
| `AgentManager.tsx` | Agent CRUD operations UI |
| `AIProviderSettings.tsx` | AI provider configuration UI |
| `MCPServerManager.tsx` | MCP server connection management UI |

#### State Layer (redux/)
| Module | Responsibility |
|--------|---------------|
| `agentsReducer.ts` | Multi-agent state (list, CRUD operations) |
| `agentSlice.ts` | Active agent state (messages, loading, errors) |
| `aiProvidersReducer.ts` | AI provider configurations state |
| `mcpServersReducer.ts` | MCP server connections state |
| `agentEpics.ts` | Async operations (AI calls, streaming, tool execution) |
| `agentsEpics.ts` | Agent CRUD operations |
| `aiProvidersEpics.ts` | Provider CRUD operations |
| `mcpServersEpics.ts` | MCP CRUD operations |
| `store.ts` | Redux store configuration with middleware |

#### Service Layer (services/)
| Service | Responsibility |
|---------|---------------|
| `azureOpenAIService.ts` | Azure OpenAI API client, streaming, tool calls |
| `mcpService.ts` | MCP protocol implementation, transport layer |
| `mcpManagerService.ts` | MCP server lifecycle, connection pooling |
| `agentManagerService.ts` | Agent lifecycle, persistence, templates |
| `agentTemplates.ts` | Pre-built agent configurations |
| `storageService.ts` | LocalStorage abstraction layer |
| `restApiAdapter.ts` | Future REST API integration adapter |

### Key Design Patterns

**1. Service Layer Pattern**
- Services encapsulate external integrations
- Clean separation between business logic and UI
- Testable and reusable across components
- Easy to swap localStorage with REST API

**2. Redux Observable Pattern**
- Epics handle async operations and side effects
- Reactive streams for complex async flows
- Built-in cancellation and error handling
- Composable and testable async logic

**3. Repository Pattern**
- Agent and MCP managers act as repositories
- Centralized data access and persistence
- Consistent CRUD operations
- Single source of truth for entities

**4. Factory Pattern**
- AgentFactory creates agents from templates
- Encapsulates agent creation logic
- Easy to extend with new templates
- Consistent agent initialization

**5. Dispatcher Pattern**
- Dispatchers provide convenience layer over actions
- Encapsulate action creation and dispatch
- Improve code reusability
- Simplify component logic

## 🔄 Detailed Flow Diagrams

### Standard Chat Flow
```
1. User types message → dispatch(SEND_MESSAGE)
2. Epic intercepts action → gets active agent
3. Epic initializes AI service with provider config
4. Service streams response from Azure OpenAI
5. Each token → dispatch(UPDATE_STREAMING_CONTENT)
6. UI updates in real-time
7. Stream complete → dispatch(SEND_MESSAGE_SUCCESS)
8. Message added to history
9. History persisted to localStorage
```

### Tool Calling Flow
```
1. User message sent to Azure OpenAI with available tools
2. AI decides to use a tool → returns function call
3. Epic detects tool call → dispatch(EXECUTE_MCP_TOOL)
4. mcpService executes tool on MCP server
5. Tool result returned
6. Result sent back to Azure OpenAI with context
7. AI generates final response using tool result
8. Final message displayed to user
```

### Multi-Agent Flow
```
1. User switches agent → dispatch(SET_ACTIVE_AGENT)
2. Reducer updates activeAgentId in state
3. UI re-renders with new agent info
4. Agent's conversation history loaded from localStorage
5. Agent's system prompt will be injected in next message
6. Messages routed to agent's configured AI provider
7. Each agent maintains separate conversation history
```

### AI Provider Initialization Flow
```
1. User sends message
2. Epic gets active agent from state
3. Epic extracts providerId from agent.modelConfig
4. Epic loads provider from aiProviders state
5. Epic validates provider is active
6. Epic gets AI_PROVIDER_API_KEY from env
7. Epic calls azureOpenAIService.initialize() with:
   - Provider endpoint
   - API key from env
   - Model/deployment name
8. Service creates Azure OpenAI client
9. Service ready to handle requests
```

## 🎨 Customization
```
1. Click "Delete" on provider
2. Confirm deletion
Note: Cannot delete if agents are using it
```

### 🤖 Agent Management

## 🏗️ System Architecture

### Component Responsibilities

#### UI Layer (components/)
| Component | Responsibility |
|-----------|---------------|
| `App.tsx` | Root component, auto-initialization, layout orchestration |
| `ChatInterface.tsx` | Message display, user input, conversation flow |
| `MessageRenderer.tsx` | Markdown rendering with syntax highlighting |
| `AgentSelector.tsx` | Agent switching dropdown |
| `AgentManager.tsx` | Agent CRUD operations UI |
| `MCPServerManager.tsx` | MCP server connection management UI |

#### State Layer (redux/)
| Module | Responsibility |
|--------|---------------|
| `agentsSlice.ts` | Multi-agent state (list, CRUD operations) |
| `agentSlice.ts` | Active agent state (messages, loading, errors) |
| `mcpServersSlice.ts` | MCP server connections state |
| `agentEpics.ts` | Async operations (API calls, streaming, tool execution) |
| `store.ts` | Redux store configuration with middleware |

#### Service Layer (services/)
| Service | Responsibility |
|---------|---------------|
| `azureOpenAIService.ts` | Azure OpenAI API client, streaming, tool calls |
| `mcpService.ts` | MCP protocol implementation, transport layer |
| `mcpManagerService.ts` | MCP server lifecycle, connection pooling |
| `agentManagerService.ts` | Agent lifecycle, persistence, templates |
| `agentTemplates.ts` | Pre-built agent configurations |

### Key Design Patterns

**1. Service Layer Pattern**
- Services encapsulate external integrations
- Clean separation between business logic and UI
- Testable and reusable across components

**2. Redux Observable Pattern**
- Epics handle async operations and side effects
- Reactive streams for complex async flows
- Cancellation and error handling built-in

**3. Repository Pattern**
- Agent and MCP managers act as repositories
- Centralized data access and persistence
- Consistent CRUD operations

**4. Factory Pattern**
- AgentFactory creates agents from templates
- Encapsulates agent creation logic
- Easy to extend with new templates

## 🔄 Message Flow Detailed

### Standard Chat Flow
```
1. User types message → dispatch(sendMessage)
2. Epic intercepts action → calls azureOpenAIService
3. Service streams response from Azure OpenAI
4. Each token → dispatch(updateStreamingContent)
5. UI updates in real-time
6. Stream complete → dispatch(sendMessageSuccess)
7. Message added to history
```

### Tool Calling Flow
```
1. User message sent to Azure OpenAI
2. AI decides to use a tool → returns tool call
3. Epic detects tool call → dispatch(executeMCPTool)
4. mcpService executes tool on MCP server
5. Tool result → sent back to Azure OpenAI
6. AI generates final response with context
7. Final message displayed to user
```

### Multi-Agent Flow
```
1. User switches agent → dispatch(setActiveAgent)
2. Epic loads agent config from agentManagerService
3. Agent's conversation history loaded
4. Agent's system prompt applied
5. Chat interface updates with agent info
6. Messages routed to agent's Azure OpenAI config
```

## 🎨 Customization

### Creating Custom Agent Templates

Edit `src/services/agentTemplates.ts`:

```typescript
export const MY_CUSTOM_TEMPLATE: AgentTemplate = {
  name: 'My Custom Agent',
  icon: '🎯',
  systemPrompt: 'You are a specialized assistant that...',
  temperature: 0.8,
  maxTokens: 2000,
  description: 'Brief description of the agent'
};

// Add to AGENT_TEMPLATES
export const AGENT_TEMPLATES = {
  // ... existing templates
  MY_CUSTOM: MY_CUSTOM_TEMPLATE,
};
```

### Customizing UI Theme

Edit `src/constants/index.ts`:

```typescript
export const COLORS = {
  BACKGROUND_PRIMARY: '#your-color',
  TEXT_PRIMARY: '#your-color',
  // ... customize all colors
};
```

### Adding New MCP Tools

MCP tools are automatically discovered from connected MCP servers. To add:
1. Implement tool on your MCP server
2. Connect server via MCP Server Manager
3. Tools become available automatically

## 🔒 Security Best Practices

### API Key Management
- ✅ **DO**: Use environment variables (.env file) for all environments
- ✅ **DO**: Keep .env file out of version control (add to .gitignore)
- ✅ **DO**: Use Azure Key Vault for production secrets
- ✅ **DO**: Rotate API keys regularly
- ❌ **DON'T**: Commit API keys to version control
- ❌ **DON'T**: Hard-code credentials in source files

### MCP Security
- Use HTTPS endpoints for MCP servers
- Implement bearer token authentication
- Validate and sanitize tool inputs
- Rate limit tool executions
- Monitor and log tool usage

### Local Storage
- Data stored in browser local storage is unencrypted
- Don't store sensitive information in agent configurations
- Consider encryption for production deployments

### CORS Configuration
Ensure your MCP server has proper CORS headers:
```
Access-Control-Allow-Origin: https://your-app-domain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🐛 Troubleshooting

### AI Provider Issues

**Problem**: "No active agent or AI provider configured"
- ✓ Configure at least one AI provider via 🔧 AI Providers
- ✓ Click "Set Active" on a provider
- ✓ Create an agent that uses that provider
- ✓ Ensure `AI_PROVIDER_API_KEY` is set in .env

**Problem**: "AI Provider not found"
- ✓ Check provider ID matches in agent configuration
- ✓ Refresh the page to reload providers from localStorage
- ✓ Re-create the provider if corrupted

**Problem**: "Azure OpenAI client not initialized"
- ✓ Verify endpoint URL format: `https://<resource>.openai.azure.com`
- ✓ Check API key is correct in .env
- ✓ Ensure model/deployment name matches Azure portal
- ✓ Verify agent has providerId set

**Problem**: "Rate limit exceeded"
- ✓ Check Azure OpenAI quota in portal
- ✓ Reduce frequency of requests
- ✓ Consider upgrading to higher tier
- ✓ Implement retry logic with exponential backoff

### MCP Connection Issues

**Problem**: "MCP server connection failed"
- ✓ Verify endpoint is accessible (use curl/Postman to test)
- ✓ Check bearer token is valid
- ✓ Ensure CORS is configured on server
- ✓ Check firewall/network restrictions
- ✓ Verify server is running and responding

**Problem**: "Tool execution timeout"
- ✓ Increase timeout in `mcpService.ts`
- ✓ Check MCP server logs for errors
- ✓ Verify tool implementation on server
- ✓ Check network latency

**Problem**: "Tools not available to AI"
- ✓ Verify MCP server is connected
- ✓ Check tool list in MCP Server Manager
- ✓ Refresh connection
- ✓ Check browser console for errors

### UI/Display Issues

**Problem**: "Messages not rendering markdown"
- ✓ Check browser console for errors
- ✓ Verify react-markdown dependencies installed
- ✓ Clear browser cache
- ✓ Try incognito/private mode

**Problem**: "Agent not switching"
- ✓ Check Redux DevTools for state changes
- ✓ Verify agent exists in local storage
- ✓ Clear local storage and recreate agents: `localStorage.clear()`
- ✓ Check browser console for errors

**Problem**: "Streaming not working"
- ✓ Verify Azure OpenAI supports streaming for your model
- ✓ Check API version compatibility
- ✓ Look for errors in browser console
- ✓ Test with non-streaming first

**Problem**: "Code blocks not highlighted"
- ✓ Verify rehype-highlight is installed
- ✓ Check language specified in code fence
- ✓ Clear browser cache
- ✓ Check browser console for errors

### Build Issues

**Problem**: "Module not found" errors
- ✓ Delete `node_modules` and run `npm install`
- ✓ Check Node.js version (16+ required): `node --version`
- ✓ Clear npm cache: `npm cache clean --force`
- ✓ Check package.json for missing dependencies

**Problem**: "TypeScript compilation errors"
- ✓ Run `npm install` to ensure @types packages installed
- ✓ Check tsconfig.json for correct settings
- ✓ Verify all imports are correct
- ✓ Update TypeScript: `npm install -D typescript@latest`

**Problem**: "Webpack build fails"
- ✓ Check webpack.config.js for syntax errors
- ✓ Verify all loaders are installed
- ✓ Clear webpack cache
- ✓ Delete `dist` folder and rebuild

### localStorage Issues

**Problem**: "Configuration not persisting"
- ✓ Check browser localStorage is enabled
- ✓ Check storage quota (clear old data)
- ✓ Try incognito mode to test
- ✓ Check browser console for quota errors

**Problem**: "Corrupted data in localStorage"
- ✓ Open browser console
- ✓ Run: `localStorage.clear()`
- ✓ Refresh page
- ✓ Reconfigure providers and agents

## 🚢 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Output in /dist folder
# - Minified JavaScript
# - Optimized CSS
# - Compressed assets
```
### Environment Variables (Production)

Set these in your hosting platform:

```env
# Required
AI_PROVIDER_API_KEY=your-production-api-key
```
## 🙏 Acknowledgments

- **Azure OpenAI Team** - Excellent API, comprehensive documentation, and continuous improvements
- **OpenAI** - Revolutionary AI models and API
- **MCP Community** - Model Context Protocol specification and reference implementations
- **React Team** - Amazing framework, hooks, and ecosystem
- **Redux Team** - Predictable state management and excellent devtools
- **RxJS Team** - Powerful reactive programming library
- **TypeScript Team** - Type safety, excellent tooling, and developer experience
- **Open Source Community** - Countless helpful libraries and tools
- **All Contributors** - Thank you for your time, code, ideas, and feedback!

## ⭐ Star this repo if you find it useful!

**AIPilot** - Navigate the AI landscape with confidence ✨

Built with ❤️ using **React** · **TypeScript** · **Redux Observable** · **Azure OpenAI**

---

© 2025 AIPilot Contributors. All rights reserved.

</div>
