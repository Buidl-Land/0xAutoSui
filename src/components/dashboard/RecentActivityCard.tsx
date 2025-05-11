'use client';

import React from 'react';
import Link from 'next/link';

interface AgentActivityLog {
  logId: string;
  agentId: string;
  timestamp: string; // Or Date object
  activityType: string;
  description: string;
  details?: any;
  status: 'SUCCESS' | 'FAILURE' | 'INFO' | 'WARNING';
}

interface RecentActivityCardProps {
  logs?: AgentActivityLog[];
  onViewFullLogs: () => void;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ logs, onViewFullLogs }) => {
  const displayLogs = logs && logs.length > 0 ? logs.slice(0, 5) : [];

  return (
    <div className="card bg-base-300 shadow-xl glassmorphism">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-white">Recent Activity / Log Summary</h2>
        <div className="mt-4 space-y-2">
          {displayLogs.length > 0 ? (
            displayLogs.map((log) => (
              <div key={log.logId} className="text-sm text-base-content-secondary">
                <p>
                  <span className={`font-semibold ${log.status === 'FAILURE' ? 'text-error' : 'text-success'}`}>
                    [{log.status}]
                  </span>{' '}
                  {new Date(log.timestamp).toLocaleString()}: {log.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-base-content-secondary">No recent activity.</p>
          )}
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href="/logs" legacyBehavior>
            {/* Assuming /logs is the route for full logs page */}
            <a onClick={onViewFullLogs} className="link link-primary">
              View Full Logs {'->'}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;