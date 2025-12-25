/**
 * 📚 ENTERPRISE REDUX USAGE EXAMPLES
 * 
 * Complete examples showing how to use the new Redux-Observable architecture
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgentsDispatcher, MCPServersDispatcher } from '../redux/dispatchers';
import { RootState } from '../redux/store';
import { Agent } from '../types/multiAgent';

/**
 * ✨ EXAMPLE 1: Complete Agent Management Component
 * 
 * This shows the recommended pattern using Dispatcher classes
 */
export function AgentManagementExample() {
  const dispatch = useDispatch();
  const dispatcher = new AgentsDispatcher(dispatch);
  
  // Select state from Redux
  const { agents, activeAgentId, isLoading, error } = useSelector(
    (state: RootState) => state.agents
  );

  // Load agents on mount
  useEffect(() => {
    dispatcher.fetchAgents();
  }, []);

  // Create new agent
  const handleCreate = () => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: 'New Agent',
      icon: '🤖',
      description: 'A new helpful agent',
      isBuiltIn: false,
      isActive: false,
      systemPrompt: 'You are a helpful assistant.',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    dispatcher.createAgent(newAgent);
  };

  // Update agent
  const handleUpdate = (id: string) => {
    dispatcher.updateAgent(id, {
      name: `Updated at ${new Date().toLocaleTimeString()}`,
      updatedAt: Date.now(),
    });
  };

  // Delete agent
  const handleDelete = (id: string) => {
    if (window.confirm('Delete this agent?')) {
      dispatcher.deleteAgent(id);
    }
  };

  // Set active agent
  const handleActivate = (id: string) => {
    dispatcher.setActiveAgent(id);
  };

  // Clear error
  const handleClearError = () => {
    dispatcher.clearError();
  };

  // Loading state
  if (isLoading) {
    return <div className="loading">Loading agents...</div>;
  }

  return (
    <div className="agent-management">
      <h2>Agent Management</h2>

      {/* Error Display */}
      {error && (
        <div className="error">
          <span>{error}</span>
          <button onClick={handleClearError}>Dismiss</button>
        </div>
      )}

      {/* Create Button */}
      <button onClick={handleCreate} className="btn-create">
        Create New Agent
      </button>

      {/* Agents List */}
      <div className="agents-list">
        {Object.values(agents).map(agent => (
          <div 
            key={agent.id} 
            className={`agent-card ${agent.isActive ? 'active' : ''}`}
          >
            <div className="agent-header">
              <span className="agent-icon">{agent.icon}</span>
              <span className="agent-name">{agent.name}</span>
              {agent.isActive && <span className="badge">Active</span>}
            </div>

            <p className="agent-description">{agent.description}</p>

            <div className="agent-actions">
              <button onClick={() => handleActivate(agent.id)}>
                Activate
              </button>
              <button onClick={() => handleUpdate(agent.id)}>
                Update
              </button>
              <button 
                onClick={() => handleDelete(agent.id)}
                disabled={agent.isBuiltIn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ✨ EXAMPLE 2: MCP Server Management
 */
export function MCPServerManagementExample() {
  const dispatch = useDispatch();
  const dispatcher = new MCPServersDispatcher(dispatch);
  
  const { servers, availableTools, isLoading, error } = useSelector(
    (state: RootState) => state.mcpServers
  );

  useEffect(() => {
    dispatcher.fetchMCPServers();
  }, []);

  const handleToggleEnabled = (id: string) => {
    dispatcher.toggleServerEnabled(id);
  };

  const handleRefreshTools = () => {
    dispatcher.refreshAvailableTools();
  };

  return (
    <div className="mcp-management">
      <h2>MCP Servers</h2>

      <div className="tools-summary">
        <h3>Available Tools: {availableTools.length}</h3>
        <button onClick={handleRefreshTools}>Refresh</button>
      </div>

      {Object.values(servers).map(server => (
        <div key={server.id} className="server-card">
          <h4>{server.name}</h4>
          <p>Status: {server.status}</p>
          <p>Tools: {server.tools.length}</p>
          
          <label>
            <input
              type="checkbox"
              checked={server.isEnabled}
              onChange={() => handleToggleEnabled(server.id)}
            />
            Enabled
          </label>
        </div>
      ))}
    </div>
  );
}

/**
 * ✨ EXAMPLE 3: Using Multiple Dispatchers
 */
export function DashboardExample() {
  const dispatch = useDispatch();
  const agentsDispatcher = new AgentsDispatcher(dispatch);
  const mcpDispatcher = new MCPServersDispatcher(dispatch);

  useEffect(() => {
    // Load both agents and MCP servers
    agentsDispatcher.fetchAgents();
    mcpDispatcher.fetchMCPServers();
  }, []);

  const agents = useSelector((state: RootState) => state.agents.agents);
  const servers = useSelector((state: RootState) => state.mcpServers.servers);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Agents</h3>
          <p>{Object.keys(agents).length}</p>
        </div>
        
        <div className="stat-card">
          <h3>MCP Servers</h3>
          <p>{Object.keys(servers).length}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * ✨ EXAMPLE 4: Using Functional Dispatchers (Alternative)
 */
import { agentsDispatchers } from '../redux/dispatchers';

export function FunctionalExample() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Functional style
    agentsDispatchers.fetchAgents(dispatch)();
  }, [dispatch]);

  const handleCreate = (agent: Agent) => {
    agentsDispatchers.createAgent(dispatch)(agent);
  };

  return <div>Functional Example</div>;
}

/**
 * ✨ EXAMPLE 5: Direct Action Dispatch (Low-level)
 * 
 * Use this when you need fine-grained control
 */
import * as agentsActions from '../redux/actions/agentsActions';

export function DirectActionExample() {
  const dispatch = useDispatch();

  const handleFetch = () => {
    // Dispatch action directly
    dispatch(agentsActions.fetchAgentsRequest());
  };

  const handleCreate = (agent: Agent) => {
    dispatch(agentsActions.createAgentRequest(agent));
  };

  return <div>Direct Action Example</div>;
}

/**
 * ✨ EXAMPLE 6: Custom Hook Pattern
 * 
 * Create reusable hooks for common operations
 */
export function useAgents() {
  const dispatch = useDispatch();
  const dispatcher = new AgentsDispatcher(dispatch);
  
  const { agents, activeAgentId, isLoading, error } = useSelector(
    (state: RootState) => state.agents
  );

  return {
    agents,
    activeAgentId,
    isLoading,
    error,
    fetchAgents: () => dispatcher.fetchAgents(),
    createAgent: (agent: Agent) => dispatcher.createAgent(agent),
    updateAgent: (id: string, updates: Partial<Agent>) => 
      dispatcher.updateAgent(id, updates),
    deleteAgent: (id: string) => dispatcher.deleteAgent(id),
    setActiveAgent: (id: string) => dispatcher.setActiveAgent(id),
    clearError: () => dispatcher.clearError(),
  };
}

// Usage:
export function ComponentUsingHook() {
  const {
    agents,
    isLoading,
    error,
    fetchAgents,
    createAgent,
    deleteAgent
  } = useAgents();

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      {Object.values(agents).map(agent => (
        <div key={agent.id}>
          {agent.name}
          <button onClick={() => deleteAgent(agent.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

/**
 * 🎯 RECOMMENDED PATTERNS:
 * 
 * 1. ✅ Use Dispatcher classes in components (Example 1)
 * 2. ✅ Create custom hooks for reusability (Example 6)
 * 3. ⚠️  Use functional dispatchers for one-offs (Example 4)
 * 4. ⚠️  Use direct actions only when needed (Example 5)
 * 
 * 📝 BEST PRACTICES:
 * 
 * - Always use selectors with useSelector
 * - Create dispatcher instance once, reuse methods
 * - Handle loading and error states
 * - Clean up effects properly
 * - Use TypeScript for type safety
 */

export {
  AgentManagementExample,
  MCPServerManagementExample,
  DashboardExample,
  FunctionalExample,
  DirectActionExample,
  useAgents,
  ComponentUsingHook,
};
