"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExtendedAgent, getMockAgents } from '@/data/mockAgents';
import { MCPProvider, mockMCPProviders } from '@/data/mockMcpServers'; // 修改导入
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
  provider: MCPProvider;
}

const McpCard: React.FC<McpCardProps> = ({ provider }) => {
  return (
    <Link href={`/mcp-hub/${provider.id}`} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      <div className="card-body p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Image src={provider.icon} alt={`${provider.name} icon`} width={32} height={32} className="rounded-lg mr-3" />
          <h3 className="card-title text-base font-semibold group-hover:text-secondary transition-colors">{provider.name}</h3>
        </div>
        <p className="text-xs text-base-content/70 flex-grow mb-3 line-clamp-2">{provider.description}</p>
        <div className="mt-auto text-right">
            <span className="text-xs text-secondary group-hover:underline">View MCP <ArrowRightIcon className="w-3 h-3 inline-block ml-0.5" /></span>
        </div>
      </div>
    </Link>
  );
};

interface ExploreSectionProps {
  agents: ExtendedAgent[]; // Receives all agents, can filter or use featured ones
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ agents }) => {
  // 只显示未安装的 MCP Servers
  const displayMcps = mockMCPProviders.filter(provider => !provider.installed).slice(0, 3); // Display first 3 uninstalled MCPs
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-base-content/90">Featured Agents</h3>
            <Link href="/agent-store" className="text-sm text-primary hover:underline">
              View All <ArrowRightIcon className="w-3 h-3 inline-block ml-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayAgents.map((agent) => (
              <ExploreAgentCard key={`agent-${agent.id}`} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {displayMcps.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-base-content/90">Available MCPs</h3>
            <Link href="/agent-store" className="text-sm text-secondary hover:underline">
              View All <ArrowRightIcon className="w-3 h-3 inline-block ml-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayMcps.map((provider) => (
              <McpCard key={`mcp-${provider.id}`} provider={provider} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreSection;