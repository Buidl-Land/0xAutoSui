# Page F: Agent Store - Functional Requirements

This page is a marketplace for users to discover, purchase, or use pre-built Agents, focusing on the Solana ecosystem.

## 1. UI Text Translations (Chinese to English)

### 1.1. Common Header (Modified Navigation)
*   `[0xAuto OS Logo]` -> `[0xAuto OS Logo]`
*   `仪表盘` -> `Dashboard`
*   `我的Agent` -> `My Agents`
*   `MCP中心` -> `MCP Hub`
*   `钱包` -> `Wallet`
*   `Agent商店` -> `Agent Store` (New active link)
*   `[通知]` -> `[Notifications Icon]`
*   `[用户]` -> `[User Profile/Settings Icon]`

### 1.2. Page Title & Controls
*   `Agent 商店 (专注于Solana生态)` -> `Agent Store (Focused on Solana Ecosystem)`
*   `[搜索Agent...]` -> `[Search Agents...]`
*   `[分类: DeFi策略/NFT工具/数据监控/官方/社区]` -> `[Category: DeFi Strategies/NFT Tools/Data Monitoring/Official/Community]`
*   `[排序]` -> `[Sort]`

### 1.3. Agent Card Elements
*   **Example Agent Names & Providers:**
    *   `SOL智能定投Agent (官方)` -> `SOL Smart DCA Agent (Official)`
    *   `Solana NFT狙击Agent (社区热门)` -> `Solana NFT Sniper Agent (Community Hot)`
    *   `Raydium流动性挖矿Agent (社区)` -> `Raydium Liquidity Mining Agent (Community)`
    *   `Helium网络优化Agent (官方)` -> `Helium Network Optimizer Agent (Official)`
*   `描述: 根据自定义策略定投SOL及生态代币` -> `Description: DCA for SOL and ecosystem tokens based on custom strategy`
*   `描述: 监控新mint项目并自动参与` -> `Description: Monitors new mint projects and participates automatically`
*   `描述: 自动管理Raydium LP仓位` -> `Description: Automatically manages Raydium LP positions`
*   `描述: 基于数据优化Helium节点部署` -> `Description: Optimizes Helium node deployment based on data`
*   `类别: 投资, DeFi, Solana` -> `Category: Investment, DeFi, Solana`
*   `类别: NFT, Solana` -> `Category: NFT, Solana`
*   `类别: DePIN, Solana, 工具` -> `Category: DePIN, Solana, Tools`
*   `价格: 免费 / 1000点/月(USDT购买)` -> `Price: Free / 1000 Credits/month (USDT purchase)`
*   `价格: 50 SOL 一次性 / 500点/月` -> `Price: 50 SOL one-time / 500 Credits/month`
*   `价格: 2000点/季度 (USDT购买)` -> `Price: 2000 Credits/quarter (USDT purchase)`
*   `价格: 免费 (需特定MCP订阅)` -> `Price: Free (Requires specific MCP subscription)`
*   `[详情]` -> `[Details]`
*   `[获取/部署到我的Agent]` -> `[Get / Deploy to My Agents]`

### 1.4. Other Elements
*   `...` (More Agent cards)

## 2. Functional Requirements

### 2.1. Header & Navigation
*   **FR-F.1.1:** Display standard application header with "Agent Store" link active.
    *   // TEST: Header elements are present and "Agent Store" is marked active.

### 2.2. Page Title
*   **FR-F.2.1:** Display page title "Agent Store (Focused on Solana Ecosystem)".

### 2.3. Search, Filtering, and Sorting
*   **FR-F.3.1:** Provide a search input field "[Search Agents...]".
    *   // TEST: Search input is present.
    *   // TEST: Typing filters the Agent Store list by name or description.
*   **FR-F.3.2:** Provide category filter options (e.g., DeFi Strategies, NFT Tools, Data Monitoring, Official, Community).
    *   // TEST: Category filter options are present and functional.
*   **FR-F.3.3:** Provide sorting options (e.g., by Name, Popularity, Price, Recently Added).
    *   // TEST: Sort options are present and functional.

### 2.4. Agent Card Display
*   **FR-F.4.1:** Display purchasable/usable Agents in a card layout.
    *   // TEST: Agents are displayed as cards.
*   **FR-F.4.2:** Each Agent card must display:
    *   `Name` (e.g., "SOL Smart DCA Agent")
    *   `Provider` (e.g., "Official", "Community Hot")
    *   `Description` (brief summary).
    *   `Category` (tags like "Investment", "NFT", "Solana").
    *   `Price` (e.g., "Free", "X Credits/month (USDT purchase)", "Y SOL one-time").
        *   // TEST: All required Agent card info is displayed.
*   **FR-F.4.3:** Each Agent card must have action buttons:
    *   `[Details]`: Navigates to a dedicated Agent Detail page within the store (similar to MCP Detail).
        *   // TEST: "Details" button navigates to an Agent Store detail view.
    *   `[Get / Deploy to My Agents]`:
        *   If free: Allows user to add this pre-configured agent to their "My Agents" list, possibly with minor setup.
        *   If paid: Initiates a purchase flow (using Service Credits or SOL from user's abstract wallet). Upon successful purchase, allows deployment.
        *   Deployment might involve creating a new instance of this agent under "My Agents" or applying it as a template.
        *   // TEST: "Get / Deploy" button functions based on price.
        *   // TEST: Free agents can be acquired.
        *   // TEST: Paid agents initiate purchase flow.
        *   // TEST: Acquired agents can be deployed/instantiated.

### 2.5. Agent Store Detail View (Implied)
*   **FR-F.5.1:** An Agent Store Detail page should exist, accessible via the `[Details]` button.
*   **FR-F.5.2:** This page should display comprehensive information about the pre-built Agent:
    *   Full Name, Provider, Extended Description, Categories.
    *   Detailed Pricing structure.
    *   Required MCPs (and if they need separate acquisition/subscription).
    *   Typical resource consumption (SOL/Service Credits).
    *   Permissions required.
    *   Version history, user reviews/ratings (optional).
    *   Screenshots or demo of functionality (optional).
    *   // TEST: Agent Store Detail page shows comprehensive information.

### 2.6. Pagination
*   **FR-F.6.1:** Implement pagination if the number of store Agents exceeds a certain limit per page.
    *   // TEST: Pagination controls appear and function correctly.

## 3. Edge Cases
*   **EC-F.1:** No Agents match search/filter criteria.
    *   Display an appropriate message.
    *   // TEST: "No Agents found" message is shown.
*   **EC-F.2:** API call to fetch Agent Store list fails.
    *   Display an error message.
    *   // TEST: Error message shown on API failure.
*   **EC-F.3:** User attempts to acquire a paid Agent with insufficient funds (SOL or Service Credits).
    *   Display an error message and guide user to top up their wallet.
    *   // TEST: Insufficient funds error is handled for paid agents.
*   **EC-F.4:** An Agent from the store requires specific MCPs that the user does not have or are paid.
    *   The "Get/Deploy" process should inform the user about these dependencies and guide them (e.g., link to MCP Hub).
    *   // TEST: Dependencies on other MCPs are clearly communicated during acquisition.
*   **EC-F.5:** Distinguish clearly between one-time purchases and subscription-based Agents.
    *   // TEST: Pricing models (one-time vs. subscription) are clear.