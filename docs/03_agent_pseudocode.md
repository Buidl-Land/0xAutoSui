# Agent Module Pseudocode

## 1. Data Structures

### 1.1. AgentType

```typescript
// Path: src/types/agent.ts (or a new file like src/types/agentV2.ts)

enum TaskTypeOption {
  TASK = "Task",
  CHAT = "Chat",
  // ... other task types
}

enum ActionTypeOption { // Only applicable if TaskType is TASK
  CODE_EXECUTION = "CodeExecution",
  API_CALL = "ApiCall",
  // ... other action types
}

interface AgentType {
  taskType: TaskTypeOption;
  actionType?: ActionTypeOption; // Optional, only relevant if taskType is 'Task'
}

// TEST: AgentType allows valid TaskTypeOption values
// TEST: AgentType allows valid ActionTypeOption values when taskType is TASK
// TEST: AgentType actionType is undefined or null if taskType is not TASK
```

### 1.2. Agent Entity (Updated)

```typescript
// Path: src/types/agent.ts (or relevant existing agent type file)

interface Agent {
  id: string;
  name: string;
  description: string;
  iconUrl?: string; // URL to the uploaded circular icon
  systemPrompt: string;
  agentType: AgentType; // New structured type
  // ... other existing agent properties
  a2aConnections: AgentConnection[]; // For A2A Tab
}

interface AgentConnection {
  connectedAgentId: string;
  connectionType: string; // e.g., "data_source", "action_provider"
  // ... other connection properties
}

// TEST: Agent entity includes all required fields: id, name, description, systemPrompt, agentType
// TEST: Agent entity iconUrl is optional
// TEST: Agent entity a2aConnections is an array of AgentConnection
```

## 2. Agent Settings UI (`src/app/(dashboard)/agents/[agentId]/page.tsx` or a dedicated settings component)

### 2.1. AgentSettingsForm Component

```pseudocode
// Component: AgentSettingsForm
// Props: agent (Agent object), onSave (function)

FUNCTION AgentSettingsForm(agent, onSave):
  INITIALIZE formState with agent data (name, description, iconUrl, systemPrompt, agentType.taskType, agentType.actionType)
  INITIALIZE selectedIconFile = null

  // TEST: AgentSettingsForm initializes with existing agent data
  // TEST: AgentSettingsForm handles new agent creation with default/empty values

  RENDER:
    FORM onSubmit = handleSave:
      // Section: Basic Info
      FIELDSET "Basic Information":
        FileUploadInput for Icon:
          LABEL "Agent Icon"
          INPUT type="file" accept="image/*" onChange=handleIconUpload
          DISPLAY current icon (formState.iconUrl or preview of selectedIconFile)
          // TEST: Icon upload accepts image files
          // TEST: Icon upload displays preview of selected image
          // TEST: Icon upload updates formState.iconUrl upon successful upload (simulated or actual)

        TextInput for Name:
          LABEL "Agent Name"
          VALUE formState.name
          onChange = update formState.name
          VALIDATION: required, minLength, maxLength
          // TEST: Name input updates formState.name
          // TEST: Name input shows validation error for empty value
          // TEST: Name input shows validation error for too short/long value

        TextareaInput for Description:
          LABEL "Description"
          VALUE formState.description
          onChange = update formState.description
          VALIDATION: maxLength
          // TEST: Description input updates formState.description

      // Section: Agent Behavior
      FIELDSET "Agent Behavior":
        SelectInput for Task Type:
          LABEL "Task Type"
          OPTIONS TaskTypeOption (TASK, CHAT, etc.)
          VALUE formState.agentType.taskType
          onChange = handleTaskTypeChange
          // TEST: Task Type select updates formState.agentType.taskType
          // TEST: Task Type select defaults to agent's current taskType

        IF formState.agentType.taskType IS TaskTypeOption.TASK:
          SelectInput for Action Type:
            LABEL "Action Type"
            OPTIONS ActionTypeOption (CODE_EXECUTION, API_CALL, etc.)
            VALUE formState.agentType.actionType
            onChange = update formState.agentType.actionType
            // TEST: Action Type select is visible when Task Type is "Task"
            // TEST: Action Type select updates formState.agentType.actionType
            // TEST: Action Type select defaults to agent's current actionType if applicable
        ELSE:
          // Action Type is hidden or disabled
          // TEST: Action Type select is hidden or disabled when Task Type is not "Task"

        TextareaInput for System Prompt:
          LABEL "System Prompt"
          VALUE formState.systemPrompt
          onChange = update formState.systemPrompt
          VALIDATION: required
          // TEST: System Prompt input updates formState.systemPrompt
          // TEST: System Prompt input shows validation error for empty value

      Button "Save Changes" type="submit"
      // TEST: Save button is present

  FUNCTION handleIconUpload(event):
    SET selectedIconFile = event.target.files[0]
    // Optional: Generate a local preview URL for selectedIconFile
    // In a real scenario, this would trigger an upload to a service and update formState.iconUrl
    // For pseudocode, we can assume formState.iconUrl is updated after a simulated upload
    // TEST: handleIconUpload updates selectedIconFile

  FUNCTION handleTaskTypeChange(selectedValue):
    UPDATE formState.agentType.taskType = selectedValue
    IF selectedValue IS NOT TaskTypeOption.TASK:
      UPDATE formState.agentType.actionType = null // or undefined
    // TEST: handleTaskTypeChange updates taskType in formState
    // TEST: handleTaskTypeChange resets actionType if taskType is not "Task"

  FUNCTION handleSave(event):
    PREVENT default form submission
    VALIDATE formState
    // TEST: handleSave validates form data before proceeding
    IF form is valid:
      // Prepare data for saving, potentially uploading icon if selectedIconFile exists
      LET updatedAgentData = {
        name: formState.name,
        description: formState.description,
        iconUrl: formState.iconUrl, // This would be the URL from the uploaded icon
        systemPrompt: formState.systemPrompt,
        agentType: {
          taskType: formState.agentType.taskType,
          actionType: formState.agentType.taskType === TaskTypeOption.TASK ? formState.agentType.actionType : undefined
        }
      }
      CALL onSave(updatedAgentData)
      // TEST: handleSave calls onSave with correctly structured updatedAgentData
    ELSE:
      DISPLAY validation errors
      // TEST: handleSave displays validation errors if form is invalid
END FUNCTION
```

## 3. Agent Page UI (`src/app/(dashboard)/agents/[agentId]/page.tsx`)

### 3.1. Tab Structure

```pseudocode
// Component: AgentDetailPage
// Props: agentId

FUNCTION AgentDetailPage({ agentId }):
  FETCH agent data for agentId
  INITIALIZE activeTab = "Settings" // or "Task" as new default

  // TEST: AgentDetailPage fetches agent data on load
  // TEST: AgentDetailPage initializes with a default active tab

  RENDER:
    PageHeader with Agent Name (agent.name)
    TabContainer:
      TabButton "Settings" onClick = setActiveTab("Settings")
      TabButton "Task" onClick = setActiveTab("Task") // Renamed from "Trigger"
      TabButton "A2A" onClick = setActiveTab("A2A")   // New Tab
      // TEST: "Settings" tab is present
      // TEST: "Task" tab is present (renamed from Trigger)
      // TEST: "A2A" tab is present

    TabContent:
      IF activeTab IS "Settings":
        DISPLAY AgentSettingsForm with agent data
        // TEST: AgentSettingsForm is displayed when "Settings" tab is active
      ELSE IF activeTab IS "Task":
        DISPLAY TaskManagementComponent (previously TriggerManagementComponent)
        // TEST: TaskManagementComponent is displayed when "Task" tab is active
      ELSE IF activeTab IS "A2A":
        DISPLAY A2AConnectionsComponent with agent.a2aConnections
        // TEST: A2AConnectionsComponent is displayed when "A2A" tab is active
END FUNCTION
```

### 3.2. A2A Connections Component (New)

```pseudocode
// Component: A2AConnectionsComponent
// Props: connections (AgentConnection[])

FUNCTION A2AConnectionsComponent({ connections }):
  // TEST: A2AConnectionsComponent receives connections prop

  RENDER:
    SectionHeader "Agent-to-Agent Connections"
    Button "Add New Connection" onClick = openAddConnectionModal
    // TEST: "Add New Connection" button is present

    IF connections IS EMPTY:
      DISPLAY "No A2A connections configured."
      // TEST: Displays "No connections" message when connections array is empty
    ELSE:
      Table or List of connections:
        FOR EACH connection IN connections:
          DISPLAY connection.connectedAgentId
          DISPLAY connection.connectionType
          Button "Edit" onClick = openEditConnectionModal(connection)
          Button "Remove" onClick = handleRemoveConnection(connection.id)
          // TEST: Displays details for each connection
          // TEST: "Edit" button is present for each connection
          // TEST: "Remove" button is present for each connection

    IF isAddConnectionModalOpen:
      DISPLAY AddA2AConnectionModal onClose = closeAddConnectionModal onSave = handleAddConnection
      // TEST: AddA2AConnectionModal is displayed when isAddConnectionModalOpen is true

    IF isEditConnectionModalOpen:
      DISPLAY EditA2AConnectionModal connectionData=selectedConnection onClose = closeEditConnectionModal onSave = handleUpdateConnection
      // TEST: EditA2AConnectionModal is displayed when isEditConnectionModalOpen is true

  FUNCTION handleAddConnection(newConnectionData):
    // Logic to save the new A2A connection
    // CALL API to add connection
    // REFETCH agent data or update local state
    // TEST: handleAddConnection calls API to save new connection

  FUNCTION handleUpdateConnection(updatedConnectionData):
    // Logic to update an existing A2A connection
    // CALL API to update connection
    // REFETCH agent data or update local state
    // TEST: handleUpdateConnection calls API to update connection

  FUNCTION handleRemoveConnection(connectionId):
    // Logic to remove an A2A connection
    // CONFIRM removal
    // CALL API to remove connection
    // REFETCH agent data or update local state
    // TEST: handleRemoveConnection calls API to remove connection after confirmation
END FUNCTION
```

## 4. User Settings Page Modifications (`src/app/(dashboard)/setting/page.tsx`)

### 4.1. MockUser Renaming and Avatar

*   **Action**: Manually (or through a script if applicable) rename `MockUser` to `Trump`.
*   **Action**: Add an avatar image for `Trump` (e.g., `public/avatars/trump.png`).
    *   This implies the User entity/type should have an `avatarUrl` field.

### 4.2. User Entity (Updated)

```typescript
// Path: src/types/user.ts (or relevant user type file)

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // URL to the user's avatar
  // ... other existing user properties
  // REMOVE systemPrompt (if it existed here)
  // REMOVE appearanceSettings (if they existed here)
}

// TEST: User entity includes avatarUrl
// TEST: User entity does NOT include systemPrompt
// TEST: User entity does NOT include appearanceSettings
```

### 4.3. UserSettingsPage Component

```pseudocode
// Component: UserSettingsPage
// Path: src/app/(dashboard)/setting/page.tsx

FUNCTION UserSettingsPage:
  FETCH current user data (e.g., `currentUser`)
  INITIALIZE formState with currentUser data (name, avatarUrl)
  INITIALIZE selectedAvatarFile = null

  // TEST: UserSettingsPage fetches current user data
  // TEST: UserSettingsPage initializes formState with user data

  RENDER:
    PageHeader "User Settings"

    FORM onSubmit = handleSaveUserSettings:
      FIELDSET "Profile Information":
        FileUploadInput for Avatar:
          LABEL "Profile Picture"
          INPUT type="file" accept="image/*" onChange=handleAvatarUpload
          DISPLAY current avatar (formState.avatarUrl or preview of selectedAvatarFile)
          // TEST: Avatar upload displays current user avatar
          // TEST: Avatar upload allows new image selection
          // TEST: Avatar upload updates preview

        TextInput for Username:
          LABEL "Username"
          VALUE formState.name
          onChange = update formState.name
          VALIDATION: required
          // TEST: Username input updates formState.name
          // TEST: Username input shows validation error for empty value

      // REMOVE System Prompt section
      // TEST: System Prompt section is NOT rendered on user settings page

      // REMOVE Appearance section
      // TEST: Appearance section is NOT rendered on user settings page

      Button "Save Profile" type="submit"
      // TEST: "Save Profile" button is present

  FUNCTION handleAvatarUpload(event):
    SET selectedAvatarFile = event.target.files[0]
    // Optional: Generate a local preview URL
    // In a real scenario, this would trigger an upload and update formState.avatarUrl
    // TEST: handleAvatarUpload updates selectedAvatarFile

  FUNCTION handleSaveUserSettings(event):
    PREVENT default form submission
    VALIDATE formState
    // TEST: handleSaveUserSettings validates form data
    IF form is valid:
      // Prepare data, potentially uploading avatar if selectedAvatarFile exists
      LET updatedUserData = {
        name: formState.name,
        avatarUrl: formState.avatarUrl // URL from uploaded avatar
      }
      CALL apiToUpdateUser(updatedUserData)
      // DISPLAY success message
      // TEST: handleSaveUserSettings calls API with updatedUserData
    ELSE:
      DISPLAY validation errors
      // TEST: handleSaveUserSettings displays validation errors
END FUNCTION