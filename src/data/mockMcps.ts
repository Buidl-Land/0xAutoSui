import { MCP, MCPCategory, MCPCost, MCPProvider, MCPType } from '@/types/mcp';

export const mockMcps: MCP[] = [
  {
    id: 'mcp-goplus-security',
    name: 'GoPlus Security API',
    provider: 'Third-Party',
    description: 'Comprehensive risk analysis for tokens, NFTs, and addresses on Solana and other chains.',
    type: 'Analysis',
    cost: 'Points/call',
    categories: ['Analysis', 'Solana', 'Third-Party'] as MCPCategory[],
    details: 'Provides detailed security assessments including contract audits, rugpull detection, and malicious address identification. Essential for secure token interactions.'
  },
  {
    id: 'mcp-jup-swap',
    name: 'Jupiter Swap API',
    provider: 'Third-Party',
    description: "Access Solana's leading liquidity aggregator for optimal token swaps.",
    type: 'Solana Execution',
    cost: 'SOL Gas + Points/transaction',
    categories: ['Solana Execution', 'DeFi', 'Solana', 'Third-Party'] as MCPCategory[],
    details: "Integrates with Jupiter's routing engine to find the best price across multiple DEXs for any given token pair on Solana."
  },
  {
    id: 'mcp-twitter-crawler',
    name: 'X/Twitter Crawler',
    provider: 'Official',
    description: 'Fetch tweets, user profiles, and engagement data from X (Twitter).',
    type: 'Data Source',
    cost: 'Points/call',
    categories: ['Data Source', 'Social', 'Web2', 'Official'] as MCPCategory[],
    details: 'Allows agents to monitor Twitter for specific keywords, hashtags, or user activity to gather real-time social sentiment and news.'
  },
  {
    id: 'mcp-wallet-analyzer',
    name: 'Wallet Analyzer',
    provider: 'Official',
    description: 'Analyze on-chain transaction history and holdings for any Solana wallet.',
    type: 'Data Source',
    cost: 'Points/call',
    categories: ['Data Source', 'Analysis', 'Solana', 'Official'] as MCPCategory[],
    details: 'Provides insights into wallet activities, token balances, P&L, and interaction patterns with DeFi protocols and NFTs.'
  },
  {
    id: 'mcp-telegram-notifier',
    name: 'Telegram Notifier',
    provider: 'Official',
    description: 'Send notifications and messages to specified Telegram chats or channels.',
    type: 'Utility',
    cost: 'Points/call',
    categories: ['Utility', 'Web2', 'Official'] as MCPCategory[],
    details: 'Enables agents to send alerts, reports, or custom messages via Telegram, facilitating real-time communication.'
  },
  {
    id: 'mcp-ahr999-fetch',
    name: 'AHR999 Index Fetch',
    provider: 'Third-Party',
    description: 'Retrieves the current AHR999 Bitcoin indicator value.',
    type: 'Data Source',
    cost: 'Free',
    categories: ['Data Source', 'Analysis', 'Price Data', 'Third-Party'] as MCPCategory[],
    details: 'The AHR999 index is a popular indicator used by some to gauge Bitcoin market cycles. This MCP provides easy access to its latest value.'
  },
  {
    id: 'mcp-dex-screener-pools',
    name: 'DexScreener Pool Watcher',
    provider: 'Third-Party',
    description: 'Monitor new liquidity pools and token pairs on Solana via DexScreener.',
    type: 'Data Source',
    cost: 'Points/call',
    categories: ['Data Source', 'DeFi', 'Solana', 'Third-Party', 'Monitoring'] as MCPCategory[],
    details: 'Tracks DexScreener for newly listed pairs and pools, enabling agents to discover early opportunities or track liquidity movements.'
  }
];

export const getMockMcpById = (id: string): MCP | undefined => {
  return mockMcps.find(mcp => mcp.id === id);
};