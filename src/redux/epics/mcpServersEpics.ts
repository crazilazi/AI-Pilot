/**
 * 🌊 MCP SERVERS EPICS
 * 
 * Enterprise pattern: Epics for MCP server async operations
 */

import { ofType, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { mcpServersStorage } from '../../services/storageService';
import * as actions from '../actions/mcpServersActions';
import * as types from '../actionTypes/mcpServersActionTypes';

/**
 * 📖 FETCH MCP SERVERS EPIC
 */
export const fetchMCPServersEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.FETCH_MCP_SERVERS_REQUEST),
    mergeMap(() =>
      from(mcpServersStorage.getAll()).pipe(
        map(servers => actions.fetchMCPServersSuccess(servers)),
        catchError(error =>
          of(actions.fetchMCPServersFailure(
            error instanceof Error ? error.message : 'Failed to fetch MCP servers'
          ))
        )
      )
    )
  );

/**
 * ✨ CREATE MCP SERVER EPIC
 */
export const createMCPServerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.CREATE_MCP_SERVER_REQUEST),
    mergeMap((action: ReturnType<typeof actions.createMCPServerRequest>) =>
      from(mcpServersStorage.create(action.payload)).pipe(
        map(server => actions.createMCPServerSuccess(server)),
        catchError(error =>
          of(actions.createMCPServerFailure(
            error instanceof Error ? error.message : 'Failed to create MCP server'
          ))
        )
      )
    )
  );

/**
 * ✏️ UPDATE MCP SERVER EPIC
 */
export const updateMCPServerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.UPDATE_MCP_SERVER_REQUEST),
    mergeMap((action: ReturnType<typeof actions.updateMCPServerRequest>) =>
      from(mcpServersStorage.update(action.payload.id, action.payload.updates)).pipe(
        map(server => actions.updateMCPServerSuccess(action.payload.id, server)),
        catchError(error =>
          of(actions.updateMCPServerFailure(
            error instanceof Error ? error.message : 'Failed to update MCP server'
          ))
        )
      )
    )
  );

/**
 * 🗑️ DELETE MCP SERVER EPIC
 */
export const deleteMCPServerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.DELETE_MCP_SERVER_REQUEST),
    mergeMap((action: ReturnType<typeof actions.deleteMCPServerRequest>) =>
      from(mcpServersStorage.delete(action.payload)).pipe(
        map(() => actions.deleteMCPServerSuccess(action.payload)),
        catchError(error =>
          of(actions.deleteMCPServerFailure(
            error instanceof Error ? error.message : 'Failed to delete MCP server'
          ))
        )
      )
    )
  );

/**
 * 📦 COMBINE ALL MCP SERVER EPICS
 */
export const mcpServersEpics = [
  fetchMCPServersEpic,
  createMCPServerEpic,
  updateMCPServerEpic,
  deleteMCPServerEpic,
];
