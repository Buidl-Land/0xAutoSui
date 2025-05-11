# Page F: Agent Store - Domain Models

This document outlines the data models relevant to the Agent Store page, focusing on the representation of pre-built agents available for acquisition.

## 1. StoreAgent
Represents a pre-built, discoverable Agent template or product available in the Agent Store.

*   `storeAgentId`: STRING (Primary Key, Unique identifier for the store listing)
*   `name`: STRING (Display name of the agent, e.g., "SOL Smart DCA Agent")
    *   // TEST: Name is not empty and is compelling.
*   `provider`: STRING (Indicates the creator, e.g., "Official", "Community Hotshot X", "Partner Y")
    *   // TEST: Provider information is clear.
*   `version`: STRING (e.g., "1.0.0")
*   `description`: TEXT (Detailed explanation of the agent's functionality, benefits, and use cases)
    *   // TEST: Description is comprehensive and persuasive.
*   `categories`: ARRAY of STRING (Tags for filtering, e.g., ["Investment", "DeFi", "Solana", "NFT", "Data Monitoring", "Tools"])
    *   // TEST: Categories are relevant and aid discovery.
*   `solanaFocus`: BOOLEAN (True if specifically tailored for or heavily reliant on the Solana ecosystem)
*   `pricingModel`: OBJECT
    *   `type`: ENUM (`FREE`, `ONE_TIME_PURCHASE_CREDITS`, `ONE_TIME_PURCHASE_SOL`, `SUBSCRIPTION_CREDITS_MONTHLY`, `SUBSCRIPTION_CREDITS_QUARTERLY`, `SUBSCRIPTION_SOL_MONTHLY`, `REQUIRES_MCP_SUBSCRIPTION`)
        *   // TEST: Pricing type is one of the allowed enum values.
    *   `priceCredits`: INTEGER (Optional, if priced in service credits)
    *   `priceSol`: DECIMAL (Optional, if priced in SOL)
    *   `subscriptionInterval`: ENUM (`MONTHLY`, `QUARTERLY`, `YEARLY`) (Optional, if subscription)
    *   `requiredMcpSubscriptionIds`: ARRAY of STRING (Optional, if agent is free but requires paid MCPs)
    *   `notes`: TEXT (Optional, e.g., "Discount for annual subscription", "Limited time offer")
*   `underlyingAgentTemplateId`: STRING (Optional, Foreign Key, references AgentTemplate.templateId if based on a standard template structure)
*   `requiredMCPs`: ARRAY of OBJECT (List of MCPs this agent depends on)
    *   `mcpId`: STRING
    *   `mcpName`: STRING (Denormalized)
    *   `isBundled`: BOOLEAN (Indicates if the MCP cost is included or needs separate acquisition)
*   `estimatedResourceConsumption`: TEXT (Descriptive text of typical SOL/Service Credit usage, e.g., "Low", "Medium - approx 50 credits/day")
*   `documentationUrl`: STRING (Optional, link to detailed documentation or setup guide)
*   `iconUrl`: STRING (Optional, URL for a visual icon representing the agent)
*   `bannerImageUrl`: STRING (Optional, URL for a larger promotional image)
*   `popularityScore`: INTEGER (Optional, for sorting)
*   `averageRating`: DECIMAL (Optional, 0-5)
*   `numberOfDownloadsOrAcquisitions`: INTEGER
*   `publishedAt`: DATETIME (When the agent was listed in the store)
*   `updatedAt`: DATETIME (Last update to the store listing)
*   `status`: ENUM (`PUBLISHED`, `UNPUBLISHED`, `DEPRECATED`)
    *   // TEST: Status is one of the allowed enum values.

## 2. UserAcquiredStoreAgent (Join Table)
Tracks which store agents a user has acquired/purchased.

*   `userId`: STRING (Foreign Key, references User.userId)
*   `storeAgentId`: STRING (Foreign Key, references StoreAgent.storeAgentId)
*   `acquisitionDate`: DATETIME
*   `purchaseTransactionId`: STRING (Optional, Foreign Key, references WalletTransaction.transactionId if it was a paid acquisition)
*   `userDeployedAgentId`: STRING (Optional, Foreign Key, references Agent.agentId if the user has deployed an instance of this store agent)
*   `licenseKeyOrSubscriptionId`: STRING (Optional, if applicable for licensing/subscriptions)
*   `subscriptionEndDate`: DATETIME (Optional, if a subscription)

## 3. AgentTemplate (Reference from `08_agent_config_domain_model.md`)
This model can be used as the basis for `StoreAgent` configurations.
*   `templateId`: STRING
*   `templateName`: STRING
*   `description`: TEXT
*   `triggerType`: ENUM
*   `triggerConfig`: JSON
*   `agentLogicConfig`: JSON (Contains `dependentMCPs`, `dependentAgents`, `outputActions`)
    *   When a `StoreAgent` is acquired, this `agentLogicConfig` could be used to instantiate a new `Agent` for the user.

## Relationships:
*   A `StoreAgent` can be acquired by many `User`s (via `UserAcquiredStoreAgent`).
*   A `StoreAgent` might be based on an `AgentTemplate`.
*   When a `User` acquires a `StoreAgent`, an entry is made in `UserAcquiredStoreAgent`.
*   The acquired `StoreAgent` can then be deployed as one or more instances of a user's own `Agent`.

These models define the structure for presenting and managing pre-built agents in the Agent Store.