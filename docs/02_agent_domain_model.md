# Agent Domain Model

## 1. Entities

### 1.1. Agent

Represents an autonomous entity capable of performing tasks or actions.

**Attributes:**

*   `id`: STRING (Unique identifier, e.g., UUID) - Primary Key
*   `name`: STRING (User-defined name for the agent)
    *   Constraints: Required, Max length (e.g., 100 chars)
*   `description`: TEXT (Detailed description of the agent's purpose)
    *   Constraints: Max length (e.g., 500 chars)
*   `iconUrl`: STRING (URL or path to the agent's icon)
    *   Constraints: Valid URL or file path, image format (PNG, JPG)
*   `agentType`: AgentType (Complex type defining the agent's operational mode) - See section 1.2
*   `systemPrompt`: TEXT (Base instructions or context for the agent's behavior)
    *   Constraints: Max length (e.g., 2000 chars)
*   `createdAt`: DATETIME (Timestamp of creation)
*   `updatedAt`: DATETIME (Timestamp of last update)
*   `ownerId`: STRING (Identifier of the user/entity that owns this agent)

**Relationships:**

*   One-to-Many: An Agent can have multiple `AgentConnection`s (for A2A communication).
*   (Implicit) Many-to-One: Multiple Agents belong to one User (owner).

### 1.2. AgentType (Complex Type / Value Object)

Defines the specific configuration for an Agent's behavior. This is not a separate table but a structured type within the Agent entity.

**Attributes:**

*   `taskType`: ENUM (Defines the primary category of tasks the agent performs)
    *   Possible Values: (To be defined, e.g., "TASK_ORIENTED", "MONITORING", "INFORMATION_RETRIEVAL", "COMMUNICATION")
    *   Default: (To be defined, e.g., "TASK_ORIENTED")
*   `actionType`: ENUM (Defines the specific action an agent takes, applicable if `taskType` is "TASK_ORIENTED" or similar)
    *   Possible Values: (To be defined, e.g., "API_CALL", "CODE_EXECUTION", "NOTIFICATION", "SEND_EMAIL")
    *   Constraints: Only applicable/set if `taskType` requires it.
    *   Default: (To be defined, e.g., "API_CALL" if `taskType` is "TASK_ORIENTED")

### 1.3. AgentConnection (for A2A Tab)

Represents a configured link from one agent to another for Agent-to-Agent communication.

**Attributes:**

*   `id`: STRING (Unique identifier for the connection) - Primary Key
*   `sourceAgentId`: STRING (ID of the agent initiating/owning the connection) - Foreign Key to Agent.id
*   `targetAgentId`: STRING (ID of the agent being connected to) - Foreign Key to Agent.id
*   `connectionType`: ENUM (Defines the nature of the connection, e.g., "DATA_SHARE", "TASK_DELEGATION") - (To be further defined)
*   `status`: ENUM (e.g., "PENDING", "ACTIVE", "INACTIVE", "ERRORED")
*   `configuration`: JSON (Specific settings for this connection, if any)
*   `createdAt`: DATETIME
*   `updatedAt`: DATETIME

**Relationships:**

*   Many-to-One: Multiple `AgentConnection`s can belong to one `sourceAgentId` (Agent).
*   Many-to-One: Multiple `AgentConnection`s can point to one `targetAgentId` (Agent).


## 2. Enums (Potential Values - needs finalization from Open Questions in Requirements)

### 2.1. `TaskTypeEnum` (for `AgentType.taskType`)
    - `TASK_ORIENTED` (Indicates the agent performs specific, actionable tasks)
    - `MONITORING` (Indicates the agent observes data or systems)
    - `INFORMATION_RETRIEVAL` (Indicates the agent fetches or queries data)
    - `COMMUNICATION` (Indicates the agent facilitates communication)
    - `GENERAL_ASSISTANCE`

### 2.2. `ActionTypeEnum` (for `AgentType.actionType`)
    - `API_CALL`
    - `CODE_EXECUTION`
    - `NOTIFICATION_USER`
    - `SEND_EMAIL`
    - `DATABASE_QUERY`
    - `FILE_MANIPULATION`

### 2.3. `AgentConnectionStatusEnum`
    - `PENDING_APPROVAL`
    - `ACTIVE`
    - `DISABLED_BY_SOURCE`
    - `DISABLED_BY_TARGET`
    - `ERRORED_CONFIGURATION`

### 2.4. `AgentConnectionTypeEnum`
    - `DATA_EXCHANGE` (For sharing information)
    - `TASK_DELEGATION` (For assigning sub-tasks)
    - `NOTIFICATION_RELAY` (For passing notifications)

## 3. Data Structures (Illustrative for UI/API Payloads)

### 3.1. AgentSettingsPayload (for UI form submission)

```json
{
  "name": "My Awesome Agent",
  "description": "This agent does awesome things.",
  "iconFile": "(File Object or reference to uploaded file)",
  "agentType": {
    "taskType": "TASK_ORIENTED", // Value from TaskTypeEnum
    "actionType": "API_CALL"    // Value from ActionTypeEnum, present if taskType requires
  },
  "systemPrompt": "You are a helpful assistant designed to..."
}
```

## 4. Key Considerations

*   **Extensibility**: The `AgentType` structure and associated enums should be designed for future expansion.
*   **Validation**: Robust validation rules are needed at both the entity level and for UI inputs.
*   **Migration**: A clear strategy for migrating existing `Agent` entities to accommodate the new `agentType` structure is crucial. This might involve setting default `taskType` and `actionType` for existing agents.
*   **A2A Tab Scope**: The initial domain model for `AgentConnection` supports the A2A tab's existence. Further details on its functionality will refine this model.