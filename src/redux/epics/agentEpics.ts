/**
 * 🔮 AGENT EPICS (Background Workers!)
 * 
 * 🎯 WHAT IS THIS?
 * These are "Epic Workers" - special helpers that handle complex, time-consuming tasks!
 * Think of them as helper elves who do the hard work while you wait!
 * 
 * 🤔 WHY DO WE NEED THEM?
 * Some tasks take time and can't be done instantly:
 * - ⏳ Calling the AI (takes seconds to respond)
 * - ⏳ Connecting to servers  
 * - ⏳ Using tools (requires network calls)
 * 
 * Regular Redux can't handle "waiting" - but epics can!
 * 
 * 🎨 WHAT DO THEY DO?
 * 1. **initializeAgentEpic** - Start up robot & connect services
 * 2. **sendMessageEpic** - Send message to AI & get response (complex!)
 * 
 * 💭 HOW THEY WORK:
 * 1. Watch for specific actions (like a security guard watching for events)
 * 2. When action arrives, do the complex work
 * 3. When done, dispatch a new action with the result
 * 
 * 🌊 USING RXJS:
 * Epics use "Observables" - think of them like rivers of events:
 * - Actions flow through like water
 * - We catch specific actions
 * - Do work with them
 * - Send new actions downstream
 */

import { ofType, StateObservable } from 'redux-observable';
import { from, of, concat } from 'rxjs';
import { mergeMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import {
  INITIALIZE_AGENT,
  SEND_MESSAGE,
  initializeAgent,
  initializeAgentSuccess,
  initializeAgentFailure,
  sendMessage,
  sendMessageSuccess,
  sendMessageFailure,
} from '../slices/agentSlice';
import azureOpenAIService from '../../services/azureOpenAIService';
import mcpService from '../../services/mcpService';
import mcpManagerService from '../../services/mcpManagerService';
import { Message } from '../../types';

// ============================================
// 🔌 INITIALIZE AGENT EPIC
// ============================================

/**
 * 🔌 INITIALIZE AGENT EPIC - Start the Robot!
 * 
 * 🤔 WHAT DOES IT DO?
 * Watches for initializeAgent actions and sets up connections.
 * Like turning on a robot and connecting it to WiFi!
 * 
 * 🌊 FLOW:
 * 1. User clicks "Initialize"
 * 2. initializeAgent action dispatched
 * 3. Epic catches it (this function!)
 * 4. Call azureOpenAIService.initialize()
 * 5. Call mcpService.initialize()
 * 6. If success → initializeAgentSuccess
 *    If failure → still success (MCP optional)
 * 
 * 📝 EXAMPLE:
 * Action: initializeAgent({ azureConfig: {...}, mcpConfig: {...} })
 * → Initialize Azure AI
 * → Try to initialize MCP
 * → Dispatch: initializeAgentSuccess()
 * 
 * 💡 NOTE: MCP failure is OK - we continue without it!
 */
export const initializeAgentEpic = (action$: any) =>
  action$.pipe(
    // 👀 Watch for initializeAgent actions
    ofType(INITIALIZE_AGENT),
    
    // 🔄 For each action, do this work:
    mergeMap((action: ReturnType<typeof initializeAgent>) => {
      const { azureConfig, mcpConfig } = action.payload;

      // 🧠 Initialize Azure OpenAI (required!)
      azureOpenAIService.initialize(azureConfig);

      // 🔌 Try to initialize MCP (optional - don't fail if it doesn't work!)
      return from(mcpService.initialize(mcpConfig)).pipe(
        // ✅ Success path
        map(() => {
          console.log('Agent initialized with MCP support');
          return initializeAgentSuccess();
        }),
        
        // ❌ Error path (but still continue!)
        catchError((error) => {
          console.warn('MCP initialization failed, continuing without MCP:', error);
          // Still return success - MCP is optional!
          return of(initializeAgentSuccess());
        })
      );
    })
  );

// ============================================
// 💬 SEND MESSAGE EPIC (The Complex One!)
// ============================================

/**
 * 💬 SEND MESSAGE EPIC - Handle AI Conversations!
 * 
 * 🤔 WHAT DOES IT DO?
 * This is the MOST COMPLEX epic! It handles sending your message to AI and getting responses.
 * It also handles tool calls if AI needs to use special abilities!
 * 
 * 🌊 FLOW (Simplified):
 * 1. User types message and clicks Send
 * 2. sendMessage action dispatched
 * 3. Epic catches it
 * 4. Get active robot & its settings
 * 5. Get available tools from servers
 * 6. Add robot's system prompt
 * 7. Call AI with everything
 * 8. AI responds (streaming word-by-word)
 * 9. Does AI want to use a tool?
 *    YES → Call tool → Send results back to AI → Get final response
 *    NO → Just return AI's response
 * 10. Dispatch sendMessageSuccess with response
 * 
 * 🛠️ TOOL CALLING EXAMPLE:
 * You: "What files are in my folder?"
 * → AI thinks: "I need the list_files tool!"
 * → Epic calls: mcpManagerService.callTool({ name: 'list_files' })
 * → Tool returns: "files: a.txt, b.txt"
 * → Epic sends results back to AI
 * → AI responds: "You have 2 files: a.txt and b.txt"
 * 
 * 📝 KEY FEATURES:
 * - Uses active robot's settings (temperature, prompt, etc.)
 * - Supports streaming responses (word-by-word)
 * - Handles tool calls automatically
 * - Injects system prompts
 * - Error handling
 */
export const sendMessageEpic = (action$: any, state$: StateObservable<any>) =>
  action$.pipe(
    // 👀 Watch for sendMessage actions
    ofType(SEND_MESSAGE),
    
    // 📊 Get latest state when action arrives
    withLatestFrom(state$),
    
    // 🔄 For each action + state, do this work:
    mergeMap(([action, state]) => {
      // 📋 Get current messages from state
      const messages = state.agent.messages;
      const messageId = `msg_${Date.now()}_assistant`;

      // 🤖 Get active robot
      const activeAgentId = state.agents.activeAgentId;
      const activeAgent = activeAgentId ? state.agents.agents[activeAgentId] : null;

      // 🔄 Start async work (wrapped in "from" to make it an observable)
      return from(
        (async () => {
          // 🔧 Initialize Azure OpenAI service with active provider
          if (!activeAgent || !activeAgent.modelConfig.providerId) {
            throw new Error('No active agent or AI provider configured');
          }

          const providerId = activeAgent.modelConfig.providerId;
          const aiProvider = state.aiProviders.providers[providerId];
          
          if (!aiProvider) {
            throw new Error(`AI Provider ${providerId} not found. Please configure it in AI Provider Settings.`);
          }

          if (!aiProvider.isActive) {
            throw new Error(`AI Provider "${aiProvider.name}" is not active. Please set it as active in AI Provider Settings.`);
          }

          // Get API key from environment
          const apiKey = process.env.AI_PROVIDER_API_KEY;
          if (!apiKey) {
            throw new Error('AI_PROVIDER_API_KEY not configured in environment variables');
          }

          // Initialize Azure OpenAI service with provider config
          azureOpenAIService.initialize({
            endpoint: aiProvider.endpoint,
            apiKey: apiKey,
            deploymentName: activeAgent.modelConfig.model,
            apiVersion: '2024-02-15-preview',
          });

          console.log(`✅ Initialized AI: Provider="${aiProvider.name}", Model="${activeAgent.modelConfig.model}"`);
          
          // 🛠️ Get tools from all enabled and connected MCP servers
          const tools = await mcpManagerService.getAllTools();
          
          console.log(`Using agent: ${activeAgent?.name || 'Default'}`);
          console.log(`Available tools: ${tools.length}`);
          
          // ⚙️ Extract model configuration from active agent
          const modelConfig = activeAgent?.modelConfig ? {
            temperature: activeAgent.modelConfig.temperature,
            maxTokens: activeAgent.modelConfig.maxTokens,
            topP: activeAgent.modelConfig.topP,
            frequencyPenalty: activeAgent.modelConfig.frequencyPenalty,
            presencePenalty: activeAgent.modelConfig.presencePenalty,
          } : undefined;
          
          if (modelConfig) {
            console.log('Using agent model config:', modelConfig);
          }

          // 📝 Inject active agent's system prompt into messages if available
          let messagesWithSystemPrompt = messages;
          if (activeAgent?.systemPrompt) {
            // Remove any existing system messages and add agent's system prompt
            const nonSystemMessages = messages.filter(m => m.role !== 'system');
            messagesWithSystemPrompt = [
              {
                id: `msg_system_${Date.now()}`,
                role: 'system' as const,
                content: activeAgent.systemPrompt,
                timestamp: Date.now(),
              },
              ...nonSystemMessages,
            ];
            console.log('Injected agent system prompt:', activeAgent.systemPrompt.substring(0, 100) + '...');
          }

          // 🌊 Call AI with streaming (word-by-word response)
          let currentContent = '';
          const streamResult = await azureOpenAIService.streamMessage(
            messagesWithSystemPrompt,
            tools,
            (chunk: string) => {
              // 📝 Collect each word/chunk as it arrives
              currentContent += chunk;
            },
            modelConfig
          );

          // 🛠️ DID AI WANT TO USE A TOOL?
          if (streamResult.toolCalls && streamResult.toolCalls.length > 0) {
            // ✅ YES - AI wants to use tools!
            console.log(`AI wants to use ${streamResult.toolCalls.length} tools`);
            
            // 📞 Call each tool and collect results
            const toolResults = await Promise.all(
              streamResult.toolCalls.map((toolCall: any) =>
                mcpManagerService.callTool(toolCall)
              )
            );

            // 📋 Format tool results as text
            const toolResultsText = toolResults
              .map(
                (result) =>
                  `Tool ${result.toolCallId}: ${
                    result.error || JSON.stringify(result.result)
                  }`
              )
              .join('\n');

            // 💬 Create messages with tool results
            const messagesWithTools = [
              ...messagesWithSystemPrompt,
              {
                id: messageId,
                role: 'assistant' as const,
                content: streamResult.content || '',
                timestamp: Date.now(),
              },
              {
                id: `msg_${Date.now()}_tools`,
                role: 'system' as const,
                content: `Tool Results:\n${toolResultsText}`,
                timestamp: Date.now(),
              },
            ];

            // 🔄 Send tool results back to AI for final response
            const finalResult = await azureOpenAIService.sendMessage(
              messagesWithTools,
              undefined,
              modelConfig
            );

            const finalContent =
              finalResult.choices[0]?.message?.content || 'No response';

            // ✅ Return final response with tool results incorporated
            return {
              id: `msg_${Date.now()}_final`,
              role: 'assistant' as const,
              content: finalContent,
              timestamp: Date.now(),
            };
          }

          // ❌ NO TOOLS NEEDED - Just return AI's response
          return {
            id: messageId,
            role: 'assistant' as const,
            content: streamResult.content || 'No response',
            timestamp: Date.now(),
          };
        })()
      ).pipe(
        // ✅ Success - dispatch success action with AI's message
        map((message: Message) => sendMessageSuccess(message)),
        
        // ❌ Error - dispatch failure action with error
        catchError((error) =>
          of(sendMessageFailure(error.message || 'Failed to send message'))
        )
      );
    })
  );

// 📤 EXPORT ALL EPICS - So store can use them!
// These workers get registered with the store
export const agentEpics = [initializeAgentEpic, sendMessageEpic];
