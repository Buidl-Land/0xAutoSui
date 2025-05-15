// src/data/mockAgents.ts
import { Agent, TaskAgent, ActionAgent, AgentType, TriggerType, TriggerConfig, AgentConfig, MCPDependency, AgentDependency, OutputAction, AgentStatus, ScheduledTriggerFrequency, ScheduledTriggerConfig, Task } from '../types/agent';
// import { TaskData, TaskTimeType as TaskTimeTypeImport } from '../types/task'; // Removed TaskData import
// TriggerData, TriggerTimeType, MCPCondition are not directly used here anymore, but kept for potential future reference or if other parts of the app use them.
import { TriggerData, TriggerTimeType, MCPCondition } from '../types/trigger';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../utils/dicebear'; // Added import

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


const alphaTraderSystemPrompt = "Please retrieve information about the tokens traded by the corresponding wallet, analyze the information of the Swap tokens. When a Meme token is purchased for more than 5 SOL, analyze the token. This analysis needs to include the token's popularity on Twitter. If there are many positive tweets discussing this token, then use GoPlus to analyze the token's security and the top ten holders' percentage. If the token contract is relatively safe and the top ten holders' percentage does not exceed 20%, then help me use Jup Swap to buy 1 SOL of the corresponding token.";

const alphaTraderAgentLogs: MockLog[] = [
  {
    id: 'log-alpha-001',
    timestamp: Date.now() - 600000,
    userPrompt: alphaTraderSystemPrompt,
    agentResponse: "Okay, I will monitor the wallet and proceed with the analysis and trading strategy as you've outlined.",
    executionSteps: ["Initial setup based on user prompt."],
    status: 'info'
  },
  {
    id: 'log-alpha-002',
    timestamp: Date.now() - 590000,
    message: "Wallet Activity Detected: Buy of CANDY token (5.5 SOL).", // Simulated trigger
    agentResponse: "Processing new buy activity for CANDY token.",
    executionSteps: ["Calling WalletAnalyze to analyze the corresponding wallet records..."],
    status: 'info'
  },
  {
    id: 'log-alpha-003',
    timestamp: Date.now() - 580000,
    message: "Internal: WalletAnalyze found Candle (A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL).",
    agentResponse: "Found the most recently traded token: Candle (Contract: A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL).",
    executionSteps: ["WalletAnalyze completed."],
    status: 'success'
  },
  {
    id: 'log-alpha-004',
    timestamp: Date.now() - 570000,
    message: "Internal: Analyze Twitter for Candle.",
    agentResponse: "Calling TwitterCrawler to analyze Twitter popularity for Candle...",
    executionSteps: ["Initiating TwitterCrawler for Candle."],
    status: 'info'
  },
  {
    id: 'log-alpha-005',
    timestamp: Date.now() - 560000,
    message: "Internal: TwitterCrawler results for Candle.",
    agentResponse: "Found 30 tweets. Analyzing the latest 5 tweets, the community is positive about the token, believing Candle has short-term speculative value.",
    executionSteps: ["TwitterCrawler completed. Sentiment: Positive."],
    status: 'success'
  },
  {
    id: 'log-alpha-006',
    timestamp: Date.now() - 550000,
    message: "Internal: Analyze GoPlus for Candle.",
    agentResponse: "Calling GoPlus to analyze token security for Candle...",
    executionSteps: ["Initiating GoPlus security check for Candle."],
    status: 'info'
  },
  {
    id: 'log-alpha-007',
    timestamp: Date.now() - 540000,
    message: "Internal: GoPlus results for Candle.",
    agentResponse: "Retrieving token details... No risk items found. Top ten holders account for 16.5%.",
    executionSteps: ["GoPlus check completed. Security: OK. Holder concentration: 16.5%."],
    status: 'success'
  },
  {
    id: 'log-alpha-008',
    timestamp: Date.now() - 530000,
    message: "Internal: Conditions met for trade.",
    agentResponse: "Conforms to trading rules. Initiating swap of 1 SOL for Candle.",
    executionSteps: ["All conditions met. Preparing to trade."],
    status: 'info'
  },
  {
    id: 'log-alpha-009',
    timestamp: Date.now() - 520000,
    message: "Internal: Execute JupSwap for Candle.",
    agentResponse: "Calling Jup Swap to execute the trade of 1 SOL for Candle...",
    executionSteps: ["Initiating JupSwap for 1 SOL of Candle."],
    status: 'info'
  },
  {
    id: 'log-alpha-010',
    timestamp: Date.now() - 510000,
    message: "Internal: JupSwap trade complete.",
    agentResponse: "Trade executed successfully. Process complete.",
    executionSteps: ["JupSwap trade successful."],
    status: 'success'
  }
];

const alphaTraderAgent: ExtendedAgent = {
  id: 'alpha-trader-01',
  name: 'Alpha Smart Trader', // Renamed slightly from mock
  description: 'Follows KOL wallets to automatically capture Alpha opportunities by analyzing Meme tokens and executing trades.',
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "Alpha Smart Trader", { size: 128, backgroundColor: ['f9d4d4'] }), // Updated iconUrl
  agentType: 'Task',
  status: AgentStatus.RUNNING,
  systemPrompt: alphaTraderSystemPrompt,
  tasks: [
    {
      id: 'alpha-trader-task-01',
      description: "Monitor KOL wallet for Meme token buys > 5 SOL, analyze Twitter sentiment, check GoPlus security, then trade 1 SOL via JupSwap.",
      order: 1,
      tags: ['Monitoring', 'Trading', 'Meme Coin', 'SOL']
    }
  ],
  config: {
    dependentMCPs: [
      { mcpId: 'WalletAnalyze', mcpName: 'WalletAnalyze', order: 1, parameters: {} },
      { mcpId: 'TwitterCrawler', mcpName: 'TwitterCrawler', order: 2, parameters: {} },
      { mcpId: 'GoPlus', mcpName: 'GoPlus', order: 3, parameters: {} },
      { mcpId: 'JupSwap', mcpName: 'JupSwap', order: 4, parameters: {} }
    ],
    dependentAgents: [],
    outputActions: [{ outputType: 'TELEGRAM_NOTIFIER', outputProviderName: 'Trade Alerts TG', parameters: { chatId: '@alphatrades' } }],
  },
  logs: alphaTraderAgentLogs,
  creator: 'System',
  lastModified: Date.now() - 510000,
  createdAt: new Date(Date.now() - 1000000),
  updatedAt: new Date(Date.now() - 510000),
  ownerId: 'user-default-01',
  triggerType: TriggerType.EVENT_DRIVEN, // Changed to reflect description
  triggerConfig: { eventType: "Smart Money Movement / Twitter Event", eventSource: "On-chain & Twitter API", filterConditions: {} }, // Mock event config
  associatedWalletId: "wallet-main-alpha",
  autoRefillServiceCredits: true,
  serviceCreditsRefillThreshold: 100,
  serviceCreditsRefillAmount: 500,
  autoRefillSol: false,
  featuredDescription: "**Trigger:** Twitter Event / Smart Money Movement -> Find Contract Address (CA)\n**Key MCPs:** Twitter Sentiment Analysis -> CA Alert Evaluation -> Wallet Transaction (JupSwap)",
  keyMCPs: ["Twitter Sentiment Analysis", "CA Alert Evaluation", "Wallet Transaction (JupSwap)"],
};

const dcaSolAgent: ExtendedAgent = {
  id: "dca-sol-01", // was "1"
  name: "DCA SOL Agent", // was "DCA SOL"
  description: "Automatically buys SOL based on the AHR999 index, placing remaining funds in DeFi lending protocols.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "DCA SOL Agent", { size: 128, backgroundColor: ['b6e3f4'] }), // Updated iconUrl
  agentType: 'Task',
  status: AgentStatus.RUNNING,
  systemPrompt: "Act as a Dollar Cost Averaging bot for SOL, optimizing entries based on AHR999 and managing capital in DeFi.",
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
    dependentAgents: [
      // { dependentAgentId: "x-info-collector-01", dependentAgentName: "X Info Collector", interactionConfig: {} }
    ],
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
  triggerConfig: { frequency: ScheduledTriggerFrequency.DAILY, timeValue: "00:00" } as ScheduledTriggerConfig,
  associatedWalletId: "wallet-dca-sol",
};

