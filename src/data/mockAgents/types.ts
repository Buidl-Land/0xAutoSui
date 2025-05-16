import { Agent, TaskAgent, ActionAgent, AgentType, TriggerType, TriggerConfig, AgentConfig, MCPDependency, AgentDependency, OutputAction, AgentStatus, ScheduledTriggerFrequency, ScheduledTriggerConfig, Task } from '../../types/agent';
import { TriggerData, TriggerTimeType, MCPCondition } from '../../types/trigger';

// Define a more specific Log type for our mock data, matching [agentId]/page.tsx
export interface MockLog {
  id: string;
  timestamp: number;
  userPrompt?: string; // Made optional as some logs might be system events
  agentResponse?: string; // Made optional
  executionSteps: string[];
  message?: string; // Optional summary
  status?: 'success' | 'error' | 'info' | 'warning'; // Added status for log entries
}

// Extended Agent type for mock data to include all fields from both sources
export type ExtendedAgent = Omit<Agent, 'triggerConfig' | 'config' | 'status' | 'agentType'> & {
  agentType: AgentType; // Enforce strict AgentType
  status?: AgentStatus | string; // Allow string for mock data flexibility, but prefer AgentStatus
  lastModified?: Date | number;
  creator?: string;
  triggerType: TriggerType; // Ensure triggerType is always present
  triggerConfig?: TriggerConfig; // Use the new TriggerConfig type
  config: AgentConfig; // Use the new AgentConfig type, ensure it's always present
  logs?: MockLog[]; // Using the more detailed MockLog
  tasks?: Task[]; // Updated to use Task[] from agent.ts
  associatedWalletId?: string | null;
  autoRefillServiceCredits?: boolean;
  serviceCreditsRefillThreshold?: number;
  serviceCreditsRefillAmount?: number;
  autoRefillSol?: boolean;
  solRefillThreshold?: number;
  solRefillAmount?: number;
  solRefillSourceEoa?: string;
  // Field for featured agent descriptions
  featuredDescription?: string;
  keyMCPs?: string[]; // For featured agents
}; 