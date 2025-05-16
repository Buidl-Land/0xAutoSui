// Path: src/data/mockAgentTemplates.ts
import {
  AIModel,
  AgentConfig,
  Task,
  TriggerConfig,
  TriggerType,
  EventType,
  EventSource,
  ScheduledTriggerFrequency,
} from '@/types/agent';

export interface AgentTemplate {
  id: string; // Unique ID for the template itself
  name: string;
  description: string;
  iconUrl?: string | null;
  systemPrompt: string;
  model: AIModel;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  config: AgentConfig;
  tasks?: Task[];
  category?: string; // Optional: for grouping templates
}

export const mockAgentTemplates: AgentTemplate[] = [
  {
    id: 'template-smart-wallet',
    name: 'Smart Wallet Tracking',
    description: 'Monitors a smart wallet for specific transactions and notifies you.',
    iconUrl: '/assets/icons/wallet-template.svg', // Placeholder icon
    systemPrompt:
      'You are an AI assistant that monitors blockchain transactions for a specified smart wallet. Alert the user on new incoming or outgoing transactions matching the criteria.',
    model: AIModel.GPT4oMini,
    triggerType: TriggerType.EVENT_DRIVEN,
    triggerConfig: {
      eventType: EventType.ADDRESS_MONITOR,
      eventSource: EventSource.TOKENVIEW, // Example, can be configured
      eventTarget: ['YOUR_WALLET_ADDRESS_HERE'], // Placeholder
      filterConditions: { minAmount: 100, token: 'USDT' }, // Example filter
    },
    config: {
      dependentMCPs: [
        { mcpId: 'mcp-tokenview', mcpName: 'TokenView API', order: 1, parameters: { apiKey: 'USER_TOKENVIEW_KEY'} }
      ],
      dependentAgents: [],
      outputActions: [
        {
          outputType: 'TELEGRAM_NOTIFIER',
          outputProviderName: 'Telegram Bot',
          parameters: { channelId: '@YourTelegramChannel', messageTemplate: 'New transaction on {wallet}: {transactionDetails}' },
        },
      ],
    },
    tasks: [
      { id: 'task-1', description: 'Fetch transaction data', order: 1 },
      { id: 'task-2', description: 'Filter relevant transactions', order: 2 },
      { id: 'task-3', description: 'Send notification', order: 3 },
    ],
    category: 'Monitoring',
  },
  {
    id: 'template-twitter-tracking',
    name: 'Twitter Keyword Tracking',
    description: 'Monitors Twitter for specific keywords or hashtags and aggregates findings.',
    iconUrl: '/assets/icons/twitter-template.svg', // Placeholder icon
    systemPrompt:
      'You are an AI assistant that tracks Twitter for mentions of specific keywords or hashtags. Summarize new relevant tweets and identify trending topics.',
    model: AIModel.Claude35Sonnet,
    triggerType: TriggerType.SCHEDULED,
    triggerConfig: {
      frequency: ScheduledTriggerFrequency.HOURLY,
      timeValue: '0', // Every hour at minute 0
    },
    config: {
      dependentMCPs: [
        { mcpId: 'mcp-twitter', mcpName: 'Twitter API', order: 1, parameters: { apiKey: 'USER_TWITTER_KEY', keywords: ['#AI', '#Web3'] } }
      ],
      dependentAgents: [],
      outputActions: [
        {
          outputType: 'EMAIL_SUMMARY',
          outputProviderName: 'Email Service',
          parameters: { recipient: 'user@example.com', subject: 'Twitter Keyword Digest' },
        },
      ],
    },
    tasks: [
      { id: 'task-1', description: 'Fetch tweets matching keywords', order: 1 },
      { id: 'task-2', description: 'Analyze sentiment and identify key themes', order: 2 },
      { id: 'task-3', description: 'Compile and send summary report', order: 3 },
    ],
    category: 'Social Media',
  },
  {
    id: 'template-kline-trading',
    name: 'K-line Contract Trading',
    description: 'Executes trades based on K-line patterns for specified contracts.',
    iconUrl: '/assets/icons/trading-template.svg', // Placeholder icon
    systemPrompt:
      'You are an AI trading bot. Analyze K-line patterns for the specified trading pair and execute buy/sell orders based on predefined strategies. Manage risk and log all trades.',
    model: AIModel.GPT4o,
    triggerType: TriggerType.EVENT_DRIVEN, // Or could be scheduled for periodic checks
    triggerConfig: {
      eventType: EventType.TRANSACTION_MONITOR, // This might need a more specific event type like MARKET_DATA_UPDATE
      eventSource: EventSource.BITQUERY, // Example, could be a specific exchange API MCP
      eventTarget: ['BTC/USDT'], // Trading pair
      filterConditions: { pattern: 'bullish_engulfing' }, // Example pattern
    },
    config: {
      dependentMCPs: [
        { mcpId: 'mcp-exchange-api', mcpName: 'Exchange API', order: 1, parameters: { apiKey: 'USER_EXCHANGE_KEY', secret: 'USER_EXCHANGE_SECRET'} },
        { mcpId: 'mcp-technical-analysis', mcpName: 'Technical Analysis Toolkit', order: 2, parameters: {} }
      ],
      dependentAgents: [],
      outputActions: [
        {
          outputType: 'TRADE_EXECUTION_LOG',
          outputProviderName: 'Trading Log Service',
          parameters: { logFile: '/logs/trades.csv' },
        },
      ],
    },
    tasks: [
      { id: 'task-1', description: 'Fetch latest K-line data', order: 1 },
      { id: 'task-2', description: 'Identify trading signals based on strategy', order: 2 },
      { id: 'task-3', description: 'Execute trade if signal confirmed', order: 3 },
      { id: 'task-4', description: 'Update portfolio and log trade', order: 4 },
    ],
    category: 'Trading',
  },
  {
    id: 'template-liquidity-mining',
    name: 'Liquidity Mining Optimizer',
    description: 'Manages and optimizes liquidity positions across different DeFi protocols.',
    iconUrl: '/assets/icons/liquidity-template.svg', // Placeholder icon
    systemPrompt:
      'You are an AI assistant for optimizing liquidity mining strategies. Monitor yields, gas fees, and impermanent loss across various pools. Rebalance positions to maximize returns.',
    model: AIModel.GPT4oMini,
    triggerType: TriggerType.SCHEDULED,
    triggerConfig: {
      frequency: ScheduledTriggerFrequency.DAILY,
      timeValue: '03:00', // Daily at 3 AM
    },
    config: {
      dependentMCPs: [
        { mcpId: 'mcp-defi-aggregator', mcpName: 'DeFi Aggregator API', order: 1, parameters: {} },
        { mcpId: 'mcp-wallet-connector', mcpName: 'Wallet Connector', order: 2, parameters: { walletId: 'USER_WALLET_ID' } }
      ],
      dependentAgents: [],
      outputActions: [
        {
          outputType: 'PORTFOLIO_UPDATE_DB',
          outputProviderName: 'Database Service',
          parameters: { connectionString: 'USER_DB_CONNECTION' },
        },
      ],
    },
    tasks: [
      { id: 'task-1', description: 'Scan DeFi protocols for current APYs and pool conditions', order: 1 },
      { id: 'task-2', description: 'Calculate potential returns and risks for rebalancing', order: 2 },
      { id: 'task-3', description: 'Execute rebalancing transactions if profitable', order: 3 },
      { id: 'task-4', description: 'Log changes and update portfolio dashboard', order: 4 },
    ],
    category: 'DeFi',
  },
  {
    id: 'template-dca-tokens',
    name: 'DCA Token Hoarding',
    description: 'Performs Dollar-Cost Averaging for selected tokens on a regular schedule.',
    iconUrl: '/assets/icons/dca-template.svg', // Placeholder icon
    systemPrompt:
      'You are an AI assistant that executes a Dollar-Cost Averaging (DCA) strategy. On a set schedule, purchase a fixed amount of specified tokens.',
    model: AIModel.Claude35Sonnet,
    triggerType: TriggerType.SCHEDULED,
    triggerConfig: {
      frequency: ScheduledTriggerFrequency.WEEKLY,
      timeValue: '0 0 * * 1', // Every Monday at midnight
    },
    config: {
      dependentMCPs: [
        { mcpId: 'mcp-exchange-api', mcpName: 'Exchange API', order: 1, parameters: { apiKey: 'USER_EXCHANGE_KEY', secret: 'USER_EXCHANGE_SECRET', dcaAmount: 50, tokens: ['BTC', 'ETH'] } }
      ],
      dependentAgents: [],
      outputActions: [
        {
          outputType: 'TRANSACTION_LOG',
          outputProviderName: 'Logging Service',
          parameters: { logTarget: 'dca_purchases.log' },
        },
      ],
    },
    tasks: [
      { id: 'task-1', description: 'Check schedule for DCA purchase', order: 1 },
      { id: 'task-2', description: 'Execute purchase of specified tokens', order: 2 },
      { id: 'task-3', description: 'Log transaction details', order: 3 },
    ],
    category: 'Investing',
  },
];