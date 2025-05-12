'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircleIcon, ShoppingBagIcon, WalletIcon, ServerIcon } from '@heroicons/react/24/outline';

interface QuickActionsCardProps {
  onCreateNewAgent: () => void;
  onBrowseAgentStore: () => void;
  onBrowseMcpHub: () => void;
  onManageWallet: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onCreateNewAgent,
  onBrowseAgentStore,
  onBrowseMcpHub,
  onManageWallet,
}) => {
  return (
    <div className="card bg-base-300 shadow-xl glassmorphism">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 space-y-3">
          <Link href="/agents/create" passHref legacyBehavior>
            <a onClick={onCreateNewAgent} className="btn btn-primary btn-block group">
              <PlusCircleIcon className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Create New Agent
            </a>
          </Link>
          <Link href="/store" passHref legacyBehavior>
            <a onClick={onBrowseAgentStore} className="btn btn-secondary btn-block group">
              <ShoppingBagIcon className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Browse Agent Store
            </a>
          </Link>
          <Link href="/mcp-hub" passHref legacyBehavior>
            <a onClick={onBrowseMcpHub} className="btn btn-accent btn-block group">
              <ServerIcon className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Browse MCP Hub
            </a>
          </Link>
          <Link href="/wallet" passHref legacyBehavior>
            {/* Assuming /wallet is the route for wallet management */}
            <a onClick={onManageWallet} className="btn btn-outline btn-block group">
              <WalletIcon className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Manage My Wallet
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsCard;