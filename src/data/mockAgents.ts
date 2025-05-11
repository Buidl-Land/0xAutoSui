// src/data/mockAgents.ts
import { Agent, TaskAgent, ActionAgent, AgentType, TriggerType, TriggerConfig, AgentConfig, MCPDependency, AgentDependency, OutputAction, AgentStatus, ScheduledTriggerFrequency, ScheduledTriggerConfig } from '../types/agent';
import { TaskData, TaskTimeType as TaskTimeTypeImport } from '../types/task';
// TriggerData, TriggerTimeType, MCPCondition are not directly used here anymore, but kept for potential future reference or if other parts of the app use them.
import { TriggerData, TriggerTimeType, MCPCondition } from '../types/trigger';

// Define a more specific Log type for our mock data, matching [agentId]/page.tsx
export interface MockLog {
  id: string;
  timestamp: number;
  userPrompt: string;
  agentResponse: string;
  executionSteps: string[];
  message?: string; // Optional summary
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
  tasks?: TaskData[];
  associatedWalletId?: string | null;
  autoRefillServiceCredits?: boolean;
  serviceCreditsRefillThreshold?: number;
  serviceCreditsRefillAmount?: number;
  autoRefillSol?: boolean;
  solRefillThreshold?: number;
  solRefillAmount?: number;
  solRefillSourceEoa?: string;
};


const alphaTraderSystemPrompt = "Please retrieve information about the tokens traded by the corresponding wallet, analyze the information of the Swap tokens. When a Meme token is purchased for more than 5 SOL, analyze the token. This analysis needs to include the token's popularity on Twitter. If there are many positive tweets discussing this token, then use GoPlus to analyze the token's security and the top ten holders' percentage. If the token contract is relatively safe and the top ten holders' percentage does not exceed 20%, then help me use Jup Swap to buy 1 SOL of the corresponding token.";

const alphaTraderAgentLogs: MockLog[] = [
  {
    id: 'log-alpha-001',
    timestamp: Date.now() - 600000,
    userPrompt: alphaTraderSystemPrompt,
    agentResponse: "Okay, I will monitor the wallet and proceed with the analysis and trading strategy as you've outlined.",
    executionSteps: ["Initial setup based on user prompt."]
  },
  {
    id: 'log-alpha-002',
    timestamp: Date.now() - 590000,
    userPrompt: "Wallet Activity Detected: Buy of CANDY token (5.5 SOL).", // Simulated trigger
    agentResponse: "Processing new buy activity for CANDY token.",
    executionSteps: ["Calling WalletAnalyze to analyze the corresponding wallet records..."]
  },
  {
    id: 'log-alpha-003',
    timestamp: Date.now() - 580000,
    userPrompt: "Internal: WalletAnalyze found Candle (A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL).",
    agentResponse: "Found the most recently traded token: Candle (Contract: A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL).",
    executionSteps: ["WalletAnalyze completed."]
  },
  {
    id: 'log-alpha-004',
    timestamp: Date.now() - 570000,
    userPrompt: "Internal: Analyze Twitter for Candle.",
    agentResponse: "Calling TwitterCrawler to analyze Twitter popularity for Candle...",
    executionSteps: ["Initiating TwitterCrawler for Candle."]
  },
  {
    id: 'log-alpha-005',
    timestamp: Date.now() - 560000,
    userPrompt: "Internal: TwitterCrawler results for Candle.",
    agentResponse: "Found 30 tweets. Analyzing the latest 5 tweets, the community is positive about the token, believing Candle has short-term speculative value.",
    executionSteps: ["TwitterCrawler completed. Sentiment: Positive."]
  },
  {
    id: 'log-alpha-006',
    timestamp: Date.now() - 550000,
    userPrompt: "Internal: Analyze GoPlus for Candle.",
    agentResponse: "Calling GoPlus to analyze token security for Candle...",
    executionSteps: ["Initiating GoPlus security check for Candle."]
  },
  {
    id: 'log-alpha-007',
    timestamp: Date.now() - 540000,
    userPrompt: "Internal: GoPlus results for Candle.",
    agentResponse: "Retrieving token details... No risk items found. Top ten holders account for 16.5%.",
    executionSteps: ["GoPlus check completed. Security: OK. Holder concentration: 16.5%."]
  },
  {
    id: 'log-alpha-008',
    timestamp: Date.now() - 530000,
    userPrompt: "Internal: Conditions met for trade.",
    agentResponse: "Conforms to trading rules. Initiating swap of 1 SOL for Candle.",
    executionSteps: ["All conditions met. Preparing to trade."]
  },
  {
    id: 'log-alpha-009',
    timestamp: Date.now() - 520000,
    userPrompt: "Internal: Execute JupSwap for Candle.",
    agentResponse: "Calling Jup Swap to execute the trade of 1 SOL for Candle...",
    executionSteps: ["Initiating JupSwap for 1 SOL of Candle."]
  },
  {
    id: 'log-alpha-010',
    timestamp: Date.now() - 510000,
    userPrompt: "Internal: JupSwap trade complete.",
    agentResponse: "Trade executed successfully. Process complete.",
    executionSteps: ["JupSwap trade successful."]
  }
];

