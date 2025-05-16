"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  InformationCircleIcon,
  CpuChipIcon,
  ShareIcon,
  CommandLineIcon,
  WalletIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Agent, AgentStatus, TaskAgent, ActionAgent, AgentType, TriggerType, ScheduledTriggerConfig, EventDrivenTriggerConfig, AgentDependency } from "@/types/agent"; // Adjusted imports
import { mockAgents } from "@/data/mockAgents";
import { ExtendedAgent, MockLog } from "@/data/mockAgents/types";
import AgentChat from "@/components/AgentChat"; // Import AgentChat
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear'; // Import DiceBear utility

const getMockAgentData = (agentId: string | string[] | undefined): ExtendedAgent | null => {
  if (!agentId || Array.isArray(agentId)) return null;
  return mockAgents.find((agent) => agent.id === agentId) || null;
};

const getStatusBadgeClass = (status?: AgentStatus | string) => {
  if (!status) return "badge-neutral";
  switch (status) {
    case AgentStatus.RUNNING: return "badge-success";
    case AgentStatus.SCHEDULED: return "badge-info";
    case AgentStatus.STOPPED: case AgentStatus.IDLE: case "Paused": return "badge-ghost";
    case AgentStatus.ERROR: return "badge-error";
    case AgentStatus.PENDING: return "badge-warning";
    default:
      if (typeof status === 'string') {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'running') return "badge-success";
        if (lowerStatus === 'scheduled') return "badge-info";
        if (lowerStatus === 'stopped' || lowerStatus === 'paused') return "badge-ghost";
        if (lowerStatus === 'error') return "badge-error";
      }
      return "badge-neutral";
  }
};


const AgentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.agentId;
  const [agent, setAgent] = useState<ExtendedAgent | null>(null);
  const [logFilterLevel, setLogFilterLevel] = useState<string>("All");
  const [logFilterTime, setLogFilterTime] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"Logs" | "Chat">("Logs");

  useEffect(() => {
    const currentAgent = getMockAgentData(agentId);
    setAgent(currentAgent);
    // Default to Chat tab for Chat agents, otherwise Logs
    if (currentAgent) {
      if (currentAgent.agentType === 'Chat') {
        setActiveTab("Chat");
      } else {
        setActiveTab("Logs");
      }
    } else {
      // Fallback if agent is null (though typically handled by early return)
      setActiveTab("Logs");
    }
  }, [agentId]);

  if (!agent) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-error p-10">
          <InformationCircleIcon className="h-12 w-12 mx-auto mb-4" />
          Agent not found!
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

  const filteredLogs = (agent.logs || []).filter((log: MockLog) => {
    // Implement actual filtering based on logFilterLevel and logFilterTime
    // For now, returning all logs
    return true;
  });

  const nextRunTimeDisplay = agent.status === AgentStatus.SCHEDULED && (agent as any).nextRunTime
    ? new Date((agent as any).nextRunTime).toLocaleString()
    : 'N/A';

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold flex items-center">
            {/* Use DiceBear avatar if iconUrl is not present */}
            <img
              src={agent.iconUrl || getDiceBearAvatar(DICEBEAR_STYLES.AGENT, agent.name || agent.id, { backgroundColor: ['transparent', 'primary', 'secondary'] })}
              alt={`${agent.name} icon`}
              className="h-10 w-10 rounded-full mr-3 object-cover bg-base-300" // Added bg-base-300
            />
            {agent.name}
          </h1>
          <div className="flex items-center space-x-3">
            <Link href={`/agents/${agent.id}/edit`} className="btn btn-outline btn-primary">
              <PencilSquareIcon className="h-5 w-5 mr-2" /> Edit Agent
            </Link>
            <Link href="/agents" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Agent List
            </Link>
          </div>
        </div>
        <p className="text-base-content/70 mb-3">{agent.description}</p>
        <div className="flex items-center space-x-3">
          <span className={`badge badge-lg ${getStatusBadgeClass(agent.status as AgentStatus)}`}>
            <TagIcon className="h-4 w-4 mr-1.5"/> Status: {agent.status || "Unknown"}
          </span>
          {agent.status === AgentStatus.SCHEDULED && (
            <span className="badge badge-lg badge-outline">
              <ClockIcon className="h-4 w-4 mr-1.5"/> Next Run: {nextRunTimeDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Agent Activity</h2>
        <div role="tablist" className="tabs tabs-bordered flex justify-start">
          <a
            role="tab"
            className={`tab tab-lg mr-4 font-medium transition-all duration-200 ${
              activeTab === "Logs"
                ? "tab-active border-b-2 border-primary text-primary"
                : "text-base-content/70 hover:text-primary"
            }`}
            onClick={() => setActiveTab("Logs")}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2 inline" /> Logs
          </a>
          <a
            role="tab"
            className={`tab tab-lg mr-4 font-medium transition-all duration-200 ${
              activeTab === "Chat"
                ? "tab-active border-b-2 border-primary text-primary"
                : "text-base-content/70 hover:text-primary"
            }`}
            onClick={() => setActiveTab("Chat")}
          >
            <ShareIcon className="h-5 w-5 mr-2 inline" /> Chat
          </a>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Logs" && (
        <>
          {/* Configuration Overview */}
          <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <CpuChipIcon className="h-7 w-7 mr-3 text-primary" />
              Configuration Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h3 className="text-lg font-medium mb-1">Trigger</h3>
                <p className="text-base-content/80">
                  {agent.triggerConfig
                    ? agent.triggerType === TriggerType.SCHEDULED
                      ? `Scheduled: ${(agent.triggerConfig as ScheduledTriggerConfig).frequency} at ${(agent.triggerConfig as ScheduledTriggerConfig).timeValue}`
                      : agent.triggerType === TriggerType.EVENT_DRIVEN
                        ? `Event: ${(agent.triggerConfig as EventDrivenTriggerConfig).eventType} from ${(agent.triggerConfig as EventDrivenTriggerConfig).eventSource}`
                        : agent.triggerType
                    : agent.triggerType || "Not Configured"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Dependent MCPs</h3>
                {agent.mcpConfig && agent.mcpConfig.length > 0 ? (
                  <ul className="list-disc list-inside text-base-content/80">
                    {agent.mcpConfig.map(mcp => (
                      <li key={mcp.id}>{mcp.name} {/* TODO: Display parameters */}</li>
                    ))}
                  </ul>
                ) : <p className="text-base-content/80">None</p>}
              </div>
              {agent.agentType === 'Task' && agent.config?.dependentAgents && (
                <div>
                  <h3 className="text-lg font-medium mb-1">Dependent Agents (A2A)</h3>
                  {agent.config.dependentAgents.length > 0 ? (
                    <ul className="list-disc list-inside text-base-content/80">
                      {agent.config.dependentAgents.map((depAgent: AgentDependency) => (
                        <li key={depAgent.dependentAgentId}>
                          {depAgent.dependentAgentName} (ID: {depAgent.dependentAgentId})
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-base-content/80">None</p>}
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium mb-1">Output Configuration</h3>
                <p className="text-base-content/80">{/* TODO: Display Output Config */ "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1 flex items-center">
                  <WalletIcon className="h-5 w-5 mr-2 text-accent" /> Associated Wallet
                </h3>
                <p className="text-base-content/80">
                  {/* TODO: Display Wallet Address and SOL Balance */}
                  Address: <span className="font-mono">XYZ...abc</span> (Balance: <span className="font-semibold">0.00 SOL</span>)
                </p>
              </div>
            </div>
          </div>

          {/* Running Logs */}
          <div className="p-6 bg-base-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <DocumentTextIcon className="h-7 w-7 mr-3 text-secondary" />
              Running Logs
            </h2>
            {/* Log Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <div className="form-control">
                <label className="label"><span className="label-text">Log Level</span></label>
                <select
                  className="select select-bordered"
                  value={logFilterLevel}
                  onChange={(e) => setLogFilterLevel(e.target.value)}
                  aria-label="Filter logs by level"
                >
                  <option value="All">All Levels</option>
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                  <option value="Debug">Debug</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Time Range</span></label>
                <select
                  className="select select-bordered"
                  value={logFilterTime}
                  onChange={(e) => setLogFilterTime(e.target.value)}
                  aria-label="Filter logs by time range"
                >
                  <option value="All">All Time</option>
                  <option value="LastHour">Last Hour</option>
                  <option value="Last24Hours">Last 24 Hours</option>
                  <option value="Last7Days">Last 7 Days</option>
                </select>
              </div>
            </div>

            {/* Log List */}
            {filteredLogs.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="card card-compact bg-base-100 shadow">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <p className="text-xs text-base-content/60">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        {/* Placeholder for log level badge */}
                        {/* <span className="badge badge-sm badge-info">INFO</span> */}
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                        {log.message || log.userPrompt || "No message content."}
                      </p>
                      {/* Could add a "View Details" button here if logs become more complex */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <CommandLineIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                <p className="text-lg text-base-content/70">No logs available for the selected filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "Chat" && (
        <>
          <AgentChat
            agentId={agent.id}
            agentName={agent.name}
            agentTitle={agent.name} // Using name as title for now
            agentDescription={agent.description}
            // Pass agentType to AgentChat for conditional logic there
            agentType={agent.agentType as AgentType}
          />
        </>
      )}
    </div>
  );
};

export default AgentDetailPage;
