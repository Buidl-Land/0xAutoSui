"use client";

import React, { useState, useRef, ChangeEvent, useEffect, FormEvent } from "react";
import { useParams } from "next/navigation";
import AgentChat from "@/components/AgentChat";
import TaskConfigModal from "@/components/TaskConfigModal";
import TriggerModal from "@/components/TriggerModal";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  ShareIcon,
  ListBulletIcon,
  ChatBubbleLeftEllipsisIcon,
  CommandLineIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { Agent, AgentType, AgentConnection, TaskAgent, ActionAgent } from "../../../../types/agent";
import { TriggerData, TriggerTimeType } from "../../../../types/trigger"; // Import TriggerData
// Import the centralized mock data and the specific types used in this component
import { mockAgents, ExtendedAgent, MockLog, MockMcpConfig, MockTriggerConfig } from "../../../../data/mockAgents";


const getMockAgentData = (agentId: string | string[] | undefined): ExtendedAgent | null => {
  if (!agentId || Array.isArray(agentId)) return null;
  return mockAgents.find((agent) => agent.id === agentId) || null;
};

interface AgentSettingsFormState {
  name: string;
  description: string;
  iconUrl: string | null;
  systemPrompt: string;
  agentType: AgentType;
}

const AgentDetailPage = () => {
  const params = useParams();
  const agentId = params?.agentId;
  const [agent, setAgent] = useState<ExtendedAgent | null>(null);
  const [activeTab, setActiveTab] = useState("task");
  const [formState, setFormState] = useState<AgentSettingsFormState>({
    name: "",
    description: "",
    iconUrl: "/logo.png",
    systemPrompt: "",
    agentType: 'Task',
  });
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>("/logo.png");
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [editingMcp, setEditingMcp] = useState<MockMcpConfig | null>(null);
  const mcpModalRef = useRef<HTMLDialogElement>(null);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<MockTriggerConfig | null>(null);
  const triggerModalRef = useRef<HTMLDialogElement>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [viewingLog, setViewingLog] = useState<MockLog | null>(null);
  const logModalRef = useRef<HTMLDialogElement>(null);
  const agentChatRef = useRef<React.ReactNode>(null);

  useEffect(() => {
    if (agent && agentId && !agentChatRef.current) {
      agentChatRef.current = (
        <AgentChat
          agentName={agent.name}
          agentId={agentId as string}
          agentTitle={agent.name}
          agentDescription={agent.description}
        />
      );
    }
  }, [agent, agentId]);

  useEffect(() => {
    const currentAgent = getMockAgentData(agentId);
    setAgent(currentAgent);
    if (currentAgent) {
      const initialFormState = {
        name: currentAgent.name,
        description: currentAgent.description,
        iconUrl: currentAgent.iconUrl || "/logo.png",
        systemPrompt: currentAgent.systemPrompt,
        agentType: currentAgent.agentType || 'Task',
      };
      setFormState(initialFormState);
      setIconPreview(currentAgent.iconUrl || "/logo.png");
      setSelectedIconFile(null);

      // Set activeTab based on agentType
      if (initialFormState.agentType === 'Action') {
        // If current activeTab is 'task' or 'a2a', switch to a default valid tab for ActionAgent
        if (activeTab === 'task' || activeTab === 'a2a') {
          setActiveTab('mcp'); // Default to 'mcp' or another suitable tab
        }
      } else {
        // For TaskAgent, 'task' can be the default if no other preference
        // setActiveTab('task'); // This was the original default, ensure it's still appropriate
      }
    }
  }, [agentId, activeTab]); // Added activeTab to dependencies to handle initial redirection correctly

  if (!agent) {
    return <div className="text-center text-error p-10">Agent not found!</div>;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "agentType") {
      const newAgentType = value as AgentType;
      setFormState(prevState => ({
        ...prevState,
        agentType: newAgentType,
      }));
      // If agentType changes to 'Action' and current tab is 'task' or 'a2a', switch to a default tab
      if (newAgentType === 'Action' && (activeTab === 'task' || activeTab === 'a2a')) {
        setActiveTab('mcp'); // Or 'settings' or the first available valid tab
      }
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedIconFile(null);
      setIconPreview(agent?.iconUrl || "/logo.png");
    }
  };

  const handleSaveSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Saving Agent Settings:", formState);
    if (selectedIconFile) {
      console.log("Icon to upload:", selectedIconFile.name);
    }
    if (agent) {
      const updatedAgentData: Partial<Agent> = { // Changed MockAgent to Agent
        name: formState.name,
        description: formState.description,
        iconUrl: selectedIconFile ? iconPreview : (agent.iconUrl || null),
        systemPrompt: formState.systemPrompt,
        agentType: formState.agentType,
      };
      // Ensure to spread existing agent properties correctly based on its type
      setAgent((prevAgent: ExtendedAgent | null): ExtendedAgent | null => {
        if (!prevAgent) return null;

        const commonUpdates = {
          name: formState.name,
          description: formState.description,
          iconUrl: selectedIconFile ? iconPreview : (prevAgent.iconUrl || null),
          systemPrompt: formState.systemPrompt,
          lastModified: Date.now(),
          updatedAt: new Date(),
        };

        // Properties to carry over from prevAgent, excluding those managed by commonUpdates or agentType specifics
        const carriedOverProps = {
          id: prevAgent.id,
          status: prevAgent.status,
          creator: prevAgent.creator,
          triggerConfig: prevAgent.triggerConfig,
          mcpConfig: prevAgent.mcpConfig,
          logs: prevAgent.logs,
          ownerId: prevAgent.ownerId,
          createdAt: prevAgent.createdAt,
        };

        if (formState.agentType === 'Task') {
          const updatedTaskAgent: ExtendedAgent = {
            ...carriedOverProps,
            ...commonUpdates,
            agentType: 'Task',
            tasks: (prevAgent.agentType === 'Task' && (prevAgent as TaskAgent).tasks) ? (prevAgent as TaskAgent).tasks : [],
            a2aConnections: (prevAgent.agentType === 'Task' && (prevAgent as TaskAgent).a2aConnections) ? (prevAgent as TaskAgent).a2aConnections : [],
          };
          return updatedTaskAgent;
        } else { // formState.agentType === 'Action'
          const updatedActionAgent: ExtendedAgent = {
            ...carriedOverProps,
            ...commonUpdates,
            agentType: 'Action',
            // ActionAgent does not have tasks or a2aConnections.
            // Ensure they are not carried over if prevAgent was a TaskAgent.
            // The `carriedOverProps` already excludes them.
          };
          return updatedActionAgent;
        }
      });
      alert("Settings saved (mock)!");
    }
  };

  const handleOpenMcpModal = (mcp: MockMcpConfig) => {
    setEditingMcp(mcp);
    mcpModalRef.current?.showModal();
    setIsMcpModalOpen(true);
  };
  const handleCloseMcpModal = () => {
    mcpModalRef.current?.close();
    setIsMcpModalOpen(false);
    setEditingMcp(null);
  };
  const handleSaveMcpChanges = () => {
    console.log("Mock Save MCP:", editingMcp);
    handleCloseMcpModal();
  };

  const handleOpenAddTriggerModal = () => {
    setEditingTrigger(null);
    setIsTriggerModalOpen(true);
  };

  const handleOpenEditTriggerModal = (trigger: MockTriggerConfig) => {
    setEditingTrigger(trigger);
    setIsTriggerModalOpen(true);
  };

  const handleCloseTriggerModal = () => {
    setIsTriggerModalOpen(false);
    setEditingTrigger(null);
  };

  const handleSaveTriggerChanges = (triggerData: TriggerData) => {
    if (editingTrigger) {
      console.log("Mock Edit Trigger:", { ...editingTrigger, ...triggerData });
    } else {
      const newTrigger: MockTriggerConfig = {
        ...triggerData,
        type: triggerData.name,
        id: `agent-trigger-${Date.now()}`,
      };
      console.log("Mock Add Trigger:", newTrigger);
    }
    handleCloseTriggerModal();
  };

  const handleOpenLogModal = (log: MockLog) => {
    setViewingLog(log);
    logModalRef.current?.showModal();
    setIsLogModalOpen(true);
  };
  const handleCloseLogModal = () => {
    logModalRef.current?.close();
    setIsLogModalOpen(false);
    setViewingLog(null);
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">{agent.name}</h1>
          <p className="text-base-content/70 mb-2">{formState.description}</p>
          <span
            className={`badge badge-lg ${
              agent?.status === "Running"
                ? "badge-success"
                : agent?.status === "Stopped"
                ? "badge-ghost"
                : agent?.status === "Error"
                ? "badge-error"
                : "badge-neutral"
            }`}
          >
            {agent?.status || "Unknown"}
          </span>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        {formState.agentType === 'Task' && (
          <input
            id="tab-task"
            type="radio"
            name="agent_tabs"
            role="tab"
            className="tab"
            aria-label="Task"
            aria-controls="panel-task"
            checked={activeTab === "task"}
            onChange={() => setActiveTab("task")}
          />
        )}
        {formState.agentType === 'Task' && (
          <input
            id="tab-a2a"
            type="radio"
            name="agent_tabs"
            role="tab"
            className="tab"
            aria-label="A2A"
            aria-controls="panel-a2a"
            checked={activeTab === "a2a"}
            onChange={() => setActiveTab("a2a")}
          />
        )}
        <input
          id="tab-mcp"
          type="radio"
          name="agent_tabs"
          role="tab"
          className="tab"
          aria-label="MCP"
          aria-controls="panel-mcp"
          checked={activeTab === "mcp"}
          onChange={() => setActiveTab("mcp")}
        />
        <input
          id="tab-logs"
          type="radio"
          name="agent_tabs"
          role="tab"
          className="tab"
          aria-label="Logs"
          aria-controls="panel-logs"
          checked={activeTab === "logs"}
          onChange={() => setActiveTab("logs")}
        />
        <input
          id="tab-chat"
          type="radio"
          name="agent_tabs"
          role="tab"
          className="tab"
          aria-label="Chat"
          aria-controls="panel-chat"
          checked={activeTab === "chat"}
          onChange={() => setActiveTab("chat")}
        />
        <input
          id="tab-settings"
          type="radio"
          name="agent_tabs"
          role="tab"
          className="tab"
          aria-label="Settings"
          aria-controls="panel-settings"
          checked={activeTab === "settings"}
          onChange={() => setActiveTab("settings")}
        />
        <a role="tab" className="tab [--tab-border-color:transparent]"></a>
      </div>

      <div className="mt-[-1px]">
        {formState.agentType === 'Task' && (
          <div
            id="panel-task"
            role="tabpanel"
            aria-labelledby="tab-task"
            className={`bg-base-100 border-base-300 border rounded-box rounded-tl-none p-6 ${
              activeTab === "task" ? "block" : "hidden"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Task Configuration</h2>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddTriggerModal}>
                <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Task Trigger
              </button>
            </div>
            <p className="mb-4 text-base-content/70">
              Define when and how this agent's tasks are triggered.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agent?.triggerConfig?.map((trigger: MockTriggerConfig, index: number) => (
                <div key={trigger.id || index} className="card bg-base-200 shadow">
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg">{trigger.name || trigger.type}</h3>
                    <div className="text-sm mt-2 space-y-1">
                      {Object.entries(trigger).map(([key, value]) => {
                        if (key === "type" && trigger.name) return null;
                        if (key === "id" || key === "name" || key === "prompt" || key === "timeType") return null;
                        return (
                          <p key={key}>
                            <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{" "}
                            <span className="opacity-80">{String(value)}</span>
                          </p>
                        );
                      })}
                       <p><span className="font-semibold">Time:</span> <span className="opacity-80">{trigger.timeType === "interval" ? trigger.interval : trigger.cronExpression}</span></p>
                       <p><span className="font-semibold">Prompt:</span> <span className="opacity-80">{trigger.prompt}</span></p>
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <button className="btn btn-ghost btn-xs" aria-label={`Edit Trigger ${trigger.name || trigger.type}`} onClick={() => handleOpenEditTriggerModal(trigger)}>
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn-ghost btn-xs text-error" aria-label={`Delete Trigger ${trigger.name || trigger.type}`} onClick={() => alert(`Mock Delete Trigger: ${trigger.name || trigger.type}`)}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {formState.agentType === 'Task' && (
          <div
            id="panel-a2a"
            role="tabpanel"
            aria-labelledby="tab-a2a"
            className={`bg-base-100 border-base-300 border rounded-box rounded-tl-none p-6 ${
              activeTab === "a2a" ? "block" : "hidden"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Agent-to-Agent (A2A) Connections</h2>
              <button className="btn btn-primary btn-sm" onClick={() => alert("Open Add A2A Connection Modal")} aria-label="Add New A2A Connection">
                <PlusCircleIcon className="h-4 w-4 mr-1" /> Add New Connection
              </button>
            </div>
            <p className="mb-4 text-base-content/70">
              Manage connections to other agents for collaboration and data exchange.
            </p>
            {agent?.agentType === 'Task' && (agent as TaskAgent).a2aConnections && (agent as TaskAgent).a2aConnections!.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(agent as TaskAgent).a2aConnections!.map((conn: AgentConnection, index: number) => (
                  <div key={index} className="card bg-base-200 shadow">
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg">To: {conn.connectedAgentId}</h3>
                      <p className="text-sm">Type: {conn.connectionType}</p>
                      <div className="card-actions justify-end mt-2">
                        <button className="btn btn-ghost btn-xs" aria-label={`Edit A2A connection to ${conn.connectedAgentId}`} onClick={() => alert(`Edit A2A connection to ${conn.connectedAgentId}`)}>
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button className="btn btn-ghost btn-xs text-error" aria-label={`Remove A2A connection to ${conn.connectedAgentId}`} onClick={() => alert(`Remove A2A connection to ${conn.connectedAgentId}`)}>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ShareIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                <p className="text-lg text-base-content/70">No A2A connections configured yet.</p>
                <p className="text-sm text-base-content/50">Click "Add New Connection" to link this agent with others.</p>
              </div>
            )}
          </div>
        )}

        <div
          id="panel-mcp"
          role="tabpanel"
          aria-labelledby="tab-mcp"
          className={`bg-base-100 border-base-300 border rounded-box rounded-tl-none p-6 ${
            activeTab === "mcp" ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">MCP Configuration</h2>
            <button className="btn btn-primary btn-sm" aria-label="Add MCP">
              <PlusCircleIcon className="h-4 w-4 mr-1" /> Add MCP
            </button>
          </div>
          <p className="mb-4 text-base-content/70">
            Select and configure the MCP services this agent will use.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agent?.mcpConfig?.map((mcp: MockMcpConfig) => (
              <div key={mcp.id} className="card bg-base-200 shadow">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{mcp.name}</h3>
                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-ghost btn-xs" aria-label={`Edit MCP ${mcp.name}`} onClick={() => handleOpenMcpModal(mcp)}>
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button className="btn btn-ghost btn-xs text-error" aria-label={`Delete MCP ${mcp.name}`} onClick={() => alert(`Mock Delete MCP: ${mcp.name}`)}>
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="panel-logs"
          role="tabpanel"
          aria-labelledby="tab-logs"
          className={`bg-base-100 border-base-300 border rounded-box rounded-tl-none p-6 ${
            activeTab === "logs" ? "block" : "hidden"
          }`}
        >
          <h2 className="text-xl mb-4">Execution Logs</h2>
          <p className="mb-4 text-base-content/70">
            View the history of agent runs.
          </p>
          <div className="space-y-4"> {/* Increased spacing for better readability */}
            {agent?.logs?.map((log: MockLog) => (
              <div key={log.id} className="card bg-base-200 shadow-md"> {/* Added shadow-md */}
                <div className="card-body p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-base-content/70">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <div className="card-actions">
                      <button className="btn btn-ghost btn-xs" aria-label={`View Log Details ${log.id}`} onClick={() => handleOpenLogModal(log)}>
                        <EyeIcon className="h-4 w-4" /> View Details
                      </button>
                      <button className="btn btn-ghost btn-xs text-error" aria-label={`Delete Log ${log.id}`} onClick={() => alert(`Mock Delete Log: ${log.id}`)}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-1">User Prompt:</p>
                    <p className="text-sm bg-base-300/30 p-2 rounded whitespace-pre-wrap break-words">{log.userPrompt}</p>
                  </div>

                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-1">Agent Response:</p>
                    <p className="text-sm bg-base-300/30 p-2 rounded whitespace-pre-wrap break-words">{log.agentResponse}</p>
                  </div>

                  {log.message && ( // Display simple message if available
                    <p className="text-xs italic text-base-content/60 mt-2">Summary: {log.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="panel-chat"
          role="tabpanel"
          aria-labelledby="tab-chat"
          className={`bg-base-100 border-base-300 border rounded-box rounded-tl-none p-0 ${
            activeTab === "chat" ? "block" : "hidden"
          }`}
        >
          <div className="h-[70vh]">
            {agentChatRef.current}
          </div>
        </div>

        <div
          id="panel-settings"
          role="tabpanel"
          aria-labelledby="tab-settings"
          className={`bg-base-100 border-base-300 border rounded-box rounded-tl-none p-6 ${
            activeTab === "settings" ? "block" : "hidden"
          }`}
        >
          <form onSubmit={handleSaveSettings}>
            <h2 className="text-2xl font-semibold mb-6">Agent Settings</h2>
            <div className="mb-8 p-6 bg-base-200 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-4 text-primary">Basic Information</h3>
              <div className="form-control mb-6">
                <label className="label" htmlFor="agent-icon-upload">
                  <span className="label-text text-base">Agent Icon</span>
                </label>
                <div className="flex items-center gap-4">
                  <label htmlFor="agent-icon-upload" className="cursor-pointer group">
                    <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-base-content/30 group-hover:border-primary flex items-center justify-center overflow-hidden">
                      {iconPreview ? (
                        <img src={iconPreview} alt="Icon Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ArrowUpTrayIcon className="h-10 w-10 text-base-content/50 group-hover:text-primary" />
                      )}
                    </div>
                  </label>
                  <input id="agent-icon-upload" type="file" className="hidden" accept="image/*" onChange={handleIconChange} />
                  {iconPreview && iconPreview !== "/logo.png" && (
                    <button type="button" className="btn btn-xs btn-ghost text-error" onClick={() => { setSelectedIconFile(null); setIconPreview(agent?.iconUrl || "/logo.png"); }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="form-control mb-4">
                <label className="label" htmlFor="agent-name">
                  <span className="label-text text-base">Agent Name</span>
                </label>
                <input id="agent-name" name="name" type="text" placeholder="Enter agent name" className="input input-bordered w-full" value={formState.name} onChange={handleInputChange} required />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="agent-description">
                  <span className="label-text text-base">Description</span>
                </label>
                <textarea id="agent-description" name="description" className="textarea textarea-bordered h-24 w-full" placeholder="Describe the agent's purpose" value={formState.description} onChange={handleInputChange}></textarea>
              </div>
            </div>
            <div className="mb-8 p-6 bg-base-200 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-4 text-primary">Agent Behavior</h3>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-base">Agent Type</span>
                </label>
                <div className="flex gap-4">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="agentType"
                      className="radio radio-primary"
                      value="Task"
                      checked={formState.agentType === "Task"}
                      onChange={handleInputChange}
                    />
                    <span className="label-text ml-2">Task Agent</span>
                  </label>
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="agentType"
                      className="radio radio-primary"
                      value="Action"
                      checked={formState.agentType === "Action"}
                      onChange={handleInputChange}
                    />
                    <span className="label-text ml-2">Action Agent</span>
                  </label>
                </div>
                {formState.agentType === 'Action' && (
                  <p className="text-xs text-base-content/70 mt-1">
                    Action Agents can be added to other Task Agents' A2A lists but do not have their own Task or A2A configurations.
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="agent-systemPrompt">
                  <span className="label-text text-base">System Prompt</span>
                </label>
                <textarea id="agent-systemPrompt" name="systemPrompt" className="textarea textarea-bordered h-32 w-full" placeholder="Define the agent's core instructions and personality" value={formState.systemPrompt} onChange={handleInputChange} required></textarea>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full md:w-auto">Save Agent Settings</button>
          </form>
        </div>
      </div>

      {agent && (
        <>
          <dialog id="mcp_edit_modal" className="modal" ref={mcpModalRef}>
            <div className="modal-box w-11/12 max-w-lg">
              <h3 className="font-bold text-lg mb-4">Edit MCP Configuration</h3>
              {editingMcp && (
                <div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">MCP Name</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={editingMcp.name}
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Variables (JSON)</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24 w-full font-mono"
                      placeholder='{\n  "apiKey": "YOUR_KEY",\n  "threshold": 0.5\n}'
                    ></textarea>
                  </div>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">
                        Allowed Operations (comma-separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="read_data, execute_trade"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              )}
              <div className="modal-action mt-6">
                <button type="button" className="btn btn-ghost" onClick={handleCloseMcpModal}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveMcpChanges}>Save MCP</button>
              </div>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseMcpModal} aria-label="Close Edit MCP Modal">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form method="dialog" className="modal-backdrop"><button type="button" onClick={handleCloseMcpModal}>close</button></form>
          </dialog>

          <TriggerModal
            isOpen={isTriggerModalOpen}
            onClose={handleCloseTriggerModal}
            onSave={handleSaveTriggerChanges}
            initialData={editingTrigger as TriggerData | null}
            agentId={agentId as string}
          />

          <dialog id="log_view_modal" className="modal" ref={logModalRef}>
            <div className="modal-box w-11/12 max-w-2xl">
              <h3 className="font-bold text-lg mb-4">Log Interaction Details</h3>
              {viewingLog && (
                <div className="space-y-4">
                  <p><span className="font-semibold">Timestamp:</span> {new Date(viewingLog.timestamp).toLocaleString()}</p>

                  <div>
                    <p className="font-semibold mb-1">User Prompt:</p>
                    <pre className="bg-base-200 p-3 rounded text-sm whitespace-pre-wrap break-words">
                      {viewingLog.userPrompt}
                    </pre>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Agent Response:</p>
                    <pre className="bg-base-200 p-3 rounded text-sm whitespace-pre-wrap break-words">
                      {viewingLog.agentResponse}
                    </pre>
                  </div>

                  <div>
                    <p className="font-semibold mb-1">Execution Steps:</p>
                    <ul className="list-disc list-inside bg-base-200 p-3 rounded text-sm space-y-1">
                      {viewingLog.executionSteps.map((step, index) => (
                        <li key={index} className="whitespace-pre-wrap break-words">{step}</li>
                      ))}
                    </ul>
                  </div>
                  {viewingLog.message && (
                     <div>
                        <p className="font-semibold mb-1">Summary Message:</p>
                        <pre className="bg-base-200 p-3 rounded text-sm whitespace-pre-wrap break-words">
                            {viewingLog.message}
                        </pre>
                    </div>
                  )}
                </div>
              )}
              <div className="modal-action mt-6">
                <button type="button" className="btn" onClick={handleCloseLogModal}>Close</button>
              </div>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseLogModal} aria-label="Close Log Details Modal">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form method="dialog" className="modal-backdrop"><button type="button" onClick={handleCloseLogModal}>close</button></form>
          </dialog>
        </>
      )}
    </div>
  );
};

export default AgentDetailPage;
