"use client";

import {
  Bubble,
  Sender,
  useXAgent,
  useXChat,
  ThoughtChain,
} from "@ant-design/x";
import React from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline"; // Using Heroicon
import { UserOutlined, LoadingOutlined, TagsOutlined, CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Import icons

import type { ThoughtChainItem } from "@ant-design/x";

import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const iceland = localFont({
  src: "../fonts/Iceland-Regular.ttf",
  display: "swap",
  preload: true,
});
// Define roles for Bubble.List using DaisyUI/Tailwind concepts if needed,
// but @ant-design/x might handle basic styling.
const roles: React.ComponentProps<typeof Bubble.List>["roles"] = {
  ai: {
    placement: "start",
    // Add Tailwind/DaisyUI classes here if needed for custom styling
    // className: 'chat chat-start', // Example DaisyUI classes
    typing: { step: 10 },
    avatar: {
      icon: (
        <img src="https://goin.obs.cn-north-4.myhuaweicloud.com/acticity/head/head03.jpg" />
      ),
      style: { background: "#fde3cf" },
    },
    styles: {
      // Keep basic style overrides if necessary
      content: { borderRadius: "1rem", padding: "0.75rem 1rem" }, // Example: Rounded corners and padding
    },
  },
  local: {
    placement: "end",
    variant: "shadow",
    avatar: {
      icon: <UserOutlined />,
      style: { background: "#87d068" },
    },
    // className: 'chat chat-end', // Example DaisyUI classes
    styles: {
      content: {
        borderRadius: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "hsl(var(--p))",
        color: "hsl(var(--pc))",
      }, // Example: Primary color bg
    },
    // variant: 'shadow', // This might be an antd-specific variant, removed
  },
};

interface AgentChatProps {
  agentName: string;
  // Add any other props needed, e.g., API endpoint for the agent
}

const AgentChat: React.FC<AgentChatProps> = ({ agentName }) => {
  // State for input content
  const [content, setContent] = React.useState("");

  // Mock Agent Logic (Replace with actual API interaction)
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      console.log(`Sending to ${agentName}:`, message);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Mock response
      setThoughtChainStatus("success");

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setThoughtChainStatus2("success");

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setThoughtChainStatus3("success");

      onSuccess(`Mock response from ${agentName} to: ${message}`);
    },
  });

  // Chat Hook
  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "Waiting...",
    requestFallback: "Sorry, I can not answer your question now",
  });

  // Event Handlers
  const handleSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent(""); // Clear input after sending
  };

  // Placeholder for attachment button functionality
  const attachmentsNode = (
    <button
      className="btn btn-ghost btn-sm btn-circle"
      aria-label="Attach file"
    >
      <PaperClipIcon className="h-5 w-5" />
    </button>
    // TODO: Implement file attachment logic
  );

  const agentModalRef = React.useRef<HTMLDialogElement>(null); // Ref for main agent modal

  // Mock save function
  const handleSaveChanges = () => {
    console.log("Mock Save: Agent details would be saved here.");
    // In a real app, you'd collect form data and send it to the backend
    handleCloseAgentModal();
  };

  const handleOpenModal = () => {
    // setIconPreviewUrl(agent?.settings?.icon || null); // Reset preview on open
    agentModalRef.current?.showModal();
    // setIsModalOpen(true); // Not strictly needed if using ref.showModal()
  };

  const handleCloseAgentModal = () => {
    agentModalRef.current?.close();
    // setIsModalOpen(false);
  };

  const [thoughtChainStatus, setThoughtChainStatus] = React.useState("loading");

  const [thoughtChainStatus2, setThoughtChainStatus2] =
    React.useState("loading");

  const [thoughtChainStatus3, setThoughtChainStatus3] =
    React.useState("loading");

  const thoughts = [
    {
      title: (
        <div
          className={`${iceland.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          MCP Log1
        </div>
      ),
      status: thoughtChainStatus,
      icon:
        thoughtChainStatus === "loading" ? (
          <LoadingOutlined />
        ) : (
          <TagsOutlined twoToneColor={"green"} />
        ),
      description: (
        <div
          className={`${iceland.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          request {thoughtChainStatus}
        </div>
      ),
      content: (
        <div>
          <div>Status: {thoughtChainStatus || "-"}</div>
        </div>
      ),
    },
    {
      title: (
        <div
          className={`${iceland.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          MCP Log2
        </div>
      ),
      status: thoughtChainStatus2,
      icon:
      thoughtChainStatus2 === "loading" ? (
          <LoadingOutlined />
        ) : (
          <TagsOutlined twoToneColor={"green"} />
        ),
      description: (
        <div
          className={`${iceland.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          request {thoughtChainStatus2}
        </div>
      ),
      content: (
        <div>
          <div>Status: {thoughtChainStatus2 || "-"}</div>
        </div>
      ),
    },
    {
      title: (
        <div
          className={`${iceland.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          MCP Log3
        </div>
      ),
      status: thoughtChainStatus3,
      icon:
      thoughtChainStatus3 === "loading" ? (
          <LoadingOutlined />
        ) : (
          <TagsOutlined twoToneColor={"green"} />
        ),
      description: (
        <div
          className={`${iceland.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          request {thoughtChainStatus3}
        </div>
      ),
      content: (
        <div>
          <div>Status: {thoughtChainStatus3 || "-"}</div>
        </div>
      ),
    },
  ]

  // Map messages for Bubble.List
  const bubbleItems: React.ComponentProps<typeof Bubble.List>["items"] =
    messages.map(({ id, message, status }) => ({
      key: id,
      loading: status === "loading",
      role: status === "local" ? "local" : "ai",
      content: message,
      footer:
        status === "local" ? (
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleOpenModal}
              className="btn btn-primary btn-sm"
            >
              <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Trigger
            </button>
          </div>
        ) : (
          <ThoughtChain style={{ marginLeft: 16 }} items={thoughts as ThoughtChainItem[]} />
        ),
      // loadingRender: () => <div>Custom loading...</div>,
    }));

  return (
    <div className="flex flex-col h-full">
      {" "}
      {/* Use flex column */}
      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {" "}
        {/* Scrollable message area */}
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
          styles={{
            // Basic styling for the input area
            input: {
              // Correct key for input styling
              border: "1px solid hsl(var(--bc) / 0.2)",
              borderRadius: "var(--rounded-btn, 0.5rem)",
              padding: "0.5rem 0.75rem", // Adjust padding as needed for input element
              minHeight: "40px", // Ensure minimum height
              boxShadow: "none", // Remove default shadow if any
            },
          }}
        />
      </div>
      <dialog id="agent_edit_modal" className="modal" ref={agentModalRef}>
        {" "}
        {/* Updated ref */}
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Trigger Details</h3>

          {/* Form Fields */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Trigger Name</span>
            </label>
            {/* Added nullish coalescing for safety */}
            <input
              type="text"
              defaultValue={"test"}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">MCP</span>
            </label>
            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue="1"
            >
              <option value="1">X</option>
              <option value="2">KOL</option>
              <option value="3">Wallet</option>
              <option value="4">Candlestick Chart</option>
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Schedule</span>
            </label>
            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue="1"
            >
              <option value="1">1 min</option>
              <option value="2">5 min</option>
              <option value="3">10 min</option>
              <option value="4">30 min</option>
              <option value="5">60 min</option>
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Trigger Prompt</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32 w-full" // Increased height
              // Added nullish coalescing for safety
              defaultValue={"test"}
            ></textarea>
          </div>

          {/* Agent Modal Actions */}
          <div className="modal-action mt-6">
            <button className="btn btn-ghost" onClick={handleCloseAgentModal}>
              Cancel
            </button>{" "}
            {/* Renamed handler */}
            <button className="btn btn-primary" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>

          {/* Agent Modal Close button */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCloseAgentModal}
            aria-label="Close"
          >
            {" "}
            {/* Renamed handler */}
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Optional: Click backdrop to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AgentChat; // Ensure the component is exported correctly
