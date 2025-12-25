/**
 * 🔌 MCP SERVER MANAGER COMPONENT
 * 
 * 🎯 WHAT IS THIS?
 * This is the control panel for managing helper servers (MCP servers)!
 * Think of it as a "Phone Book Manager" for robot helper services!
 * 
 * 🎨 WHAT YOU SEE:
 * - List View: Shows all your helper servers
 * - Add View: Form to add a new server
 * - Edit View: Form to change server settings
 * - Import/Export: Share server configurations
 * 
 * 🛠️ FEATURES:
 * - Add new MCP servers (give them tools!)
 * - Edit server details (name, URL, token)
 * - Delete servers you don't need
 * - Enable/disable servers (turn on/off)
 * - Test server connections
 * - Import/export server configs (share with friends!)
 * - See connection status (connected/disconnected)
 * - View available tools from each server
 * 
 * 📊 PROPS:
 * - onClose: Function to close this panel
 * 
 * 💭 THINK OF IT LIKE:
 * A contact list for helpful robots that give your AI special powers!
 * You can add new contacts, edit them, or turn them on/off!
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addMCPServer,
  updateMCPServer,
  deleteMCPServer,
  toggleServerEnabled,
  setServerStatus,
  loadMCPServers,
} from '../redux/slices/mcpServersSlice';
import { MCPServer } from '../types/multiAgent';
import mcpManagerService from '../services/mcpManagerService';

// 📋 COMPONENT PROPS - What this component needs
interface MCPServerManagerProps {
  onClose: () => void;  // 🚪 Function to close the manager
}

const MCPServerManager: React.FC<MCPServerManagerProps> = ({ onClose }) => {
  // 🎮 REDUX HOOKS - Connect to the store
  const dispatch = useDispatch();  // 📤 Send actions to store
  const { servers } = useSelector((state: RootState) => state.mcpServers);  // 📖 Read servers from store
  
  // 🎨 VIEW STATE - Which screen are we showing?
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'import'>('list');  // 👁️ Current view
  const [editingServer, setEditingServer] = useState<MCPServer | null>(null);  // ✏️ Server being edited

  // 📝 FORM STATE - Server details
  const [name, setName] = useState('');              // 📛 Server name
  const [endpoint, setEndpoint] = useState('');      // 🔗 Server URL
  const [bearerToken, setBearerToken] = useState(''); // 🔑 Access token
  const [description, setDescription] = useState(''); // 📄 Server description
  const [importJson, setImportJson] = useState('');  // 📥 Import data
  const [exportJson, setExportJson] = useState('');  // 📤 Export data

  const serversList = Object.values(servers);  // 📚 Convert dictionary to list

  /**
   * 🚀 INITIALIZE - Load servers when component mounts
   * Like opening your phone contacts when you open the app!
   */
  useEffect(() => {
    // Load servers from service
    const loadedServers = mcpManagerService.getAllServers();
    dispatch(loadMCPServers(loadedServers));
  }, [dispatch]);

  const resetForm = () => {
    setName('');
    setEndpoint('');
    setBearerToken('');
    setDescription('');
    setEditingServer(null);
  };

  const handleAdd = () => {
    if (!name.trim() || !endpoint.trim()) {
      alert('Name and endpoint are required');
      return;
    }

    const newServer: MCPServer = {
      id: `server_${Date.now()}`,
      name,
      endpoint,
      bearerToken,
      isEnabled: true,
      status: 'disconnected',
      tools: [],
      metadata: {
        description: description || undefined,
      },
    };

    mcpManagerService.addServer(newServer);
    dispatch(addMCPServer(newServer));
    resetForm();
    setView('list');
  };

  const handleEdit = (server: MCPServer) => {
    setEditingServer(server);
    setName(server.name);
    setEndpoint(server.endpoint);
    setBearerToken(server.bearerToken);
    setDescription(server.metadata?.description || '');
    setView('edit');
  };

  const handleUpdate = () => {
    if (!editingServer || !name.trim() || !endpoint.trim()) {
      alert('Name and endpoint are required');
      return;
    }

    const updates: Partial<MCPServer> = {
      name,
      endpoint,
      bearerToken,
      metadata: {
        ...editingServer.metadata,
        description: description || undefined,
      },
    };

    mcpManagerService.updateServer(editingServer.id, updates);
    dispatch(updateMCPServer({ id: editingServer.id, updates }));
    resetForm();
    setView('list');
  };

  const handleDelete = (server: MCPServer) => {
    if (!confirm(`Are you sure you want to delete "${server.name}"?`)) {
      return;
    }

    mcpManagerService.deleteServer(server.id);
    dispatch(deleteMCPServer(server.id));
  };

  const handleToggle = async (server: MCPServer) => {
    mcpManagerService.toggleServer(server.id);
    dispatch(toggleServerEnabled(server.id));

    // If enabling, try to connect
    if (!server.isEnabled) {
      dispatch(setServerStatus({ id: server.id, status: 'connecting' }));
      const success = await mcpManagerService.connectServer(server.id);
      dispatch(setServerStatus({ 
        id: server.id, 
        status: success ? 'connected' : 'error' 
      }));
    }
  };

  const handleConnect = async (server: MCPServer) => {
    dispatch(setServerStatus({ id: server.id, status: 'connecting' }));
    const success = await mcpManagerService.connectServer(server.id);
    dispatch(setServerStatus({ 
      id: server.id, 
      status: success ? 'connected' : 'error' 
    }));
  };

  const handleExport = () => {
    const json = mcpManagerService.exportServers();
    setExportJson(json);
    setView('import'); // Reuse import view for export
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      alert('Please paste JSON configuration');
      return;
    }

    try {
      const servers: MCPServer[] = JSON.parse(importJson);
      
      if (!Array.isArray(servers)) {
        throw new Error('Invalid format: expected array of servers');
      }

      // Import each server
      servers.forEach(serverData => {
        const newServer: MCPServer = {
          ...serverData,
          id: `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'disconnected',
          tools: [],
          isEnabled: false, // Start disabled for safety
        };

        mcpManagerService.addServer(newServer);
        dispatch(addMCPServer(newServer));
      });

      alert(`Successfully imported ${servers.length} server(s)`);
      setImportJson('');
      setView('list');
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    }
  };

  const getStatusColor = (status: MCPServer['status']) => {
    switch (status) {
      case 'connected': return '#4caf50';
      case 'connecting': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusText = (status: MCPServer['status']) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>MCP Server Manager</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {view === 'list' && (
          <div style={styles.content}>
            <div style={styles.actions}>
              <button style={styles.primaryButton} onClick={() => setView('add')}>
                + Add Server
              </button>
              <button style={styles.secondaryButton} onClick={() => setView('import')}>
                📥 Import JSON
              </button>
              <button style={styles.secondaryButton} onClick={handleExport}>
                📤 Export JSON
              </button>
            </div>

            <div style={styles.serverList}>
              {serversList.length === 0 ? (
                <div style={styles.emptyState}>
                  No MCP servers configured. Add one to get started!
                </div>
              ) : (
                serversList.map(server => (
                  <div key={server.id} style={styles.serverCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardInfo}>
                        <div style={styles.cardName}>
                          {server.name}
                          <span 
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(server.status),
                            }}
                          >
                            {getStatusText(server.status)}
                          </span>
                        </div>
                        <div style={styles.cardEndpoint}>{server.endpoint}</div>
                        {server.metadata?.description && (
                          <div style={styles.cardDescription}>
                            {server.metadata.description}
                          </div>
                        )}
                        <div style={styles.cardMeta}>
                          Tools: {server.tools.length} • 
                          Last connected: {server.lastConnected 
                            ? new Date(server.lastConnected).toLocaleString()
                            : 'Never'}
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardActions}>
                      <label style={styles.toggleContainer}>
                        <input
                          type="checkbox"
                          checked={server.isEnabled}
                          onChange={() => handleToggle(server)}
                          style={styles.checkbox}
                        />
                        <span style={styles.toggleLabel}>
                          {server.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                      {server.isEnabled && server.status !== 'connected' && (
                        <button
                          style={styles.connectButton}
                          onClick={() => handleConnect(server)}
                        >
                          Connect
                        </button>
                      )}
                      <button
                        style={styles.secondaryButton}
                        onClick={() => handleEdit(server)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.dangerButton}
                        onClick={() => handleDelete(server)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'add' && (
          <div style={styles.content}>
            <button style={styles.backButton} onClick={() => {resetForm(); setView('list');}}>
              ← Back
            </button>

            <h3 style={styles.sectionTitle}>Add MCP Server</h3>
            <div style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Server Name (e.g., My MCP Server)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Endpoint URL (e.g., https://localhost:5001/mcp)"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Bearer Token (optional)"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
              />
              <textarea
                style={styles.textarea}
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <button style={styles.primaryButton} onClick={handleAdd}>
                Add Server
              </button>
            </div>
          </div>
        )}

        {view === 'edit' && editingServer && (
          <div style={styles.content}>
            <button style={styles.backButton} onClick={() => {resetForm(); setView('list');}}>
              ← Back
            </button>

            <h3 style={styles.sectionTitle}>Edit MCP Server</h3>
            <div style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Server Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Endpoint URL"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Bearer Token"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
              />
              <textarea
                style={styles.textarea}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <button style={styles.primaryButton} onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        )}

        {view === 'import' && (
          <div style={styles.content}>
            <button style={styles.backButton} onClick={() => {setImportJson(''); setExportJson(''); setView('list');}}>
              ← Back
            </button>

            {exportJson ? (
              <>
                <h3 style={styles.sectionTitle}>Export MCP Servers (JSON)</h3>
                <p style={styles.helpText}>
                  Copy this JSON to import on another machine. Bearer tokens are removed for security.
                </p>
                <textarea
                  style={styles.jsonTextarea}
                  value={exportJson}
                  readOnly
                  rows={15}
                  onClick={(e) => e.currentTarget.select()}
                />
                <button 
                  style={styles.primaryButton}
                  onClick={() => {
                    navigator.clipboard.writeText(exportJson);
                    alert('Copied to clipboard!');
                  }}
                >
                  📋 Copy to Clipboard
                </button>
              </>
            ) : (
              <>
                <h3 style={styles.sectionTitle}>Import MCP Servers (JSON)</h3>
                <p style={styles.helpText}>
                  Paste your MCP server configuration JSON below. Format:
                </p>
                <pre style={styles.codeBlock}>{`[
  {
    "name": "My Server",
    "endpoint": "https://example.com/mcp",
    "bearerToken": "your-token-here",
    "metadata": {
      "description": "Description here"
    }
  }
]`}</pre>
                <textarea
                  style={styles.jsonTextarea}
                  placeholder="Paste JSON here..."
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  rows={15}
                />
                <button style={styles.primaryButton} onClick={handleImport}>
                  Import Servers
                </button>
              </>
            )}
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
    display: 'flex',
    gap: '10px',
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
    flex: 1,
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
  connectButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
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
  serverList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  serverCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  cardHeader: {
    flex: 1,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusBadge: {
    fontSize: '11px',
    padding: '3px 8px',
    color: 'white',
    borderRadius: '4px',
    fontWeight: 'normal',
  },
  cardEndpoint: {
    fontSize: '13px',
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: '8px',
    wordBreak: 'break-all',
  },
  cardDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
  },
  cardMeta: {
    fontSize: '12px',
    color: '#999',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '120px',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  checkbox: {
    cursor: 'pointer',
  },
  toggleLabel: {
    fontSize: '13px',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '16px',
    color: '#333',
  },
  helpText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
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
  jsonTextarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    resize: 'vertical',
    width: '100%',
    marginBottom: '12px',
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    overflow: 'auto',
    marginBottom: '12px',
    border: '1px solid #ddd',
  },
};

export default MCPServerManager;
