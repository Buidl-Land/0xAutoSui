"use client";

import React from 'react';
import { MCPDependency } from '@/types/agent';
import { PlusCircleIcon, CogIcon, TrashIcon } from '@heroicons/react/24/outline';

interface DependentMCPsFormProps {
  dependentMCPs: MCPDependency[];
  onAddMCP: () => void; // Placeholder for modal opening logic
  onRemoveMCP: (index: number) => void;
  onConfigureMCP: (index: number) => void; // Placeholder for modal opening logic
}

const DependentMCPsForm: React.FC<DependentMCPsFormProps> = ({
  dependentMCPs,
  onAddMCP,
  onRemoveMCP,
  onConfigureMCP,
}) => {
  return (
    <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
      <h3 className="text-xl font-medium mb-4">Core Logic - Dependent MCPs</h3>
      <button
        type="button"
        onClick={onAddMCP}
        className="btn btn-sm btn-outline btn-primary mb-4"
      >
        <PlusCircleIcon className="h-5 w-5 mr-2" />
        Add MCP
      </button>

      {dependentMCPs.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Added MCPs:</p>
          {dependentMCPs.map((mcp, index) => (
            <div key={mcp.mcpId || index} className="flex items-center justify-between p-3 bg-base-200 rounded-md">
              <span className="text-sm">{mcp.mcpName || `MCP ${index + 1}`} (Order: {mcp.order})</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onConfigureMCP(index)}
                  className="btn btn-xs btn-ghost"
                  title="Configure Parameters"
                >
                  <CogIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveMCP(index)}
                  className="btn btn-xs btn-ghost text-error"
                  title="Remove MCP"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {dependentMCPs.length === 0 && (
        <p className="text-sm text-base-content/70">No MCPs added yet.</p>
      )}
       <p className="text-xs text-base-content/70 mt-2">
        Note: MCPs execute sequentially based on their order. Parameter configuration will be available via modals.
      </p>
    </div>
  );
};

export default DependentMCPsForm;