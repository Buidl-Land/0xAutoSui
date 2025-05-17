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
import { mockAgentTemplates, AgentTemplate } from "@/data/mockAgentTemplates";

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
    model: AIModel.Gemini25Pro, // Default model
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const [quickCreatePrompt, setQuickCreatePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullFormAfterPrompt, setShowFullFormAfterPrompt] = useState(false);

  const handleMethodSelect = (method: AgentCreationMethod) => {
    setCreationMethod(method);
    let initialSystemPrompt = agentData.systemPrompt || 'You are a helpful AI assistant. Be concise and friendly.';
    if (method === 'prompt') {
      initialSystemPrompt = 'The user will provide a prompt to define my goal. I will do my best to fulfill it.';
      setShowFullFormAfterPrompt(false);
      setSelectedTemplateId(null);
    } else if (method === 'template') {
      // For template, we'll show template selection first, then the form.
      setShowFullFormAfterPrompt(false); // Don't show full form immediately, show templates first
      setSelectedTemplateId(null); // Reset selected template
    } else { // manual
      setShowFullFormAfterPrompt(true);
      setSelectedTemplateId(null);
    }
    setAgentData(prev => ({
      ...prev,
      systemPrompt: initialSystemPrompt, // Reset or set initial prompt based on method
    }));
    setCurrentStep(2);
  };

  const handleTemplateSelect = (template: AgentTemplate) => {
    setAgentData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      iconUrl: template.iconUrl,
      systemPrompt: template.systemPrompt,
      model: template.model,
      triggerType: template.triggerType,
      triggerConfig: template.triggerConfig,
      config: template.config,
      tasks: template.tasks || [],
      // Reset wallet fields unless template provides them (which it doesn't currently)
      associatedWalletId: null,
      autoRefillServiceCredits: false,
      serviceCreditsRefillThreshold: 50,
      serviceCreditsRefillAmount: 200,
      autoRefillSol: false,
      solRefillThreshold: 0.1,
      solRefillAmount: 0.5,
      solRefillSourceEoa: '',
    }));
    setSelectedTemplateId(template.id);
    setShowFullFormAfterPrompt(true); // Now show the basic info form, pre-filled
    // currentStep remains 2, AgentBasicInfoStep will be rendered with pre-filled data
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

  const handleGenerateFromPrompt = async () => {
    if (!quickCreatePrompt.trim()) return;
    setIsGenerating(true);
    // Placeholder for actual generation logic (e.g., API call)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate async work

    // Populate agentData based on the prompt (example)
    setAgentData(prev => ({
      ...prev,
      name: quickCreatePrompt.substring(0, 30) + (quickCreatePrompt.length > 30 ? "..." : ""),
      description: `Agent generated from prompt: "${quickCreatePrompt}"`,
      systemPrompt: `Based on the user prompt: "${quickCreatePrompt}", your primary goal is to [elaborate based on prompt]. Be helpful and efficient.`,
      // Potentially set other fields like model, initial tasks, etc.
    }));

    setIsGenerating(false);
    setShowFullFormAfterPrompt(true); // Trigger display of the full form (AgentBasicInfoStep)
    // currentStep is already 2, so AgentBasicInfoStep will render with new agentData
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
        if (creationMethod === 'prompt' && !showFullFormAfterPrompt) {
          // Render Quick Create Prompt Input UI
          return (
            <div className="p-6 card bg-base-100 shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">Quick Create: Describe Your Agent</h2>
              <p className="mb-1 text-sm text-base-content/70">
                Enter a prompt describing what you want your agent to do.
              </p>
              <p className="mb-4 text-xs text-base-content/50">
                Example: "An agent that checks my favorite crypto news sites every morning and DMs me a summary on Telegram."
              </p>
              <textarea
                className="textarea textarea-bordered w-full h-32 mb-4"
                placeholder="e.g., Create an agent that summarizes daily news about AI and posts it to a Discord channel."
                value={quickCreatePrompt}
                onChange={(e) => setQuickCreatePrompt(e.target.value)}
                disabled={isGenerating}
              />
              <div className="mt-6 flex justify-between">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setCurrentStep(1);
                    setCreationMethod(null);
                    setShowFullFormAfterPrompt(false);
                    setQuickCreatePrompt("");
                    setSelectedTemplateId(null);
                  }}
                  disabled={isGenerating}
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Method
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateFromPrompt}
                  disabled={isGenerating || !quickCreatePrompt.trim()}
                >
                  {isGenerating && <span className="loading loading-spinner mr-2"></span>}
                  {isGenerating ? "Generating..." : "Generate Agent"}
                </button>
              </div>
            </div>
          );
        } else if (creationMethod === 'template' && !showFullFormAfterPrompt) {
          // Render Template Selection UI
          return (
            <div className="p-6 card bg-base-100 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Select an Agent Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {mockAgentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="card bordered cursor-pointer hover:shadow-lg transition-shadow bg-base-200 hover:bg-base-300"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg">{template.name}</h3>
                      <p className="text-xs text-base-content/70 h-12 overflow-hidden">
                        {template.description}
                      </p>
                      {template.category && (
                        <div className="badge badge-sm badge-outline mt-2">{template.category}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-start">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setCurrentStep(1);
                    setCreationMethod(null);
                    setSelectedTemplateId(null);
                  }}
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Method
                </button>
              </div>
            </div>
          );
        }
        // If not 'prompt' method, or if 'prompt' method and generation is done (showFullFormAfterPrompt is true)
        return (
          <AgentBasicInfoStep
            initialData={{
              name: agentData.name!,
              description: agentData.description!,
              iconUrl: agentData.iconUrl,
              systemPrompt: agentData.systemPrompt
            }}
            onNext={handleBasicInfoNext}
            onBack={() => {
              if (creationMethod === 'prompt' && showFullFormAfterPrompt) {
                // If coming back from BasicInfo after prompt generation,
                // go back to the prompt input screen.
                setShowFullFormAfterPrompt(false);
                // currentStep remains 2, so the prompt input UI will render.
              } else {
                // Default back behavior: go to step 1 (method selection)
                setCurrentStep(1);
                setCreationMethod(null);
                setShowFullFormAfterPrompt(false);
                setQuickCreatePrompt("");
                setSelectedTemplateId(null); // Also reset selected template
              }
            }}
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