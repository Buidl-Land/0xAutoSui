"use client";

import React, { useState, useRef } from "react";
import { useChat, Message } from "@ai-sdk/react"; // Import Message type
import { PaperClipIcon, PlusCircleIcon } from "@heroicons/react/24/outline"; // Using Heroicon
import markdownit from "markdown-it";
import { nanoid } from 'nanoid'; // Import nanoid for unique IDs

// Import TriggerModal (assuming path)
import TriggerModal from './TriggerModal'; // Adjust path as needed

interface AgentChatProps {
  agentName: string; // Used for placeholder text
  agentId: string;
  agentTitle: string; // Added for TriggerModal
  agentDescription: string; // Added for TriggerModal
  // Add any other props needed, e.g., API endpoint for the agent
}

// Initialize Markdown renderer
const md = markdownit({ html: true, breaks: true });

// Define mock chat histories keyed by agentId
// Define simplified mock chat histories keyed by agentId (avoiding complex tool structures for initialMessages)
const mockChatHistories: Record<string, Message[]> = {
  '1': [ // DCA SOL
    { id: nanoid(), role: 'user', content: 'Check the AHR999 index and buy $100 SOL if it\'s below 0.45.' },
    { id: nanoid(), role: 'assistant', content: 'Okay, I need to check the AHR999 index first.' },
    // Indicate Tool Call Start
    { id: nanoid(), role: 'assistant', content: '```\nCalling AHR999 Info MCP...\n```' }, // Use markdown for visual distinction
    // Tool Result (using role: 'data')
    {
      id: nanoid(),
      role: 'data', // Use 'data' role for tool results
      content: JSON.stringify({ tool_name: 'AHR999 Info MCP', result: { ahr999: 0.42 } }),
    },
    // Assistant response incorporating result
    { id: nanoid(), role: 'assistant', content: 'The AHR999 index is 0.42, which is below 0.45. Proceeding to buy $100 SOL.' },
    // Indicate Second Tool Call Start
    { id: nanoid(), role: 'assistant', content: '```\nCalling SOL/USDT Trading MCP...\n```' },
    // Second Tool Result (using role: 'data')
    {
      id: nanoid(),
      role: 'data', // Use 'data' role
      content: JSON.stringify({ tool_name: 'SOL/USDT Trading MCP', result: { status: 'success', filledAmount: 100 } }),
    },
    // Final Assistant Response
    { id: nanoid(), role: 'assistant', content: 'Successfully bought $100 worth of SOL.' },
  ],
  '2': [ // X Info Collector
    { id: nanoid(), role: 'user', content: 'Summarize relevant tweets from @VitalikButerin today.' },
    { id: nanoid(), role: 'assistant', content: 'Alright, I\'ll fetch tweets from @VitalikButerin.' },
    // Indicate Tool Call Start
    { id: nanoid(), role: 'assistant', content: '```\nCalling X Info Fetch MCP...\n```' },
    // Tool Result (using role: 'data')
    {
      id: nanoid(),
      role: 'data', // Use 'data' role
      content: JSON.stringify({
        tool_name: 'X Info Fetch MCP',
        result: [
          { id: 'tweet1', text: '...', summary: 'Discussed L2 scaling solutions.' },
          { id: 'tweet2', text: '...', summary: 'Mentioned upcoming ETH upgrades.' },
        ],
      }),
    },
    // Final Assistant Response
    { id: nanoid(), role: 'assistant', content: 'Here\'s a summary of relevant tweets from @VitalikButerin today:\n- Discussed L2 scaling solutions.\n- Mentioned upcoming ETH upgrades.' },
  ],
  '3': [ // Market Analysis Agent
    { id: nanoid(), role: 'user', content: 'Analyze the current SOL liquidation levels.' },
    { id: nanoid(), role: 'assistant', content: 'Okay, I will fetch the SOL liquidation map data.' },
    // Indicate Tool Call Start
    { id: nanoid(), role: 'assistant', content: '```\nCalling Liquidation Map MCP...\n```' },
    // Tool Result (using role: 'data')
    {
      id: nanoid(),
      role: 'data', // Use 'data' role
      content: JSON.stringify({
        tool_name: 'Liquidation Map MCP',
        result: { longLiquidationLevels: [60000, 58000], shortLiquidationLevels: [68000, 70000] },
      }),
    },
    // Final Assistant Response
    { id: nanoid(), role: 'assistant', content: 'Current SOL liquidation levels show significant long liquidations around $60k and $58k, and short liquidations around $68k and $70k.' },
  ],
  // Removed agent '4' mock data
  'default': [ // Fallback
    { id: nanoid(), role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]
};


const AgentChat: React.FC<AgentChatProps> = ({
  agentName,
  agentId,
  agentTitle,
  agentDescription,
}) => {
  // Select the appropriate initial messages based on agentId
  const initialMessages = mockChatHistories[agentId] || mockChatHistories['default'];

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({ // Get append function
    // api: '/api/chat', // Assuming your chat API endpoint
    initialMessages: initialMessages, // <-- Set initial messages here
    maxSteps: 5, // Example: Limit steps if needed
    // Add error handling if desired
    // onError: (error) => { console.error("Chat error:", error); },
  });

  // State for Trigger Modal
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [triggerPrompt, setTriggerPrompt] = useState("");
  // const triggerModalRef = useRef<HTMLDialogElement>(null); // If using daisyUI modal - uncomment if needed

  const handleOpenTriggerModal = (prompt: string) => {
    setTriggerPrompt(prompt);
    setIsTriggerModalOpen(true);
    // triggerModalRef.current?.showModal(); // For daisyUI modal
  };

  const handleCloseTriggerModal = () => {
    setIsTriggerModalOpen(false);
    setTriggerPrompt(""); // Clear prompt on close
    // triggerModalRef.current?.close(); // For daisyUI modal
  };

   // Mock Save Handler for Trigger Modal (Placeholder)
   const handleSaveTrigger = (triggerData: any) => {
    console.log("Saving Trigger (Mock):", triggerData);
    handleCloseTriggerModal();
    // TODO: Implement actual save logic
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

  return (
    <div className="flex flex-col h-full bg-base-100">
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
            avatar = <span className="text-xl flex items-center justify-center w-full h-full">🛠️</span>; // Tool/Data avatar
          }

          return (
            <div key={message.id} className={`chat ${chatAlignment}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                  {avatar}
                </div>
              </div>
              <div className={`chat-bubble ${bubbleStyle}`}>
                {/* Render standard message content (User or Assistant) */}
                {message.content && (message.role === 'user' || message.role === 'assistant') && (
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: used for markdown rendering
                  <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }} />
                )}

                {/* Render Tool Result Details (Data Role) */}
                {message.role === 'data' && (
                  <div className="mt-1">
                     <span className="text-xs italic opacity-70 block mb-1">
                      Tool Result:
                    </span>
                    <pre className="text-xs font-mono bg-base-300/50 p-1 rounded whitespace-pre-wrap break-all">
                      {/* Attempt to parse and pretty-print JSON, fallback to raw string */}
                      {(() => {
                        try {
                          // Attempt to parse the content as JSON
                          const parsedResult = JSON.parse(message.content);
                          // Try to extract the 'result' field if it exists, otherwise show the whole object
                          const displayData = parsedResult.result !== undefined ? parsedResult.result : parsedResult;
                          return JSON.stringify(displayData, null, 2);
                        } catch (e) {
                          // If parsing fails, display the raw content
                          return message.content;
                        }
                      })()}
                    </pre>
                  </div>
                )}
                {/* Removed the specific toolInvocations rendering block */}
              </div>

              {/* Add Trigger Button for User messages */}
              {message.role === 'user' && (
                <div className="chat-footer opacity-50 mt-1 flex justify-end">
                  <button
                    onClick={() => handleOpenTriggerModal(message.content)}
                    className="btn btn-xs btn-ghost text-primary hover:bg-primary hover:text-primary-content"
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
      <TriggerModal
        isOpen={isTriggerModalOpen}
        onClose={handleCloseTriggerModal}
        initialPrompt={triggerPrompt} // Pass prompt from user message
        agentId={agentId} // Pass agentId
        onSave={handleSaveTrigger} // Pass mock save handler
        initialData={null} // Always null for adding new trigger from chat
        // agentTitle and agentDescription removed
        // TODO: Pass actual onSave function and potentially mock MCP data if needed
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
