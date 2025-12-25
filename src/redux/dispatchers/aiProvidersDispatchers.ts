/**
 * 🔧 AI PROVIDERS DISPATCHER
 * 
 * Service layer for AI provider operations
 */

import { Dispatch } from 'redux';
import { AIProvider } from '../../types/aiProvider';
import * as actions from '../actions/aiProvidersActions';

export class AIProvidersDispatcher {
  constructor(private dispatch: Dispatch) {}

  fetchAIProviders(): void {
    this.dispatch(actions.fetchAIProvidersRequest());
  }

  createAIProvider(provider: AIProvider): void {
    this.dispatch(actions.createAIProviderRequest(provider));
  }

  updateAIProvider(id: string, updates: Partial<AIProvider>): void {
    this.dispatch(actions.updateAIProviderRequest(id, updates));
  }

  deleteAIProvider(id: string): void {
    this.dispatch(actions.deleteAIProviderRequest(id));
  }

  setActiveProvider(id: string): void {
    this.dispatch(actions.setActiveProvider(id));
  }

  clearError(): void {
    this.dispatch(actions.clearAIProvidersError());
  }
}
