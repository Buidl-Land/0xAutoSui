# Page D: MCP Hub - Pseudocode

This document provides high-level pseudocode for the MCP Hub page.

## 1. MCP Hub Page (`MCPHubPage`)

```pseudocode
COMPONENT MCPHubPage
  STATE:
    currentUser: User_Object (nullable)
    allMCPs: List_of_MCP_Objects (nullable)
    filteredMCPs: List_of_MCP_Objects (nullable)
    searchTerm: STRING (empty by default)
    activeCategoryFilters: List_of_STRING (empty by default)
    activeSortOption: STRING ("popularity" or "name_asc" by default)
    currentPage: INTEGER (1 by default)
    itemsPerPage: INTEGER (12 by default) // e.g., for a 3 or 4 column grid
    totalPages: INTEGER (calculated)
    isLoading: BOOLEAN (true by default)
    error: STRING (nullable)
    // For contextual "Add to Agent"
    agentContextId: STRING (nullable, passed if navigating from agent config)

  ON_INIT:
    // TEST: ON_INIT fetches current user and initial MCP list.
    CALL loadInitialData()
    // Check for agentContextId if passed via route state or query param

  FUNCTION loadInitialData():
    SET isLoading = true
    SET error = null
    TRY
      currentUser = CALL fetchCurrentUser() // API
      allMCPs = CALL fetchAllMCPsAPI() // API to get all available MCPs
      // TEST: fetchAllMCPsAPI returns a list of MCPs or handles errors.
      CALL applyFiltersAndSort()
    CATCH exception
      SET error = "Failed to load MCPs."
      // TEST: Error message is set if API call fails.
    FINALLY
      SET isLoading = false
    END TRY
  END FUNCTION

  FUNCTION handleSearchChange(newSearchTerm: STRING):
    // TEST: handleSearchChange updates searchTerm and re-applies filters/sort.
    SET searchTerm = newSearchTerm
    CALL applyFiltersAndSort()
  END FUNCTION

  FUNCTION handleCategoryFilterChange(changedCategories: List_of_STRING):
    // TEST: handleCategoryFilterChange updates activeCategoryFilters and re-applies filters/sort.
    SET activeCategoryFilters = changedCategories
    CALL applyFiltersAndSort()
  END FUNCTION

  FUNCTION handleSortChange(newSortOption: STRING):
    // TEST: handleSortChange updates activeSortOption and re-applies filters/sort.
    SET activeSortOption = newSortOption
    CALL applyFiltersAndSort()
  END FUNCTION

  FUNCTION applyFiltersAndSort():
    // TEST: applyFiltersAndSort correctly filters by categories, search term, and sorts.
    tempMCPs = allMCPs

    // Apply Category Filters
    IF activeCategoryFilters IS NOT EMPTY THEN
      tempMCPs = FILTER tempMCPs WHERE mcp.categories INTERSECTS activeCategoryFilters
    END IF

    // Apply Search Term
    IF searchTerm IS NOT EMPTY THEN
      tempMCPs = FILTER tempMCPs WHERE mcp.name CONTAINS searchTerm OR mcp.description CONTAINS searchTerm (case-insensitive)
    END IF

    // Apply Sorting
    CASE activeSortOption OF
      "popularity": SORT tempMCPs BY mcp.popularityScore DESC
      "name_asc": SORT tempMCPs BY mcp.name ASC
      "name_desc": SORT tempMCPs BY mcp.name DESC
      "cost_asc": SORT tempMCPs BY mcp.costStructure.serviceCreditsPerCall ASC // Simplified cost sort
      // ... other sort options
    END CASE
    // TEST: Sorting applies correctly based on activeSortOption.

    SET filteredMCPs = tempMCPs
    SET totalPages = CEIL(filteredMCPs.length / itemsPerPage)
    SET currentPage = 1 // Reset to first page
    // TEST: totalPages is calculated correctly.
  END FUNCTION

  FUNCTION handlePageChange(newPage: INTEGER):
    // TEST: handlePageChange updates currentPage.
    SET currentPage = newPage
  END FUNCTION

  FUNCTION handleViewMCPDetails(mcpId: STRING):
    // TEST: handleViewMCPDetails navigates to the correct MCP detail page.
    NAVIGATE to `/mcp-hub/${mcpId}`
  END FUNCTION

  FUNCTION handleAddMCPToAgent(mcp: MCP_Object):
    // TEST: handleAddMCPToAgent correctly adds MCP to agent or prompts for selection.
    IF agentContextId IS NOT NULL THEN
      // Add directly to the agent being configured (e.g., via a shared service or event)
      EMIT_EVENT("addMCPToAgentConfig", { agentId: agentContextId, mcpToAdd: mcp })
      SHOW_NOTIFICATION(`MCP "${mcp.name}" added to agent configuration.`)
      NAVIGATE back to agent configuration page for agentContextId
    ELSE
      // Prompt user to select an agent or create a new one
      SHOW_AGENT_SELECTION_MODAL_FOR_MCP(mcp)
    END IF
  END FUNCTION

  RENDER:
    DISPLAY PageLayout (currentUser = currentUser) // Includes header
      DISPLAY Title ("MCP Hub (Model Context Protocol Hub)")

      DISPLAY SearchInput (value = searchTerm, onChange = handleSearchChange, placeholder = "[Search MCPs...]")
      DISPLAY CategoryFilterControls (allCategories = GET_UNIQUE_CATEGORIES(allMCPs), selected = activeCategoryFilters, onChange = handleCategoryFilterChange)
      DISPLAY SortDropdown (options = [...], selected = activeSortOption, onChange = handleSortChange)

      IF isLoading THEN
        DISPLAY LoadingSpinner
        // TEST: LoadingSpinner is displayed when isLoading is true.
      ELSE IF error THEN
        DISPLAY ErrorMessage (message = error)
        // TEST: ErrorMessage is displayed when error is not null.
      ELSE IF filteredMCPs IS EMPTY THEN
        DISPLAY Text ("No MCPs match your criteria.")
        // TEST: Message shown for no matching MCPs.
      ELSE
        DISPLAY GridContainer (columns = 3 or 4)
          LOOP mcp IN GET_PAGINATED_ITEMS(filteredMCPs, currentPage, itemsPerPage):
            DISPLAY MCPCard (
              mcp = mcp,
              onViewDetails = () => handleViewMCPDetails(mcp.mcpId),
              onAddToAgent = () => handleAddMCPToAgent(mcp)
            )
            // TEST: MCPCard is rendered correctly for each MCP.
          END LOOP
        END GridContainer
        DISPLAY PaginationControls (currentPage = currentPage, totalPages = totalPages, onPageChange = handlePageChange)
        // TEST: PaginationControls are rendered and functional.
      END IF

      // Optional Sidebar
      // DISPLAY Sidebar
      //   DISPLAY SectionTitle("My Integrated MCPs")
      //   DISPLAY ListOfIntegratedMCPs (userId = currentUser.userId)
      //   DISPLAY SectionTitle("Popular Solana MCPs")
      //   DISPLAY ListOfPopularSolanaMCPs()
  END RENDER
END COMPONENT

## 2. MCP Card Component (`MCPCard`)

```pseudocode
COMPONENT MCPCard
  PROPS:
    mcp: MCP_Object
    onViewDetails: FUNCTION
    onAddToAgent: FUNCTION

  RENDER:
    DISPLAY CardContainer
      DISPLAY MCPName (mcp.name)
      DISPLAY MCPProvider (mcp.provider) // e.g., "(Official)"
      DISPLAY MCPDescription (TRUNCATE(mcp.description, 100))
      DISPLAY MCPTypeTags (mcp.categories) // Display as list of tags
      DISPLAY MCPCost (formatCost(mcp.costStructure))
      // TEST: All MCP card fields are displayed correctly.

      DISPLAY Button ("[Details]", onClick = onViewDetails)
      // TEST: Details button triggers onViewDetails.
      DISPLAY Button ("[Add to Agent]", onClick = onAddToAgent)
      // TEST: Add to Agent button triggers onAddToAgent.
  END RENDER
END COMPONENT

## Helper/Utility Functions (Conceptual)

FUNCTION fetchAllMCPsAPI(): List_of_MCP_Objects
  // API call
  // TEST: Returns list of all available MCPs.
END FUNCTION

FUNCTION GET_UNIQUE_CATEGORIES(mcpList: List_of_MCP_Objects): List_of_STRING
  // Extracts all unique category tags from the MCP list
  // TEST: Returns unique list of categories.
END FUNCTION

FUNCTION formatCost(costStructure: MCP_CostStructure_Object): STRING
  // Formats the cost object into a readable string
  // e.g., "Free", "0.05 Credits/use", "0.1 Credits/1k tokens (USDT)", "SOL Gas + 0.05 Credits/trade"
  // TEST: Cost is formatted correctly based on structure.
END FUNCTION