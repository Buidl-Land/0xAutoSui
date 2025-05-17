import { AgentStatus, TriggerType, ScheduledTriggerFrequency, AIModel } from '../../types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear';
import { ExtendedAgent, MockLog } from './types';

export const dcaSolAgent: ExtendedAgent = {
  id: "dca-sol-01",
  name: "DCA SOL Agent",
  description: "Automatically buys SOL based on the AHR999 index, placing remaining funds in DeFi lending protocols.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "DCA SOL Agent", { size: 128, backgroundColor: ['b6e3f4'] }),
  status: AgentStatus.RUNNING,
  systemPrompt: "Act as a Dollar Cost Averaging bot for SOL, optimizing entries based on AHR999 and managing capital in DeFi.",
  model: AIModel.Gemini25Pro,
  tasks: [
    { id: 'dca-task-01', description: 'Check AHR999 index daily.', order: 1, tags: ['Data Fetch', 'Condition Check'] },
    { id: 'dca-task-02', description: 'If AHR999 < 0.45, buy 0.5 SOL.', order: 2, tags: ['Trading', 'SOL'] },
    { id: 'dca-task-03', description: 'If AHR999 > 1.2, evaluate selling portion.', order: 3, tags: ['Trading', 'SOL', 'Strategy'] },
    { id: 'dca-task-04', description: 'Allocate spare USDC to lending protocol.', order: 4, tags: ['DeFi', 'Lending', 'USDC'] }
  ],
  config: {
    dependentMCPs: [
      { mcpId: "mcp-ahr999", mcpName: "AHR999 Info Fetch MCP", order: 1, parameters: {} },
      { mcpId: "mcp-SOL-trade", mcpName: "SOL/USDT Trading MCP", order: 2, parameters: {} },
      { mcpId: "mcp-defi-lend", mcpName: "DeFi Lending MCP", order: 3, parameters: {} },
    ],
    dependentAgents: [],
    outputActions: [{outputType: "LOG_WRITER", outputProviderName: "Internal Logger", parameters: {}}],
  },
  logs: [
    { id: "log-dca-1", timestamp: Date.now() - 3600000, message: "AHR999 index: 0.42. Condition met. Executing buy.", executionSteps: ["Checked AHR999 index: 0.42.", "Condition met for purchase.", "Called SOL/USDT Trading MCP: Buy 0.5 SOL.", "Trade successful."], status: 'success'},
    { id: "log-dca-2", timestamp: Date.now(), message: "AHR999 index: 0.6. Holding.", executionSteps: ["Checked AHR999 index: 0.6.", "Buy condition not met."], status: 'info'},
  ],
  creator: "AdminUser",
  lastModified: new Date(Date.now() - 86400000),
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 86400000),
  ownerId: "user-default-01",
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: { frequency: ScheduledTriggerFrequency.DAILY, timeValue: "00:00" },
  associatedWalletId: "wallet-dca-sol",
}; 