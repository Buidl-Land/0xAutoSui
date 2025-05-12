'use client';

import React from 'react';
import Link from 'next/link';
import { StoreAgent, PricingModelType, StoreAgentPricingModel } from '@/types/storeAgent';
import { FiShoppingCart, FiInfo, FiDownloadCloud } from 'react-icons/fi'; // Example icons

interface AgentStoreCardProps {
  agent: StoreAgent;
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

const AgentStoreCard: React.FC<AgentStoreCardProps> = ({ agent, onGetOrDeploy }) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <h2 className="card-title text-lg font-semibold mb-1">
            {agent.name}
          </h2>
          <span className="badge badge-sm badge-outline">{agent.version}</span>
        </div>
        <p className="text-xs text-base-content/70 mb-2">
          Provider: <span className="font-medium">{agent.provider}</span>
        </p>
        <p className="text-sm text-base-content/90 mb-3 h-20 overflow-hidden text-ellipsis">
          {agent.description.length > 100 ? `${agent.description.substring(0, 100)}...` : agent.description}
        </p>
        <div className="mb-3">
          {agent.categories.map((category) => (
            <span key={category} className="badge badge-ghost badge-sm mr-1 mb-1">
              {category}
            </span>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium">
            Price: <span className="text-primary">{formatPrice(agent.pricingModel)}</span>
          </p>
          {agent.pricingModel.notes && (
            <p className="text-xs text-base-content/70 mt-1">{agent.pricingModel.notes}</p>
          )}
        </div>

        <div className="card-actions justify-end space-x-2">
          <Link href={`/store/${agent.storeAgentId}`} className="btn btn-sm btn-outline btn-primary">
            <FiInfo className="mr-1" /> Details
          </Link>
          <button
            onClick={() => onGetOrDeploy(agent)}
            className="btn btn-sm btn-primary"
          >
            {agent.pricingModel.type === PricingModelType.FREE ? <FiDownloadCloud className="mr-1" /> : <FiShoppingCart className="mr-1" />}
            {agent.pricingModel.type === PricingModelType.FREE ? 'Get Agent' : 'Acquire Agent'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentStoreCard;