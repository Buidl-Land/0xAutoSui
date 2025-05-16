'use client';

import React from 'react';
import Link from 'next/link';
import { StoreAgent, PricingModelType, StoreAgentPricingModel } from '@/types/storeAgent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear'; // Import DiceBear utility
import { FiShoppingCart, FiInfo, FiDownloadCloud, FiCheck } from 'react-icons/fi'; // Added FiCheck icon

interface AgentStoreCardProps {
  agent: StoreAgent;
  isOwned: boolean;
  onGetOrDeploy: (agent: StoreAgent) => void;
}

const formatPrice = (pricingModel: StoreAgentPricingModel): string => {
  switch (pricingModel.type) {
    case PricingModelType.FREE:
      return 'Free';
    case PricingModelType.ONE_TIME_PURCHASE_CREDITS:
      return `${pricingModel.priceCredits} Credits (One-time)`;
    case PricingModelType.ONE_TIME_PURCHASE_SOL:
      return `${pricingModel.priceSol} SOL (One-time)`;
    case PricingModelType.SUBSCRIPTION_CREDITS_MONTHLY:
      return `${pricingModel.priceCredits} Credits/month`;
    case PricingModelType.SUBSCRIPTION_CREDITS_QUARTERLY:
      return `${pricingModel.priceCredits} Credits/quarter`;
    case PricingModelType.SUBSCRIPTION_SOL_MONTHLY:
      return `${pricingModel.priceSol} SOL/month`;
    case PricingModelType.REQUIRES_MCP_SUBSCRIPTION:
      return 'Free (Requires MCP Subscription)';
    default:
      return 'N/A';
  }
};

const AgentStoreCard: React.FC<AgentStoreCardProps> = ({ agent, isOwned, onGetOrDeploy }) => {
  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
      <div className="card-body p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-start mb-2">
          <img
            src={getDiceBearAvatar(DICEBEAR_STYLES.AGENT, agent.name)}
            alt={`${agent.name} avatar`}
            className="w-10 h-10 rounded-full mr-3" // Added avatar image
          />
          <div className="flex-grow flex justify-between items-start">
            <h2 className="card-title text-lg font-semibold line-clamp-1">
              {agent.name}
          </h2>
            <span className="badge badge-sm badge-outline">{agent.version}</span>
          </div>
        </div>

        <p className="text-xs text-base-content/70 mb-2">
          Provider: <span className="font-medium">{agent.provider}</span>
        </p>

        <p className="text-sm text-base-content/90 mb-3 line-clamp-3 min-h-[4.5rem]">
          {agent.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-1">
          {agent.categories.map((category) => (
            <span key={category} className="badge badge-sm badge-ghost">
              {category}
            </span>
          ))}
        </div>

        <div className="mb-4 p-2 bg-base-300/30 rounded-lg">
          <p className="text-sm font-medium flex items-center justify-between">
            <span>Price:</span> <span className="text-primary">{formatPrice(agent.pricingModel)}</span>
          </p>
          {agent.pricingModel.notes && (
            <p className="text-xs text-base-content/70 mt-1">{agent.pricingModel.notes}</p>
          )}
        </div>

        <div className="card-actions justify-end mt-auto border-t border-base-300 pt-3">
          <Link href={`/store/${agent.storeAgentId}`} className="btn btn-sm btn-outline">
            <FiInfo className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Details</span>
          </Link>

          {isOwned ? (
            <button
              onClick={() => onGetOrDeploy(agent)}
              className="btn btn-sm btn-success"
            >
              <FiCheck className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Deploy</span>
            </button>
          ) : (
            <button
              onClick={() => onGetOrDeploy(agent)}
              className="btn btn-sm btn-primary"
            >
              {agent.pricingModel.type === PricingModelType.FREE ?
                <><FiDownloadCloud className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Get</span></> :
                <><FiShoppingCart className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Purchase</span></>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentStoreCard;