"use client";

import React from 'react';
import { AgentDependency } from '@/types/agent';
import { PlusCircleIcon, CogIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface DependentAgentsFormProps {
  dependentAgents: AgentDependency[];
  onAddAgent: () => void; // Placeholder for modal opening logic
  onRemoveAgent: (index: number) => void;
  onConfigureInteraction: (index: number) => void; // Placeholder for modal opening logic
}

const DependentAgentsForm: React.FC<DependentAgentsFormProps> = ({
  dependentAgents,
  onAddAgent,
  onRemoveAgent,
  onConfigureInteraction,
}) => {
  return (
    <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
      <h3 className="text-xl font-medium mb-4">Core Logic - Dependent Agents (A2A)</h3>
      <button
        type="button"
        onClick={onAddAgent}
        className="btn btn-sm btn-outline btn-accent mb-4"
      >
        <UserGroupIcon className="h-5 w-5 mr-2" />
        Add Dependent Agent
      </button>

      {dependentAgents.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Added Dependent Agents:</p>
          {dependentAgents.map((agentDep, index) => (
            <div key={agentDep.dependentAgentId || index} className="flex items-center justify-between p-3 bg-base-200 rounded-md">
              <span className="text-sm">{agentDep.dependentAgentName || `Agent ${index + 1}`}</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onConfigureInteraction(index)}
                  className="btn btn-xs btn-ghost"
                  title="Configure Interaction"
                >
                  <CogIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveAgent(index)}
                  className="btn btn-xs btn-ghost text-error"
                  title="Remove Dependent Agent"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {dependentAgents.length === 0 && (
        <p className="text-sm text-base-content/70">No dependent agents added yet.</p>
      )}
      <p className="text-xs text-base-content/70 mt-2">
        Note: Configure how this agent interacts with other agents (e.g., data flow).
      </p>
    </div>
  );
};

export default DependentAgentsForm;