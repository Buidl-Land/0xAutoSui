# Page C: Create/Edit Agent - Functional Requirements

This page allows users to configure and save new agents or modify existing ones. It can be presented as a multi-step wizard or a single long-form page.

## 1. UI Text Translations (Chinese to English)

### 1.1. Common Header (Same as Dashboard)
*   (Standard header elements apply)

### 1.2. Page Title
*   `创建新 Agent / 编辑 Agent: [Agent名称]` -> `Create New Agent / Edit Agent: [Agent Name]`

### 1.3. Step 1: 基本信息 (Basic Information)
*   `Agent 名称: [_________________________] (必填)` -> `Agent Name: [_________________________] (Required)`
*   `Agent 描述: [_______________________________________________] (可选)` -> `Agent Description: [_______________________________________________] (Optional)`

### 1.4. Step 2: 触发器 (Trigger)
*   `[ ] 手动触发` -> `[ ] Manual Trigger`
*   `[X] 定时触发` -> `[X] Scheduled Trigger`
*   `频率: [下拉选择: 每小时/每日/每周/自定义Cron]` -> `Frequency: [Dropdown: Hourly/Daily/Weekly/Custom Cron]`
*   `时间: [时间选择器 / Cron表达式输入框]` -> `Time: [Time Picker / Cron Expression Input]`
*   `[ ] 事件驱动 (未来功能，如Solana链上事件、Webhook)` -> `[ ] Event-driven (Future feature, e.g., Solana on-chain events, Webhook)`

### 1.5. Step 3: 功能与依赖 (Core Logic - "直接指定依赖" - Direct Dependency Specification)
*   **A. 依赖的 MCPs (Model Context Protocols):** -> **A. Dependent MCPs (Model Context Protocols):**
    *   `[ + 添加 MCP ] (点击后弹出MCP市场/列表供选择)` -> `[ + Add MCP ] (Opens MCP Marketplace/List for selection)`
    *   `已添加:` -> `Added:`
    *   `MCP_1: Web2_NewsFetcher [配置参数] [移除]` -> `MCP_1: Web2_NewsFetcher [Configure Parameters] [Remove]`
    *   `参数: URL [solana.news/rss]` -> `Parameters: URL [solana.news/rss]`
    *   `MCP_2: TextSummarizer_最新模型 [配置参数] [移除]` -> `MCP_2: TextSummarizer_LatestModel [Configure Parameters] [Remove]`
    *   `参数: 长度 [200], 模型偏好 [默认/速度优先/质量优先]` -> `Parameters: Length [200], Model Preference [Default/Speed Priority/Quality Priority]`
    *   `*(注: MCPs按顺序执行或可定义简单数据流向)*` -> `*(Note: MCPs execute sequentially or a simple data flow can be defined)*`
*   **B. 依赖的其他 Agents (Agent2Agent Protocol):** -> **B. Dependent Agents (Agent2Agent Protocol):**
    *   `[ + 添加依赖Agent ] (点击后弹出用户自己的Agent列表或可搜索Agent)` -> `[ + Add Dependent Agent ] (Opens user's Agent list or searchable Agent list)`
    *   `已添加:` -> `Added:`
    *   `Agent_X: SolanaMarketSentiment [配置交互] [移除]` -> `Agent_X: SolanaMarketSentiment [Configure Interaction] [Remove]`
    *   `(如何将当前Agent的输出传递给依赖Agent，或如何使用其结果)` -> `(How to pass current Agent's output to dependent Agent, or how to use its results)`

### 1.6. Step 4: 输出与通知 (Output)
*   `[ + 添加输出方式 ] (例如: Telegram, Discord, Email, 写入链上数据MCP)` -> `[ + Add Output Method ] (e.g., Telegram, Discord, Email, Write to on-chain data MCP)`
*   `已添加:` -> `Added:`
*   `TelegramNotifier [配置参数] [移除]` -> `TelegramNotifier [Configure Parameters] [Remove]`
*   `参数: Channel ID [@my_sol_alerts], Message Template [{{summary}}]` -> `Parameters: Channel ID [@my_sol_alerts], Message Template [{{summary}}]`

### 1.7. Step 5: 资源与钱包 (Resources & Wallet)
*   `关联抽象钱包: [下拉选择: 主钱包 / 钱包A / 新建]` -> `Associated Abstract Wallet: [Dropdown: Main Wallet / Wallet A / Create New]`
*   `预计消耗: (根据MCP和频率估算SOL Gas/服务点数)` -> `Estimated Consumption: (Estimates SOL Gas/Service Credits based on MCPs and frequency)`
*   `[ ] 自动补充服务点数 (若钱包USDT余额充足且服务点数低于阈值)` -> `[ ] Auto-refill Service Credits (If wallet USDT balance is sufficient and service credits are below threshold)`
*   `[ ] 自动补充SOL (若钱包SOL余额低于Gas阈值，从绑定的EOA转入)` -> `[ ] Auto-refill SOL (If wallet SOL balance is below Gas threshold, transfer from linked EOA)`

### 1.8. Action Buttons
*   `[ 保存 Agent ]` -> `[ Save Agent ]`
*   `[ 取消 ]` -> `[ Cancel ]`
*   `[ 另存为模板 (可选) ]` -> `[ Save as Template (Optional) ]`

## 2. Functional Requirements

### 2.1. Page Mode (Create vs. Edit)
*   **FR-C.1.1:** The page title should dynamically change to "Create New Agent" or "Edit Agent: [Agent Name]" based on the context.
    *   // TEST: Title is "Create New Agent" for new agents.
    *   // TEST: Title is "Edit Agent: [Agent Name]" when editing an existing agent.
*   **FR-C.1.2:** If editing, form fields should be pre-populated with the existing agent's configuration.
    *   // TEST: Form fields are pre-populated correctly when editing.

### 2.2. Step 1: Basic Information
*   **FR-C.2.1:** Input field for `Agent Name`.
    *   This field is mandatory.
    *   // TEST: Agent Name input is present.
    *   // TEST: Validation: Agent Name cannot be empty.
    *   // TEST: Validation: Agent Name should be unique per user (server-side validation).
*   **FR-C.2.2:** Textarea for `Agent Description`.
    *   This field is optional.
    *   // TEST: Agent Description textarea is present.

### 2.3. Step 2: Trigger
*   **FR-C.3.1:** Allow selection of trigger type: `Manual Trigger`, `Scheduled Trigger`, `Event-driven` (event-driven marked as future).
    *   // TEST: All trigger type options are available.
    *   // TEST: Only one trigger type can be selected.
*   **FR-C.3.2:** If `Scheduled Trigger` is selected:
    *   Dropdown for `Frequency`: Hourly, Daily, Weekly, Custom Cron.
        *   // TEST: Frequency dropdown appears for scheduled trigger.
        *   // TEST: All frequency options are available.
    *   Input for `Time`:
        *   If Hourly/Daily/Weekly: A time picker (e.g., HH:MM).
            *   // TEST: Time picker is shown for standard frequencies.
        *   If Custom Cron: A text input for Cron expression.
            *   // TEST: Cron expression input is shown for custom cron.
            *   // TEST: Validation: Cron expression is valid if entered.
*   **FR-C.3.3:** If `Manual Trigger` is selected, no further configuration in this section is needed.
*   **FR-C.3.4:** `Event-driven` option is disabled or marked as "Coming Soon".
    *   // TEST: Event-driven option is appropriately indicated as unavailable.

### 2.4. Step 3: Core Logic - Dependent MCPs
*   **FR-C.4.1:** Button `[ + Add MCP ]` to add an MCP dependency.
    *   Clicking this button should open a modal or navigate to a view (MCP Hub/Marketplace) allowing the user to select an MCP.
    *   // TEST: "+ Add MCP" button is present.
    *   // TEST: Clicking "+ Add MCP" opens an MCP selection interface.
*   **FR-C.4.2:** Display a list of `Added` MCPs. Each item in the list should show:
    *   MCP Name (e.g., `Web2_NewsFetcher`).
    *   A `[Configure Parameters]` button/link. Clicking this opens a modal/form to configure parameters specific to that MCP (e.g., URL for `Web2_NewsFetcher`; Length, Model Preference for `TextSummarizer_LatestModel`).
        *   // TEST: Each added MCP shows its name.
        *   // TEST: "Configure Parameters" option is available for each MCP.
        *   // TEST: Clicking "Configure Parameters" allows setting MCP-specific params.
    *   A `[Remove]` button/icon to remove the MCP dependency.
        *   // TEST: "Remove" option is available and removes the MCP from the list.
*   **FR-C.4.3:** Allow reordering of MCPs if execution order matters (e.g., drag-and-drop).
    *   The note "MCPs execute sequentially or a simple data flow can be defined" implies this might be needed.
    *   // TEST: MCPs can be reordered if sequential execution is implied.
*   **FR-C.4.4:** When an MCP is added (e.g., `TextSummarizer_LatestModel`), its default parameters should be shown, and configurable.
    *   // TEST: Default parameters are shown for newly added MCPs.

### 2.5. Step 3: Core Logic - Dependent Agents (A2A)
*   **FR-C.5.1:** Button `[ + Add Dependent Agent ]` to add an agent dependency.
    *   Clicking this should open a modal/list of the user's own agents for selection.
    *   // TEST: "+ Add Dependent Agent" button is present.
    *   // TEST: Clicking it opens a list of user's agents.
