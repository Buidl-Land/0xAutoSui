import React from 'react';
import Link from 'next/link';
import { MCP } from '@/types/mcp';
import { FiPlusCircle, FiInfo } from 'react-icons/fi'; // Using react-icons for example

interface McpCardProps {
  mcp: MCP;
}

const McpCard: React.FC<McpCardProps> = ({ mcp }) => {
  const handleAddToAgent = () => {
    // Mock functionality for now
    console.log(`Adding MCP: ${mcp.name} to an agent (mock).`);
    // In a real scenario, this might open a modal to select an agent
    // or redirect to an agent configuration page with this MCP pre-selected.
  };

  return (
    <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="card-body p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-lg font-semibold line-clamp-2" title={mcp.name}>
            {mcp.name}
          </h2>
          <div className="badge badge-sm badge-outline">{mcp.provider}</div>
        </div>

        <p className="text-xs text-base-content/70 mb-1">Type: {mcp.type}</p>
        <p className="text-xs text-base-content/70 mb-3">Cost: <span className="font-medium">{mcp.cost}</span></p>

        <p className="text-sm text-base-content/80 mb-4 line-clamp-3 flex-grow min-h-[60px]">
          {mcp.description}
        </p>

        <div className="card-actions justify-end items-center mt-auto">
          {mcp.details && (
            <Link href={`/store/${mcp.id}?type=mcp`} className="btn btn-xs btn-ghost text-info" title="View Details">
              <FiInfo className="mr-1" /> Details
            </Link>
          )}
          <button
            onClick={handleAddToAgent}
            className="btn btn-xs btn-primary"
            title="Add to Agent (Contextual)"
          >
            <FiPlusCircle className="mr-1" /> Add to Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default McpCard;