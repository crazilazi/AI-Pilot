/**
 * 📘 MCP SERVERS REDUCER
 * 
 * Enterprise pattern: Pure reducer function for MCP servers
 */

import { MCPServer, MCPState } from '../../types/multiAgent';
import { MCPServersAction } from '../actions/mcpServersActions';
import * as types from '../actionTypes/mcpServersActionTypes';

// Initial state
const initialState: MCPState = {
  servers: {},
  availableTools: [],
  isLoading: false,
  error: null,
};

/**
 * 🎯 MCP SERVERS REDUCER
 */
export const mcpServersReducer = (
  state: MCPState = initialState,
  action: MCPServersAction
): MCPState => {
  switch (action.type) {
    // ============================================
    // 📖 FETCH MCP SERVERS
    // ============================================
    case types.FETCH_MCP_SERVERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.FETCH_MCP_SERVERS_SUCCESS: {
      const servers: Record<string, MCPServer> = {};
      action.payload.forEach(server => {
        servers[server.id] = server;
      });

      // Calculate available tools
      const availableTools = Object.values(servers)
        .filter(s => s.isEnabled && s.status === 'connected')
        .flatMap(s => s.tools);

      return {
        ...state,
        servers,
        availableTools,
        isLoading: false,
        error: null,
      };
    }

    case types.FETCH_MCP_SERVERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // ✨ CREATE MCP SERVER
    // ============================================
    case types.CREATE_MCP_SERVER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.CREATE_MCP_SERVER_SUCCESS:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.id]: action.payload,
        },
        isLoading: false,
        error: null,
      };

    case types.CREATE_MCP_SERVER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // ✏️ UPDATE MCP SERVER
    // ============================================
    case types.UPDATE_MCP_SERVER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.UPDATE_MCP_SERVER_SUCCESS: {
      const { id, server } = action.payload;
      return {
        ...state,
        servers: {
          ...state.servers,
          [id]: server,
        },
        isLoading: false,
        error: null,
      };
    }

    case types.UPDATE_MCP_SERVER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // 🗑️ DELETE MCP SERVER
    // ============================================
    case types.DELETE_MCP_SERVER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.DELETE_MCP_SERVER_SUCCESS: {
      const { [action.payload]: deleted, ...remainingServers } = state.servers;

      // Recalculate available tools
      const availableTools = Object.values(remainingServers)
        .filter(s => s.isEnabled && s.status === 'connected')
        .flatMap(s => s.tools);

      return {
        ...state,
        servers: remainingServers,
        availableTools,
        isLoading: false,
        error: null,
      };
    }

    case types.DELETE_MCP_SERVER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // 🎯 SERVER STATUS & TOOLS
    // ============================================
    case types.SET_SERVER_STATUS: {
      const { id, status } = action.payload;
      const server = state.servers[id];
      if (!server) return state;

      return {
        ...state,
        servers: {
          ...state.servers,
          [id]: { ...server, status },
        },
      };
    }

    case types.TOGGLE_SERVER_ENABLED: {
      const server = state.servers[action.payload];
      if (!server) return state;

      const updatedServers = {
        ...state.servers,
        [action.payload]: {
          ...server,
          isEnabled: !server.isEnabled,
        },
      };

      // Recalculate available tools
      const availableTools = Object.values(updatedServers)
        .filter(s => s.isEnabled && s.status === 'connected')
        .flatMap(s => s.tools);

      return {
        ...state,
        servers: updatedServers,
        availableTools,
      };
    }

    case types.SET_SERVER_TOOLS: {
      const { id, tools } = action.payload;
      const server = state.servers[id];
      if (!server) return state;

      const updatedServers = {
        ...state.servers,
        [id]: { ...server, tools },
      };

      // Recalculate available tools
      const availableTools = Object.values(updatedServers)
        .filter(s => s.isEnabled && s.status === 'connected')
        .flatMap(s => s.tools);

      return {
        ...state,
        servers: updatedServers,
        availableTools,
      };
    }

    case types.REFRESH_AVAILABLE_TOOLS: {
      const availableTools = Object.values(state.servers)
        .filter(s => s.isEnabled && s.status === 'connected')
        .flatMap(s => s.tools);

      return {
        ...state,
        availableTools,
      };
    }

    // ============================================
    // ❌ ERROR HANDLING
    // ============================================
    case types.CLEAR_MCP_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
