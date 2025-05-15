export interface TokenBalance {
  id: string; // e.g., 'solana', 'usd-coin', 'bonk', 'dogwifcoin'
  name: string; // e.g., 'Solana', 'USD Coin', 'Bonk', 'dogwifhat'
  symbol: string; // e.g., 'SOL', 'USDC', 'BONK', 'WIF'
  balance: number;
  priceUsd?: number; // Optional, as price might not always be available or needed
  iconUrl?: string; // URL for the token icon
  address?: string; // Optional: contract address of the token
}

export interface Wallet {
  walletId: string;
  userId: string;
  walletName: string;
  tokens: TokenBalance[];
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

export type TransactionCurrency = 'SOL' | 'USDT' | 'USDC' | 'SERVICE_CREDITS';

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

export type TransactionFilterType = "ALL" | "SOL_GAS_FEE" | "MCP_SERVICE_FEE" | "PURCHASE_SERVICE_CREDITS" | "DEPOSIT_SOL" | "DEPOSIT_USDT";

export const transactionTypeOptions: { label: string; value: TransactionFilterType }[] = [
    { label: "All", value: "ALL" },
    { label: "SOL Gas Spent", value: "SOL_GAS_FEE" },
    { label: "MCP Fees", value: "MCP_SERVICE_FEE" },
    { label: "Service Purchases", value: "PURCHASE_SERVICE_CREDITS" },
    { label: "SOL Deposits", value: "DEPOSIT_SOL" },
    { label: "USDT Deposits", value: "DEPOSIT_USDT" },
];