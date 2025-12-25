/**
 * 💬 CHAT INTERFACE COMPONENT (Main Screen!)
 * 
 * 🎯 WHAT IS THIS?
 * This is the MAIN SCREEN of the app - where you talk to your AI robots!
 * Think of it as the "Conversation Room" where you chat with your robot friends!
 * 
 * 🎨 WHAT YOU SEE:
 * - Header with robot selector
 * - Chat messages (your messages + robot's responses)
 * - Input box at the bottom to type
 * - Send button
 * - Connected servers and tools count
 * - Loading spinner when robot is thinking
 * - Error messages if something goes wrong
 * 
 * 🛠️ FEATURES:
 * - Send messages to active robot
 * - See chat history (scrolls automatically)
 * - Clear chat to start fresh
 * - Switch between robots
 * - Manage robots (opens Agent Manager)
 * - Manage helper servers (opens MCP Manager)
 * - Shows which servers are connected
 * - Shows how many tools are available
 * 
 * 📊 STATE MANAGEMENT:
 * Uses Redux store for:
 * - Messages (chat history)
 * - Loading state (is robot thinking?)
 * - Errors (any problems?)
 * - Active robot (which one is talking?)
 * - Connected servers (helper tools)
 * 
 * 💭 THINK OF IT LIKE:
 * A text messaging app, but instead of texting friends,
 * you're talking to smart robot assistants with special abilities!
 */

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { sendMessage, clearMessages } from '../redux/slices/agentSlice';
import { loadAgents } from '../redux/slices/agentsSlice';
import { loadMCPServers } from '../redux/slices/mcpServersSlice';
import AgentSelector from './AgentSelector';
import AgentManager from './AgentManager';
import MCPServerManager from './MCPServerManager';
import AIProviderSettings from './AIProviderSettings';
import MessageRenderer from './MessageRenderer';
import agentManagerService from '../services/agentManagerService';
import mcpManagerService from '../services/mcpManagerService';

