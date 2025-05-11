"use client";

import React from "react";
import AgentForm from "@/components/agents/AgentForm";
import { ExtendedAgent } from "@/data/mockAgents"; // Corrected import path
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const CreateAgentPage = () => {
  const router = useRouter();

  const handleSubmit = (formData: ExtendedAgent) => {
    // In a real app, you would send this data to your backend API
    console.log("Creating new agent:", formData);
    // Add to mockAgents for now for demonstration
    // mockAgents.unshift(formData); // This would require mockAgents to be mutable and accessible here
    alert(`Agent "${formData.name}" created successfully (mock)!`);
    router.push("/agents"); // Redirect to the agent list page
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/agents" className="btn btn-ghost mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Agent List
        </Link>
      </div>
      <AgentForm onSubmit={handleSubmit} isEditMode={false} />
    </div>
  );
};

export default CreateAgentPage;