import { AgentStatus, TriggerType, ScheduledTriggerFrequency, AIModel } from '../../types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear';
import { ExtendedAgent, MockLog } from './types';

export const featuredPerpTradingAgent: ExtendedAgent = {
  id: "featured-perp-trader-01",
  name: "Perp Futures Trader",
  description: "Executes automated perpetual futures trading strategies based on K-line patterns and volume analysis.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "Perp Futures Trader", { size: 128, backgroundColor: ['f9d4d4'] }),
  status: AgentStatus.RUNNING,
  systemPrompt: "Analyze market data (K-lines, volume) to identify high-probability perp trading setups. Execute trades with defined TP/SL.",
  model: AIModel.Claude37Sonnet,
  tasks: [
    { id: 'perp-task-01', description: "Fetch hourly K-lines for BTC-PERP.", order: 1, tags: ['Data Fetch', 'Perps', 'BTC'] },
    { id: 'perp-task-02', description: "Analyze K-line patterns (e.g., breakouts, reversals).", order: 2, tags: ['Technical Analysis', 'Pattern Recognition'] },
    { id: 'perp-task-03', description: "Analyze trading volume for confirmation.", order: 3, tags: ['Volume Analysis'] },
    { id: 'perp-task-04', description: "If setup confirmed, determine entry, TP, SL.", order: 4, tags: ['Strategy', 'Risk Management'] },
    { id: 'perp-task-05', description: "Place order on DEX/CEX.", order: 5, tags: ['Trading', 'Order Execution'] },
  ],
  config: {
    dependentMCPs: [
      { mcpId: "mcp-kline-fetch", mcpName: "Fetch DEX/CEX Prices & K-lines", order: 1, parameters: { pair: "BTC-PERP", interval: "1h" } },
      { mcpId: "mcp-order-placement", mcpName: "DEX/CEX Order Placement", order: 2, parameters: { exchange: "HyperLiquid" } },
    ],
    dependentAgents: [
      { dependentAgentId: "agent-kline-pattern", dependentAgentName: "K-line Pattern Analysis Agent", interactionConfig: { type: "requestPattern" } },
      { dependentAgentId: "agent-volume-analysis", dependentAgentName: "Volume Analysis Agent", interactionConfig: { type: "requestVolumeConfirm" } },
      { dependentAgentId: "agent-decision-tp-sl", dependentAgentName: "Decision & Set TP/SL Agent", interactionConfig: { type: "getTradeParams" } },
    ],
    outputActions: [{ outputType: 'TELEGRAM_NOTIFIER', outputProviderName: 'Perp Trades TG', parameters: { chatId: '@perptrades' } }],
  },
  logs: [
    { id: 'log-perp-1', timestamp: Date.now() - 100000, message: "Identified bullish breakout on BTC-PERP 1H. Placing long order.", executionSteps: ["Fetched K-lines.", "Pattern Agent: Bullish Breakout confirmed.", "Volume Agent: Volume supports breakout.", "Decision Agent: Entry 65000, TP 68000, SL 64000.", "Order Placed."], status: 'success' },
    { id: 'log-perp-2', timestamp: Date.now() - 50000, message: "Trade ongoing. Current P&L: +250 USDC", executionSteps: ["Monitoring position."], status: 'info'},
  ],
  creator: "TraderAI",
  lastModified: new Date(Date.now() - 50000),
  createdAt: new Date(Date.now() - 2 * 3600 * 1000),
  updatedAt: new Date(Date.now() - 50000),
  ownerId: 'user-default-01',
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: { frequency: ScheduledTriggerFrequency.HOURLY, timeValue: ":00" },
  associatedWalletId: "wallet-perp-trader",
  featuredDescription: "**Trigger:** Scheduled Time\n**Key MCPs/A2A:** Fetch DEX/CEX Prices & K-lines -> A2A: K-line Pattern Analysis -> A2A: Volume Analysis -> A2A: Decision & Set TP/SL -> MCP: DEX/CEX Order Placement",
}; 