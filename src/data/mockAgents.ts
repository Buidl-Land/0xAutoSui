// src/data/mockAgents.ts
import { Agent, TaskAgent, ActionAgent, AgentType, AgentConnection } from '../types/agent'; // Added AgentConnection
import { TaskData, TaskTimeType as TaskTimeTypeImport } from '../types/task'; // Renamed to avoid conflict
import { TriggerData, TriggerTimeType, MCPCondition } from '../types/trigger'; // Added MCPCondition

// Define a more specific Log type for our mock data, matching [agentId]/page.tsx
export interface MockLog {
  id: string;
  timestamp: number;
  userPrompt: string;
  agentResponse: string;
  executionSteps: string[];
  message?: string; // Optional summary
}

// Define MockTriggerConfig based on TriggerData, similar to [agentId]/page.tsx
export interface MockTriggerConfig extends TriggerData {
  type?: string; // Kept for compatibility if needed, but prefer using TriggerData fields
  [key: string]: any; // Allow other properties for now
}

export interface MockMcpConfig {
  name: string;
  id: string;
}

// Extended Agent type for mock data to include all fields from both sources
export type ExtendedAgent = Agent & {
  status?: string;
  lastModified?: Date | number;
  creator?: string;
  triggerConfig?: MockTriggerConfig[]; // From [agentId]/page.tsx
  mcpConfig?: MockMcpConfig[]; // From [agentId]/page.tsx and agents/page.tsx
  logs?: MockLog[]; // Using the more detailed MockLog
  // tasks?: TaskData[]; // Already in TaskAgent
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

const alphaTraderAgent: ExtendedAgent & TaskAgent = {
  id: 'alpha-trader-01',
  name: 'Alpha Trader',
  description: 'Follows the Wang Xiaoer KOL wallet to automatically capture Alpha opportunities.',
  iconUrl: '/logo.png',
  agentType: 'Task',
  status: 'running',
  systemPrompt: alphaTraderSystemPrompt,
  tasks: [
    {
      id: 'alpha-trader-task-01',
      name: 'KOL Wallet Monitoring and Meme Trading',
      prompt: "Monitor KOL wallet 71CPXu3TvH3iUKaY1bNkAAow24k6tjH473SsKprQBABC for buy/sell activity. If a Meme token is purchased for >5 SOL: 1. Analyze token popularity on Twitter. 2. If positive sentiment, check GoPlus for security & top 10 holders (<20%). 3. If safe, buy 1 SOL via JupSwap.",
      timeType: 'interval' as TaskTimeTypeImport, // This should ideally be an event-driven trigger
      interval: '5min', // Placeholder for the "wait 5 minutes" part
      status: 'Active',
      agentName: 'Alpha Trader'
    }
  ],
  mcpConfig: [
    { name: 'WalletAnalyze', id: 'WalletAnalyze' },
    { name: 'TwitterCrawler', id: 'TwitterCrawler' },
    { name: 'GoPlus', id: 'GoPlus' },
    { name: 'JupSwap', id: 'JupSwap' }
  ],
  a2aConnections: [],
  logs: alphaTraderAgentLogs,
  creator: 'System',
  lastModified: Date.now() - 510000,
  createdAt: new Date(Date.now() - 1000000),
  updatedAt: new Date(Date.now() - 510000),
  ownerId: 'user-default-01',
};

const dcaSolAgent: ExtendedAgent & TaskAgent = {
  id: "1",
  name: "DCA SOL",
  status: "Running",
  description: "Automatically buys SOL based on the AHR999 index, placing remaining funds in DeFi lending protocols.",
  lastModified: new Date(Date.now() - 86400000),
  creator: "AdminUser",
  triggerConfig: [
    { id: "t1", type: "Copy Trading", interval: "5min", name: "DCA Trigger", prompt: "Execute DCA", timeType: "interval" as TriggerTimeType },
  ],
  mcpConfig: [
    { name: "AHR999 Info Fetch MCP", id: "mcp-ahr999" },
    { name: "SOL/USDT Trading MCP", id: "mcp-SOL-trade" },
    { name: "DeFi Lending MCP", id: "mcp-defi-lend" },
  ],
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
  a2aConnections: [
    { connectedAgentId: "2", connectionType: "DATA_EXCHANGE" },
  ],
  ownerId: "user-123",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  updatedAt: new Date(Date.now() - 86400000), // 1 day ago
  tasks: [],
};

const xInfoCollectorAgent: ExtendedAgent & TaskAgent = {
  id: "2",
  name: "X Info Collector",
  status: "Running",
  description: "Collects relevant tweets from specified Twitter accounts, filters out ads/gossip, summarizes valuable information, and sends to a TG Bot.",
  lastModified: new Date(Date.now() - 172800000), // 2 days ago
  creator: "TraderX",
  triggerConfig: [
    { id: "t2", type: "Event: Social", keyword: "#DegenToken", user: "@CryptoKOL", name: "X Social Trigger", prompt: "Monitor X for #DegenToken mentions by @CryptoKOL and summarize.", timeType: "interval" as TriggerTimeType, interval: "15min" },
  ],
  mcpConfig: [
    { name: "X Info Fetch MCP", id: "mcp-x-info" },
    { name: "TG Bot MCP", id: "mcp-tg-bot" },
  ],
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
  a2aConnections: [],
  ownerId: "user-456",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  updatedAt: new Date(Date.now() - 172800000), // 2 days ago
  tasks: [],
};

const marketAnalysisAgent: ExtendedAgent & ActionAgent = { // Changed to ActionAgent
  id: "3",
  name: "Market Analysis Agent",
  status: "Stopped",
  description: "Analyzes market conditions using liquidation maps, funding rates, and whale holdings changes, providing analysis reports via TG Bot.",
  lastModified: new Date(),
  creator: "AdminUser",
  // ActionAgents typically don't have triggerConfig, but if it's used for manual runs or as a callable service, it might be here.
  // For this example, let's assume it can be triggered to generate a report.
  triggerConfig: [
     { id: "t3", type: "Manual or API Call", name: "Market Analysis Report Trigger", prompt: "Generate SOL market analysis report.", timeType: "cron" as TriggerTimeType, cronExpression: "0 0 * * *" } // Example: Daily at midnight
  ],
  mcpConfig: [
    { name: "Liquidation Map MCP", id: "mcp-liq-map" },
    { name: "Funding Rate MCP", id: "mcp-funding-rate" },
    { name: "Whale Holdings MCP", id: "mcp-whale-holdings" },
    { name: "TG Bot MCP", id: "mcp-tg-bot" }, // For sending reports
  ],
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
  agentType: 'Action', // Corrected to Action
  ownerId: "user-123",
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  updatedAt: new Date(),
};


export const mockAgents: ExtendedAgent[] = [
  alphaTraderAgent,
  dcaSolAgent,
  xInfoCollectorAgent,
  marketAnalysisAgent,
];