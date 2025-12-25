export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  toolCallId: string;
  result: any;
  error?: string;
}

export interface AgentState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  mcpConnected: boolean;
}

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string;
}

export interface MCPConfig {
  endpoint: string;
  bearerToken: string;
}
