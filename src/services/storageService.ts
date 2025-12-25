/**
 * 💾 STORAGE SERVICE - Abstract Storage Layer
 * 
 * 🎯 PURPOSE:
 * This is an abstraction layer between Redux and actual storage.
 * Currently uses localStorage, but can be easily swapped to REST API later!
 * 
 * 🔄 FUTURE MIGRATION:
 * When ready for REST API, just change the implementation in this file.
 * No need to touch Redux slices or components!
 * 
 * 📝 USAGE PATTERN:
 * Redux Action → Async Thunk → StorageService → localStorage/API
 */

import { Agent } from '../types/multiAgent';
import { MCPServer } from '../types/multiAgent';
import { AIProvider } from '../types/aiProvider';

// Storage keys
const STORAGE_KEYS = {
  AGENTS: 'retain-ai-agents',
  MCP_SERVERS: 'retain-ai-mcp-servers',
  AI_PROVIDERS: 'retain-ai-providers',
} as const;

/**
 * 🔌 STORAGE ADAPTER INTERFACE
 * Define the contract for any storage implementation
 */
interface IStorageAdapter<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * 💾 LOCAL STORAGE ADAPTER
 * Current implementation using browser localStorage
 */
class LocalStorageAdapter<T extends { id: string }> implements IStorageAdapter<T> {
  constructor(private storageKey: string) {}

  async getAll(): Promise<T[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Failed to get all from ${this.storageKey}:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  async create(item: T): Promise<T> {
    const items = await this.getAll();
    items.push(item);
    await this.saveAll(items);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const updatedItem = { ...items[index], ...updates } as T;
    items[index] = updatedItem;
    await this.saveAll(items);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const items = await this.getAll();
    const filtered = items.filter(item => item.id !== id);
    await this.saveAll(filtered);
  }

  private async saveAll(items: T[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Failed to save to ${this.storageKey}:`, error);
      throw error;
    }
  }
}

/**
 * 🌐 REST API ADAPTER (Future Implementation)
 * 
 * When ready to migrate to REST API, implement this class:
 * 
 * class RestApiAdapter<T extends { id: string }> implements IStorageAdapter<T> {
 *   constructor(private baseUrl: string) {}
 * 
 *   async getAll(): Promise<T[]> {
 *     const response = await fetch(`${this.baseUrl}`);
 *     return response.json();
 *   }
 * 
 *   async getById(id: string): Promise<T | null> {
 *     const response = await fetch(`${this.baseUrl}/${id}`);
 *     return response.ok ? response.json() : null;
 *   }
 * 
 *   async create(item: T): Promise<T> {
 *     const response = await fetch(`${this.baseUrl}`, {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(item)
 *     });
 *     return response.json();
 *   }
 * 
 *   async update(id: string, updates: Partial<T>): Promise<T> {
 *     const response = await fetch(`${this.baseUrl}/${id}`, {
 *       method: 'PATCH',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(updates)
 *     });
 *     return response.json();
 *   }
 * 
 *   async delete(id: string): Promise<void> {
 *     await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
 *   }
 * }
 * 
 * Then just swap:
 * export const agentsStorage = new RestApiAdapter<Agent>('/api/agents');
 */

/**
 * 📤 EXPORTED STORAGE INSTANCES
 * 
 * These are the storage adapters used throughout the app.
 * To migrate to REST API, just replace LocalStorageAdapter with RestApiAdapter!
 */
export const agentsStorage = new LocalStorageAdapter<Agent>(STORAGE_KEYS.AGENTS);
export const mcpServersStorage = new LocalStorageAdapter<MCPServer>(STORAGE_KEYS.MCP_SERVERS);
export const aiProvidersStorage = new LocalStorageAdapter<AIProvider>(STORAGE_KEYS.AI_PROVIDERS);

/**
 * 🎯 TYPE EXPORTS
 * Export types so other files can use them
 */
export type { IStorageAdapter };
