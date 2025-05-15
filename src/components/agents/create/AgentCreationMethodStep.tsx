import React from 'react';
import { CubeTransparentIcon, DocumentTextIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface AgentCreationMethodStepProps {
  onSelectMethod: (method: 'prompt' | 'template' | 'manual') => void;
}

const AgentCreationMethodStep: React.FC<AgentCreationMethodStepProps> = ({ onSelectMethod }) => {
  return (
    <div className="p-6 card bg-base-100 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">How would you like to create your Agent?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Create from Prompt */}
        <button
          className="card bg-base-200 hover:bg-base-300 p-6 text-center transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => onSelectMethod('prompt')}
        >
          <CubeTransparentIcon className="h-16 w-16 mx-auto mb-4 text-primary"/>
          <h3 className="text-xl font-semibold mb-2">Quick Create (AI Prompt)</h3>
          <p className="text-sm text-base-content/70">Describe your agent's goal, and we'll configure it for you.</p>
        </button>

        {/* Create from Template */}
        <button
          className="card bg-base-200 hover:bg-base-300 p-6 text-center transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => onSelectMethod('template')}
        >
          <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-secondary"/>
          <h3 className="text-xl font-semibold mb-2">From Template</h3>
          <p className="text-sm text-base-content/70">Start with a pre-built agent template and customize it.</p>
        </button>

        {/* Manual Setup */}
        <button
          className="card bg-base-200 hover:bg-base-300 p-6 text-center transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => onSelectMethod('manual')}
        >
          <PencilSquareIcon className="h-16 w-16 mx-auto mb-4 text-accent"/>
          <h3 className="text-xl font-semibold mb-2">Manual Setup</h3>
          <p className="text-sm text-base-content/70">Configure every aspect of your agent from scratch.</p>
        </button>
      </div>
    </div>
  );
};

export default AgentCreationMethodStep;