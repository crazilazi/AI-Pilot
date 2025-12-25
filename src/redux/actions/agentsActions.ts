/**
 * 🎬 AGENTS ACTION CREATORS
 * 
 * Enterprise pattern: Action creators are pure functions that return action objects
 * These are the only way to create actions in the application
 */

import { Agent } from '../../types/multiAgent';
import * as types from '../actionTypes/agentsActionTypes';

// ============================================
// 📖 FETCH AGENTS ACTIONS
// ============================================

export const fetchAgentsRequest = () => ({
  type: types.FETCH_AGENTS_REQUEST as typeof types.FETCH_AGENTS_REQUEST,
});

export const fetchAgentsSuccess = (agents: Agent[]) => ({
  type: types.FETCH_AGENTS_SUCCESS as typeof types.FETCH_AGENTS_SUCCESS,
  payload: agents,
});

export const fetchAgentsFailure = (error: string) => ({
  type: types.FETCH_AGENTS_FAILURE as typeof types.FETCH_AGENTS_FAILURE,
  payload: error,
});

// ============================================
// ✨ CREATE AGENT ACTIONS
// ============================================

export const createAgentRequest = (agent: Agent) => ({
  type: types.CREATE_AGENT_REQUEST as typeof types.CREATE_AGENT_REQUEST,
  payload: agent,
});

export const createAgentSuccess = (agent: Agent) => ({
  type: types.CREATE_AGENT_SUCCESS as typeof types.CREATE_AGENT_SUCCESS,
  payload: agent,
});

export const createAgentFailure = (error: string) => ({
  type: types.CREATE_AGENT_FAILURE as typeof types.CREATE_AGENT_FAILURE,
  payload: error,
});

// ============================================
// ✏️ UPDATE AGENT ACTIONS
// ============================================

export const updateAgentRequest = (id: string, updates: Partial<Agent>) => ({
  type: types.UPDATE_AGENT_REQUEST as typeof types.UPDATE_AGENT_REQUEST,
  payload: { id, updates },
});

export const updateAgentSuccess = (id: string, agent: Agent) => ({
  type: types.UPDATE_AGENT_SUCCESS as typeof types.UPDATE_AGENT_SUCCESS,
  payload: { id, agent },
});

export const updateAgentFailure = (error: string) => ({
  type: types.UPDATE_AGENT_FAILURE as typeof types.UPDATE_AGENT_FAILURE,
  payload: error,
});

// ============================================
// 🗑️ DELETE AGENT ACTIONS
// ============================================

export const deleteAgentRequest = (id: string) => ({
  type: types.DELETE_AGENT_REQUEST as typeof types.DELETE_AGENT_REQUEST,
  payload: id,
});

export const deleteAgentSuccess = (id: string) => ({
  type: types.DELETE_AGENT_SUCCESS as typeof types.DELETE_AGENT_SUCCESS,
  payload: id,
});

export const deleteAgentFailure = (error: string) => ({
  type: types.DELETE_AGENT_FAILURE as typeof types.DELETE_AGENT_FAILURE,
  payload: error,
});

// ============================================
// 🎯 OTHER ACTIONS
// ============================================

export const setActiveAgent = (id: string) => ({
  type: types.SET_ACTIVE_AGENT as typeof types.SET_ACTIVE_AGENT,
  payload: id,
});

export const clearAgentsError = () => ({
  type: types.CLEAR_AGENTS_ERROR as typeof types.CLEAR_AGENTS_ERROR,
});

// ============================================
// 🎯 ACTION TYPES (for TypeScript)
// ============================================

export type AgentsAction =
  | ReturnType<typeof fetchAgentsRequest>
  | ReturnType<typeof fetchAgentsSuccess>
  | ReturnType<typeof fetchAgentsFailure>
  | ReturnType<typeof createAgentRequest>
  | ReturnType<typeof createAgentSuccess>
  | ReturnType<typeof createAgentFailure>
  | ReturnType<typeof updateAgentRequest>
  | ReturnType<typeof updateAgentSuccess>
  | ReturnType<typeof updateAgentFailure>
  | ReturnType<typeof deleteAgentRequest>
  | ReturnType<typeof deleteAgentSuccess>
  | ReturnType<typeof deleteAgentFailure>
  | ReturnType<typeof setActiveAgent>
  | ReturnType<typeof clearAgentsError>;
