/**
 * 📦 ROOT REDUCER
 * 
 * Enterprise pattern: Combine all reducers
 */

import { combineReducers } from 'redux';
import { agentsReducer } from './agentsReducer';
import { mcpServersReducer } from './mcpServersReducer';
import { aiProvidersReducer } from './aiProvidersReducer';
import agentReducer from '../slices/agentSlice';

export const rootReducer = combineReducers({
  agent: agentReducer,
  agents: agentsReducer,
  mcpServers: mcpServersReducer,
  aiProviders: aiProvidersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
