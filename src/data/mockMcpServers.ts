// Mock MCP Server data types
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear';

export interface MCPProvider {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  icon: string;
  rating: number;
  totalMCPs: number;
  activeUsers: number;
  categories: string[];
  createdAt: string;
  version: string;
  installed: boolean;
}

// Mock MCP Providers data
export const mockMCPProviders: MCPProvider[] = [
  {
    id: 'twitter',
    name: 'Twitter MCP Server',
    description: 'Access Twitter API capabilities with tools for fetching tweets, user data, and posting content',
    longDescription: 'The Twitter MCP Server provides a comprehensive set of tools to interact with Twitter\'s API. It allows your applications to fetch user tweets, followers, and followings, as well as engage with content through replies, quotes, and posts. This server simplifies Twitter API authentication and rate limiting, providing a seamless integration for social media automation, monitoring, and engagement tools.',
    imageUrl: 'https://via.placeholder.com/150',
    icon: getDiceBearAvatar(DICEBEAR_STYLES.MCP, 'twitter', { backgroundColor: ['1d4ed8'] }),
    rating: 4.8,
    totalMCPs: 6,
    activeUsers: 2470,
    categories: ['Social Media', 'Content', 'API'],
    createdAt: '2023-03-10',
    version: '2.4.1',
    installed: true
  },
  {
    id: 'tokenview',
    name: 'Tokenview MCP Server',
    description: 'Blockchain data and analytics tools for querying address balances, transactions, and block information',
    longDescription: 'Tokenview MCP Server provides blockchain exploration and analysis tools that allow you to query on-chain data across multiple networks. Access address balances, historical transactions, and detailed block information with simple API calls. Perfect for blockchain analytics, wallet monitoring, and transaction tracking applications. Supports major blockchains including Bitcoin, Ethereum, and other popular networks.',
    imageUrl: 'https://via.placeholder.com/150',
    icon: getDiceBearAvatar(DICEBEAR_STYLES.MCP, 'tokenview', { backgroundColor: ['16a34a'] }),
    rating: 4.5,
    totalMCPs: 3,
    activeUsers: 1850,
    categories: ['Blockchain', 'Analytics', 'Data'],
    createdAt: '2023-05-15',
    version: '1.7.3',
    installed: true
  },
  {
    id: 'jupiter',
    name: 'Jupiter MCP Server',
    description: 'Decentralized trading platform services for swap quotes and trade execution on Solana',
    longDescription: 'Jupiter MCP Server provides access to one of the largest decentralized trading platforms on Solana. As one of the most active governance communities in crypto, Jupiter offers reliable swap routing and trade execution services. This MCP server enables your applications to fetch price quotes, execute trades, and analyze liquidity across the Solana ecosystem through a unified API interface.',
    imageUrl: 'https://via.placeholder.com/150',
    icon: getDiceBearAvatar(DICEBEAR_STYLES.MCP, 'jupiter', { backgroundColor: ['9333ea'] }),
    rating: 4.9,
    totalMCPs: 3,
    activeUsers: 3240,
    categories: ['DeFi', 'Trading', 'Solana'],
    createdAt: '2023-02-20',
    version: '3.1.2',
    installed: true
  },
  {
    id: 'okx',
    name: 'OKX MCP Server',
    description: 'Trading API tools for OKX exchange, including market data, trading endpoints, and account management',
    longDescription: 'OKX MCP Server provides comprehensive access to OKX exchange functionality. It includes tools for fetching real-time market data, executing trades, managing account information, and accessing historical data. This server abstracts away the complexity of exchange API authentication and rate limiting, making it easy to integrate OKX trading capabilities into your applications, trading bots, and portfolio management tools.',
    imageUrl: 'https://via.placeholder.com/150',
    icon: getDiceBearAvatar(DICEBEAR_STYLES.MCP, 'okx', { backgroundColor: ['dc2626'] }),
    rating: 4.6,
    totalMCPs: 4,
    activeUsers: 1920,
    categories: ['Exchange', 'Trading', 'API'],
    createdAt: '2023-06-05',
    version: '2.0.0',
    installed: false
  },
  {
    id: 'binance',
    name: 'Binance MCP Server',
    description: 'Comprehensive API tools for Binance exchange, supporting market data and trading operations',
    longDescription: 'Binance MCP Server offers a complete suite of tools to interact with the Binance exchange API. Access real-time market data, execute spot and futures trades, manage account information, and track order status. This server handles authentication, rate limiting, and data formatting, providing a streamlined experience for building trading applications, bots, and portfolio tracking tools using Binance services.',
    imageUrl: 'https://via.placeholder.com/150',
    icon: getDiceBearAvatar(DICEBEAR_STYLES.MCP, 'binance', { backgroundColor: ['f59e0b'] }),
    rating: 4.7,
    totalMCPs: 4,
    activeUsers: 2680,
    categories: ['Exchange', 'Trading', 'API'],
    createdAt: '2023-04-12',
    version: '2.2.5',
    installed: false
  },
  {
    id: 'telegram',
    name: 'Telegram MCP Server',
    description: 'Telegram Bot API tools for sending messages and interacting with Telegram channels and groups',
    longDescription: 'Telegram MCP Server provides tools to build and manage Telegram bots without dealing with the complexities of the Telegram Bot API. Send messages, images, and files to users or groups, create interactive buttons, and receive message notifications through webhook integrations. Perfect for building notification systems, customer support bots, or content distribution channels with minimal setup and configuration.',
    imageUrl: 'https://via.placeholder.com/150',
    icon: getDiceBearAvatar(DICEBEAR_STYLES.MCP, 'telegram', { backgroundColor: ['0284c7'] }),
    rating: 4.4,
    totalMCPs: 3,
    activeUsers: 1560,
    categories: ['Messaging', 'Bots', 'API'],
    createdAt: '2023-07-18',
    version: '1.5.0',
    installed: false
  },
];

// Helper function to create a detailed provider record
export const mockMCPProvidersDetailed: Record<string, MCPProvider> = mockMCPProviders.reduce(
  (acc, provider) => {
    acc[provider.id] = provider;
    return acc;
  },
  {} as Record<string, MCPProvider>
);

// Mock API functions
export const fetchMCPProvidersAPI = async (): Promise<MCPProvider[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMCPProviders);
    }, 500);
  });
};

export const fetchMCPProviderAPI = async (providerId: string): Promise<MCPProvider | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMCPProvidersDetailed[providerId] || null);
    }, 500);
  });
}; 