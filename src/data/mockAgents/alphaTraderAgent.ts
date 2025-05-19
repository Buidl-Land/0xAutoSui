import { AgentStatus, TriggerType, ScheduledTriggerFrequency, AIModel, EventType, EventSource } from '../../types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear';
import { ExtendedAgent, MockLog } from './types';

const alphaTraderSystemPrompt = "Please retrieve information about the tokens traded by the corresponding wallet, analyze the information of the Swap tokens. When a Meme token is purchased for more than 5 SOL, analyze the token. This analysis needs to include the token's popularity on Twitter. If there are many positive tweets discussing this token, then use GoPlus to analyze the token's security and the top ten holders' percentage. If the token contract is relatively safe and the top ten holders' percentage does not exceed 20%, then help me use OKX Dex to buy 1 SOL of the corresponding token.";

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
    message: "Wallet Activity Detected: Buy of CANDY token (5.5 SOL).",
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
    message: "Internal: Execute OKX Dex for Candle.",
    agentResponse: "Calling OKX Dex to execute the trade of 1 SOL for Candle...",
    executionSteps: ["Initiating OKX Dex for 1 SOL of Candle."],
    status: 'info'
  },
  {
    id: 'log-alpha-010',
    timestamp: Date.now() - 510000,
    message: "Internal: OKX Dex trade complete.",
    agentResponse: "Trade executed successfully. Process complete.",
    executionSteps: ["OKX Dex trade successful."],
    status: 'success'
  }
];

export const alphaTraderAgent: ExtendedAgent = {
  id: 'alpha-trader-01',
  name: 'Alpha Smart Trader',
  description: 'Follows KOL wallets to automatically capture Alpha opportunities by analyzing Meme tokens and executing trades.',
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, "Alpha Smart Trader", { size: 128, backgroundColor: ['f9d4d4'] }),
  status: AgentStatus.RUNNING,
  systemPrompt: alphaTraderSystemPrompt,
  model: AIModel.Gemini25Pro,
  tasks: [
    {
      id: 'alpha-trader-task-01',
      description: "Monitor KOL wallet for Meme token buys > 5 SOL, analyze Twitter sentiment, check GoPlus security, then trade 1 SOL via OKX Dex.",
      order: 1,
      tags: ['Monitoring', 'Trading', 'Meme Coin', 'SOL']
    }
  ],
  config: {
    dependentMCPs: [
      { mcpId: 'WalletAnalyze', mcpName: 'WalletAnalyze', order: 1, parameters: {} },
      { mcpId: 'TwitterCrawler', mcpName: 'TwitterCrawler', order: 2, parameters: {} },
      { mcpId: 'GoPlus', mcpName: 'GoPlus', order: 3, parameters: {} },
      { mcpId: 'OKX Dex', mcpName: 'OKX Dex', order: 4, parameters: {} }
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
  triggerType: TriggerType.EVENT_DRIVEN,
  triggerConfig: {
    eventType: EventType.TRANSACTION_MONITOR,
    eventSource: EventSource.BITQUERY,
    eventTarget: [
      "73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B",
      "DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj"
    ],
    filterConditions: {}
  },
  associatedWalletId: "wallet-main-alpha",
  autoRefillServiceCredits: true,
  serviceCreditsRefillThreshold: 100,
  serviceCreditsRefillAmount: 500,
  autoRefillSol: false,
  featuredDescription: "**Trigger:** Twitter Event / Smart Money Movement -> Find Contract Address (CA)\n**Key MCPs:** Twitter Sentiment Analysis -> CA Alert Evaluation -> Wallet Transaction (OKX Dex)",
};