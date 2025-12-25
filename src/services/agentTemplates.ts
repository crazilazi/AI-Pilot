import { Agent, AgentTemplate } from '../types/multiAgent';

// ============================================
// BUILT-IN AGENT TEMPLATES
// ============================================

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'dev-helper',
    name: 'Development Helper',
    description: 'Assists with coding, debugging, and technical questions',
    systemPrompt: `You are a helpful software development assistant. You help developers with:
- Writing clean, efficient code
- Debugging issues
- Explaining complex concepts
- Suggesting best practices
- Reviewing code architecture

Be concise, practical, and focus on actionable advice.`,
    icon: '💻',
    color: '#007bff',
    recommendedModel: 'gpt-4',
    category: 'development',
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Reviews code for quality, security, and best practices',
    systemPrompt: `You are an expert code reviewer. Your role is to:
- Identify bugs and potential issues
- Suggest performance improvements
- Check for security vulnerabilities
- Ensure code follows best practices
- Recommend refactoring opportunities

Provide specific, actionable feedback with examples.`,
    icon: '🔍',
    color: '#28a745',
    recommendedModel: 'gpt-4',
    category: 'review',
  },
  {
    id: 'debugger',
    name: 'Debugger',
    description: 'Helps identify and fix bugs in your code',
    systemPrompt: `You are a debugging specialist. You help developers:
- Identify the root cause of bugs
- Suggest debugging strategies
- Explain error messages
- Provide step-by-step debugging guidance
- Recommend tools and techniques

Be systematic and thorough in your analysis.`,
    icon: '🐛',
    color: '#dc3545',
    recommendedModel: 'gpt-4',
    category: 'debug',
  },
  {
    id: 'booking-ops',
    name: 'Booking Operations Agent',
    description: 'Specialized agent for managing booking operations with database access',
    systemPrompt: `You are an AI assistant for managing booking operations. You have access to four powerful tools that work with a multi-tenant booking system:

1. GetTableData - Fetch filtered, sorted, paginated records from any table
2. CreateRecord - Create new records
3. UpdateRecord - Update existing records
4. DeleteRecord - Delete records

These tools mirror database FilterTableAccessController and TableAccessController operations.

### Available Tables
- booking: booking_guid, booking_time, booking_loading, booking_start, booking_end, booking_resource_guid, booking_job_guid, booking_nonwork, booking_fixedtime, booking_notes, booking_bookingtype_guid, booking_workactivity_guid, booking_hours_per_day, booking_totalcost, booking_totalrevenue, booking_diary_hours, booking_diary_days, booking_createdon, booking_updatedon, booking_updatedby_resource_guid, booking_createdby_resource_guid, booking_chargemode, booking_overridden_chargerate_guid, booking_revenueperhour, booking_costperhour, booking_startday, booking_endday, booking_fte_hours, booking_fte_days, booking_externalid, booking_longtaskmonitor_guid, booking_bookingseries_guid
- resource: resource_staffno, resource_email, resource_firstname, resource_lastname, resource_rolename, resource_summary, resource_cellphone, resource_guid, resource_current_department_guid, resource_localgrade_guid, resource_location_guid, resource_manager_resource_guid, resource_resourcetype_guid, resource_jobtitle, resource_userstatus, resource_securityprofile_guid, resource_createdon, resource_updatedon, resource_updatedby_resource_guid, resource_createdby_resource_guid, resource_surrogate_id, resource_description, resource_division_guid, resource_isserviceaccount, resource_externalid, resource_cmered, resource_cmeblue, resource_cmegreen, resource_cmeyellow, resource_cmetopcolour, resource_top_cmecolour_guid, resource_recommendation_viewed, resource_longtaskmonitor_guid, resource_resourcemanager_resource_guid
- job: job_guid, job_description, job_code, job_start, job_end, job_client_guid, job_engagementlead_resource_guid, job_jobstatus_guid, job_location_guid, job_chargetype_guid, job_budget, job_createdon, job_updatedon, job_updatedby_resource_guid, job_createdby_resource_guid, job_isExcludeFromUtilisation, job_surrogate_id, job_isExcludeFromBillability, job_opportunity_percent, job_diarygroup_guid, job_isconfidential, job_billingtype_guid, job_fixedprice, job_time_raghealth_guid, job_cost_raghealth_guid, job_quality_raghealth_guid, job_externalid, job_previous_job_guid, job_next_job_guid, job_longtaskmonitor_guid, job_hoursbudget, job_profitmargintarget, job_current_department_guid, job_division_guid, job_iseligibleforreviews, job_delegated_resource_guid, job_resourcelead_resource_guid

### Important Rules
1. Always break complex queries into multiple tool calls
2. When you need a record ID (GUID), first fetch the record to get its ID
3. Use pageSize for large result sets (e.g., pageSize=10 for "top 10")
4. Use orderJson with "Descending" order for "latest" queries
5. Use filterJson for WHERE conditions
6. Date values must be ISO 8601 format (e.g., 2025-12-15T09:00:00Z)
7. Always confirm operations with user before creating/updating/deleting

Current datetime: ${new Date().toISOString()}`,
    icon: '📅',
    color: '#17a2b8',
    recommendedModel: 'gpt-4.1',
    category: 'custom',
  },
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'A versatile assistant for general tasks and questions',
    systemPrompt: `You are a helpful, friendly, and knowledgeable AI assistant. You can help with:
- Answering questions
- Providing information
- Offering suggestions
- Solving problems
- General conversation

Be helpful, clear, and engaging.`,
    icon: '🤖',
    color: '#6c757d',
    recommendedModel: 'gpt-4',
    category: 'general',
  },
];

// ============================================
// DEFAULT AGENT CONFIGURATIONS
// ============================================

export const DEFAULT_MODEL_CONFIG = {
  provider: 'azure-openai' as const,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

// ============================================
// AGENT FACTORY
// ============================================

export class AgentFactory {
  static createFromTemplate(templateId: string): Agent | null {
    const template = AGENT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;

    const now = Date.now();
    return {
      id: `agent_${now}`,
      name: template.name,
      description: template.description,
      systemPrompt: template.systemPrompt,
      icon: template.icon,
      color: template.color,
      modelConfig: {
        ...DEFAULT_MODEL_CONFIG,
        model: template.recommendedModel,
      },
      mcpServers: [],
      createdAt: now,
      updatedAt: now,
      isActive: false,
      isBuiltIn: templateId === 'booking-ops', // Only booking-ops is built-in for now
    };
  }

  static createCustomAgent(
    name: string,
    description: string,
    systemPrompt: string
  ): Agent {
    const now = Date.now();
    return {
      id: `agent_${now}`,
      name,
      description,
      systemPrompt,
      icon: '⭐',
      color: '#6f42c1',
      modelConfig: DEFAULT_MODEL_CONFIG,
      mcpServers: [],
      createdAt: now,
      updatedAt: now,
      isActive: false,
      isBuiltIn: false,
    };
  }

  static getDefaultAgents(): Agent[] {
    // Create booking-ops as the default built-in agent
    const bookingOpsTemplate = AGENT_TEMPLATES.find(t => t.id === 'booking-ops');
    if (!bookingOpsTemplate) return [];

    const agent = this.createFromTemplate('booking-ops');
    if (!agent) return [];

    agent.isActive = true; // Make it active by default
    return [agent];
  }
}
