/**
 * 🏪 REDUX STORE - Enterprise Architecture
 * 
 * 🎯 ARCHITECTURE:
 * - Action Types: Defined as constants
 * - Actions: Pure functions that return action objects
 * - Reducers: Pure functions that update state
 * - Epics: Handle async operations with RxJS
 * - Storage Service: Abstraction layer for persistence
 * 
 * 🔄 FLOW:
 * Component → Dispatch Action → Epic (async) → Dispatch Success/Failure → Reducer → Update State
 * 
 * 📦 PURE REDUX (No Redux Toolkit)
 * Using pure Redux + Redux-Observable for enterprise architecture
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { rootReducer } from './reducers';
import { agentEpics } from './epics/agentEpics';
import { agentsEpics } from './epics/agentsEpics';
import { mcpServersEpics } from './epics/mcpServersEpics';
import { aiProvidersEpics } from './epics/aiProvidersEpics';

/**
 * 🎭 ROOT EPIC - Combine all epics
 * 
 * Enterprise pattern: Combine all epics from different modules
 */
const rootEpic = combineEpics(
  ...agentEpics,
  ...agentsEpics,
  ...mcpServersEpics,
  ...aiProvidersEpics
);

/**
 * 🏭 CREATE EPIC MIDDLEWARE
 * 
 * Middleware that enables Redux-Observable epics
 */
const epicMiddleware = createEpicMiddleware();

/**
 * 🛠️ SETUP REDUX DEVTOOLS
 * 
 * Enable Redux DevTools Extension for debugging (optional)
 */
const composeEnhancers =
  (typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

/**
 * 🏪 CREATE THE STORE - Pure Redux Pattern
 * 
 * Using pure Redux createStore with middleware
 * No Redux Toolkit dependency required
 */
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(epicMiddleware))
);

/**
 * 🎬 RUN EPICS
 * 
 * Start the epic middleware with combined epics
 */
epicMiddleware.run(rootEpic);

/**
 * 🎯 TYPE EXPORTS
 * 
 * TypeScript types for type-safe Redux usage
 */
export type { RootState } from './reducers';
export type AppDispatch = typeof store.dispatch;
