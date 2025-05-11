export type MCPProvider = 'Official' | 'Third-Party';
export type MCPType = 'Data Source' | 'Analysis' | 'Solana Execution' | 'Web2' | 'Utility';
export type MCPCost = 'Free' | 'Points/call' | 'USDT' | 'SOL Gas + Points/transaction';

export interface MCP {
  id: string;
  name: string;
  provider: MCPProvider;
  description: string;
  type: MCPType;
  cost: MCPCost;
  categories: MCPCategory[]; // For filtering, e.g., ['Data Source', 'Official']
  details?: string; // Optional longer description for a details view
}

// Define MCPCategory type
export type MCPCategory =
  | 'Data Source' | 'Analysis' | 'Solana Execution' | 'Web2'
  | 'Official' | 'Third-Party' | 'Utility' | 'DeFi' | 'NFT'
  | 'News' | 'AI' | 'Social' | 'Monitoring' | 'Automation' | 'Price Data' | 'Solana';