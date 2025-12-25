/**
 * 🚀 MCP SERVERS DISPATCHERS
 * 
 * Enterprise pattern: Service layer for MCP server operations
 */

import { Dispatch } from 'redux';
import { MCPServer, MCPTool } from '../../types/multiAgent';
import * as actions from '../actions/mcpServersActions';

/**
 * 🎯 MCP SERVERS DISPATCHER CLASS
 */
export class MCPServersDispatcher {
  constructor(private dispatch: Dispatch) {}

  /**
   * 📖 FETCH ALL MCP SERVERS
   */
  fetchMCPServers(): void {
    this.dispatch(actions.fetchMCPServersRequest());
  }

  /**
   * ✨ CREATE MCP SERVER
   */
  createMCPServer(server: MCPServer): void {
    this.dispatch(actions.createMCPServerRequest(server));
  }

  /**
   * ✏️ UPDATE MCP SERVER
   */
  updateMCPServer(id: string, updates: Partial<MCPServer>): void {
    this.dispatch(actions.updateMCPServerRequest(id, updates));
  }

  /**
   * 🗑️ DELETE MCP SERVER
   */
  deleteMCPServer(id: string): void {
    this.dispatch(actions.deleteMCPServerRequest(id));
  }

  /**
   * 📡 SET SERVER STATUS
   */
  setServerStatus(id: string, status: MCPServer['status']): void {
    this.dispatch(actions.setServerStatus(id, status));
  }

  /**
   * 🔄 TOGGLE SERVER ENABLED
   */
  toggleServerEnabled(id: string): void {
    this.dispatch(actions.toggleServerEnabled(id));
  }

  /**
   * 🛠️ SET SERVER TOOLS
   */
  setServerTools(id: string, tools: MCPTool[]): void {
    this.dispatch(actions.setServerTools(id, tools));
  }

  /**
   * 🔄 REFRESH AVAILABLE TOOLS
   */
  refreshAvailableTools(): void {
    this.dispatch(actions.refreshAvailableTools());
  }

  /**
   * ❌ CLEAR ERROR
   */
  clearError(): void {
    this.dispatch(actions.clearMCPError());
  }
}

/**
 * 🎯 FUNCTIONAL API
 */
export const mcpServersDispatchers = {
  fetchMCPServers: (dispatch: Dispatch) => () => {
    dispatch(actions.fetchMCPServersRequest());
  },

  createMCPServer: (dispatch: Dispatch) => (server: MCPServer) => {
    dispatch(actions.createMCPServerRequest(server));
  },

  updateMCPServer: (dispatch: Dispatch) => (id: string, updates: Partial<MCPServer>) => {
    dispatch(actions.updateMCPServerRequest(id, updates));
  },

  deleteMCPServer: (dispatch: Dispatch) => (id: string) => {
    dispatch(actions.deleteMCPServerRequest(id));
  },

  setServerStatus: (dispatch: Dispatch) => (id: string, status: MCPServer['status']) => {
    dispatch(actions.setServerStatus(id, status));
  },

  toggleServerEnabled: (dispatch: Dispatch) => (id: string) => {
    dispatch(actions.toggleServerEnabled(id));
  },

  setServerTools: (dispatch: Dispatch) => (id: string, tools: MCPTool[]) => {
    dispatch(actions.setServerTools(id, tools));
  },

  refreshAvailableTools: (dispatch: Dispatch) => () => {
    dispatch(actions.refreshAvailableTools());
  },

  clearError: (dispatch: Dispatch) => () => {
    dispatch(actions.clearMCPError());
  },
};
