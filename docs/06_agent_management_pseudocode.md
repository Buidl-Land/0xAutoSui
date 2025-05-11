# Page B: Agent Management - Pseudocode

This document provides high-level pseudocode for the Agent Management List and Detail pages.

## 1. Agent List Page (`AgentListPage`)

```pseudocode
COMPONENT AgentListPage

  STATE:
    currentUser: User_Object (nullable)
    allAgents: List_of_Agent_Objects (nullable)
    filteredAgents: List_of_Agent_Objects (nullable)
    searchTerm: STRING (empty by default)
    activeFilter: STRING ("ALL" by default) // "ALL", "RUNNING", "SCHEDULED", "ERROR"
    currentPage: INTEGER (1 by default)
    itemsPerPage: INTEGER (10 by default)
    totalPages: INTEGER (calculated)
    isLoading: BOOLEAN (true by default)
    error: STRING (nullable)

  ON_INIT:
    // TEST: ON_INIT fetches current user and initial agent list.
    CALL loadInitialData()

  FUNCTION loadInitialData():
    SET isLoading = true
    SET error = null
    TRY
      currentUser = CALL fetchCurrentUser() // API
      allAgents = CALL fetchAgentsForUser(currentUser.userId) // API
      // TEST: fetchAgentsForUser returns a list of agents or handles errors.
      CALL applyFiltersAndSearch()
    CATCH exception
      SET error = "Failed to load agent list."
      // TEST: Error message is set if API call fails.
    FINALLY
      SET isLoading = false
    END TRY
  END FUNCTION

  FUNCTION handleSearchChange(newSearchTerm: STRING):
    // TEST: handleSearchChange updates searchTerm and re-applies filters.
    SET searchTerm = newSearchTerm
    CALL applyFiltersAndSearch()
  END FUNCTION

  FUNCTION handleFilterChange(newFilter: STRING):
    // TEST: handleFilterChange updates activeFilter and re-applies filters.
    SET activeFilter = newFilter
    CALL applyFiltersAndSearch()
  END FUNCTION

  FUNCTION applyFiltersAndSearch():
    // TEST: applyFiltersAndSearch correctly filters by status and search term.
    tempAgents = allAgents
    IF activeFilter IS NOT "ALL" THEN
      tempAgents = FILTER tempAgents WHERE agent.status MATCHES activeFilter
    END IF
    IF searchTerm IS NOT EMPTY THEN
      tempAgents = FILTER tempAgents WHERE agent.name CONTAINS searchTerm (case-insensitive)
    END IF
    SET filteredAgents = tempAgents
    SET totalPages = CEIL(filteredAgents.length / itemsPerPage)
    SET currentPage = 1 // Reset to first page after filtering
    // TEST: totalPages is calculated correctly.
    // TEST: currentPage is reset to 1.
  END FUNCTION

  FUNCTION handlePageChange(newPage: INTEGER):
    // TEST: handlePageChange updates currentPage.
    SET currentPage = newPage
  END FUNCTION

  FUNCTION handleCreateNewAgent():
    // TEST: handleCreateNewAgent navigates to agent creation page.
    NAVIGATE to '/agents/new'
  END FUNCTION

  FUNCTION handleViewDetails(agentId: STRING):
    // TEST: handleViewDetails navigates to the correct agent detail page.
    NAVIGATE to `/agents/${agentId}`
  END FUNCTION

  FUNCTION handleEditAgent(agentId: STRING):
    // TEST: handleEditAgent navigates to the correct agent edit page.
    NAVIGATE to `/agents/${agentId}/edit`
  END FUNCTION

  FUNCTION handleToggleAgentStatus(agentId: STRING, currentStatus: STRING):
    // API call to pause/start/retry agent
    // TEST: handleToggleAgentStatus calls API to change agent status.
    targetAgent = FIND agent IN allAgents WHERE agent.id == agentId
    IF currentStatus IS "RUNNING" OR currentStatus IS "SCHEDULED" THEN
      CALL pauseAgentAPI(agentId) // API
      targetAgent.status = "PAUSED"
    ELSE IF currentStatus IS "PAUSED" THEN
      CALL startAgentAPI(agentId) // API
      targetAgent.status = "RUNNING" // Or "SCHEDULED" based on its config
    ELSE IF currentStatus IS "ERROR" THEN
      CALL retryAgentAPI(agentId) // API
      targetAgent.status = "PENDING_RETRY" // Or similar
    END IF
    CALL applyFiltersAndSearch() // Re-render list
    // TEST: Agent status is updated locally and list is refreshed.
  END FUNCTION

  FUNCTION handleDeleteAgent(agentId: STRING):
    // TEST: handleDeleteAgent prompts for confirmation.
    IF CONFIRM("Are you sure you want to delete this agent?") THEN
      CALL deleteAgentAPI(agentId) // API
      // TEST: deleteAgentAPI successfully deletes agent.
      REMOVE agent with agentId from allAgents
      CALL applyFiltersAndSearch() // Re-render list
      // TEST: Agent is removed from local list and list is refreshed.
    END IF
  END FUNCTION

  FUNCTION handleViewLogs(agentId: STRING):
    // TEST: handleViewLogs navigates to agent detail page log section.
    NAVIGATE to `/agents/${agentId}#logs`
  END FUNCTION

  RENDER:
    DISPLAY PageLayout (currentUser = currentUser) // Includes header
      DISPLAY Title ("My Agents")
      DISPLAY Button ("[ + Create New Agent ]", onClick = handleCreateNewAgent)

      DISPLAY SearchInput (value = searchTerm, onChange = handleSearchChange, placeholder = "[Search Agents...]")
      DISPLAY FilterControls (options = ["ALL", "RUNNING", "SCHEDULED", "ERROR"], active = activeFilter, onChange = handleFilterChange)

      IF isLoading THEN
        DISPLAY LoadingSpinner
        // TEST: LoadingSpinner is displayed when isLoading is true.
      ELSE IF error THEN
        DISPLAY ErrorMessage (message = error)
        // TEST: ErrorMessage is displayed when error is not null.
      ELSE IF filteredAgents IS EMPTY AND allAgents IS NOT EMPTY THEN
        DISPLAY Text ("No agents match your search/filter criteria.")
        // TEST: Message shown for no matching agents.
      ELSE IF allAgents IS EMPTY THEN
        DISPLAY Text ("You haven't created any agents yet...")
        // TEST: Message shown for no agents at all.
      ELSE
        DISPLAY AgentTable (
          agents = GET_PAGINATED_ITEMS(filteredAgents, currentPage, itemsPerPage),
          onViewDetails = handleViewDetails,
          onEdit = handleEditAgent,
          onToggleStatus = handleToggleAgentStatus,
          onDelete = handleDeleteAgent,
          onViewLogs = handleViewLogs
        )
        // TEST: AgentTable is rendered with paginated agents.
        DISPLAY PaginationControls (currentPage = currentPage, totalPages = totalPages, onPageChange = handlePageChange)
        // TEST: PaginationControls are rendered and functional.
      END IF
  END RENDER
END COMPONENT
```

## 2. Agent Detail Page (`AgentDetailPage`)

```pseudocode
COMPONENT AgentDetailPage
  PROPS:
    agentId: STRING (from route parameter)

  STATE:
    agent: Agent_Object (nullable)
    logs: List_of_AgentRunLog_Objects (nullable)
    logLevelFilter: STRING ("ALL" by default)
    logTimeRangeFilter: Object (nullable) // { start, end }
    isLoading: BOOLEAN (true by default)
    error: STRING (nullable)
    currentSolBalance: DECIMAL (nullable, for associated wallet)

  ON_INIT:
    // TEST: ON_INIT fetches agent details and logs.
    CALL loadAgentDetailsAndLogs()

  FUNCTION loadAgentDetailsAndLogs():
    SET isLoading = true
    SET error = null
    TRY
      agent = CALL fetchAgentById(agentId) // API
      // TEST: fetchAgentById returns correct agent data or handles errors.
      IF agent THEN
        logs = CALL fetchAgentLogs(agentId, logLevelFilter, logTimeRangeFilter) // API
        // TEST: fetchAgentLogs returns logs based on filters.
        currentSolBalance = CALL fetchWalletSolBalance(agent.associatedWalletId) // API
        // TEST: fetchWalletSolBalance returns SOL balance.
      ELSE
        SET error = "Agent not found."
      END IF
    CATCH exception
      SET error = "Failed to load agent details."
      // TEST: Error message is set if API calls fail.
    FINALLY
      SET isLoading = false
    END TRY
  END FUNCTION

  FUNCTION handleEditAgent():
    // TEST: handleEditAgent navigates to the edit page for the current agent.
    NAVIGATE to `/agents/${agentId}/edit`
  END FUNCTION

  FUNCTION handleBackToList():
    // TEST: handleBackToList navigates back to the agent list page.
    NAVIGATE to '/agents'
  END FUNCTION

  FUNCTION handleLogLevelFilterChange(newLevel: STRING):
    // TEST: handleLogLevelFilterChange updates filter and re-fetches logs.
    SET logLevelFilter = newLevel
    CALL loadAgentDetailsAndLogs() // Or a more specific log fetch function
  END FUNCTION

  FUNCTION handleTimeRangeFilterChange(newRange: Object):
    // TEST: handleTimeRangeFilterChange updates filter and re-fetches logs.
    SET logTimeRangeFilter = newRange
    CALL loadAgentDetailsAndLogs() // Or a more specific log fetch function
  END FUNCTION

  RENDER:
    DISPLAY PageLayout // Includes header
      DISPLAY Button ("< Back to Agent List", onClick = handleBackToList)

      IF isLoading THEN
        DISPLAY LoadingSpinner
        // TEST: LoadingSpinner is displayed when isLoading is true.
      ELSE IF error THEN
        DISPLAY ErrorMessage (message = error)
        // TEST: ErrorMessage is displayed when error is not null.
      ELSE IF agent THEN
        DISPLAY Title (`Agent: ${agent.name}`)
        DISPLAY Button ("[Edit Agent]", onClick = handleEditAgent)

        DISPLAY Section ("Status:")
          DISPLAY Text (`${agent.status} (${agent.triggerType}, Next run: ${agent.nextRunAt OR "N/A"})`)
          // TEST: Agent status, trigger, and next run are correctly displayed.

        DISPLAY Section ("Description:")
          DISPLAY Text (agent.description OR "No description provided.")
          // TEST: Agent description is correctly displayed.

        DISPLAY Section ("Configuration Overview:")
          DISPLAY ConfigItem ("Trigger:", formatTriggerConfig(agent.triggerConfig, agent.triggerType))
          // TEST: Trigger configuration is correctly formatted and displayed.
          DISPLAY ConfigItem ("Dependent MCPs:")
            IF agent.config.dependentMCPs AND agent.config.dependentMCPs.length > 0 THEN
              LOOP mcpDep IN agent.config.dependentMCPs:
                DISPLAY Text (`- ${mcpDep.mcpName} (Parameters: ${JSON_STRINGIFY(mcpDep.parameters)})`)
              END LOOP
              // TEST: Dependent MCPs are listed with parameters.
            ELSE
              DISPLAY Text ("(None)")
            END IF
          DISPLAY ConfigItem ("Dependent Agents (A2A):")
            IF agent.config.dependentAgents AND agent.config.dependentAgents.length > 0 THEN
              LOOP agentDep IN agent.config.dependentAgents:
                DISPLAY Text (`- ${agentDep.dependentAgentName} (Interaction: ${JSON_STRINGIFY(agentDep.interactionConfig)})`)
              END LOOP
              // TEST: Dependent Agents are listed with interaction config.
            ELSE
              DISPLAY Text ("(None)")
            END IF
          DISPLAY ConfigItem ("Output:")
            IF agent.config.outputActions AND agent.config.outputActions.length > 0 THEN
              LOOP outputAction IN agent.config.outputActions:
                DISPLAY Text (`- ${outputAction.outputProviderName} (Parameters: ${JSON_STRINGIFY(outputAction.parameters)})`)
              END LOOP
              // TEST: Output actions are listed with parameters.
            ELSE
              DISPLAY Text ("(None)")
            END IF
          DISPLAY ConfigItem ("Associated Wallet:", `${agent.associatedWalletId} (Balance: ${currentSolBalance OR "N/A"} SOL)`)
          // TEST: Associated wallet and its SOL balance are displayed.

        DISPLAY Section ("Run Logs:") ID="logs" // For #logs navigation
          DISPLAY LogFilterControls (
            levels = ["ALL", "INFO", "ERROR", "DEBUG"],
            currentLevel = logLevelFilter,
            onLevelChange = handleLogLevelFilterChange,
            currentTimeRange = logTimeRangeFilter,
            onTimeRangeChange = handleTimeRangeFilterChange
          )
          // TEST: Log filter controls are present and functional.
          IF logs AND logs.length > 0 THEN
            DISPLAY LogTable (logs = logs) // Columns: Timestamp, Level, Message
            // TEST: LogTable is rendered with logs.
            // Potentially add pagination for logs here
          ELSE
            DISPLAY Text ("No logs available for the selected filters.")
            // TEST: Message shown for no logs matching filters.
          END IF
      END IF
  END RENDER
END COMPONENT
```

## Helper/Utility Functions (Conceptual - some might be API calls)

```pseudocode
FUNCTION fetchAgentsForUser(userId: STRING): List_of_Agent_Objects
  // API call
  // TEST: Returns list of agents for the user.
END FUNCTION

FUNCTION fetchAgentById(agentId: STRING): Agent_Object
  // API call
  // TEST: Returns specific agent data.
END FUNCTION

FUNCTION fetchAgentLogs(agentId: STRING, levelFilter: STRING, timeRangeFilter: Object): List_of_AgentRunLog_Objects
  // API call, passing filters
  // TEST: Returns logs matching agentId and filters.
END FUNCTION

FUNCTION fetchWalletSolBalance(walletId: STRING): DECIMAL
  // API call
  // TEST: Returns SOL balance for the given wallet.
END FUNCTION

FUNCTION pauseAgentAPI(agentId: STRING)
  // API call to pause agent
  // TEST: API call successfully pauses agent.
END FUNCTION

FUNCTION startAgentAPI(agentId: STRING)
  // API call to start agent
  // TEST: API call successfully starts agent.
END FUNCTION

FUNCTION retryAgentAPI(agentId: STRING)
  // API call to retry agent
  // TEST: API call successfully queues agent for retry.
END FUNCTION

FUNCTION deleteAgentAPI(agentId: STRING)
  // API call to delete agent
  // TEST: API call successfully deletes agent.
END FUNCTION

FUNCTION formatTriggerConfig(triggerConfig: JSON, triggerType: ENUM): STRING
  // Helper to format trigger details for display
  // e.g., "Scheduled - Daily 08:00"
  // TEST: Correctly formats trigger config for display.
END FUNCTION

FUNCTION GET_PAGINATED_ITEMS(list, currentPage, itemsPerPage): List
  // Slices the list for current page display
  // TEST: Returns correct slice of items for the current page.
END FUNCTION