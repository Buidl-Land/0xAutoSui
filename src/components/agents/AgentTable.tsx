"use client";

import React from "react";
import Link from "next/link";
import { Agent, AgentStatus } from "@/types/agent";
import {
  EyeIcon,
  PencilIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface AgentTableProps {
  agents: Agent[];
  onEdit: (agentId: string) => void;
  onToggleStatus: (agentId: string, currentStatus: AgentStatus) => void;
  onDelete: (agentId: string) => void;
}

const getStatusBadgeClass = (status?: AgentStatus | string) => { // Allow string for now from mock
  if (!status) return "badge-neutral";
  switch (status) {
    case AgentStatus.RUNNING:
      return "badge-success";
    case AgentStatus.SCHEDULED:
      return "badge-info";
    case AgentStatus.STOPPED:
    case AgentStatus.IDLE: // Added IDLE as per enum, maps to ghost
    case "Paused": // Keep for potential mock data string values
      return "badge-ghost";
    case AgentStatus.ERROR:
      return "badge-error";
    case AgentStatus.PENDING:
        return "badge-warning"; // Added PENDING
    default:
      // Handle other string statuses from mock if necessary, or default
      if (typeof status === 'string') {
        if (status.toLowerCase() === 'running') return "badge-success";
        if (status.toLowerCase() === 'scheduled') return "badge-info";
        if (status.toLowerCase() === 'stopped' || status.toLowerCase() === 'paused') return "badge-ghost";
        if (status.toLowerCase() === 'error') return "badge-error";
      }
      return "badge-neutral";
  }
};

const AgentTable: React.FC<AgentTableProps> = ({
  agents,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Trigger</th>
            <th>Next Run</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => {
            // Type guard for nextRunTime
            const nextRunTime = 'nextRunTime' in agent ? (agent as any).nextRunTime : undefined;
            const currentStatus = agent.status as AgentStatus || AgentStatus.STOPPED; // Cast and provide default

            return (
              <tr key={agent.id} className="hover">
                <td>
                  <Link href={`/agents/${agent.id}`} className="link link-hover">
                    {agent.name}
                  </Link>
                </td>
                <td>
                  <span className={`badge badge-sm ${getStatusBadgeClass(agent.status as AgentStatus)}`}>
                    {agent.status || "N/A"}
                  </span>
                </td>
                <td>{agent.triggerType || "N/A"}</td>
                <td>
                  {agent.status === AgentStatus.SCHEDULED && nextRunTime
                    ? new Date(nextRunTime).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link href={`/agents/${agent.id}`} className="btn btn-xs btn-ghost" title="Details">
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(agent.id)}
                      className="btn btn-xs btn-ghost"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(agent.id, currentStatus)}
                      className="btn btn-xs btn-ghost"
                      title={currentStatus === AgentStatus.RUNNING || currentStatus === AgentStatus.SCHEDULED ? "Pause" : "Start"}
                    >
                      {currentStatus === AgentStatus.RUNNING || currentStatus === AgentStatus.SCHEDULED ? (
                        <PauseIcon className="h-4 w-4" />
                      ) : (
                        <PlayIcon className="h-4 w-4" />
                      )}
                    </button>
                    <Link href={`/agents/${agent.id}/logs`} className="btn btn-xs btn-ghost" title="Logs">
                      <DocumentTextIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(agent.id)}
                      className="btn btn-xs btn-ghost text-error"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;