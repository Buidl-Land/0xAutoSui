export enum PricingModelType {
  FREE = "FREE",
  ONE_TIME_PURCHASE_CREDITS = "ONE_TIME_PURCHASE_CREDITS",
  ONE_TIME_PURCHASE_SOL = "ONE_TIME_PURCHASE_SOL",
  SUBSCRIPTION_CREDITS_MONTHLY = "SUBSCRIPTION_CREDITS_MONTHLY",
  SUBSCRIPTION_CREDITS_QUARTERLY = "SUBSCRIPTION_CREDITS_QUARTERLY",
  SUBSCRIPTION_SOL_MONTHLY = "SUBSCRIPTION_SOL_MONTHLY",
  REQUIRES_MCP_SUBSCRIPTION = "REQUIRES_MCP_SUBSCRIPTION",
}

export enum SubscriptionInterval {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

export enum StoreAgentStatus {
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
  DEPRECATED = "DEPRECATED",
}

export interface StoreAgentPricingModel {
  type: PricingModelType;
  priceCredits?: number;
  priceSol?: number;
  subscriptionInterval?: SubscriptionInterval;
  requiredMcpSubscriptionIds?: string[];
  notes?: string;
}

export interface RequiredMCP {
  mcpId: string;
  mcpName: string;
  isBundled: boolean;
}

export interface StoreAgent {
  storeAgentId: string;
  name: string;
  provider: string;
  version: string;
  description: string;
  categories: string[];
  solanaFocus: boolean;
  pricingModel: StoreAgentPricingModel;
  underlyingAgentTemplateId?: string;
  requiredMCPs: RequiredMCP[];
  estimatedResourceConsumption: string;
  documentationUrl?: string;
  iconUrl?: string;
  bannerImageUrl?: string;
  popularityScore?: number;
  averageRating?: number;
  numberOfDownloadsOrAcquisitions: number;
  publishedAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  status: StoreAgentStatus;
}

export interface UserAcquiredStoreAgent {
  userId: string;
  storeAgentId: string;
  acquisitionDate: string; // ISO Date string
  purchaseTransactionId?: string;
  userDeployedAgentId?: string;
  licenseKeyOrSubscriptionId?: string;
  subscriptionEndDate?: string; // ISO Date string
}