# Page D: MCP Hub - Functional Requirements

This page serves as a marketplace or discovery center for Model Context Protocols (MCPs) that agents can use.

## 1. UI Text Translations (Chinese to English)

### 1.1. Common Header (Same as Dashboard)
*   (Standard header elements apply)

### 1.2. Page Title & Controls
*   `MCP 中心 (Model Context Protocol Hub)` -> `MCP Hub (Model Context Protocol Hub)`
*   `[搜索MCP...]` -> `[Search MCPs...]`
*   `[分类: 数据源/分析/Solana执行/Web2/官方/第三方]` -> `[Category: Data Source/Analysis/Solana Execution/Web2/Official/Third-Party]`
*   `[排序]` -> `[Sort]`

### 1.3. MCP Card Elements
*   **Example MCP Names & Providers:**
    *   `Web2_SolanaNewsFetcher (官方)` -> `Web2_SolanaNewsFetcher (Official)`
    *   `Jupiter_PriceAggregator (第三方)` -> `Jupiter_PriceAggregator (Third-Party)`
    *   `TextSummarizer_最新模型 (官方)` -> `TextSummarizer_LatestModel (Official)`
    *   `Jupiter_TradeExecutor (官方)` -> `Jupiter_TradeExecutor (Official)`
    *   `Solana_OnChainWatcher (官方)` -> `Solana_OnChainWatcher (Official)`
    *   `Helium_DataCreditOracle (第三方)` -> `Helium_DataCreditOracle (Third-Party)`
*   `描述: 从指定源抓取Solana相关新闻` -> `Description: Scrapes Solana-related news from specified sources`
*   `描述: 获取Solana代币实时价格(Jupiter)` -> `Description: Gets real-time Solana token prices (Jupiter)`
*   `描述: 使用最新AI模型进行文本摘要` -> `Description: Performs text summarization using the latest AI model`
*   `描述: 在Jupiter上执行聚合交易` -> `Description: Executes aggregated trades on Jupiter`
*   `描述: 监控Solana链上事件/地址` -> `Description: Monitors Solana on-chain events/addresses`
*   `描述: 获取Helium网络数据信用点信息` -> `Description: Gets Helium network data credit information`
*   `类型: 数据源, Web2, Solana` -> `Type: Data Source, Web2, Solana`
*   `类型: 数据源, Solana, DeFi` -> `Type: Data Source, Solana, DeFi`
*   `类型: 分析, AI` -> `Type: Analysis, AI`
*   `类型: 执行, Solana, DeFi` -> `Type: Execution, Solana, DeFi`
*   `类型: 数据源, Solana` -> `Type: Data Source, Solana`
*   `类型: 数据源, Solana, DePIN` -> `Type: Data Source, Solana, DePIN`
*   `成本: 免费 / 0.01点/次` -> `Cost: Free / 0.01 Credits/use`
*   `成本: 0.05点/次` -> `Cost: 0.05 Credits/use`
*   `成本: 0.1点/1k token (USDT计价)` -> `Cost: 0.1 Credits/1k tokens (USDT denominated)`
*   `成本: SOL Gas费 + 0.05点/交易` -> `Cost: SOL Gas fee + 0.05 Credits/trade`
*   `成本: 0.02点/监控单元` -> `Cost: 0.02 Credits/monitoring unit`
*   `成本: 0.03点/查询` -> `Cost: 0.03 Credits/query`
*   `[详情]` -> `[Details]`
*   `[添加到Agent (上下文)]` -> `[Add to Agent (Contextual)]` (This likely means adding to the currently active/selected agent configuration, or prompting for agent selection)

### 1.4. Other Elements
*   `...更多MCP卡片...` -> `...More MCP Cards...`
*   `[分页控件]` -> `[Pagination Controls]`
*   `(侧边栏可能显示“我已集成的MCPs”或“热门Solana MCPs”)` -> `(Sidebar might display "My Integrated MCPs" or "Popular Solana MCPs")`

## 2. Functional Requirements

### 2.1. Header & Navigation
*   **FR-D.1.1:** Display standard application header (Logo, Nav links: Dashboard, My Agents, MCP Hub (active), Wallet, Notifications, User Profile).
    *   // TEST: Header elements are present and "MCP Hub" is marked active.

### 2.2. Page Title
*   **FR-D.2.1:** Display page title "MCP Hub (Model Context Protocol Hub)".

### 2.3. Search and Filtering/Sorting
*   **FR-D.3.1:** Provide a search input field "[Search MCPs...]".
    *   // TEST: Search input is present.
    *   // TEST: Typing in search field filters the MCP list by name or description.
*   **FR-D.3.2:** Provide category filter options (e.g., Data Source, Analysis, Solana Execution, Web2, Official, Third-Party).
    *   These could be dropdowns, multi-select, or a set of filter tags.
    *   // TEST: Category filter options are present.
    *   // TEST: Selecting categories filters the MCP list.
*   **FR-D.3.3:** Provide sorting options (e.g., by Name, Popularity, Cost, Recently Added).
    *   // TEST: Sort options are present.
    *   // TEST: Selecting a sort option reorders the MCP list.

### 2.4. MCP Card Display
*   **FR-D.4.1:** Display MCPs in a card layout.
    *   // TEST: MCPs are displayed as cards.
*   **FR-D.4.2:** Each MCP card must display:
    *   `Name` (e.g., "Web2_SolanaNewsFetcher")
    *   `Provider` (e.g., "Official", "Third-Party") - clearly distinguishable.
    *   `Description` (brief summary of MCP functionality).
    *   `Type` (tags or categories, e.g., "Data Source", "AI", "Solana").
    *   `Cost` (e.g., "Free", "X Credits/use", "Y Credits/1k tokens (USDT denominated)", "SOL Gas + Z Credits/trade").
        *   // TEST: All required MCP info (Name, Provider, Description, Type, Cost) is displayed on each card.
*   **FR-D.4.3:** Each MCP card must have action buttons:
    *   `[Details]`: Navigates to a dedicated MCP Detail page (not explicitly sketched but implied).
        *   // TEST: "Details" button navigates to an MCP detail view.
    *   `[Add to Agent (Contextual)]`:
        *   If accessed from Agent Configuration workflow: Adds the MCP to the current agent being configured.
        *   If accessed directly: May prompt user to select an agent to add this MCP to, or navigate to agent creation with this MCP pre-selected.
        *   // TEST: "Add to Agent" button functions contextually.
        *   // TEST: MCP can be successfully added to an agent's configuration.

### 2.5. MCP Detail View (Implied)
*   **FR-D.5.1:** An MCP Detail page should exist, accessible via the `[Details]` button on an MCP card.
*   **FR-D.5.2:** This page should display comprehensive information about the MCP, including:
    *   Full Name, Provider, Extended Description.
    *   Detailed Cost breakdown.
    *   Required parameters and their schema/format (`parameterSchema` from domain model).
    *   Input/Output specifications.
    *   Version history (optional).
    *   User reviews/ratings (optional).
    *   Example usage or integration guide.
    *   // TEST: MCP Detail page shows comprehensive information including parameter schema.

### 2.6. Pagination
*   **FR-D.6.1:** Implement pagination if the number of MCPs exceeds a certain limit per page.
    *   // TEST: Pagination controls appear if MCP count exceeds page limit.
    *   // TEST: Pagination controls allow navigation to different pages of MCPs.

### 2.7. Optional Sidebar
*   **FR-D.7.1:** Optionally, a sidebar may display:
    *   "My Integrated MCPs": A list of MCPs the user has already used in their agents.
    *   "Popular Solana MCPs": A curated list of popular or featured MCPs, especially those relevant to Solana.
    *   // TEST: Sidebar (if implemented) displays relevant MCP lists.

## 3. Edge Cases
*   **EC-D.1:** No MCPs match search/filter criteria.
    *   Display an appropriate message (e.g., "No MCPs found matching your criteria.").
    *   // TEST: "No MCPs found" message is shown correctly.
*   **EC-D.2:** API call to fetch MCP list fails.
    *   Display an error message.
    *   // TEST: Error message is shown on API failure.
*   **EC-D.3:** MCP cost is complex (e.g., multiple tiers or dynamic).
    *   The card should display a summary, with full details on the MCP Detail page.
    *   // TEST: Complex MCP costs are summarized on card, detailed on detail page.
*   **EC-D.4:** "TextSummarizer_LatestModel" should be clearly identifiable and its cost structure (per 1k tokens, USDT denominated) accurately reflected.
    *   // TEST: "TextSummarizer_LatestModel" is present and its specific cost details are clear.
*   **EC-D.5:** Solana-specific execution MCPs like "Jupiter_TradeExecutor" should clearly indicate SOL Gas costs in addition to any service credit costs.
    *   // TEST: Solana execution MCPs show both SOL Gas and credit costs.