"use client";

import React, { useState, useRef } from "react";
import { useChat, Message } from "@ai-sdk/react"; // Import Message type
import { PaperClipIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"; // Using Heroicon
import markdownit from "markdown-it";
import { nanoid } from 'nanoid'; // Import nanoid for unique IDs

// Import TriggerModal (assuming path)
import TaskConfigModal from './TaskConfigModal';
import { TaskData } from '@/types/task'; // MODIFIED: Added import for TaskData
import { mockChatHistories } from '@/data/mockChatHistories'; // 导入 mock 数据

interface AgentChatProps {
  agentName: string; // Used for placeholder text
  agentId: string;
  agentTitle: string; // Added for TriggerModal
  agentDescription: string; // Added for TriggerModal
  // Add any other props needed, e.g., API endpoint for the agent
}

// Initialize Markdown renderer with custom options
const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    return `<pre class="bg-base-300/50 p-2 rounded text-xs font-mono"><code>${str}</code></pre>`;
  }
});

// Add custom styles for markdown content
const markdownStyles = `
  .markdown-content {
    @apply text-sm leading-relaxed;
  }
  .markdown-content h1 {
    @apply text-xl font-bold mt-4 mb-3 text-primary;
  }
  .markdown-content h2 {
    @apply text-lg font-semibold mt-4 mb-2 text-secondary;
  }
  .markdown-content h3 {
    @apply text-base font-medium mt-3 mb-2;
  }
  .markdown-content p {
    @apply my-2;
  }
  .markdown-content ul {
    @apply list-disc list-inside my-2 space-y-1;
  }
  .markdown-content ol {
    @apply list-decimal list-inside my-2 space-y-1;
  }
  .markdown-content li {
    @apply ml-4;
  }
  .markdown-content li > p {
    @apply my-1;
  }
  .markdown-content strong {
    @apply font-semibold text-primary;
  }
  .markdown-content em {
    @apply italic text-secondary;
  }
  .markdown-content code {
    @apply bg-base-300/50 px-1 py-0.5 rounded text-xs font-mono;
  }
  .markdown-content pre {
    @apply bg-base-300/50 p-2 rounded my-2 overflow-x-auto;
  }
  .markdown-content pre code {
    @apply bg-transparent p-0;
  }
  .markdown-content blockquote {
    @apply border-l-4 border-base-300 pl-4 my-2 italic;
  }
  .markdown-content a {
    @apply text-primary hover:underline;
  }
  .markdown-content table {
    @apply w-full my-2 border-collapse;
  }
  .markdown-content th {
    @apply bg-base-300/50 px-2 py-1 text-left border border-base-300;
  }
  .markdown-content td {
    @apply px-2 py-1 border border-base-300;
  }
  .markdown-content hr {
    @apply my-4 border-t border-base-300;
  }
  .markdown-content img {
    @apply max-w-full rounded my-2;
  }
`;

// Add new interface for tool call data
interface ToolCallData {
  type: 'tool_call' | 'agent_call';
  tool?: string;
  agent?: string;
  parameters: Record<string, any>;
  result?: any; // Add result field
}

// Add interface for trigger info
interface TriggerInfo {
  wallet_address: string;
  meme_name: string;
  meme_address: string;
  transaction: {
    amount: number;
    currency: string;
    timestamp: string;
    type: string;
  };
}

const AgentChat: React.FC<AgentChatProps> = ({
  agentName,
  agentId,
  agentTitle,
  agentDescription,
}) => {
  // Select the appropriate initial messages based on agentId
  const initialMessages = mockChatHistories[agentId] || mockChatHistories['default'];

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({ // Get append function
    api: '/api/chat', // Assuming your chat API endpoint
    initialMessages: initialMessages, // <-- Set initial messages here
    maxSteps: 5, // Example: Limit steps if needed
    // Add error handling if desired
    // onError: (error) => { console.error("Chat error:", error); },
  });

  // State for TaskConfig Modal
  const [isTaskConfigModalOpen, setIsTaskConfigModalOpen] = useState(false);
  const [taskInitialPrompt, setTaskInitialPrompt] = useState<string | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null); // Added for editing

  // Update state to track both parameters and results collapse state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Add state for trigger info collapse
  const [collapsedTriggerInfo, setCollapsedTriggerInfo] = useState<Record<string, boolean>>({});

  const handleOpenTaskConfigModalForAdd = (prompt?: string) => {
    setEditingTask(null);
    setTaskInitialPrompt(prompt);
    setIsTaskConfigModalOpen(true);
  };

  const handleOpenTaskConfigModalForEdit = (task: TaskData) => { // For editing existing tasks
    setEditingTask(task);
    setTaskInitialPrompt(undefined); // No initial prompt when editing an existing task's prompt
    setIsTaskConfigModalOpen(true);
  };

  const handleCloseTaskConfigModal = () => {
    setIsTaskConfigModalOpen(false);
    setEditingTask(null);
    setTaskInitialPrompt(undefined);
  };

   // Mock Save Handler for TaskConfig Modal (Placeholder)
   const handleSaveTask = (taskData: TaskData) => {
    console.log("Saving Task (Mock):", taskData);
    // Here you would typically save to a backend or update global state
    // For now, just logging and closing
    handleCloseTaskConfigModal();
  };

  const handleOpenTriggerModal = (prompt?: string) => {
    // For now, just log to console. Later, this could open TriggerModal.
    console.log(`Add Trigger clicked for Task Agent ID: ${agentId}, based on chat interaction: ${prompt}`);
    // Example: If you wanted to open a modal, you'd set its state here.
    // setIsTriggerModalOpen(true); // Assuming a state for a TriggerModal
  };

  // Placeholder for attachment button functionality
  const attachmentsNode = (
    <button
      type="button" // Prevent form submission
      className="btn btn-ghost btn-sm btn-circle"
      aria-label="Attach file"
      // TODO: Implement file attachment logic
      onClick={() => console.log("Attach file clicked")}
    >
      <PaperClipIcon className="h-5 w-5" />
    </button>
  );

  // Update toggle function to handle single collapse state
  const toggleSection = (messageId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [messageId]: !(prev[messageId] ?? true)
    }));
  };

  // Add function to parse tool call data
  const parseToolCallData = (content: string): ToolCallData | null => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  // Add function to parse trigger info
  const parseTriggerInfo = (content: string): TriggerInfo | null => {
    try {
      const triggerInfoMatch = content.match(/Trigger Info:\s*({[\s\S]*})/);
      if (triggerInfoMatch) {
        return JSON.parse(triggerInfoMatch[1]);
      }
      return null;
    } catch {
      return null;
    }
  };

  // Add function to toggle trigger info
  const toggleTriggerInfo = (messageId: string) => {
    setCollapsedTriggerInfo(prev => ({
      ...prev,
      [messageId]: !(prev[messageId] ?? true)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      <style>{markdownStyles}</style>
      {/* Message List Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          // Determine chat alignment based on role
          const chatAlignment = message.role === "user" ? "chat-end" : "chat-start";

          // Determine bubble style based on role
          let bubbleStyle = "chat-bubble-secondary"; // Default for assistant
          if (message.role === "user") {
            bubbleStyle = "chat-bubble-primary";
          } else if (message.role === "data") {
            bubbleStyle = "chat-bubble-accent"; // Use accent color for data/tool results
          }

          // Determine avatar
          let avatar = <span className="text-xl flex items-center justify-center w-full h-full">🤖</span>; // Default assistant
          if (message.role === "user") {
            avatar = <span className="text-xl flex items-center justify-center w-full h-full">🧑‍💻</span>;
          } else if (message.role === "data") {
            // Different avatars for tool calls and agent calls
            const toolCallData = parseToolCallData(message.content);
            avatar = toolCallData?.type === 'agent_call' 
              ? <span className="text-xl flex items-center justify-center w-full h-full">🤖</span>
              : <span className="text-xl flex items-center justify-center w-full h-full">🛠️</span>;
          }

          // Parse tool call data if it's a data message
          const toolCallData = message.role === 'data' ? parseToolCallData(message.content) : null;
          const isCollapsed = collapsedSections[message.id] ?? true;
          const triggerInfo = message.role === 'user' ? parseTriggerInfo(message.content) : null;
          const isTriggerInfoCollapsed = collapsedTriggerInfo[message.id] ?? true;

          return (
            <div key={message.id} className={`chat ${chatAlignment}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                  {avatar}
                </div>
              </div>
              <div className={`chat-bubble ${bubbleStyle}`}>
                {message.role === 'data' && toolCallData ? (
                  <div className="w-full space-y-2">
                    {/* Header with type and name */}
                    <div 
                      className="flex items-center justify-between cursor-pointer hover:bg-base-300/30 rounded px-2 py-1"
                      onClick={() => toggleSection(message.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-base-300/50">
                          {toolCallData.type === 'tool_call' ? 'Tool' : 'Agent'}
                        </span>
                        <span className="font-medium">
                          {toolCallData.type === 'tool_call' ? toolCallData.tool : toolCallData.agent}
                        </span>
                      </div>
                      {isCollapsed ? (
                        <ChevronDownIcon className="h-3 w-3" />
                      ) : (
                        <ChevronUpIcon className="h-3 w-3" />
                      )}
                    </div>

                    {/* Expanded Content */}
                    {!isCollapsed && (
                      <div className="space-y-2 pt-2 border-t border-base-300">
                        {/* Parameters Section */}
                        <div>
                          <span className="text-xs italic opacity-70 block mb-1">Parameters</span>
                          <pre className="text-xs font-mono bg-base-300/50 p-2 rounded whitespace-pre-wrap break-all">
                            {JSON.stringify(toolCallData.parameters, null, 2)}
                          </pre>
                        </div>

                        {/* Result Section (if exists) */}
                        {toolCallData.result && (
                          <div>
                            <span className="text-xs italic opacity-70 block mb-1">Result</span>
                            <pre className="text-xs font-mono bg-base-300/50 p-2 rounded whitespace-pre-wrap break-all">
                              {JSON.stringify(toolCallData.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : message.content && (message.role === 'user' || message.role === 'assistant') && (
                  <div>
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ 
                        __html: md.render(message.role === 'user' 
                          ? message.content.split('\n\nTrigger Info:')[0]
                          : message.content) 
                      }} 
                    />
                    {triggerInfo && (
                      <div className="mt-2">
                        <div 
                          className="flex items-center justify-between cursor-pointer hover:bg-base-300/30 rounded px-2 py-1"
                          onClick={() => toggleTriggerInfo(message.id)}
                        >
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-base-300/50">
                            Trigger Info
                          </span>
                          {isTriggerInfoCollapsed ? (
                            <ChevronDownIcon className="h-3 w-3" />
                          ) : (
                            <ChevronUpIcon className="h-3 w-3" />
                          )}
                        </div>
                        {!isTriggerInfoCollapsed && (
                          <pre className="text-xs font-mono bg-base-300/50 p-2 rounded mt-1 whitespace-pre-wrap break-all">
                            {JSON.stringify(triggerInfo, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Trigger Button for User messages */}
              {message.role === 'user' && (
                <div className="chat-footer opacity-50 mt-1 flex justify-end">
                  <button
                    onClick={() => handleOpenTriggerModal(message.content)}
                    className="btn btn-xs btn-ghost text-accent hover:bg-accent hover:text-accent-content" // Changed color for distinction
                    aria-label="Add Trigger"
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Trigger
                  </button>
                </div>
              )}
            </div>
          );
        })}
         {/* Optional: Show loading indicator */}
         {isLoading && (
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                    </div>
                </div>
                <div className="chat-bubble chat-bubble-secondary">
                    <span className="loading loading-dots loading-md"></span>
                </div>
            </div>
         )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300 bg-base-200">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          {attachmentsNode}
          <input
            type="text"
            className="input input-bordered flex-grow"
            value={input}
            onChange={handleInputChange}
            placeholder={`Chat with ${agentName}...`}
            disabled={isLoading} // Disable input while loading
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !input.trim()} // Disable if loading or input is empty
          >
            Send
          </button>
        </form>
        {/* Mocking controls removed */}
      </div>

      {/* Trigger Modal */}
      {/* Render the actual TriggerModal */}
      <TaskConfigModal
        isOpen={isTaskConfigModalOpen}
        onClose={handleCloseTaskConfigModal}
        initialPrompt={taskInitialPrompt}
        agentId={agentId}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

       {/* Placeholder for DaisyUI modal - remove if not using */}
       {/*
       <dialog ref={triggerModalRef} className="modal"> ... </dialog>
       */}
       {/* Remove the placeholder div below as the actual modal is now rendered */}
       {/*
        {isTriggerModalOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> ... </div>
         )}
        */}
    </div>
  );
};

export default AgentChat;
