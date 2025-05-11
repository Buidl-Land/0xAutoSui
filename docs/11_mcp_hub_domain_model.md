# Page D: MCP Hub - Domain Models

This document outlines the data model for Model Context Protocols (MCPs) as displayed and managed in the MCP Hub.

## 1. MCP (Model Context Protocol)
Represents a discoverable and usable module/service that an Agent can depend on.

*   `mcpId`: STRING (Primary Key, Unique identifier, e.g., "web2-solana-news-fetcher-v1")
*   `name`: STRING (User-friendly display name, e.g., "Web2_SolanaNewsFetcher", "TextSummarizer_LatestModel")
    *   // TEST: Name is not empty.
*   `provider`: STRING (Indicates the origin, e.g., "Official", "Third-Party Partner X", "Community Contributor Y")
    *   // TEST: Provider is not empty.
*   `version`: STRING (e.g., "1.0.2", "latest")
    *   // TEST: Version string follows a consistent format.
*   `description`: TEXT (Detailed explanation of what the MCP does, its inputs, outputs, and use cases)
    *   // TEST: Description provides sufficient detail.
*   `categories`: ARRAY of STRING (Tags for filtering and discovery, e.g., ["Data Source", "Web2", "Solana", "AI", "DeFi", "Execution", "DePIN"])
    *   // TEST: Categories array is not empty.
*   `type`: ENUM (`DATA_SOURCE`, `ANALYSIS`, `EXECUTION`, `UTILITY`) (A primary classification)
    *   // TEST: Type is one of the allowed enum values.
*   `costStructure`: OBJECT
    *   `model`: ENUM (`FREE`, `PER_CALL`, `PER_UNIT`, `SUBSCRIPTION_TIERED`)
        *   // TEST: Cost model is one of the allowed enum values.
    *   `serviceCreditsPerCall`: DECIMAL (Optional, if `model` is `PER_CALL` or `PER_UNIT`)
    *   `serviceCreditsPerUnitDescription`: STRING (Optional, e.g., "per 1k tokens", "per monitoring unit", "per query")
    *   `solGasFeeEstimate`: DECIMAL (Optional, estimated SOL gas if MCP interacts with Solana blockchain)
    *   `currency`: STRING (e.g., "SERVICE_CREDITS", "USDT", "SOL") - *Indicates if cost is directly in a crypto or via service credits.*
    *   `usdtPriceForCredits`: DECIMAL (Optional, if service credits have a direct USDT peg for display, e.g., 0.1 credits/1k tokens (USDT denominated) implies a link)
    *   `notes`: TEXT (Optional, e.g., "SOL Gas fee is variable.", "Bulk discounts available.")
*   `parameterSchema`: JSON (JSON Schema defining the configurable parameters for this MCP, their types, required fields, default values, descriptions, e.g. for `TextSummarizer_LatestModel`: `{"length": {"type": "integer", "default": 200}, "modelPreference": {"type": "string", "enum": ["Default", "Speed Priority", "Quality Priority"]}}`)
    *   // TEST: `parameterSchema` is a valid JSON Schema object.
*   `inputSchema`: JSON (JSON Schema defining the expected input data structure for the MCP, if applicable)
*   `outputSchema`: JSON (JSON Schema defining the output data structure of the MCP)
*   `documentationUrl`: STRING (Optional, link to more detailed external documentation)
*   `iconUrl`: STRING (Optional, URL for a visual icon representing the MCP)
*   `popularityScore`: INTEGER (Optional, for sorting by popularity)
*   `averageRating`: DECIMAL (Optional, 0-5, if user ratings are implemented)
*   `addedAt`: DATETIME (Timestamp when the MCP was added to the hub)
*   `updatedAt`: DATETIME (Timestamp of the last update to the MCP definition)
*   `status`: ENUM (`ACTIVE`, `DEPRECATED`, `EXPERIMENTAL`, `PRIVATE`)
    *   // TEST: Status is one of the allowed enum values.
*   `isOfficial`: BOOLEAN (Derived from `provider` or a direct flag)

## 2. UserIntegratedMCP (Join Table / Denormalized List)
Represents MCPs a specific user has integrated into one or more of their agents. This could be a separate entity or denormalized into a user's profile for quick access in a sidebar.

*   `userId`: STRING (Foreign Key)
*   `mcpId`: STRING (Foreign Key)
*   `firstUsedAt`: DATETIME
*   `lastUsedAt`: DATETIME
*   `usageCount`: INTEGER

## Relationships:
*   An `Agent` (via `MCPDependency` in its config) refers to one `MCP`.
*   Many `Agent`s can use the same `MCP`.

This model for `MCP` is designed to be comprehensive enough to support the display, filtering, sorting, and configuration needs of the MCP Hub and Agent Configuration pages.