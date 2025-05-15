import React from 'react';
// import Image from 'next/image'; // No longer using next/image
import Link from 'next/link';
import { Agent, AgentStatus, TriggerType } from '@/types/agent';
import { EyeIcon, PencilIcon, PlayIcon, PauseIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ExtendedAgent } from '@/data/mockAgents';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear'; // Import DiceBear utility

interface AgentCardProps {
  agent: Agent | ExtendedAgent;
  onAction?: (action: 'details' | 'edit' | 'start' | 'pause' | 'delete', agentId: string) => void;
}

const getStatusColor = (status?: AgentStatus) => {
  switch (status) {
    case AgentStatus.RUNNING:
      return 'badge-success';
    case AgentStatus.SCHEDULED:
      return 'badge-info';
    case AgentStatus.PENDING:
      return 'badge-warning';
    case AgentStatus.ERROR:
      return 'badge-error';
    case AgentStatus.IDLE:
      return 'badge-ghost';
    case AgentStatus.STOPPED:
      return 'badge-neutral';
    default:
      return 'badge-ghost';
  }
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, onAction }) => {
  const { id, name, description, status, triggerType, iconUrl } = agent;

  const handleAction = (action: 'details' | 'edit' | 'start' | 'pause' | 'delete') => {
    if (onAction) {
      onAction(action, id);
    }
  };

  // Helper function to check if status matches any of the specified statuses
  const statusMatches = (statusToCheck: AgentStatus | string | undefined, ...validStatuses: AgentStatus[]): boolean => {
    if (!statusToCheck) return false;
    return validStatuses.some(valid => statusToCheck === valid);
  };

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
      <div className="card-body p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex flex-col xs:flex-row gap-3">
          <div className="avatar self-center xs:self-start">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-300 overflow-hidden">
              <img
                src={iconUrl || getDiceBearAvatar(DICEBEAR_STYLES.AGENT, name || id, { backgroundColor: ['transparent'] })}
                alt={`${name} icon`}
                width={64}
                height={64}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start w-full">
              <h2 className="card-title text-base sm:text-lg font-semibold mb-1 line-clamp-1">
                <Link href={`/agents/${id}`} className="hover:underline">
                  {name}
                </Link>
              </h2>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10">
                  <li><button onClick={() => handleAction('details')} className="text-sm w-full text-left">View Details</button></li>
                  <li><button onClick={() => handleAction('edit')} className="text-sm w-full text-left">Edit Agent</button></li>
                  {statusMatches(status, AgentStatus.RUNNING, AgentStatus.SCHEDULED) ? (
                    <li><button onClick={() => handleAction('pause')} className="text-sm w-full text-left text-warning">Pause Agent</button></li>
                  ) : (
                    <li><button onClick={() => handleAction('start')} className="text-sm w-full text-left text-success">Start Agent</button></li>
                  )}
                  <li><button onClick={() => handleAction('delete')} className="text-sm w-full text-left text-error">Delete Agent</button></li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-base-content opacity-70 mb-2 line-clamp-2" title={description}>
              {description || 'No description available.'}
            </p>
            <div className="flex flex-wrap gap-1">
              <span className={`badge badge-sm ${getStatusColor(status as AgentStatus)}`}>{status || 'UNKNOWN'}</span>
              <span className="badge badge-sm badge-outline">{triggerType || TriggerType.MANUAL}</span>
            </div>
          </div>
        </div>

        <div className="card-actions justify-end mt-auto border-t border-base-300 pt-3">
          <Link href={`/agents/${id}`} className="btn btn-sm btn-outline">
            <EyeIcon className="h-4 w-4 mr-1" />
            <span className="hidden xs:inline">Details</span>
          </Link>
          <Link href={`/agents/${id}/edit`} className="btn btn-sm btn-outline">
            <PencilIcon className="h-4 w-4 mr-1" />
            <span className="hidden xs:inline">Edit</span>
          </Link>
          {statusMatches(status, AgentStatus.RUNNING, AgentStatus.SCHEDULED) ? (
            <button onClick={() => handleAction('pause')} className="btn btn-sm btn-warning">
              <PauseIcon className="h-4 w-4 mr-1" />
              <span className="hidden xs:inline">Pause</span>
            </button>
          ) : (
            <button onClick={() => handleAction('start')} className="btn btn-sm btn-success">
              <PlayIcon className="h-4 w-4 mr-1" />
              <span className="hidden xs:inline">Start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;