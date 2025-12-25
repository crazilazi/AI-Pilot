/**
 * 🤖 AGENT REDUCER (Old Single Agent System)
 * 
 * Pure Redux implementation - No Redux Toolkit dependency
 * For backward compatibility with existing components
 */

import { AgentState, Message, AzureOpenAIConfig, MCPConfig } from '../../types';

// Action Types
export const INITIALIZE_AGENT = 'agent/INITIALIZE_AGENT';
export const INITIALIZE_AGENT_SUCCESS = 'agent/INITIALIZE_AGENT_SUCCESS';
export const INITIALIZE_AGENT_FAILURE = 'agent/INITIALIZE_AGENT_FAILURE';
export const SEND_MESSAGE = 'agent/SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'agent/SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'agent/SEND_MESSAGE_FAILURE';
export const CLEAR_MESSAGES = 'agent/CLEAR_MESSAGES';
export const ADD_MESSAGE = 'agent/ADD_MESSAGE';
export const UPDATE_MESSAGE = 'agent/UPDATE_MESSAGE';
export const SET_MCP_CONNECTED = 'agent/SET_MCP_CONNECTED';

// Action Types (TypeScript)
type AgentAction =
  | { type: typeof INITIALIZE_AGENT; payload: { azureConfig: AzureOpenAIConfig; mcpConfig: MCPConfig } }
  | { type: typeof INITIALIZE_AGENT_SUCCESS }
  | { type: typeof INITIALIZE_AGENT_FAILURE; payload: string }
  | { type: typeof SEND_MESSAGE; payload: string }
  | { type: typeof SEND_MESSAGE_SUCCESS; payload: Message }
  | { type: typeof SEND_MESSAGE_FAILURE; payload: string }
  | { type: typeof CLEAR_MESSAGES }
  | { type: typeof ADD_MESSAGE; payload: Message }
  | { type: typeof UPDATE_MESSAGE; payload: { id: string; content: string } }
  | { type: typeof SET_MCP_CONNECTED; payload: boolean };

// Initial State
const initialState: AgentState = {
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
  mcpConnected: false,
};

// Reducer
const agentReducer = (state: AgentState = initialState, action: AgentAction): AgentState => {
  switch (action.type) {
    case INITIALIZE_AGENT:
      return {
        ...state,
        sessionId: `session_${Date.now()}`,
        error: null,
      };

    case INITIALIZE_AGENT_SUCCESS:
      return {
        ...state,
        mcpConnected: true,
        error: null,
      };

    case INITIALIZE_AGENT_FAILURE:
      return {
        ...state,
        error: action.payload,
        mcpConnected: false,
      };

    case SEND_MESSAGE:
      return {
        ...state,
        isLoading: true,
        error: null,
        messages: [
          ...state.messages,
          {
            id: `msg_${Date.now()}`,
            role: 'user',
            content: action.payload,
            timestamp: Date.now(),
          },
        ],
      };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, action.payload],
      };

    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
        error: null,
      };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case UPDATE_MESSAGE: {
      const messageIndex = state.messages.findIndex(m => m.id === action.payload.id);
      if (messageIndex === -1) return state;

      const updatedMessages = [...state.messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: action.payload.content,
      };

      return {
        ...state,
        messages: updatedMessages,
      };
    }

    case SET_MCP_CONNECTED:
      return {
        ...state,
        mcpConnected: action.payload,
      };

    default:
      return state;
  }
};

// Action Creators
export const initializeAgent = (payload: { azureConfig: AzureOpenAIConfig; mcpConfig: MCPConfig }) => ({
  type: INITIALIZE_AGENT as typeof INITIALIZE_AGENT,
  payload,
});

export const initializeAgentSuccess = () => ({
  type: INITIALIZE_AGENT_SUCCESS as typeof INITIALIZE_AGENT_SUCCESS,
});

export const initializeAgentFailure = (error: string) => ({
  type: INITIALIZE_AGENT_FAILURE as typeof INITIALIZE_AGENT_FAILURE,
  payload: error,
});

export const sendMessage = (content: string) => ({
  type: SEND_MESSAGE as typeof SEND_MESSAGE,
  payload: content,
});

export const sendMessageSuccess = (message: Message) => ({
  type: SEND_MESSAGE_SUCCESS as typeof SEND_MESSAGE_SUCCESS,
  payload: message,
});

export const sendMessageFailure = (error: string) => ({
  type: SEND_MESSAGE_FAILURE as typeof SEND_MESSAGE_FAILURE,
  payload: error,
});

export const clearMessages = () => ({
  type: CLEAR_MESSAGES as typeof CLEAR_MESSAGES,
});

export const addMessage = (message: Message) => ({
  type: ADD_MESSAGE as typeof ADD_MESSAGE,
  payload: message,
});

export const updateMessage = (id: string, content: string) => ({
  type: UPDATE_MESSAGE as typeof UPDATE_MESSAGE,
  payload: { id, content },
});

export const setMcpConnected = (connected: boolean) => ({
  type: SET_MCP_CONNECTED as typeof SET_MCP_CONNECTED,
  payload: connected,
});

export default agentReducer;
