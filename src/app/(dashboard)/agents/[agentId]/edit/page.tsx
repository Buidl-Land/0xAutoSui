"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AgentForm from "@/components/agents/AgentForm";
import { ExtendedAgent, mockAgents } from "@/data/mockAgents";
import Link from "next/link";
import { ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import AgentChat from "@/components/AgentChat"; // Import AgentChat

const getMockAgentData = (agentId: string | string[] | undefined): ExtendedAgent | null => {
  if (!agentId || Array.isArray(agentId)) return null;
  return mockAgents.find((agent) => agent.id === agentId) || null;
};

const EditAgentPage = () => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.agentId;
  const [agent, setAgent] = useState<ExtendedAgent | null>(null);

  useEffect(() => {
    const currentAgent = getMockAgentData(agentId);
    setAgent(currentAgent);
  }, [agentId]);

  const handleSubmit = (formData: ExtendedAgent) => {
    // In a real app, you would send this data to your backend API
    console.log("Updating agent:", agentId, formData);
    // Update in mockAgents for now for demonstration
    // const agentIndex = mockAgents.findIndex(a => a.id === agentId);
    // if (agentIndex !== -1) {
    //   mockAgents[agentIndex] = { ...mockAgents[agentIndex], ...formData, updatedAt: new Date() };
    // }
    alert(`Agent "${formData.name}" updated successfully (mock)!`);
    router.push(`/agents/${agentId}`); // Redirect to the agent detail page
  };

  if (!agent) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-error p-10">
          <InformationCircleIcon className="h-12 w-12 mx-auto mb-4" />
          Agent not found! Cannot edit.
        </div>
        <div className="text-center mt-4">
          <Link href="/agents" className="btn btn-outline">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Agent List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
       <div className="mb-6">
        <Link href={`/agents/${agentId}`} className="btn btn-ghost mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Agent Details
        </Link>
      </div>
      <AgentForm agent={agent} onSubmit={handleSubmit} isEditMode={true} />
      {agent.agentType === 'Chat' && agent.id && (
        <div className="mt-8 p-6 bg-base-200 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-primary">
            Chat Test
          </h2>
          <AgentChat agentId={agent.id} />
        </div>
      )}
    </div>
  );
};

export default EditAgentPage;