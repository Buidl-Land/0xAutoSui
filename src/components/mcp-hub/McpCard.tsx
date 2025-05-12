'use client';

import React from 'react';
import Link from 'next/link';
import { FiInfo, FiDownloadCloud } from 'react-icons/fi';

interface MCPProvider {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  totalMCPs: number;
  activeUsers: number;
  categories: string[];
  createdAt: string;
  version?: string;
}

interface McpCardProps {
  provider: MCPProvider;
}

const McpCard: React.FC<McpCardProps> = ({ provider }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <h2 className="card-title text-lg font-semibold mb-1">
            {provider.name}
          </h2>
          <span className="badge badge-sm badge-outline">{provider.version || "1.0.0"}</span>
        </div>
        
        <p className="text-xs text-base-content/70 mb-2">
          Active users: <span className="font-medium">{provider.activeUsers}</span>
        </p>
        
        <p className="text-sm text-base-content/90 mb-3 h-20 overflow-hidden text-ellipsis">
          {provider.description.length > 100 ? `${provider.description.substring(0, 100)}...` : provider.description}
        </p>
        
        <div className="mb-3">
          {provider.categories.map((category) => (
            <span key={category} className="badge badge-ghost badge-sm mr-1 mb-1">
              {category}
            </span>
          ))}
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium">
            Total MCP Tools: <span className="text-primary">{provider.totalMCPs}</span>
          </p>
        </div>

        <div className="card-actions justify-end space-x-2">
          <Link href={`/mcp-hub/${provider.id}`} className="btn btn-sm btn-outline btn-primary">
            <FiInfo className="mr-1" /> Details
          </Link>
          <button
            className="btn btn-sm btn-primary"
          >
            <FiDownloadCloud className="mr-1" /> Get Server
          </button>
        </div>
      </div>
    </div>
  );
};

export default McpCard; 