// src/types/trigger.ts

// Type for predefined intervals or custom Cron
export type TriggerTimeType = "interval" | "cron";

// Type for optional MCP condition
export type MCPCondition = {
  mcpId: string; // ID of the selected MCP
  keyword: string; // Keyword to look for in MCP output
};

// Main interface for Trigger data
export interface TriggerData {
  id?: string; // Optional ID (present for existing triggers, absent for new ones)
  name: string; // Name for the trigger
  prompt: string; // The actual prompt/action to execute
  timeType: TriggerTimeType;
  interval?: "1min" | "5min" | "15min" | "30min" | "1hour" | "1day"; // Predefined intervals
  cronExpression?: string; // Custom Cron expression
  mcpCondition?: MCPCondition | null; // Optional MCP condition

  // Add other relevant fields displayed in the table or needed for logic
  agentName?: string; // Example: Which agent uses this trigger
  status?: "Active" | "Paused"; // Example: Trigger status
}