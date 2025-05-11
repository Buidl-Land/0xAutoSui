import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Agent, AgentStatus, TriggerType } from '@/types/agent';
import { EyeIcon, PencilIcon, PlayIcon, PauseIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface AgentCardProps {
  agent: Agent;
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

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="card-body p-5">
        <div className="flex items-start space-x-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {iconUrl ? (
                <Image src={iconUrl} alt={`${name} icon`} width={64} height={64} className="rounded-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-base-300 rounded-full text-xl font-bold">
                  {name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h2 className="card-title text-lg font-semibold mb-1">
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
                  {status === AgentStatus.RUNNING || status === AgentStatus.SCHEDULED ? (
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
            <div className="flex items-center space-x-2 mb-3">
              <span className={`badge badge-sm ${getStatusColor(status)}`}>{status || 'UNKNOWN'}</span>
              <span className="badge badge-sm badge-outline">{triggerType || TriggerType.MANUAL}</span>
            </div>
          </div>
        </div>

        <div className="card-actions justify-end mt-2 border-t border-base-300 pt-3">
          <Link href={`/agents/${id}`} className="btn btn-sm btn-ghost">
            <EyeIcon className="h-4 w-4 mr-1" />
            Details
          </Link>
          <Link href={`/agents/${id}/edit`} className="btn btn-sm btn-ghost">
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Link>
          {status === AgentStatus.RUNNING || status === AgentStatus.SCHEDULED ? (
            <button onClick={() => handleAction('pause')} className="btn btn-sm btn-warning btn-ghost">
              <PauseIcon className="h-4 w-4 mr-1" />
              Pause
            </button>
          ) : (
            <button onClick={() => handleAction('start')} className="btn btn-sm btn-success btn-ghost">
              <PlayIcon className="h-4 w-4 mr-1" />
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;