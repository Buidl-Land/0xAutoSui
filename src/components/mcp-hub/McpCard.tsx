'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiDownloadCloud, FiSettings, FiTrash2, FiBox } from 'react-icons/fi';
import { MCPProvider } from '@/data/mockMcpServers';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface McpCardProps {
  provider: MCPProvider;
  isInstalled: boolean;
}

const McpCard: React.FC<McpCardProps> = ({ provider, isInstalled }) => {
  return (
    <Link href={`/mcp-hub/${provider.id}`} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      <div className="card-body p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Image src={provider.icon} alt={`${provider.name} icon`} width={32} height={32} className="rounded-lg mr-3" />
          <h3 className="card-title text-base font-semibold group-hover:text-primary transition-colors">{provider.name}</h3>
        </div>
        <p className="text-xs text-base-content/70 flex-grow mb-3 line-clamp-2">{provider.description}</p>
        <div className="mt-auto text-right">
          <span className="text-xs text-primary group-hover:underline">View Details <ArrowRightIcon className="w-3 h-3 inline-block ml-0.5" /></span>
        </div>
      </div>
    </Link>
  );
};

export default McpCard; 