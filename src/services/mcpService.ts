import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamablehttp.js';
import { MCPConfig, MCPToolCall, MCPToolResult } from '../types';

class MCPService {
  private client: Client | null = null;
  private transport: StreamableHTTPClientTransport | null = null;
  private config: MCPConfig | null = null;

  async initialize(config: MCPConfig): Promise<void> {
    this.config = config;
    
    try {
      // StreamableHTTPClientTransport expects url as a URL object
      const url = new URL(config.endpoint);
      
      // Pass headers through requestInit, not directly
      const requestInit: RequestInit = {
        headers: {
          'Authorization': `Bearer ${config.bearerToken}`,
          'Content-Type': 'application/json',
        },
      };
      
      this.transport = new StreamableHTTPClientTransport(
        url,
        { requestInit }
      );

      this.client = new Client(
        {
          name: 'azure-openai-agent',
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );

      await this.client.connect(this.transport);
      console.log('MCP Client connected successfully to:', url.toString());
    } catch (error: any) {
      console.error('MCP initialization failed:', error);
      throw new Error(`Failed to initialize MCP: ${error.message}`);
    }
  }

  async listTools(): Promise<any[]> {
    if (!this.client) {
      throw new Error('MCP client not initialized');
    }
    
    const response = await this.client.listTools();
    return response.tools || [];
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    if (!this.client) {
      throw new Error('MCP client not initialized');
    }

    try {
      const result = await this.client.callTool({
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

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
    }
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}

export default new MCPService();
