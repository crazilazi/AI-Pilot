/**
 * 🔧 AI PROVIDER TYPES
 * 
 * Type definitions for AI provider configuration
 */

export interface AIProviderModel {
  id: string;
  name: string;
  displayName: string;
}

export interface AIProvider {
  id: string;
  name: string;
  endpoint: string;
  apiKey?: string; // Optional, can be set via env variable
  models: AIProviderModel[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AIProvidersState {
  providers: Record<string, AIProvider>;
  activeProviderId: string | null;
  isLoading: boolean;
  error: string | null;
}
