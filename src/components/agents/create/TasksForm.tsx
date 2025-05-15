"use client";

import React, { useState } from 'react';
import { PlusIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Task } from '@/types/agent'; // Import Task from global types

// Simple Task type, can be expanded later
// export interface Task { ... }

interface TasksFormProps {
  tasks: Task[];
  onAddTask: () => void; // Simplified for now, could pass task data
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, newDescription: string) => void;
  // onReorderTask: (tasks: Task[]) => void; // For drag and drop later
}

const TasksForm: React.FC<TasksFormProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
}) => {
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTaskClick = () => {
    // In a more complex scenario, onAddTask would take the new task details
    // For now, AgentConfigStep will handle creating the task with a default description
    onAddTask();
    setNewTaskDescription(''); // Clear input if it were used directly here
  };

  return (
    <div className="mb-8 p-6 bg-base-100 rounded-lg shadow">
      <h3 className="text-xl font-medium mb-4">Agent Tasks</h3>

      {tasks.length === 0 && (
        <p className="text-sm text-base-content/70 mb-4">
          No tasks defined. Add tasks for the agent to perform.
        </p>
      )}

      <ul className="space-y-3 mb-4">
        {tasks.sort((a,b) => a.order - b.order).map((task, index) => (
          <li key={task.id} className="flex items-center space-x-2 p-3 bg-base-200 rounded-md">
            {/* Drag handle (placeholder for future drag and drop) */}
            <button
              className="p-1 text-base-content/50 hover:text-base-content"
              title="Reorder task (feature coming soon)"
              disabled // TODO: Implement drag and drop
            >
              <Bars3Icon className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={task.description}
              onChange={(e) => onUpdateTask(task.id, e.target.value)}
              placeholder={`Task ${index + 1} description`}
              className="input input-bordered input-sm flex-grow"
            />
            <button
              onClick={() => onRemoveTask(task.id)}
              className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/20"
              title="Remove task"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Simplified Add Task - In AgentConfigStep, a more robust add mechanism will be used */}
      <button onClick={handleAddTaskClick} className="btn btn-primary btn-sm">
        <PlusIcon className="h-4 w-4 mr-1" /> Add Task
      </button>
      <p className="text-xs text-base-content/70 mt-1">
        Define the sequence of operations for this agent.
      </p>
    </div>
  );
};

export default TasksForm;