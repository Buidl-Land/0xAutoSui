# Page B: Agent Management - Domain Models

This document outlines the data models relevant to the Agent Management (List and Detail) pages. It builds upon and refines models introduced in `02_dashboard_domain_model.md`.

## 1. Agent (Refined)
Represents an autonomous agent created by the user.

*   `agentId`: STRING (Primary Key, Unique identifier)
*   `userId`: STRING (Foreign Key, references User.userId)
*   `name`: STRING (e.g., "SolanaNewsAggregator")
    *   // TEST: Agent name is not empty and is unique per user.
*   `description`: TEXT (Optional, detailed description)
*   `status`: ENUM (`RUNNING`, `PAUSED`, `SCHEDULED`, `ERROR`, `IDLE`, `STOPPED`, `PENDING_CREATION`)
    *   // TEST: Status is one of the allowed enum values.
*   `triggerType`: ENUM (`MANUAL`, `SCHEDULED`, `EVENT_DRIVEN`)
    *   // TEST: Trigger type is one of the allowed enum values.
*   `triggerConfig`: JSON (Stores configuration for the trigger, e.g., cron expression for `SCHEDULED`, event details for `EVENT_DRIVEN`)
    *   // TEST: triggerConfig is valid JSON and matches triggerType schema.
*   `nextRunAt`: DATETIME (Optional, calculated for scheduled agents)
*   `lastRunAt`: DATETIME (Optional, timestamp of the last execution start)
*   `lastRunStatus`: ENUM (`SUCCESS`, `FAILURE`, `IN_PROGRESS`) (Optional)
*   `config`: JSON (Agent-specific core logic configuration, including dependencies and outputs)
    *   `dependentMCPs`: ARRAY of `MCPDependency` objects
    *   `dependentAgents`: ARRAY of `AgentDependency` objects
    *   `outputActions`: ARRAY of `OutputAction` objects
*   `associatedWalletId`: STRING (Foreign Key, references Wallet.walletId)
    *   // TEST: associatedWalletId refers to an existing wallet.
*   `createdAt`: DATETIME
*   `updatedAt`: DATETIME
*   `isDeleted`: BOOLEAN (For soft deletes)

## 2. Trigger (Conceptual, details stored in Agent.triggerConfig)
Defines what initiates an agent's execution.

*   **For `SCHEDULED` type:**
    *   `frequency`: ENUM (`HOURLY`, `DAILY`, `WEEKLY`, `CUSTOM_CRON`)
    *   `time`: STRING (e.g., "08:00" for daily, cron expression for `CUSTOM_CRON`)
        *   // TEST: Valid time format or cron expression.
*   **For `EVENT_DRIVEN` type (Future):**
    *   `source`: STRING (e.g., "SOLANA_CHAIN_EVENT", "WEBHOOK")
    *   `eventDetails`: JSON (Specific event parameters to listen for)

## 3. MCPDependency (Part of Agent.config)
Defines an MCP that the agent depends on.

*   `mcpId`: STRING (Foreign Key, references MCP.mcpId)
    *   // TEST: mcpId refers to an existing MCP.
*   `mcpName`: STRING (e.g., "Web2_NewsFetcher", "TextSummarizer_最新模型") (For display, denormalized)
*   `order`: INTEGER (Execution order if sequential)
*   `parameters`: JSON (Specific parameters for this MCP instance, e.g., `{ "url": "solana.news/rss" }`, `{ "length": 200 }`)
    *   // TEST: Parameters are valid for the specified MCP.

## 4. AgentDependency (A2A - Part of Agent.config)
Defines another agent that this agent depends on.

*   `dependentAgentId`: STRING (Foreign Key, references Agent.agentId)
    *   // TEST: dependentAgentId refers to an existing agent of the same user.
*   `dependentAgentName`: STRING (For display, denormalized)
*   `interactionConfig`: JSON (Defines how data is passed or how this agent uses the dependent agent's output/service)
    *   // TEST: interactionConfig is valid.

## 5. OutputAction (Part of Agent.config)
Defines how an agent outputs its results or sends notifications.

*   `outputType`: STRING (e.g., "TELEGRAM_NOTIFIER", "DISCORD_WEBHOOK", "EMAIL_SENDER", "WRITE_TO_CHAIN_MCP")
*   `outputProviderId`: STRING (Optional, could be an MCP ID if the output is via an MCP, e.g. a generic Webhook MCP)
*   `outputProviderName`: STRING (e.g., "TelegramNotifier") (For display)
*   `parameters`: JSON (Specific parameters for this output action, e.g., `{ "channelId": "@my_sol_channel", "messageTemplate": "{{summary}}" }`)
    *   // TEST: Parameters are valid for the specified output type/provider.

## 6. AgentRunLog (Supersedes/Refines AgentActivityLog for this context)
Represents a detailed log entry for a specific run or significant event of an Agent.

*   `logId`: STRING (Primary Key, Unique identifier)
*   `agentId`: STRING (Foreign Key, references Agent.agentId)
*   `runId`: STRING (Optional, groups logs from the same execution run)
*   `timestamp`: DATETIME (When the log event occurred)
*   `level`: ENUM (`INFO`, `WARNING`, `ERROR`, `DEBUG`, `CRITICAL`)
    *   // TEST: Log level is one of the allowed enum values.
*   `message`: TEXT (The log message, e.g., "Task completed, summary sent.")
    *   // TEST: Log message is not empty.
*   `details`: JSON (Optional, additional structured data for the log entry)

## 7. Wallet (Reference from `02_dashboard_domain_model.md`)
*   `walletId`: STRING
*   `userId`: STRING
*   `solBalance`: DECIMAL
*   ... (other fields remain the same)

## Relationships:
*   An `Agent` has one `Trigger` configuration (embedded or referenced).
*   An `Agent` can have multiple `MCPDependency` entries (embedded in `config`).
*   An `Agent` can have multiple `AgentDependency` entries (embedded in `config`).
*   An `Agent` can have multiple `OutputAction` entries (embedded in `config`).
*   An `Agent` is associated with one `Wallet`.
*   An `Agent` can have many `AgentRunLog` entries.

These models provide the necessary structure for managing and displaying agent information, including their detailed configurations and operational logs.