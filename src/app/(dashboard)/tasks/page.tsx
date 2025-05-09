"use client";

import React, { useState } from "react";
import TaskConfigModal from "@/components/TaskConfigModal";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { TaskData, TaskTimeType, MCPCondition } from "@/types/task"; // MODIFIED: Import shared types for Task

// Local definitions removed

// Mock Trigger Data (Replace with actual API call) - Type annotation updated
const mockTasks: TaskData[] = [ // MODIFIED
  {
    id: "trigger-1",
    name: "SOL 5min Check",
    prompt: "Check SOL price and log it.", // Added mock prompt
    timeType: "interval",
    interval: "5min",
    agentName: "DCA SOL", // Updated based on Plan1.md
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

const TasksPage = () => { // MODIFIED
  const [tasks, setTasks] = useState<TaskData[]>(mockTasks); // MODIFIED
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null); // MODIFIED
  const [taskInitialPrompt, setTaskInitialPrompt] = useState<string | undefined>(undefined); // Added for consistency

  const handleOpenAddModal = () => {
    setEditingTask(null); // MODIFIED
    setTaskInitialPrompt(undefined); // MODIFIED
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskData) => { // MODIFIED
    setEditingTask(task); // MODIFIED
    setTaskInitialPrompt(undefined); // MODIFIED
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null); // MODIFIED
    setTaskInitialPrompt(undefined); // MODIFIED
  };

  const handleSaveTask = (taskData: TaskData) => { // MODIFIED
    // Mock saving logic
    if (editingTask) { // MODIFIED
      // Edit existing task
      setTasks((prevTasks) => // MODIFIED
        prevTasks.map((t) => // MODIFIED
          t.id === editingTask.id ? { ...t, ...taskData } : t // MODIFIED
        )
      );
      console.log("Mock Edit Task:", { ...editingTask, ...taskData }); // MODIFIED
    } else {
      // Add new task
      const newTask = { ...taskData, id: `task-${Date.now()}` }; // MODIFIED
      setTasks((prevTasks) => [...prevTasks, newTask]); // MODIFIED
      console.log("Mock Add Task:", newTask); // MODIFIED
    }
    handleCloseModal(); // Close modal after save
  };

  const handleDeleteTask = (taskId: string) => { // MODIFIED
    // Mock delete logic
    if (window.confirm("Are you sure you want to delete this task?")) { // MODIFIED
      setTasks((prevTasks) => // MODIFIED
        prevTasks.filter((t) => t.id !== taskId) // MODIFIED
      );
      console.log("Mock Delete Task:", taskId); // MODIFIED
    }
  };

  // Helper to display task time concisely
  const displayTaskTime = (task: TaskData): string => { // MODIFIED
    if (task.timeType === "interval") { // MODIFIED
      return `Interval: ${task.interval}`; // MODIFIED
    }
    if (task.timeType === "cron") { // MODIFIED
      return `Cron: ${task.cronExpression}`; // MODIFIED
    }
    return "N/A";
  };

   // Helper to display MCP condition concisely
  const displayMcpCondition = (task: TaskData): string => { // MODIFIED
    if (task.mcpCondition) { // MODIFIED
      return `MCP: ${task.mcpCondition.mcpId} (Keyword: "${task.mcpCondition.keyword}")`; // MODIFIED
    }
    return "None";
  };


  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Manage Tasks</h1> {/* MODIFIED */}
        <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
          <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Task {/* MODIFIED */}
        </button>
      </div>

      {/* Tasks Table */} {/* MODIFIED */}
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
            {tasks.map((task) => ( // MODIFIED
              <tr key={task.id}> {/* MODIFIED */}
                <td>{task.name}</td> {/* MODIFIED */}
                <td>{task.agentName || "N/A"}</td> {/* MODIFIED */}
                <td>{displayTaskTime(task)}</td> {/* MODIFIED */}
                <td>{displayMcpCondition(task)}</td> {/* MODIFIED */}
                <td>
                  <span
                    className={`badge ${
                      task.status === "Active" ? "badge-success" : "badge-ghost" // MODIFIED
                    }`}
                  >
                    {task.status || "N/A"} {/* MODIFIED */}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-ghost btn-xs"
                      aria-label={`Edit Task ${task.name}`} // MODIFIED
                      onClick={() => handleOpenEditModal(task)} // MODIFIED
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      aria-label={`Delete Task ${task.name}`} // MODIFIED
                      // Only call delete if task.id exists
                      onClick={() => task.id && handleDeleteTask(task.id)} // MODIFIED
                      disabled={!task.id} // Optionally disable button if no ID // MODIFIED
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && ( // MODIFIED
              <tr>
                <td colSpan={6} className="text-center p-4 text-base-content/70">
                  No tasks found. Add one to get started! {/* MODIFIED */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Render the modal */}
      <TaskConfigModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialData={editingTask}
        initialPrompt={taskInitialPrompt} // Pass initialPrompt
        agentId="global" // Pass placeholder agentId for this context
      />
    </div>
  );
};

export default TasksPage; // MODIFIED