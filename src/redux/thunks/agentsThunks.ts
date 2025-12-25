/**
 * 🎯 AGENTS THUNKS - Async Actions for Agent CRUD
 * 
 * 🤔 WHAT ARE THUNKS?
 * Thunks are special Redux actions that can do async work (like saving to storage).
 * Regular actions are instant, but thunks can wait for things to finish!
 * 
 * 🎨 HOW IT WORKS:
 * Component → Dispatch Thunk → Call Storage → Dispatch Success/Error Action
 * 
 * 📝 EXAMPLE FLOW:
 * 1. User clicks "Create Agent"
 * 2. Component calls: dispatch(createAgentThunk(newAgent))
 * 3. Thunk saves to storage
 * 4. If success: dispatch(addAgent(newAgent))
 * 5. If error: dispatch(setAgentsError(errorMessage))
 * 
 * 🔄 FUTURE MIGRATION:
 * When moving to REST API, only this file needs changes!
 * Components and Redux slices stay the same.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { Agent } from '../../types/multiAgent';
import { agentsStorage } from '../../services/storageService';

/**
 * 📖 FETCH ALL AGENTS
 * Load all agents from storage when app starts
 */
export const fetchAgentsThunk = createAsyncThunk(
  'agents/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const agents = await agentsStorage.getAll();
      return agents;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch agents');
    }
  }
);

/**
 * ✨ CREATE AGENT
 * Add a new agent to storage
 */
export const createAgentThunk = createAsyncThunk(
  'agents/create',
  async (agent: Agent, { rejectWithValue }) => {
    try {
      const createdAgent = await agentsStorage.create(agent);
      return createdAgent;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create agent');
    }
  }
);

/**
 * ✏️ UPDATE AGENT
 * Update an existing agent in storage
 */
export const updateAgentThunk = createAsyncThunk(
  'agents/update',
  async ({ id, updates }: { id: string; updates: Partial<Agent> }, { rejectWithValue }) => {
    try {
      const updatedAgent = await agentsStorage.update(id, updates);
      return { id, updates: updatedAgent };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update agent');
    }
  }
);

/**
 * 🗑️ DELETE AGENT
 * Remove an agent from storage
 */
export const deleteAgentThunk = createAsyncThunk(
  'agents/delete',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      // Check if agent is built-in (can't delete those)
      const state = getState() as any;
      const agent = state.agents.agents[id];
      
      if (agent?.isBuiltIn) {
        return rejectWithValue('Cannot delete built-in agents');
      }

      await agentsStorage.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete agent');
    }
  }
);