const xInfoCollectorAgent: ExtendedAgent = {
  id: "x-info-collector-01", // was "2"
  name: "X Info Collector",
  description: "Collects relevant tweets from specified Twitter accounts, filters out ads/gossip, summarizes valuable information, and sends to a TG Bot.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "X Info Collector", { size: 128, backgroundColor: ['c0aede'] }), // Updated iconUrl
  agentType: 'Task',
  status: AgentStatus.RUNNING,
  systemPrompt: "Act as an information gatherer and summarizer from X (Twitter), focusing on actionable insights.",
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
  triggerConfig: { frequency: ScheduledTriggerFrequency.CUSTOM_CRON, timeValue: "*/15 * * * *" } as ScheduledTriggerConfig, // Every 15 minutes
  associatedWalletId: "wallet-x-info",
};


// --- NEW FEATURED AGENTS ---

const featuredPerpTradingAgent: ExtendedAgent = {
  id: "featured-perp-trader-01",
  name: "Perp Futures Trader",
  description: "Executes automated perpetual futures trading strategies based on K-line patterns and volume analysis.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "Perp Futures Trader", { size: 128, backgroundColor: ['f9d4d4'] }), // Updated iconUrl
  agentType: 'Task',
  status: AgentStatus.RUNNING,
  systemPrompt: "Analyze market data (K-lines, volume) to identify high-probability perp trading setups. Execute trades with defined TP/SL.",
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
  triggerConfig: { frequency: ScheduledTriggerFrequency.HOURLY, timeValue: ":00" } as ScheduledTriggerConfig, // Top of every hour
  associatedWalletId: "wallet-perp-trader",
  featuredDescription: "**Trigger:** Scheduled Time\n**Key MCPs/A2A:** Fetch DEX/CEX Prices & K-lines -> A2A: K-line Pattern Analysis -> A2A: Volume Analysis -> A2A: Decision & Set TP/SL -> MCP: DEX/CEX Order Placement",
  keyMCPs: ["Fetch DEX/CEX K-lines", "K-line Pattern Analysis (A2A)", "Volume Analysis (A2A)", "Decision & TP/SL (A2A)", "DEX/CEX Order Placement"],
};

const featuredLPAgent: ExtendedAgent = {
  id: "featured-lp-provider-01",
  name: "Liquidity Provision Optimizer",
  description: "Discovers and manages LP positions based on APR, volume, and risk assessment.",
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "Liquidity Provision Optimizer", { size: 128, backgroundColor: ['d1d4f9'] }), // Updated iconUrl
  agentType: 'Task',
  status: AgentStatus.IDLE,
  systemPrompt: "Identify high-yield, relatively safe liquidity pools. Manage LP entries and exits based on market conditions and risk parameters.",
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


// Existing marketAnalysisAgent and chatAgent can be kept or modified as needed
// For brevity, I'll assume they are fine or will be updated/removed later if not part of the core showcase

export const mockAgents: ExtendedAgent[] = [
  alphaTraderAgent, // This is the renamed original alphaTraderAgent
  featuredPerpTradingAgent, // New featured agent
  featuredLPAgent, // New featured agent
  dcaSolAgent, // Kept for variety
  xInfoCollectorAgent, // Kept for variety
  // marketAnalysisAgent, // Can be uncommented if still needed
  // chatAgent, // Can be uncommented if still needed
];

export const getMockAgentById = (id: string): ExtendedAgent | undefined => {
  return mockAgents.find(agent => agent.id === id);
};

export const getFeaturedAgents = (): ExtendedAgent[] => {
  return mockAgents.filter(agent =>
    agent.id === 'alpha-trader-01' ||
    agent.id === 'featured-perp-trader-01' ||
    agent.id === 'featured-lp-provider-01'
  );
};
// ... (rest of the file, like createMockAgent if it exists)