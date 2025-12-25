/**
 * 🏷️ AGENTS ACTION TYPES
 * 
 * Enterprise pattern: Define all action types as constants
 * This prevents typos and enables type safety
 */

// 📖 FETCH AGENTS (Load all agents)
export const FETCH_AGENTS_REQUEST = 'agents/FETCH_AGENTS_REQUEST';
export const FETCH_AGENTS_SUCCESS = 'agents/FETCH_AGENTS_SUCCESS';
export const FETCH_AGENTS_FAILURE = 'agents/FETCH_AGENTS_FAILURE';

// ✨ CREATE AGENT
export const CREATE_AGENT_REQUEST = 'agents/CREATE_AGENT_REQUEST';
export const CREATE_AGENT_SUCCESS = 'agents/CREATE_AGENT_SUCCESS';
export const CREATE_AGENT_FAILURE = 'agents/CREATE_AGENT_FAILURE';

// ✏️ UPDATE AGENT
export const UPDATE_AGENT_REQUEST = 'agents/UPDATE_AGENT_REQUEST';
export const UPDATE_AGENT_SUCCESS = 'agents/UPDATE_AGENT_SUCCESS';
export const UPDATE_AGENT_FAILURE = 'agents/UPDATE_AGENT_FAILURE';

// 🗑️ DELETE AGENT
export const DELETE_AGENT_REQUEST = 'agents/DELETE_AGENT_REQUEST';
export const DELETE_AGENT_SUCCESS = 'agents/DELETE_AGENT_SUCCESS';
export const DELETE_AGENT_FAILURE = 'agents/DELETE_AGENT_FAILURE';

// 🎯 SET ACTIVE AGENT
export const SET_ACTIVE_AGENT = 'agents/SET_ACTIVE_AGENT';

// ❌ ERROR HANDLING
export const CLEAR_AGENTS_ERROR = 'agents/CLEAR_AGENTS_ERROR';
