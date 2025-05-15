"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExtendedAgent } from '@/data/mockAgents';
import { mockMcps } from '@/data/mockMcps'; // Import mock MCPs
import { MCP } from '@/types/mcp'; // Import MCP type
import { ArrowRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear';

// Simplified Agent Card for the Explore Section
interface ExploreAgentCardProps {
  agent: ExtendedAgent;
}

const ExploreAgentCard: React.FC<ExploreAgentCardProps> = ({ agent }) => {
  const avatarUrl = agent.iconUrl || getDiceBearAvatar(DICEBEAR_STYLES.AGENT_ALT, agent.name, { /* size: 32 */ });

  return (
    <Link href={`/agents/${agent.id}`} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      <div className="card-body p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
            <Image src={avatarUrl} alt={`${agent.name} icon`} width={32} height={32} className="rounded-lg mr-3" />
          <h3 className="card-title text-base font-semibold group-hover:text-primary transition-colors">{agent.name}</h3>
        </div>
        <p className="text-xs text-base-content/70 flex-grow mb-3 line-clamp-2">{agent.description}</p>
        <div className="mt-auto text-right">
            <span className="text-xs text-primary group-hover:underline">View Agent <ArrowRightIcon className="w-3 h-3 inline-block ml-0.5" /></span>
        </div>
      </div>
    </Link>
  );
};

// MCP Card for the Explore Section
interface McpCardProps {
  mcp: MCP;
}

const McpCard: React.FC<McpCardProps> = ({ mcp }) => {
  const mcpAvatar = getDiceBearAvatar(DICEBEAR_STYLES.GENERIC, mcp.id, {size: 32});

  return (
    <Link href={`/store/mcps/${mcp.id}`} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      <div className="card-body p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Image src={mcpAvatar} alt={`${mcp.name} icon`} width={32} height={32} className="rounded-lg mr-3" />
          <h3 className="card-title text-base font-semibold group-hover:text-secondary transition-colors">{mcp.name}</h3>
        </div>
        <p className="text-xs text-base-content/70 flex-grow mb-3 line-clamp-2">{mcp.description}</p>
        <div className="mt-auto text-right">
            <span className="text-xs text-secondary group-hover:underline">View MCP <ArrowRightIcon className="w-3 h-3 inline-block ml-0.5" /></span>
        </div>
      </div>
    </Link>
  );
};

interface ExploreSectionProps {
  agents: ExtendedAgent[]; // Receives all agents, can filter or use featured ones
  // mcps: MCP[]; // Could also pass MCPs as props if fetched higher up
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ agents }) => {
  // For now, let's use all mock MCPs. In a real app, this might be curated.
  const displayMcps = mockMcps.slice(0, 3); // Display first 3 MCPs as an example
  const displayAgents = agents.slice(0, 3); // Display first 3 agents as an example

  if (displayAgents.length === 0 && displayMcps.length === 0) {
    return <p className="text-center py-8 text-base-content/70">Nothing to explore at the moment.</p>;
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Explore Automations
      </h2>
      <p className="mb-6 text-base-content/80 max-w-2xl">
        Discover pre-built Agent blueprints and essential MCPs (Master Control Programs) to power your Web3 tasks.
      </p>

      {displayAgents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-base-content/90">Featured Agents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayAgents.map((agent) => (
              <ExploreAgentCard key={`agent-${agent.id}`} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {displayMcps.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-base-content/90">Essential MCPs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayMcps.map((mcp) => (
              <McpCard key={`mcp-${mcp.id}`} mcp={mcp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreSection;