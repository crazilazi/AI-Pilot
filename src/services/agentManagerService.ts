/**
 * 🤖 AGENT MANAGER SERVICE
 * 
 * 🎯 WHAT IS THIS?
 * Think of this as a "Robot Manager" that helps you organize all your AI robots!
 * Just like a toy box keeps all your toys organized, this keeps all AI agents organized.
 * 
 * 🎨 WHAT CAN IT DO?
 * - Create new AI robots (agents)
 * - Find your robots when you need them
 * - Change how robots work (update them)
 * - Remove robots you don't want
 * - Remember which robot you're using right now
 * - Save robots so they don't disappear when you close the app
 * 
 * 💭 WHY DO WE NEED THIS?
 * Instead of losing your robots every time, this remembers them for you!
 * Like having a special notebook that remembers all your friends' names.
 */

import { Agent } from '../types/multiAgent';
import { AgentFactory, AGENT_TEMPLATES } from './agentTemplates';

// 📦 This is the "label" on our storage box where we keep all agents
const STORAGE_KEY = 'aipilot-ai-agents';

/**
 * 🏭 THE AGENT MANAGER CLASS
 * This is like the main control room for all our AI robots!
 */
class AgentManagerService {
  // 🗂️ Our special box that holds all the AI robots
  // "Map" is like a filing cabinet - each robot has a name tag (ID) and drawer
  private agents: Map<string, Agent> = new Map();

  /**
   * 🎬 CONSTRUCTOR - When the manager starts up
   * This runs automatically when we first create the manager.
   * Like turning on a light switch when you enter a room!
   */
  constructor() {
    // Load all saved robots from storage (like opening your toy box)
    this.loadFromStorage();
  }

  // ============================================
  // 🎬 INITIALIZATION (Getting Ready to Play!)
  // ============================================

  /**
   * 🎯 INITIALIZE - Get Everything Ready!
   * 
   * 🤔 WHAT DOES IT DO?
   * Like cleaning your room before friends come over!
   * It checks if you have any robots, and if not, gives you some starter robots.
   * 
   * 📝 EXAMPLE:
   * Imagine opening your toy box:
   * - If empty: "Let me give you some toys to start with!"
   * - If has toys: "Great! You already have toys, let's play!"
   */
  initialize(): void {
    // 📖 Look in storage to see what robots we saved before
    const stored = this.loadFromStorage();

    // 🤔 If the toy box is empty (no agents exist)
    if (stored.length === 0) {
      // 🎁 Get some starter robots from the factory
      const defaultAgents = AgentFactory.getDefaultAgents();

      // 📦 Put each robot in our storage box
      defaultAgents.forEach(agent => {
        this.agents.set(agent.id, agent);
      });

      // 💾 Save them so we remember them next time
      this.saveToStorage();
    }
  }

  // ============================================
  // 🎨 CRUD OPERATIONS (Create, Read, Update, Delete)
  // This is like managing your toy collection!
  // ============================================

  /**
   * ✨ CREATE AGENT - Make a New Robot!
   * 
   * 🤔 WHAT DOES IT DO?
   * Adds a brand new robot to your collection!
   * Like getting a new toy and putting it in your toy box.
   * 
   * 📥 WHAT YOU GIVE IT:
   * - agent: The new robot you want to add
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The same robot (confirming it was added)
   * 
   * 📝 EXAMPLE:
   * "I made a new robot named 'Helper Bot'!"
   * "Okay, I'll put it in the toy box and remember it!"
   */
  createAgent(agent: Agent): Agent {
    // 📦 Put the robot in our storage box with its ID as the label
    this.agents.set(agent.id, agent);

    // 💾 Save to storage so we don't lose it later
    this.saveToStorage();

    // ✅ Give back the robot to confirm it was added
    return agent;
  }

  /**
   * 🔍 GET AGENT - Find a Specific Robot!
   * 
   * 🤔 WHAT DOES IT DO?
   * Finds one specific robot by its name (ID).
   * Like saying "Can you find my red robot for me?"
   * 
   * 📥 WHAT YOU GIVE IT:
   * - id: The robot's name tag (like "robot-123")
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The robot if found, or nothing if not found
   * 
   * 📝 EXAMPLE:
   * "Find me robot named 'helper-bot'"
   * "Here it is!" or "Sorry, I can't find that robot."
   */
  getAgent(id: string): Agent | undefined {
    // 🔍 Look in our filing cabinet for this robot
    return this.agents.get(id);
  }

  /**
   * 📋 GET ALL AGENTS - Show Me All Robots!
   * 
   * 🤔 WHAT DOES IT DO?
   * Shows you ALL your robots in a nice organized list.
   * Like dumping out your toy box and lining up all toys nicely!
   * 
   * 📤 WHAT IT GIVES BACK:
   * - A list of all your robots, organized with:
   *   1. Built-in robots first (the ones that came with the app)
   *   2. Newest robots at the top
   * 
   * 📝 EXAMPLE:
   * "Show me all my robots!"
   * "Here they are: Helper Bot, Code Bot, Writer Bot..."
   */
  getAllAgents(): Agent[] {
    // 📦 Take all robots out of storage and put them in a list
    return Array.from(this.agents.values()).sort((a, b) => {
      // 🏆 Built-in robots go first (the special ones)
      if (a.isBuiltIn && !b.isBuiltIn) return -1;
      if (!a.isBuiltIn && b.isBuiltIn) return 1;

      // 🆕 Then sort by newest first (like newest toys on top)
      return b.createdAt - a.createdAt;
    });
  }

  /**
   * 🎯 GET ACTIVE AGENT - Which Robot Am I Using Now?
   * 
   * 🤔 WHAT DOES IT DO?
   * Tells you which robot is currently "turned on" and working.
   * Like asking "Which toy am I playing with right now?"
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The robot that's currently active, or nothing if none is active
   * 
   * 📝 EXAMPLE:
   * "Which robot am I using?"
   * "You're using Helper Bot right now!"
   */
  getActiveAgent(): Agent | undefined {
    // 🔍 Look through all robots and find the one that's "active"
    return this.getAllAgents().find(agent => agent.isActive);
  }

  /**
   * ✏️ UPDATE AGENT - Change a Robot!
   * 
   * 🤔 WHAT DOES IT DO?
   * Changes something about a robot (like painting a toy a different color).
   * Maybe you want to change its name, or what it can do!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - id: Which robot to change
   * - updates: What changes to make (name, icon, abilities, etc.)
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The updated robot, or nothing if robot not found
   * 
   * 📝 EXAMPLE:
   * "Change Helper Bot's icon to a star!"
   * "Done! Helper Bot now has a ⭐ icon!"
   */
  updateAgent(id: string, updates: Partial<Agent>): Agent | null {
    // 🔍 Find the robot we want to change
    const agent = this.agents.get(id);

    // ❌ If robot doesn't exist, we can't update it
    if (!agent) return null;

    // ✨ Create the updated robot with new changes
    const updatedAgent = {
      ...agent,           // Keep everything the same
      ...updates,         // Except what we're changing
      updatedAt: Date.now(), // Remember when we changed it
    };

    // 💾 Save the updated robot back to storage
    this.agents.set(id, updatedAgent);
    this.saveToStorage();

    // ✅ Give back the updated robot
    return updatedAgent;
  }

  /**
   * 🗑️ DELETE AGENT - Remove a Robot!
   * 
   * 🤔 WHAT DOES IT DO?
   * Removes a robot from your collection (like giving away a toy).
   * BUT - it won't let you delete the special built-in robots!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - id: Which robot to remove
   * 
   * 📤 WHAT IT GIVES BACK:
   * - true if deleted successfully
   * - false if couldn't delete (doesn't exist or is built-in)
   * 
   * 📝 EXAMPLE:
   * "Delete my old robot"
   * "Okay, removed!" or "Sorry, can't delete that special robot!"
   */
  deleteAgent(id: string): boolean {
    // 🔍 Find the robot
    const agent = this.agents.get(id);

    // 🛡️ Can't delete built-in robots (they're special!)
    if (agent?.isBuiltIn) {
      return false;
    }

    // 🗑️ Try to delete the robot
    const deleted = this.agents.delete(id);

    // 💾 If deleted, save the changes
    if (deleted) {
      this.saveToStorage();
    }

    // ✅ Tell if it worked or not
    return deleted;
  }

  // ============================================
  // 🎮 AGENT ACTIVATION (Choosing Which Robot to Play With!)
  // ============================================

  /**
   * 🎯 SET ACTIVE AGENT - Choose Which Robot to Use!
   * 
   * 🤔 WHAT DOES IT DO?
   * Picks one robot to be your active helper, and turns off all others.
   * Like choosing which toy to play with - you can only play with one at a time!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - id: Which robot you want to use now
   * 
   * 📤 WHAT IT GIVES BACK:
   * - true if successfully switched
   * - false if robot doesn't exist
   * 
   * 📝 EXAMPLE:
   * "I want to use Helper Bot now!"
   * "Okay! Helper Bot is now active, all others are resting."
   * 
   * 🎨 HOW IT WORKS:
   * 1. Turn off ALL robots (like putting toys back)
   * 2. Turn on the ONE robot you chose (like picking it up)
   * 3. Remember this choice for next time
   */
  setActiveAgent(id: string): boolean {
    // 🔍 Find the robot you want to activate
    const agent = this.agents.get(id);

    // ❌ If robot doesn't exist, can't activate it
    if (!agent) return false;

    // 💤 Turn off ALL robots first (everyone goes to sleep)
    this.agents.forEach(a => {
      a.isActive = false;
    });

    // ⚡ Turn on the robot you chose (wake up this one!)
    agent.isActive = true;
    this.agents.set(id, agent);

    // 💾 Save this choice
    this.saveToStorage();

    // ✅ Success!
    return true;
  }

  // ============================================
  // 🎨 TEMPLATE OPERATIONS (Using Pre-Made Robot Designs!)
  // ============================================

  /**
   * 🏭 CREATE FROM TEMPLATE - Make Robot from a Recipe!
   * 
   * 🤔 WHAT DOES IT DO?
   * Uses a pre-made robot design (template) to create a new robot instantly!
   * Like using a cookie cutter - the shape is already decided, just make it!
   * 
   * 📥 WHAT YOU GIVE IT:
   * - templateId: Which robot recipe to use (like "code-helper" or "writer-bot")
   * 
   * 📤 WHAT IT GIVES BACK:
   * - The newly created robot, or nothing if template doesn't exist
   * 
   * 📝 EXAMPLE:
   * "Make me a coding helper robot!"
   * "Here's your new Code Helper Bot! ⭐"
   * 
   * 🎨 HOW IT WORKS:
   * 1. Ask the factory to make a robot from this template
   * 2. If made successfully, add it to our collection
   * 3. Save it so we remember it
   */
  createFromTemplate(templateId: string): Agent | null {
    // 🏭 Ask the robot factory to make this robot
    const agent = AgentFactory.createFromTemplate(templateId);

    // ❌ If factory couldn't make it, return nothing
    if (!agent) return null;

    // 📦 Add the new robot to our collection
    this.agents.set(agent.id, agent);

    // 💾 Save it
    this.saveToStorage();

    // ✅ Give back the new robot
    return agent;
  }

  /**
   * 📋 GET TEMPLATES - Show Me All Robot Recipes!
   * 
   * 🤔 WHAT DOES IT DO?
   * Shows you all the pre-made robot designs you can use.
   * Like looking at a menu at a restaurant - "What robots can I make?"
   * 
   * 📤 WHAT IT GIVES BACK:
   * - List of all available robot templates
   * 
   * 📝 EXAMPLE:
   * "What kinds of robots can I make?"
   * "You can make: Code Helper, Writer Bot, Math Tutor, and more!"
   */
  getTemplates() {
    // 📋 Return the list of all available robot recipes
    return AGENT_TEMPLATES;
  }

  // ============================================
  // 💾 PERSISTENCE (Saving & Loading - Like a Toy Box!)
  // These are PRIVATE methods - only this class uses them
  // ============================================

  /**
   * 📖 LOAD FROM STORAGE - Open the Toy Box!
   * 
   * 🤔 WHAT DOES IT DO?
   * Opens the storage and loads all saved robots back into memory.
   * Like opening your toy box when you wake up in the morning!
   * 
   * 📤 WHAT IT GIVES BACK:
   * - List of all robots that were saved, or empty list if nothing saved
   * 
   * 📝 EXAMPLE:
   * "Let me check what robots we saved yesterday..."
   * "Found them! Here are all your robots from before!"
   * 
   * 🎨 HOW IT WORKS:
   * 1. Look in the browser's storage (like opening a drawer)
   * 2. If nothing there, return empty list
   * 3. If found something, put each robot in our Map
   * 4. If something goes wrong, return empty list (better safe than sorry!)
   */
  private loadFromStorage(): Agent[] {
    try {
      // 🔍 Look for saved robots in storage
      const stored = localStorage.getItem(STORAGE_KEY);

      // 📭 If nothing saved, return empty list
      if (!stored) return [];

      // 📦 Turn the saved text back into robot objects
      const agents: Agent[] = JSON.parse(stored);

      // 📥 Put each robot into our Map (filing cabinet)
      agents.forEach(agent => {
        this.agents.set(agent.id, agent);
      });

      // ✅ Return the list of robots we loaded
      return agents;
    } catch (error) {
      // 😢 Something went wrong, return empty list
      console.error('Failed to load agents from storage:', error);
      return [];
    }
  }

  /**
   * 💾 SAVE TO STORAGE - Put Toys Back in the Box!
   * 
   * 🤔 WHAT DOES IT DO?
   * Saves all your robots so they don't disappear when you close the app.
   * Like putting toys back in the toy box so you can find them tomorrow!
   * 
   * 📝 EXAMPLE:
   * "Let me save all your robots so we remember them..."
   * "Done! All robots are safely saved!"
   * 
   * 🎨 HOW IT WORKS:
   * 1. Take all robots from our Map
   * 2. Turn them into text (JSON) that can be saved
   * 3. Save the text to browser storage
   * 4. If something goes wrong, just show an error (won't break the app)
   */
  private saveToStorage(): void {
    try {
      // 📦 Get all robots from our Map and put in a list
      const agents = Array.from(this.agents.values());

      // 💾 Turn robots into text and save to storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
    } catch (error) {
      // 😢 Something went wrong (maybe storage is full?)
      console.error('Failed to save agents to storage:', error);
    }
  }

}

// 🏭 Create one manager that everyone can use (like having one toy box for everyone)
// "export default" means other files can use this manager
export default new AgentManagerService();
