// src/types/task.ts

// Type for predefined intervals or custom Cron
export type TaskTimeType = "interval" | "cron"; // MODIFIED

// Type for optional MCP condition
export type MCPCondition = {
  mcpId: string; // ID of the selected MCP
  keyword: string; // Keyword to look for in MCP output
};

// Main interface for Task data
export interface TaskData { // MODIFIED
  id?: string; // Optional ID (present for existing tasks, absent for new ones)
  name: string; // Name for the task
  prompt: string; // The actual prompt/action to execute
  timeType: TaskTimeType; // MODIFIED
  interval?: "1min" | "5min" | "15min" | "30min" | "1hour" | "1day"; // Predefined intervals
  cronExpression?: string; // Custom Cron expression
  mcpCondition?: MCPCondition | null; // Optional MCP condition

  // Add other relevant fields displayed in the table or needed for logic
  agentName?: string; // Example: Which agent uses this task
  status?: "Active" | "Paused"; // Example: Task status
}