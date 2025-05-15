'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Wallet as WalletType,
  WalletTransaction,
  TransactionFilterType,
  transactionTypeOptions,
  AutoRefillSetting,
  TokenBalance
} from '@/types/wallet';
import { User } from '@/types/user';
import { fetchMockCurrentUser } from '@/data/mocks/userMocks';
import {
  fetchMockUserWallets,
  fetchMockWalletTransactions,
  updateMockWalletSettingsAPI,
  calculateTotalWalletValueUsd
} from '@/data/mocks/walletMocks';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusCircleIcon,
  CreditCardIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import ClientOnlyFormatDate from '@/components/utils/ClientOnlyFormatDate';

const formatCurrency = (value: number | undefined, symbol: string = '$') => {
  if (value === undefined) return `${symbol}--.--`;
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatTokenQuantity = (value: number | undefined) => {
  if (value === undefined) return '--.--';
  if (value === 0) return '0.00';
  if (Math.abs(value) < 0.000001 && value !== 0) return value.toExponential(2);
  if (Math.abs(value) > 1000000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (Math.abs(value) < 1) return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const WalletManagementPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userWallets, setUserWallets] = useState<WalletType[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [transactionFilterType, setTransactionFilterType] = useState<TransactionFilterType>("ALL");
  const [transactionDateRange, setTransactionDateRange] = useState<{ start?: Date; end?: Date } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalWalletValue, setTotalWalletValue] = useState<number>(0);

  const [showCreateWalletModal, setShowCreateWalletModal] = useState<boolean>(false);

  const loadWalletDetails = useCallback(async (walletId: string) => {
    setIsLoading(true);
    try {
      const wallet = userWallets.find(w => w.walletId === walletId);
      if (wallet) {
        setSelectedWallet(wallet);
        setTotalWalletValue(calculateTotalWalletValueUsd(wallet));
        const fetchedTransactions = await fetchMockWalletTransactions(walletId);
        let filtered = fetchedTransactions;
        if (transactionFilterType !== "ALL") {
            filtered = filtered.filter(tx => tx.type === transactionFilterType);
        }
        if (transactionDateRange?.start) {
            filtered = filtered.filter(tx => new Date(tx.timestamp) >= transactionDateRange.start!);
        }
        if (transactionDateRange?.end) {
            filtered = filtered.filter(tx => new Date(tx.timestamp) <= transactionDateRange.end!);
        }
        setTransactions(filtered);
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
      const user = await fetchMockCurrentUser();
      setCurrentUser(user);
      if (user) {
        const wallets = await fetchMockUserWallets(user.userId);
        setUserWallets(wallets);
        if (wallets.length > 0) {
          const defaultWallet = wallets.find(w => w.isDefault) || wallets[0];
          setSelectedWalletId(defaultWallet.walletId);
        } else {
          setIsLoading(false);
        }
      } else {
        setError("Could not load user data.");
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
    } else {
      setSelectedWallet(null);
      setTransactions([]);
      setTotalWalletValue(0);
    }
  }, [selectedWalletId, loadWalletDetails]);

  const handleWalletSwitch = (newWalletId: string) => {
    setSelectedWalletId(newWalletId);
  };

  const handleCreateNewWallet = () => {
    setShowCreateWalletModal(true);
    console.log("Open create new wallet modal");
  };

  const handleSend = () => {
    console.log("Open Send modal for wallet:", selectedWallet?.walletId);
  };

  const handleReceive = () => {
    console.log("Open Receive modal for wallet:", selectedWallet?.walletId, "Address:", selectedWallet?.primarySolAddress);
  };

  const handlePurchaseServiceCredits = () => {
    console.log("Open Purchase Service Credits modal");
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
  };

  const saveAutoRefillSettings = async () => {
    if (!selectedWallet) return;
    setIsLoading(true);
    try {
      await updateMockWalletSettingsAPI(selectedWallet.walletId, {
        autoRefillSolSettings: selectedWallet.autoRefillSolSettings,
        autoRefillServiceCreditsSettings: selectedWallet.autoRefillServiceCreditsSettings,
      });
      alert("Auto-refill settings saved (mock).");
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

  if (isLoading && !selectedWallet && userWallets.length > 0) {
    return <div className="p-6 flex flex-col items-center justify-center min-h-screen"><div className="loading loading-spinner loading-lg mb-2"></div> Initializing Wallets...</div>;
  }

  if (error) {
    return <div className="p-6 text-error">Error: {error} <button className="btn btn-sm btn-primary" onClick={loadInitialData}>Retry</button></div>;
  }

  if (userWallets.length === 0 && !isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-base-content">Abstract Wallet Management</h1>
        <p className="text-base-content/80">No wallets found. Please create a new wallet.</p>
        <button className="btn btn-primary mt-4" onClick={handleCreateNewWallet}>
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-base-200 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-base-content">Wallet Dashboard</h1>
        {userWallets.length > 0 && selectedWalletId && (
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <select
              value={selectedWalletId}
              onChange={(e) => handleWalletSwitch(e.target.value)}
              className="select select-bordered select-primary"
              aria-label="Select Wallet"
            >
              {userWallets.map((wallet) => (
                <option key={wallet.walletId} value={wallet.walletId}>
                  {wallet.walletName} ({truncateAddress(wallet.primarySolAddress)})
                </option>
              ))}
            </select>
            <button className="btn btn-outline btn-primary" onClick={handleCreateNewWallet}>
              <PlusCircleIcon className="h-5 w-5" /> Switch/Create
            </button>
          </div>
        )}
      </div>

      {isLoading && selectedWallet && <div className="flex justify-center items-center p-8"><div className="loading loading-spinner loading-lg"></div> Loading Wallet Data...</div>}

      {!isLoading && selectedWallet && (
        <>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="card-title text-2xl text-base-content">Portfolio Overview</h2>
                <div className="text-right mt-2 sm:mt-0">
                  <div className="text-sm text-base-content/70">Total Wallet Value</div>
                  <div className="text-3xl font-bold text-primary">{formatCurrency(totalWalletValue)}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                  <button className="btn btn-primary" onClick={handleSend}>
                    <ArrowUpTrayIcon className="h-5 w-5 mr-1" /> Send
                  </button>
                  <button className="btn btn-secondary" onClick={handleReceive}>
                    <ArrowDownTrayIcon className="h-5 w-5 mr-1" /> Receive / Deposit
                  </button>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-base-content/90">Token Balances</h3>
              {selectedWallet.tokens && selectedWallet.tokens.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="text-base-content/80">
                        <th>Token</th>
                        <th className="text-right">Balance</th>
                        <th className="text-right hidden sm:table-cell">Price</th>
                        <th className="text-right">Value (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedWallet.tokens.map((token) => (
                        <tr key={token.id} className="hover">
                          <td>
                            <div className="flex items-center space-x-3">
                              {token.iconUrl && (
                                <div className="avatar">
                                  <div className="mask mask-squircle w-8 h-8">
                                    <Image src={token.iconUrl} alt={token.name} width={32} height={32} />
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-base-content">{token.name}</div>
                                <div className="text-sm opacity-70">{token.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right font-mono text-base-content/90">{formatTokenQuantity(token.balance)}</td>
                          <td className="text-right font-mono text-base-content/90 hidden sm:table-cell">{formatCurrency(token.priceUsd)}</td>
                          <td className="text-right font-mono font-semibold text-base-content">{formatCurrency((token.balance || 0) * (token.priceUsd || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-base-content/70">No token balances in this wallet.</p>
              )}

              <div className="divider mt-6 mb-4"></div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-base-200/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg text-secondary">
                        <CreditCardIcon className="h-6 w-6 mr-2 inline-block" />
                        0xAuto Service Credits
                    </h3>
                    <p className="text-3xl my-1 font-bold text-secondary">{selectedWallet.serviceCredits.toLocaleString()} <span className="text-lg font-normal">Credits</span></p>
                  </div>
                  <button className="btn btn-secondary btn-outline mt-2 sm:mt-0" onClick={handlePurchaseServiceCredits}>
                      Purchase More
                  </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
            <h2 className="card-title text-xl text-base-content">
                <CogIcon className="h-6 w-6 mr-1" /> Auto-Refill Settings
            </h2>
              <div className="space-y-6 mt-4">
                <div className="p-4 border rounded-lg bg-base-200/30">
                  <h3 className="font-semibold text-base-content/90 mb-2">SOL for Gas Fees</h3>
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary mr-2"
                      checked={selectedWallet.autoRefillSolSettings?.isEnabled || false}
                      onChange={(e) => handleAutoRefillChange('SOL', 'isEnabled', e.target.checked)}
                    />
                    Enable SOL Auto-Refill
                  </label>
                  {selectedWallet.autoRefillSolSettings?.isEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <label className="label label-text text-xs">Refill Threshold (SOL)</label>
                        <input
                          type="number"
                          placeholder="e.g., 0.1"
                          className="input input-bordered input-sm w-full"
                          value={selectedWallet.autoRefillSolSettings?.threshold || ''}
                          onChange={(e) => handleAutoRefillChange('SOL', 'threshold', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="label label-text text-xs">Refill Amount (SOL)</label>
                        <input
                          type="number"
                          placeholder="e.g., 0.5"
                          className="input input-bordered input-sm w-full"
                          value={selectedWallet.autoRefillSolSettings?.refillAmount || ''}
                          onChange={(e) => handleAutoRefillChange('SOL', 'refillAmount', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="label label-text text-xs">Source EOA (Optional)</label>
                        <input
                          type="text"
                          placeholder="Linked EOA Address"
                          className="input input-bordered input-sm w-full"
                          value={selectedWallet.autoRefillSolSettings?.sourceEoaWalletId || ''}
                          onChange={(e) => handleAutoRefillChange('SOL', 'sourceEoaWalletId', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg bg-base-200/30">
                  <h3 className="font-semibold text-base-content/90 mb-2">Service Credits</h3>
                   <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary mr-2"
                      checked={selectedWallet.autoRefillServiceCreditsSettings?.isEnabled || false}
                      onChange={(e) => handleAutoRefillChange('ServiceCredits', 'isEnabled', e.target.checked)}
                    />
                    Enable Credits Auto-Refill (via Primary USDT)
                  </label>
                  {selectedWallet.autoRefillServiceCreditsSettings?.isEnabled && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <label className="label label-text text-xs">Refill Threshold (Credits)</label>
                        <input
                          type="number"
                          placeholder="e.g., 1000"
                          className="input input-bordered input-sm w-full"
                          value={selectedWallet.autoRefillServiceCreditsSettings?.threshold || ''}
                          onChange={(e) => handleAutoRefillChange('ServiceCredits', 'threshold', parseInt(e.target.value, 10))}
                        />
                      </div>
                      <div>
                        <label className="label label-text text-xs">Refill Amount (Credits)</label>
                        <input
                          type="number"
                          placeholder="e.g., 5000"
                          className="input input-bordered input-sm w-full"
                          value={selectedWallet.autoRefillServiceCreditsSettings?.refillAmount || ''}
                          onChange={(e) => handleAutoRefillChange('ServiceCredits', 'refillAmount', parseInt(e.target.value, 10))}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right mt-4">
                    <button className="btn btn-primary" onClick={saveAutoRefillSettings} disabled={isLoading}>
                        {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <CogIcon className="h-5 w-5 mr-2" />} Save Settings
                    </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="card-title text-xl text-base-content">Transaction History</h2>
              </div>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="text-base-content/80">
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th className="text-right">Amount</th>
                        <th className="text-right hidden md:table-cell">Balance After</th>
                        <th className="text-center hidden sm:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.transactionId} className="hover">
                          <td className="text-xs whitespace-nowrap">
                            <ClientOnlyFormatDate timestamp={tx.timestamp} placeholder="Processing..." />
                          </td>
                          <td><span className={`badge badge-sm ${tx.type.includes('DEPOSIT') || tx.type.includes('PURCHASE') ? 'badge-success' : 'badge-ghost'}`}>{tx.type.replace(/_/g, ' ')}</span></td>
                          <td>{tx.description}</td>
                          <td className={`text-right font-mono ${tx.amount > 0 ? 'text-success' : tx.amount < 0 ? 'text-error' : ''}`}>
                            {tx.amount.toLocaleString(undefined, {minimumFractionDigits: tx.currency === 'SOL' ? 3 : 2, maximumFractionDigits: tx.currency === 'SOL' ? 5 : 2})} {tx.currency}
                          </td>
                          <td className="text-right font-mono hidden md:table-cell">{tx.balanceAfter.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {tx.currency === 'SERVICE_CREDITS' ? 'Credits' : tx.currency}</td>
                          <td className="text-center hidden sm:table-cell">
                            <span className={`badge badge-sm ${tx.status === 'COMPLETED' ? 'badge-success' : tx.status === 'PENDING' ? 'badge-warning' : 'badge-error'}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-base-content/70">No transactions found for the selected criteria.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletManagementPage;