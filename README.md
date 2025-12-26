# 🚁 AIPilot

A multi-agent AI chat platform with dynamic provider management and Model Context Protocol (MCP) support.

## What It Does

✅ **Multi-Agent Chat** - Create and manage multiple AI agents with custom personalities and prompts  
✅ **Dynamic AI Providers** - Support for Azure OpenAI, OpenAI, and Anthropic  
✅ **MCP Server Integration** - Connect external tools and data sources via Model Context Protocol  
✅ **Agent Templates** - Pre-built agents for development, code review, debugging, and more  
✅ **Persistent Configuration** - All settings saved to browser localStorage  
✅ **Real-time Chat** - Streaming responses with markdown rendering and syntax highlighting

## What It Can't Do

❌ No file upload support  
❌ No image generation  
❌ No voice/audio processing  
❌ No backend server (runs entirely in browser)  
❌ No user authentication

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AI-Pilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy the example env file
   copy .env.example .env
   
   # Edit .env and add your API key
   AI_PROVIDER_API_KEY=your_api_key_here
   ```

## Configuration

### AI Providers
- Click **🔧 AI Providers** button in the UI
- Add Azure OpenAI, OpenAI, or Anthropic endpoints
- Configure models and API keys
- Set default provider

### Agents
- Click **🤖 Manage Agents** button
- Create custom agents or use templates
- Configure system prompts, model settings, and MCP servers
- Agents are automatically saved

### MCP Servers
- Click **🔌 MCP Servers** button
- Add MCP server configurations
- Assign servers to specific agents

## Usage

**Start development server:**
```bash
npm start
# or
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Access the app:**
Open http://localhost:8080 in your browser

---

Built with React · TypeScript · Redux Observable · Azure OpenAI
