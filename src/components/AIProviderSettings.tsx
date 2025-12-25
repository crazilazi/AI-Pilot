/**
 * 🔧 AI PROVIDER SETTINGS COMPONENT
 * 
 * Configuration screen for managing AI provider endpoints and models
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { AIProvidersDispatcher } from '../redux/dispatchers/aiProvidersDispatchers';
import { AIProvider, AIProviderModel } from '../types/aiProvider';
import '../styles/AIProviderSettings.css';

export const AIProviderSettings: React.FC = () => {
  const dispatch = useDispatch();
  const dispatcher = new AIProvidersDispatcher(dispatch);
  
  const { providers, activeProviderId, isLoading, error } = useSelector(
    (state: RootState) => state.aiProviders
  );

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AIProvider>>({
    name: '',
    endpoint: '',
    models: [],
  });

  const [newModel, setNewModel] = useState<Partial<AIProviderModel>>({
    name: '',
    displayName: '',
  });

  useEffect(() => {
    dispatcher.fetchAIProviders();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const provider: AIProvider = {
      id: editingId || `provider-${Date.now()}`,
      name: formData.name!,
      endpoint: formData.endpoint!,
      models: formData.models || [],
      isActive: false,
      isDefault: Object.keys(providers).length === 0,
      createdAt: editingId ? providers[editingId].createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (editingId) {
      dispatcher.updateAIProvider(editingId, provider);
    } else {
      dispatcher.createAIProvider(provider);
    }

    resetForm();
  };

  const handleEdit = (provider: AIProvider) => {
    setEditingId(provider.id);
    setFormData({
      name: provider.name,
      endpoint: provider.endpoint,
      models: provider.models,
    });
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      dispatcher.deleteAIProvider(id);
    }
  };

  const handleSetActive = (id: string) => {
    dispatcher.setActiveProvider(id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      endpoint: '',
      models: [],
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleAddModel = () => {
    if (!newModel.name || !newModel.displayName) {
      alert('Please fill in model name and display name');
      return;
    }

    const model: AIProviderModel = {
      id: `model-${Date.now()}`,
      name: newModel.name!,
      displayName: newModel.displayName!,
    };

    setFormData({
      ...formData,
      models: [...(formData.models || []), model],
    });

    setNewModel({
      name: '',
      displayName: '',
    });
  };

  const handleRemoveModel = (modelId: string) => {
    setFormData({
      ...formData,
      models: formData.models?.filter(m => m.id !== modelId),
    });
  };

  if (isLoading && Object.keys(providers).length === 0) {
    return <div className="loading">Loading providers...</div>;
  }

  return (
    <div className="ai-provider-settings">
      <div className="settings-header">
        <h2>🔧 AI Provider Settings</h2>
        <button
          className="btn-primary"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Cancel' : '+ Add Provider'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => dispatcher.clearError()}>✕</button>
        </div>
      )}

      {isFormVisible && (
        <div className="provider-form">
          <h3>{editingId ? 'Edit Provider' : 'Add New Provider'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Provider Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Azure OpenAI Production"
                required
              />
            </div>

            <div className="form-group">
              <label>Endpoint URL *</label>
              <input
                type="url"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                placeholder="https://your-resource.openai.azure.com"
                required
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                For Azure: https://your-resource.openai.azure.com<br/>
                For OpenAI: https://api.openai.com/v1
              </small>
            </div>

            <div className="models-section">
              <h4>Models</h4>
              <div className="models-list">
                {formData.models?.map(model => (
                  <div key={model.id} className="model-item">
                    <span>{model.displayName} ({model.name})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveModel(model.id)}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-model-form">
                <input
                  type="text"
                  placeholder="Model Name (e.g., gpt-4)"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Display Name (e.g., GPT-4)"
                  value={newModel.displayName}
                  onChange={(e) => setNewModel({ ...newModel, displayName: e.target.value })}
                />
                <button type="button" onClick={handleAddModel} className="btn-secondary">
                  + Add Model
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Provider' : 'Create Provider'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="providers-list">
        <h3>Configured Providers</h3>
        {Object.values(providers).length === 0 ? (
          <div className="empty-state">
            <p>No providers configured yet.</p>
            <p>Click "Add Provider" to configure your first AI provider.</p>
          </div>
        ) : (
          <div className="providers-grid">
            {Object.values(providers).map(provider => (
              <div
                key={provider.id}
                className={`provider-card ${provider.isActive ? 'active' : ''}`}
              >
                <div className="provider-header">
                  <h4>{provider.name}</h4>
                  {provider.isActive && <span className="badge-active">Active</span>}
                </div>

                <div className="provider-details">
                  <div className="detail-row">
                    <span className="label">Endpoint:</span>
                    <span className="value">{provider.endpoint}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Models:</span>
                    <span className="value">{provider.models.length}</span>
                  </div>
                </div>

                <div className="provider-models">
                  {provider.models.map(model => (
                    <span key={model.id} className="model-badge">
                      {model.displayName}
                    </span>
                  ))}
                </div>

                <div className="provider-actions">
                  {!provider.isActive && (
                    <button
                      onClick={() => handleSetActive(provider.id)}
                      className="btn-secondary"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(provider)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(provider.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="settings-note">
        <h4>📝 Note about API Keys</h4>
        <p>
          API keys should be configured via environment variables for security:
        </p>
        <code>AI_PROVIDER_API_KEY=your-api-key</code>
        <p>
          This keeps sensitive credentials out of the database and localStorage.
        </p>
      </div>
    </div>
  );
};

export default AIProviderSettings;
