import { AgentStatus, TriggerType, AIModel } from '../../types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear';
import { ExtendedAgent, MockLog } from './types';

export const featuredLPAgent: ExtendedAgent = {
  id: "featured-lp-provider-01",
  name: "Liquidity Provision Optimizer",
  description: "Discovers and manages LP positions based on APR, volume, and risk assessment.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "Liquidity Provision Optimizer", { size: 128, backgroundColor: ['d1d4f9'] }),
  status: AgentStatus.IDLE,
  systemPrompt: "Identify high-yield, relatively safe liquidity pools. Manage LP entries and exits based on market conditions and risk parameters.",
  model: AIModel.Claude37Sonnet,
  tasks: [
    { id: 'lp-task-01', description: "Scan for new pools or track smart money LP movements.", order: 1, tags: ['Discovery', 'Monitoring', 'LP'] },
    { id: 'lp-task-02', description: "For promising pools, find Pool Address / Token CA.", order: 2, tags: ['Data Fetch'] },
    { id: 'lp-task-03', description: "Analyze Pool APR & Volume.", order: 3, tags: ['Financial Analysis', 'APR', 'Volume'] },
    { id: 'lp-task-04', description: "Assess Pool Risk (IL & Security).", order: 4, tags: ['Risk Management', 'IL', 'Security'] },
    { id: 'lp-task-05', description: "Make LP decision (enter/exit/adjust).", order: 5, tags: ['Decision Making', 'Strategy'] },
    { id: 'lp-task-06', description: "Execute DEX LP Operation.", order: 6, tags: ['Trading', 'LP Operations'] },
  ],
  config: {
    dependentMCPs: [
      { mcpId: "mcp-pool-discovery", mcpName: "New Pool Discovery / Smart Money LP Tracking", order: 1, parameters: {} },
      { mcpId: "mcp-pool-apr-volume", mcpName: "Pool APR & Volume Analysis", order: 2, parameters: {} },
      { mcpId: "mcp-pool-risk", mcpName: "Pool Risk Assessment (IL & Security)", order: 3, parameters: {} },
      { mcpId: "mcp-dex-lp-op", mcpName: "DEX LP Operation", order: 4, parameters: {} },
    ],
    dependentAgents: [],
    outputActions: [{ outputType: 'TELEGRAM_NOTIFIER', outputProviderName: 'LP Alerts TG', parameters: { chatId: '@lpalerts' } }],
  },
  logs: [
    { id: 'log-lp-1', timestamp: Date.now() - 200000, message: "Discovered new SOL-USDC pool on Raydium. APR: 45%. Analyzing...", executionSteps: ["Pool Discovery MCP: New SOL-USDC pool found.", "Fetching APR & Volume..."], status: 'info' },
    { id: 'log-lp-2', timestamp: Date.now() - 100000, message: "SOL-USDC pool (Raydium) analysis: High APR, good volume, moderate IL risk. Security audit pending.", executionSteps: ["APR/Volume MCP: APR 45%, Vol $2M.", "Risk MCP: IL moderate, Security check initiated."], status: 'warning'},
  ],
  creator: "DeFiStrategist",
  lastModified: new Date(Date.now() - 100000),
  createdAt: new Date(Date.now() - 3 * 3600 * 1000),
  updatedAt: new Date(Date.now() - 100000),
  ownerId: 'user-default-01',
  triggerType: TriggerType.EVENT_DRIVEN,
  triggerConfig: { eventType: "New Pool Discovery / Smart Money LP Tracking", eventSource: "DexScreener/On-Chain", filterConditions: { minTVL: 100000 } },
  associatedWalletId: "wallet-lp-provider",
  featuredDescription: "**Trigger:** New Pool Discovery / Smart Money LP Tracking -> Find Pool Address / Token CA\n**Key MCPs:** Pool APR & Volume Analysis -> Pool Risk Assessment (IL & Security) -> DEX LP Operation",
  keyMCPs: ["Pool APR & Volume Analysis", "Pool Risk Assessment", "DEX LP Operation"],
}; 