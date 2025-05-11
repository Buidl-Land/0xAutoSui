"use client";

import React from 'react';
import { OutputAction } from '@/types/agent';
import { PlusCircleIcon, CogIcon, TrashIcon, BellAlertIcon } from '@heroicons/react/24/outline';

interface OutputActionsFormProps {
  outputActions: OutputAction[];
  onAddOutputAction: () => void; // Placeholder for modal opening logic
  onRemoveOutputAction: (index: number) => void;
  onConfigureOutputAction: (index: number) => void; // Placeholder for modal opening logic
}

const OutputActionsForm: React.FC<OutputActionsFormProps> = ({
  outputActions,
  onAddOutputAction,
  onRemoveOutputAction,
  onConfigureOutputAction,
}) => {
  return (
    <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
      <h3 className="text-xl font-medium mb-4">Output & Notification</h3>
      <button
        type="button"
        onClick={onAddOutputAction}
        className="btn btn-sm btn-outline btn-info mb-4"
      >
        <BellAlertIcon className="h-5 w-5 mr-2" />
        Add Output Method
      </button>

      {outputActions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Added Output Methods:</p>
          {outputActions.map((action, index) => (
            <div key={action.outputType + index} className="flex items-center justify-between p-3 bg-base-200 rounded-md">
              <span className="text-sm">{action.outputProviderName || `Output ${index + 1}`} ({action.outputType})</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onConfigureOutputAction(index)}
                  className="btn btn-xs btn-ghost"
                  title="Configure Parameters"
                >
                  <CogIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveOutputAction(index)}
                  className="btn btn-xs btn-ghost text-error"
                  title="Remove Output Method"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {outputActions.length === 0 && (
        <p className="text-sm text-base-content/70">No output methods added yet.</p>
      )}
      <p className="text-xs text-base-content/70 mt-2">
        Note: Configure how the agent reports its results (e.g., Telegram, Discord, Email).
      </p>
    </div>
  );
};

export default OutputActionsForm;