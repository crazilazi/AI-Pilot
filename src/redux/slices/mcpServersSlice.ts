/**
 * 🌐 MCP SERVERS SLICE - Pure Redux (Backward Compatibility)
 * 
 * Legacy slice converted to pure Redux
 * Use new architecture (actions/reducers/epics/dispatchers) for new code
 */

import { MCPServer, MCPTool } from '../../types/multiAgent';

// Re-export from new architecture
export * from '../actions/mcpServersActions';
export { mcpServersReducer as default } from '../reducers/mcpServersReducer';

// Legacy action creators for backward compatibility
import * as actions from '../actions/mcpServersActions';

export const {
  fetchMCPServersRequest,
  fetchMCPServersSuccess,
  fetchMCPServersFailure,
  createMCPServerRequest,
  createMCPServerSuccess,
  createMCPServerFailure,
  updateMCPServerRequest,
  updateMCPServerSuccess,
  updateMCPServerFailure,
  deleteMCPServerRequest,
  deleteMCPServerSuccess,
  deleteMCPServerFailure,
  setServerStatus,
  toggleServerEnabled,
  setServerTools,
  refreshAvailableTools,
  clearMCPError,
} = actions;

// Legacy exports
export const loadMCPServers = fetchMCPServersSuccess;
export const addMCPServer = createMCPServerSuccess;
export const updateMCPServer = (payload: { id: string; updates: Partial<MCPServer> }) =>
  updateMCPServerSuccess(payload.id, { ...payload.updates } as MCPServer);
export const deleteMCPServer = deleteMCPServerSuccess;
export const setMCPError = fetchMCPServersFailure;
export const setMCPLoading = (loading: boolean) =>
  loading ? fetchMCPServersRequest() : fetchMCPServersSuccess([]);
