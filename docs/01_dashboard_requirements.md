# Page A: Dashboard - Functional Requirements

## 1. UI Text Translations (Chinese to English)

### 1.1. Header Navigation
*   `仪表盘` -> `Dashboard`
*   `我的Agent` -> `My Agents`
*   `MCP中心` -> `MCP Hub`
*   `钱包` -> `Wallet`
*   `[通知]` -> `[Notifications Icon]`
*   `[用户]` -> `[User Profile/Settings Icon]`

### 1.2. Main Content Area
*   `欢迎回来, [用户名]!` -> `Welcome back, [Username]!`
*   `Agent 概览` -> `Agent Overview`
*   `总计 Agent: XX` -> `Total Agents: XX`
*   `运行中: YY (定时: ZZ)` -> `Running: YY (Scheduled: ZZ)`
*   `待处理/错误: NN` -> `Pending/Error: NN`
*   `[查看所有 Agent ->]` -> `[View All Agents ->]`
*   `最近活动/日志摘要` -> `Recent Activity / Log Summary`
*   `- Agent A 完成了每日Solana新闻抓取` -> `- Agent A completed daily Solana news scraping`
*   `- Agent B 执行了Jupiter聚合交易` -> `- Agent B executed Jupiter aggregation trade`
*   `- Agent C 触发了SOL价格警报` -> `- Agent C triggered SOL price alert`
*   `[查看完整日志 ->]` -> `[View Full Logs ->]`
*   `快速操作` -> `Quick Actions`
*   `[ + 创建新 Agent ]` -> `[ + Create New Agent ]`
*   `[ 浏览 MCP 市场 -> ]` -> `[ Browse MCP Marketplace -> ]`
*   `[ 管理我的钱包 -> ]` -> `[ Manage My Wallet -> ]`
*   `抽象钱包余额` -> `Abstract Wallet Balance`
*   `SOL: 1.5 (用于 Gas)` -> `SOL: 1.5 (for Gas)`
*   `USDT: 200 (用于购买服务点数)` -> `USDT: 200 (for purchasing Service Credits)`
*   `服务点数: 8000` -> `Service Credits: 8000`
*   `我关注的信息流 (由特定Agent推送的摘要)` -> `My Watched Feeds (Summaries pushed by specific Agents)`
*   `- 每日Solana生态新闻摘要 (Agent: SolanaNewsAggregator)` -> `- Daily Solana Ecosystem News Summary (Agent: SolanaNewsAggregator)`
*   `- 关注SOL巨鲸地址动态 (Agent: SOLWhaleWatcher)` -> `- Tracking SOL Whale Address Activity (Agent: SOLWhaleWatcher)`

## 2. Functional Requirements

### 2.1. Header
*   **FR2.1.1:** Display the application logo (`0xAuto OS Logo`).
    *   // TEST: Logo is visible and correctly rendered.
*   **FR2.1.2:** Provide navigation links: `Dashboard`, `My Agents`, `MCP Hub`, `Wallet`.
    *   // TEST: All navigation links are present.
    *   // TEST: Clicking `Dashboard` navigates to the Dashboard page.
    *   // TEST: Clicking `My Agents` navigates to the Agent Management page.
    *   // TEST: Clicking `MCP Hub` navigates to the MCP Hub page.
    *   // TEST: Clicking `Wallet` navigates to the Wallet page.
*   **FR2.1.3:** Display a `Notifications` icon/button.
    *   // TEST: Notifications icon is present.
    *   // TEST: Clicking Notifications icon opens a notification panel/dropdown.
*   **FR2.1.4:** Display a `User Profile/Settings` icon/button.
    *   // TEST: User Profile icon is present.
    *   // TEST: Clicking User Profile icon opens a user menu (e.g., profile, settings, logout).

### 2.2. Welcome Message
*   **FR2.2.1:** Display a personalized welcome message: "Welcome back, [Username]!".
    *   // TEST: Welcome message displays the correct username.

### 2.3. Agent Overview Section
*   **FR2.3.1:** Display the title "Agent Overview".
*   **FR2.3.2:** Display "Total Agents: XX", where XX is the total number of agents owned by the user.
    *   // TEST: Correct total agent count is displayed.
*   **FR2.3.3:** Display "Running: YY (Scheduled: ZZ)", where YY is the count of currently active agents and ZZ is the count of agents scheduled to run.
    *   // TEST: Correct running agent count is displayed.
    *   // TEST: Correct scheduled agent count is displayed.
*   **FR2.3.4:** Display "Pending/Error: NN", where NN is the count of agents in a pending or error state.
    *   // TEST: Correct pending/error agent count is displayed.
*   **FR2.3.5:** Provide a "[View All Agents ->]" link/button.
    *   // TEST: Link/button is present.
    *   // TEST: Clicking "[View All Agents ->]" navigates to the Agent Management page.

### 2.4. Recent Activity / Log Summary Section
*   **FR2.4.1:** Display the title "Recent Activity / Log Summary".
*   **FR2.4.2:** Display a list of recent agent activities/log entries (e.g., 3-5 most recent).
    *   // TEST: A list of recent activities is displayed.
    *   // TEST: Each activity shows relevant information (e.g., Agent name, action performed).
    *   Example entries:
        *   Agent A completed daily Solana news scraping
        *   Agent B executed Jupiter aggregation trade
        *   Agent C triggered SOL price alert
*   **FR2.4.3:** Provide a "[View Full Logs ->]" link/button.
    *   // TEST: Link/button is present.
    *   // TEST: Clicking "[View Full Logs ->]" navigates to a dedicated logs page or section.

### 2.5. Quick Actions Section
*   **FR2.5.1:** Display the title "Quick Actions".
*   **FR2.5.2:** Provide a "[ + Create New Agent ]" button.
    *   // TEST: Button is present.
    *   // TEST: Clicking "[ + Create New Agent ]" navigates to the Create/Edit Agent page or opens a creation modal.
*   **FR2.5.3:** Provide a "[ Browse MCP Marketplace -> ]" link/button.
    *   // TEST: Link/button is present.
    *   // TEST: Clicking "[ Browse MCP Marketplace -> ]" navigates to the MCP Hub/Marketplace page.
*   **FR2.5.4:** Provide a "[ Manage My Wallet -> ]" link/button.
    *   // TEST: Link/button is present.
    *   // TEST: Clicking "[ Manage My Wallet -> ]" navigates to the Wallet page.

### 2.6. Abstract Wallet Balance Section
*   **FR2.6.1:** Display the title "Abstract Wallet Balance".
*   **FR2.6.2:** Display SOL balance: "SOL: X.X (for Gas)".
    *   // TEST: Correct SOL balance is displayed.
    *   // TEST: "for Gas" label is present.
*   **FR2.6.3:** Display USDT balance: "USDT: YYY (for purchasing Service Credits)".
    *   // TEST: Correct USDT balance is displayed.
    *   // TEST: "for purchasing Service Credits" label is present.
*   **FR2.6.4:** Display Service Credits balance: "Service Credits: ZZZZ".
    *   // TEST: Correct Service Credits balance is displayed.

### 2.7. My Watched Feeds Section (Optional)
*   **FR2.7.1:** Display the title "My Watched Feeds (Summaries pushed by specific Agents)" if the user has active feeds.
*   **FR2.7.2:** Display a list of summaries from watched feeds, including the source Agent.
    *   // TEST: Watched feeds are displayed if available.
    *   // TEST: Each feed item shows a summary and the responsible Agent's name.
    *   Example entries:
        *   Daily Solana Ecosystem News Summary (Agent: SolanaNewsAggregator)
        *   Tracking SOL Whale Address Activity (Agent: SOLWhaleWatcher)
*   **FR2.7.3 (Edge Case):** If no feeds are active/configured, this section should be hidden or display a message like "No active feeds. Configure agents to push summaries here."
    *   // TEST: Section is hidden or shows appropriate message when no feeds exist.

## 3. Non-Functional Requirements (General, to be expanded later)
*   **NFR3.1:** The dashboard should load quickly, ideally within 3 seconds.
    *   // TEST: Measure dashboard load time.
*   **NFR3.2:** All data displayed should be up-to-date or clearly indicate its refresh status/timestamp.
    *   // TEST: Verify data freshness or presence of timestamps.
*   **NFR3.3:** The UI should be responsive and adapt to different screen sizes (desktop, tablet).
    *   // TEST: Check responsiveness on various screen resolutions.

## 4. Edge Cases
*   **EC4.1:** User has zero agents.
    *   Agent Overview should display 0 for all counts.
    *   "View All Agents" link should still function.
    *   // TEST: Dashboard behavior with zero agents.
*   **EC4.2:** User has agents, but none are running, scheduled, or in error.
    *   Relevant counts in Agent Overview should be 0.
    *   // TEST: Dashboard behavior with idle agents.
*   **EC4.3:** No recent activity/logs.
    *   Recent Activity section should display an appropriate message (e.g., "No recent activity").
    *   // TEST: Recent Activity section with no logs.
*   **EC4.4:** Wallet balances are zero or very low.
    *   Balances should display correctly as 0 or the low amount.
    *   // TEST: Display of zero/low wallet balances.
*   **EC4.5:** API calls to fetch dashboard data fail.
    *   The dashboard should display appropriate error messages or placeholders for affected sections.
    *   // TEST: Dashboard behavior when backend data fetching fails for one or more sections.
*   **EC4.6:** Username is very long or contains special characters.
    *   The welcome message should handle this gracefully without breaking the layout.
    *   // TEST: Welcome message with long/special character username.