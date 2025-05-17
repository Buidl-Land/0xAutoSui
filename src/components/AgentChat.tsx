"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat, Message } from "@ai-sdk/react"; // Import Message type
import { PlusCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"; // Using Heroicon
import ReactMarkdown from "react-markdown";
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

// Markdown-it initialization removed

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
  const [stagedInitialMessages, setStagedInitialMessages] = useState<Message[]>(mockChatHistories[agentId] || mockChatHistories['default']);
  const [isStreamingHistory, setIsStreamingHistory] = useState(false);
  const [isStreamingReply, setIsStreamingReply] = useState(false); // Added for new reply streaming
  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false); // Added for simulated loading

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({ // Get append and setMessages function
    api: '/api/chat', // Assuming your chat API endpoint - will be bypassed for mock replies
    initialMessages: [], // Start with no messages, will be streamed
    maxSteps: 5, // Example: Limit steps if needed
    // Add error handling if desired
    onError: (error) => { console.error("Chat error:", error); },
    onFinish: () => {
      // This is a good place to trigger scroll after AI response is fully received
      // However, for streaming, we need to scroll as messages arrive/update
    }
  });

  useEffect(() => {
    if (input.toLowerCase() === 'show history' && !isStreamingHistory && stagedInitialMessages.length > 0) {
      setIsStreamingHistory(true);

      // Separate user and assistant messages from stagedInitialMessages
      const userHistoryMessages = stagedInitialMessages.filter(msg => msg.role === 'user');
      const assistantHistoryMessagesToStream = stagedInitialMessages.filter(msg => msg.role === 'assistant');

      // Add all user messages from history instantly
      setMessages(userHistoryMessages);

      let currentAssistantMessageIndex = 0;
      let currentCharIndex = 0;
      let currentMessageContent = '';
      const streamingSpeed = 50; // Milliseconds per character

      const streamNextCharacter = () => {
        if (currentAssistantMessageIndex < assistantHistoryMessagesToStream.length) {
          const messageToStream = assistantHistoryMessagesToStream[currentAssistantMessageIndex];
          if (currentCharIndex < messageToStream.content.length) {
            currentMessageContent += messageToStream.content[currentCharIndex];
            setMessages(prevMessages => {
              const newMessages = [...prevMessages];
              // Check if the current assistant message is already being streamed
              const existingMessageIndex = newMessages.findIndex(msg => msg.id === messageToStream.id);
              if (existingMessageIndex !== -1) {
                newMessages[existingMessageIndex] = { ...messageToStream, content: currentMessageContent };
              } else {
                // This is a new assistant message to start streaming
                newMessages.push({ ...messageToStream, content: currentMessageContent });
              }
              return newMessages;
            });
            currentCharIndex++;
            setTimeout(streamNextCharacter, streamingSpeed);
          } else {
            // Move to the next assistant message
            currentAssistantMessageIndex++;
            currentCharIndex = 0;
            currentMessageContent = '';
            // Add a small delay before starting the next message
            if (currentAssistantMessageIndex < assistantHistoryMessagesToStream.length) {
              setTimeout(streamNextCharacter, streamingSpeed * 5);
            } else {
              // All assistant messages streamed
              setIsStreamingHistory(false);
              handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
            }
          }
        } else {
          // Fallback if no assistant messages or something went wrong
          setIsStreamingHistory(false);
          if (assistantHistoryMessagesToStream.length === 0) { // If only user messages were there
            handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
          }
        }
      };

      // Start streaming only if there are assistant messages
      if (assistantHistoryMessagesToStream.length > 0) {
        streamNextCharacter();
      } else {
        // If no assistant messages, just clear input and set streaming to false
        setIsStreamingHistory(false);
        handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [input, stagedInitialMessages, isStreamingHistory, setMessages, handleInputChange]);

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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoadingSimulation || isStreamingHistory || isStreamingReply || !input.trim()) {
      return;
    }

    const userInput = input;
    const userMessage: Message = { id: nanoid(), role: 'user', content: userInput };
    // Add user message to the state immediately
    setMessages(prevMessages => [...prevMessages, userMessage]);
    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>); // Clear input

    setIsLoadingSimulation(true);
    setIsStreamingReply(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const agentSpecificHistory = mockChatHistories[agentId] || mockChatHistories['default'];
    let messagesToStream: Message[] = [];

    // Find the index of the current user's message (userMessage) in the mock history
    // Determine the corresponding message index in the mock history
    let currentUserMessageInMockIndex = -1;
    // 'messages' from useChat hook reflects state from *before* this handler's setMessages call took effect for the next render.
    // We need to count user messages *currently in the display* to know if the incoming `userMessage` is the first one.
    const previousUserMessagesCount = messages.filter(msg => msg.role === 'user').length;

    if (previousUserMessagesCount === 0) {
      // This is the first user message of the session.
      // Find the index of the *first* user message in the agent's scripted history to initiate the sequence.
      currentUserMessageInMockIndex = agentSpecificHistory.findIndex(mockMsg => mockMsg.role === 'user');
    } else {
      // This is a subsequent user message.
      // Match its content against user messages in the agent's scripted history.
      currentUserMessageInMockIndex = agentSpecificHistory.findIndex(
        mockMsg => {
          if (mockMsg.role === 'user') {
            const mockContentParts = mockMsg.content.split("\n\nTrigger Info:");
            const mainMockContent = mockContentParts[0].trim();
            const userInputTrimmed = userMessage.content.trim();
            return mainMockContent.toLowerCase() === userInputTrimmed.toLowerCase();
          }
          return false;
        }
      );
    }

    if (currentUserMessageInMockIndex !== -1) {
      // Found the user message in mock history. Collect subsequent non-user messages.
      for (let i = currentUserMessageInMockIndex + 1; i < agentSpecificHistory.length; i++) {
        if (agentSpecificHistory[i].role !== 'user') {
          messagesToStream.push(agentSpecificHistory[i]);
        } else {
          // Found the next user message, so stop collecting.
          break;
        }
      }
    }

    if (messagesToStream.length === 0 && currentUserMessageInMockIndex === -1) {
      // If user input didn't match any script, or if it matched but there were no subsequent non-user messages
      messagesToStream.push({
        id: nanoid(),
        role: 'assistant',
        content: "I'm not sure how to respond to that based on my script, or we've reached the end of this part of the conversation."
      });
    } else if (messagesToStream.length === 0 && currentUserMessageInMockIndex !== -1) {
      // User input matched, but no more non-user messages follow (end of sequence)
       messagesToStream.push({
        id: nanoid(),
        role: 'assistant',
        content: "We've reached the end of this scripted sequence."
      });
    }


    // Stream the collected messages one by one
    let currentMessageStreamIndex = 0;
    const streamingSpeed = 30; // Milliseconds per character

    const streamNextMessageInSequence = async () => {
      if (currentMessageStreamIndex < messagesToStream.length) {
        const messageToRelay = messagesToStream[currentMessageStreamIndex];
        const replyMessageId = messageToRelay.id; // Use the ID from mockChatHistories
        let currentCharIndex = 0;
        let currentStreamedContent = '';

        // Ensure the message shell is in the messages state before streaming characters
        // This helps if the message wasn't previously displayed by 'show history'
        setMessages(prev => {
          const newMessages = [...prev];
          const existingMsgIndex = newMessages.findIndex(m => m.id === replyMessageId);
          if (existingMsgIndex === -1) {
            // Add new message shell if it doesn't exist
            newMessages.push({ ...messageToRelay, content: '' });
          } else {
            // If it exists (e.g. from 'show history'), ensure its content is reset for streaming this segment
            newMessages[existingMsgIndex] = { ...newMessages[existingMsgIndex], content: '', role: messageToRelay.role };
          }
          return newMessages;
        });

        // Small delay to ensure state update before character streaming
        await new Promise(resolve => setTimeout(resolve, 10));


        const streamCharacter = () => {
          if (currentCharIndex < messageToRelay.content.length) {
            currentStreamedContent += messageToRelay.content[currentCharIndex];
            setMessages(prevMessages => {
              const newMessages = [...prevMessages];
              const existingReplyIndex = newMessages.findIndex(msg => msg.id === replyMessageId);
              if (existingReplyIndex !== -1) {
                newMessages[existingReplyIndex] = { ...newMessages[existingReplyIndex], content: currentStreamedContent, role: messageToRelay.role };
              }
              // No 'else' needed here as the shell should have been added already
              return newMessages;
            });
            currentCharIndex++;
            setTimeout(streamCharacter, streamingSpeed);
          } else {
            // Current message finished streaming, move to the next
            currentMessageStreamIndex++;
            if (currentMessageStreamIndex < messagesToStream.length) {
              setTimeout(streamNextMessageInSequence, streamingSpeed * 10); // Delay between messages
            } else {
              // All messages in sequence streamed
              setIsLoadingSimulation(false);
              setIsStreamingReply(false);
            }
          }
        };
        streamCharacter();
      } else {
        // Fallback if messagesToStream was empty (should be handled by the push above)
        setIsLoadingSimulation(false);
        setIsStreamingReply(false);
      }
    };

    if (messagesToStream.length > 0) {
      streamNextMessageInSequence();
    } else {
      // This case should ideally be covered by the fallback logic, but as a safeguard:
      setIsLoadingSimulation(false);
      setIsStreamingReply(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to bottom when messages change, but only if user hasn't scrolled up
    if (messageAreaRef.current && !userHasScrolled) {
      const { scrollHeight, clientHeight } = messageAreaRef.current;
      messageAreaRef.current.scrollTop = scrollHeight - clientHeight;
    }
    // A more robust way is to scroll the last message into view
    // scrollToBottom();
  }, [messages, userHasScrolled]); // Depend on messages and userHasScrolled

  // Effect to scroll to bottom when new messages are added or streamed,
  // but only if the user is already near the bottom or hasn't manually scrolled up.
  useEffect(() => {
    if (messageAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageAreaRef.current;
      // Consider "near bottom" if scrolled within a certain threshold (e.g., 100px) from the bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (!userHasScrolled || isNearBottom) {
        // More reliable scroll to bottom for dynamic content
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        // messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // Can be 'smooth' or 'auto'
      }
    }
  }, [messages]); // Rerun when messages change


  const handleScroll = () => {
    if (messageAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageAreaRef.current;
      // If user scrolls up significantly from the bottom, set userHasScrolled to true
      if (scrollHeight - scrollTop - clientHeight > 150) { // Threshold to detect manual scroll up
        setUserHasScrolled(true);
      } else if (scrollTop + clientHeight >= scrollHeight - 10) { // If user scrolls back to bottom
        setUserHasScrolled(false);
      }
    }
  };


  return (
    <div className="flex flex-col bg-base-100" style={{ height: '600px' }}>
      <style>{markdownStyles}</style>
      {/* Message List Area */}
      <div
        ref={messageAreaRef}
        onScroll={handleScroll}
        className="flex-grow min-h-0 overflow-y-auto px-4 py-6 space-y-4"
      >
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
              <div className={`chat-bubble ${bubbleStyle} max-w-xl shadow-md rounded-lg`}>
                <div className="chat-header text-xs opacity-70 mb-1">
                  {message.role === 'user' && "User"}
                  {message.role === 'assistant' && "Assistant"}
                  {message.role === 'data' && toolCallData?.type === 'tool_call' && "Tool Output"}
                  {message.role === 'data' && toolCallData?.type === 'agent_call' && "Agent Invocation"}
                </div>
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
                    <div className="markdown-content">
                      <ReactMarkdown>
                        {message.role === 'user'
                          ? message.content.split('\n\nTrigger Info:')[0]
                          : message.content}
                      </ReactMarkdown>
                    </div>
                    {triggerInfo && (
                      <div className="mt-1"> {/* Changed from mt-2 to mt-1 */}
                        <div
                          className="flex items-center justify-between cursor-pointer hover:bg-base-300/30 rounded px-2 py-1 mt-1 border-t border-base-300/50 pt-1"
                          onClick={() => toggleTriggerInfo(message.id)}
                        >
                          <span className="text-xs font-semibold">Attached Trigger Info</span>
                          {isTriggerInfoCollapsed ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronUpIcon className="h-3 w-3" />}
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
         {isLoadingSimulation && (
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
      <div className="flex-none p-4 border-t border-base-300 bg-base-200">
        <form onSubmit={handleSendMessage} className="flex items-start space-x-2">
          <textarea
            className="textarea textarea-bordered flex-grow resize-none"
            rows={3}
            value={input}
            onChange={handleInputChange}
            placeholder={`Chat with ${agentName}...`}
            disabled={isLoadingSimulation || isStreamingHistory || isStreamingReply}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const submitButton = (e.currentTarget as HTMLTextAreaElement).form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
                if (submitButton && !submitButton.disabled) {
                  (e.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
                }
              }
            }}
          />
          <button
            type="submit"
            className="btn btn-primary self-end"
            disabled={isLoadingSimulation || isStreamingHistory || isStreamingReply || !input.trim()}
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
