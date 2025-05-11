import { MCP } from '@/types/mcp';

export const mockMcps: MCP[] = [
  {
    id: 'mcp-sol-news',
    name: 'Web2_SolanaNewsFetcher',
    provider: 'Official',
    description: 'Fetches the latest Solana news from various web2 sources.',
    type: 'Data Source',
    cost: 'Free',
    categories: ['Data Source', 'Web2', 'Official', 'News'],
    details: 'This MCP aggregates news articles, blog posts, and social media mentions related to Solana from a curated list of popular crypto news websites and platforms. It provides structured data including title, source, publication date, and a short summary.'
  },
  {
    id: 'mcp-text-summ',
    name: 'TextSummarizer_LatestModel',
    provider: 'Third-Party',
    description: 'Summarizes long text using the latest AI models.',
    type: 'Analysis',
    cost: 'Points/call',
    categories: ['Analysis', 'Third-Party', 'AI'],
    details: 'Utilizes advanced natural language processing models to generate concise summaries of text documents. Ideal for quick insights from articles, research papers, or reports. Cost is based on the length of the text processed.'
  },
  {
    id: 'mcp-dex-swap',
    name: 'DEXSwap_Jupiter',
    provider: 'Official',
    description: 'Executes token swaps on Solana via Jupiter aggregator.',
    type: 'Solana Execution',
    cost: 'SOL Gas + Points/transaction',
    categories: ['Solana Execution', 'DeFi', 'Official'],
    details: 'Integrates with the Jupiter aggregator to find the best swap rates across multiple Solana DEXs. Users pay standard Solana network fees plus a small service fee in points per transaction.'
  },
  {
    id: 'mcp-price-feed',
    name: 'PriceFeed_Pyth',
    provider: 'Official',
    description: 'Provides real-time asset prices from Pyth Network.',
    type: 'Data Source',
    cost: 'Free',
    categories: ['Data Source', 'Solana', 'Official', 'Price Data'],
    details: 'Accesses high-fidelity, real-time price feeds for a wide range of assets on the Solana blockchain, powered by the Pyth Network.'
  },
  {
    id: 'mcp-sentiment',
    name: 'SocialSentiment_CryptoTwitter',
    provider: 'Third-Party',
    description: 'Analyzes sentiment of crypto-related Twitter discussions.',
    type: 'Analysis',
    cost: 'USDT',
    categories: ['Analysis', 'Web2', 'Third-Party', 'Social'],
    details: 'Monitors Twitter for discussions around specified cryptocurrencies or topics and provides sentiment analysis (positive, negative, neutral). Priced in USDT per 1000 tweets analyzed.'
  },
  {
    id: 'mcp-nft-floor',
    name: 'NFTFloorPrice_MagicEden',
    provider: 'Third-Party',
    description: 'Gets NFT collection floor prices from Magic Eden.',
    type: 'Data Source',
    cost: 'Points/call',
    categories: ['Data Source', 'Solana', 'NFT', 'Third-Party'],
    details: 'Retrieves the current floor price for specified NFT collections listed on Magic Eden. Useful for tracking market trends and identifying buying opportunities.'
  },
   {
    id: 'mcp-wallet-tracker',
    name: 'SolanaWalletActivity_Monitor',
    provider: 'Official',
    description: 'Tracks and alerts on specific Solana wallet activities.',
    type: 'Data Source',
    cost: 'Points/call',
    categories: ['Data Source', 'Solana', 'Official', 'Monitoring'],
    details: 'Monitor specific Solana wallet addresses for incoming/outgoing transactions, token transfers, or interactions with certain dApps. Alerts can be configured.'
  },
  {
    id: 'mcp-playwright-automation',
    name: 'WebAutomation_Playwright',
    provider: 'Official',
    description: 'Automates web browser interactions using Playwright.',
    type: 'Utility',
    cost: 'Free',
    categories: ['Utility', 'Web2', 'Official', 'Automation'],
    details: 'Enables scripting of browser actions like navigating to pages, filling forms, clicking buttons, and extracting data from websites. Runs in a sandboxed environment.'
  }
];