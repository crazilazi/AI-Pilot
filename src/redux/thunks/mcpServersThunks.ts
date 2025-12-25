/**
 * 🌐 MCP SERVERS THUNKS - Async Actions for MCP Server CRUD
 * 
 * 🤔 WHAT ARE THUNKS?
 * Thunks handle async operations for MCP server management.
 * They interact with storage and dispatch appropriate Redux actions.
 * 
 * 🎨 HOW IT WORKS:
 * Component → Dispatch Thunk → Call Storage → Dispatch Success/Error Action
 * 
 * 📝 EXAMPLE FLOW:
 * 1. User clicks "Add MCP Server"
 * 2. Component calls: dispatch(createMCPServerThunk(newServer))
 * 3. Thunk saves to storage
 * 4. If success: dispatch(addMCPServer(newServer))
 * 5. If error: dispatch(setMCPServersError(errorMessage))
 * 
 * 🔄 FUTURE MIGRATION:
 * When moving to REST API, only this file needs changes!
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { MCPServer } from '../../types/multiAgent';
import { mcpServersStorage } from '../../services/storageService';

/**
 * 📖 FETCH ALL MCP SERVERS
 * Load all MCP servers from storage when app starts
 */
export const fetchMCPServersThunk = createAsyncThunk(
  'mcpServers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const servers = await mcpServersStorage.getAll();
      return servers;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch MCP servers');
    }
  }
);

/**
 * ✨ CREATE MCP SERVER
 * Add a new MCP server to storage
 */
export const createMCPServerThunk = createAsyncThunk(
  'mcpServers/create',
  async (server: MCPServer, { rejectWithValue }) => {
    try {
      const createdServer = await mcpServersStorage.create(server);
      return createdServer;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create MCP server');
    }
  }
);

/**
 * ✏️ UPDATE MCP SERVER
 * Update an existing MCP server in storage
 */
export const updateMCPServerThunk = createAsyncThunk(
  'mcpServers/update',
  async ({ id, updates }: { id: string; updates: Partial<MCPServer> }, { rejectWithValue }) => {
    try {
      const updatedServer = await mcpServersStorage.update(id, updates);
      return { id, updates: updatedServer };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update MCP server');
    }
  }
);

/**
 * 🗑️ DELETE MCP SERVER
 * Remove an MCP server from storage
 */
export const deleteMCPServerThunk = createAsyncThunk(
  'mcpServers/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await mcpServersStorage.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete MCP server');
    }
  }
);
