import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  ExtendedAgent,
} from '@/data/mockAgents';
import {
  AgentType,
  TriggerType,
  TriggerConfig,
  AgentConfig,
  MCPDependency,
  AgentDependency,
  OutputAction,
} from '@/types/agent';
import TriggerConfigForm from '../TriggerConfigForm';
import DependentMCPsForm from '../DependentMCPsForm';
import DependentAgentsForm from '../DependentAgentsForm';
import OutputActionsForm from '../OutputActionsForm';
import ResourcesWalletForm from '../ResourcesWalletForm';
import TasksForm from './TasksForm';
import { Task } from '@/types/agent';
// import TasksForm from './TasksForm';

// Define the shape of the data this step outputs
interface ConfigStepOutputData {
    agentType: AgentType;
    systemPrompt: string;
    triggerType: TriggerType;
    triggerConfig: TriggerConfig | null;
    config: AgentConfig; // Contains MCPs, A2A, Outputs
    // Wallet and Resource fields directly, as they are part of BaseAgent
    associatedWalletId?: string | null;
    autoRefillServiceCredits?: boolean;
    serviceCreditsRefillThreshold?: number;
    serviceCreditsRefillAmount?: number;
    autoRefillSol?: boolean;
    solRefillThreshold?: number;
    solRefillAmount?: number;
    solRefillSourceEoa?: string;
    tasks?: Task[];
}

interface AgentConfigStepProps {
  initialData: {
    agentType: AgentType;
    systemPrompt: string;
    triggerType: TriggerType;
    triggerConfig: TriggerConfig | null;
    config: Partial<AgentConfig>; // For MCPs, A2A, Outputs
    // Wallet and Resource fields directly from initial agent data
    associatedWalletId?: string | null;
    autoRefillServiceCredits?: boolean;
    serviceCreditsRefillThreshold?: number;
    serviceCreditsRefillAmount?: number;
    autoRefillSol?: boolean;
    solRefillThreshold?: number;
    solRefillAmount?: number;
    solRefillSourceEoa?: string;
    tasks?: Task[];
  };
  onNext: (data: ConfigStepOutputData) => void;
  onBack: () => void;
}

// Mock wallet type for availableWallets prop, replace with actual type later
interface MockWallet {
  id: string;
  name: string;
}

const AgentConfigStep: React.FC<AgentConfigStepProps> = ({ initialData, onNext, onBack }) => {
  const [agentType, setAgentType] = useState<AgentType>(initialData.agentType);
  const [systemPrompt, setSystemPrompt] = useState<string>(initialData.systemPrompt);
  const [currentTriggerType, setCurrentTriggerType] = useState<TriggerType>(initialData.triggerType);
  const [currentTriggerConfig, setCurrentTriggerConfig] = useState<TriggerConfig | null>(initialData.triggerConfig);
  const [mcpDependencies, setMcpDependencies] = useState<MCPDependency[]>(initialData.config.dependentMCPs || []);
  const [agentDependencies, setAgentDependencies] = useState<AgentDependency[]>(initialData.config.dependentAgents || []);
  const [outputActions, setOutputActions] = useState<OutputAction[]>(initialData.config.outputActions || []);

  // State for ResourcesWalletForm
  const [associatedWalletId, setAssociatedWalletId] = useState<string | null | undefined>(initialData.associatedWalletId);
  const [autoRefillServiceCredits, setAutoRefillServiceCredits] = useState<boolean | undefined>(initialData.autoRefillServiceCredits);
  const [serviceCreditsRefillThreshold, setServiceCreditsRefillThreshold] = useState<number | undefined>(initialData.serviceCreditsRefillThreshold);
  const [serviceCreditsRefillAmount, setServiceCreditsRefillAmount] = useState<number | undefined>(initialData.serviceCreditsRefillAmount);
  const [autoRefillSol, setAutoRefillSol] = useState<boolean | undefined>(initialData.autoRefillSol);
  const [solRefillThreshold, setSolRefillThreshold] = useState<number | undefined>(initialData.solRefillThreshold);
  const [solRefillAmount, setSolRefillAmount] = useState<number | undefined>(initialData.solRefillAmount);
  const [solRefillSourceEoa, setSolRefillSourceEoa] = useState<string | undefined>(initialData.solRefillSourceEoa);
  const [tasks, setTasks] = useState<Task[]>(initialData.tasks || []);

  // Mock available wallets for the ResourcesWalletForm
  const mockAvailableWallets: MockWallet[] = [
    { id: 'wallet1', name: 'Primary Mock Wallet' },
    { id: 'wallet2', name: 'Secondary Mock Wallet' },
    { id: 'wallet-sol-funds', name: 'SOL Refill Source EOA (example)'}
  ];

  useEffect(() => {
    setAgentType(initialData.agentType);
    setSystemPrompt(initialData.systemPrompt);
    setCurrentTriggerType(initialData.triggerType);
    setCurrentTriggerConfig(initialData.triggerConfig);
    setMcpDependencies(initialData.config.dependentMCPs || []);
    setAgentDependencies(initialData.config.dependentAgents || []);
    setOutputActions(initialData.config.outputActions || []);
    // Set wallet config from initialData (now directly accessible)
    setAssociatedWalletId(initialData.associatedWalletId);
    setAutoRefillServiceCredits(initialData.autoRefillServiceCredits);
    setServiceCreditsRefillThreshold(initialData.serviceCreditsRefillThreshold);
    setServiceCreditsRefillAmount(initialData.serviceCreditsRefillAmount);
    setAutoRefillSol(initialData.autoRefillSol);
    setSolRefillThreshold(initialData.solRefillThreshold);
    setSolRefillAmount(initialData.solRefillAmount);
    setSolRefillSourceEoa(initialData.solRefillSourceEoa);
    setTasks(initialData.tasks || []);
  }, [initialData]);

  // MCP Handlers
  const handleAddMCP = () => {
    // Placeholder: In reality, this would open a modal to select/configure an MCP
    const newMcp: MCPDependency = {
      mcpId: `mcp-mock-${Date.now()}`,
      mcpName: `Mock MCP ${mcpDependencies.length + 1}`,
      order: mcpDependencies.length + 1,
      parameters: { mockParam: 'value' },
    };
    setMcpDependencies(prev => [...prev, newMcp]);
  };

  const handleRemoveMCP = (index: number) => {
    setMcpDependencies(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfigureMCP = (index: number) => {
    // Placeholder: Open a modal to configure parameters for mcpDependencies[index]
    console.log("Configure MCP at index:", index, mcpDependencies[index]);
    alert(`Configure MCP: ${mcpDependencies[index].mcpName} (parameters: ${JSON.stringify(mcpDependencies[index].parameters)}) - Placeholder`);
  };

  // Agent Dependency (A2A) Handlers
  const handleAddAgentDependency = () => {
    const newAgentDep: AgentDependency = {
      dependentAgentId: `agent-mock-${Date.now()}`,
      dependentAgentName: `Mock Dependent Agent ${agentDependencies.length + 1}`,
      interactionConfig: { dataToShare: 'all' }, // Placeholder config
    };
    setAgentDependencies(prev => [...prev, newAgentDep]);
  };

  const handleRemoveAgentDependency = (index: number) => {
    setAgentDependencies(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfigureAgentInteraction = (index: number) => {
    console.log("Configure A2A Interaction at index:", index, agentDependencies[index]);
    alert(`Configure A2A: ${agentDependencies[index].dependentAgentName} (config: ${JSON.stringify(agentDependencies[index].interactionConfig)}) - Placeholder`);
  };

  // Output Action Handlers
  const handleAddOutputAction = () => {
    const newAction: OutputAction = {
      outputType: 'TELEGRAM_NOTIFIER', // Mock default
      outputProviderName: `Mock Notifier ${outputActions.length + 1}`,
      parameters: { chatId: '@mockChannel' }, // Placeholder config
    };
    setOutputActions(prev => [...prev, newAction]);
  };

  const handleRemoveOutputAction = (index: number) => {
    setOutputActions(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfigureOutputAction = (index: number) => {
    console.log("Configure Output Action at index:", index, outputActions[index]);
    alert(`Configure Output: ${outputActions[index].outputProviderName} (type: ${outputActions[index].outputType}) - Placeholder`);
  };

  // Handler for ResourcesWalletForm inputs
  const handleWalletInputChange = (name: string, value: string | number | boolean) => {
    switch (name) {
      case 'associatedWalletId':
        setAssociatedWalletId(value as string);
        break;
      case 'autoRefillServiceCredits':
        setAutoRefillServiceCredits(value as boolean);
        break;
      case 'serviceCreditsRefillThreshold':
        setServiceCreditsRefillThreshold(value as number);
        break;
      case 'serviceCreditsRefillAmount':
        setServiceCreditsRefillAmount(value as number);
        break;
      case 'autoRefillSol':
        setAutoRefillSol(value as boolean);
        break;
      case 'solRefillThreshold':
        setSolRefillThreshold(value as number);
        break;
      case 'solRefillAmount':
        setSolRefillAmount(value as number);
        break;
      case 'solRefillSourceEoa':
        setSolRefillSourceEoa(value as string);
        break;
      default:
        console.warn(`Unhandled wallet input change for: ${name}`);
    }
  };

  // Task Handlers
  const handleAddTask = () => {
    setTasks(prevTasks => [...prevTasks, {
      id: `task-${Date.now()}`,
      description: 'New task - please describe',
      order: prevTasks.length > 0 ? Math.max(...prevTasks.map(t => t.order)) + 1 : 1
    }]);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTask = (taskId: string, newDescription: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, description: newDescription } : task
      )
    );
  };

  const handleSubmit = () => {
    const stepOutput: ConfigStepOutputData = {
      agentType,
      systemPrompt,
      triggerType: currentTriggerType,
      triggerConfig: currentTriggerConfig,
      config: {
        dependentMCPs: mcpDependencies,
        dependentAgents: agentDependencies,
        outputActions: outputActions,
      },
      associatedWalletId: associatedWalletId,
      autoRefillServiceCredits: autoRefillServiceCredits,
      serviceCreditsRefillThreshold: serviceCreditsRefillThreshold,
      serviceCreditsRefillAmount: serviceCreditsRefillAmount,
      autoRefillSol: autoRefillSol,
      solRefillThreshold: solRefillThreshold,
      solRefillAmount: solRefillAmount,
      solRefillSourceEoa: solRefillSourceEoa,
      tasks: tasks,
    };
    onNext(stepOutput);
  };

  return (
    <div className="p-6 card bg-base-100 shadow-xl space-y-8">
      <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Step 3: Configure Agent Logic & Triggers
      </h2>

      <div className="form-control">
        <label className="label" id="agent-type-label"><span className="label-text text-base">Agent Type</span></label>
        <select
          className="select select-bordered w-full"
          value={agentType}
          onChange={(e) => setAgentType(e.target.value as AgentType)}
          aria-labelledby="agent-type-label"
        >
          <option value="Task">Task Agent</option>
          <option value="Action">Action Agent</option>
          <option value="Chat">Chat Agent</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="agent-system-prompt-cfg"><span className="label-text text-base">System Prompt</span></label>
        <textarea
          id="agent-system-prompt-cfg"
          className="textarea textarea-bordered w-full font-mono text-sm"
          rows={5}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        ></textarea>
      </div>

      <TriggerConfigForm
        triggerType={currentTriggerType}
        triggerConfig={currentTriggerConfig}
        onTriggerTypeChange={setCurrentTriggerType}
        onTriggerConfigChange={setCurrentTriggerConfig}
      />

      <div className="divider"></div>

      <DependentMCPsForm
        dependentMCPs={mcpDependencies}
        onAddMCP={handleAddMCP}
        onRemoveMCP={handleRemoveMCP}
        onConfigureMCP={handleConfigureMCP}
      />

      <div className="divider"></div>

      <DependentAgentsForm
        dependentAgents={agentDependencies}
        onAddAgent={handleAddAgentDependency}
        onRemoveAgent={handleRemoveAgentDependency}
        onConfigureInteraction={handleConfigureAgentInteraction}
      />

      <div className="divider"></div>

      <OutputActionsForm
        outputActions={outputActions}
        onAddOutputAction={handleAddOutputAction}
        onRemoveOutputAction={handleRemoveOutputAction}
        onConfigureOutputAction={handleConfigureOutputAction}
      />

      <div className="divider"></div>

      <ResourcesWalletForm
        associatedWalletId={associatedWalletId}
        autoRefillServiceCredits={autoRefillServiceCredits}
        serviceCreditsRefillThreshold={serviceCreditsRefillThreshold}
        serviceCreditsRefillAmount={serviceCreditsRefillAmount}
        autoRefillSol={autoRefillSol}
        solRefillThreshold={solRefillThreshold}
        solRefillAmount={solRefillAmount}
        solRefillSourceEoa={solRefillSourceEoa}
        availableWallets={mockAvailableWallets}
        onInputChange={handleWalletInputChange}
      />

      {/* Conditionally render TasksForm if agentType is 'Task' */}
      {agentType === 'Task' && (
        <>
          <div className="divider"></div>
          <TasksForm
            tasks={tasks}
            onAddTask={handleAddTask}
            onRemoveTask={handleRemoveTask}
            onUpdateTask={handleUpdateTask}
          />
        </>
      )}

      <div className="text-center p-4 border border-dashed border-base-300 rounded-md">
        <p className="text-base-content/70">Further configurations (Tasks, Wallet) will appear here.</p>
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Next: Test Agent</button>
      </div>
    </div>
  );
};

export default AgentConfigStep;
