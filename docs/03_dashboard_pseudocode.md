# Page A: Dashboard - Pseudocode

This document provides high-level pseudocode for the Dashboard page and its components.

## 1. Main Dashboard Page (`DashboardPage`)

```pseudocode
COMPONENT DashboardPage

  STATE:
    currentUser: User_Object (nullable)
    agentStats: AgentStats_Object (nullable) // { total, running, scheduled, pendingError }
    recentLogs: List_of_AgentActivityLog_Objects (nullable, limited to e.g., 5)
    walletBalance: Wallet_Object (nullable)
    watchedFeeds: List_of_WatchedFeed_Objects (nullable)
    isLoading: BOOLEAN (true by default)
    error: STRING (nullable)

  ON_INIT:
    // TEST: ON_INIT fetches all necessary data.
    CALL loadDashboardData()

  FUNCTION loadDashboardData():
    // TEST: loadDashboardData sets isLoading to true at the start and false at the end.
    SET isLoading = true
    SET error = null
    TRY
      // Parallel fetching for better performance
      currentUser = CALL fetchCurrentUser() // API call
      // TEST: fetchCurrentUser returns valid user data or handles errors.
      agentStats = CALL fetchAgentStats(currentUser.userId) // API call
      // TEST: fetchAgentStats returns valid stats or handles errors.
      recentLogs = CALL fetchRecentLogs(currentUser.userId, limit=5) // API call
      // TEST: fetchRecentLogs returns a list of logs or an empty list.
      walletBalance = CALL fetchWalletBalance(currentUser.userId) // API call
      // TEST: fetchWalletBalance returns valid balance data or handles errors.
      watchedFeeds = CALL fetchWatchedFeeds(currentUser.userId) // API call
      // TEST: fetchWatchedFeeds returns a list of feeds or an empty list.
    CATCH exception
      SET error = "Failed to load dashboard data. Please try again."
      // Log the actual exception for debugging
      // TEST: Error message is set if any API call fails.
    FINALLY
      SET isLoading = false
    END TRY
  END FUNCTION

  FUNCTION handleNavigate(route: STRING):
    // TEST: handleNavigate correctly navigates to the specified route.
    NAVIGATE to route // e.g., '/agents', '/mcp-hub', '/wallet'
  END FUNCTION

  FUNCTION handleCreateNewAgent():
    // TEST: handleCreateNewAgent navigates to the agent creation page.
    NAVIGATE to '/agents/new'
  END FUNCTION

  RENDER:
    IF isLoading THEN
      DISPLAY LoadingSpinner
      // TEST: LoadingSpinner is displayed when isLoading is true.
    ELSE IF error THEN
      DISPLAY ErrorMessage (message = error)
      // TEST: ErrorMessage is displayed when error is not null.
    ELSE
      DISPLAY PageLayout (currentUser = currentUser) // Includes header with navigation
        // Header Navigation Links:
        //   Dashboard (active) -> handleNavigate('/dashboard')
        //   My Agents -> handleNavigate('/agents')
        //   MCP Hub -> handleNavigate('/mcp-hub')
        //   Wallet -> handleNavigate('/wallet')
        //   NotificationsIcon
        //   UserProfileIcon

        DISPLAY WelcomeMessage (username = currentUser.username)
        // TEST: WelcomeMessage displays the correct username.

        GRID_LAYOUT (2 columns)
          COLUMN 1:
            DISPLAY AgentOverviewCard (
              stats = agentStats,
              onViewAllAgents = () => handleNavigate('/agents')
            )
            // TEST: AgentOverviewCard is rendered with correct stats.
            DISPLAY QuickActionsCard (
              onCreateNewAgent = handleCreateNewAgent,
              onBrowseMCP = () => handleNavigate('/mcp-hub'),
              onManageWallet = () => handleNavigate('/wallet')
            )
            // TEST: QuickActionsCard is rendered with correct handlers.
          COLUMN 2:
            DISPLAY RecentActivityCard (
              logs = recentLogs,
              onViewFullLogs = () => handleNavigate('/logs') // Assuming a /logs route
            )
            // TEST: RecentActivityCard is rendered with correct logs.
            DISPLAY WalletBalanceCard (balance = walletBalance)
            // TEST: WalletBalanceCard is rendered with correct balance.

        IF watchedFeeds AND watchedFeeds.length > 0 THEN
          DISPLAY WatchedFeedsSection (feeds = watchedFeeds)
          // TEST: WatchedFeedsSection is rendered if feeds exist.
        ELSE
          // Optionally display a message for no feeds
          // TEST: Appropriate message or no section is rendered if no feeds exist.
        END IF
    END IF
  END RENDER

END COMPONENT
```

## 2. Agent Overview Card (`AgentOverviewCard`)

```pseudocode
COMPONENT AgentOverviewCard
  PROPS:
    stats: AgentStats_Object { total, running, scheduled, pendingError }
    onViewAllAgents: FUNCTION

  RENDER:
    DISPLAY CardContainer
      DISPLAY Title ("Agent Overview")
      DISPLAY StatItem ("Total Agents:", stats.total)
      // TEST: Total agents count is displayed correctly.
      DISPLAY StatItem ("Running:", stats.running, " (Scheduled: ", stats.scheduled, ")")
      // TEST: Running and scheduled agents counts are displayed correctly.
      DISPLAY StatItem ("Pending/Error:", stats.pendingError)
      // TEST: Pending/error agents count is displayed correctly.
      DISPLAY LinkButton ("[View All Agents ->]", onClick = onViewAllAgents)
      // TEST: "View All Agents" link triggers onViewAllAgents when clicked.
  END RENDER
END COMPONENT
```

## 3. Recent Activity Card (`RecentActivityCard`)

```pseudocode
COMPONENT RecentActivityCard
  PROPS:
    logs: List_of_AgentActivityLog_Objects
    onViewFullLogs: FUNCTION

  RENDER:
    DISPLAY CardContainer
      DISPLAY Title ("Recent Activity / Log Summary")
      IF logs AND logs.length > 0 THEN
        LOOP log IN logs:
          DISPLAY LogEntry (description = log.description, timestamp = log.timestamp)
          // TEST: Each log entry is displayed with description and timestamp.
        END LOOP
      ELSE
        DISPLAY Text ("No recent activity.")
        // TEST: "No recent activity" message is shown when logs list is empty.
      END IF
      DISPLAY LinkButton ("[View Full Logs ->]", onClick = onViewFullLogs)
      // TEST: "View Full Logs" link triggers onViewFullLogs when clicked.
  END RENDER
END COMPONENT
```

## 4. Quick Actions Card (`QuickActionsCard`)

```pseudocode
COMPONENT QuickActionsCard
  PROPS:
    onCreateNewAgent: FUNCTION
    onBrowseMCP: FUNCTION
    onManageWallet: FUNCTION

  RENDER:
    DISPLAY CardContainer
      DISPLAY Title ("Quick Actions")
      DISPLAY Button ("[ + Create New Agent ]", onClick = onCreateNewAgent)
      // TEST: "Create New Agent" button triggers onCreateNewAgent when clicked.
      DISPLAY LinkButton ("[ Browse MCP Marketplace -> ]", onClick = onBrowseMCP)
      // TEST: "Browse MCP Marketplace" link triggers onBrowseMCP when clicked.
      DISPLAY LinkButton ("[ Manage My Wallet -> ]", onClick = onManageWallet)
      // TEST: "Manage My Wallet" link triggers onManageWallet when clicked.
  END RENDER
END COMPONENT
```

## 5. Wallet Balance Card (`WalletBalanceCard`)

```pseudocode
COMPONENT WalletBalanceCard
  PROPS:
    balance: Wallet_Object { solBalance, usdtBalance, serviceCredits }

  RENDER:
    DISPLAY CardContainer
      DISPLAY Title ("Abstract Wallet Balance")
      IF balance THEN
        DISPLAY BalanceItem ("SOL:", balance.solBalance, " (for Gas)")
        // TEST: SOL balance is displayed correctly.
        DISPLAY BalanceItem ("USDT:", balance.usdtBalance, " (for purchasing Service Credits)")
        // TEST: USDT balance is displayed correctly.
        DISPLAY BalanceItem ("Service Credits:", balance.serviceCredits)
        // TEST: Service Credits are displayed correctly.
      ELSE
        DISPLAY Text ("Wallet information unavailable.")
        // TEST: Message shown if balance object is null.
      END IF
  END RENDER
END COMPONENT
```

## 6. Watched Feeds Section (`WatchedFeedsSection`)

```pseudocode
COMPONENT WatchedFeedsSection
  PROPS:
    feeds: List_of_WatchedFeed_Objects

  RENDER:
    DISPLAY SectionContainer
      DISPLAY Title ("My Watched Feeds (Summaries pushed by specific Agents)")
      IF feeds AND feeds.length > 0 THEN
        LOOP feed IN feeds:
          DISPLAY FeedItem (summary = feed.lastSummary, agentName = feed.agentName) // Assuming agentName is part of WatchedFeed_Object or fetched
          // TEST: Each feed item is displayed with summary and agent name.
        END LOOP
      ELSE
        // This case should ideally be handled by the parent not rendering this component
        DISPLAY Text ("No active feeds.")
        // TEST: Message shown if feeds list is empty (though parent should prevent this).
      END IF
  END RENDER
END COMPONENT
```

## Helper/Utility Functions (Conceptual)

```pseudocode
FUNCTION fetchCurrentUser(): User_Object
  // API call to get current user details
  // RETURN User_Object or throw error
  // TEST: Returns correct user data.
  // TEST: Handles API errors gracefully.
END FUNCTION

FUNCTION fetchAgentStats(userId: STRING): AgentStats_Object
  // API call to get agent statistics for the user
  // RETURN { total, running, scheduled, pendingError } or throw error
  // TEST: Returns correct agent stats.
  // TEST: Handles API errors.
END FUNCTION

FUNCTION fetchRecentLogs(userId: STRING, limit: INTEGER): List_of_AgentActivityLog_Objects
  // API call to get recent activity logs
  // RETURN List_of_AgentActivityLog_Objects or throw error
  // TEST: Returns correct logs, respecting limit.
  // TEST: Handles API errors.
END FUNCTION

FUNCTION fetchWalletBalance(userId: STRING): Wallet_Object
  // API call to get wallet balances
  // RETURN Wallet_Object or throw error
  - // TEST: Returns correct wallet balance.
  - // TEST: Handles API errors.
END FUNCTION

FUNCTION fetchWatchedFeeds(userId: STRING): List_of_WatchedFeed_Objects
  // API call to get watched feeds
  // RETURN List_of_WatchedFeed_Objects or throw error
  // TEST: Returns correct watched feeds.
  // TEST: Handles API errors.
END FUNCTION
```
This pseudocode provides a high-level structure. Actual implementation will involve specific UI framework syntax (e.g., React, Vue, Angular) and state management solutions.