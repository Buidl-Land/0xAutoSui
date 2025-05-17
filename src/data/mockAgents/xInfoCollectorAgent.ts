import { AgentStatus, TriggerType, ScheduledTriggerFrequency, AIModel } from '../../types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear';
import { ExtendedAgent, MockLog } from './types';

export const xInfoCollectorAgent: ExtendedAgent = {
  id: "x-info-collector-01",
  name: "X Info Collector",
  description: "Collects relevant tweets from specified Twitter accounts, filters out ads/gossip, summarizes valuable information, and sends to a TG Bot.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "X Info Collector", { size: 128, backgroundColor: ['c0aede'] }),
  status: AgentStatus.RUNNING,
  systemPrompt: "Act as an information gatherer and summarizer from X (Twitter), focusing on actionable insights.",
  model: AIModel.Gemini25Pro,
  tasks: [
      { id: 'xinfo-task-01', description: 'Fetch tweets from @CryptoKOL for #DegenToken.', order: 1, tags: ['Twitter', 'Data Fetch'] },
      { id: 'xinfo-task-02', description: 'Filter and summarize valuable info.', order: 2, tags: ['NLP', 'Summarization'] },
      { id: 'xinfo-task-03', description: 'Send summary to Telegram channel @my_alerts.', order: 3, tags: ['Notification', 'Telegram'] }
  ],
  config: {
    dependentMCPs: [
      { mcpId: "mcp-x-info", mcpName: "X Info Fetch MCP", order: 1, parameters: { "targetAccount": "@CryptoKOL", "keywords": ["#DegenToken"] } },
    ],
    dependentAgents: [],
    outputActions: [
      { outputType: "TELEGRAM_NOTIFIER", outputProviderName: "TG Bot MCP", parameters: { "chatId": "@my_alerts", "messageTemplate": "X Info: {{summary}}" } }
    ],
  },
  logs: [
    { id: "log-xinfo-1", timestamp: Date.now() - 7200000, message: "Found 1 new mention of #DegenToken by @CryptoKOL. Sent to TG.", executionSteps: ["Called X Info Fetch MCP", "Found 1 matching tweet", "Summarized and sent via TG Bot MCP."], status: 'success'},
    { id: "log-xinfo-2", timestamp: Date.now(), message: "No new mentions found for #DegenToken by @CryptoKOL.", executionSteps: ["Called X Info Fetch MCP", "No new tweets found."], status: 'info'},
  ],
  creator: "TraderX",
  lastModified: new Date(Date.now() - 172800000),
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 172800000),
  ownerId: "user-default-01",
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: { frequency: ScheduledTriggerFrequency.CUSTOM_CRON, timeValue: "*/15 * * * *" },
  associatedWalletId: "wallet-x-info",
}; 