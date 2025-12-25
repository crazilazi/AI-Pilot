/**
 * 🎯 AGENT SELECTOR COMPONENT
 * 
 * 🎯 WHAT IS THIS?
 * This is the dropdown menu where you choose which AI robot to talk to!
 * Think of it as a "Robot Picker" - like choosing which friend to play with!
 * 
 * 🎨 WHAT YOU SEE:
 * - Current robot's icon and name
 * - Current robot's AI model
 * - Dropdown arrow to open the list
 * - When opened: List of all available robots
 * - "Manage" button to open the robot workshop
 * 
 * 🛠️ FEATURES:
 * - Click to see all your robots
 * - Select any robot to make it active
 * - See which robot is currently active (highlighted)
 * - Quick access to manage robots
 * 
 * 📊 PROPS:
 * - onManageAgents: Function to open the Agent Manager
 * 
 * 💭 THINK OF IT LIKE:
 * A toy box lid that shows which toy you're playing with,
 * and when you open it, you can pick a different toy!
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setActiveAgent } from '../redux/slices/agentsSlice';

// 📋 COMPONENT PROPS - What this component needs
interface AgentSelectorProps {
  onManageAgents: () => void;  // 🛠️ Function to open Agent Manager
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onManageAgents }) => {
  // 🎮 REDUX HOOKS - Connect to the store
  const dispatch = useDispatch();  // 📤 Send actions to store
  const { agents, activeAgentId } = useSelector((state: RootState) => state.agents);  // 📖 Read agents from store
  
  // 🎨 LOCAL STATE
  const [showDropdown, setShowDropdown] = useState(false);  // 👁️ Is dropdown open?

  // 📊 COMPUTED VALUES
  const agentsList = Object.values(agents);  // 📚 Convert dictionary to list
  const activeAgent = activeAgentId ? agents[activeAgentId] : null;  // 🤖 Get active robot

  /**
   * 🎯 SELECT AGENT - Choose which robot to use
   * Like picking which toy to play with!
   */
  const handleSelectAgent = (agentId: string) => {
    dispatch(setActiveAgent(agentId));  // 📤 Tell store which robot is active
    setShowDropdown(false);  // 🚪 Close dropdown
  };

  return (
    <div style={styles.container}>
      <div style={styles.selectorButton} onClick={() => setShowDropdown(!showDropdown)}>
        <span style={styles.agentIcon}>{activeAgent?.icon || '🤖'}</span>
        <div style={styles.agentInfo}>
          <div style={styles.agentName}>{activeAgent?.name || 'No Agent'}</div>
          <div style={styles.agentModel}>
            {activeAgent?.modelConfig.model || 'No model'}
          </div>
        </div>
        <span style={styles.dropdownArrow}>▼</span>
      </div>

      {showDropdown && (
        <>
          <div style={styles.overlay} onClick={() => setShowDropdown(false)} />
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <span>Select Agent</span>
              <button style={styles.manageButton} onClick={onManageAgents}>
                ⚙️ Manage
              </button>
            </div>

            <div style={styles.agentList}>
              {agentsList.length === 0 ? (
                <div style={styles.emptyState}>
                  No agents available. Create one to get started!
                </div>
              ) : (
                agentsList.map(agent => (
                  <div
                    key={agent.id}
                    style={{
                      ...styles.agentItem,
                      backgroundColor: agent.id === activeAgentId ? '#e3f2fd' : 'white',
                    }}
                    onClick={() => handleSelectAgent(agent.id)}
                  >
                    <span style={styles.itemIcon}>{agent.icon}</span>
                    <div style={styles.itemInfo}>
                      <div style={styles.itemName}>
                        {agent.name}
                        {agent.isBuiltIn && <span style={styles.builtInBadge}>Built-in</span>}
                      </div>
                      <div style={styles.itemDescription}>{agent.description}</div>
                      <div style={styles.itemModel}>{agent.modelConfig.model}</div>
                    </div>
                    {agent.id === activeAgentId && (
                      <span style={styles.checkmark}>✓</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  selectorButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '250px',
    transition: 'all 0.2s',
  },
  agentIcon: {
    fontSize: '24px',
  },
  agentInfo: {
    flex: 1,
    textAlign: 'left',
  },
  agentName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  agentModel: {
    fontSize: '11px',
    color: '#666',
    marginTop: '2px',
  },
  dropdownArrow: {
    fontSize: '10px',
    color: '#999',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '350px',
    maxHeight: '500px',
    overflowY: 'auto',
    zIndex: 999,
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    fontWeight: 'bold',
    fontSize: '14px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1,
  },
  manageButton: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  agentList: {
    padding: '8px',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
    fontSize: '13px',
  },
  agentItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '4px',
    transition: 'background-color 0.2s',
  },
  itemIcon: {
    fontSize: '32px',
    marginTop: '4px',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  builtInBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '4px',
    fontWeight: 'normal',
  },
  itemDescription: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  },
  itemModel: {
    fontSize: '11px',
    color: '#999',
    fontFamily: 'monospace',
  },
  checkmark: {
    fontSize: '18px',
    color: '#4caf50',
    marginTop: '8px',
  },
};

export default AgentSelector;
