# Page F: Agent Store - Pseudocode

This document provides high-level pseudocode for the Agent Store page.

## 1. Agent Store Page (`AgentStorePage`)

```pseudocode
COMPONENT AgentStorePage
  STATE:
    currentUser: User_Object (nullable)
    allStoreAgents: List_of_StoreAgent_Objects (nullable)
    filteredStoreAgents: List_of_StoreAgent_Objects (nullable)
    searchTerm: STRING (empty by default)
    activeCategoryFilters: List_of_STRING (empty by default) // e.g., ["DeFi", "Solana"]
    activeSortOption: STRING ("popularity" by default) // e.g., "price_asc", "name_asc"
    currentPage: INTEGER (1 by default)
    itemsPerPage: INTEGER (12 by default)
    totalPages: INTEGER (calculated)
    isLoading: BOOLEAN (true by default)
    error: STRING (nullable)
    // Modal states for purchase/deployment
    showPurchaseConfirmationModal: BOOLEAN (false)
    agentToPurchase: StoreAgent_Object (nullable)
    showDeploymentOptionsModal: BOOLEAN (false)
    agentToDeploy: StoreAgent_Object (nullable) // or UserAcquiredStoreAgent_Object

  ON_INIT:
    // TEST: ON_INIT fetches current user and initial store agent list.
    CALL loadInitialData()

  FUNCTION loadInitialData():
    SET isLoading = true
    SET error = null
    TRY
      currentUser = CALL fetchCurrentUser() // API
      allStoreAgents = CALL fetchAllStoreAgentsAPI() // API to get all available store agents
      // TEST: fetchAllStoreAgentsAPI returns a list of store agents or handles errors.
      CALL applyFiltersAndSort()
    CATCH exception
      SET error = "Failed to load Agent Store."
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
    // TEST: handleCategoryFilterChange updates filters and re-applies.
    SET activeCategoryFilters = changedCategories
    CALL applyFiltersAndSort()
  END FUNCTION

  FUNCTION handleSortChange(newSortOption: STRING):
    // TEST: handleSortChange updates sort option and re-applies.
    SET activeSortOption = newSortOption
    CALL applyFiltersAndSort()
  END FUNCTION

  FUNCTION applyFiltersAndSort():
    // TEST: applyFiltersAndSort correctly filters by categories, search term, and sorts.
    tempAgents = allStoreAgents

    // Apply Category Filters
    IF activeCategoryFilters IS NOT EMPTY THEN
      tempAgents = FILTER tempAgents WHERE agent.categories INTERSECTS activeCategoryFilters
    END IF

    // Apply Search Term
    IF searchTerm IS NOT EMPTY THEN
      tempAgents = FILTER tempAgents WHERE agent.name CONTAINS searchTerm OR agent.description CONTAINS searchTerm (case-insensitive)
    END IF

    // Apply Sorting (example sort keys)
    CASE activeSortOption OF
      "popularity": SORT tempAgents BY agent.popularityScore DESC
      "name_asc": SORT tempAgents BY agent.name ASC
      "price_asc": SORT tempAgents BY agent.pricingModel.priceCredits ASC // Simplified, needs to handle SOL/Free too
      // ... other sort options
    END CASE
    // TEST: Sorting applies correctly.

    SET filteredStoreAgents = tempAgents
    SET totalPages = CEIL(filteredStoreAgents.length / itemsPerPage)
    SET currentPage = 1 // Reset to first page
    // TEST: totalPages is calculated correctly.
  END FUNCTION

  FUNCTION handlePageChange(newPage: INTEGER):
    // TEST: handlePageChange updates currentPage.
    SET currentPage = newPage
  END FUNCTION

  FUNCTION handleViewStoreAgentDetails(storeAgentId: STRING):
    // TEST: handleViewStoreAgentDetails navigates to the correct store agent detail page.
    NAVIGATE to `/agent-store/${storeAgentId}`
  END FUNCTION

  FUNCTION handleGetOrDeployAgent(storeAgent: StoreAgent_Object):
    // TEST: handleGetOrDeployAgent initiates correct flow based on pricing.
    IF storeAgent.pricingModel.type IS "FREE" OR USER_HAS_ACQUIRED(currentUser.userId, storeAgent.storeAgentId) THEN
      SET agentToDeploy = storeAgent
      SET showDeploymentOptionsModal = true
      // TEST: Free or already acquired agent shows deployment options.
    ELSE
      SET agentToPurchase = storeAgent
      SET showPurchaseConfirmationModal = true
      // TEST: Paid agent shows purchase confirmation.
    END IF
  END FUNCTION

  FUNCTION confirmPurchaseAgent():
    // Assumes agentToPurchase is set
    // CALL purchaseStoreAgentAPI(currentUser.userId, agentToPurchase.storeAgentId, agentToPurchase.pricingModel)
    // On success:
    //   ADD_TO_USER_ACQUIRED_AGENTS(currentUser.userId, agentToPurchase)
    //   SET showPurchaseConfirmationModal = false
    //   SET agentToDeploy = agentToPurchase
    //   SET showDeploymentOptionsModal = true
    //   SHOW_NOTIFICATION("Agent purchased successfully!")
    // On failure (e.g. insufficient funds):
    //   SHOW_ERROR_NOTIFICATION("Purchase failed. Please check your wallet balance.")
    // TEST: confirmPurchaseAgent handles purchase logic and transitions.
  END FUNCTION

  FUNCTION confirmDeployAgent(deploymentConfig: Object): // config might include name for new instance, wallet, etc.
    // Assumes agentToDeploy is set
    // CALL deployAcquiredAgentAPI(currentUser.userId, agentToDeploy.storeAgentId, deploymentConfig)
    // On success:
    //   SHOW_NOTIFICATION(`Agent "${agentToDeploy.name}" deployed successfully!`)
    //   NAVIGATE to `/agents` // or the new agent's detail page
    // On failure:
    //   SHOW_ERROR_NOTIFICATION("Deployment failed.")
    // SET showDeploymentOptionsModal = false
    // TEST: confirmDeployAgent handles deployment logic.
  END FUNCTION

  RENDER:
    DISPLAY PageLayout (currentUser = currentUser) // Includes header with "Agent Store" active
      DISPLAY Title ("Agent Store (Focused on Solana Ecosystem)")

      DISPLAY SearchInput (value = searchTerm, onChange = handleSearchChange, placeholder = "[Search Agents...]")
      DISPLAY CategoryFilterControls (allCategories = GET_UNIQUE_CATEGORIES_FROM_STORE_AGENTS(allStoreAgents), selected = activeCategoryFilters, onChange = handleCategoryFilterChange)
      DISPLAY SortDropdown (options = [...], selected = activeSortOption, onChange = handleSortChange)

      IF isLoading THEN
        DISPLAY LoadingSpinner
      ELSE IF error THEN
        DISPLAY ErrorMessage (message = error)
      ELSE IF filteredStoreAgents IS EMPTY THEN
        DISPLAY Text ("No Agents found matching your criteria.")
      ELSE
        DISPLAY GridContainer (columns = 3 or 4)
          LOOP storeAgent IN GET_PAGINATED_ITEMS(filteredStoreAgents, currentPage, itemsPerPage):
            DISPLAY StoreAgentCard (
              agent = storeAgent,
              onViewDetails = () => handleViewStoreAgentDetails(storeAgent.storeAgentId),
              onGetOrDeploy = () => handleGetOrDeployAgent(storeAgent)
            )
            // TEST: StoreAgentCard is rendered correctly.
          END LOOP
        END GridContainer
        DISPLAY PaginationControls (currentPage = currentPage, totalPages = totalPages, onPageChange = handlePageChange)
      END IF

      // Modals
      IF showPurchaseConfirmationModal AND agentToPurchase THEN
        DISPLAY PurchaseConfirmationModal (
          agent = agentToPurchase,
          onConfirm = confirmPurchaseAgent,
          onClose = () => SET showPurchaseConfirmationModal = false
        )
        // TEST: PurchaseConfirmationModal shows/hides and functions.
      END IF
      IF showDeploymentOptionsModal AND agentToDeploy THEN
        DISPLAY DeploymentOptionsModal (
          agent = agentToDeploy,
          onDeploy = confirmDeployAgent,
          onClose = () => SET showDeploymentOptionsModal = false
        )
        // TEST: DeploymentOptionsModal shows/hides and functions.
      END IF
  END RENDER
END COMPONENT

## 2. Store Agent Card Component (`StoreAgentCard`)

```pseudocode
COMPONENT StoreAgentCard
  PROPS:
    agent: StoreAgent_Object
    onViewDetails: FUNCTION
    onGetOrDeploy: FUNCTION

  RENDER:
    DISPLAY CardContainer
      DISPLAY AgentName (agent.name)
      DISPLAY AgentProvider (agent.provider)
      DISPLAY AgentDescription (TRUNCATE(agent.description, 100))
      DISPLAY AgentCategories (agent.categories) // As tags
      DISPLAY AgentPrice (formatStoreAgentPrice(agent.pricingModel))
      // TEST: All StoreAgent card fields are displayed correctly.

      DISPLAY Button ("[Details]", onClick = onViewDetails)
      // TEST: Details button triggers onViewDetails.
      DISPLAY Button ("[Get / Deploy]", onClick = onGetOrDeploy)
      // TEST: Get/Deploy button triggers onGetOrDeploy.
  END RENDER
END COMPONENT

## Helper/Utility Functions (Conceptual)

FUNCTION fetchAllStoreAgentsAPI(): List_of_StoreAgent_Objects
  // API call
  // TEST: Returns list of all available store agents.
END FUNCTION

FUNCTION formatStoreAgentPrice(pricingModel: StoreAgent_PricingModel_Object): STRING
  // Formats the pricing model into a readable string
  // e.g., "Free", "1000 Credits/month (USDT)", "50 SOL (One-time)"
  // TEST: Price is formatted correctly.
END FUNCTION

FUNCTION USER_HAS_ACQUIRED(userId: STRING, storeAgentId: STRING): BOOLEAN
  // API call or check local state to see if user already owns/subscribed to this agent
  // TEST: Correctly identifies if user has acquired the agent.
END FUNCTION