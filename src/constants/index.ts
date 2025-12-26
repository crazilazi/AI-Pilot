/**
 * 🎯 APPLICATION CONSTANTS
 * 
 * This file stores all the magic strings and numbers used in the app.
 * Think of it as a "dictionary" where we keep important words and values.
 * 
 * WHY? So we don't repeat the same values everywhere and can change them in one place!
 */

// ============================================
// 🗄️ LOCAL STORAGE KEYS
// These are like "labels" on boxes where we store data in the browser
// ============================================

export const STORAGE_KEYS = {
  AGENTS: 'aipilot-ai-agents',           // Box for all our AI agents
  MCP_SERVERS: 'aipilot-ai-mcp-servers', // Box for MCP server connections
} as const;

// ============================================
// 🎨 UI CONFIGURATION
// Settings for how things look on screen
// ============================================

export const UI_CONFIG = {
  // How long to show the "Copied!" message (in milliseconds)
  COPY_SUCCESS_DURATION: 2000, // 2 seconds

  // Maximum width of chat messages (as percentage)
  MESSAGE_MAX_WIDTH: '85%',

  // How many messages to show at once (for future pagination)
  MESSAGES_PER_PAGE: 50,
} as const;

// ============================================
// 🤖 AGENT CONFIGURATION
// Default settings for AI agents
// ============================================

export const AGENT_CONFIG = {
  // Default AI model settings
  DEFAULT_TEMPERATURE: 0.7,      // How creative the AI is (0 = precise, 1 = creative)
  DEFAULT_MAX_TOKENS: 2000,      // Maximum length of response
  DEFAULT_TOP_P: 1,              // Nucleus sampling parameter
  DEFAULT_FREQUENCY_PENALTY: 0,  // Avoid repeating words
  DEFAULT_PRESENCE_PENALTY: 0,   // Encourage new topics

  // Default icons for different types
  DEFAULT_ICON: '⭐',
  USER_ICON: '👤',
  ASSISTANT_ICON: '🤖',
} as const;

// ============================================
// 🎨 COLOR SCHEME (GitHub Dark Theme)
// All colors used in the app in one place
// ============================================

export const COLORS = {
  // Background colors
  BACKGROUND_PRIMARY: '#0d1117',    // Main dark background
  BACKGROUND_SECONDARY: '#161b22',  // Slightly lighter (for cards)
  BACKGROUND_TERTIARY: '#21262d',   // Even lighter (for hover states)

  // Border colors
  BORDER_PRIMARY: '#30363d',        // Main border color
  BORDER_SECONDARY: '#21262d',      // Lighter borders

  // Text colors
  TEXT_PRIMARY: '#e6edf3',          // Main text (white-ish)
  TEXT_SECONDARY: '#8b949e',        // Muted text (gray)
  TEXT_TERTIARY: '#6e7681',         // Even more muted

  // Accent colors
  ACCENT_BLUE: '#58a6ff',           // Links and highlights
  ACCENT_GREEN: '#238636',          // Success states
  ACCENT_RED: '#da3633',            // Error states

  // Message bubble colors
  USER_MESSAGE_BG: '#1f2937',       // User message background
  USER_MESSAGE_BORDER: '#374151',   // User message border
  ASSISTANT_MESSAGE_BG: '#0d1117', // AI message background
  ASSISTANT_MESSAGE_BORDER: '#30363d', // AI message border

  // Code block colors
  CODE_BACKGROUND: '#161b22',       // Code block background
  CODE_INLINE_BG: 'rgba(110, 118, 129, 0.4)', // Inline code background
} as const;

// ============================================
// 📝 MESSAGE TYPES
// Different types of messages in the chat
// ============================================

export const MESSAGE_ROLES = {
  USER: 'user',           // Message from the human
  ASSISTANT: 'assistant', // Message from the AI
  SYSTEM: 'system',       // System instructions (hidden from user)
} as const;

// ============================================
// 🌐 MCP SERVER STATUS
// Different states a server can be in
// ============================================

export const MCP_SERVER_STATUS = {
  CONNECTED: 'connected',       // Successfully connected
  DISCONNECTED: 'disconnected', // Not connected
  CONNECTING: 'connecting',     // Trying to connect
  ERROR: 'error',              // Connection failed
} as const;

// ============================================
// 🔧 API CONFIGURATION
// Settings for Azure OpenAI API
// ============================================

export const API_CONFIG = {
  // Default API version for Azure OpenAI
  DEFAULT_API_VERSION: '2024-02-15-preview',

  // Request timeout (in milliseconds)
  REQUEST_TIMEOUT: 60000, // 60 seconds
} as const;

/**
 * 💡 HOW TO USE THESE CONSTANTS:
 * 
 * Instead of writing:
 *   localStorage.getItem('aipilot-ai-agents')
 * 
 * Write:
 *   localStorage.getItem(STORAGE_KEYS.AGENTS)
 * 
 * Benefits:
 * - No typos!
 * - Easy to change
 * - TypeScript autocomplete
 * - Better maintenance
 */
