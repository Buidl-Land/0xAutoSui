# Page C: Create/Edit Agent - Pseudocode

This document provides high-level pseudocode for the Create/Edit Agent page.

## 1. Main Agent Configuration Page (`AgentConfigPage`)

```pseudocode
COMPONENT AgentConfigPage
  PROPS:
    agentId: STRING (nullable, from route parameter if editing)

  STATE:
    isEditMode: BOOLEAN (true if agentId is provided)
    pageTitle: STRING
    formData: Agent_Object_Structure // Mirrors Agent model, initialized empty or with fetched data
    availableMCPs: List_of_MCP_Objects (for selection modal)
    availableUserAgents: List_of_Agent_Summary_Objects (for A2A selection modal)
    availableWallets: List_of_Wallet_Summary_Objects
    isLoading: BOOLEAN (true if isEditMode, false otherwise)
    isSaving: BOOLEAN (false by default)
    error: STRING (nullable)
    validationErrors: Object (keyed by field name)
    showMCPSelectionModal: BOOLEAN (false)
    showAgentSelectionModal: BOOLEAN (false)
    showMCPConfigModal: BOOLEAN (false)
    mcpToConfigure: MCPDependency_Object (nullable)
    // ... other modal states for output config, A2A config etc.

  ON_INIT:
    // TEST: ON_INIT correctly sets up for create or edit mode.
    IF agentId IS NOT NULL THEN
      SET isEditMode = true
      SET pageTitle = "Edit Agent" // Will be updated with name after fetch
      CALL loadAgentForEditing(agentId)
    ELSE
      SET isEditMode = false
      SET pageTitle = "Create New Agent"
      SET formData = INITIALIZE_EMPTY_AGENT_FORM_DATA()
      // TEST: formData is initialized correctly for new agent.
    END IF
    CALL fetchSupportingData() // Fetch MCPs, user's wallets, etc.
  END FUNCTION

  FUNCTION loadAgentForEditing(id: STRING):
    SET isLoading = true
    TRY
      fetchedAgent = CALL fetchAgentByIdAPI(id) // API
      // TEST: fetchAgentByIdAPI returns correct agent data.
      SET formData = MAP_API_AGENT_TO_FORM_DATA(fetchedAgent)
      SET pageTitle = `Edit Agent: ${formData.name}`
      // TEST: formData is populated correctly from fetched agent.
    CATCH exception
      SET error = "Failed to load agent for editing."
      // TEST: Error is set if fetching agent fails.
    FINALLY
      SET isLoading = false
    END TRY
  END FUNCTION

  FUNCTION fetchSupportingData():
    // Fetch availableMCPs, availableUserAgents, availableWallets via API calls
    // TEST: Supporting data (MCPs, wallets) is fetched successfully.
    // Example: availableWallets = CALL fetchUserWalletsAPI()
  END FUNCTION

  FUNCTION handleInputChange(section: STRING, field: STRING, value: ANY, index: INTEGER_OR_NULL):
    // Updates formData state immutably
    // e.g., formData.basicInfo.name = value
    // e.g., formData.config.dependentMCPs[index].parameters.url = value
    // TEST: handleInputChange updates the correct part of formData.
    // After certain changes (e.g., MCPs, frequency), CALL calculateEstimatedConsumption()
  END FUNCTION

  FUNCTION handleAddMCP():
    // Open MCP Selection Modal
    // TEST: handleAddMCP shows MCP selection modal.
    SET showMCPSelectionModal = true
  END FUNCTION

  FUNCTION handleSelectMCP(selectedMCP: MCP_Object):
    // Add selectedMCP to formData.config.dependentMCPs with default params
    // TEST: handleSelectMCP adds new MCP to formData with defaults.
    newMcpDependency = CREATE_MCP_DEPENDENCY_FROM_MCP(selectedMCP)
    ADD newMcpDependency TO formData.config.dependentMCPs
    SET showMCPSelectionModal = false
    CALL openMCPConfigModal(newMcpDependency) // Optionally open config for the new MCP
  END FUNCTION

  FUNCTION handleRemoveMCP(index: INTEGER):
    // Remove MCP from formData.config.dependentMCPs at index
    // TEST: handleRemoveMCP removes the correct MCP from formData.
    REMOVE item AT index FROM formData.config.dependentMCPs
  END FUNCTION

  FUNCTION openMCPConfigModal(mcpDependency: MCPDependency_Object, index: INTEGER):
    // Set mcpToConfigure = { ...mcpDependency, originalIndex: index }
    // Set showMCPConfigModal = true
    // TEST: openMCPConfigModal sets state for configuring the correct MCP.
  END FUNCTION

  FUNCTION handleSaveMCPConfig(updatedMcpParams: JSON):
    // Update formData.config.dependentMCPs[mcpToConfigure.originalIndex].parameters = updatedMcpParams
    // SET showMCPConfigModal = false
    // SET mcpToConfigure = null
    // TEST: handleSaveMCPConfig updates MCP parameters in formData.
  END FUNCTION

  // Similar handlers for Add/Remove/Configure Dependent Agents and Output Actions

  FUNCTION calculateEstimatedConsumption():
    // Logic to estimate SOL/Service Credits based on formData.config.dependentMCPs and formData.triggerConfig
    // SET formData.resources.estimatedConsumption = calculatedValue
    // TEST: calculateEstimatedConsumption updates estimated cost correctly.
  END FUNCTION

  FUNCTION validateForm(): BOOLEAN
    // Perform validation on formData
    // Populate validationErrors object
    // RETURN true if valid, false otherwise
    // TEST: validateForm correctly identifies missing/invalid fields.
    // Example: IF formData.basicInfo.name IS EMPTY THEN ADD_ERROR("basicInfo.name", "Agent Name is required")
    RETURN IS_EMPTY(validationErrors)
  END FUNCTION

  FUNCTION handleSaveAgent():
    SET validationErrors = {}
    IF NOT validateForm() THEN
      // TEST: handleSaveAgent stops if validation fails.
      RETURN
    END IF

    SET isSaving = true
    SET error = null
    TRY
      payload = MAP_FORM_DATA_TO_API_AGENT(formData)
      IF isEditMode THEN
        CALL updateAgentAPI(agentId, payload) // API
        // TEST: updateAgentAPI is called with correct payload for edit.
      ELSE
        CALL createAgentAPI(payload) // API
        // TEST: createAgentAPI is called with correct payload for create.
      END IF
      // On success, navigate to agent detail or list page
      NAVIGATE to (isEditMode ? `/agents/${agentId}` : '/agents')
      // TEST: Navigation occurs on successful save.
    CATCH exception
      SET error = "Failed to save agent."
      // TEST: Error is set if API save fails.
    FINALLY
      SET isSaving = false
    END TRY
  END FUNCTION

  FUNCTION handleCancel():
    // Navigate back, possibly with confirmation if form is dirty
    // TEST: handleCancel navigates away, confirms if dirty.
    IF IS_FORM_DIRTY(formData, initialFormData_if_edit_mode) THEN
      IF CONFIRM("Discard changes?") THEN NAVIGATE to '/agents'
    ELSE
      NAVIGATE to '/agents'
    END IF
  END FUNCTION

  FUNCTION handleSaveAsTemplate():
    // Logic to create an AgentTemplate from formData
    // CALL saveAgentTemplateAPI(templatePayload)
    // TEST: handleSaveAsTemplate creates and saves a template.
  END FUNCTION

  RENDER:
    DISPLAY PageLayout
      DISPLAY Title (pageTitle)

      IF isLoading THEN
        DISPLAY LoadingSpinner
      ELSE IF error THEN
        DISPLAY ErrorMessage (message = error)
      ELSE
        DISPLAY FormContainer // Could be multi-step wizard or single page
          // Step 1: Basic Information
          DISPLAY SectionTitle ("Step 1: Basic Information")
          DISPLAY TextInput (label="Agent Name", value=formData.basicInfo.name, onChange=(val) => handleInputChange("basicInfo", "name", val), error=validationErrors["basicInfo.name"], required=true)
          DISPLAY TextArea (label="Agent Description", value=formData.basicInfo.description, onChange=(val) => handleInputChange("basicInfo", "description", val))

          // Step 2: Trigger
          DISPLAY SectionTitle ("Step 2: Trigger")
          DISPLAY RadioGroup (name="triggerType", options=["MANUAL", "SCHEDULED", "EVENT_DRIVEN"], selectedValue=formData.trigger.type, onChange=(val) => handleInputChange("trigger", "type", val))
          IF formData.trigger.type IS "SCHEDULED" THEN
            DISPLAY Dropdown (label="Frequency", options=["HOURLY", "DAILY", ...], value=formData.trigger.config.frequency, onChange=(val) => handleInputChange("trigger.config", "frequency", val))
            DISPLAY TextInput (label="Time/Cron", value=formData.trigger.config.timeValue, onChange=(val) => handleInputChange("trigger.config", "timeValue", val), error=validationErrors["trigger.config.timeValue"])
            // TEST: Scheduled trigger options are shown/hidden correctly.
          END IF
          // ... (Event-driven UI - future)

          // Step 3: Core Logic - MCPs
          DISPLAY SectionTitle ("Step 3A: Dependent MCPs")
          DISPLAY Button ("[ + Add MCP ]", onClick = handleAddMCP)
          LOOP mcpDep, index IN formData.config.dependentMCPs:
            DISPLAY MCPDependencyItem (mcp=mcpDep, onConfigure=()=>openMCPConfigModal(mcpDep, index), onRemove=()=>handleRemoveMCP(index))
            // TEST: Added MCPs are listed correctly with configure/remove options.
          END LOOP

          // Step 3: Core Logic - Dependent Agents (A2A)
          // Similar structure for adding/listing/configuring/removing A2A dependencies
          // TEST: A2A dependencies are handled correctly.

          // Step 4: Output
          // Similar structure for adding/listing/configuring/removing Output Actions
          // TEST: Output actions are handled correctly.

          // Step 5: Resources & Wallet
          DISPLAY SectionTitle ("Step 5: Resources & Wallet")
          DISPLAY Dropdown (label="Associated Wallet", options=availableWallets, value=formData.resources.associatedWalletId, onChange=(val) => handleInputChange("resources", "associatedWalletId", val))
          DISPLAY Text ("Estimated Consumption: ...") // Dynamically calculated
          DISPLAY Checkbox (label="Auto-refill Service Credits", checked=formData.resources.autoRefillServiceCredits, onChange=(val) => handleInputChange("resources", "autoRefillServiceCredits", val))
          // ... (conditional inputs for thresholds/amounts)
          DISPLAY Checkbox (label="Auto-refill SOL", checked=formData.resources.autoRefillSol, onChange=(val) => handleInputChange("resources", "autoRefillSol", val))
          // ... (conditional inputs for thresholds/amounts/EOA)
          // TEST: Wallet and auto-refill options are displayed and handled.

          DISPLAY Button ("[ Save Agent ]", onClick = handleSaveAgent, disabled = isSaving)
          DISPLAY Button ("[ Cancel ]", onClick = handleCancel, disabled = isSaving)
          DISPLAY Button ("[ Save as Template (Optional) ]", onClick = handleSaveAsTemplate, disabled = isSaving)
          // TEST: Action buttons are present and their states (disabled) are correct.
        END FormContainer

        IF showMCPSelectionModal THEN
          DISPLAY MCPSelectionModal (availableMCPs = availableMCPs, onSelect = handleSelectMCP, onClose = () => SET showMCPSelectionModal = false)
          // TEST: MCPSelectionModal is shown/hidden correctly and selection works.
        END IF
        IF showMCPConfigModal AND mcpToConfigure THEN
          DISPLAY MCPConfigModal (mcp = mcpToConfigure, schema = getMCPSchema(mcpToConfigure.mcpId), onSave = handleSaveMCPConfig, onClose = () => SET showMCPConfigModal = false)
          // TEST: MCPConfigModal is shown/hidden correctly and saving config works.
        END IF
        // ... (other modals)
      END IF
  END RENDER
END COMPONENT

// Helper to initialize form data for a new agent
FUNCTION INITIALIZE_EMPTY_AGENT_FORM_DATA(): Agent_Object_Structure
  RETURN {
    basicInfo: { name: "", description: "" },
    trigger: { type: "MANUAL", config: {} },
    config: { dependentMCPs: [], dependentAgents: [], outputActions: [] },
    resources: { associatedWalletId: null, autoRefillServiceCredits: false, autoRefillSol: false }
    // ... other fields initialized to defaults
  }
END FUNCTION