# Page E: Abstract Wallet Management - Pseudocode

This document provides high-level pseudocode for the Abstract Wallet Management page.

## 1. Wallet Management Page (`WalletManagementPage`)

```pseudocode
COMPONENT WalletManagementPage
  STATE:
    currentUser: User_Object (nullable)
    userWallets: List_of_Wallet_Objects (nullable)
    selectedWallet: Wallet_Object (nullable)
    selectedWalletId: STRING (nullable)
    transactions: List_of_WalletTransaction_Objects (nullable)
    transactionFilterType: STRING ("ALL" by default)
    transactionDateRange: Object (nullable) // { start, end }
    isLoading: BOOLEAN (true by default)
    error: STRING (nullable)
    // Modal states
    showDepositSolModal: BOOLEAN (false)
    showWithdrawSolModal: BOOLEAN (false)
    showDepositUsdtModal: BOOLEAN (false)
    showPurchaseCreditsModal: BOOLEAN (false)
    showCreateWalletModal: BOOLEAN (false)

  ON_INIT:
    // TEST: ON_INIT fetches current user and their wallets.
    CALL loadInitialData()

  FUNCTION loadInitialData():
    SET isLoading = true
    SET error = null
    TRY
      currentUser = CALL fetchCurrentUser() // API
      userWallets = CALL fetchUserWalletsAPI(currentUser.userId) // API
      // TEST: fetchUserWalletsAPI returns a list of wallets.
      IF userWallets IS NOT EMPTY THEN
        // Select the default wallet or the first one
        selectedWallet = FIND wallet IN userWallets WHERE wallet.isDefault IS TRUE OR first(userWallets)
        selectedWalletId = selectedWallet.walletId
        CALL loadWalletDetails(selectedWalletId)
      ELSE
        // Handle case with no wallets (e.g., prompt to create one)
        SET isLoading = false
      END IF
    CATCH exception
      SET error = "Failed to load wallet information."
      SET isLoading = false
      // TEST: Error is set if initial data load fails.
    END TRY
  END FUNCTION

  FUNCTION loadWalletDetails(walletId: STRING):
    // Fetches balances for selectedWallet and its transactions
    // This might be partially covered if fetchUserWalletsAPI returns full wallet objects
    // Or, make specific calls:
    // selectedWallet.solBalance = CALL fetchSolBalanceAPI(walletId)
    // selectedWallet.usdtBalance = CALL fetchUsdtBalanceAPI(walletId)
    // selectedWallet.serviceCredits = CALL fetchServiceCreditsAPI(walletId)
    transactions = CALL fetchWalletTransactionsAPI(walletId, transactionFilterType, transactionDateRange) // API
    // TEST: fetchWalletTransactionsAPI returns transactions based on filters.
    SET isLoading = false
  END FUNCTION

  FUNCTION handleWalletSwitch(newWalletId: STRING):
    // TEST: handleWalletSwitch updates selectedWalletId and reloads details.
    SET selectedWalletId = newWalletId
    selectedWallet = FIND wallet IN userWallets WHERE wallet.walletId == newWalletId
    SET isLoading = true
    CALL loadWalletDetails(newWalletId)
  END FUNCTION

  FUNCTION handleCreateNewWallet():
    // TEST: handleCreateNewWallet shows create wallet modal or navigates to creation page.
    SET showCreateWalletModal = true
  END FUNCTION

  // --- Balance Overview Actions ---
  FUNCTION handleDepositSol(): SET showDepositSolModal = true
  FUNCTION handleWithdrawSol(): SET showWithdrawSolModal = true
  FUNCTION handleDepositUsdt(): SET showDepositUsdtModal = true
  FUNCTION handlePurchaseServiceCredits(): SET showPurchaseCreditsModal = true
    // TEST: Each action button correctly opens its respective modal.

  // --- Auto-Refill Settings ---
  FUNCTION handleAutoRefillChange(settingType: STRING, field: STRING, value: ANY):
    // Updates selectedWallet.autoRefillSolSettings or selectedWallet.autoRefillServiceCreditsSettings
    // e.g., selectedWallet.autoRefillSolSettings.isEnabled = value
    // TEST: handleAutoRefillChange updates the correct auto-refill setting.
    // This should likely trigger a save action or be part of a larger save settings function.
  END FUNCTION

  FUNCTION saveAutoRefillSettings():
    // CALL updateWalletSettingsAPI(selectedWalletId, { autoRefillSolSettings, autoRefillServiceCreditsSettings })
    // TEST: saveAutoRefillSettings successfully saves settings via API.
    SHOW_NOTIFICATION("Auto-refill settings saved.")
  END FUNCTION

  // --- Transaction History ---
  FUNCTION handleTransactionFilterTypeChange(newType: STRING):
    // TEST: handleTransactionFilterTypeChange updates filter and re-fetches transactions.
    SET transactionFilterType = newType
    CALL loadWalletDetails(selectedWalletId) // Re-fetch transactions
  END FUNCTION

  FUNCTION handleTransactionDateRangeChange(newRange: Object):
    // TEST: handleTransactionDateRangeChange updates filter and re-fetches transactions.
    SET transactionDateRange = newRange
    CALL loadWalletDetails(selectedWalletId) // Re-fetch transactions
  END FUNCTION

  RENDER:
    DISPLAY PageLayout (currentUser = currentUser) // Includes header
      DISPLAY Title ("Abstract Wallet Management")

      IF userWallets AND userWallets.length > 0 THEN
        DISPLAY Dropdown (
          label = "Current Wallet:",
          options = userWallets.map(w => { name: `${w.walletName} (${TRUNCATE_ADDRESS(w.primarySolAddress)})`, value: w.walletId }),
          selectedValue = selectedWalletId,
          onChange = handleWalletSwitch
        )
      END IF
      DISPLAY Button ("[Switch Wallet / Create New Wallet]", onClick = handleCreateNewWallet) // Or integrate into dropdown

      IF isLoading THEN
        DISPLAY LoadingSpinner
      ELSE IF error THEN
        DISPLAY ErrorMessage (message = error)
      ELSE IF selectedWallet THEN
        // Balance Overview Section
        DISPLAY SectionTitle ("Balance Overview:")
        DISPLAY BalanceItem (label="SOL (for Gas):", value=`${selectedWallet.solBalance} SOL`)
        DISPLAY Button ("[Deposit SOL]", onClick = handleDepositSol)
        DISPLAY Button ("[Withdraw SOL]", onClick = handleWithdrawSol)
        // ... (USDT and Service Credits similar structure)
        // TEST: Balances and action buttons are displayed correctly.

        // Auto-Refill Settings Section
        DISPLAY SectionTitle ("Auto-Refill Settings (Optional):")
        DISPLAY Checkbox (label="Auto-refill SOL...", checked=selectedWallet.autoRefillSolSettings.isEnabled, onChange=(val)=>handleAutoRefillChange("SOL", "isEnabled", val))
        IF selectedWallet.autoRefillSolSettings.isEnabled THEN
          DISPLAY TextInput(label="Threshold (SOL)", value=selectedWallet.autoRefillSolSettings.threshold, onChange=...)
          DISPLAY TextInput(label="Refill Amount (SOL)", value=selectedWallet.autoRefillSolSettings.refillAmount, onChange=...)
          DISPLAY TextInput(label="Linked EOA", value=selectedWallet.linkedEoaForSolRefill, onChange=...)
        END IF
        // ... (Service Credits auto-refill similar structure)
        DISPLAY Button("Save Refill Settings", onClick=saveAutoRefillSettings)
        // TEST: Auto-refill settings are displayed and configurable.

        // Transaction History Section
        DISPLAY SectionTitle ("Transaction History:")
        DISPLAY FilterControls (typeOptions=[...], dateRangeOptions=[...], onTypeChange=handleTransactionFilterTypeChange, onDateChange=handleTransactionDateRangeChange)
        IF transactions AND transactions.length > 0 THEN
          DISPLAY TransactionTable (transactions = transactions)
          // TEST: Transaction table is rendered with transactions.
          // Potentially add pagination for transactions
        ELSE
          DISPLAY Text ("No transactions found for the selected filters.")
          // TEST: Message shown for no transactions.
        END IF
      ELSE
        DISPLAY Text ("No wallet selected or available. Please create or select a wallet.")
        // TEST: Message shown when no wallet is selected.
      END IF

      // Modals
      IF showDepositSolModal THEN DISPLAY DepositSolModal (walletAddress=selectedWallet.primarySolAddress, onClose=()=>SET showDepositSolModal=false)
      // ... (other modals: WithdrawSolModal, DepositUsdtModal, PurchaseCreditsModal, CreateWalletModal)
      // TEST: Modals are shown/hidden correctly.
  END RENDER
END COMPONENT

## Helper/Utility Functions (Conceptual)

FUNCTION fetchUserWalletsAPI(userId: STRING): List_of_Wallet_Objects
  // API call
END FUNCTION

FUNCTION fetchWalletTransactionsAPI(walletId: STRING, filterType: STRING, dateRange: Object): List_of_WalletTransaction_Objects
  // API call
END FUNCTION

FUNCTION updateWalletSettingsAPI(walletId: STRING, settings: Object)
  // API call to save auto-refill settings, linked EOA, etc.
END FUNCTION

// Functions for deposit, withdrawal, purchase credits would likely involve backend calls
// and potentially interaction with external services/blockchains.
// e.g., initiatePurchaseServiceCreditsAPI(walletId, usdtAmount, creditsToPurchase)