/**
 * 🌐 REST API ADAPTER - Future Implementation Example
 * 
 * 🎯 PURPOSE:
 * This file shows how to implement a REST API adapter when you're ready
 * to migrate from localStorage to a backend API.
 * 
 * 📝 MIGRATION STEPS:
 * 
 * 1. SET UP YOUR BACKEND API:
 *    Create REST endpoints for agents and MCP servers:
 *    - GET    /api/agents         → Get all agents
 *    - GET    /api/agents/:id     → Get one agent
 *    - POST   /api/agents         → Create agent
 *    - PATCH  /api/agents/:id     → Update agent
 *    - DELETE /api/agents/:id     → Delete agent
 *    
 *    Same for /api/mcp-servers
 * 
 * 2. IMPLEMENT THIS ADAPTER:
 *    Uncomment the code below and configure your API base URL
 * 
 * 3. UPDATE storageService.ts:
 *    Replace:
 *      export const agentsStorage = new LocalStorageAdapter<Agent>(STORAGE_KEYS.AGENTS);
 *    With:
 *      export const agentsStorage = new RestApiAdapter<Agent>('/api/agents');
 * 
 * 4. THAT'S IT!
 *    No need to change Redux slices, thunks, or components!
 */

import { IStorageAdapter } from './storageService';

/**
 * 🌐 REST API CONFIGURATION
 */
const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 🌐 REST API ADAPTER CLASS
 * Implements the same interface as LocalStorageAdapter
 */
export class RestApiAdapter<T extends { id: string }> implements IStorageAdapter<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    // Remove leading/trailing slashes and construct full endpoint
    this.endpoint = `${API_CONFIG.baseUrl}/${endpoint.replace(/^\/|\/$/g, '')}`;
  }

  /**
   * 📖 GET ALL ITEMS
   * GET /api/agents or /api/mcp-servers
   */
  async getAll(): Promise<T[]> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'GET',
        headers: API_CONFIG.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch from ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * 🔍 GET ONE ITEM BY ID
   * GET /api/agents/:id or /api/mcp-servers/:id
   */
  async getById(id: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'GET',
        headers: API_CONFIG.headers,
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${id} from ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * ✨ CREATE NEW ITEM
   * POST /api/agents or /api/mcp-servers
   */
  async create(item: T): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to create item at ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * ✏️ UPDATE EXISTING ITEM
   * PATCH /api/agents/:id or /api/mcp-servers/:id
   */
  async update(id: string, updates: Partial<T>): Promise<T> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'PATCH',
        headers: API_CONFIG.headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to update ${id} at ${this.endpoint}:`, error);
      throw error;
    }
  }

  /**
   * 🗑️ DELETE ITEM
   * DELETE /api/agents/:id or /api/mcp-servers/:id
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to delete ${id} from ${this.endpoint}:`, error);
      throw error;
    }
  }
}

/**
 * 🔐 AUTHENTICATED REST API ADAPTER (Optional)
 * Use this if your API requires authentication
 */
export class AuthenticatedRestApiAdapter<T extends { id: string }> extends RestApiAdapter<T> {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token'); // or wherever you store the token
    
    return {
      ...API_CONFIG.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  // Override all methods to include auth headers
  async getAll(): Promise<T[]> {
    const response = await fetch(this['endpoint'], {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  // ... similar overrides for other methods
}