const alphaTraderAgent: ExtendedAgent = {
  id: 'alpha-trader-01',
  name: 'Alpha Trader',
  description: 'Follows the Wang Xiaoer KOL wallet to automatically capture Alpha opportunities.',
  iconUrl: '/logo.png',
  agentType: 'Task',
  status: AgentStatus.RUNNING,
  systemPrompt: alphaTraderSystemPrompt,
  tasks: [
    {
      id: 'alpha-trader-task-01',
      name: 'KOL Wallet Monitoring and Meme Trading',
      prompt: "Monitor KOL wallet 71CPXu3TvH3iUKaY1bNkAAow24k6tjH473SsKprQBABC for buy/sell activity. If a Meme token is purchased for >5 SOL: 1. Analyze token popularity on Twitter. 2. If positive sentiment, check GoPlus for security & top 10 holders (<20%). 3. If safe, buy 1 SOL via JupSwap.",
      timeType: 'interval' as TaskTimeTypeImport,
      interval: '5min',
      status: 'Active',
      agentName: 'Alpha Trader'
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
    outputActions: [],
  },
  logs: alphaTraderAgentLogs,
  creator: 'System',
  lastModified: Date.now() - 510000,
  createdAt: new Date(Date.now() - 1000000),
  updatedAt: new Date(Date.now() - 510000),
  ownerId: 'user-default-01',
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: {
    frequency: ScheduledTriggerFrequency.DAILY,
    timeValue: "09:00"
  } as ScheduledTriggerConfig,
  associatedWalletId: "wallet-main-alpha",
  autoRefillServiceCredits: true,
  serviceCreditsRefillThreshold: 100,
  serviceCreditsRefillAmount: 500,
  autoRefillSol: false,
};

const dcaSolAgent: ExtendedAgent = {
  id: "1",
  name: "DCA SOL",
  status: AgentStatus.RUNNING,
  description: "Automatically buys SOL based on the AHR999 index, placing remaining funds in DeFi lending protocols.",
  lastModified: new Date(Date.now() - 86400000),
  creator: "AdminUser",
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: {
    frequency: ScheduledTriggerFrequency.CUSTOM_CRON,
    timeValue: "0 0 * * 1" // Example: Every Monday at midnight
  } as ScheduledTriggerConfig,
  config: {
    dependentMCPs: [
      { mcpId: "mcp-ahr999", mcpName: "AHR999 Info Fetch MCP", order: 1, parameters: {} },
      { mcpId: "mcp-SOL-trade", mcpName: "SOL/USDT Trading MCP", order: 2, parameters: {} },
      { mcpId: "mcp-defi-lend", mcpName: "DeFi Lending MCP", order: 3, parameters: {} },
    ],
    dependentAgents: [
      { dependentAgentId: "2", dependentAgentName: "X Info Collector", interactionConfig: {} }
    ],
    outputActions: [],
  },
  logs: [
    {
      id: "log1",
      timestamp: Date.now() - 3600000,
      userPrompt: "Execute DCA strategy for SOL.",
      agentResponse: "DCA strategy executed successfully. Bought 0.5 SOL.",
      executionSteps: [
        "Checked AHR999 index: 0.42.",
        "Condition met for purchase.",
        "Called SOL/USDT Trading MCP: Buy 0.5 SOL.",
        "Trade successful.",
      ],
      message: "Run 1: Success"
    },
    {
      id: "log2",
      timestamp: Date.now(),
      userPrompt: "Check SOL balance.",
      agentResponse: "Current SOL balance is 10.5 SOL.",
      executionSteps: [
        "Called Wallet Balance MCP: Get SOL balance.",
        "Retrieved balance: 10.5 SOL.",
      ],
      message: "Run 2: Success"
    },
  ],
  iconUrl: "/logo.png",
  systemPrompt: "Act as a Dollar Cost Averaging bot for SOL.",
  agentType: 'Task',
  ownerId: "user-123",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  updatedAt: new Date(Date.now() - 86400000), // 1 day ago
  tasks: [],
  associatedWalletId: "wallet-dca-sol",
};

const xInfoCollectorAgent: ExtendedAgent = {
  id: "2",
  name: "X Info Collector",
  status: AgentStatus.RUNNING,
  description: "Collects relevant tweets from specified Twitter accounts, filters out ads/gossip, summarizes valuable information, and sends to a TG Bot.",
  lastModified: new Date(Date.now() - 172800000), // 2 days ago
  creator: "TraderX",
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: {
    frequency: ScheduledTriggerFrequency.CUSTOM_CRON,
    timeValue: "*/15 * * * *" // Every 15 minutes
  } as ScheduledTriggerConfig,
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
    {
      id: "log3",
      timestamp: Date.now() - 7200000, // 2 hours ago
      userPrompt: "Monitor X for #DegenToken mentions by @CryptoKOL.",
      agentResponse: "Found 1 new mention of #DegenToken by @CryptoKOL. Sentiment: Positive. Summary sent to TG.",
      executionSteps: [
        "Called X Info Fetch MCP for @CryptoKOL with keyword #DegenToken.",
        "Found 1 matching tweet: 'Excited about #DegenToken launch! To the moon!'",
        "Filtered out gossip/ads. Valuable info: Positive sentiment, upcoming launch.",
        "Summarized: '@CryptoKOL is positive about #DegenToken launch.'",
        "Sent summary via TG Bot MCP.",
      ],
      message: "Run 1: Found 1 positive tweet, sent to TG."
    },
    {
      id: "log4",
      timestamp: Date.now(),
      userPrompt: "Monitor X for #DegenToken mentions by @CryptoKOL.",
      agentResponse: "No new mentions found.",
      executionSteps: [
        "Called X Info Fetch MCP for @CryptoKOL with keyword #DegenToken.",
        "No new tweets found.",
      ],
      message: "Run 2: No new mentions."
    },
  ],
  iconUrl: null,
  systemPrompt: "Act as an information gatherer and summarizer from X (Twitter).",
  agentType: 'Task',
  ownerId: "user-456",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  updatedAt: new Date(Date.now() - 172800000), // 2 days ago
  tasks: [],
  associatedWalletId: "wallet-x-info",
};

const marketAnalysisAgent: ExtendedAgent = {
  id: "3",
  name: "Market Analysis Agent",
  status: AgentStatus.STOPPED,
  description: "Analyzes market conditions using liquidation maps, funding rates, and whale holdings changes, providing analysis reports via TG Bot.",
  lastModified: new Date(),
  creator: "AdminUser",
  triggerType: TriggerType.MANUAL, // Action agents are often manually triggered or via API
  triggerConfig: null,
  config: {
    dependentMCPs: [
      { mcpId: "mcp-liq-map", mcpName: "Liquidation Map MCP", order: 1, parameters: {} },
      { mcpId: "mcp-funding-rate", mcpName: "Funding Rate MCP", order: 2, parameters: {} },
      { mcpId: "mcp-whale-holdings", mcpName: "Whale Holdings MCP", order: 3, parameters: {} },
    ],
    dependentAgents: [], // Action agents typically don't depend on other agents in this manner
    outputActions: [
      { outputType: "TELEGRAM_NOTIFIER", outputProviderName: "TG Bot MCP", parameters: { "chatId": "@market_reports", "messageTemplate": "Market Analysis: {{reportContent}}" } }
    ],
  },
  logs: [
    {
      id: "log5",
      timestamp: Date.now() - 3600000, // 1 hour ago
      userPrompt: "Generate SOL market analysis report.",
      agentResponse: "Market analysis report generated and sent to TG. SOL shows bullish signs based on funding rates.",
      executionSteps: [
        "Called Liquidation Map MCP for SOL.",
        "Called Funding Rate MCP for SOL.",
        "Called Whale Holdings MCP for SOL.",
        "Analyzed data: Funding rates positive, slight increase in whale accumulation.",
        "Generated report: 'SOL Market Analysis: Bullish short-term outlook based on positive funding rates and whale accumulation. Key support at $X, resistance at $Y.'",
        "Sent report via TG Bot MCP.",
      ],
      message: "Run 1: Report generated and sent."
    },
     {
      id: "log6",
      timestamp: Date.now(),
      userPrompt: "Generate SOL market analysis report.",
      agentResponse: "Agent stopped manually before analysis could complete.",
      executionSteps: [
        "Received manual stop command.",
        "Terminating process.",
      ],
      message: "Run 2: Stopped manually"
    }
  ],
  iconUrl: null,
  systemPrompt: "Act as a market analyst providing reports based on various data sources.",
  agentType: 'Action',
  ownerId: "user-123",
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  updatedAt: new Date(),
  associatedWalletId: "wallet-market-analysis",
};

const chatAgent: ExtendedAgent = {
  id: "chat-agent-01",
  name: "Helpful Assistant",
  status: AgentStatus.IDLE,
  description: "A friendly chat assistant to help you with your queries.",
  lastModified: new Date(),
  creator: "System",
  triggerType: TriggerType.MANUAL,
  triggerConfig: null,
  config: {
    dependentMCPs: [],
    dependentAgents: [],
    outputActions: [],
  },
  logs: [
    {
      id: "log-chat-001",
      timestamp: Date.now() - 120000,
      userPrompt: "Hello there!",
      agentResponse: "Hi! How can I help you today?",
      executionSteps: ["Responded to greeting."],
      message: "Initial interaction"
    }
  ],
  iconUrl: null,
  systemPrompt: "You are a helpful and friendly assistant. Answer user queries concisely.",
  agentType: 'Chat',
  ownerId: "user-default-01",
  createdAt: new Date(Date.now() - 600000), // 10 minutes ago
  updatedAt: new Date(),
  tasks: [],
  associatedWalletId: null,
};

export const mockAgents: ExtendedAgent[] = [
  alphaTraderAgent,
  dcaSolAgent,
  xInfoCollectorAgent,
  marketAnalysisAgent,
  chatAgent,
];