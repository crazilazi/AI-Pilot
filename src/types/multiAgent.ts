// Extended types for multi-agent architecture

import { Message, AzureOpenAIConfig, MCPConfig } from './index';

// ============================================
// AGENT TYPES
// ============================================

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon?: string;
  color?: string;
  modelConfig: ModelConfig;
  mcpServers: string[]; // Array of MCP server IDs
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
  isBuiltIn: boolean; // Cannot be deleted if true
}

export interface ModelConfig {
  providerId: string;  // ID of the AI provider from aiProviders state
  provider: string;    // Display name of provider
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export type AIProvider = 'azure-openai' | 'openai' | 'anthropic';

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
  color: string;
  recommendedModel: string;
  category: 'development' | 'review' | 'debug' | 'general' | 'custom';
}

// ============================================
// MCP SERVER TYPES
// ============================================

export interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  bearerToken: string;
  isEnabled: boolean;
  status: MCPServerStatus;
  lastConnected?: number;
  tools: MCPTool[];
  metadata?: {
    description?: string;
    version?: string;
    author?: string;
  };
}

export type MCPServerStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  serverId: string; // Which server provides this tool
}

// ============================================
// CONVERSATION TYPES
// ============================================

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  tokenUsage: TokenUsage;
  cost?: number;
  tags?: string[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface UIState {
  activeAgentId: string | null;
  activeConversationId: string | null;
  showAgentManager: boolean;
  showMCPManager: boolean;
  showSettings: boolean;
  showCommandPalette: boolean;
  theme: 'light' | 'dark' | 'system';
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface AppSettings {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  shortcuts: KeyboardShortcuts;
  privacy: PrivacySettings;
}

export interface GeneralSettings {
  autoSave: boolean;
  maxHistoryItems: number;
  defaultAgent: string;
  showTokenUsage: boolean;
  showCostEstimate: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  fontFamily: string;
  compactMode: boolean;
}

export interface KeyboardShortcuts {
  commandPalette: string;
  newChat: string;
  switchAgent: string;
  clearChat: string;
}

export interface PrivacySettings {
  saveHistory: boolean;
  shareAnalytics: boolean;
}

// ============================================
// EXTENDED STATE TYPES
// ============================================

export interface MultiAgentState {
  agents: Record<string, Agent>;
  activeAgentId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface MCPState {
  servers: Record<string, MCPServer>;
  availableTools: MCPTool[];
  isLoading: boolean;
  error: string | null;
}

export interface ConversationState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}
