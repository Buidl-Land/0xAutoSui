import { Wallet, WalletTransaction, AutoRefillSetting, TokenBalance } from '@/types/wallet'; // Import necessary types
import { mockUser } from './userMocks'; // For consistent userId

// Remove old icon constants as they are no longer used
// const SOLANA_ICON = '/icons/tokens/solana.svg';
// const USDC_ICON = '/icons/tokens/usdc.svg';
// const BONK_ICON = '/icons/tokens/bonk.png';
// const WIF_ICON = '/icons/tokens/wif.png';

// Mock data for wallets
export let mockWallets: Wallet[] = [
  {
    walletId: 'wallet-1',
    userId: mockUser.userId,
    walletName: 'Main Wallet',
    tokens: [
      // Ensure symbols are lowercase and iconUrl is added
      { id: 'solana', name: 'Solana', symbol: 'sol', balance: 2.85, priceUsd: 170.50, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', address: 'SoL1q2w3e4r5t6y7u8i9o0pAsDfGhjKlCzXbNm' },
      { id: 'usd-coin', name: 'USD Coin', symbol: 'usdc', balance: 500.00, priceUsd: 1.00, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', address: 'USDTzxcvbnm1234567890qwertyuiopasdfghjkl' },
      // Add a few more common tokens for variety
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', balance: 0.05, priceUsd: 10245.00, iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png', address: 'BTC...xxx' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'eth', balance: 1.2, priceUsd: 2504.00, iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png', address: 'ETH...xxx' },
      { id: 'tether', name: 'Tether', symbol: 'usdt', balance: 1000.00, priceUsd: 1.00, iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png', address: 'USDT...tether' },
      { id: 'bonk', name: 'Bonk', symbol: 'bonk', balance: 500000000, priceUsd: 0.000025, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png', address: 'Bonk...xxx' },
      { id: 'dogwifhat', name: 'dogwifhat', symbol: 'wif', balance: 150, priceUsd: 2.80, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png', address: 'WIF...xxx' },
    ],
    serviceCredits: 8916, // Match updated points display
    primarySolAddress: 'SoL1q2w3e4r5t6y7u8i9o0pAsDfGhjKlCzXbNm', // Kept for generic deposit reference if needed
    primaryUsdtAddress: 'USDTzxcvbnm1234567890qwertyuiopasdfghjkl', // Kept for generic deposit reference if needed
    isDefault: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date().toISOString(),
    autoRefillSolSettings: {
      isEnabled: false,
      threshold: 0.2,
      refillAmount: 1,
      sourceEoaWalletId: 'EOA1abc...'
    },
    autoRefillServiceCreditsSettings: {
      isEnabled: true,
      threshold: 1000,
      refillAmount: 5000,
    }
  },
  {
    walletId: 'wallet-2',
    userId: mockUser.userId,
    walletName: 'Trading Bot Wallet',
    tokens: [
      { id: 'solana-2', name: 'Solana', symbol: 'sol', balance: 10.5, priceUsd: 170.50, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', address: 'SoL2xYzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp' },
      { id: 'usd-coin-2', name: 'USD Coin', symbol: 'usdc', balance: 12000.00, priceUsd: 1.00, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', address: 'USDTpoiuytrewqasdfghjklmnbvcxz0987654321' },
      { id: 'render', name: 'Render Token', symbol: 'rndr', balance: 250, priceUsd: 10.50, iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof/logo.png', address: 'RNDR...xxx' },
    ],
    serviceCredits: 25000,
    primarySolAddress: 'SoL2xYzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp',
    primaryUsdtAddress: 'USDTpoiuytrewqasdfghjklmnbvcxz0987654321',
    isDefault: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
];

// Function to calculate total wallet value in USD
export const calculateTotalWalletValueUsd = (wallet: Wallet): number => {
  if (!wallet || !wallet.tokens) return 0;
  return wallet.tokens.reduce((total, token) => {
    const value = (token.balance || 0) * (token.priceUsd || 0);
    return total + value;
  }, 0);
};

// Mock data for transactions (adjust balanceBefore/After if they referred to specific SOL/USDT balances)
// For simplicity, transaction balances might need rethinking if they show per-token balance changes.
// Keeping them as is for now, assuming they reflect overall credit/debit against a primary currency or service credit.
export const mockTransactions: WalletTransaction[] = [
  {
    transactionId: 'txn-1',
    walletId: 'wallet-1',
    userId: mockUser.userId,
    agentId: 'agent-alpha-trader',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    type: 'SOL_GAS_FEE',
    description: 'Jupiter Trade for BONK/SOL',
    currency: 'SOL',
    amount: -0.001,
    // balanceBefore/After now refers to SOL token balance if applicable, or general wallet state
    // This part is tricky without knowing how detailed transaction history needs to be per token
    // For now, these might represent service credits or a primary currency view
    balanceBefore: 2.851, // Assuming this was previous SOL balance for this TXN
    balanceAfter: 2.850, // New SOL balance
    status: 'COMPLETED',
    onChainTxHash: '2z...a1',
    metadata: { tokenSwapped: 'BONK', amountOut: 1000000 }
  },
  {
    transactionId: 'txn-2',
    walletId: 'wallet-1',
    userId: mockUser.userId,
    mcpId: 'mcp-news-analyzer',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'MCP_SERVICE_FEE',
    description: 'NewsAnalysis MCP for Solana Feed',
    currency: 'SERVICE_CREDITS',
    amount: -15,
    balanceBefore: 8931, // Service Credits balance
    balanceAfter: 8916,
    status: 'COMPLETED',
  },
  {
    transactionId: 'txn-3',
    walletId: 'wallet-1',
    userId: mockUser.userId,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    type: 'PURCHASE_SERVICE_CREDITS',
    description: 'Purchase 5000 Service Credits',
    currency: 'USDT',
    amount: -50,
    balanceBefore: 550.00,
    balanceAfter: 500.00,
    status: 'COMPLETED',
    metadata: { receivedCredits: 5000, rate: '0.01 USDT/Credit' }
  },
  {
    transactionId: 'txn-4',
    walletId: 'wallet-1',
    userId: mockUser.userId,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'DEPOSIT_SOL',
    description: 'SOL Deposit from Binance',
    currency: 'SOL',
    amount: 1.0,
    balanceBefore: 1.851,
    balanceAfter: 2.851,
    status: 'COMPLETED',
    onChainTxHash: '5g...b2'
  },
  {
    transactionId: 'txn-5',
    walletId: 'wallet-2',
    userId: mockUser.userId,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'DEPOSIT_USDT',
    description: 'USDT Deposit for Trading Bot',
    currency: 'USDT',
    amount: 1000.00,
    balanceBefore: 200.00,
    balanceAfter: 1200.00,
    status: 'COMPLETED',
    onChainTxHash: '0x...c3'
  },
    {
    transactionId: 'txn-6',
    walletId: 'wallet-1',
    userId: mockUser.userId,
    agentId: 'agent-meme-trader',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    type: 'A2A_SERVICE_FEE',
    description: 'WIF/USDC Swap via Raydium',
    currency: 'USDC',
    amount: -0.50, // Assuming 0.5 USDC fee
    balanceBefore: 500.50, // This implies service fee is taken from USDT balance, adjust if from service_credits
    balanceAfter: 500.00,
    status: 'COMPLETED',
    onChainTxHash: '3k...d4',
    metadata: { tokenIn: 'WIF', tokenOut: 'USDC', platform: 'Raydium' }
  },
];

export const fetchMockUserWallets = async (userId: string): Promise<Wallet[]> => {
  console.log(`Mock fetch: Wallets for userId: ${userId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWallets.filter(w => w.userId === userId));
    }, 200);
  });
};

export const fetchMockWalletTransactions = async (
    walletId: string,
    // filterType and dateRange can be added if complex filtering is needed in mock
    // For now, just returning all transactions for the walletId
): Promise<WalletTransaction[]> => {
  console.log(`Mock fetch: Transactions for walletId: ${walletId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions.filter(t => t.walletId === walletId));
    }, 200);
  });
};

export const updateMockWalletSettingsAPI = async (
    walletId: string,
    settings: { autoRefillSolSettings?: AutoRefillSetting, autoRefillServiceCreditsSettings?: AutoRefillSetting }
): Promise<boolean> => {
  console.log(`Mock update: settings for wallet ${walletId}:`, settings);
  const walletIndex = mockWallets.findIndex(w => w.walletId === walletId);
  if (walletIndex > -1) {
    let updated = false;
    if (settings.autoRefillSolSettings) {
      mockWallets[walletIndex].autoRefillSolSettings = settings.autoRefillSolSettings;
      updated = true;
    }
    if (settings.autoRefillServiceCreditsSettings) {
      mockWallets[walletIndex].autoRefillServiceCreditsSettings = settings.autoRefillServiceCreditsSettings;
      updated = true;
    }
    // To reflect changes if someone re-fetches, we need to modify the array in place.
    // If mockWallets was imported from elsewhere and not exported as `let`, this might not work as expected across calls.
    // Making mockWallets `let` to allow modification for this mock API.
    return new Promise(resolve => setTimeout(() => resolve(updated), 200));
  }
  return new Promise(resolve => setTimeout(() => resolve(false), 200));
};