const ChatInterface: React.FC = () => {
  // 🎮 REDUX HOOKS - Connect to the store
  const dispatch = useDispatch();  // 📤 Send actions to store
  
  // 📖 READ DATA FROM STORE
  const { messages, isLoading, error, mcpConnected } = useSelector(
    (state: RootState) => state.agent
  );
  const { activeAgentId, agents } = useSelector((state: RootState) => state.agents);
  const { servers } = useSelector((state: RootState) => state.mcpServers);
  
  // 🎨 LOCAL STATE - Component-specific state
  const [input, setInput] = useState('');  // 📝 What user is typing
  const [showAgentManager, setShowAgentManager] = useState(false);  // 🛠️ Show robot manager?
  const [showMCPManager, setShowMCPManager] = useState(false);  // 🔌 Show server manager?
  const [showAIProviderSettings, setShowAIProviderSettings] = useState(false);  // 🔧 Show AI provider settings?
  const messagesEndRef = useRef<HTMLDivElement>(null);  // 📍 Reference to bottom of chat

  // 📊 COMPUTED VALUES
  const activeAgent = activeAgentId ? agents[activeAgentId] : null;  // 🤖 Current robot
  const connectedServers = Object.values(servers).filter(s => s.status === 'connected');  // 🔌 Connected servers
  const totalTools = connectedServers.reduce((sum, server) => sum + server.tools.length, 0);  // 🛠️ Total tools

  // ============================================
  // 🎬 INITIALIZATION - Run once when component loads
  // ============================================
  
  /**
   * 🚀 INITIALIZE APP - Load saved data when app starts
   * Like opening your toy box and notebook when you wake up!
   */
  useEffect(() => {
    agentManagerService.initialize();  // 📖 Load saved robots
    mcpManagerService.initialize();  // 📖 Load saved servers
    
    const agents = agentManagerService.getAllAgents();  // 🤖 Get all robots
    const servers = mcpManagerService.getAllServers();  // 🔌 Get all servers
    
    dispatch(loadAgents(agents));  // 📤 Put robots in Redux store
    dispatch(loadMCPServers(servers));  // 📤 Put servers in Redux store
  }, [dispatch]);

  /**
   * 📜 AUTO-SCROLL - Scroll to bottom when new messages arrive
   * Like always looking at the newest message!
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================
  // 🎮 EVENT HANDLERS - User actions
  // ============================================

  /**
   * 📤 SEND MESSAGE - Send user's message to AI
   * Like pressing the send button in a text message app!
   */
  const handleSend = () => {
    if (input.trim() && !isLoading) {  // ✅ Only send if there's text and not loading
      dispatch(sendMessage(input));  // 📤 Send to Redux (epic will handle AI call)
      setInput('');  // 🧹 Clear input box
    }
  };

  /**
   * ⌨️ HANDLE KEYBOARD - Send message when Enter is pressed
   * Like hitting send with the Enter key instead of clicking!
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {  // ✅ Enter alone (not Shift+Enter)
      e.preventDefault();  // 🛑 Don't add a new line
      handleSend();  // 📤 Send the message
    }
  };

  // ============================================
  // 🎨 RENDER - What you see on screen
  // ============================================

  return (
    <div style={styles.container}>
      {/* 📋 HEADER - Top bar with title and controls */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Azure OpenAI Multi-Agent Platform</h2>
          <div style={styles.statusContainer}>
            {/* 📊 MCP STATUS - Show connected servers */}
            <div style={styles.status}>
              <span style={{ ...styles.indicator, backgroundColor: connectedServers.length > 0 ? '#4caf50' : '#f44336' }} />
              <span style={styles.statusText}>
                MCP: {connectedServers.length} / {Object.values(servers).length} ({totalTools} tools)
              </span>
            </div>
            {/* 🔌 MCP BUTTON - Open server manager */}
            <button style={styles.mcpButton} onClick={() => setShowMCPManager(true)}>
              🔌 MCP Servers
            </button>
            {/* 🔧 AI PROVIDER BUTTON - Open AI provider settings */}
            <button style={styles.providerButton} onClick={() => setShowAIProviderSettings(true)}>
              🔧 AI Providers
            </button>
            {/* 🗑️ CLEAR BUTTON - Clear chat history */}
            <button style={styles.clearButton} onClick={() => dispatch(clearMessages())}>
              Clear Chat
            </button>
          </div>
        </div>
        
        {/* Agent Info Bar */}
        {activeAgent && (
          <div style={styles.agentInfoBar}>
            <div style={styles.agentInfo}>
              <span style={styles.agentIcon}>{activeAgent.icon}</span>
              <div>
                <div style={styles.agentName}>
                  Active Agent: {activeAgent.name}
                </div>
                <div style={styles.agentDetails}>
                  Model: {activeAgent.modelConfig.model} • 
                  Temp: {activeAgent.modelConfig.temperature} • 
                  Max Tokens: {activeAgent.modelConfig.maxTokens}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Agent Selector */}
        <div style={styles.agentSelectorContainer}>
          <AgentSelector onManageAgents={() => setShowAgentManager(true)} />
        </div>
      </div>

      <div style={styles.messagesContainer}>
        {messages.filter(msg => msg.role !== 'system').map((message) => {
          // Get agent info for assistant messages
          const displayName = message.role === 'user' 
            ? 'You' 
            : (activeAgent?.name || 'Assistant');
          const displayIcon = message.role === 'user' 
            ? '👤' 
            : (activeAgent?.icon || '🤖');

          return (
            <div
              key={message.id}
              style={{
                ...styles.message,
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: message.role === 'user' ? '#1f2937' : '#0d1117',
                  border: message.role === 'user' ? '1px solid #374151' : '1px solid #30363d',
                }}
              >
                <div style={styles.messageRole}>
                  <span style={styles.roleIcon}>{displayIcon}</span>
                  {displayName}
                </div>
                <MessageRenderer content={message.content} role={message.role} />
                <div style={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>
              <span style={styles.loadingDot}>●</span>
              <span style={styles.loadingDot}>●</span>
              <span style={styles.loadingDot}>●</span>
              <span style={styles.loadingLabel}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.inputContainer}>
        <textarea
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={3}
          disabled={isLoading}
        />
        <button
          style={{
            ...styles.sendButton,
            opacity: isLoading || !input.trim() ? 0.5 : 1,
          }}
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </div>

      {/* Agent Manager Modal */}
      {showAgentManager && (
        <AgentManager onClose={() => setShowAgentManager(false)} />
      )}

      {/* MCP Server Manager Modal */}
      {showMCPManager && (
        <MCPServerManager onClose={() => setShowMCPManager(false)} />
      )}

      {/* AI Provider Settings Modal */}
      {showAIProviderSettings && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowAIProviderSettings(false)}
            >
              ✕ Close
            </button>
            <AIProviderSettings />
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#0d1117',
  },
  header: {
    padding: '20px',
    backgroundColor: '#161b22',
    borderBottom: '1px solid #30363d',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    margin: 0,
    color: '#e6edf3',
    fontSize: '24px',
    fontWeight: '600',
  },
  agentSelectorContainer: {
    marginTop: '12px',
  },
  agentInfoBar: {
    padding: '12px 20px',
    backgroundColor: '#0d1117',
    borderBottom: '1px solid #30363d',
  },
  agentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  agentIcon: {
    fontSize: '24px',
  },
  agentName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#e6edf3',
  },
  agentDetails: {
    fontSize: '12px',
    color: '#8b949e',
    marginTop: '2px',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '14px',
    color: '#8b949e',
  },
  clearButton: {
    padding: '8px 16px',
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    border: '1px solid #30363d',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  mcpButton: {
    padding: '8px 16px',
    backgroundColor: '#238636',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  providerButton: {
    padding: '8px 16px',
    backgroundColor: '#0969da',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  } as React.CSSProperties,
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  } as React.CSSProperties,
  closeButton: {
    position: 'sticky',
    top: 0,
    right: 0,
    float: 'right',
    margin: '16px',
    padding: '8px 16px',
    backgroundColor: '#f44',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 10,
  } as React.CSSProperties,
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#0d1117',
  },
  message: {
    display: 'flex',
    maxWidth: '85%',
  },
  messageBubble: {
    padding: '16px',
    borderRadius: '8px',
    wordWrap: 'break-word',
    width: '100%',
  },
  messageRole: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#8b949e',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  roleIcon: {
    fontSize: '14px',
  },
  messageTime: {
    fontSize: '11px',
    marginTop: '8px',
    color: '#6e7681',
  },
  loadingContainer: {
    display: 'flex',
    alignSelf: 'flex-start',
    padding: '16px',
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#8b949e',
    fontSize: '14px',
  },
  loadingDot: {
    fontSize: '20px',
    color: '#58a6ff',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingLabel: {
    marginLeft: '4px',
  },
  error: {
    padding: '12px 20px',
    backgroundColor: '#da3633',
    color: '#ffffff',
    borderTop: '1px solid #f85149',
    fontSize: '14px',
  },
  inputContainer: {
    padding: '20px',
    backgroundColor: '#161b22',
    borderTop: '1px solid #30363d',
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #30363d',
    borderRadius: '6px',
    fontSize: '14px',
    resize: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    backgroundColor: '#0d1117',
    color: '#e6edf3',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  sendButton: {
    padding: '12px 24px',
    backgroundColor: '#238636',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
  },
};

export default ChatInterface;
