import React, { useState } from 'react';
import { addMockAgent, AgentCreationType } from '@/data/mockAgents'; // Import AgentCreationType
import { AIModel } from '@/types/agent'; // AgentStatus and TriggerType are not directly used here for creation anymore

interface AgentCreationFormProps {
  onAgentCreated: () => void;
}

const AgentCreationForm: React.FC<AgentCreationFormProps> = ({ onAgentCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState<AIModel>(AIModel.Gemini25Pro);
  const [creationType, setCreationType] = useState<AgentCreationType>(AgentCreationType.BASIC);
  // Add more state for other agent properties as needed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMockAgent(name, description, model, systemPrompt, creationType);
    // Reset form or provide feedback
    setName('');
    setDescription('');
    setSystemPrompt('');
    setModel(AIModel.Gemini25Pro);
    setCreationType(AgentCreationType.BASIC); // Reset creation type
    onAgentCreated(); // Call the callback
    alert('Agent created successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-base-200 rounded-lg">
      <h2 className="text-xl font-semibold">Create New Agent</h2>
      <div>
        <label htmlFor="agentName" className="block text-sm font-medium">Agent Name</label>
        <input
          type="text"
          id="agentName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="agentDescription" className="block text-sm font-medium">Description</label>
        <textarea
          id="agentDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="textarea textarea-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="systemPrompt" className="block text-sm font-medium">System Prompt</label>
        <textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          required
          className="textarea textarea-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="aiModel" className="block text-sm font-medium">AI Model</label>
        <select
          id="aiModel"
          value={model}
          onChange={(e) => setModel(e.target.value as AIModel)}
          required
          className="select select-bordered w-full"
        >
          {Object.values(AIModel).map((modelValue) => (
            <option key={modelValue} value={modelValue}>
              {modelValue}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="agentCreationType" className="block text-sm font-medium">Agent Creation Logic</label>
        <select
          id="agentCreationType"
          value={creationType}
          onChange={(e) => setCreationType(e.target.value as AgentCreationType)}
          required
          className="select select-bordered w-full"
        >
          {Object.values(AgentCreationType).map((typeValue) => (
            <option key={typeValue} value={typeValue}>
              {typeValue.replace('_', ' ')} {/* Make it more readable */}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Create Agent</button>
    </form>
  );
};

export default AgentCreationForm;