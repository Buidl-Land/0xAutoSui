"use client";

import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TaskData, TaskTimeType, MCPCondition } from "@/types/task"; // MODIFIED

interface TaskConfigModalProps { // MODIFIED
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskData) => void; // MODIFIED
  initialData: TaskData | null; // MODIFIED
  initialPrompt?: string;
  agentId: string;
}

const TaskConfigModal: React.FC<TaskConfigModalProps> = ({ // MODIFIED
  isOpen,
  onClose,
  onSave,
  initialData,
  initialPrompt,
  agentId,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  // Mock MCP list (replace with actual data fetching)
  const mockMcps = [
    { id: "mcp1", name: "Price Feed MCP" },
    { id: "mcp2", name: "DEX Swap MCP" },
    { id: "mcp3", name: "Social Feed MCP" },
    { id: "mcp4", name: "CEX Trade MCP" },
    { id: "mcp5", name: "WalletAnalyze" },
    { id: "mcp6", name: "GoPlus" },
    { id: "mcp7", name: "JupSwap" },
  ];

  const createDefaultState = (): TaskData => { // MODIFIED
    const defaultState: TaskData = { // MODIFIED
        name: "",
        prompt: initialPrompt || "",
        timeType: "interval",
        interval: "5min",
        mcpCondition: null,
    };
    return defaultState;
  };

  const [formData, setFormData] = useState<TaskData>( // MODIFIED
    initialData || createDefaultState()
  );
  const [showCronInput, setShowCronInput] = useState(
    initialData?.timeType === "cron" || (!initialData && false)
  );
  const [showMcpCondition, setShowMcpCondition] = useState(
    !!initialData?.mcpCondition || (!initialData && !!initialPrompt)
  );

  const intervals: NonNullable<TaskData["interval"]>[] = [ // MODIFIED
    "1min",
    "5min",
    "15min",
    "30min",
    "1hour",
    "1day",
  ];

  useEffect(() => {
    const newState = initialData || createDefaultState();
    setFormData(newState);
    setShowCronInput(newState.timeType === "cron");
    setShowMcpCondition(!!newState.mcpCondition);
  }, [initialData, initialPrompt, isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        if (!modalElement.hasAttribute("open")) {
          modalElement.showModal();
        }
      } else {
        if (modalElement.hasAttribute("open")) {
          modalElement.close();
        }
      }
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev: TaskData) => { // MODIFIED
      const updatedData = { ...prev };

      if (name === "name") {
        updatedData.name = value;
      } else if (name === "prompt") {
        updatedData.prompt = value;
      } else if (name === "timeType") {
        const newTimeType = value as TaskTimeType; // MODIFIED
        updatedData.timeType = newTimeType;
        setShowCronInput(newTimeType === "cron");
        if (newTimeType === "cron") {
          delete updatedData.interval;
          if (!updatedData.cronExpression) updatedData.cronExpression = "";
        } else {
          delete updatedData.cronExpression;
          if (!updatedData.interval) updatedData.interval = "5min";
        }
      } else if (name === "interval") {
        updatedData.interval = value as TaskData["interval"]; // MODIFIED
      } else if (name === "cronExpression") {
        updatedData.cronExpression = value;
      } else if (name === "mcpConditionToggle") {
         const isChecked = (e.target as HTMLInputElement).checked;
         setShowMcpCondition(isChecked);
         if (isChecked) {
            if (!updatedData.mcpCondition) {
                updatedData.mcpCondition = { mcpId: mockMcps[0]?.id || "", keyword: "" };
            }
         } else {
            updatedData.mcpCondition = null;
         }
      } else if (name === "mcpId") {
         if (updatedData.mcpCondition) {
            updatedData.mcpCondition.mcpId = value;
         }
      } else if (name === "mcpKeyword") {
         if (updatedData.mcpCondition) {
            updatedData.mcpCondition.keyword = value;
         }
      }
      return updatedData;
    });
  };

  const handleSaveClick = () => {
    if (!formData?.name) {
        alert("Task name is required."); // MODIFIED
        return;
    }
    if (!formData?.prompt) {
        alert("Task prompt is required."); // MODIFIED
        return;
    }
    if (formData.timeType === 'interval' && !formData.interval) {
        alert("Please select an interval.");
        return;
    }
    if (formData.timeType === 'cron' && !formData.cronExpression) {
        alert("Please enter a Cron expression.");
        return;
    }
     if (showMcpCondition && (!formData.mcpCondition?.mcpId || !formData.mcpCondition?.keyword)) {
        alert("Please select an MCP and enter a keyword for the manual condition.");
        return;
    }

    if (formData) {
      onSave(formData);
    }
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      id="task_edit_modal_component" // MODIFIED
      className={`modal ${isOpen ? "modal-open" : ""}`}
      ref={modalRef}
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      {isOpen && <div className="modal-box w-11/12 max-w-lg overflow-hidden">
        <h3 className="font-bold text-lg mb-4 break-words">
          {initialData ? "Edit" : "Add"} Task Configuration {/* MODIFIED */}
        </h3>

        {formData && (
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Task Name */}
            <div className="form-control mb-4">
              <label className="label" htmlFor="task-name"> {/* MODIFIED */}
                <span className="label-text break-words">Task Name</span> {/* MODIFIED */}
              </label>
              <input
                id="task-name" // MODIFIED
                name="name"
                type="text"
                placeholder="e.g., Check SOL Price Hourly"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Task Prompt */}
            <div className="form-control mb-4">
              <label className="label" htmlFor="task-prompt"> {/* MODIFIED */}
                <span className="label-text break-words">Task Prompt / Action</span> {/* MODIFIED */}
              </label>
              <textarea
                id="task-prompt" // MODIFIED
                name="prompt"
                placeholder="e.g., Check the AHR999 index and buy $100 SOL if it's below 0.45."
                value={formData.prompt}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-24"
                required
              />
               <div className="label">
                   <span className="label-text-alt break-all">This is the instruction that will be sent to the agent <br /> when the task runs.</span> {/* MODIFIED */}
                </div>
            </div>

            {/* Task Time Type Selection */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text break-words">Automatic Task Time</span> {/* MODIFIED */}
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="timeType"
                    className="radio radio-primary"
                    value="interval"
                    checked={formData.timeType === "interval"}
                    onChange={handleInputChange}
                  />
                  <span className="label-text break-words">Interval</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="timeType"
                    className="radio radio-primary"
                    value="cron"
                    checked={formData.timeType === "cron"}
                    onChange={handleInputChange}
                  />
                  <span className="label-text break-words">Cron Expression</span>
                </label>
              </div>
            </div>

            {/* Interval Selection */}
            {!showCronInput && (
              <div className="form-control mb-4">
                <label className="label" htmlFor="task-interval"> {/* MODIFIED */}
                  <span className="label-text break-words">Select Interval</span>
                </label>
                <select
                  id="task-interval" // MODIFIED
                  name="interval"
                  className="select select-bordered w-full"
                  value={formData.interval || ""}
                  onChange={handleInputChange}
                >
                  {intervals.map((interval) => (
                    <option key={interval} value={interval}>
                      {interval}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Cron Expression Input */}
            {showCronInput && (
              <div className="form-control mb-4">
                <label className="label" htmlFor="task-cron"> {/* MODIFIED */}
                  <span className="label-text break-words">Cron Expression</span>
                </label>
                <input
                  id="task-cron" // MODIFIED
                  name="cronExpression"
                  type="text"
                  placeholder="e.g., 0 * * * *"
                  value={formData.cronExpression || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full font-mono"
                  required={showCronInput}
                />
                 <div className="label">
                    <span className="label-text-alt">Need help? <a href="https://crontab.guru/" target="_blank" rel="noopener noreferrer" className="link link-primary">Crontab Guru</a></span>
                 </div>
              </div>
            )}

             <div className="divider">Optional: Manual MCP Condition</div>

             {/* MCP Condition Toggle */}
             <div className="form-control mb-4">
                <label className="label cursor-pointer">
                  <span className="label-text break-words">Enable Manual Task Condition?</span> {/* MODIFIED */}
                  <input
                    type="checkbox"
                    name="mcpConditionToggle"
                    className="toggle toggle-primary"
                    checked={showMcpCondition}
                    onChange={handleInputChange}
                  />
                </label>
             </div>

             {/* MCP Condition Fields (shown if toggled) */}
             {showMcpCondition && (
                <>
                 <div className="form-control mb-4">
                    <label className="label" htmlFor="mcp-select">
                      <span className="label-text break-words">Select MCP</span>
                    </label>
                    <select
                      id="mcp-select"
                      name="mcpId"
                      className="select select-bordered w-full"
                      value={formData.mcpCondition?.mcpId || ""}
                      onChange={handleInputChange}
                      required={showMcpCondition}
                    >
                      <option disabled value="">-- Select an MCP --</option>
                      {mockMcps.map((mcp) => (
                        <option key={mcp.id} value={mcp.id}>
                          {mcp.name} ({mcp.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control mb-4">
                    <label className="label" htmlFor="mcp-keyword">
                      <span className="label-text break-words">Keyword/Condition</span>
                    </label>
                    <input
                      id="mcp-keyword"
                      name="mcpKeyword"
                      type="text"
                      placeholder="e.g., 'buy signal detected'"
                      value={formData.mcpCondition?.keyword || ""}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required={showMcpCondition}
                    />
                     <div className="label">
                          <span className="label-text-alt break-all">Agent will run automatically at the time above, AND if this condition is met in the selected MCP's output.</span>
                       </div>
                    </div>
                  </>
             )}

          </form>
        )}
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" onClick={handleSaveClick}>
            Save Task {/* MODIFIED */}
          </button>
        </div>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>}
    </dialog>
  );
};

export default TaskConfigModal; // MODIFIED