*   **FR-C.5.2:** Display a list of `Added` dependent agents. Each item should show:
    *   Agent Name (e.g., `SolanaMarketSentiment`).
    *   A `[Configure Interaction]` button/link. This would define how the current agent interacts with the dependent agent (e.g., input/output mapping).
        *   // TEST: Each added dependent agent shows its name.
        *   // TEST: "Configure Interaction" option is available.
    *   A `[Remove]` button/icon.
        *   // TEST: "Remove" option removes the dependent agent.

### 2.6. Step 4: Output
*   **FR-C.6.1:** Button `[ + Add Output Method ]` to add an output action.
    *   Selection could be from a predefined list (Telegram, Discord, Email) or by selecting an output-capable MCP.
    *   // TEST: "+ Add Output Method" button is present.
    *   // TEST: Clicking it allows selection of an output method/provider.
*   **FR-C.6.2:** Display a list of `Added` output methods. Each item should show:
    *   Output Method/Provider Name (e.g., `TelegramNotifier`).
    *   A `[Configure Parameters]` button/link (e.g., Channel ID, Message Template for Telegram).
        *   // TEST: Each added output method shows its name.
        *   // TEST: "Configure Parameters" allows setting output-specific params.
    *   A `[Remove]` button/icon.
        *   // TEST: "Remove" option removes the output method.
*   **FR-C.6.3:** Message templates should support placeholders for agent outputs (e.g., `{{summary}}`).
    *   // TEST: Message templates allow dynamic placeholders.

### 2.7. Step 5: Resources & Wallet
*   **FR-C.7.1:** Dropdown to select an `Associated Abstract Wallet` from the user's existing wallets (e.g., Main Wallet, Wallet A) or an option to "Create New".
    *   // TEST: Wallet selection dropdown is present with user's wallets and "Create New" option.
    *   // TEST: Selecting "Create New" might navigate to wallet creation or open a modal.
*   **FR-C.7.2:** Display `Estimated Consumption` (SOL Gas / Service Credits). This should be dynamically calculated based on selected MCPs, their costs, and trigger frequency.
    *   // TEST: Estimated consumption is displayed.
    *   // TEST: Estimation updates dynamically as MCPs/frequency change.
*   **FR-C.7.3:** Checkbox for `Auto-refill Service Credits`.
    *   If checked, additional inputs for threshold and refill amount might appear.
    *   // TEST: Auto-refill service credits checkbox is present.
*   **FR-C.7.4:** Checkbox for `Auto-refill SOL`.
    *   If checked, additional inputs for threshold, refill amount, and linked EOA might appear.
    *   // TEST: Auto-refill SOL checkbox is present.

### 2.8. Action Buttons
*   **FR-C.8.1:** `[ Save Agent ]` button.
    *   Performs validation on all required fields.
    *   On success, saves the agent configuration (creates new or updates existing) and navigates to the Agent Detail page or Agent List page.
    *   // TEST: "Save Agent" button is present.
    *   // TEST: Clicking "Save Agent" performs validation.
    *   // TEST: On successful save, navigates to appropriate page.
    *   // TEST: Handles API errors during save.
*   **FR-C.8.2:** `[ Cancel ]` button.
    *   Discards changes and navigates away (e.g., back to Agent List or Dashboard).
    *   May prompt for confirmation if changes have been made.
    *   // TEST: "Cancel" button is present.
    *   // TEST: Clicking "Cancel" discards changes (with confirmation if needed) and navigates away.
*   **FR-C.8.3:** `[ Save as Template (Optional) ]` button.
    *   Allows saving the current configuration as a reusable agent template.
    *   // TEST: "Save as Template" button is present.
    *   // TEST: Clicking it allows saving the configuration as a template.

## 3. General Validations & Edge Cases
*   **EC-C.1:** Attempting to save without a required field (e.g., Agent Name).
    *   Display clear validation errors next to the respective fields.
    *   // TEST: Validation errors are shown for missing required fields.
*   **EC-C.2:** Invalid input format (e.g., incorrect Cron expression).
    *   Display specific error messages.
    *   // TEST: Validation errors for invalid formats (e.g., Cron).
*   **EC-C.3:** No MCPs or no Output methods configured.
    *   The system might allow this, or it might warn the user that the agent won't do much. Define behavior.
    *   // TEST: Behavior when saving agent with no MCPs/Outputs is as expected (warning or allowed).
*   **EC-C.4:** User selects an MCP that requires parameters but doesn't configure them.
    *   Validation should prevent saving or highlight missing configuration.
    *   // TEST: Validation for unconfigured mandatory MCP parameters.
*   **EC-C.5:** API errors during MCP/Agent list fetching for selection modals.
    *   Modals should display an error state.
    *   // TEST: Error states are handled in selection modals.