"use client";

import React, { useState } from "react";
import TriggerModal from "@/components/TriggerModal"; // Import the modal
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { TriggerData, TriggerTimeType, MCPCondition } from "@/types/trigger"; // Import shared types

// Local definitions removed

// Mock Trigger Data (Replace with actual API call) - Type annotation updated
const mockTriggers: TriggerData[] = [
  {
    id: "trigger-1",
    name: "BTC 5min Check",
    prompt: "Check BTC price and log it.", // Added mock prompt
    timeType: "interval",
    interval: "5min",
    agentName: "DCA BTC", // Updated based on Plan1.md
    status: "Active",
  },
  {
    id: "trigger-2",
    name: "KOL Tweet Scan (Hourly)",
    prompt: "Scan tweets for #DegenToken and summarize.", // Added mock prompt
    timeType: "cron",
    cronExpression: "0 * * * *", // Every hour
    mcpCondition: { mcpId: "mcp3", keyword: "#DegenToken" },
    agentName: "X信息收集整理", // Updated based on Plan1.md
    status: "Active",
  },
  {
    id: "trigger-3",
    name: "Daily Meme Follow",
    prompt: "Find and follow new meme accounts.", // Added mock prompt
    timeType: "interval",
    interval: "1day",
    agentName: "市场分析Agent", // Updated based on Plan1.md
    status: "Paused",
  },
   {
    id: "trigger-4",
    name: "BNB Contract Monitor (15min)",
    prompt: "Monitor BNB chain for new contract deployments.", // Added mock prompt
    timeType: "interval",
    interval: "15min",
    mcpCondition: { mcpId: "mcp5", keyword: "ContractDeployed" },
    agentName: "New CA Sniper (BNB Chain)",
    status: "Active",
  },
];

const TriggersPage = () => {
  const [triggers, setTriggers] = useState<TriggerData[]>(mockTriggers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<TriggerData | null>(null);

  const handleOpenAddModal = () => {
    setEditingTrigger(null); // Clear editing data for Add mode
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trigger: TriggerData) => {
    setEditingTrigger(trigger);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrigger(null); // Clear editing data on close
  };

  const handleSaveTrigger = (triggerData: TriggerData) => {
    // Mock saving logic
    if (editingTrigger) {
      // Edit existing trigger
      setTriggers((prevTriggers) =>
        prevTriggers.map((t) =>
          t.id === editingTrigger.id ? { ...t, ...triggerData } : t
        )
      );
      console.log("Mock Edit Trigger:", { ...editingTrigger, ...triggerData });
    } else {
      // Add new trigger
      const newTrigger = { ...triggerData, id: `trigger-${Date.now()}` }; // Generate mock ID
      setTriggers((prevTriggers) => [...prevTriggers, newTrigger]);
      console.log("Mock Add Trigger:", newTrigger);
    }
    // Ensure the saved data conforms to the imported TriggerData type
    // (The ID generation logic already handles the optional 'id' for new triggers)
    handleCloseModal(); // Close modal after save
  };

  const handleDeleteTrigger = (triggerId: string) => {
    // Mock delete logic
    if (window.confirm("Are you sure you want to delete this trigger?")) {
      setTriggers((prevTriggers) =>
        prevTriggers.filter((t) => t.id !== triggerId)
      );
      console.log("Mock Delete Trigger:", triggerId);
    }
  };

  // Helper to display trigger time concisely
  const displayTriggerTime = (trigger: TriggerData): string => {
    if (trigger.timeType === "interval") {
      return `Interval: ${trigger.interval}`;
    }
    if (trigger.timeType === "cron") {
      return `Cron: ${trigger.cronExpression}`;
    }
    return "N/A";
  };

   // Helper to display MCP condition concisely
  const displayMcpCondition = (trigger: TriggerData): string => {
    if (trigger.mcpCondition) {
      return `MCP: ${trigger.mcpCondition.mcpId} (Keyword: "${trigger.mcpCondition.keyword}")`;
    }
    return "None";
  };


  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Manage Triggers</h1>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
          <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Trigger
        </button>
      </div>

      {/* Triggers Table */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Agent</th>
              <th>Automatic Time</th>
              <th>Manual Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {triggers.map((trigger) => (
              <tr key={trigger.id}>
                <td>{trigger.name}</td>
                <td>{trigger.agentName || "N/A"}</td>
                <td>{displayTriggerTime(trigger)}</td>
                <td>{displayMcpCondition(trigger)}</td>
                <td>
                  <span
                    className={`badge ${
                      trigger.status === "Active" ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {trigger.status || "N/A"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-ghost btn-xs"
                      aria-label={`Edit Trigger ${trigger.name}`}
                      onClick={() => handleOpenEditModal(trigger)}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      aria-label={`Delete Trigger ${trigger.name}`}
                      // Only call delete if trigger.id exists
                      onClick={() => trigger.id && handleDeleteTrigger(trigger.id)}
                      disabled={!trigger.id} // Optionally disable button if no ID
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {triggers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-base-content/70">
                  No triggers found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Render the modal */}
      <TriggerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTrigger}
        initialData={editingTrigger}
        agentId="global" // Pass placeholder agentId for this context
      />
    </div>
  );
};

export default TriggersPage;