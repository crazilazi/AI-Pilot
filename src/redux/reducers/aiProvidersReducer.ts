/**
 * 🔧 AI PROVIDERS REDUCER
 * 
 * Pure Redux reducer for AI provider management
 */

import { AIProvider, AIProvidersState } from '../../types/aiProvider';
import { AIProvidersAction } from '../actions/aiProvidersActions';
import * as types from '../actionTypes/aiProvidersActionTypes';

const initialState: AIProvidersState = {
  providers: {},
  activeProviderId: null,
  isLoading: false,
  error: null,
};

export const aiProvidersReducer = (
  state: AIProvidersState = initialState,
  action: AIProvidersAction
): AIProvidersState => {
  switch (action.type) {
    // FETCH AI PROVIDERS
    case types.FETCH_AI_PROVIDERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.FETCH_AI_PROVIDERS_SUCCESS: {
      const providers: Record<string, AIProvider> = {};
      let activeProviderId = state.activeProviderId;

      action.payload.forEach(provider => {
        providers[provider.id] = provider;
        if (provider.isActive) {
          activeProviderId = provider.id;
        }
      });

      return {
        ...state,
        providers,
        activeProviderId,
        isLoading: false,
        error: null,
      };
    }

    case types.FETCH_AI_PROVIDERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // CREATE AI PROVIDER
    case types.CREATE_AI_PROVIDER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.CREATE_AI_PROVIDER_SUCCESS:
      return {
        ...state,
        providers: {
          ...state.providers,
          [action.payload.id]: action.payload,
        },
        isLoading: false,
        error: null,
      };

    case types.CREATE_AI_PROVIDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // UPDATE AI PROVIDER
    case types.UPDATE_AI_PROVIDER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.UPDATE_AI_PROVIDER_SUCCESS: {
      const { id, provider } = action.payload;
      return {
        ...state,
        providers: {
          ...state.providers,
          [id]: provider,
        },
        isLoading: false,
        error: null,
      };
    }

    case types.UPDATE_AI_PROVIDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // DELETE AI PROVIDER
    case types.DELETE_AI_PROVIDER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case types.DELETE_AI_PROVIDER_SUCCESS: {
      const { [action.payload]: deleted, ...remainingProviders } = state.providers;
      let newActiveProviderId = state.activeProviderId;

      // If deleted provider was active, activate another one
      if (state.activeProviderId === action.payload) {
        const remaining = Object.values(remainingProviders);
        newActiveProviderId = remaining.length > 0 ? remaining[0].id : null;
      }

      return {
        ...state,
        providers: remainingProviders,
        activeProviderId: newActiveProviderId,
        isLoading: false,
        error: null,
      };
    }

    case types.DELETE_AI_PROVIDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // SET ACTIVE PROVIDER
    case types.SET_ACTIVE_PROVIDER: {
      const targetProvider = state.providers[action.payload];
      if (!targetProvider) {
        return {
          ...state,
          error: 'Provider not found',
        };
      }

      // Update all providers to set isActive
      const updatedProviders: Record<string, AIProvider> = {};
      Object.keys(state.providers).forEach(id => {
        updatedProviders[id] = {
          ...state.providers[id],
          isActive: id === action.payload,
        };
      });

      return {
        ...state,
        providers: updatedProviders,
        activeProviderId: action.payload,
        error: null,
      };
    }

    // CLEAR ERROR
    case types.CLEAR_AI_PROVIDERS_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
