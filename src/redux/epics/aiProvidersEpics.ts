/**
 * 🔧 AI PROVIDERS EPICS
 * 
 * Redux-Observable epics for AI provider async operations
 */

import { ofType, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { aiProvidersStorage } from '../../services/storageService';
import * as actions from '../actions/aiProvidersActions';
import * as types from '../actionTypes/aiProvidersActionTypes';

// FETCH AI PROVIDERS EPIC
export const fetchAIProvidersEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.FETCH_AI_PROVIDERS_REQUEST),
    mergeMap(() =>
      from(aiProvidersStorage.getAll()).pipe(
        map(providers => actions.fetchAIProvidersSuccess(providers)),
        catchError(error =>
          of(actions.fetchAIProvidersFailure(
            error instanceof Error ? error.message : 'Failed to fetch AI providers'
          ))
        )
      )
    )
  );

// CREATE AI PROVIDER EPIC
export const createAIProviderEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.CREATE_AI_PROVIDER_REQUEST),
    mergeMap((action: ReturnType<typeof actions.createAIProviderRequest>) =>
      from(aiProvidersStorage.create(action.payload)).pipe(
        map(provider => actions.createAIProviderSuccess(provider)),
        catchError(error =>
          of(actions.createAIProviderFailure(
            error instanceof Error ? error.message : 'Failed to create AI provider'
          ))
        )
      )
    )
  );

// UPDATE AI PROVIDER EPIC
export const updateAIProviderEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.UPDATE_AI_PROVIDER_REQUEST),
    mergeMap((action: ReturnType<typeof actions.updateAIProviderRequest>) =>
      from(aiProvidersStorage.update(action.payload.id, action.payload.updates)).pipe(
        map(provider => actions.updateAIProviderSuccess(action.payload.id, provider)),
        catchError(error =>
          of(actions.updateAIProviderFailure(
            error instanceof Error ? error.message : 'Failed to update AI provider'
          ))
        )
      )
    )
  );

// DELETE AI PROVIDER EPIC
export const deleteAIProviderEpic: Epic = (action$) =>
  action$.pipe(
    ofType(types.DELETE_AI_PROVIDER_REQUEST),
    mergeMap((action: ReturnType<typeof actions.deleteAIProviderRequest>) =>
      from(aiProvidersStorage.delete(action.payload)).pipe(
        map(() => actions.deleteAIProviderSuccess(action.payload)),
        catchError(error =>
          of(actions.deleteAIProviderFailure(
            error instanceof Error ? error.message : 'Failed to delete AI provider'
          ))
        )
      )
    )
  );

// COMBINE ALL AI PROVIDER EPICS
export const aiProvidersEpics = [
  fetchAIProvidersEpic,
  createAIProviderEpic,
  updateAIProviderEpic,
  deleteAIProviderEpic,
];
