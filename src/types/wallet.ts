export interface Wallet {
  walletId: string;
  userId: string;
  walletName: string;
  solBalance: number;
  usdtBalance: number;
  serviceCredits: number;
  primarySolAddress: string;
  primaryUsdtAddress: string;
  linkedEoaForSolRefill?: string;
  autoRefillSolSettings?: AutoRefillSetting;
  autoRefillServiceCreditsSettings?: AutoRefillSetting;
  isDefault: boolean;
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
}

export interface AutoRefillSetting {
  isEnabled: boolean;
  threshold: number;
  refillAmount: number;
  sourceEoaWalletId?: string;
}

export type TransactionType =
  | 'DEPOSIT_SOL'
  | 'WITHDRAW_SOL'
  | 'DEPOSIT_USDT'
  | 'WITHDRAW_USDT'
  | 'PURCHASE_SERVICE_CREDITS'
  | 'SERVICE_CREDIT_REFUND'
  | 'SOL_GAS_FEE'
  | 'MCP_SERVICE_FEE'
  | 'A2A_SERVICE_FEE'
  | 'AGENT_STORE_PURCHASE_CREDITS'
  | 'AGENT_STORE_PURCHASE_SOL'
  | 'AUTO_REFILL_SOL'
  | 'AUTO_REFILL_SERVICE_CREDITS'
  | 'OTHER';

export type TransactionCurrency = 'SOL' | 'USDT' | 'SERVICE_CREDITS';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface WalletTransaction {
  transactionId: string;
  walletId: string;
  userId: string;
  agentId?: string;
  mcpId?: string;
  timestamp: string; // Or Date
  type: TransactionType;
  description: string;
  currency: TransactionCurrency;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  relatedTransactionId?: string;
  onChainTxHash?: string;
  status: TransactionStatus;
  metadata?: Record<string, any>;
}

// Mock data for wallets
export const mockWallets: Wallet[] = [
  {
    walletId: 'wallet-1',
    userId: 'user-1',
    walletName: 'Main Wallet',
    solBalance: 2.85,
    usdtBalance: 500.00,
    serviceCredits: 10000,
    primarySolAddress: 'SoL1q2w3e4r5t6y7u8i9o0pAsDfGhjKlCzXbNm',
    primaryUsdtAddress: 'USDTzxcvbnm1234567890qwertyuiopasdfghjkl',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    autoRefillSolSettings: {
      isEnabled: false,
      threshold: 0.2,
      refillAmount: 1,
      sourceEoaWalletId: 'EOA1abc...'
    },
    autoRefillServiceCreditsSettings: {
      isEnabled: false,
      threshold: 1000,
      refillAmount: 5000,
    }
  },
  {
    walletId: 'wallet-2',
    userId: 'user-1',
    walletName: 'Trading Bot Wallet',
    solBalance: 10.5,
    usdtBalance: 1200.00,
    serviceCredits: 25000,
    primarySolAddress: 'SoL2xYzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp',
    primaryUsdtAddress: 'USDTpoiuytrewqasdfghjklmnbvcxz0987654321',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock data for transactions
export const mockTransactions: WalletTransaction[] = [
  {
    transactionId: 'txn-1',
    walletId: 'wallet-1',
    userId: 'user-1',
    agentId: 'agent-alpha-trader',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    type: 'SOL_GAS_FEE',
    description: 'Jupiter Trade',
    currency: 'SOL',
    amount: -0.001,
    balanceBefore: 2.851,
    balanceAfter: 2.850,
    status: 'COMPLETED',
  },
  {
    transactionId: 'txn-2',
    walletId: 'wallet-1',
    userId: 'user-1',
    mcpId: 'mcp-text-summarizer',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    type: 'MCP_SERVICE_FEE',
    description: 'TextSummarizer',
    currency: 'SERVICE_CREDITS',
    amount: -5,
    balanceBefore: 10005,
    balanceAfter: 10000,
    status: 'COMPLETED',
  },
  {
    transactionId: 'txn-3',
    walletId: 'wallet-1',
    userId: 'user-1',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    type: 'PURCHASE_SERVICE_CREDITS',
    description: 'Purchase Service Credits (Received 2000 Credits)',
    currency: 'USDT',
    amount: -20,
    balanceBefore: 520.00,
    balanceAfter: 500.00,
    status: 'COMPLETED',
    metadata: { receivedCredits: 2000 }
  },
  {
    transactionId: 'txn-4',
    walletId: 'wallet-1',
    userId: 'user-1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'DEPOSIT_SOL',
    description: 'SOL Deposit',
    currency: 'SOL',
    amount: 1.0,
    balanceBefore: 1.851,
    balanceAfter: 2.851,
    status: 'COMPLETED',
    onChainTxHash: 'solTxHash123abc...'
  },
  {
    transactionId: 'txn-5',
    walletId: 'wallet-1',
    userId: 'user-1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'DEPOSIT_USDT',
    description: 'USDT Deposit',
    currency: 'USDT',
    amount: 100.00,
    balanceBefore: 420.00,
    balanceAfter: 520.00,
    status: 'COMPLETED',
    onChainTxHash: 'usdtTxHash456def...'
  },
];

export type TransactionFilterType = "ALL" | "SOL_GAS_FEE" | "MCP_SERVICE_FEE" | "PURCHASE_SERVICE_CREDITS" | "DEPOSIT_SOL" | "DEPOSIT_USDT";

export const transactionTypeOptions: { label: string; value: TransactionFilterType }[] = [
    { label: "All", value: "ALL" },
    { label: "SOL Gas Spent", value: "SOL_GAS_FEE" },
    { label: "MCP Fees", value: "MCP_SERVICE_FEE" },
    { label: "Service Purchases", value: "PURCHASE_SERVICE_CREDITS" },
    { label: "SOL Deposits", value: "DEPOSIT_SOL" },
    { label: "USDT Deposits", value: "DEPOSIT_USDT" },
];