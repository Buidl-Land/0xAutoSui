'use client';

import React from 'react';
import { TokenIcon } from '@web3icons/react';
import { TicketIcon } from '@heroicons/react/24/outline';

interface WalletBalance {
  solBalance: number;
  usdtBalance: number;
  serviceCredits: number;
}

interface WalletBalanceCardProps {
  balance?: WalletBalance;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ balance }) => {
  const { solBalance = 0, usdtBalance = 0, serviceCredits = 0 } = balance || {};

  return (
    <div className="card bg-base-300 shadow-xl glassmorphism">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-white">Abstract Wallet Balance</h2>
        {balance ? (
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-base-content-secondary">
              <TokenIcon symbol="SOL" size={20} className="w-5 h-5 mr-2" variant="branded" />
              <span>SOL: {solBalance.toFixed(2)} (for Gas)</span>
            </div>
            <div className="flex items-center text-base-content-secondary">
              <TokenIcon symbol="USDT" size={20} className="w-5 h-5 mr-2" variant="branded" />
              <span>USDT: {usdtBalance.toFixed(2)} (for purchasing Service Credits)</span>
            </div>
            <div className="flex items-center text-base-content-secondary">
              <TicketIcon className="w-5 h-5 mr-2 text-primary" />
              <span>Service Credits: {serviceCredits}</span>
            </div>
          </div>
        ) : (
          <p className="text-base-content-secondary mt-4">Wallet information unavailable.</p>
        )}
      </div>
    </div>
  );
};

export default WalletBalanceCard;