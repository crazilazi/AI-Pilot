/**
 * 🔧 AI PROVIDER ACTIONS
 * 
 * Action creators for AI provider management
 */

import { AIProvider } from '../../types/aiProvider';
import * as types from '../actionTypes/aiProvidersActionTypes';

// FETCH AI PROVIDERS
export const fetchAIProvidersRequest = () => ({
  type: types.FETCH_AI_PROVIDERS_REQUEST as typeof types.FETCH_AI_PROVIDERS_REQUEST,
});

export const fetchAIProvidersSuccess = (providers: AIProvider[]) => ({
  type: types.FETCH_AI_PROVIDERS_SUCCESS as typeof types.FETCH_AI_PROVIDERS_SUCCESS,
  payload: providers,
});

export const fetchAIProvidersFailure = (error: string) => ({
  type: types.FETCH_AI_PROVIDERS_FAILURE as typeof types.FETCH_AI_PROVIDERS_FAILURE,
  payload: error,
});

// CREATE AI PROVIDER
export const createAIProviderRequest = (provider: AIProvider) => ({
  type: types.CREATE_AI_PROVIDER_REQUEST as typeof types.CREATE_AI_PROVIDER_REQUEST,
  payload: provider,
});

export const createAIProviderSuccess = (provider: AIProvider) => ({
  type: types.CREATE_AI_PROVIDER_SUCCESS as typeof types.CREATE_AI_PROVIDER_SUCCESS,
  payload: provider,
});

export const createAIProviderFailure = (error: string) => ({
  type: types.CREATE_AI_PROVIDER_FAILURE as typeof types.CREATE_AI_PROVIDER_FAILURE,
  payload: error,
});

// UPDATE AI PROVIDER
export const updateAIProviderRequest = (id: string, updates: Partial<AIProvider>) => ({
  type: types.UPDATE_AI_PROVIDER_REQUEST as typeof types.UPDATE_AI_PROVIDER_REQUEST,
  payload: { id, updates },
});

export const updateAIProviderSuccess = (id: string, provider: AIProvider) => ({
  type: types.UPDATE_AI_PROVIDER_SUCCESS as typeof types.UPDATE_AI_PROVIDER_SUCCESS,
  payload: { id, provider },
});

export const updateAIProviderFailure = (error: string) => ({
  type: types.UPDATE_AI_PROVIDER_FAILURE as typeof types.UPDATE_AI_PROVIDER_FAILURE,
  payload: error,
});

// DELETE AI PROVIDER
export const deleteAIProviderRequest = (id: string) => ({
  type: types.DELETE_AI_PROVIDER_REQUEST as typeof types.DELETE_AI_PROVIDER_REQUEST,
  payload: id,
});

export const deleteAIProviderSuccess = (id: string) => ({
  type: types.DELETE_AI_PROVIDER_SUCCESS as typeof types.DELETE_AI_PROVIDER_SUCCESS,
  payload: id,
});

export const deleteAIProviderFailure = (error: string) => ({
  type: types.DELETE_AI_PROVIDER_FAILURE as typeof types.DELETE_AI_PROVIDER_FAILURE,
  payload: error,
});

// SET ACTIVE PROVIDER
export const setActiveProvider = (id: string) => ({
  type: types.SET_ACTIVE_PROVIDER as typeof types.SET_ACTIVE_PROVIDER,
  payload: id,
});

// CLEAR ERROR
export const clearAIProvidersError = () => ({
  type: types.CLEAR_AI_PROVIDERS_ERROR as typeof types.CLEAR_AI_PROVIDERS_ERROR,
});

// Action Types
export type AIProvidersAction =
  | ReturnType<typeof fetchAIProvidersRequest>
  | ReturnType<typeof fetchAIProvidersSuccess>
  | ReturnType<typeof fetchAIProvidersFailure>
  | ReturnType<typeof createAIProviderRequest>
  | ReturnType<typeof createAIProviderSuccess>
  | ReturnType<typeof createAIProviderFailure>
  | ReturnType<typeof updateAIProviderRequest>
  | ReturnType<typeof updateAIProviderSuccess>
  | ReturnType<typeof updateAIProviderFailure>
  | ReturnType<typeof deleteAIProviderRequest>
  | ReturnType<typeof deleteAIProviderSuccess>
  | ReturnType<typeof deleteAIProviderFailure>
  | ReturnType<typeof setActiveProvider>
  | ReturnType<typeof clearAIProvidersError>;
