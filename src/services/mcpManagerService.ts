/**
 * 🌐 MCP MANAGER SERVICE
 * 
 * 🎯 WHAT IS THIS?
 * This is the "Server Manager" - it manages connections to special helper servers!
 * Think of it like a phone book + phone manager for calling different helper services.
 * 
 * 🤔 WHAT ARE MCP SERVERS?
 * MCP Servers are like different stores that give your AI robot special tools:
 * - One server might have math tools
 * - Another might have file-reading tools
 * - Another might have drawing tools
 * 
 * 🎨 WHAT CAN IT DO?
 * - Add new server connections (like adding phone numbers)
 * - Connect/disconnect from servers (like calling/hanging up)
 * - Remember which servers you use
 * - Get lists of tools each server provides
 * - Call tools on the right server
 * 
 * 💭 WHY DO WE NEED THIS?
 * Your AI robot might need special abilities! Instead of building everything ourselves,
 * we connect to servers that already have those abilities!
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamablehttp.js';
import { MCPServer, MCPTool, MCPServerStatus } from '../types/multiAgent';
import { MCPToolCall, MCPToolResult } from '../types';

// 📦 Where we save server info (like a contacts list label)
const STORAGE_KEY = 'retain-ai-mcp-servers';

/**
 * 🏭 THE MCP MANAGER CLASS
 * This is like the main control room for all server connections!
 */
class MCPManagerService {
  // 📋 Our list of all servers (like a phone book)
  private servers: Map<string, MCPServer> = new Map();
  
  // 📞 Active phone lines to servers (one per connected server)
  private clients: Map<string, Client> = new Map();
  
  // 🔌 The actual connection objects (like phone cables)
  private transports: Map<string, StreamableHTTPClientTransport> = new Map();

  /**
   * 🎬 CONSTRUCTOR - Starting Up!
   * Runs automatically when manager is created.
   * Like opening your phone's contacts app!
   */
  constructor() {
    // 📖 Load all saved servers
    this.loadFromStorage();
  }

  // ============================================
  // 🎬 INITIALIZATION (Getting Ready!)
  // ============================================

  /**
   * 🎯 INITIALIZE - Load Saved Servers!
   * 
   * 🤔 WHAT DOES IT DO?
   * Loads all your saved server connections from storage.
   * Like opening your contacts app to see all saved phone numbers!
   * 
   * 📝 EXAMPLE:
   * "Let me check what servers we saved..."
   * "Found 3 servers: Math Server, File Server, Drawing Server!"
   */
  initialize(): void {
    // 📖 Load all servers from storage
    this.loadFromStorage();
  }

  // ============================================
  // SERVER CRUD
  // ============================================

  addServer(server: MCPServer): void {
    this.servers.set(server.id, server);
    this.saveToStorage();
  }

  getServer(id: string): MCPServer | undefined {
    return this.servers.get(id);
  }

  getAllServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  getEnabledServers(): MCPServer[] {
    return Array.from(this.servers.values()).filter(s => s.isEnabled);
  }

  updateServer(id: string, updates: Partial<MCPServer>): MCPServer | null {
    const server = this.servers.get(id);
    if (!server) return null;

    const updatedServer = { ...server, ...updates };
    this.servers.set(id, updatedServer);
    this.saveToStorage();
    return updatedServer;
  }

  deleteServer(id: string): boolean {
    // Disconnect first
    this.disconnectServer(id);
    
    const deleted = this.servers.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  toggleServer(id: string): boolean {
    const server = this.servers.get(id);
    if (!server) return false;

    // Create new server object with toggled state (immutability fix)
    const updatedServer = {
      ...server,
      isEnabled: !server.isEnabled,
      status: (!server.isEnabled ? server.status : 'disconnected') as MCPServerStatus,
    };
    
    if (!updatedServer.isEnabled) {
      // Disconnect if disabling
      this.disconnectServer(id);
    }

    this.servers.set(id, updatedServer);
    this.saveToStorage();
    return true;
  }

  // ============================================
  // CONNECTION MANAGEMENT
  // ============================================

  async connectServer(id: string): Promise<boolean> {
    const server = this.servers.get(id);
    if (!server || !server.isEnabled) return false;

    try {
      // Create new server object with connecting status (immutability fix)
      const connectingServer = {
        ...server,
        status: 'connecting' as MCPServerStatus,
      };
      this.servers.set(id, connectingServer);

      const url = new URL(server.endpoint);
      const requestInit: RequestInit = {
        headers: {
          'Authorization': `Bearer ${server.bearerToken}`,
          'Content-Type': 'application/json',
        },
      };

      const transport = new StreamableHTTPClientTransport(url, { requestInit });
      const client = new Client(
        {
          name: `retain-ai-agent-${id}`,
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      await client.connect(transport);

      this.clients.set(id, client);
      this.transports.set(id, transport);

      // List available tools
      const tools = await this.listServerTools(id);
      
      // Create new server object with updated status (immutability fix)
      const updatedServer = {
        ...connectingServer,
        tools,
        status: 'connected' as MCPServerStatus,
        lastConnected: Date.now(),
      };
      this.servers.set(id, updatedServer);
      this.saveToStorage();

      console.log(`MCP Server "${connectingServer.name}" connected successfully`);
      return true;
    } catch (error: any) {
      console.error(`Failed to connect to MCP server "${server.name}":`, error);
      
      // Create new server object with error status (immutability fix)
      const errorServer = {
        ...server,
        status: 'error' as MCPServerStatus,
      };
      this.servers.set(id, errorServer);
      this.saveToStorage();
      return false;
    }
  }

  async disconnectServer(id: string): Promise<void> {
    const client = this.clients.get(id);
    if (client) {
      try {
        await client.close();
      } catch (error) {
        console.error(`Error disconnecting server ${id}:`, error);
      }
      this.clients.delete(id);
    }

    this.transports.delete(id);

    const server = this.servers.get(id);
    if (server) {
      // Create new server object with disconnected status (immutability fix)
      const disconnectedServer = {
        ...server,
        status: 'disconnected' as MCPServerStatus,
      };
      this.servers.set(id, disconnectedServer);
    }
  }



  // ============================================
  // TOOL OPERATIONS
  // ============================================

  async listServerTools(serverId: string): Promise<MCPTool[]> {
    const client = this.clients.get(serverId);
    if (!client) return [];

    try {
      const response = await client.listTools();
      return (response.tools || []).map((tool: any) => ({
        name: tool.name,
        description: tool.description || '',
        inputSchema: tool.inputSchema || {},
        serverId,
      }));
    } catch (error) {
      console.error(`Failed to list tools from server ${serverId}:`, error);
      return [];
    }
  }

  async getAllTools(): Promise<MCPTool[]> {
    const allTools: MCPTool[] = [];
    
    for (const server of this.getEnabledServers()) {
      if (server.status === 'connected') {
        allTools.push(...server.tools);
      }
    }

    return allTools;
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    // Find which server has this tool
    let targetServerId: string | null = null;

    for (const server of this.getEnabledServers()) {
      if (server.status === 'connected' && server.tools.some(t => t.name === toolCall.name)) {
        targetServerId = server.id;
        break;
      }
    }

    if (!targetServerId) {
      return {
        toolCallId: `tool_${Date.now()}`,
        result: null,
        error: `No connected server provides tool: ${toolCall.name}`,
      };
    }

    const client = this.clients.get(targetServerId);
    if (!client) {
      return {
        toolCallId: `tool_${Date.now()}`,
        result: null,
        error: `Server ${targetServerId} not connected`,
      };
    }

    try {
      const result = await client.callTool({
        name: toolCall.name,
        arguments: toolCall.arguments,
      });

      return {
        toolCallId: `tool_${Date.now()}`,
        result: result.content,
      };
    } catch (error: any) {
      return {
        toolCallId: `tool_${Date.now()}`,
        result: null,
        error: error.message || 'Tool call failed',
      };
    }
  }

  // ============================================
  // EXPORT
  // ============================================

  exportServers(): string {
    const servers = this.getAllServers().map(server => ({
      ...server,
      // Don't export bearer tokens for security
      bearerToken: '',
      tools: [],
      status: 'disconnected' as const,
    }));
    return JSON.stringify(servers, null, 2);
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  private loadFromStorage(): MCPServer[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const servers: MCPServer[] = JSON.parse(stored);
      servers.forEach(server => {
        // Reset status on load (they're not connected yet) - create new object
        const disconnectedServer = {
          ...server,
          status: 'disconnected' as MCPServerStatus,
        };
        this.servers.set(server.id, disconnectedServer);
      });

      return servers;
    } catch (error) {
      console.error('Failed to load MCP servers from storage:', error);
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      const servers = Array.from(this.servers.values()).map(server => ({
        ...server,
        // Don't save tools (they're fetched on connect)
        tools: [],
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    } catch (error) {
      console.error('Failed to save MCP servers to storage:', error);
    }
  }


}

export default new MCPManagerService();
