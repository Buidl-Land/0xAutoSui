import React from 'react';

const MarketRecommendations = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Marketplace Highlights</h2>
        <p>Recommended Agents & MCPs - Coming Soon</p>
        {/* Example items */}
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-base-200 rounded-lg">
            <h3 className="font-semibold">Trending Agent: SOL Sniper Pro</h3>
            <p className="text-xs">High-frequency SOL trader.</p>
          </div>
          <div className="p-3 bg-base-200 rounded-lg">
            <h3 className="font-semibold">Featured MCP: Advanced Risk Management</h3>
            <p className="text-xs">Protect your capital with this MCP.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketRecommendations;