'use client';

import React from 'react';

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
            <p className="text-base-content-secondary">
              SOL: {solBalance.toFixed(2)} (for Gas)
            </p>
            <p className="text-base-content-secondary">
              USDT: {usdtBalance.toFixed(2)} (for purchasing Service Credits)
            </p>
            <p className="text-base-content-secondary">
              Service Credits: {serviceCredits}
            </p>
          </div>
        ) : (
          <p className="text-base-content-secondary mt-4">Wallet information unavailable.</p>
        )}
      </div>
    </div>
  );
};

export default WalletBalanceCard;