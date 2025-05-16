'use client';
import React from 'react';
import Image from 'next/image';
import { allMockAgents, ExtendedAgent } from '@/data/mockAgents';
import { AgentStatus } from '@/types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear';
import { CpuChipIcon } from '@heroicons/react/24/outline';

const ActiveAgentsList = () => {
  const runningAgents: ExtendedAgent[] = allMockAgents.filter(
    (agent) => agent.status === AgentStatus.RUNNING
  );

  return (
    <div className="card bg-base-100 shadow-xl h-full flex flex-col overflow-y-auto">
      <div className="card-body p-0 flex flex-col">
        <div className="p-4 flex-shrink-0">
          <h2 className="card-title bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2 flex items-center">
            <CpuChipIcon className="h-6 w-6 mr-2" />
            Active Agents
          </h2>
        </div>
        <div className="px-4 pb-4">
          {runningAgents.length > 0 ? (
            <ul className="space-y-3">
              {runningAgents.map((agent) => {
                const avatarUrl = agent.iconUrl || getDiceBearAvatar(DICEBEAR_STYLES.AGENT, agent.name, { size: 40 });
                return (
                  <li key={agent.id} className="p-3 bg-base-200 rounded-lg shadow flex items-center space-x-3">
                    <Image
                      src={avatarUrl}
                      alt={`${agent.name} avatar`}
                      width={40}
                      height={40}
                      className="rounded-full bg-base-300"
                    />
                    <div>
                      <p className="font-medium text-base-content">{agent.name}</p>
                      <p className="text-sm text-base-content/70">
                        {agent.tasks?.length || 0} task(s) currently active.
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-base-content/70">
              <CpuChipIcon className="h-12 w-12 mb-4" />
              <p className="">No agents currently running.</p>
              <p className="text-sm">Start an agent to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveAgentsList;