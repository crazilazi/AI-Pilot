/**
 * 🚀 AGENTS DISPATCHERS
 * 
 * Enterprise pattern: Service layer for components
 * These functions encapsulate dispatch logic for cleaner component code
 */

import { Dispatch } from 'redux';
import { Agent } from '../../types/multiAgent';
import * as actions from '../actions/agentsActions';

/**
 * 🎯 AGENTS DISPATCHER CLASS
 * 
 * Provides clean API for components to dispatch actions
 * Usage: const agentsDispatcher = new AgentsDispatcher(dispatch);
 */
export class AgentsDispatcher {
  constructor(private dispatch: Dispatch) {}

  /**
   * 📖 FETCH ALL AGENTS
   * 
   * Load all agents from storage
   * 
   * @example
   * agentsDispatcher.fetchAgents();
   */
  fetchAgents(): void {
    this.dispatch(actions.fetchAgentsRequest());
  }

  /**
   * ✨ CREATE AGENT
   * 
   * Create a new agent
   * 
   * @param agent - Agent data to create
   * 
   * @example
   * agentsDispatcher.createAgent({
   *   id: 'agent-1',
   *   name: 'Helper Bot',
   *   // ...
   * });
   */
  createAgent(agent: Agent): void {
    this.dispatch(actions.createAgentRequest(agent));
  }

  /**
   * ✏️ UPDATE AGENT
   * 
   * Update an existing agent
   * 
   * @param id - Agent ID
   * @param updates - Partial agent data to update
   * 
   * @example
   * agentsDispatcher.updateAgent('agent-1', {
   *   name: 'Updated Name'
   * });
   */
  updateAgent(id: string, updates: Partial<Agent>): void {
    this.dispatch(actions.updateAgentRequest(id, updates));
  }

  /**
   * 🗑️ DELETE AGENT
   * 
   * Delete an agent
   * 
   * @param id - Agent ID to delete
   * 
   * @example
   * agentsDispatcher.deleteAgent('agent-1');
   */
  deleteAgent(id: string): void {
    this.dispatch(actions.deleteAgentRequest(id));
  }

  /**
   * 🎯 SET ACTIVE AGENT
   * 
   * Set which agent is currently active
   * 
   * @param id - Agent ID to activate
   * 
   * @example
   * agentsDispatcher.setActiveAgent('agent-1');
   */
  setActiveAgent(id: string): void {
    this.dispatch(actions.setActiveAgent(id));
  }

  /**
   * ❌ CLEAR ERROR
   * 
   * Clear error message
   * 
   * @example
   * agentsDispatcher.clearError();
   */
  clearError(): void {
    this.dispatch(actions.clearAgentsError());
  }
}

/**
 * 🎯 FUNCTIONAL API (Alternative to class)
 * 
 * Use if you prefer functional style
 */
export const agentsDispatchers = {
  fetchAgents: (dispatch: Dispatch) => () => {
    dispatch(actions.fetchAgentsRequest());
  },

  createAgent: (dispatch: Dispatch) => (agent: Agent) => {
    dispatch(actions.createAgentRequest(agent));
  },

  updateAgent: (dispatch: Dispatch) => (id: string, updates: Partial<Agent>) => {
    dispatch(actions.updateAgentRequest(id, updates));
  },

  deleteAgent: (dispatch: Dispatch) => (id: string) => {
    dispatch(actions.deleteAgentRequest(id));
  },

  setActiveAgent: (dispatch: Dispatch) => (id: string) => {
    dispatch(actions.setActiveAgent(id));
  },

  clearError: (dispatch: Dispatch) => () => {
    dispatch(actions.clearAgentsError());
  },
};
