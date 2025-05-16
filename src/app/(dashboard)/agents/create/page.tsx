"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Import step components
import AgentCreationMethodStep from "@/components/agents/create/AgentCreationMethodStep";
import AgentBasicInfoStep from "@/components/agents/create/AgentBasicInfoStep";
import AgentConfigStep from "@/components/agents/create/AgentConfigStep";
// Placeholder for other step components
// import AgentTestStep from "@/components/agents/create/AgentTestStep";
// import AgentReviewStep from "@/components/agents/create/AgentReviewStep";

import { ExtendedAgent } from "@/data/mockAgents";
import { TriggerType, AgentConfig, TriggerConfig, Task, AIModel } from "@/types/agent";

export type AgentCreationMethod = 'prompt' | 'template' | 'manual';

// Define a type for the data collected in the Basic Info step
interface BasicInfoData {
  name: string;
  description: string;
  iconUrl?: string | null;
  systemPrompt?: string;
}

// ConfigStepData is now more complex due to wallet fields at root.
// We'll define the expected structure directly in handleConfigNext parameter type.
// interface ConfigStepData { ... } // Removed

const CreateAgentPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [creationMethod, setCreationMethod] = useState<AgentCreationMethod | null>(null);
  const [agentData, setAgentData] = useState<Partial<ExtendedAgent>>({
    name: '',
    description: '',
    iconUrl: null,
    systemPrompt: 'You are a helpful AI assistant. Be concise and friendly.', // Default system prompt
    model: AIModel.Claude37Sonnet,
    triggerType: TriggerType.MANUAL,
    triggerConfig: null, // Explicitly null
    config: { dependentMCPs: [], dependentAgents: [], outputActions: [] },
    tasks: [],
    // Initialize wallet fields
    associatedWalletId: null,
    autoRefillServiceCredits: false,
    serviceCreditsRefillThreshold: 50,
    serviceCreditsRefillAmount: 200,
    autoRefillSol: false,
    solRefillThreshold: 0.1,
    solRefillAmount: 0.5,
    solRefillSourceEoa: '',
  });

  const handleMethodSelect = (method: AgentCreationMethod) => {
    setCreationMethod(method);
    let initialSystemPrompt = agentData.systemPrompt || '';
    if (method === 'prompt') {
      initialSystemPrompt = 'The user will provide a prompt to define my goal. I will do my best to fulfill it.';
    }
    setAgentData(prev => ({
      ...prev,
      systemPrompt: initialSystemPrompt,
    }));
    setCurrentStep(2);
  };

  const handleBasicInfoNext = (data: BasicInfoData) => {
    setAgentData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleConfigNext = (data: {
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
  }) => {
    setAgentData(prev => ({
      ...prev,
      systemPrompt: data.systemPrompt,
      model: data.model,
      triggerType: data.triggerType,
      triggerConfig: data.triggerConfig,
      config: data.config,
      associatedWalletId: data.associatedWalletId,
      autoRefillServiceCredits: data.autoRefillServiceCredits,
      serviceCreditsRefillThreshold: data.serviceCreditsRefillThreshold,
      serviceCreditsRefillAmount: data.serviceCreditsRefillAmount,
      autoRefillSol: data.autoRefillSol,
      solRefillThreshold: data.solRefillThreshold,
      solRefillAmount: data.solRefillAmount,
      solRefillSourceEoa: data.solRefillSourceEoa,
    }));
    setCurrentStep(4);
  };

  const handleFinalSubmit = () => {
    console.log("Creating new agent (final data):", agentData as ExtendedAgent);
    alert(`Agent "${agentData.name}" to be created (mock)!`);
    router.push("/agents");
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AgentCreationMethodStep onSelectMethod={handleMethodSelect} />;
      case 2:
        return (
          <AgentBasicInfoStep
            initialData={{
              name: agentData.name!,
              description: agentData.description!,
              iconUrl: agentData.iconUrl,
              systemPrompt: agentData.systemPrompt
            }}
            onNext={handleBasicInfoNext}
            onBack={prevStep}
            creationMethod={creationMethod}
          />
        );
      case 3:
        return (
          <AgentConfigStep
            initialData={{
              systemPrompt: agentData.systemPrompt!,
              model: agentData.model!,
              triggerType: agentData.triggerType!,
              triggerConfig: agentData.triggerConfig || null,
              config: agentData.config!,
              associatedWalletId: agentData.associatedWalletId,
              autoRefillServiceCredits: agentData.autoRefillServiceCredits,
              serviceCreditsRefillThreshold: agentData.serviceCreditsRefillThreshold,
              serviceCreditsRefillAmount: agentData.serviceCreditsRefillAmount,
              autoRefillSol: agentData.autoRefillSol,
              solRefillThreshold: agentData.solRefillThreshold,
              solRefillAmount: agentData.solRefillAmount,
              solRefillSourceEoa: agentData.solRefillSourceEoa,
            }}
            onNext={handleConfigNext}
            onBack={prevStep}
          />
        );
      case 4: // Placeholder for Test step
         return (
          <div className="p-6 card bg-base-100 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Step 4: Test Agent (Optional)</h2>
            <p>Interface to test the configured tasks or agent responses.</p>
            <div className="mt-6 flex justify-between">
              <button className="btn btn-ghost" onClick={prevStep}>Back</button>
              <button className="btn btn-success" onClick={() => setCurrentStep(5)}>Next: Review & Create</button>
            </div>
          </div>
        );
      case 5: // Placeholder for Review step
         return (
          <div className="p-6 card bg-base-100 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Step 5: Review & Create Agent</h2>
            <p>Summary of agent configuration will be shown here.</p>
            <pre className="bg-base-200 p-2 rounded-md text-xs overflow-auto max-h-60">
                {JSON.stringify(agentData, null, 2)}
            </pre>
            <div className="mt-6 flex justify-between">
              <button className="btn btn-ghost" onClick={prevStep}>Back</button>
              <button className="btn btn-success" onClick={handleFinalSubmit}>Create Agent</button>
            </div>
          </div>
        );
      default:
        return <AgentCreationMethodStep onSelectMethod={handleMethodSelect} />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-secondary">
          {currentStep <= 1 ? "Create New Agent" : `Create Agent: Step ${currentStep}`}
        </h1>
        <Link href="/agents" className="btn btn-ghost">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Agent List
        </Link>
      </div>

      {/* Simple Progress Indicator */}
      <div className="mb-8 text-center">
        <p className="text-sm text-base-content/70">Step {currentStep} of 5</p>
        {/* More detailed steps component can be added here if needed */}
        <progress className="progress progress-primary w-full max-w-md mx-auto" value={(currentStep / 5) * 100} max="100"></progress>
      </div>

      {renderStep()}
    </div>
  );
};

export default CreateAgentPage;