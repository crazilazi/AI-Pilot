/**
 * 🎬 MCP SERVERS ACTION CREATORS
 * 
 * Enterprise pattern: Action creators for MCP server management
 */

import { MCPServer, MCPTool } from '../../types/multiAgent';
import * as types from '../actionTypes/mcpServersActionTypes';

// ============================================
// 📖 FETCH MCP SERVERS ACTIONS
// ============================================

export const fetchMCPServersRequest = () => ({
  type: types.FETCH_MCP_SERVERS_REQUEST as typeof types.FETCH_MCP_SERVERS_REQUEST,
});

export const fetchMCPServersSuccess = (servers: MCPServer[]) => ({
  type: types.FETCH_MCP_SERVERS_SUCCESS as typeof types.FETCH_MCP_SERVERS_SUCCESS,
  payload: servers,
});

export const fetchMCPServersFailure = (error: string) => ({
  type: types.FETCH_MCP_SERVERS_FAILURE as typeof types.FETCH_MCP_SERVERS_FAILURE,
  payload: error,
});

// ============================================
// ✨ CREATE MCP SERVER ACTIONS
// ============================================

export const createMCPServerRequest = (server: MCPServer) => ({
  type: types.CREATE_MCP_SERVER_REQUEST as typeof types.CREATE_MCP_SERVER_REQUEST,
  payload: server,
});

export const createMCPServerSuccess = (server: MCPServer) => ({
  type: types.CREATE_MCP_SERVER_SUCCESS as typeof types.CREATE_MCP_SERVER_SUCCESS,
  payload: server,
});

export const createMCPServerFailure = (error: string) => ({
  type: types.CREATE_MCP_SERVER_FAILURE as typeof types.CREATE_MCP_SERVER_FAILURE,
  payload: error,
});

// ============================================
// ✏️ UPDATE MCP SERVER ACTIONS
// ============================================

export const updateMCPServerRequest = (id: string, updates: Partial<MCPServer>) => ({
  type: types.UPDATE_MCP_SERVER_REQUEST as typeof types.UPDATE_MCP_SERVER_REQUEST,
  payload: { id, updates },
});

export const updateMCPServerSuccess = (id: string, server: MCPServer) => ({
  type: types.UPDATE_MCP_SERVER_SUCCESS as typeof types.UPDATE_MCP_SERVER_SUCCESS,
  payload: { id, server },
});

export const updateMCPServerFailure = (error: string) => ({
  type: types.UPDATE_MCP_SERVER_FAILURE as typeof types.UPDATE_MCP_SERVER_FAILURE,
  payload: error,
});

// ============================================
// 🗑️ DELETE MCP SERVER ACTIONS
// ============================================

export const deleteMCPServerRequest = (id: string) => ({
  type: types.DELETE_MCP_SERVER_REQUEST as typeof types.DELETE_MCP_SERVER_REQUEST,
  payload: id,
});

export const deleteMCPServerSuccess = (id: string) => ({
  type: types.DELETE_MCP_SERVER_SUCCESS as typeof types.DELETE_MCP_SERVER_SUCCESS,
  payload: id,
});

export const deleteMCPServerFailure = (error: string) => ({
  type: types.DELETE_MCP_SERVER_FAILURE as typeof types.DELETE_MCP_SERVER_FAILURE,
  payload: error,
});

// ============================================
// 🎯 OTHER ACTIONS
// ============================================

export const setServerStatus = (id: string, status: MCPServer['status']) => ({
  type: types.SET_SERVER_STATUS as typeof types.SET_SERVER_STATUS,
  payload: { id, status },
});

export const toggleServerEnabled = (id: string) => ({
  type: types.TOGGLE_SERVER_ENABLED as typeof types.TOGGLE_SERVER_ENABLED,
  payload: id,
});

export const setServerTools = (id: string, tools: MCPTool[]) => ({
  type: types.SET_SERVER_TOOLS as typeof types.SET_SERVER_TOOLS,
  payload: { id, tools },
});

export const refreshAvailableTools = () => ({
  type: types.REFRESH_AVAILABLE_TOOLS as typeof types.REFRESH_AVAILABLE_TOOLS,
});

export const clearMCPError = () => ({
  type: types.CLEAR_MCP_ERROR as typeof types.CLEAR_MCP_ERROR,
});

// ============================================
// 🎯 ACTION TYPES (for TypeScript)
// ============================================

export type MCPServersAction =
  | ReturnType<typeof fetchMCPServersRequest>
  | ReturnType<typeof fetchMCPServersSuccess>
  | ReturnType<typeof fetchMCPServersFailure>
  | ReturnType<typeof createMCPServerRequest>
  | ReturnType<typeof createMCPServerSuccess>
  | ReturnType<typeof createMCPServerFailure>
  | ReturnType<typeof updateMCPServerRequest>
  | ReturnType<typeof updateMCPServerSuccess>
  | ReturnType<typeof updateMCPServerFailure>
  | ReturnType<typeof deleteMCPServerRequest>
  | ReturnType<typeof deleteMCPServerSuccess>
  | ReturnType<typeof deleteMCPServerFailure>
  | ReturnType<typeof setServerStatus>
  | ReturnType<typeof toggleServerEnabled>
  | ReturnType<typeof setServerTools>
  | ReturnType<typeof refreshAvailableTools>
  | ReturnType<typeof clearMCPError>;
