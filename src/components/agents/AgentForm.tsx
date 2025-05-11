"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Agent, AgentType, TaskAgent, ActionAgent, AgentStatus, TriggerType, AgentConfig, TriggerConfig, ScheduledTriggerConfig, ScheduledTriggerFrequency, MCPDependency, AgentDependency, OutputAction } from "@/types/agent";
import { mockAgents, ExtendedAgent } from "@/data/mockAgents"; // Using ExtendedAgent for mock data flexibility
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { TaskData } from "@/types/task"; // Import TaskData
import TriggerConfigForm from './TriggerConfigForm'; // Import TriggerConfigForm
import DependentMCPsForm from './DependentMCPsForm'; // Import DependentMCPsForm
import DependentAgentsForm from './DependentAgentsForm'; // Import DependentAgentsForm
import OutputActionsForm from './OutputActionsForm'; // Import OutputActionsForm
import ResourcesWalletForm from './ResourcesWalletForm'; // Import ResourcesWalletForm

interface AgentFormProps {
  agent?: ExtendedAgent | null; // Optional for create, required for edit
  onSubmit: (formData: ExtendedAgent) => void;
  isEditMode?: boolean;
}

const initialAgentConfig: AgentConfig = {
  dependentMCPs: [],
  dependentAgents: [],
  outputActions: [],
};

const AgentForm: React.FC<AgentFormProps> = ({ agent, onSubmit, isEditMode = false }) => {
  const router = useRouter();
  const [formState, setFormState] = useState<Omit<ExtendedAgent, 'id' | 'createdAt' | 'updatedAt' | 'lastModified' | 'creator' | 'status' | 'logs' >>({
    name: agent?.name || "",
    description: agent?.description || "",
    iconUrl: agent?.iconUrl || null,
    systemPrompt: agent?.systemPrompt || "You are a helpful AI assistant.",
    agentType: agent?.agentType || "Task",
    triggerType: agent?.triggerType || TriggerType.MANUAL,
    triggerConfig: agent?.triggerConfig || null,
    config: agent?.config || initialAgentConfig,
    ownerId: agent?.ownerId,
    associatedWalletId: agent?.associatedWalletId || null,
    autoRefillServiceCredits: agent?.autoRefillServiceCredits || false,
    serviceCreditsRefillThreshold: agent?.serviceCreditsRefillThreshold || 0,
    serviceCreditsRefillAmount: agent?.serviceCreditsRefillAmount || 0,
    autoRefillSol: agent?.autoRefillSol || false,
    solRefillThreshold: agent?.solRefillThreshold || 0,
    solRefillAmount: agent?.solRefillAmount || 0,
    solRefillSourceEoa: agent?.solRefillSourceEoa || "",
    tasks: agent?.tasks || [], // Initialize tasks
  });

  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(agent?.iconUrl || "/logo.png");

  useEffect(() => {
    if (agent) {
      setFormState({
        name: agent.name,
        description: agent.description,
        iconUrl: agent.iconUrl || null,
        systemPrompt: agent.systemPrompt,
        agentType: agent.agentType as AgentType, // Ensure it's AgentType
        triggerType: agent.triggerType,
        triggerConfig: agent.triggerConfig || null,
        config: agent.config || initialAgentConfig,
        ownerId: agent.ownerId,
        associatedWalletId: agent.associatedWalletId || null,
        autoRefillServiceCredits: agent.autoRefillServiceCredits || false,
        serviceCreditsRefillThreshold: agent.serviceCreditsRefillThreshold || 0,
        serviceCreditsRefillAmount: agent.serviceCreditsRefillAmount || 0,
        autoRefillSol: agent.autoRefillSol || false,
        solRefillThreshold: agent.solRefillThreshold || 0,
        solRefillAmount: agent.solRefillAmount || 0,
        solRefillSourceEoa: agent.solRefillSourceEoa || "",
        tasks: agent.tasks || [],
      });
      setIconPreview(agent.iconUrl || "/logo.png");
    }
  }, [agent]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "agentType" && value === "Action") {
      // Reset task-specific fields if type changes to Action
      // This logic might need to be more sophisticated depending on how you want to handle type changes
    }
  };

  const handleIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconPreview(result);
        setFormState(prev => ({ ...prev, iconUrl: result })); // Store base64 for preview, actual upload handled on submit
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedIconFile(null);
      // Revert to original or default if file selection is cancelled
      setIconPreview(agent?.iconUrl || "/logo.png");
      setFormState(prev => ({ ...prev, iconUrl: agent?.iconUrl || null}));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Construct the agent data to submit
    // This is a simplified version; actual implementation would handle file uploads, etc.
    const submittedAgentData: ExtendedAgent = {
      id: agent?.id || `agent-${Date.now()}`, // Generate ID if new
      ...formState,
      agentType: formState.agentType as AgentType, // Ensure agentType is correctly typed
      iconUrl: iconPreview, // Use preview, actual upload logic needed
      status: agent?.status || AgentStatus.IDLE, // Default status for new agents
      lastModified: Date.now(),
      createdAt: agent?.createdAt || new Date(),
      updatedAt: new Date(),
      creator: agent?.creator || "current_user_id",
      triggerType: formState.triggerType, // Ensure triggerType is included
      triggerConfig: formState.triggerConfig,
      config: formState.config,
      logs: agent?.logs || [],
      tasks: formState.agentType === 'Task' ? formState.tasks || [] : undefined,
      associatedWalletId: formState.associatedWalletId,
      autoRefillServiceCredits: formState.autoRefillServiceCredits,
      serviceCreditsRefillThreshold: formState.serviceCreditsRefillThreshold,
      serviceCreditsRefillAmount: formState.serviceCreditsRefillAmount,
      autoRefillSol: formState.autoRefillSol,
      solRefillThreshold: formState.solRefillThreshold,
      solRefillAmount: formState.solRefillAmount,
      solRefillSourceEoa: formState.solRefillSourceEoa,
    };
    onSubmit(submittedAgentData);
  };

  // Placeholder handlers for MCP configuration
  const handleAddMCP = () => {
    // Mock: Add a new MCP placeholder to formState.config.dependentMCPs
    // In a real scenario, this would open a selection modal
    const newMcp: MCPDependency = {
      mcpId: `mcp-${Date.now()}`,
      mcpName: `New MCP ${formState.config.dependentMCPs.length + 1}`,
      order: formState.config.dependentMCPs.length + 1,
      parameters: {},
    };
    setFormState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        dependentMCPs: [...prev.config.dependentMCPs, newMcp],
      }
    }));
    console.log("Add MCP clicked");
  };

  const handleRemoveMCP = (index: number) => {
    setFormState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        dependentMCPs: prev.config.dependentMCPs.filter((_, i) => i !== index),
      }
    }));
    console.log("Remove MCP clicked for index:", index);
  };

  const handleConfigureMCP = (index: number) => {
    // Placeholder for opening MCP configuration modal
    console.log("Configure MCP clicked for index:", index, formState.config.dependentMCPs[index]);
  };

  // Placeholder handlers for A2A configuration
  const handleAddAgentDependency = () => {
    const newAgentDep: AgentDependency = {
      dependentAgentId: `agent-${Date.now()}`,
      dependentAgentName: `Dependent Agent ${formState.config.dependentAgents.length + 1}`,
      interactionConfig: {},
    };
    setFormState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        dependentAgents: [...prev.config.dependentAgents, newAgentDep],
      }
    }));
    console.log("Add Agent Dependency clicked");
  };

  const handleRemoveAgentDependency = (index: number) => {
    setFormState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        dependentAgents: prev.config.dependentAgents.filter((_, i) => i !== index),
      }
    }));
    console.log("Remove Agent Dependency clicked for index:", index);
  };

  const handleConfigureAgentInteraction = (index: number) => {
    console.log("Configure Agent Interaction clicked for index:", index, formState.config.dependentAgents[index]);
  };

  // Placeholder handlers for Output Actions configuration
  const handleAddOutputAction = () => {
    const newOutputAction: OutputAction = {
      outputType: "TELEGRAM_NOTIFIER", // Mock default
      outputProviderName: `New Output ${formState.config.outputActions.length + 1}`,
      parameters: {},
    };
    setFormState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        outputActions: [...prev.config.outputActions, newOutputAction],
      }
    }));
    console.log("Add Output Action clicked");
  };

  const handleRemoveOutputAction = (index: number) => {
    setFormState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        outputActions: prev.config.outputActions.filter((_, i) => i !== index),
      }
    }));
    console.log("Remove Output Action clicked for index:", index);
  };

  const handleConfigureOutputAction = (index: number) => {
    console.log("Configure Output Action clicked for index:", index, formState.config.outputActions[index]);
  };

  const handleResourceWalletInputChange = (name: string, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mock available wallets
  const availableWallets = [
    { id: 'wallet-main', name: 'Main Wallet' },
    { id: 'wallet-trading-a', name: 'Trading Wallet A' },
    { id: 'wallet-test-01', name: 'Test Wallet 01' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-base-200 rounded-lg shadow-xl">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-primary">
          {isEditMode ? "Edit Agent" : "Create New Agent"}
        </h2>

        {/* Basic Information Section */}
        <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
          <h3 className="text-xl font-medium mb-4">Basic Information</h3>
          <div className="form-control mb-6">
            <label className="label" htmlFor="agent-icon-upload">
              <span className="label-text text-base">Agent Icon</span>
            </label>
            <div className="flex items-center gap-4">
              <label htmlFor="agent-icon-upload" className="cursor-pointer group">
                <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-base-content/30 group-hover:border-primary flex items-center justify-center overflow-hidden">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Icon Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ArrowUpTrayIcon className="h-10 w-10 text-base-content/50 group-hover:text-primary" />
                  )}
                </div>
              </label>
              <input id="agent-icon-upload" type="file" className="hidden" accept="image/*" onChange={handleIconChange} />
              {iconPreview && iconPreview !== "/logo.png" && (
                <button type="button" className="btn btn-xs btn-ghost text-error" onClick={() => { setSelectedIconFile(null); setIconPreview(agent?.iconUrl || "/logo.png"); setFormState(prev => ({...prev, iconUrl: agent?.iconUrl || null})) }}>
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="agent-name">
              <span className="label-text text-base">Agent Name</span>
            </label>
            <input id="agent-name" name="name" type="text" placeholder="Enter agent name" className="input input-bordered w-full" value={formState.name} onChange={handleInputChange} required />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="agent-description">
              <span className="label-text text-base">Description</span>
            </label>
            <textarea id="agent-description" name="description" className="textarea textarea-bordered h-24 w-full" placeholder="Describe the agent's purpose" value={formState.description} onChange={handleInputChange}></textarea>
          </div>
        </div>

        {/* Agent Behavior Section */}
        <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
          <h3 className="text-xl font-medium mb-4">Agent Behavior</h3>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-base">Agent Type</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="agentType"
                  className="radio radio-primary"
                  value="Task"
                  checked={formState.agentType === "Task"}
                  onChange={handleInputChange}
                />
                <span className="label-text ml-2">Task Agent</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="agentType"
                  className="radio radio-primary"
                  value="Action"
                  checked={formState.agentType === "Action"}
                  onChange={handleInputChange}
                />
                <span className="label-text ml-2">Action Agent</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="agentType"
                  className="radio radio-primary"
                  value="Chat"
                  checked={formState.agentType === "Chat"}
                  onChange={handleInputChange}
                />
                <span className="label-text ml-2">Chat Agent</span>
              </label>
            </div>
            {formState.agentType === 'Action' && (
              <p className="text-xs text-base-content/70 mt-1">
                Action Agents can be used by Task Agents but do not have their own task execution or A2A configurations.
              </p>
            )}
            {formState.agentType === 'Chat' && (
              <p className="text-xs text-base-content/70 mt-1">
                Chat Agents provide a conversational interface.
              </p>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="agent-systemPrompt">
              <span className="label-text text-base">System Prompt</span>
            </label>
            <textarea id="agent-systemPrompt" name="systemPrompt" className="textarea textarea-bordered h-32 w-full" placeholder="Define the agent's core instructions, personality, and capabilities." value={formState.systemPrompt} onChange={handleInputChange} required></textarea>
          </div>
        </div>

        {/* Trigger Configuration Section */}
        <TriggerConfigForm
          triggerType={formState.triggerType}
          triggerConfig={formState.triggerConfig || null}
          onTriggerTypeChange={(newType: TriggerType) => setFormState(prev => ({ ...prev, triggerType: newType, triggerConfig: newType === TriggerType.SCHEDULED ? prev.triggerConfig || { frequency: ScheduledTriggerFrequency.DAILY, timeValue: '09:00' } : null }))}
          onTriggerConfigChange={(newConfig: TriggerConfig | null) => setFormState(prev => ({ ...prev, triggerConfig: newConfig }))}
        />

        {/* Dependent MCPs Configuration Section */}
        <DependentMCPsForm
          dependentMCPs={formState.config.dependentMCPs}
          onAddMCP={handleAddMCP}
          onRemoveMCP={handleRemoveMCP}
          onConfigureMCP={handleConfigureMCP}
        />

        {/* Dependent Agents Configuration Section */}
        <DependentAgentsForm
          dependentAgents={formState.config.dependentAgents}
          onAddAgent={handleAddAgentDependency}
          onRemoveAgent={handleRemoveAgentDependency}
          onConfigureInteraction={handleConfigureAgentInteraction}
        />

        {/* Output & Notification Section */}
        <OutputActionsForm
          outputActions={formState.config.outputActions}
          onAddOutputAction={handleAddOutputAction}
          onRemoveOutputAction={handleRemoveOutputAction}
          onConfigureOutputAction={handleConfigureOutputAction}
        />

        {/* Resources & Wallet Section */}
        <ResourcesWalletForm
          associatedWalletId={formState.associatedWalletId}
          autoRefillServiceCredits={formState.autoRefillServiceCredits}
          serviceCreditsRefillThreshold={formState.serviceCreditsRefillThreshold}
          serviceCreditsRefillAmount={formState.serviceCreditsRefillAmount}
          autoRefillSol={formState.autoRefillSol}
          solRefillThreshold={formState.solRefillThreshold}
          solRefillAmount={formState.solRefillAmount}
          solRefillSourceEoa={formState.solRefillSourceEoa}
          availableWallets={availableWallets}
          onInputChange={handleResourceWalletInputChange}
        />

      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Save Changes" : "Create Agent"}
        </button>
      </div>
    </form>
  );
};

export default AgentForm;