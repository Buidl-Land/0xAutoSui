import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  ExtendedAgent,
} from '@/data/mockAgents';
import {
  TriggerType,
  TriggerConfig,
  AgentConfig,
  MCPDependency,
  AgentDependency,
  OutputAction,
  AIModel,
} from '@/types/agent';
import DependentMCPsForm from '../DependentMCPsForm';
import DependentAgentsForm from '../DependentAgentsForm';
import OutputActionsForm from '../OutputActionsForm';
import ResourcesWalletForm from '../ResourcesWalletForm';

// Define the shape of the data this step outputs
interface ConfigStepOutputData {
    systemPrompt: string;
    model: AIModel;
    triggerType: TriggerType;
    triggerConfig: TriggerConfig | null;
    config: AgentConfig;
    associatedWalletId?: string | null;
    autoRefillServiceCredits?: boolean;
    serviceCreditsRefillThreshold?: number;
    serviceCreditsRefillAmount?: number;
    autoRefillSol?: boolean;
    solRefillThreshold?: number;
    solRefillAmount?: number;
    solRefillSourceEoa?: string;
}

interface AgentConfigStepProps {
  initialData: {
    systemPrompt: string;
    model: AIModel;
    triggerType: TriggerType;
    triggerConfig: TriggerConfig | null;
    config: Partial<AgentConfig>;
    associatedWalletId?: string | null;
    autoRefillServiceCredits?: boolean;
    serviceCreditsRefillThreshold?: number;
    serviceCreditsRefillAmount?: number;
    autoRefillSol?: boolean;
    solRefillThreshold?: number;
    solRefillAmount?: number;
    solRefillSourceEoa?: string;
  };
  onNext: (data: ConfigStepOutputData) => void;
  onBack: () => void;
}

// Mock wallet type for availableWallets prop, replace with actual type later
interface MockWallet {
  id: string;
  name: string;
}

const AVAILABLE_MODELS = Object.entries(AIModel).map(([key, value]) => ({
  id: value,
  name: value,
}));

const AgentConfigStep: React.FC<AgentConfigStepProps> = ({ initialData, onNext, onBack }) => {
  const [systemPrompt, setSystemPrompt] = useState<string>(initialData.systemPrompt);
  const [model, setModel] = useState<AIModel>(initialData.model);
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

  // Mock available wallets for the ResourcesWalletForm
  const mockAvailableWallets: MockWallet[] = [
    { id: 'wallet-main-alpha', name: 'Alpha Trader Wallet' },
    { id: 'wallet-dca-sol', name: 'DCA SOL Wallet' },
    { id: 'wallet-lp-provider', name: 'LP Provider Wallet' },
    { id: 'wallet-perp-trader', name: 'Perp Trader Wallet' },
    { id: 'wallet-x-info', name: 'X Info Wallet' },
  ];

  useEffect(() => {
    setSystemPrompt(initialData.systemPrompt);
    setModel(initialData.model);
    setMcpDependencies(initialData.config.dependentMCPs || []);
    setAgentDependencies(initialData.config.dependentAgents || []);
    setOutputActions(initialData.config.outputActions || []);
    setAssociatedWalletId(initialData.associatedWalletId);
    setAutoRefillServiceCredits(initialData.autoRefillServiceCredits);
    setServiceCreditsRefillThreshold(initialData.serviceCreditsRefillThreshold);
    setServiceCreditsRefillAmount(initialData.serviceCreditsRefillAmount);
    setAutoRefillSol(initialData.autoRefillSol);
    setSolRefillThreshold(initialData.solRefillThreshold);
    setSolRefillAmount(initialData.solRefillAmount);
    setSolRefillSourceEoa(initialData.solRefillSourceEoa);
  }, [initialData]);

  // MCP Handlers
  const handleAddMCP = () => {
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
    console.log("Configure MCP at index:", index, mcpDependencies[index]);
    alert(`Configure MCP: ${mcpDependencies[index].mcpName} (parameters: ${JSON.stringify(mcpDependencies[index].parameters)}) - Placeholder`);
  };

  // Agent Dependency (A2A) Handlers
  const handleAddAgentDependency = () => {
    const newAgentDep: AgentDependency = {
      dependentAgentId: `agent-mock-${Date.now()}`,
      dependentAgentName: `Mock Dependent Agent ${agentDependencies.length + 1}`,
      interactionConfig: { dataToShare: 'all' },
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
      outputType: 'TELEGRAM_NOTIFIER',
      outputProviderName: `Mock Notifier ${outputActions.length + 1}`,
      parameters: { chatId: '@mockChannel' },
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

  const handleSubmit = () => {
    const stepOutput: ConfigStepOutputData = {
      systemPrompt,
      model,
      triggerType: TriggerType.MANUAL,
      triggerConfig: null,
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
    };
    onNext(stepOutput);
  };

  return (
    <div className="p-6 card bg-base-100 shadow-xl space-y-8">
      <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Step 3: Configure Agent Logic
      </h2>

      <div className="form-control">
        <label className="label" htmlFor="model">
          <span className="label-text text-base">AI Model</span>
        </label>
        <select
          id="model"
          className="select select-bordered w-full"
          value={model}
          onChange={(e) => setModel(e.target.value as AIModel)}
        >
          {AVAILABLE_MODELS.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="agent-system-prompt-cfg">
          <span className="label-text text-base">System Prompt</span>
        </label>
        <textarea
          id="agent-system-prompt-cfg"
          className="textarea textarea-bordered w-full font-mono text-sm"
          rows={5}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        ></textarea>
      </div>

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

      <div className="mt-8 flex justify-between">
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Next: Test Agent</button>
      </div>
    </div>
  );
};

export default AgentConfigStep;
