'use client';

import React from 'react';
import Link from 'next/link';
import { FiInfo, FiDownloadCloud, FiStar } from 'react-icons/fi';

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
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
      <div className="card-body p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-base sm:text-lg font-semibold mb-1 line-clamp-1">
            {provider.name}
          </h2>
          <div className="flex items-center gap-1">
            <div className="badge badge-sm badge-primary flex items-center gap-1">
              <FiStar size={12} /> {provider.rating.toFixed(1)}
            </div>
            <span className="badge badge-sm badge-outline">{provider.version || "1.0.0"}</span>
          </div>
        </div>
        
        <p className="text-xs text-base-content/70 mb-2">
          Active users: <span className="font-medium">{provider.activeUsers}</span>
        </p>
        
        <p className="text-sm text-base-content/90 mb-3 line-clamp-4 min-h-[5rem]">
          {provider.description.length > 100 ? `${provider.description.substring(0, 100)}...` : provider.description}
        </p>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {provider.categories.map((category) => (
              <span key={category} className="badge badge-ghost badge-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium">
            Total MCP Tools: <span className="text-primary">{provider.totalMCPs}</span>
          </p>
        </div>

        <div className="card-actions justify-end mt-auto space-x-2">
          <Link href={`/mcp-hub/${provider.id}`} className="btn btn-sm btn-outline btn-primary">
            <FiInfo className="mr-1" /> <span className="hidden xs:inline">Details</span>
          </Link>
          <button
            className="btn btn-sm btn-primary"
          >
            <FiDownloadCloud className="mr-1" /> <span className="hidden xs:inline">Get Server</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default McpCard; 