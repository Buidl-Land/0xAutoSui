'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiAlertCircle, FiLoader, FiStar, FiUsers, FiBox, FiCalendar, FiDownloadCloud } from 'react-icons/fi';
import Link from 'next/link';

// Mock MCP data
interface MCPProvider {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  rating: number;
  totalMCPs: number;
  activeUsers: number;
  categories: string[];
  createdAt: string;
  version: string;
}

interface MCP {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  usageCount: number;
  providerId: string;
  categories: string[];
  version: string;
}

// Mock detailed MCP provider data
const mockMCPProvidersDetailed: Record<string, MCPProvider> = {
  'mcp1': {
    id: 'mcp1',
    name: 'Solana MCP Server',
    description: 'Offers MCP services for the Solana ecosystem, focusing on DeFi and gaming applications',
    longDescription: 'Solana MCP Server is a provider focused on the Solana ecosystem, offering efficient and reliable on-chain operation services for developers and users. Our MCP system supports DeFi transactions, game data processing, and smart contract interactions, ensuring fast transaction speeds, low fees, and comprehensive data analysis capabilities. Through our services, you can easily create and deploy automated agents, manage assets, and optimize returns without worrying about the complexity of the underlying technology.',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.8,
    totalMCPs: 45,
    activeUsers: 1260,
    categories: ['DeFi', 'Gaming', 'Smart Contracts'],
    createdAt: '2023-04-15',
    version: '2.3.1'
  },
  'mcp2': {
    id: 'mcp2',
    name: 'Jupiter MCP Server',
    description: 'Aggregated trading MCP provider based on Jupiter protocol',
    longDescription: 'Jupiter MCP Server is based on Jupiter, the leading aggregation protocol in the Solana ecosystem, providing efficient, low-slippage trading routing services. Our MCP focuses on the DeFi sector, supporting automated trading strategies, arbitrage, liquidity provision, and cross-protocol interactions. Through smart routing algorithms, we can find the optimal trading path for users, ensuring best execution prices and lowest fees. Our services are suitable for traders, market makers, and DeFi application developers, providing them with reliable on-chain trading infrastructure.',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.6,
    totalMCPs: 32,
    activeUsers: 980,
    categories: ['DeFi', 'Trading', 'Aggregator'],
    createdAt: '2023-06-10',
    version: '1.8.0'
  },
};

// Mock MCP list by provider
const mockMCPsByProvider: Record<string, MCP[]> = {
  'mcp1': [
    {
      id: 'mcp1-1',
      name: 'DeFi Automation Tool',
      description: 'MCP tool that automatically executes DeFi strategies, supporting liquidity provision, yield farming, and leveraged trading',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.9,
      usageCount: 560,
      providerId: 'mcp1',
      categories: ['DeFi', 'Automation', 'Yield'],
      version: '1.2.0'
    },
    {
      id: 'mcp1-2',
      name: 'NFT Trading Tool',
      description: 'MCP tool for NFT marketplace trading, supporting batch operations and price monitoring',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 420,
      providerId: 'mcp1',
      categories: ['NFT', 'Trading', 'Monitoring'],
      version: '1.0.4'
    },
    {
      id: 'mcp1-3',
      name: 'Game Asset Tool',
      description: 'MCP tool for managing blockchain game assets, supporting automated game strategies',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.6,
      usageCount: 280,
      providerId: 'mcp1',
      categories: ['Gaming', 'Assets', 'Strategy'],
      version: '0.9.2'
    }
  ],
  'mcp2': [
    {
      id: 'mcp2-1',
      name: 'Trading Aggregator Tool',
      description: 'Trade aggregation MCP tool based on Jupiter protocol, providing optimal paths and prices',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 620,
      providerId: 'mcp2',
      categories: ['Trading', 'Aggregation', 'DeFi'],
      version: '2.1.5'
    },
    {
      id: 'mcp2-2',
      name: 'Limit Order Tool',
      description: 'MCP tool for executing limit orders and conditional orders, supporting price trigger logic',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.5,
      usageCount: 380,
      providerId: 'mcp2',
      categories: ['Trading', 'Limit Orders', 'Automation'],
      version: '1.3.0'
    }
  ]
};

// Mock API functions
const fetchMCPProviderAPI = async (providerId: string): Promise<MCPProvider | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMCPProvidersDetailed[providerId] || null);
    }, 500);
  });
};

const fetchMCPsByProviderAPI = async (providerId: string): Promise<MCP[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMCPsByProvider[providerId] || []);
    }, 700);
  });
};

const MCPProviderDetailPage = ({ params }: { params: { providerId: string } }) => {
  const [provider, setProvider] = useState<MCPProvider | null>(null);
  const [mcps, setMcps] = useState<MCP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const providerData = await fetchMCPProviderAPI(params.providerId);
        if (!providerData) {
          throw new Error('MCP provider not found');
        }
        setProvider(providerData);
        
        const mcpsData = await fetchMCPsByProviderAPI(params.providerId);
        setMcps(mcpsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load data. Please try again later');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [params.providerId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="ml-2">Loading MCP provider information...</p>
      </div>
    );
  }
  
  if (error || !provider) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <FiAlertCircle className="text-4xl text-error mb-4" />
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h2>
        <p className="text-base-content/80">{error || 'MCP provider not found'}</p>
        <Link href="/mcp-hub" className="btn btn-primary mt-4">
          <FiArrowLeft className="mr-2" />
          Back to MCP Hub
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Back button */}
      <Link href="/mcp-hub" className="btn btn-ghost mb-4">
        <FiArrowLeft className="mr-2" />
        Back to MCP Hub
      </Link>
      
      {/* Provider info */}
      <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{provider.name}</h1>
              <div className="flex items-center gap-2">
                <div className="badge badge-lg badge-primary flex items-center gap-1">
                  <FiStar /> {provider.rating.toFixed(1)}
                </div>
                <span className="badge badge-lg badge-outline">{provider.version}</span>
              </div>
            </div>
            
            <p className="mt-4 text-base-content/80 text-lg">{provider.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <FiBox className="text-primary" />
                <span>Total MCP Tools: {provider.totalMCPs}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-primary" />
                <span>Active Users: {provider.activeUsers}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-primary" />
                <span>Created: {provider.createdAt}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {provider.categories.map(category => (
                <span key={category} className="badge badge-outline">{category}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Detailed Description</h2>
          <p className="text-base-content/80">{provider.longDescription}</p>
        </div>
      </div>
      
      {/* MCP list */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Available MCP Tools</h2>
        
        {mcps.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-lg">
            <p>No MCP tools available from this server</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mcps.map(mcp => (
              <div key={mcp.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="card-title text-lg">
                      {mcp.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-primary">{mcp.rating.toFixed(1)}</div>
                      <span className="badge badge-sm badge-outline">{mcp.version}</span>
                    </div>
                  </div>
                  <p className="text-base-content/80">{mcp.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mcp.categories.map(category => (
                      <span key={category} className="badge badge-ghost badge-sm">{category}</span>
                    ))}
                  </div>
                  
                  <div className="text-sm text-base-content/70 mt-2">
                    <span>Usage Count: {mcp.usageCount}</span>
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary">
                      <FiDownloadCloud className="mr-1" /> Get Tool
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCPProviderDetailPage; 