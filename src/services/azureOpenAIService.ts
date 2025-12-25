/**
 * 🤖 AZURE OPENAI SERVICE
 * 
 * 🎯 WHAT IS THIS?
 * This is the "brain connector" for our AI robots!
 * It talks to Microsoft's super-smart AI (Azure OpenAI) in the cloud.
 * Think of it like a phone that calls a really smart friend for help!
 * 
 * 🎨 WHAT CAN IT DO?
 * - Connect to the AI brain in the cloud
 * - Send messages to the AI and get answers back
 * - Stream responses (get answers word-by-word as they're typed)
 * - Let AI use special tools to do tasks
 * 
 * 💭 WHY DO WE NEED THIS?
 * Our robots need to talk to a super-smart AI to answer questions.
 * This service is like the messenger that carries questions and brings back answers!
 */

import { AzureOpenAI } from 'openai';
import '@azure/openai';
import { AzureOpenAIConfig, Message, MCPToolCall } from '../types';

/**
 * 🏭 THE AZURE OPENAI SERVICE CLASS
 * This is like the main control panel for talking to the AI!
 */
class AzureOpenAIService {
  // 📞 Our phone line to the AI (starts as null until we connect)
  private client: AzureOpenAI | null = null;
  
  // ⚙️ Our connection settings (like phone number and password)
  private config: AzureOpenAIConfig | null = null;

  /**
   * 🔌 INITIALIZE - Connect to the AI Brain!
   * 
   * 🤔 WHAT DOES IT DO?
   * Sets up the connection to Microsoft's AI in the cloud.
   * Like plugging in a phone and dialing the right number!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - config: Connection info (endpoint URL, API key, which AI model to use)
   * 
   * 📝 EXAMPLE:
   * "Connect to the AI at this address with this password"
   * "Connected! Ready to ask questions!"
   * 
   * 🎨 HOW IT WORKS:
   * 1. Save the connection settings
   * 2. Create a "client" (phone line) to the AI
   * 3. Use special settings so it works in web browsers
   */
  initialize(config: AzureOpenAIConfig): void {
    // 💾 Remember the connection settings
    this.config = config;
    
    // 📞 Create the phone line to the AI
    // Note: dangerouslyAllowBrowser lets us use this in a web browser
    // (Normally AI calls should go through a server for security)
    this.client = new AzureOpenAI({
      endpoint: config.endpoint,           // Where to call
      apiKey: config.apiKey,               // The secret password
      apiVersion: config.apiVersion || '2024-02-15-preview', // Which version
      deployment: config.deploymentName,   // Which AI model to use
      dangerouslyAllowBrowser: true,       // Allow browser usage
    });
  }

  /**
   * 💬 SEND MESSAGE - Ask the AI a Question!
   * 
   * 🤔 WHAT DOES IT DO?
   * Sends messages to the AI and waits for a complete answer.
   * Like asking a question and waiting for the full answer before doing anything else!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - messages: The conversation history (all previous messages)
   * - tools: Optional special abilities the AI can use (like a calculator)
   * - modelConfig: Settings for how the AI should think (creative vs. precise)
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The AI's complete response
   * 
   * 📝 EXAMPLE:
   * "Hey AI, what is 2+2?"
   * (Wait...)
   * "The answer is 4!"
   * 
   * 🎨 HOW IT WORKS:
   * 1. Check if we're connected to the AI
   * 2. Format messages in the way AI understands
   * 3. Set up AI behavior settings (temperature, length, etc.)
   * 4. If tools provided, tell AI what tools it can use
   * 5. Send everything to AI and wait for response
   */
  async sendMessage(
    messages: Message[],
    tools?: any[],
    modelConfig?: {
      temperature?: number;      // 🎨 How creative (0=boring, 1=very creative)
      maxTokens?: number;        // 📏 Max length of answer
      topP?: number;             // 🎲 Randomness in word choice
      frequencyPenalty?: number; // 🔁 Avoid repeating same words
      presencePenalty?: number;  // 💭 Encourage new topics
    }
  ): Promise<any> {
    // 🚫 Make sure we're connected first!
    if (!this.client || !this.config) {
      throw new Error('Azure OpenAI client not initialized');
    }

    // 📝 Format messages the way AI likes them
    const formattedMessages = messages.map(msg => ({
      role: msg.role,        // Who said it (user or assistant)
      content: msg.content,  // What they said
    }));

    // ⚙️ Prepare all the settings for how AI should respond
    const options: any = {
      model: this.config.deploymentName,
      messages: formattedMessages,
      temperature: modelConfig?.temperature ?? 0.7,        // Default: medium creativity
      max_tokens: modelConfig?.maxTokens ?? 2000,          // Default: medium length
      top_p: modelConfig?.topP ?? 1,                       // Default: no restriction
      frequency_penalty: modelConfig?.frequencyPenalty ?? 0, // Default: can repeat
      presence_penalty: modelConfig?.presencePenalty ?? 0,   // Default: stay on topic
    };

    // 🛠️ If tools provided, tell AI what tools it can use
    if (tools && tools.length > 0) {
      options.tools = tools.map((tool: any) => ({
        type: 'function',
        function: {
          name: tool.name,                    // Tool name
          description: tool.description || '', // What it does
          parameters: tool.inputSchema || {},  // What inputs it needs
        },
      }));
    }

    // 📤 Send to AI and wait for complete response
    const result = await this.client.chat.completions.create(options);

    // ✅ Return the AI's answer
    return result;
  }

  /**
   * 🌊 STREAM MESSAGE - Get AI Response Word-by-Word!
   * 
   * 🤔 WHAT DOES IT DO?
   * Like regular sendMessage, but shows the answer as it's being typed!
   * Like watching someone type instead of waiting for them to finish!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - messages: The conversation history
   * - tools: Optional special abilities
   * - onChunk: A function to call each time we get a new word/piece
   * - modelConfig: AI behavior settings
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The complete answer (after streaming all pieces)
   * - Any tool calls the AI wants to make
   * 
   * 📝 EXAMPLE:
   * "What is the capital of France?"
   * "The" (appear)
   * "The capital" (appear)
   * "The capital of" (appear)
   * "The capital of France" (appear)
   * "The capital of France is Paris!" (done!)
   * 
   * 🎨 HOW IT WORKS:
   * 1. Same setup as sendMessage
   * 2. But set stream=true (get pieces as they come)
   * 3. Loop through each piece (chunk) as it arrives
   * 4. Call onChunk() for each piece so UI can show it
   * 5. Collect all pieces to return complete answer
   * 6. Handle any tool calls the AI wants to make
   */
  async streamMessage(
    messages: Message[],
    tools?: any[],
    onChunk?: (chunk: string) => void,  // 📞 Function to call with each piece
    modelConfig?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
    }
  ): Promise<any> {
    // 🚫 Make sure we're connected!
    if (!this.client || !this.config) {
      throw new Error('Azure OpenAI client not initialized');
    }

    // 📝 Format messages for the AI
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // ⚙️ Set up all options (same as sendMessage)
    const options: any = {
      model: this.config.deploymentName,
      messages: formattedMessages,
      stream: true,  // 🌊 KEY DIFFERENCE: Enable streaming!
      temperature: modelConfig?.temperature ?? 0.7,
      max_tokens: modelConfig?.maxTokens ?? 2000,
      top_p: modelConfig?.topP ?? 1,
      frequency_penalty: modelConfig?.frequencyPenalty ?? 0,
      presence_penalty: modelConfig?.presencePenalty ?? 0,
    };

    // 🛠️ Add tools if provided
    if (tools && tools.length > 0) {
      options.tools = tools.map((tool: any) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description || '',
          parameters: tool.inputSchema || {},
        },
      }));
    }

    // 📤 Start the streaming response
    const stream = await this.client.chat.completions.create(options);

    // 📦 Variables to collect the response pieces
    let fullContent = '';              // All text combined
    let toolCalls: MCPToolCall[] = []; // Any tools AI wants to use
    let currentToolCall: any = null;   // Tool being processed
    let toolArguments = '';            // Arguments for the tool

    // 🔄 Loop through each chunk (piece) as it arrives
    for await (const chunk of stream) {
      const choice = chunk.choices[0];
      
      // ⏭️ Skip if no data in this chunk
      if (!choice?.delta) continue;

      // 📝 If this chunk has text content
      if (choice.delta.content) {
        // Add to our full content
        fullContent += choice.delta.content;
        
        // 📞 Call the onChunk function so UI can display this piece
        if (onChunk) {
          onChunk(choice.delta.content);
        }
      }

      // 🛠️ If this chunk has tool calls (AI wants to use a tool)
      if (choice.delta.tool_calls && choice.delta.tool_calls.length > 0) {
        for (const toolCall of choice.delta.tool_calls) {
          // 🆕 New tool call starting
          if (toolCall.id) {
            // 💾 Save previous tool call if one exists
            if (currentToolCall) {
              currentToolCall.arguments = JSON.parse(toolArguments || '{}');
              toolCalls.push(currentToolCall);
            }
            
            // 🎬 Start new tool call
            currentToolCall = {
              name: toolCall.function?.name || '',
              arguments: {},
            };
            toolArguments = '';
          }
          
          // 📦 Collect arguments for this tool (comes in pieces too!)
          if (toolCall.function?.arguments) {
            toolArguments += toolCall.function.arguments;
          }
        }
      }
    }

    // 💾 Save the last tool call if there is one
    if (currentToolCall) {
      currentToolCall.arguments = JSON.parse(toolArguments || '{}');
      toolCalls.push(currentToolCall);
    }

    // ✅ Return everything: the full text and any tool calls
    return {
      content: fullContent,
      toolCalls,
    };
  }

  /**
   * ✅ IS INITIALIZED - Are We Connected?
   * 
   * 🤔 WHAT DOES IT DO?
   * Checks if we're connected to the AI or not.
   * Like checking if your phone has a signal!
   * 
   * 📤 WHAT IT GIVES BACK:
   * - true if connected and ready
   * - false if not connected yet
   * 
   * 📝 EXAMPLE:
   * "Are we connected to the AI?"
   * "Yes! Ready to chat!" or "No, need to connect first!"
   */
  isInitialized(): boolean {
    // 📞 Check if we have a phone line (client exists)
    return this.client !== null;
  }
}

// 🏭 Create one service that everyone can use
// This is like having one phone line that everyone shares
export default new AzureOpenAIService();
