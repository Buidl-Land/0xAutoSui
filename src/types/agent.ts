// Path: src/types/agent.ts

export interface AgentConnection {
  connectedAgentId: string;
  connectionType: string; // e.g., "data_source", "action_provider"
  // TODO: Define other connection properties as per docs/02_agent_domain_model.md (id, status, configuration, etc.)
  // For now, keeping it simple as per pseudocode for initial A2A tab structure
}

export type AgentType = 'Task' | 'Action';

interface BaseAgent {
  id: string;
  name: string;
  description: string;
  iconUrl?: string | null; // URL to the uploaded circular icon, can be null
  systemPrompt: string;
  agentType: AgentType;
  ownerId?: string; // As per domain model
  createdAt?: Date; // As per domain model
  updatedAt?: Date; // As per domain model

  // Optional properties from mock data / existing fields
  status?: string;
  lastModified?: Date | number;
  creator?: string;
  triggerType?: string; // Will be deprecated by agentType
  triggerConfig?: any[]; // Replace 'any' with a proper TriggerConfig type if available
  mcpConfig?: { name: string; id: string }[];
  logs?: { id: string; timestamp: number; message?: string }[]; // Made message optional
  // TODO: Review if these optional fields should be part of the core Agent type
  // or handled differently, e.g. via a richer internal type for mock data.
}

export interface TaskAgent extends BaseAgent {
  agentType: 'Task';
  tasks?: any[]; // Define more specific type if known
  a2aConnections?: AgentConnection[]; // For A2A Tab
}

export interface ActionAgent extends BaseAgent {
  agentType: 'Action';
  // Action-specific properties, but no tasks or a2aConnections
}

export type Agent = TaskAgent | ActionAgent;

// Enums from Domain Model for reference, can be moved to a shared enum file if needed
export enum AgentConnectionStatusEnum {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACTIVE = "ACTIVE",
  DISABLED_BY_SOURCE = "DISABLED_BY_SOURCE",
  DISABLED_BY_TARGET = "DISABLED_BY_TARGET",
  ERRORED_CONFIGURATION = "ERRORED_CONFIGURATION",
}

export enum AgentConnectionTypeEnum {
  DATA_EXCHANGE = "DATA_EXCHANGE",
  TASK_DELEGATION = "TASK_DELEGATION",
  NOTIFICATION_RELAY = "NOTIFICATION_RELAY",
}