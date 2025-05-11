# Page C: Create/Edit Agent - Domain Models

This document outlines the data models relevant to the Create/Edit Agent page. It primarily leverages and ensures the completeness of models defined in `05_agent_management_domain_model.md`, particularly the `Agent` model and its embedded configuration structures.

## 1. Agent (Reference from `05_agent_management_domain_model.md`)
The core entity being created or edited. Key fields for this page include:
*   `agentId`: STRING (null if creating new)
*   `userId`: STRING
*   `name`: STRING
*   `description`: TEXT
*   `triggerType`: ENUM (`MANUAL`, `SCHEDULED`, `EVENT_DRIVEN`)
*   `triggerConfig`: JSON (structure depends on `triggerType`)
    *   **ScheduledTriggerConfig:**
        *   `frequency`: ENUM (`HOURLY`, `DAILY`, `WEEKLY`, `CUSTOM_CRON`)
        *   `timeValue`: STRING (e.g., "08:00" or cron string "0 8 * * *")
            *   // TEST: `timeValue` is valid for the given `frequency`.
    *   **ManualTriggerConfig:** (empty or null)
    *   **EventDrivenTriggerConfig:** (Future)
        *   `eventType`: STRING
        *   `eventSource`: STRING
        *   `filterConditions`: JSON
*   `config`: JSON
    *   `dependentMCPs`: ARRAY of `MCPDependency`
    *   `dependentAgents`: ARRAY of `AgentDependency`
    *   `outputActions`: ARRAY of `OutputAction`
*   `associatedWalletId`: STRING
*   `autoRefillServiceCredits`: BOOLEAN
*   `serviceCreditsRefillThreshold`: INTEGER (Optional, if `autoRefillServiceCredits` is true)
*   `serviceCreditsRefillAmount`: INTEGER (Optional, if `autoRefillServiceCredits` is true)
*   `autoRefillSol`: BOOLEAN
*   `solRefillThreshold`: DECIMAL (Optional, if `autoRefillSol` is true)
*   `solRefillAmount`: DECIMAL (Optional, if `autoRefillSol` is true)
*   `solRefillSourceEoa`: STRING (Optional, if `autoRefillSol` is true, address of EOA)
    *   // TEST: `solRefillSourceEoa` is a valid Solana address if provided.

## 2. MCPDependency (Reference from `05_agent_management_domain_model.md`)
Embedded within `Agent.config`.
*   `mcpId`: STRING
*   `mcpName`: STRING (Denormalized for display during configuration)
*   `order`: INTEGER
*   `parameters`: JSON (User-configured parameters for this MCP instance)
    *   // TEST: `parameters` JSON structure matches the schema defined by the `MCP` identified by `mcpId`.

## 3. AgentDependency (A2A - Reference from `05_agent_management_domain_model.md`)
Embedded within `Agent.config`.
*   `dependentAgentId`: STRING
*   `dependentAgentName`: STRING (Denormalized for display)
*   `interactionConfig`: JSON (Defines data flow, e.g., mapping outputs of dependent agent to inputs of current agent)

## 4. OutputAction (Reference from `05_agent_management_domain_model.md`)
Embedded within `Agent.config`.
*   `outputType`: STRING (e.g., "TELEGRAM_NOTIFIER")
*   `outputProviderId`: STRING (Optional, e.g., ID of a generic Webhook MCP)
*   `outputProviderName`: STRING (Denormalized for display)
*   `parameters`: JSON (e.g., `{ "channelId": "@...", "messageTemplate": "..." }`)
    *   // TEST: `parameters` JSON structure matches the schema for the `outputType` or `outputProviderId`.
    *   // TEST: `messageTemplate` allows valid placeholders.

## 5. Wallet (Reference from `02_dashboard_domain_model.md`)
Used for selection in "Associated Abstract Wallet".
*   `walletId`: STRING
*   `userId`: STRING
*   `walletName`: STRING (e.g., "Main Wallet", "Trading Wallet A") - *Added for user-friendly selection*
    *   // TEST: `walletName` is not empty if user-defined.
*   `solBalance`: DECIMAL
*   `usdtBalance`: DECIMAL
*   `serviceCredits`: INTEGER

## 6. MCP (Model Context Protocol - Referenced from MCP Hub context)
Needed for selection in the "[ + Add MCP ]" flow.
*   `mcpId`: STRING (Primary Key)
*   `name`: STRING (e.g., "Web2_NewsFetcher", "TextSummarizer_LatestModel")
*   `description`: TEXT
*   `type`: STRING (e.g., "DataSource", "Analysis", "Execution")
*   `provider`: STRING ("Official", "Third-Party")
*   `costPerCallPoints`: DECIMAL (Service points)
*   `costPerCallGas`: DECIMAL (SOL, if applicable)
*   `parameterSchema`: JSON (Defines the expected parameters and their types for configuration)
    *   // TEST: `parameterSchema` is valid JSON schema.
*   `category`: STRING (e.g., "Web2", "Solana", "AI", "DeFi")

## 7. AgentTemplate (New Model)
Represents a saved agent configuration that can be reused.

*   `templateId`: STRING (Primary Key)
*   `userId`: STRING (Foreign Key, references User.userId, if templates are user-specific)
    *   OR `isPublic`: BOOLEAN (If templates can be shared)
*   `templateName`: STRING
    *   // TEST: `templateName` is not empty.
*   `description`: TEXT (Optional)
*   `triggerType`: ENUM
*   `triggerConfig`: JSON
*   `agentLogicConfig`: JSON (Contains `dependentMCPs`, `dependentAgents`, `outputActions` structures, similar to `Agent.config` but without instance-specific IDs like `associatedWalletId`)
*   `estimatedConsumption`: JSON (Optional, stores typical SOL/Service Credit estimates for the template)
*   `createdAt`: DATETIME
*   `updatedAt`: DATETIME

## Key Considerations for Create/Edit Page:
*   **Dynamic Forms:** The parameters for MCPs and OutputActions will need to be dynamically rendered based on the selected MCP/Output type and its `parameterSchema`.
*   **Validation:** Extensive client-side and server-side validation will be needed for all inputs, especially for parameter configurations against their schemas.
*   **State Management:** The form will manage a complex state object representing the agent being configured.
*   **MCP/Agent Selection:** Modals or separate views for selecting MCPs and dependent agents will need to fetch and display lists of available items.

These models provide the data structures necessary for the agent creation and editing workflow.