'use client';
import React from 'react';
import { getFeaturedAgents, MockLog, ExtendedAgent } from '@/data/mockAgents';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon // Generic log icon
} from '@heroicons/react/24/solid';
import ClientOnlyFormatDate from '../utils/ClientOnlyFormatDate'; // Import the new component

interface LogEntry extends MockLog {
  agentName: string;
}

const AgentLogsView = () => {
  const featuredAgents: ExtendedAgent[] = getFeaturedAgents();
  const allFeaturedLogs: LogEntry[] = [];

  featuredAgents.forEach(agent => {
    if (agent.logs) {
      agent.logs.forEach((log: MockLog) => {
        allFeaturedLogs.push({
          ...log,
          agentName: agent.name,
        });
      });
    }
  });

  const sortedLogs = allFeaturedLogs.sort((a, b) => b.timestamp - a.timestamp);
  const recentLogs = sortedLogs.slice(0, 15); // Display latest 15 logs

  const getStatusIcon = (status?: 'success' | 'error' | 'info' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-error" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-info" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-base-content/70" />;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <div className="card-body">
        <h2 className="card-title bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
          <DocumentTextIcon className="h-6 w-6 mr-2" />
          Recent Agent Logs
        </h2>
        {recentLogs.length > 0 ? (
          <div className="overflow-x-auto h-[300px]"> {/* Fixed height and scroll */}
            <table className="table table-zebra table-xs sm:table-sm">
              <thead>
                <tr>
                  <th className="w-8"></th> {/* Status Icon */}
                  <th>Agent</th>
                  <th>Timestamp</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover">
                    <td>{getStatusIcon(log.status)}</td>
                    <td className="font-medium text-primary/80 whitespace-nowrap">{log.agentName}</td>
                    <td className="text-xs text-base-content/70 whitespace-nowrap">
                      {/* Use ClientOnlyFormatDate for timestamp */}
                      <ClientOnlyFormatDate timestamp={log.timestamp} placeholder="Loading date..." />
                    </td>
                    <td className="text-sm text-base-content">
                      {log.message || log.agentResponse || (log.userPrompt ? `User: ${log.userPrompt.substring(0,50)}...` : 'No message')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <DocumentTextIcon className="h-12 w-12 text-neutral-content mb-4" />
            <p className="text-neutral-content">No logs available from featured agents.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentLogsView;