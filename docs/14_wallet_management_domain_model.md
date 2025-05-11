# Page E: Abstract Wallet Management - Domain Models

This document outlines the data models relevant to the Abstract Wallet Management page. It refines existing models and introduces new ones specific to wallet operations.

## 1. Wallet (AbstractWallet - Refined from `02_dashboard_domain_model.md` & `08_agent_config_domain_model.md`)
Represents a user's abstract wallet within the 0xAuto OS, holding funds for agent operations.

*   `walletId`: STRING (Primary Key, Unique identifier)
*   `userId`: STRING (Foreign Key, references User.userId)
*   `walletName`: STRING (User-defined name, e.g., "Main Wallet", "Trading Bot Wallet")
    *   // TEST: `walletName` is not empty and is unique per user.
*   `solBalance`: DECIMAL (Current SOL balance, used for Gas)
    *   // TEST: `solBalance` is a non-negative number.
*   `usdtBalance`: DECIMAL (Current USDT balance, used for purchasing service credits)
    *   // TEST: `usdtBalance` is a non-negative number.
*   `serviceCredits`: INTEGER (Current balance of 0xAuto service credits)
    *   // TEST: `serviceCredits` is a non-negative integer.
*   `primarySolAddress`: STRING (The actual Solana address associated with this abstract wallet for SOL deposits/withdrawals)
    *   // TEST: `primarySolAddress` is a valid Solana address format.
*   `primaryUsdtAddress`: STRING (The actual address (e.g., SPL USDT on Solana) for USDT deposits)
    *   // TEST: `primaryUsdtAddress` is a valid address format for the supported USDT network.
*   `linkedEoaForSolRefill`: STRING (Optional, user's External Owned Account address for SOL auto-refill)
    *   // TEST: `linkedEoaForSolRefill` is a valid Solana address if provided.
*   `autoRefillSolSettings`: `AutoRefillSetting` Object (Optional)
*   `autoRefillServiceCreditsSettings`: `AutoRefillSetting` Object (Optional)
*   `isDefault`: BOOLEAN (Indicates if this is the user's default wallet)
*   `createdAt`: DATETIME
*   `updatedAt`: DATETIME

## 2. AutoRefillSetting (Embedded in Wallet or separate table linked to Wallet)
Defines parameters for automatically refilling SOL or Service Credits.

*   `isEnabled`: BOOLEAN (Default: false)
*   `threshold`: DECIMAL (Balance level at which to trigger refill, e.g., 0.2 SOL or 1000 Credits)
    *   // TEST: `threshold` is a positive number.
*   `refillAmount`: DECIMAL (Amount to refill/purchase, e.g., 1 SOL or 5000 Credits)
    *   // TEST: `refillAmount` is a positive number.
*   **For SOL Refill (specific to `autoRefillSolSettings`):**
    *   `sourceEoaWalletId`: STRING (Optional, could reference another EOA wallet managed by user or just be the address string `linkedEoaForSolRefill` from Wallet model)
*   **For Service Credits Refill (specific to `autoRefillServiceCreditsSettings`):**
    *   (No extra fields needed here as it uses `usdtBalance` from the same `Wallet`)

## 3. WalletTransaction
Represents a single financial transaction related to a user's abstract wallet.

*   `transactionId`: STRING (Primary Key, Unique identifier)
*   `walletId`: STRING (Foreign Key, references Wallet.walletId)
*   `userId`: STRING (Foreign Key, references User.userId)
*   `agentId`: STRING (Optional, Foreign Key, references Agent.agentId, if transaction is related to an agent)
*   `mcpId`: STRING (Optional, Foreign Key, references MCP.mcpId, if transaction is an MCP fee)
*   `timestamp`: DATETIME (When the transaction occurred)
*   `type`: ENUM (
        `DEPOSIT_SOL`, `WITHDRAW_SOL`,
        `DEPOSIT_USDT`, `WITHDRAW_USDT`,
        `PURCHASE_SERVICE_CREDITS` (USDT spent),
        `SERVICE_CREDIT_REFUND`,
        `SOL_GAS_FEE` (Agent operation),
        `MCP_SERVICE_FEE` (Agent operation using credits),
        `A2A_SERVICE_FEE` (Future, if agents can charge each other),
        `AGENT_STORE_PURCHASE_CREDITS`, `AGENT_STORE_PURCHASE_SOL`,
        `AUTO_REFILL_SOL`, `AUTO_REFILL_SERVICE_CREDITS`,
        `OTHER`
    )
    *   // TEST: `type` is one of the allowed enum values.
*   `description`: TEXT (User-friendly description, e.g., "SOL Gas for Jupiter Trade Agent", "TextSummarizer MCP fee", "Purchased 5000 Service Credits")
    *   // TEST: `description` is not empty.
*   `currency`: ENUM (`SOL`, `USDT`, `SERVICE_CREDITS`)
    *   // TEST: `currency` is one of an allowed set.
*   `amount`: DECIMAL (The amount of the transaction. Positive for credits/deposits, negative for debits/spend.)
    *   // TEST: `amount` is a valid number.
*   `balanceBefore`: DECIMAL (Balance of `currency` before this transaction)
*   `balanceAfter`: DECIMAL (Balance of `currency` after this transaction)
*   `relatedTransactionId`: STRING (Optional, e.g., linking a USDT spend to a Service Credit purchase)
*   `onChainTxHash`: STRING (Optional, if the transaction has an on-chain equivalent, e.g., SOL deposit)
*   `status`: ENUM (`PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`)
    *   // TEST: `status` is one of the allowed enum values.
*   `metadata`: JSON (Optional, for any other relevant details, e.g., `{"receivedCredits": 2000}` for a USDT purchase)

## Relationships:
*   A `User` can have multiple `Wallet`s.
*   A `Wallet` belongs to one `User`.
*   A `Wallet` can have an `autoRefillSolSettings` object and an `autoRefillServiceCreditsSettings` object.
*   A `Wallet` can have many `WalletTransaction`s.
*   A `WalletTransaction` belongs to one `Wallet`.
*   A `WalletTransaction` can optionally be linked to an `Agent` and/or an `MCP`.

These models cover the core aspects of managing balances, auto-refill configurations, and tracking transaction history for the abstract wallets.