"use client";

import React, { useState, useEffect, useRef } from "react"; // Added useRef back
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TriggerData, TriggerTimeType, MCPCondition } from "@/types/trigger"; // Import shared types

// Local definitions removed

interface TriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (triggerData: TriggerData) => void;
  initialData: TriggerData | null;
  initialPrompt?: string; // Add optional initialPrompt prop
  agentId: string; // Add agentId prop
  // agentTitle and agentDescription removed as per user request
}

const TriggerModal: React.FC<TriggerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  initialPrompt, // Destructure the new prop
  agentId, // Destructure agentId
  // agentTitle and agentDescription removed
}) => {
  const modalRef = useRef<HTMLDialogElement>(null); // Added modalRef back
  // TODO: Use agentId if needed for saving or fetching MCPs specific to the agent

  // Mock MCP list (replace with actual data fetching) - Moved up
  const mockMcps = [
    { id: "mcp1", name: "Price Feed MCP" },
    { id: "mcp2", name: "DEX Swap MCP" },
    { id: "mcp3", name: "Social Feed MCP" },
    { id: "mcp4", name: "CEX Trade MCP" },
    { id: "mcp5", name: "WalletAnalyze" },
    { id: "mcp6", name: "GoPlus" },
    { id: "mcp7", name: "JupSwap" },
  ];

  // Function to create default state, potentially using initialPrompt
  const createDefaultState = (): TriggerData => {
    const defaultState: TriggerData = {
        name: "",
        prompt: initialPrompt || "", // Initialize prompt, use initialPrompt if available when adding
        timeType: "interval",
        interval: "5min",
        mcpCondition: null,
    };
    // If adding a new trigger and an initialPrompt is provided,
    // pre-fill the MCP condition keyword and enable the condition.
    // If adding a new trigger and an initialPrompt is provided,
    // we now use it for the main prompt field above.
    // We can still optionally pre-fill the MCP condition based on it if desired,
    // but let's keep it simple for now and only pre-fill the main prompt.
    // If MCP condition is explicitly enabled later, it will get defaults.
    // if (!initialData && initialPrompt) {
    //     defaultState.mcpCondition = {
    //         mcpId: mockMcps[0]?.id || "", // Default to first MCP - Now safe
    //         keyword: initialPrompt, // Or maybe keep keyword separate?
    //     };
    //     // Also enable the condition section if pre-filling from prompt
    //     // Note: This logic is now handled by the useState initializer for showMcpCondition
    // }
    return defaultState;
  };


  // Initialize state with default values or initialData
  const [formData, setFormData] = useState<TriggerData>(
    initialData || createDefaultState()
  );
  const [showCronInput, setShowCronInput] = useState(
    initialData?.timeType === "cron" || (!initialData && false) // Default cron off for new
  );
  const [showMcpCondition, setShowMcpCondition] = useState(
    !!initialData?.mcpCondition || (!initialData && !!initialPrompt) // Show condition if initialPrompt provided
  );

  // Predefined intervals
  const intervals: NonNullable<TriggerData["interval"]>[] = [
    "1min",
    "5min",
    "15min",
    "30min",
    "1hour",
    "1day",
  ];

  useEffect(() => {
    // Reset form when initialData or initialPrompt changes
    const newState = initialData || createDefaultState();
    setFormData(newState);
    setShowCronInput(newState.timeType === "cron");
    setShowMcpCondition(!!newState.mcpCondition);
     // Note: createDefaultState now handles initialPrompt logic
  }, [initialData, initialPrompt, isOpen]); // Re-run if isOpen changes too (modal reopens)

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

    setFormData((prev) => {
      // prev is guaranteed to be TriggerData due to initialization, so no null check needed.
      const updatedData = { ...prev };

      if (name === "name") {
        updatedData.name = value;
      } else if (name === "prompt") { // Add handler for prompt field
        updatedData.prompt = value;
      } else if (name === "timeType") {
        const newTimeType = value as TriggerTimeType;
        updatedData.timeType = newTimeType;
        setShowCronInput(newTimeType === "cron");
        // Clear the other type's value when switching
        if (newTimeType === "cron") {
          delete updatedData.interval;
          if (!updatedData.cronExpression) updatedData.cronExpression = ""; // Init cron if switching
        } else {
          delete updatedData.cronExpression;
          if (!updatedData.interval) updatedData.interval = "5min"; // Default interval if switching
        }
      } else if (name === "interval") {
        updatedData.interval = value as TriggerData["interval"];
      } else if (name === "cronExpression") {
        updatedData.cronExpression = value;
      } else if (name === "mcpConditionToggle") {
         const isChecked = (e.target as HTMLInputElement).checked;
         setShowMcpCondition(isChecked);
         if (isChecked) {
            // Initialize MCP condition if toggled on
            if (!updatedData.mcpCondition) {
                updatedData.mcpCondition = { mcpId: mockMcps[0]?.id || "", keyword: "" };
            }
         } else {
            // Clear MCP condition if toggled off
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
    // Basic validation: Ensure name and either interval or cron is set
    if (!formData?.name) {
        alert("Trigger name is required.");
        return;
    }
    if (!formData?.prompt) { // Add validation for prompt
        alert("Trigger prompt is required.");
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
      onSave(formData); // Pass the current form data back
    }
    onClose(); // Close the modal after saving
  };

  // Close modal if the backdrop is clicked
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Check if the click is directly on the dialog element (the backdrop)
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Removed conditional rendering: if (!isOpen && !modalRef.current?.open) return null;

  return (
    <dialog
      id="trigger_edit_modal_component" // Unique ID for the component instance
      // Conditionally add 'modal-open' class based on isOpen prop
      className={`modal ${isOpen ? "modal-open" : ""}`}
      ref={modalRef} // Added ref back
      onClick={handleBackdropClick} // Handle backdrop click
      onClose={onClose} // Ensure onClose is called when dialog closes internally (e.g., ESC key)
    >
      {/* Added check for isOpen before rendering content to avoid flash */}
      {isOpen && <div className="modal-box w-11/12 max-w-lg overflow-hidden"> {/* Added overflow-hidden */}
        <h3 className="font-bold text-lg mb-4 break-words">
          {initialData ? "Edit" : "Add"} Trigger Configuration
        </h3>

        {/* Agent Info display removed as per user request */}

        {formData && (
          <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
            {/* Trigger Name */}
            <div className="form-control mb-4">
              <label className="label" htmlFor="trigger-name">
                <span className="label-text break-words">Trigger Name</span> {/* Added break-words */}
              </label>
              <input
                id="trigger-name"
                name="name"
                type="text"
                placeholder="e.g., Check SOL Price Hourly"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required // Basic HTML5 validation
              />
            </div>

            {/* Trigger Prompt */}
            <div className="form-control mb-4">
              <label className="label" htmlFor="trigger-prompt">
                <span className="label-text break-words">Trigger Prompt / Action</span> {/* Added break-words */}
              </label>
              <textarea
                id="trigger-prompt"
                name="prompt"
                placeholder="e.g., Check the AHR999 index and buy $100 SOL if it's below 0.45."
                value={formData.prompt}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-24" // Use textarea for longer prompts
                required
              />
               <div className="label">
                   <span className="label-text-alt break-all">This is the instruction that will be sent to the agent <br /> when the trigger runs.</span> {/* Changed to break-all */}
                </div>
            </div>

            {/* Trigger Time Type Selection */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text break-words">Automatic Trigger Time</span> {/* Added break-words */}
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
                  <span className="label-text break-words">Interval</span> {/* Added break-words */}
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
                  <span className="label-text break-words">Cron Expression</span> {/* Added break-words */}
                </label>
              </div>
            </div>

            {/* Interval Selection */}
            {!showCronInput && (
              <div className="form-control mb-4">
                <label className="label" htmlFor="trigger-interval">
                  <span className="label-text break-words">Select Interval</span> {/* Added break-words */}
                </label>
                <select
                  id="trigger-interval"
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
                <label className="label" htmlFor="trigger-cron">
                  <span className="label-text break-words">Cron Expression</span> {/* Added break-words */}
                </label>
                <input
                  id="trigger-cron"
                  name="cronExpression"
                  type="text"
                  placeholder="e.g., 0 * * * *"
                  value={formData.cronExpression || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full font-mono"
                  required={showCronInput} // Required only if Cron is selected
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
                  <span className="label-text break-words">Enable Manual Trigger Condition?</span> {/* Added break-words */}
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
                      <span className="label-text break-words">Select MCP</span> {/* Added break-words */}
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
                      <span className="label-text break-words">Keyword/Condition</span> {/* Added break-words */}
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
                          <span className="label-text-alt break-all">Agent will run automatically at the time above, AND if this condition is met in the selected MCP's output.</span> {/* Changed to break-all */}
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
            Save Trigger
          </button>
        </div>
        {/* Explicit close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>} {/* Close conditional rendering div */}
      {/* Form element removed from backdrop for better control */}
    </dialog>
  );
};

export default TriggerModal;