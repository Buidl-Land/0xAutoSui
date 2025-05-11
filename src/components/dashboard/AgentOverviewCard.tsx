'use client';

import React from 'react';
import Link from 'next/link';

interface AgentStats {
  total: number;
  running: number;
  scheduled: number;
  pendingError: number;
}

interface AgentOverviewCardProps {
  stats?: AgentStats;
  onViewAllAgents: () => void;
}

const AgentOverviewCard: React.FC<AgentOverviewCardProps> = ({ stats, onViewAllAgents }) => {
  const { total = 0, running = 0, scheduled = 0, pendingError = 0 } = stats || {};

  return (
    <div className="card bg-base-300 shadow-xl glassmorphism">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-white">Agent Overview</h2>
        <div className="mt-4 space-y-2">
          <p className="text-base-content-secondary">Total Agents: {total}</p>
          <p className="text-base-content-secondary">Running: {running} (Scheduled: {scheduled})</p>
          <p className="text-base-content-secondary">Pending/Error: {pendingError}</p>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href="/agents" legacyBehavior>
            <a onClick={onViewAllAgents} className="link link-primary">
              View All Agents {'->'}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentOverviewCard;