'use client';

import {
  Bubble,
  Sender,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import React from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline'; // Using Heroicon

// Define roles for Bubble.List using DaisyUI/Tailwind concepts if needed,
// but @ant-design/x might handle basic styling.
const roles: React.ComponentProps<typeof Bubble.List>['roles'] = {
  ai: {
    placement: 'start',
    // Add Tailwind/DaisyUI classes here if needed for custom styling
    // className: 'chat chat-start', // Example DaisyUI classes
    styles: { // Keep basic style overrides if necessary
      content: { borderRadius: '1rem', padding: '0.75rem 1rem' }, // Example: Rounded corners and padding
    }
  },
  local: {
    placement: 'end',
    // className: 'chat chat-end', // Example DaisyUI classes
    styles: {
        content: { borderRadius: '1rem', padding: '0.75rem 1rem', backgroundColor: 'hsl(var(--p))', color: 'hsl(var(--pc))' }, // Example: Primary color bg
    }
    // variant: 'shadow', // This might be an antd-specific variant, removed
  },
};

interface AgentChatProps {
  agentName: string;
  // Add any other props needed, e.g., API endpoint for the agent
}

const AgentChat: React.FC<AgentChatProps> = ({ agentName }) => {
  // State for input content
  const [content, setContent] = React.useState('');

  // Mock Agent Logic (Replace with actual API interaction)
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      console.log(`Sending to ${agentName}:`, message);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock response
      onSuccess(`Mock response from ${agentName} to: ${message}`);
    },
  });

  // Chat Hook
  const { onRequest, messages } = useXChat({ agent });

  // Event Handlers
  const handleSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent(''); // Clear input after sending
  };

  // Map messages for Bubble.List
  const bubbleItems: React.ComponentProps<typeof Bubble.List>['items'] = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  // Placeholder for attachment button functionality
  const attachmentsNode = (
    <button className="btn btn-ghost btn-sm btn-circle" aria-label="Attach file">
        <PaperClipIcon className="h-5 w-5" />
    </button>
    // TODO: Implement file attachment logic
  );

  return (
    <div className="flex flex-col h-full"> {/* Use flex column */}
      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4"> {/* Scrollable message area */}
        <Bubble.List
          items={bubbleItems}
          roles={roles}
          // className="messages" // Removed potentially conflicting class
        />
      </div>

      {/* Sender Input - Apply DaisyUI/Tailwind styling */}
      <div className="p-4 border-t border-base-300">
        <Sender
          value={content}
          onSubmit={handleSubmit}
          onChange={setContent}
          prefix={attachmentsNode} // Add attachment button
          loading={agent.isRequesting()}
          placeholder={`Chat with ${agentName}...`}
          // Apply styling via props if available, or wrap/style container
          styles={{ // Basic styling for the input area
            input: { // Correct key for input styling
                border: '1px solid hsl(var(--bc) / 0.2)',
                borderRadius: 'var(--rounded-btn, 0.5rem)',
                padding: '0.5rem 0.75rem', // Adjust padding as needed for input element
                minHeight: '40px', // Ensure minimum height
                boxShadow: 'none', // Remove default shadow if any
            }
          }}
        />
      </div>
    </div>
  );
};

export default AgentChat; // Ensure the component is exported correctly