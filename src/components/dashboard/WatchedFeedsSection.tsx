'use client';

import React from 'react';

interface WatchedFeed {
  feedId: string;
  agentId: string;
  agentName?: string; // Assuming agentName might be populated
  feedName: string;
  lastSummary: string;
  lastUpdatedAt: string; // Or Date
  isActive: boolean;
}

interface WatchedFeedsSectionProps {
  feeds?: WatchedFeed[];
}

const WatchedFeedsSection: React.FC<WatchedFeedsSectionProps> = ({ feeds }) => {
  if (!feeds || feeds.length === 0) {
    return (
      <div className="card bg-base-300 shadow-xl glassmorphism mt-6 md:col-span-2 lg:col-span-3">
        <div className="card-body">
          <h2 className="card-title text-xl font-semibold text-white">My Watched Feeds</h2>
          <p className="text-base-content-secondary mt-4">
            No active feeds. Configure agents to push summaries here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-300 shadow-xl glassmorphism mt-6 md:col-span-2 lg:col-span-3">
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold text-white">
          My Watched Feeds <span className="text-sm text-base-content-secondary">(Summaries pushed by specific Agents)</span>
        </h2>
        <div className="mt-4 space-y-3">
          {feeds.map((feed) => (
            <div key={feed.feedId} className="p-4 rounded-lg bg-base-100/50">
              <h3 className="font-semibold text-primary">{feed.feedName}</h3>
              <p className="text-sm text-base-content-secondary mt-1">{feed.lastSummary}</p>
              <p className="text-xs text-base-content-secondary/70 mt-2">
                From: {feed.agentName || feed.agentId} | Updated: {new Date(feed.lastUpdatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchedFeedsSection;