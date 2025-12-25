/**
 * 👥 AGENTS SLICE - Pure Redux (Backward Compatibility)
 * 
 * Legacy slice converted to pure Redux
 * Use new architecture (actions/reducers/epics/dispatchers) for new code
 */

import { Agent, MultiAgentState } from '../../types/multiAgent';

// Re-export from new architecture
export * from '../actions/agentsActions';
export { agentsReducer as default } from '../reducers/agentsReducer';

// Legacy action creators for backward compatibility
import * as actions from '../actions/agentsActions';

export const {
  fetchAgentsRequest,
  fetchAgentsSuccess,
  fetchAgentsFailure,
  createAgentRequest,
  createAgentSuccess,
  createAgentFailure,
  updateAgentRequest,
  updateAgentSuccess,
  updateAgentFailure,
  deleteAgentRequest,
  deleteAgentSuccess,
  deleteAgentFailure,
  setActiveAgent,
  clearAgentsError,
} = actions;

// Legacy exports
export const loadAgents = fetchAgentsSuccess;
export const addAgent = createAgentSuccess;
export const updateAgent = (payload: { id: string; updates: Partial<Agent> }) => 
  updateAgentSuccess(payload.id, { ...payload.updates } as Agent);
export const deleteAgent = deleteAgentSuccess;
export const setAgentsError = fetchAgentsFailure;
export const setAgentsLoading = (loading: boolean) => 
  loading ? fetchAgentsRequest() : fetchAgentsSuccess([]);
