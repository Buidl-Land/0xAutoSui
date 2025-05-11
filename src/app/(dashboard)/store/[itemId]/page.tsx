'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StoreAgent, PricingModelType, StoreAgentPricingModel, RequiredMCP } from '@/types/storeAgent';
import { mockStoreAgents } from '@/data/mockStoreAgents';
import { FiArrowLeft, FiShoppingCart, FiDownloadCloud, FiInfo, FiTool, FiDollarSign, FiClock, FiUsers, FiStar, FiFileText, FiExternalLink, FiAlertCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';

// Mock API function (replace with actual API call)
const fetchStoreAgentByIdAPI = async (itemId: string): Promise<StoreAgent | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStoreAgents.find(agent => agent.storeAgentId === itemId));
    }, 300);
  });
};

// Mock user data (replace with actual user context/API)
const mockCurrentUser = { userId: 'user_123', name: 'Demo User' };
const userHasAcquiredAgent = (userId: string, storeAgentId: string): boolean => {
  const agent = mockStoreAgents.find(a => a.storeAgentId === storeAgentId);
  return agent?.pricingModel.type === PricingModelType.FREE;
};

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
      return 'Free (Requires specific MCP Subscription)';
    default:
      return 'N/A';
  }
};

const StoreAgentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId as string;

  const [agent, setAgent] = useState<StoreAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itemId) {
      const loadAgentData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedAgent = await fetchStoreAgentByIdAPI(itemId);
          if (fetchedAgent) {
            setAgent(fetchedAgent);
          } else {
            setError('Agent not found.');
          }
        } catch (e) {
          setError('Failed to load agent details.');
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      loadAgentData();
    }
  }, [itemId]);

  const handleGetOrDeploy = (selectedAgent: StoreAgent) => {
    // Mock interaction
    console.log(`Attempting to get/deploy: ${selectedAgent.name}`);
    if (selectedAgent.pricingModel.type === PricingModelType.FREE || userHasAcquiredAgent(mockCurrentUser.userId, selectedAgent.storeAgentId)) {
      alert(`Deploying ${selectedAgent.name}... (Mock Action from Detail Page)`);
      // Navigate to a deployment setup page or show modal
    } else {
      alert(`Initiating purchase for ${selectedAgent.name}... (Mock Action from Detail Page)`);
      // Navigate to a purchase page or show modal
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="ml-2">Loading Agent Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <FiAlertCircle className="text-4xl text-error mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-base-content/80">{error}</p>
        <button onClick={() => router.back()} className="btn btn-primary mt-6">
          <FiArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!agent) {
    return ( // Should be covered by error state, but as a fallback
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <FiAlertCircle className="text-4xl text-error mb-4" />
        <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
        <p className="text-base-content/80">The agent you are looking for does not exist.</p>
        <button onClick={() => router.back()} className="btn btn-primary mt-6">
          <FiArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  const isAcquired = userHasAcquiredAgent(mockCurrentUser.userId, agent.storeAgentId);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <button onClick={() => router.back()} className="btn btn-ghost mb-6">
        <FiArrowLeft className="mr-2" /> Back to Agent Store
      </button>

      <div className="bg-base-200 rounded-lg shadow-xl overflow-hidden">
        {agent.bannerImageUrl && (
          <img src={agent.bannerImageUrl} alt={`${agent.name} banner`} className="w-full h-64 object-cover" />
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                {agent.iconUrl && <img src={agent.iconUrl} alt="" className="w-10 h-10 mr-3 rounded" />}
                <h1 className="text-3xl font-bold">{agent.name}</h1>
              </div>
              <p className="text-base-content/70">
                Provided by: <span className="font-semibold">{agent.provider}</span> | Version: {agent.version}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => handleGetOrDeploy(agent)}
                className={`btn ${isAcquired || agent.pricingModel.type === PricingModelType.FREE ? 'btn-success' : 'btn-primary'} btn-wide`}
              >
                {isAcquired || agent.pricingModel.type === PricingModelType.FREE ? <FiDownloadCloud className="mr-2" /> : <FiShoppingCart className="mr-2" />}
                {isAcquired || agent.pricingModel.type === PricingModelType.FREE ? 'Deploy Agent' : 'Acquire Agent'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3 flex items-center"><FiInfo className="mr-2" />Description</h2>
              <p className="text-base-content/90 leading-relaxed">{agent.description}</p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.categories.map(category => (
                    <span key={category} className="badge badge-lg badge-outline">{category}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><FiDollarSign className="mr-2" />Pricing</h2>
              <p className="text-2xl font-bold text-primary mb-1">{formatPrice(agent.pricingModel)}</p>
              {agent.pricingModel.notes && <p className="text-sm text-base-content/70 mb-4">{agent.pricingModel.notes}</p>}

              <div className="space-y-2 text-sm">
                <p className="flex items-center"><FiStar className="mr-2 text-yellow-400" /> Rating: {agent.averageRating?.toFixed(1) || 'N/A'} / 5</p>
                <p className="flex items-center"><FiUsers className="mr-2" /> Acquired: {agent.numberOfDownloadsOrAcquisitions}</p>
                <p className="flex items-center"><FiClock className="mr-2" /> Published: {new Date(agent.publishedAt).toLocaleDateString()}</p>
                <p className="flex items-center"><FiClock className="mr-2" /> Last Updated: {new Date(agent.updatedAt).toLocaleDateString()}</p>
              </div>
              {agent.documentationUrl && (
                <a href={agent.documentationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-6 w-full">
                  <FiFileText className="mr-2" /> View Documentation <FiExternalLink className="ml-1" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center"><FiTool className="mr-2" />Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-base-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Required MCPs:</h3>
                {agent.requiredMCPs.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {agent.requiredMCPs.map((mcp: RequiredMCP) => (
                      <li key={mcp.mcpId}>
                        {mcp.mcpName} ({mcp.isBundled ? 'Bundled' : 'Separate Acquisition'})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-base-content/70">No specific MCPs required beyond standard system capabilities.</p>
                )}
              </div>
              <div className="bg-base-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Estimated Resource Consumption:</h3>
                <p className="text-sm text-base-content/90">{agent.estimatedResourceConsumption}</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Solana Focused:</h3>
                <p className="text-sm text-base-content/90 flex items-center">
                  {agent.solanaFocus ? <FiCheckCircle className="text-success mr-2" /> : <FiAlertCircle className="text-warning mr-2" />}
                  {agent.solanaFocus ? 'Yes, specifically tailored for Solana.' : 'No, general purpose or multi-chain.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mock Reviews Section - FR-F.5.2 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Reviews & Ratings (Mock)</h2>
            <div className="bg-base-100 p-6 rounded-lg shadow">
              <p className="text-base-content/70">No reviews yet for this agent. Be the first to leave one after acquiring!</p>
              {/* Placeholder for review list and form */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StoreAgentDetailPage;