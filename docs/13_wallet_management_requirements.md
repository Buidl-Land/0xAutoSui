# Page E: Abstract Wallet Management - Functional Requirements

This page allows users to manage their funds (SOL for Gas, USDT for Service Credits), view balances, and see transaction history.

## 1. UI Text Translations (Chinese to English)

### 1.1. Common Header (Same as Dashboard)
*   (Standard header elements apply)

### 1.2. Page Title & Wallet Selection
*   `抽象钱包管理` -> `Abstract Wallet Management`
*   `当前钱包: 主钱包 (SoL1...xyz)` -> `Current Wallet: Main Wallet (SoL1...xyz)`
*   `[切换钱包/创建新钱包]` -> `[Switch Wallet / Create New Wallet]`

### 1.3. Balance Overview
*   `余额概览:` -> `Balance Overview:`
*   `SOL (用于Gas): 2.85 SOL` -> `SOL (for Gas): 2.85 SOL`
*   `[充值 SOL]` -> `[Deposit SOL]`
*   `[提现 SOL]` -> `[Withdraw SOL]`
*   `USDT (用于服务): 500.00 USDT` -> `USDT (for Services): 500.00 USDT`
*   `[充值 USDT]` -> `[Deposit USDT]`
*   `[购买服务点数]` -> `[Purchase Service Credits]`
*   `0xAuto服务点数: 10,000 点` -> `0xAuto Service Credits: 10,000 Credits`
*   `[用USDT购买更多]` -> `[Purchase More with USDT]` (Likely same action as "Purchase Service Credits")

### 1.4. Auto-Refill Settings
*   `自动补充设置 (可选):` -> `Auto-Refill Settings (Optional):`
*   `[ ] 当SOL余额低于 [0.2] SOL时，自动从 [关联的EOA钱包] 转入 [1] SOL.` -> `[ ] When SOL balance is below [0.2] SOL, automatically transfer [1] SOL from [Linked EOA Wallet].`
*   `[ ] 当服务点数低于 [1000] 点时，自动使用USDT购买 [5000] 点 (从USDT余额).` -> `[ ] When Service Credits are below [1000] Credits, automatically purchase [5000] Credits using USDT (from USDT balance).`

### 1.5. Transaction History
*   `交易记录:` -> `Transaction History:`
*   `[筛选: 全部/SOL Gas支出/MCP费用/服务购买]` -> `[Filter: All/SOL Gas Spent/MCP Fees/Service Purchases]`
*   `[日期范围]` -> `[Date Range]`
*   **Table Headers:**
    *   `时间戳` -> `Timestamp`
    *   `类型` -> `Type`
    *   `Agent` -> `Agent`
    *   `描述/MCP` -> `Description/MCP`
    *   `金额/点数` -> `Amount/Credits`
*   **Transaction Type Examples:**
    *   `SOL Gas`
    *   `MCP费用` -> `MCP Fee`
    *   `服务购买 (USDT)` -> `Service Purchase (USDT)`
*   **Transaction Description Examples:**
    *   `Jupiter交易` -> `Jupiter Trade`
    *   `TextSummarizer`
    *   `购买服务点数` -> `Purchase Service Credits`
    *   `(获得2000点)` -> `(Received 2000 Credits)`
*   **Amount/Credits Examples:**
    *   `-0.001 SOL`
    *   `-5 点` -> `-5 Credits`
    *   `-20 USDT`

## 2. Functional Requirements

### 2.1. Header & Navigation
*   **FR-E.1.1:** Display standard application header (Logo, Nav links: Dashboard, My Agents, MCP Hub, Wallet (active), Notifications, User Profile).
    *   // TEST: Header elements are present and "Wallet" is marked active.

### 2.2. Page Title & Wallet Context
*   **FR-E.2.1:** Display page title "Abstract Wallet Management".
*   **FR-E.2.2:** Display the `Current Wallet` name and its address (or a truncated version).
    *   // TEST: Current active wallet name and address are displayed.
*   **FR-E.2.3:** Provide a `[Switch Wallet / Create New Wallet]` button/dropdown.
    *   Allows users to select from their existing abstract wallets.
    *   Allows users to initiate the creation of a new abstract wallet.
    *   // TEST: Wallet switching mechanism is present.
    *   // TEST: User can switch between their abstract wallets.
    *   // TEST: User can initiate new abstract wallet creation.

### 2.3. Balance Overview Section
*   **FR-E.3.1:** Display "Balance Overview:" title.
*   **FR-E.3.2:** Display `SOL (for Gas)` balance with the amount and "SOL" unit.
    *   Provide a `[Deposit SOL]` button. (Opens modal/page for SOL deposit instructions/address).
        *   // TEST: Deposit SOL button initiates deposit flow.
    *   Provide a `[Withdraw SOL]` button. (Opens modal/page for SOL withdrawal).
        *   // TEST: Withdraw SOL button initiates withdrawal flow.
    *   // TEST: Correct SOL balance is displayed.
*   **FR-E.3.3:** Display `USDT (for Services)` balance with the amount and "USDT" unit.
    *   Provide a `[Deposit USDT]` button. (Opens modal/page for USDT deposit instructions/address).
        *   // TEST: Deposit USDT button initiates deposit flow.
    *   Provide a `[Purchase Service Credits]` button. (Opens modal/page to convert USDT to Service Credits).
        *   // TEST: Purchase Service Credits button initiates purchase flow.
    *   // TEST: Correct USDT balance is displayed.
*   **FR-E.3.4:** Display `0xAuto Service Credits` balance with the amount and "Credits" unit.
    *   Provide a `[Purchase More with USDT]` button (likely identical to "Purchase Service Credits").
    *   // TEST: Correct Service Credits balance is displayed.

### 2.4. Auto-Refill Settings Section
*   **FR-E.4.1:** Display "Auto-Refill Settings (Optional):" title.
*   **FR-E.4.2:** Provide a checkbox: `[ ] When SOL balance is below [input: 0.2] SOL, automatically transfer [input: 1] SOL from [input: Linked EOA Wallet].`
    *   Inputs for threshold, amount, and linked EOA wallet address should be configurable if checkbox is checked.
    *   // TEST: SOL auto-refill checkbox and associated inputs are present.
    *   // TEST: SOL auto-refill settings can be configured and saved.
    *   // TEST: Validation for SOL threshold, amount, and EOA address.
*   **FR-E.4.3:** Provide a checkbox: `[ ] When Service Credits are below [input: 1000] Credits, automatically purchase [input: 5000] Credits using USDT (from USDT balance).`
    *   Inputs for threshold and purchase amount should be configurable if checkbox is checked.
    *   // TEST: Service Credits auto-refill checkbox and associated inputs are present.
    *   // TEST: Service Credits auto-refill settings can be configured and saved.
    *   // TEST: Validation for credit threshold and purchase amount.
*   **FR-E.4.4:** Settings should be saved per abstract wallet.
    *   // TEST: Auto-refill settings persist per wallet.

### 2.5. Transaction History Section
*   **FR-E.5.1:** Display "Transaction History:" title.
*   **FR-E.5.2:** Provide filter options for transaction types: "All", "SOL Gas Spent", "MCP Fees", "Service Purchases".
    *   // TEST: Transaction type filter is present and functional.
*   **FR-E.5.3:** Provide a date range filter for transactions.
    *   // TEST: Date range filter is present and functional.
*   **FR-E.5.4:** Display a table of transactions with columns: `Timestamp`, `Type`, `Agent` (if applicable), `Description/MCP`, `Amount/Credits`.
    *   Transactions should be displayed in reverse chronological order.
    *   // TEST: Transaction table with specified columns is displayed.
    *   // TEST: Transactions are ordered correctly.
*   **FR-E.5.5 (Edge Case):** If no transactions exist (or match filters), display an appropriate message (e.g., "No transactions found.").
    *   // TEST: Empty state message for transaction history is shown correctly.
*   **FR-E.5.6:** Implement pagination for transaction history if entries are numerous.
    *   // TEST: Pagination for transaction history is implemented if needed.

## 3. Edge Cases
*   **EC-E.1:** User has multiple abstract wallets; switching wallets should update all displayed balances, settings, and transaction history.
    *   // TEST: Switching wallets correctly updates all page content.
*   **EC-E.2:** API calls for balances, transaction history, or saving settings fail.
    *   Display appropriate error messages.
    *   // TEST: Error messages are shown on API failure.
*   **EC-E.3:** Insufficient USDT balance when attempting to purchase service credits or for auto-refill.
    *   Display a clear error message.
    *   // TEST: Insufficient USDT for purchase/refill is handled with an error.
*   **EC-E.4:** Insufficient SOL in linked EOA for auto-refill.
    *   The auto-refill attempt should fail gracefully, possibly with a notification.
    *   // TEST: Insufficient SOL in EOA for auto-refill is handled.
*   **EC-E.5:** Invalid input for auto-refill thresholds/amounts (e.g., negative numbers).
    *   Input validation should prevent saving.
    *   // TEST: Validation for auto-refill inputs.