'use client';

import React from 'react';
import Link from 'next/link';
import { FiStar, FiDownloadCloud, FiSettings, FiTrash2, FiBox } from 'react-icons/fi';
import { MCPProvider } from '@/data/mockMcpServers';

interface McpCardProps {
  provider: MCPProvider;
  isInstalled: boolean;
}

const McpCard: React.FC<McpCardProps> = ({ provider, isInstalled }) => {
  return (
    <div className="relative card border border-base-300 bg-base-100 shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col group">
      {/* Make entire card clickable */}
      <Link href={`/mcp-hub/${provider.id}`} className="absolute inset-0 z-10 cursor-pointer">
        <span className="sr-only">View details for {provider.name}</span>
      </Link>
      
      <div className="card-body p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-base sm:text-lg font-semibold mb-1 line-clamp-1">
            {provider.name}
          </h2>
          <div className="flex items-center gap-1">
            {isInstalled ? (
              <span className="badge badge-sm badge-outline">{provider.version || "1.0.0"}</span>
            ) : (
              <div className="badge badge-sm badge-primary flex items-center gap-1">
                <FiStar size={12} /> {provider.rating.toFixed(1)}
              </div>
            )}
          </div>
        </div>
        
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
          <p className="text-sm font-medium flex items-center">
            <FiBox className="mr-1 text-primary" /> MCP Tools: <span className="text-primary ml-1">{provider.totalMCPs}</span>
          </p>
        </div>

        {/* Action buttons - on the card but with z-index to be clickable above the link */}
        <div className="card-actions justify-end mt-auto space-x-2 relative z-20">
          {isInstalled ? (
            <>
              <button
                className="btn btn-sm btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle delete
                }}
              >
                <FiTrash2 />
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle settings
                }}
              >
                <FiSettings className="mr-1" /> <span className="hidden xs:inline">Settings</span>
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle install
              }}
            >
              <FiDownloadCloud className="mr-1" /> <span className="hidden xs:inline">Get Server</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default McpCard; 