/**
 * 🤖 AGENT MANAGER COMPONENT
 * 
 * 🎯 WHAT IS THIS?
 * This is the control panel for managing your AI robot collection!
 * Think of it as a "Robot Workshop" where you can:
 * - 👀 See all your robots
 * - ✨ Create new robots
 * - ✏️ Customize existing robots
 * - 🗑️ Delete robots you don't need
 * - 📋 Use pre-made robot templates
 * 
 * 🎨 WHAT YOU SEE:
 * - List View: Shows all your robots with their names and icons
 * - Create View: Form to build a brand new robot
 * - Edit View: Form to change an existing robot
 * 
 * 🛠️ FEATURES:
 * - Choose from templates (pre-configured robots)
 * - Set robot personality (system prompt)
 * - Configure AI model settings (temperature, tokens, etc.)
 * - Pick cool icons for your robots
 * - Delete custom robots (can't delete built-in ones!)
 * 
 * 📊 PROPS:
 * - onClose: Function to close this panel
 * 
 * 💭 THINK OF IT LIKE:
 * A toy robot factory where you design and customize your robot collection!
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addAgent, updateAgent, deleteAgent } from '../redux/slices/agentsSlice';
import { Agent } from '../types/multiAgent';
import agentManagerService from '../services/agentManagerService';
import { AgentFactory, AGENT_TEMPLATES } from '../services/agentTemplates';
import { AIProvidersDispatcher } from '../redux/dispatchers/aiProvidersDispatchers';

// 📋 COMPONENT PROPS - What this component needs
interface AgentManagerProps {
  onClose: () => void;  // 🚪 Function to close the manager
}

const AgentManager: React.FC<AgentManagerProps> = ({ onClose }) => {
  // 🎮 REDUX HOOKS - Connect to the store
  const dispatch = useDispatch();  // 📤 Send actions to store
  const { agents } = useSelector((state: RootState) => state.agents);  // 📖 Read agents from store
  const { providers: aiProviders } = useSelector((state: RootState) => state.aiProviders);  // 🔧 Read AI providers
  
  // Initialize AI Providers dispatcher
  const aiProvidersDispatcher = new AIProvidersDispatcher(dispatch);
  
  // Load AI providers on mount
  useEffect(() => {
    aiProvidersDispatcher.fetchAIProviders();
  }, []);
  
  // 🎨 VIEW STATE - Which screen are we showing?
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');  // 👁️ Current view
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);  // ✏️ Robot being edited
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');  // 📋 Selected template

  // 📝 FORM STATE - Robot details
  const [name, setName] = useState('');              // 📛 Robot name
  const [description, setDescription] = useState(''); // 📄 Robot description
  const [systemPrompt, setSystemPrompt] = useState('');  // 💭 Robot personality
  const [icon, setIcon] = useState('⭐');            // 🎨 Robot icon
  
  // ⚙️ MODEL CONFIGURATION STATE - AI settings
  const [providerId, setProviderId] = useState<string>('');  // 🏢 AI Provider ID
  const [modelName, setModelName] = useState('');          // 🧠 AI model name
  const [temperature, setTemperature] = useState(0.7);  // 🌡️ Creativity (0=boring, 1=wild)
  const [maxTokens, setMaxTokens] = useState(2000);     // 📏 Max response length
  const [topP, setTopP] = useState(1);                  // 🎲 Word choice diversity
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);  // 🔄 Avoid repetition
  const [presencePenalty, setPresencePenalty] = useState(0);    // 💭 Stay on topic

  const agentsList = Object.values(agents);  // 📚 Convert dictionary to list
  const aiProvidersList = Object.values(aiProviders);  // 🔧 Convert providers to list
  
  // Get selected provider
  const selectedProvider = providerId ? aiProviders[providerId] : null;
  
  // Get models for selected provider
  const availableModels = selectedProvider ? selectedProvider.models : [];

  // ============================================
  // 🧹 HELPER FUNCTIONS
  // ============================================

  /**
   * 🔄 RESET FORM - Clear all form fields
   * Like erasing a whiteboard to start fresh!
   */
  const resetForm = () => {
    setName('');
    setDescription('');
    setSystemPrompt('');
    setIcon('⭐');
    setProviderId('');
    setModelName('');
    setTemperature(0.7);
    setMaxTokens(2000);
    setTopP(1);
    setFrequencyPenalty(0);
    setPresencePenalty(0);
    setSelectedTemplate('');
    setEditingAgent(null);
  };

  /**
   * ✨ CREATE FROM TEMPLATE - Make robot from a pre-made design
   * Like buying a toy robot that's already built!
   */
  const handleCreateFromTemplate = (templateId: string) => {
    const agent = AgentFactory.createFromTemplate(templateId);  // 🏭 Build robot from template
    if (!agent) return;

    dispatch(addAgent(agent));  // 📤 Add to Redux store
    agentManagerService.createAgent(agent);  // 💾 Save to localStorage
    setView('list');  // 👁️ Go back to list view
  };

  /**
   * 🎨 CREATE CUSTOM ROBOT - Build robot from scratch
   * Like designing your own toy robot from parts!
   */
  const handleCreateCustom = () => {
    // ✅ Validate required fields
    if (!name.trim() || !description.trim() || !systemPrompt.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // 🏗️ Build the robot
    const agent = AgentFactory.createCustomAgent(name, description, systemPrompt);
    agent.icon = icon;
    agent.modelConfig = {
      providerId,
      provider: selectedProvider?.name || 'Unknown',
      model: modelName,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
    };

    dispatch(addAgent(agent));  // 📤 Add to Redux store
    agentManagerService.createAgent(agent);  // 💾 Save to localStorage
    resetForm();  // 🧹 Clear form
    setView('list');  // 👁️ Go back to list
  };

  /**
   * ✏️ START EDITING - Load robot data into form
   * Like picking up a toy to modify it!
   */
  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);  // 📝 Remember which robot we're editing
    setName(agent.name);
    setDescription(agent.description);
    setSystemPrompt(agent.systemPrompt);
    setIcon(agent.icon || '⭐');
    setProviderId(agent.modelConfig.providerId || '');
    setModelName(agent.modelConfig.model);
    setTemperature(agent.modelConfig.temperature);
    setMaxTokens(agent.modelConfig.maxTokens);
    setTopP(agent.modelConfig.topP);
    setFrequencyPenalty(agent.modelConfig.frequencyPenalty);
    setPresencePenalty(agent.modelConfig.presencePenalty);
    setView('edit');  // 👁️ Switch to edit view
  };

  /**
   * 💾 SAVE CHANGES - Update robot with new settings
   * Like repainting a toy or changing its batteries!
   */
  const handleUpdateAgent = () => {
    // ✅ Validate required fields
    if (!editingAgent || !name.trim() || !description.trim() || !systemPrompt.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // 📦 Package the updates
    const updates: Partial<Agent> = {
      name,
      description,
      systemPrompt,
      icon,
      modelConfig: {
        providerId,
        provider: selectedProvider?.name || 'Unknown',
        model: modelName,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
      },
    };

    dispatch(updateAgent({ id: editingAgent.id, updates }));  // 📤 Update Redux store
    agentManagerService.updateAgent(editingAgent.id, updates);  // 💾 Save to localStorage
    resetForm();  // 🧹 Clear form
    setView('list');  // 👁️ Go back to list
  };

  /**
   * 🗑️ DELETE ROBOT - Remove a custom robot
   * Like giving away a toy (but can't delete factory-made ones!)
   */
  const handleDelete = (agent: Agent) => {
    // 🛑 Can't delete built-in robots!
    if (agent.isBuiltIn) {
      alert('Cannot delete built-in agents');
      return;
    }

    // ⚠️ Confirm deletion
    if (!confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      return;
    }

    dispatch(deleteAgent(agent.id));  // 📤 Remove from Redux store
    agentManagerService.deleteAgent(agent.id);  // 💾 Remove from localStorage
  };

  /**
   * ✏️ EDIT BUILT-IN ROBOT - Make factory robot editable
   * Like modifying a pre-made toy (makes it custom forever!)
   */
  const handleEditBuiltIn = (agent: Agent) => {
    // ⚠️ Warn user this is permanent!
    if (!confirm(`This is a built-in agent. Editing it will make it editable permanently. Continue?`)) {
      return;
    }

    // Remove built-in flag
    const updates: Partial<Agent> = {
      isBuiltIn: false,
    };

    dispatch(updateAgent({ id: agent.id, updates }));
    agentManagerService.updateAgent(agent.id, updates);

    // Now open edit mode
    handleEdit({ ...agent, isBuiltIn: false });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Agent Manager</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {view === 'list' && (
          <div style={styles.content}>
            <div style={styles.actions}>
              <button style={styles.primaryButton} onClick={() => setView('create')}>
                + New Agent
              </button>
            </div>

            <div style={styles.agentList}>
              {agentsList.length === 0 ? (
                <div style={styles.emptyState}>
                  No agents yet. Create your first agent!
                </div>
              ) : (
                agentsList.map(agent => (
                  <div key={agent.id} style={styles.agentCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.cardIcon}>{agent.icon}</span>
                      <div style={styles.cardInfo}>
                        <div style={styles.cardName}>
                          {agent.name}
                          {agent.isBuiltIn && <span style={styles.badge}>Built-in</span>}
                        </div>
                        <div style={styles.cardDescription}>{agent.description}</div>
                        <div style={styles.cardMeta}>
                          {agent.modelConfig.model} • Temp: {agent.modelConfig.temperature}
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardActions}>
                      {agent.isBuiltIn ? (
                        <button
                          style={styles.warningButton}
                          onClick={() => handleEditBuiltIn(agent)}
                        >
                          🔓 Unlock & Edit
                        </button>
                      ) : (
                        <>
                          <button
                            style={styles.secondaryButton}
                            onClick={() => handleEdit(agent)}
                          >
                            Edit
                          </button>
                          <button
                            style={styles.dangerButton}
                            onClick={() => handleDelete(agent)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'create' && (
          <div style={styles.content}>
            <button style={styles.backButton} onClick={() => {resetForm(); setView('list');}}>
              ← Back
            </button>

            <h3 style={styles.sectionTitle}>Create from Template</h3>
            <div style={styles.templateGrid}>
              {AGENT_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  style={styles.templateCard}
                  onClick={() => handleCreateFromTemplate(template.id)}
                >
                  <div style={styles.templateIcon}>{template.icon}</div>
                  <div style={styles.templateName}>{template.name}</div>
                  <div style={styles.templateDesc}>{template.description}</div>
                </div>
              ))}
            </div>

            <h3 style={styles.sectionTitle}>Or Create Custom Agent</h3>
            <div style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Agent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <textarea
                style={styles.textarea}
                placeholder="System Prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
              />
              <div style={styles.row}>
                <input
                  style={{ ...styles.input, width: '80px' }}
                  type="text"
                  placeholder="Icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                />
              </div>

              <h4 style={styles.subsectionTitle}>🤖 Model Configuration</h4>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>AI Provider *</label>
                {aiProvidersList.length === 0 ? (
                  <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '6px', marginBottom: '12px' }}>
                    <p style={{ margin: 0, color: '#856404' }}>
                      ⚠️ No AI providers configured. Please configure one in AI Provider Settings first.
                    </p>
                  </div>
                ) : (
                  <select
                    style={styles.select}
                    value={providerId}
                    onChange={(e) => {
                      setProviderId(e.target.value);
                      const provider = aiProviders[e.target.value];
                      if (provider && provider.models.length > 0) {
                        setModelName(provider.models[0].name);
                      }
                    }}
                    required
                  >
                    <option value="">Select Provider</option>
                    {aiProvidersList.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Model *</label>
                <select
                  style={styles.select}
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  disabled={!selectedProvider || availableModels.length === 0}
                  required
                >
                  <option value="">Select Model</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.name}>
                      {model.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Temperature: {temperature}
                  <span style={styles.helpText}> (Lower = focused, Higher = creative)</span>
                </label>
                <input
                  style={styles.slider}
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
                <div style={styles.sliderLabels}>
                  <span>Focused (0)</span>
                  <span>Balanced (1)</span>
                  <span>Creative (2)</span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Max Tokens: {maxTokens}
                  <span style={styles.helpText}> (Max response length)</span>
                </label>
                <input
                  style={styles.slider}
                  type="range"
                  min="100"
                  max="8000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                />
                <div style={styles.sliderLabels}>
                  <span>100</span>
                  <span>4000</span>
                  <span>8000</span>
                </div>
              </div>

              <details style={styles.details}>
                <summary style={styles.summary}>Advanced Settings</summary>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Top P: {topP}
                    <span style={styles.helpText}> (Nucleus sampling)</span>
                  </label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Frequency Penalty: {frequencyPenalty}
                    <span style={styles.helpText}> (Reduce repetition)</span>
                  </label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={frequencyPenalty}
                    onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Presence Penalty: {presencePenalty}
                    <span style={styles.helpText}> (Encourage new topics)</span>
                  </label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={presencePenalty}
                    onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                  />
                </div>
              </details>

              <button style={styles.primaryButton} onClick={handleCreateCustom}>
                Create Agent
              </button>
            </div>
          </div>
        )}

        {view === 'edit' && editingAgent && (
          <div style={styles.content}>
            <button style={styles.backButton} onClick={() => {resetForm(); setView('list');}}>
              ← Back
            </button>

            <h3 style={styles.sectionTitle}>Edit Agent</h3>
            <div style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Agent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <textarea
                style={styles.textarea}
                placeholder="System Prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
              />
              <div style={styles.row}>
                <input
                  style={{ ...styles.input, width: '80px' }}
                  type="text"
                  placeholder="Icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                />
              </div>

              <h4 style={styles.subsectionTitle}>🤖 Model Configuration</h4>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>AI Provider *</label>
                {aiProvidersList.length === 0 ? (
                  <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '6px', marginBottom: '12px' }}>
                    <p style={{ margin: 0, color: '#856404' }}>
                      ⚠️ No AI providers configured. Please configure one in AI Provider Settings first.
                    </p>
                  </div>
                ) : (
                  <select
                    style={styles.select}
                    value={providerId}
                    onChange={(e) => {
                      setProviderId(e.target.value);
                      const provider = aiProviders[e.target.value];
                      if (provider && provider.models.length > 0) {
                        setModelName(provider.models[0].name);
                      }
                    }}
                    required
                  >
                    <option value="">Select Provider</option>
                    {aiProvidersList.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Model *</label>
                <select
                  style={styles.select}
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  disabled={!selectedProvider || availableModels.length === 0}
                  required
                >
                  <option value="">Select Model</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.name}>
                      {model.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Temperature: {temperature}
                  <span style={styles.helpText}> (Lower = focused, Higher = creative)</span>
                </label>
                <input
                  style={styles.slider}
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
                <div style={styles.sliderLabels}>
                  <span>Focused (0)</span>
                  <span>Balanced (1)</span>
                  <span>Creative (2)</span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Max Tokens: {maxTokens}
                  <span style={styles.helpText}> (Max response length)</span>
                </label>
                <input
                  style={styles.slider}
                  type="range"
                  min="100"
                  max="8000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                />
                <div style={styles.sliderLabels}>
                  <span>100</span>
                  <span>4000</span>
                  <span>8000</span>
                </div>
              </div>

              <details style={styles.details}>
                <summary style={styles.summary}>Advanced Settings</summary>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Top P: {topP}
                    <span style={styles.helpText}> (Nucleus sampling)</span>
                  </label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Frequency Penalty: {frequencyPenalty}
                    <span style={styles.helpText}> (Reduce repetition)</span>
                  </label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={frequencyPenalty}
                    onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Presence Penalty: {presencePenalty}
                    <span style={styles.helpText}> (Encourage new topics)</span>
                  </label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={presencePenalty}
                    onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                  />
                </div>
              </details>

              <button style={styles.primaryButton} onClick={handleUpdateAgent}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
  },
  closeButton: {
    fontSize: '32px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
    lineHeight: '1',
  },
  content: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
  },
  actions: {
    marginBottom: '20px',
  },
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%',
  },
  secondaryButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  dangerButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  warningButton: {
    padding: '8px 16px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    marginBottom: '20px',
  },
  agentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  agentCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeader: {
    display: 'flex',
    gap: '12px',
    flex: 1,
  },
  cardIcon: {
    fontSize: '32px',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '4px',
    fontWeight: 'normal',
  },
  cardDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
  },
  cardMeta: {
    fontSize: '12px',
    color: '#999',
    fontFamily: 'monospace',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '30px',
  },
  templateCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  templateIcon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  templateName: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  templateDesc: {
    fontSize: '12px',
    color: '#666',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '16px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#666',
  },
  slider: {
    width: '100%',
  },
  subsectionTitle: {
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '12px',
    color: '#333',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '16px',
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    backgroundColor: 'white',
  },
  helpText: {
    fontSize: '11px',
    color: '#999',
    fontWeight: 'normal',
    marginLeft: '8px',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  },
  details: {
    marginTop: '16px',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#666',
    outline: 'none',
    userSelect: 'none',
    marginBottom: '12px',
  },
};

export default AgentManager;

