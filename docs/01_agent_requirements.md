# Agent Entity and UI Modification Requirements

## 1. Overview

This document outlines the requirements for modifying the Agent entity and its associated settings UI. The goal is to enhance the configurability and functionality of Agents.

## 2. Functional Requirements

### 2.1. Agent Type Configuration (Settings UI)
    - FR2.1.1: The Agent settings UI MUST allow configuration of "Task Type".
        - Options for "Task Type" need to be defined (e.g., "Task", "Monitor", "Information Retrieval").
    - FR2.1.2: The Agent settings UI MUST allow configuration of "Action Type".
    - FR2.1.3: The "Action Type" field MUST only be available/editable if "Task Type" is set to "Task".
        - Options for "Action Type" need to be defined (e.g., "API Call", "Code Execution", "Notification").

### 2.2. Agent Interface Tab Modifications
    - FR2.2.1: The existing "Trigger Tab" within the Agent's interface MUST be renamed to "Task Tab".
    - FR2.2.2: A new "A2A Tab" (Agent-to-Agent) MUST be added to the Agent's interface.
    - FR2.2.3: The "A2A Tab" SHOULD provide functionality for managing connections to other agents (details to be specified).

### 2.3. Agent Settings UI Fields
    The Agent Settings UI MUST include the following fields:
    - FR2.3.1: **Icon**:
        - Input type: Circular image upload.
        - Validation: Max file size, allowed image formats (e.g., PNG, JPG).
    - FR2.3.2: **Name**:
        - Input type: Text input.
        - Validation: Required, max length.
    - FR2.3.3: **Description**:
        - Input type: Text area.
        - Validation: Max length.
    - FR2.3.4: **Type (Agent Type)**:
        - Input type: Dropdown/selection.
        - Content: Reflects the new Agent Type structure (Task Type, Action Type).
        - Behavior: Dynamically show/hide "Action Type" based on "Task Type" selection.
    - FR2.3.5: **System Prompt**:
        - Input type: Text area.
        - Validation: Max length.

## 3. Edge Cases

### 3.1. Agent Type Configuration
    - EC3.1.1: What happens if a user changes "Task Type" from "Task" to another type when an "Action Type" was already selected? (Expected: "Action Type" field becomes hidden/disabled, and its value might be cleared or retained but inactive).
    - EC3.1.2: Default values for "Task Type" and "Action Type" upon new agent creation.
    - EC3.1.3: How are existing agents handled after this change? (Migration strategy for "Type" field).

### 3.2. Agent Interface Tabs
    - EC3.2.1: Default state of the "A2A Tab" (e.g., empty list of connections).
    - EC3.2.2: Permissions for managing A2A connections.

### 3.3. Agent Settings UI Fields
    - EC3.3.1: Icon upload failure (e.g., network error, invalid file).
    - EC3.3.2: Handling of overly long text inputs for Name, Description, System Prompt if max length is exceeded on the client-side before server validation.
    - EC3.3.3: State of the form when an existing agent's settings are loaded.

## 4. Acceptance Criteria

### 4.1. Agent Type Configuration
    - AC4.1.1: User can select a "Task Type" from a predefined list.
    - AC4.1.2: If "Task Type" is "Task", user can select an "Action Type" from a predefined list.
    - AC4.1.3: If "Task Type" is not "Task", the "Action Type" field is not visible or is disabled.
    - AC4.1.4: Selected Agent Type configuration is saved correctly.

### 4.2. Agent Interface Tab Modifications
    - AC4.2.1: The tab previously labeled "Trigger Tab" is now labeled "Task Tab".
    - AC4.2.2: A new tab labeled "A2A Tab" is present in the Agent's interface.

### 4.3. Agent Settings UI Fields
    - AC4.3.1: User can upload a circular icon for the agent.
    - AC4.3.2: User can input/edit the agent's Name.
    - AC4.3.3: User can input/edit the agent's Description.
    - AC4.3.4: User can configure the agent's Type (Task Type and conditional Action Type).
    - AC4.3.5: User can input/edit the agent's System Prompt.
    - AC4.3.6: All settings are saved correctly upon submission.
    - AC4.3.7: Input validations (required fields, max lengths, file types) are enforced.

## 5. Non-Functional Requirements
    - NFR5.1: The UI changes should be responsive and user-friendly.
    - NFR5.2: Performance of the settings page should not be negatively impacted.

## 6. Constraints
    - C6.1: Changes should be compatible with the existing Next.js and TypeScript environment.
    - C6.2: Specific UI component libraries in use (if any) should be considered.

## 7. Out of Scope
    - OS7.1: Detailed implementation of the A2A connection management logic within the "A2A Tab". This phase focuses on adding the tab itself.
    - OS7.2: Definition of the full list of options for "Task Type" and "Action Type" (placeholders can be used initially).

## 8. Open Questions
    - OQ8.1: What are the predefined lists of options for "Task Type"? (e.g., "Task", "Monitor", "Data Collection", "Communication")
    - OQ8.2: What are the predefined lists of options for "Action Type" (when Task Type is "Task")? (e.g., "Execute Script", "Call API", "Send Email", "Generate Report")
    - OQ8.3: What is the migration plan for existing agents regarding the new "Type" structure? Will there be a default, or will users need to update them?
    - OQ8.4: What are the specific functionalities envisioned for the "A2A Tab" in its first iteration (beyond just being present)?