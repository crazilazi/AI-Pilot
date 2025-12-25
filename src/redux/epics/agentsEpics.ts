/**
 * 🌊 AGENTS EPICS
 * 
 * Enterprise pattern: Epics handle async operations using RxJS
 * Separated from actions and reducers for clean architecture
 */

import { ofType, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { agentsStorage } from '../../services/storageService';
import * as actions from '../actions/agentsActions';
import * as types from '../actionTypes/agentsActionTypes';

/**
 * 📖 FETCH AGENTS EPIC
 * 
 * Listens for: FETCH_AGENTS_REQUEST
 * Calls: agentsStorage.getAll()
 * Dispatches: fetchAgentsSuccess or fetchAgentsFailure
 */
export const fetchAgentsEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.FETCH_AGENTS_REQUEST),
    mergeMap(() =>
      from(agentsStorage.getAll()).pipe(
        map(agents => actions.fetchAgentsSuccess(agents)),
        catchError(error =>
          of(actions.fetchAgentsFailure(
            error instanceof Error ? error.message : 'Failed to fetch agents'
          ))
        )
      )
    )
  );

/**
 * ✨ CREATE AGENT EPIC
 * 
 * Listens for: CREATE_AGENT_REQUEST
 * Calls: agentsStorage.create()
 * Dispatches: createAgentSuccess or createAgentFailure
 */
export const createAgentEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.CREATE_AGENT_REQUEST),
    mergeMap((action: ReturnType<typeof actions.createAgentRequest>) =>
      from(agentsStorage.create(action.payload)).pipe(
        map(agent => actions.createAgentSuccess(agent)),
        catchError(error =>
          of(actions.createAgentFailure(
            error instanceof Error ? error.message : 'Failed to create agent'
          ))
        )
      )
    )
  );

/**
 * ✏️ UPDATE AGENT EPIC
 * 
 * Listens for: UPDATE_AGENT_REQUEST
 * Calls: agentsStorage.update()
 * Dispatches: updateAgentSuccess or updateAgentFailure
 */
export const updateAgentEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.UPDATE_AGENT_REQUEST),
    mergeMap((action: ReturnType<typeof actions.updateAgentRequest>) =>
      from(agentsStorage.update(action.payload.id, action.payload.updates)).pipe(
        map(agent => actions.updateAgentSuccess(action.payload.id, agent)),
        catchError(error =>
          of(actions.updateAgentFailure(
            error instanceof Error ? error.message : 'Failed to update agent'
          ))
        )
      )
    )
  );

/**
 * 🗑️ DELETE AGENT EPIC
 * 
 * Listens for: DELETE_AGENT_REQUEST
 * Calls: agentsStorage.delete()
 * Dispatches: deleteAgentSuccess or deleteAgentFailure
 */
export const deleteAgentEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(types.DELETE_AGENT_REQUEST),
    mergeMap((action: ReturnType<typeof actions.deleteAgentRequest>) => {
      // Check if agent is built-in
      const state = state$.value as any;
      const agent = state.agents.agents[action.payload];
      
      if (agent?.isBuiltIn) {
        return of(actions.deleteAgentFailure('Cannot delete built-in agents'));
      }

      return from(agentsStorage.delete(action.payload)).pipe(
        map(() => actions.deleteAgentSuccess(action.payload)),
        catchError(error =>
          of(actions.deleteAgentFailure(
            error instanceof Error ? error.message : 'Failed to delete agent'
          ))
        )
      );
    })
  );

/**
 * 📦 COMBINE ALL AGENTS EPICS
 */
export const agentsEpics = [
  fetchAgentsEpic,
  createAgentEpic,
  updateAgentEpic,
  deleteAgentEpic,
];
