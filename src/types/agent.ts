// Path: src/types/agent.ts

export interface AgentConnection {
  connectedAgentId: string;
  connectionType: string; // e.g., "data_source", "action_provider"
  // TODO: Define other connection properties as per docs/02_agent_domain_model.md (id, status, configuration, etc.)
  // For now, keeping it simple as per pseudocode for initial A2A tab structure
}

export type AgentType = 'Task' | 'Action' | 'Chat';

export enum TriggerType {
  MANUAL = "MANUAL",
  SCHEDULED = "SCHEDULED",
  EVENT_DRIVEN = "EVENT_DRIVEN",
}

export enum ScheduledTriggerFrequency {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  CUSTOM_CRON = "CUSTOM_CRON",
}

export interface ScheduledTriggerConfig {
  frequency: ScheduledTriggerFrequency;
  timeValue: string; // e.g., "08:00" or cron string "0 8 * * *"
}

export interface EventDrivenTriggerConfig { // Future use
  eventType: string;
  eventSource: string;
  filterConditions: Record<string, any>;
}

export type TriggerConfig = ScheduledTriggerConfig | EventDrivenTriggerConfig | null;


export interface MCPDependency {
  mcpId: string;
  mcpName: string; // Denormalized for display
  order: number;
  parameters: Record<string, any>; // User-configured parameters
}

export interface AgentDependency {
  dependentAgentId: string;
  dependentAgentName: string; // Denormalized for display
  interactionConfig: Record<string, any>; // Defines data flow
}

export interface OutputAction {
  outputType: string; // e.g., "TELEGRAM_NOTIFIER"
  outputProviderId?: string; // Optional, e.g., ID of a generic Webhook MCP
  outputProviderName: string; // Denormalized for display
  parameters: Record<string, any>; // e.g., { "channelId": "@...", "messageTemplate": "..." }
}

export interface AgentConfig {
  dependentMCPs: MCPDependency[];
  dependentAgents: AgentDependency[];
  outputActions: OutputAction[];
}

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

  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  config: AgentConfig;
  associatedWalletId?: string | null;
  autoRefillServiceCredits?: boolean;
  serviceCreditsRefillThreshold?: number;
  serviceCreditsRefillAmount?: number;
  autoRefillSol?: boolean;
  solRefillThreshold?: number; // Using number for decimal, adjust if specific decimal type is used
  solRefillAmount?: number; // Using number for decimal
  solRefillSourceEoa?: string;


  // Optional properties from mock data / existing fields
  status?: AgentStatus; // Changed to use Enum
  lastModified?: Date | number;
  creator?: string;
  // triggerType?: string; // Deprecated by new triggerType ENUM
  // triggerConfig?: any[]; // Deprecated by new triggerConfig Typed Object
  mcpConfig?: { name: string; id: string }[]; // This seems to be a simpler version of dependentMCPs, review if it should be merged/removed
  logs?: { id: string; timestamp: number; message?: string }[]; // Made message optional
  // TODO: Review if these optional fields should be part of the core Agent type
  // or handled differently, e.g. via a richer internal type for mock data.
}

export interface TaskAgent extends BaseAgent {
  agentType: 'Task';
  tasks?: any[]; // Define more specific type if known
  // a2aConnections?: AgentConnection[]; // This is now part of AgentConfig.dependentAgents
}

export interface ActionAgent extends BaseAgent {
  agentType: 'Action';
  // Action-specific properties, but no tasks or a2aConnections
  // Action agents might still have MCP dependencies and outputs, but not dependent agents.
  // This needs clarification based on how "Action Agents" are used.
  // For now, they inherit the full config.
}

export interface ChatAgent extends BaseAgent {
  agentType: 'Chat';
  // Chat-specific properties can be added here later
}

export type Agent = TaskAgent | ActionAgent | ChatAgent;

export enum AgentStatus {
  RUNNING = "RUNNING",
  SCHEDULED = "SCHEDULED",
  PENDING = "PENDING",
  ERROR = "ERROR",
  IDLE = "IDLE",
  STOPPED = "STOPPED",
}
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