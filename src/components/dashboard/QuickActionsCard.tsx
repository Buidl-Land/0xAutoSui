'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircleIcon, ShoppingBagIcon, WalletIcon } from '@heroicons/react/24/outline';

interface QuickActionsCardProps {
  onCreateNewAgent: () => void;
  onBrowseMCP: () => void;
  onManageWallet: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onCreateNewAgent,
  onBrowseMCP,
  onManageWallet,
}) => {
  return (
    <div className="card bg-base-300 shadow-xl glassmorphism">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 space-y-3">
          <button
            onClick={onCreateNewAgent}
            className="btn btn-primary btn-block group"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            Create New Agent
          </button>
          <Link href="/store" passHref legacyBehavior>
            <a onClick={onBrowseMCP} className="btn btn-secondary btn-block group">
              <ShoppingBagIcon className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Browse MCP Marketplace
            </a>
          </Link>
          <Link href="/wallet" passHref legacyBehavior>
            {/* Assuming /wallet is the route for wallet management */}
            <a onClick={onManageWallet} className="btn btn-accent btn-block group">
              <WalletIcon className="h-5 w-5 mr-2 group-hover:animate-ping" />
              Manage My Wallet
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsCard;