/**
 * 📚 USAGE EXAMPLES - How to Use Redux Thunks in Components
 * 
 * This file shows how to use the new Redux-based storage service
 * in your React components.
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  fetchAgentsThunk,
  createAgentThunk,
  updateAgentThunk,
  deleteAgentThunk,
} from '../redux/thunks';

/**
 * ✨ EXAMPLE 1: Loading Agents on Component Mount
 */
function AgentListExample() {
  const dispatch = useDispatch();
  const { agents, isLoading, error } = useSelector((state: RootState) => state.agents);

  // Load agents when component mounts
  React.useEffect(() => {
    dispatch(fetchAgentsThunk());
  }, [dispatch]);

  if (isLoading) return <div>Loading agents...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {Object.values(agents).map(agent => (
        <div key={agent.id}>{agent.name}</div>
      ))}
    </div>
  );
}

/**
 * ✨ EXAMPLE 2: Creating a New Agent
 */
function CreateAgentExample() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.agents);

  const handleCreateAgent = async () => {
    const newAgent = {
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

    // Dispatch the thunk - it will save to storage automatically
    const result = await dispatch(createAgentThunk(newAgent));
    
    // Check if successful
    if (createAgentThunk.fulfilled.match(result)) {
      console.log('Agent created successfully!', result.payload);
    } else {
      console.error('Failed to create agent:', result.payload);
    }
  };

  return (
    <div>
      <button onClick={handleCreateAgent} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Agent'}
      </button>
      {error && <div>Error: {error}</div>}
    </div>
  );
}

/**
 * ✨ EXAMPLE 3: Updating an Agent
 */
function UpdateAgentExample({ agentId }: { agentId: string }) {
  const dispatch = useDispatch();
  const agent = useSelector((state: RootState) => state.agents.agents[agentId]);

  const handleUpdateName = async () => {
    const updates = {
      name: 'Updated Name',
      updatedAt: Date.now(),
    };

    const result = await dispatch(updateAgentThunk({ id: agentId, updates }));
    
    if (updateAgentThunk.fulfilled.match(result)) {
      console.log('Agent updated successfully!');
    }
  };

  if (!agent) return null;

  return (
    <div>
      <h3>{agent.name}</h3>
      <button onClick={handleUpdateName}>Update Name</button>
    </div>
  );
}

/**
 * ✨ EXAMPLE 4: Deleting an Agent
 */
function DeleteAgentExample({ agentId }: { agentId: string }) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure?')) return;

    const result = await dispatch(deleteAgentThunk(agentId));
    
    if (deleteAgentThunk.fulfilled.match(result)) {
      console.log('Agent deleted successfully!');
    } else {
      alert(`Failed to delete: ${result.payload}`);
    }
  };

  return (
    <button onClick={handleDelete}>Delete Agent</button>
  );
}

/**
 * ✨ EXAMPLE 5: Complete CRUD Component
 */
function AgentManagerComplete() {
  const dispatch = useDispatch();
  const { agents, isLoading, error } = useSelector((state: RootState) => state.agents);

  // Load agents on mount
  React.useEffect(() => {
    dispatch(fetchAgentsThunk());
  }, [dispatch]);

  const handleCreate = async () => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: `Agent ${Object.keys(agents).length + 1}`,
      icon: '🤖',
      description: 'New agent',
      isBuiltIn: false,
      isActive: false,
      systemPrompt: 'You are helpful.',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dispatch(createAgentThunk(newAgent));
  };

  const handleUpdate = async (id: string) => {
    await dispatch(updateAgentThunk({
      id,
      updates: { name: `Updated at ${new Date().toLocaleTimeString()}` }
    }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this agent?')) {
      await dispatch(deleteAgentThunk(id));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create New Agent</button>
      
      <ul>
        {Object.values(agents).map(agent => (
          <li key={agent.id}>
            {agent.icon} {agent.name}
            <button onClick={() => handleUpdate(agent.id)}>Update</button>
            <button onClick={() => handleDelete(agent.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 🎯 KEY DIFFERENCES FROM OLD APPROACH:
 * 
 * OLD (Direct Service Calls):
 * ❌ agentManagerService.createAgent(agent)  // Direct call
 * ❌ agentManagerService.updateAgent(id, updates)
 * ❌ Then manually dispatch actions to update Redux
 * 
 * NEW (Redux Thunks):
 * ✅ dispatch(createAgentThunk(agent))  // One call does everything
 * ✅ dispatch(updateAgentThunk({ id, updates }))
 * ✅ Automatically updates Redux state
 * ✅ Easy to migrate to REST API later
 * 
 * 🎨 BENEFITS:
 * - Single source of truth (Redux manages everything)
 * - Automatic loading states
 * - Automatic error handling
 * - Easy to test
 * - Easy to migrate storage backends
 * - No manual Redux state synchronization
 */

export {
  AgentListExample,
  CreateAgentExample,
  UpdateAgentExample,
  DeleteAgentExample,
  AgentManagerComplete,
};
