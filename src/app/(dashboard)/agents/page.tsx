"use client";

import React from "react";
import Link from "next/link"; // Import Link
import { Agent } from "@/types/agent"; // Import Agent type
import { mockAgents as agents } from "@/data/mockAgents"; // Import mockAgents

const AgentsPage = () => {
  // Mock data is now imported from src/data/mockAgents.ts
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Agents</h1>
        <button className="btn btn-primary">Create New Agent</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(
          (
            agent // Ensure this opening parenthesis is here
          ) => (
            <Link href={`/agents/${agent.id}`} key={agent.id} passHref>
              <div className="card bg-base-100 shadow-xl h-full cursor-pointer hover:shadow-2xl transition-shadow duration-300">
                <div className="card-body">
                  {/* Tooltip for name */}
                  <div className="tooltip w-full" data-tip={agent.name}>
                    <h2 className="card-title flex items-start justify-between gap-2 min-h-12">
                      <span className="line-clamp-2 flex-grow">{agent.name}</span>
                      {/* Status badge - conditional */}
                      {agent.agentType === "Task" && agent.status && (
                        <span
                          className={`badge badge-sm ${
                            agent.status === "Running"
                              ? "badge-success"
                              : agent.status === "Stopped"
                              ? "badge-ghost"
                              : agent.status === "Error"
                              ? "badge-error"
                              : "badge-neutral"
                          }`}
                        >
                          {agent.status}
                        </span>
                      )}
                    </h2>
                  </div>
                  {/* Agent Type */}
                  <p className="text-xs font-semibold text-info mb-1">
                    Type: {agent.agentType}
                  </p>
                  {/* Description */}
                  <p className="text-sm text-base-content/70 mb-2 line-clamp-2">
                    {agent.description}
                  </p>
                  {/* Last Modified */}
                  <div className="text-xs text-base-content/50 mt-auto pt-2 border-t border-base-300/50">
                    Last Modified: {new Date(agent.lastModified as number).toLocaleString()}
                  </div>
                  {/* Card Actions Removed */}
                </div>
              </div>
            </Link>
          )
        )}{" "}
        {/* Ensure this closing parenthesis is here */}
      </div>
    </div>
  );
};

export default AgentsPage;
