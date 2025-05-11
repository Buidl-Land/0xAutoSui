# Page B: Agent Management - Functional Requirements

This page consists of two main views: Agent List and Agent Detail.

## 1. UI Text Translations (Chinese to English)

### 1.1. Common Header (Same as Dashboard)
*   `仪表盘` -> `Dashboard`
*   `我的Agent` -> `My Agents`
*   `MCP中心` -> `MCP Hub`
*   `钱包` -> `Wallet`
*   `[通知]` -> `[Notifications Icon]`
*   `[用户]` -> `[User Profile/Settings Icon]`

### 1.2. Agent List Page (`My Agents`)
*   `我的 Agent` -> `My Agents`
*   `[ + 创建新 Agent ]` -> `[ + Create New Agent ]`
*   `[搜索 Agent...]` -> `[Search Agents...]`
*   `[筛选: 全部/运行中/定时/错误]` -> `[Filter: All/Running/Scheduled/Error]`
*   **Table Headers:**
    *   `Agent名称` -> `Agent Name`
    *   `状态` -> `Status`
    *   `触发方式` -> `Trigger Type`
    *   `下次运行` -> `Next Run`
    *   `操作` -> `Actions`
*   **Agent Status Examples (in table):**
    *   `运行中` -> `Running`
    *   `暂停中` -> `Paused`
    *   `错误` -> `Error`
*   **Trigger Type Examples (in table):**
    *   `定时(每日)` -> `Scheduled (Daily)`
    *   `事件驱动` -> `Event-driven`
    *   `定时(每时)` -> `Scheduled (Hourly)`
*   **Next Run Examples (in table):**
    *   `23:59`
    *   `N/A`
    *   `14:00`
*   **Action Buttons (in table):**
    *   `[详情]` -> `[Details]`
    *   `[编辑]` -> `[Edit]`
    *   `[暂停]` -> `[Pause]`
    *   `[启动]` -> `[Start]` (replaces Pause for paused agents)
    *   `[重试]` -> `[Retry]` (for agents in error state)
    *   `[日志]` -> `[Logs]`
    *   `[删]` (likely an icon for Delete) -> `[Delete Icon]`
*   `[分页控件]` -> `[Pagination Controls]`

### 1.3. Agent Detail Page
*   `< 返回Agent列表` -> `< Back to Agent List`
*   `Agent: [Agent名称]` -> `Agent: [Agent Name]` (e.g., `Agent: SolanaNewsAggregator`)
*   `[编辑 Agent]` -> `[Edit Agent]`
*   `状态:` -> `Status:` (e.g., `Status: Running (Scheduled Task, Next run: Today 23:59)`)
*   `描述:` -> `Description:` (e.g., `Description: Daily scraping of specified Solana news sources and generation of summaries, pushed to Telegram.`)
*   `配置概览:` -> `Configuration Overview:`
*   `触发器:` -> `Trigger:` (e.g., `Trigger: Scheduled - Daily 08:00`)
*   `依赖MCPs:` -> `Dependent MCPs:`
    *   `参数:` -> `Parameters:`
*   `依赖Agents (A2A):` -> `Dependent Agents (A2A):`
    *   `(无)` -> `(None)`
*   `输出:` -> `Output:`
*   `关联钱包:` -> `Associated Wallet:` (e.g., `Associated Wallet: Main Wallet (Balance: 1.5 SOL)`)
*   `运行日志:` -> `Run Logs:`
*   `[筛选日志级别]` -> `[Filter Log Level]`
*   `[时间范围]` -> `[Time Range]`
*   **Log Table Headers:**
    *   `时间戳` -> `Timestamp`
    *   `级别` -> `Level`
    *   `消息` -> `Message`
*   **Log Entry Examples:**
    *   `任务完成，摘要已发送。` -> `Task completed, summary sent.`
    *   `开始执行新闻抓取 (Solana源)...` -> `Starting news scraping (Solana sources)...`

## 2. Functional Requirements - Agent List Page

### 2.1. Header & Navigation
*   **FR-B-L.1.1:** Display standard application header (Logo, Nav links: Dashboard, My Agents (active), MCP Hub, Wallet, Notifications, User Profile).
    *   // TEST: Header elements are present and "My Agents" is marked active.

### 2.2. Page Title and Actions
*   **FR-B-L.2.1:** Display page title "My Agents".
*   **FR-B-L.2.2:** Provide a "[ + Create New Agent ]" button.
    *   // TEST: Button is present.
    *   // TEST: Clicking button navigates to the Create/Edit Agent page.

### 2.3. Search and Filtering
*   **FR-B-L.3.1:** Provide a search input field "[Search Agents...]".
    *   // TEST: Search input is present.
    *   // TEST: Typing in search field filters the agent list by name (real-time or on submit).
*   **FR-B-L.3.2:** Provide a filter dropdown/buttons for agent status: "All", "Running", "Scheduled", "Error".
    *   // TEST: Filter options are present.
    *   // TEST: Selecting a filter updates the agent list to show only agents with the selected status.
    *   // TEST: "All" filter shows all agents.

### 2.4. Agent List Table
*   **FR-B-L.4.1:** Display a table of agents with columns: `Agent Name`, `Status`, `Trigger Type`, `Next Run`, `Actions`.
    *   // TEST: Table with all specified columns is displayed.
*   **FR-B-L.4.2:** For each agent, display its respective information in the table.
    *   `Agent Name`: Clickable, navigates to Agent Detail page.
        *   // TEST: Agent name is displayed and clickable.
    *   `Status`: e.g., Running, Paused, Error, Scheduled.
        *   // TEST: Correct agent status is displayed.
    *   `Trigger Type`: e.g., Scheduled (Daily), Event-driven.
        *   // TEST: Correct trigger type is displayed.
    *   `Next Run`: Timestamp or "N/A".
        *   // TEST: Correct next run time or "N/A" is displayed.
*   **FR-B-L.4.3:** For each agent, provide action buttons/icons in the `Actions` column:
    *   `[Details]`: Navigates to the Agent Detail page for that agent.
        *   // TEST: Details button navigates to the correct agent's detail page.
    *   `[Edit]`: Navigates to the Create/Edit Agent page, pre-filled with the agent's data.
        *   // TEST: Edit button navigates to the edit page for the correct agent.
    *   `[Pause]`: If agent is running/scheduled, allows pausing the agent. Changes to `[Start]` if paused.
        *   // TEST: Pause button pauses the agent and changes to Start.
    *   `[Start]`: If agent is paused, allows starting/resuming the agent. Changes to `[Pause]` if running.
        *   // TEST: Start button starts the agent and changes to Pause.
    *   `[Retry]`: If agent is in "Error" state, allows retrying the agent's last task/run.
        *   // TEST: Retry button is available for error state and triggers a retry action.
    *   `[Logs]`: Navigates to the Agent Detail page, scrolled to or focused on the Run Logs section.
        *   // TEST: Logs button navigates to the detail page's log section.
    *   `[Delete Icon]`: Prompts for confirmation, then deletes the agent.
        *   // TEST: Delete button prompts for confirmation.
        *   // TEST: Confirmed deletion removes the agent from the list.
*   **FR-B-L.4.4 (Edge Case):** If no agents exist, display an appropriate message (e.g., "You haven't created any agents yet. Click 'Create New Agent' to get started.") and hide the table/search/filter.
    *   // TEST: Empty state message is shown when no agents exist.

### 2.5. Pagination
*   **FR-B-L.5.1:** Implement pagination if the number of agents exceeds a certain limit (e.g., 10 per page).
    *   // TEST: Pagination controls appear if agent count exceeds page limit.
    *   // TEST: Pagination controls allow navigation to different pages of agents.

## 3. Functional Requirements - Agent Detail Page

### 3.1. Header & Navigation
*   **FR-B-D.1.1:** Display standard application header.
*   **FR-B-D.1.2:** Provide a "< Back to Agent List" link/button.
    *   // TEST: Back link is present.
    *   // TEST: Clicking back link navigates to the Agent List page, preserving filter/search if possible.

### 3.2. Page Title and Actions
*   **FR-B-D.2.1:** Display the agent's name as the page title (e.g., "Agent: SolanaNewsAggregator").
*   **FR-B-D.2.2:** Provide an "[Edit Agent]" button.
    *   // TEST: Edit button is present.
    *   // TEST: Clicking edit button navigates to the Create/Edit Agent page for this agent.

### 3.3. Agent Information Display
*   **FR-B-D.3.1:** Display Agent `Status` (including trigger type and next run time if applicable).
    *   // TEST: Correct agent status, trigger, and next run time are displayed.
*   **FR-B-D.3.2:** Display Agent `Description`.
    *   // TEST: Correct agent description is displayed.

### 3.4. Configuration Overview Section
*   **FR-B-D.4.1:** Display the title "Configuration Overview:".
*   **FR-B-D.4.2:** Display `Trigger` type and details.
    *   // TEST: Correct trigger configuration is displayed.
*   **FR-B-D.4.3:** Display `Dependent MCPs` list, including MCP name and configured parameters.
    *   // TEST: List of dependent MCPs with parameters is displayed.
*   **FR-B-D.4.4:** Display `Dependent Agents (A2A)` list (or "(None)").
    *   // TEST: List of dependent agents or "(None)" is displayed.
*   **FR-B-D.4.5:** Display `Output` methods and their parameters.
    *   // TEST: Output configurations are displayed.
*   **FR-B-D.4.6:** Display `Associated Wallet` name and its current SOL balance.
    *   // TEST: Correct associated wallet and its SOL balance are displayed.

### 3.5. Run Logs Section
*   **FR-B-D.5.1:** Display the title "Run Logs:".
*   **FR-B-D.5.2:** Provide a log level filter (e.g., All, INFO, ERROR, DEBUG).
    *   // TEST: Log level filter is present.
    *   // TEST: Selecting a log level filters the displayed logs.
*   **FR-B-D.5.3:** Provide a time range filter for logs (e.g., Last hour, Last 24 hours, Custom range).
    *   // TEST: Time range filter is present.
    *   // TEST: Selecting a time range filters the displayed logs.
*   **FR-B-D.5.4:** Display a table of log entries with columns: `Timestamp`, `Level`, `Message`.
    *   // TEST: Log table with specified columns is displayed.
    *   // TEST: Logs are displayed in reverse chronological order (newest first).
*   **FR-B-D.5.5 (Edge Case):** If no logs exist for the agent (or selected filters), display an appropriate message (e.g., "No logs available for this agent.").
    *   // TEST: Empty state message for logs is shown when no logs are available.
*   **FR-B-D.5.6:** Implement pagination for logs if entries are numerous.
    *   // TEST: Pagination for logs is implemented if needed.

## 4. Edge Cases (General for Agent Management)
*   **EC-B.1:** API calls to fetch agent list or agent details fail.
    *   Display appropriate error messages.
    *   // TEST: Error messages are shown on API failure.
*   **EC-B.2:** Agent name or description is very long.
    *   UI should handle this gracefully (e.g., truncation with tooltip).
    *   // TEST: Long text is handled without breaking layout.
*   **EC-B.3:** Concurrent modifications to an agent (e.g., user edits while an automated process changes its status).
    *   The system should ideally show the most up-to-date information or provide a refresh mechanism. (Consider optimistic updates vs. refetching).
    *   // TEST: Stale data handling (e.g. refresh mechanism or notification).