/**
 * 📘 AGENTS REDUCER
 * 
 * Enterprise pattern: Pure reducer function that handles state updates
 * Separated from actions and epics for clean architecture
 */

import { Agent, MultiAgentState } from '../../types/multiAgent';
import { AgentsAction } from '../actions/agentsActions';
import * as types from '../actionTypes/agentsActionTypes';

// Initial state
const initialState: MultiAgentState = {
  agents: {},
  activeAgentId: null,
  isLoading: false,
  error: null,
};

/**
 * 🎯 AGENTS REDUCER
 * 
 * Pure function that takes current state and action, returns new state
 * Never mutates state - always returns new objects
 */
export const agentsReducer = (
  state: MultiAgentState = initialState,
  action: AgentsAction
): MultiAgentState => {
  switch (action.type) {
    // ============================================
    // 📖 FETCH AGENTS
    // ============================================
    case types.FETCH_AGENTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.FETCH_AGENTS_SUCCESS: {
      const agents: Record<string, Agent> = {};
      let activeAgentId = state.activeAgentId;

      action.payload.forEach(agent => {
        agents[agent.id] = agent;
        if (agent.isActive) {
          activeAgentId = agent.id;
        }
      });

      return {
        ...state,
        agents,
        activeAgentId,
        isLoading: false,
        error: null,
      };
    }

    case types.FETCH_AGENTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // ✨ CREATE AGENT
    // ============================================
    case types.CREATE_AGENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.CREATE_AGENT_SUCCESS:
      return {
        ...state,
        agents: {
          ...state.agents,
          [action.payload.id]: action.payload,
        },
        isLoading: false,
        error: null,
      };

    case types.CREATE_AGENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // ✏️ UPDATE AGENT
    // ============================================
    case types.UPDATE_AGENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.UPDATE_AGENT_SUCCESS: {
      const { id, agent } = action.payload;
      return {
        ...state,
        agents: {
          ...state.agents,
          [id]: agent,
        },
        isLoading: false,
        error: null,
      };
    }

    case types.UPDATE_AGENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // 🗑️ DELETE AGENT
    // ============================================
    case types.DELETE_AGENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.DELETE_AGENT_SUCCESS: {
      const { [action.payload]: deleted, ...remainingAgents } = state.agents;
      let newActiveAgentId = state.activeAgentId;

      // If deleted agent was active, activate another one
      if (state.activeAgentId === action.payload) {
        const remaining = Object.values(remainingAgents);
        newActiveAgentId = remaining.length > 0 ? remaining[0].id : null;
        
        if (newActiveAgentId) {
          remainingAgents[newActiveAgentId] = {
            ...remainingAgents[newActiveAgentId],
            isActive: true,
          };
        }
      }

      return {
        ...state,
        agents: remainingAgents,
        activeAgentId: newActiveAgentId,
        isLoading: false,
        error: null,
      };
    }

    case types.DELETE_AGENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // 🎯 SET ACTIVE AGENT
    // ============================================
    case types.SET_ACTIVE_AGENT: {
      const targetAgent = state.agents[action.payload];
      if (!targetAgent) {
        return {
          ...state,
          error: 'Agent not found',
        };
      }

      // Deactivate all agents
      const updatedAgents: Record<string, Agent> = {};
      Object.keys(state.agents).forEach(id => {
        updatedAgents[id] = {
          ...state.agents[id],
          isActive: id === action.payload,
        };
      });

      return {
        ...state,
        agents: updatedAgents,
        activeAgentId: action.payload,
        error: null,
      };
    }

    // ============================================
    // ❌ ERROR HANDLING
    // ============================================
    case types.CLEAR_AGENTS_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
