'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  WalletTransaction,
  mockWallets,
  mockTransactions,
  TransactionFilterType,
  transactionTypeOptions,
  AutoRefillSetting,
} from '@/types/wallet';
import { User } from '@/types/user'; // Assuming User type exists

// Mock API calls - replace with actual API calls
const fetchCurrentUser = async (): Promise<User> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ userId: 'user-1', username: 'Current User', email: 'user@example.com' }), 500)
  );
};

const fetchUserWalletsAPI = async (userId: string): Promise<Wallet[]> => {
  console.log(`Fetching wallets for userId: ${userId}`);
  return new Promise((resolve) => setTimeout(() => resolve(mockWallets), 500));
};

const fetchWalletTransactionsAPI = async (
  walletId: string,
  filterType: TransactionFilterType,
  dateRange?: { start?: Date; end?: Date }
): Promise<WalletTransaction[]> => {
  console.log(`Fetching transactions for walletId: ${walletId}, filter: ${filterType}, dateRange: ${JSON.stringify(dateRange)}`);
  return new Promise((resolve) =>
    setTimeout(() => {
      let filtered = mockTransactions.filter(tx => tx.walletId === walletId);
      if (filterType !== "ALL") {
        filtered = filtered.filter(tx => tx.type === filterType);
      }
      if (dateRange?.start) {
        filtered = filtered.filter(tx => new Date(tx.timestamp) >= dateRange.start!);
      }
      if (dateRange?.end) {
        filtered = filtered.filter(tx => new Date(tx.timestamp) <= dateRange.end!);
      }
      resolve(filtered);
    }, 500)
  );
};

const updateWalletSettingsAPI = async (walletId: string, settings: { autoRefillSolSettings?: AutoRefillSetting, autoRefillServiceCreditsSettings?: AutoRefillSetting }): Promise<boolean> => {
  console.log(`Updating settings for wallet ${walletId}:`, settings);
  // Mock update logic
  const walletIndex = mockWallets.findIndex(w => w.walletId === walletId);
  if (walletIndex > -1) {
    if (settings.autoRefillSolSettings) {
      mockWallets[walletIndex].autoRefillSolSettings = settings.autoRefillSolSettings;
    }
    if (settings.autoRefillServiceCreditsSettings) {
      mockWallets[walletIndex].autoRefillServiceCreditsSettings = settings.autoRefillServiceCreditsSettings;
    }
  }
  return new Promise(resolve => setTimeout(() => resolve(true), 500));
};


const WalletManagementPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userWallets, setUserWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [transactionFilterType, setTransactionFilterType] = useState<TransactionFilterType>("ALL");
  const [transactionDateRange, setTransactionDateRange] = useState<{ start?: Date; end?: Date } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states (implement actual modals as separate components later)
  const [showDepositSolModal, setShowDepositSolModal] = useState<boolean>(false);
  const [showWithdrawSolModal, setShowWithdrawSolModal] = useState<boolean>(false);
  const [showDepositUsdtModal, setShowDepositUsdtModal] = useState<boolean>(false);
  const [showPurchaseCreditsModal, setShowPurchaseCreditsModal] = useState<boolean>(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState<boolean>(false);

  const loadWalletDetails = useCallback(async (walletId: string) => {
    setIsLoading(true);
    try {
      const wallet = userWallets.find(w => w.walletId === walletId);
      if (wallet) {
        setSelectedWallet(wallet);
        // In a real app, balances might be fetched separately or with transactions
        const fetchedTransactions = await fetchWalletTransactionsAPI(walletId, transactionFilterType, transactionDateRange);
        setTransactions(fetchedTransactions);
      } else {
        setError("Selected wallet not found.");
      }
    } catch (e) {
      setError("Failed to load wallet details.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userWallets, transactionFilterType, transactionDateRange]);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
      const wallets = await fetchUserWalletsAPI(user.userId);
      setUserWallets(wallets);
      if (wallets.length > 0) {
        const defaultWallet = wallets.find(w => w.isDefault) || wallets[0];
        setSelectedWalletId(defaultWallet.walletId);
        // loadWalletDetails will be called by useEffect when selectedWalletId changes
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      setError("Failed to load initial wallet information.");
      console.error(e);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedWalletId) {
      loadWalletDetails(selectedWalletId);
    }
  }, [selectedWalletId, loadWalletDetails]);


  const handleWalletSwitch = (newWalletId: string) => {
    setSelectedWalletId(newWalletId);
  };

  const handleCreateNewWallet = () => {
    setShowCreateWalletModal(true);
    // For now, just log. Implement modal later.
    console.log("Open create new wallet modal");
  };

  const handleAutoRefillChange = (
    settingType: 'SOL' | 'ServiceCredits',
    field: keyof AutoRefillSetting,
    value: any
  ) => {
    if (!selectedWallet) return;

    const updatedWallet = { ...selectedWallet };
    let settingsToUpdate: AutoRefillSetting | undefined;

    if (settingType === 'SOL') {
      updatedWallet.autoRefillSolSettings = { ...(updatedWallet.autoRefillSolSettings || { isEnabled: false, threshold: 0, refillAmount: 0 }), [field]: value };
      settingsToUpdate = updatedWallet.autoRefillSolSettings;
    } else {
      updatedWallet.autoRefillServiceCreditsSettings = { ...(updatedWallet.autoRefillServiceCreditsSettings || { isEnabled: false, threshold: 0, refillAmount: 0 }), [field]: value };
      settingsToUpdate = updatedWallet.autoRefillServiceCreditsSettings;
    }

    setSelectedWallet(updatedWallet);
    // Note: This updates local state. A "Save Settings" button would call an API.
  };

  const saveAutoRefillSettings = async () => {
    if (!selectedWallet) return;
    setIsLoading(true);
    try {
      await updateWalletSettingsAPI(selectedWallet.walletId, {
        autoRefillSolSettings: selectedWallet.autoRefillSolSettings,
        autoRefillServiceCreditsSettings: selectedWallet.autoRefillServiceCreditsSettings,
      });
      // Optionally re-fetch wallet data or just show success
      alert("Auto-refill settings saved.");
    } catch (e) {
      setError("Failed to save auto-refill settings.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (address: string, startChars = 6, endChars = 4) => {
    if (!address) return '';
    return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
  };

  if (isLoading && !selectedWallet) { // Show initial loading spinner
    return <div className="p-6"><div className="loading loading-spinner loading-lg"></div> Initializing Wallets...</div>;
  }

  if (error) {
    return <div className="p-6 text-error">Error: {error} <button className="btn btn-sm btn-primary" onClick={loadInitialData}>Retry</button></div>;
  }

  if (userWallets.length === 0 && !isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Abstract Wallet Management</h1>
        <p>No wallets found. Please create a new wallet.</p>
        <button className="btn btn-primary mt-4" onClick={handleCreateNewWallet}>
          Create New Wallet
        </button>
        {/* TODO: Implement CreateWalletModal */}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-base-200 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Abstract Wallet Management</h1>
        {userWallets.length > 0 && selectedWalletId && (
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <span className="text-sm text-base-content/80">Current Wallet:</span>
            <select
              value={selectedWalletId}
              onChange={(e) => handleWalletSwitch(e.target.value)}
              className="select select-bordered select-sm"
              aria-label="Select Wallet"
            >
              {userWallets.map((wallet) => (
                <option key={wallet.walletId} value={wallet.walletId}>
                  {wallet.walletName} ({truncateAddress(wallet.primarySolAddress)})
                </option>
              ))}
            </select>
            <button className="btn btn-sm btn-outline" onClick={handleCreateNewWallet}>
              Switch/Create
            </button>
          </div>
        )}
      </div>

      {isLoading && selectedWallet && <div className="flex justify-center items-center p-8"><div className="loading loading-spinner loading-lg"></div> Loading Wallet Data...</div>}

      {!isLoading && selectedWallet && (
        <>
          {/* Balance Overview Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">Balance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* SOL Balance */}
                <div className="p-4 border rounded-lg bg-base-200/30">
                  <h3 className="font-semibold text-lg">SOL (for Gas)</h3>
                  <p className="text-2xl my-2">{selectedWallet.solBalance.toFixed(4)} SOL</p>
                  <div className="space-x-2">
                    <button className="btn btn-sm btn-primary" onClick={() => {setShowDepositSolModal(true); console.log("Deposit SOL for", selectedWallet.primarySolAddress)}}>Deposit SOL</button>
                    <button className="btn btn-sm btn-outline" onClick={() => setShowWithdrawSolModal(true)}>Withdraw SOL</button>
                  </div>
                </div>
                {/* USDT Balance */}
                <div className="p-4 border rounded-lg bg-base-200/30">
                  <h3 className="font-semibold text-lg">USDT (for Services)</h3>
                  <p className="text-2xl my-2">{selectedWallet.usdtBalance.toFixed(2)} USDT</p>
                  <div className="space-x-2">
                    <button className="btn btn-sm btn-primary" onClick={() => {setShowDepositUsdtModal(true); console.log("Deposit USDT for", selectedWallet.primaryUsdtAddress)}}>Deposit USDT</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setShowPurchaseCreditsModal(true)}>Purchase Service Credits</button>
                  </div>
                </div>
                {/* Service Credits Balance */}
                <div className="p-4 border rounded-lg bg-base-200/30">
                  <h3 className="font-semibold text-lg">0xAuto Service Credits</h3>
                  <p className="text-2xl my-2">{selectedWallet.serviceCredits} Credits</p>
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowPurchaseCreditsModal(true)}>Purchase More with USDT</button>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Refill Settings Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">Auto-Refill Settings (Optional)</h2>
              <div className="space-y-4 mt-4">
                {/* SOL Auto-Refill */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      checked={selectedWallet.autoRefillSolSettings?.isEnabled || false}
                      onChange={(e) => handleAutoRefillChange('SOL', 'isEnabled', e.target.checked)}
                    />
                    <span className="label-text">When SOL balance is below threshold, automatically transfer SOL from Linked EOA Wallet.</span>
                  </label>
                  {selectedWallet.autoRefillSolSettings?.isEnabled && (
                    <div className="ml-6 mt-2 space-y-2 p-3 border rounded-md bg-base-200/30">
                      <label className="form-control w-full max-w-xs">
                        <div className="label"><span className="label-text">Threshold (SOL):</span></div>
                        <input type="number" placeholder="e.g., 0.2" className="input input-sm input-bordered w-full max-w-xs"
                               value={selectedWallet.autoRefillSolSettings.threshold}
                               onChange={(e) => handleAutoRefillChange('SOL', 'threshold', parseFloat(e.target.value))} />
                      </label>
                       <label className="form-control w-full max-w-xs">
                        <div className="label"><span className="label-text">Refill Amount (SOL):</span></div>
                        <input type="number" placeholder="e.g., 1" className="input input-sm input-bordered w-full max-w-xs"
                               value={selectedWallet.autoRefillSolSettings.refillAmount}
                               onChange={(e) => handleAutoRefillChange('SOL', 'refillAmount', parseFloat(e.target.value))} />
                      </label>
                       <label className="form-control w-full max-w-xs">
                        <div className="label"><span className="label-text">Linked EOA Wallet:</span></div>
                        <input type="text" placeholder="Solana Address" className="input input-sm input-bordered w-full max-w-xs"
                               value={selectedWallet.linkedEoaForSolRefill || ''}
                               onChange={(e) => setSelectedWallet(prev => prev ? {...prev, linkedEoaForSolRefill: e.target.value} : null)} />
                      </label>
                    </div>
                  )}
                </div>
                {/* Service Credits Auto-Refill */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      checked={selectedWallet.autoRefillServiceCreditsSettings?.isEnabled || false}
                      onChange={(e) => handleAutoRefillChange('ServiceCredits', 'isEnabled', e.target.checked)}
                    />
                    <span className="label-text">When Service Credits are below threshold, automatically purchase Credits using USDT.</span>
                  </label>
                  {selectedWallet.autoRefillServiceCreditsSettings?.isEnabled && (
                     <div className="ml-6 mt-2 space-y-2 p-3 border rounded-md bg-base-200/30">
                      <label className="form-control w-full max-w-xs">
                        <div className="label"><span className="label-text">Threshold (Credits):</span></div>
                        <input type="number" placeholder="e.g., 1000" className="input input-sm input-bordered w-full max-w-xs"
                               value={selectedWallet.autoRefillServiceCreditsSettings.threshold}
                               onChange={(e) => handleAutoRefillChange('ServiceCredits', 'threshold', parseInt(e.target.value))} />
                      </label>
                       <label className="form-control w-full max-w-xs">
                        <div className="label"><span className="label-text">Purchase Amount (Credits):</span></div>
                        <input type="number" placeholder="e.g., 5000" className="input input-sm input-bordered w-full max-w-xs"
                               value={selectedWallet.autoRefillServiceCreditsSettings.refillAmount}
                               onChange={(e) => handleAutoRefillChange('ServiceCredits', 'refillAmount', parseInt(e.target.value))} />
                      </label>
                    </div>
                  )}
                </div>
                <button className="btn btn-primary btn-sm" onClick={saveAutoRefillSettings}>Save Refill Settings</button>
              </div>
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl">Transaction History</h2>
              <div className="flex flex-col sm:flex-row gap-4 my-4 items-center">
                <select
                  value={transactionFilterType}
                  onChange={(e) => setTransactionFilterType(e.target.value as TransactionFilterType)}
                  className="select select-bordered select-sm"
                  aria-label="Filter by transaction type"
                >
                  {transactionTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="date"
                  className="input input-sm input-bordered"
                  aria-label="Transaction date range start"
                  onChange={e => setTransactionDateRange(prev => ({...prev, start: e.target.value ? new Date(e.target.value) : undefined}))}
                />
                <span className="text-base-content/80">to</span>
                 <input
                  type="date"
                  className="input input-sm input-bordered"
                  aria-label="Transaction date range end"
                  onChange={e => setTransactionDateRange(prev => ({...prev, end: e.target.value ? new Date(e.target.value) : undefined}))}
                />
              </div>

              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Type</th>
                        <th>Agent</th>
                        <th>Description/MCP</th>
                        <th>Amount/Credits</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.transactionId}>
                          <td>{new Date(tx.timestamp).toLocaleString()}</td>
                          <td>{tx.type.replace(/_/g, ' ')}</td>
                          <td>{tx.agentId || '-'}</td>
                          <td>{tx.description} {tx.mcpId ? `(${tx.mcpId})` : ''}</td>
                          <td className={tx.amount < 0 ? 'text-error' : 'text-success'}>
                            {tx.amount.toFixed(tx.currency === 'SOL' ? 4 : tx.currency === 'USDT' ? 2 : 0)} {tx.currency}
                          </td>
                          <td><span className={`badge badge-sm ${
                            tx.status === 'COMPLETED' ? 'badge-success' :
                            tx.status === 'PENDING' ? 'badge-warning' :
                            tx.status === 'FAILED' ? 'badge-error' : 'badge-ghost'
                          }`}>{tx.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4 text-base-content/70">No transactions found for the selected filters.</p>
              )}
              {/* TODO: Implement pagination if needed */}
            </div>
          </div>
        </>
      )}

      {/* Modals would be rendered here, e.g., <DepositSolModal isOpen={showDepositSolModal} ... /> */}
      {showDepositSolModal && <div className="modal modal-open"><div className="modal-box"><h3>Deposit SOL</h3><p>Deposit to: {selectedWallet?.primarySolAddress}</p><button className="btn btn-sm mt-4" onClick={()=>setShowDepositSolModal(false)}>Close</button></div></div>}
      {showWithdrawSolModal && <div className="modal modal-open"><div className="modal-box"><h3>Withdraw SOL</h3><p>Withdraw from: {selectedWallet?.primarySolAddress}</p><button className="btn btn-sm mt-4" onClick={()=>setShowWithdrawSolModal(false)}>Close</button></div></div>}
      {showDepositUsdtModal && <div className="modal modal-open"><div className="modal-box"><h3>Deposit USDT</h3><p>Deposit to: {selectedWallet?.primaryUsdtAddress}</p><button className="btn btn-sm mt-4" onClick={()=>setShowDepositUsdtModal(false)}>Close</button></div></div>}
      {showPurchaseCreditsModal && <div className="modal modal-open"><div className="modal-box"><h3>Purchase Service Credits</h3><p>Using USDT from: {selectedWallet?.primaryUsdtAddress}</p><button className="btn btn-sm mt-4" onClick={()=>setShowPurchaseCreditsModal(false)}>Close</button></div></div>}
      {showCreateWalletModal && <div className="modal modal-open"><div className="modal-box"><h3>Create New Wallet</h3><p>Wallet creation form...</p><button className="btn btn-sm mt-4" onClick={()=>setShowCreateWalletModal(false)}>Close</button></div></div>}

    </div>
  );
};

export default WalletManagementPage;