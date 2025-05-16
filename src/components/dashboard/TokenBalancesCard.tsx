'use client';

import React, { useEffect, useState } from 'react';
import { TokenIcon } from '@web3icons/react'; // Import TokenIcon
import { mockWallets, calculateTotalWalletValueUsd } from '@/data/mocks/walletMocks';
import { TokenBalance, Wallet } from '@/types/wallet';
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline'; // Added for P/L
// import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'; // Not used currently

// Helper to format currency
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

const TokenBalancesCard = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [totalValueUsd, setTotalValueUsd] = useState<number>(0);
  const [todaysPL, setTodaysPL] = useState<number>(123.45); // Mock P/L, same as ProfitLossCard
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mockWallets && mockWallets.length > 0) {
      const currentWallet = mockWallets[0]; // Using the first wallet for display
      setWallet(currentWallet);
      setTotalValueUsd(calculateTotalWalletValueUsd(currentWallet));
      // In a real app, P/L would be fetched or calculated here based on currentWallet or overall portfolio
      // For now, using the mock value directly.
      // setTodaysPL(fetchedPLForWallet(currentWallet.id));
    }
    setIsLoading(false);
  }, []);

  // P/L Display Logic (from ProfitLossCard)
  const plColor = todaysPL >= 0 ? 'text-success' : 'text-error';
  const plPrefix = todaysPL >= 0 ? '+' : '';
  const PLIcon = todaysPL >= 0 ? ArrowUpCircleIcon : ArrowDownCircleIcon;

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl h-full min-h-[200px]">
        <div className="card-body items-center justify-center">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (!wallet || !wallet.tokens || wallet.tokens.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl h-full min-h-[200px]">
        <div className="card-body">
          <h2 className="card-title bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Token Balances</h2>
          <p className="text-base-content/70">No token balances found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl h-full overflow-y-auto flex flex-col">
      <div className="card-body flex-grow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <h2 className="card-title bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2 sm:mb-0">Token Portfolio</h2>
          <div className="flex flex-col sm:flex-row sm:items-end gap-x-4 gap-y-1 text-right sm:text-left">
            <div>
              <div className="text-xs text-base-content/70">Total Value</div>
              <div className="text-xl font-bold text-base-content">{formatCurrency(totalValueUsd)}</div>
            </div>
            <div className="sm:border-l sm:border-base-content/20 sm:pl-4">
              <div className="text-xs text-base-content/70 flex items-center sm:justify-start justify-end">
                  <PLIcon className={`w-3 h-3 mr-0.5 ${plColor}`} /> Today's P/L
              </div>
              <div className={`text-md font-semibold ${plColor}`}>{`${plPrefix}${formatCurrency(todaysPL)}`}</div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto flex-grow">
          <table className="table table-sm w-full">
            <thead>
              <tr className="text-base-content/80 text-xs sm:text-sm">
                <th>Token</th>
                <th className="text-right">Balance</th>
                <th className="text-right hidden sm:table-cell">Price</th>
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {wallet.tokens.map((token) => (
                <tr key={token.id} className="hover">
                  <td>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {token.symbol ? (
                        <TokenIcon
                          symbol={token.symbol.toUpperCase()}
                          size={32}
                          className="w-6 h-6 sm:w-8 sm:h-8"
                          variant="branded"
                        />
                      ) : (
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content mask mask-squircle w-6 h-6 sm:w-8 sm:h-8">
                            <span className="text-xs">?</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-base-content">{token.name}</div>
                        <div className="text-xs opacity-70">{token.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono text-xs sm:text-sm text-base-content/90">{formatTokenQuantity(token.balance)}</td>
                  <td className="text-right font-mono text-xs sm:text-sm text-base-content/90 hidden sm:table-cell">{formatCurrency(token.priceUsd)}</td>
                  <td className="text-right font-mono text-xs sm:text-sm font-semibold text-base-content">{formatCurrency((token.balance || 0) * (token.priceUsd || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenBalancesCard;