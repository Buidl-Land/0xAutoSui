'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiAlertCircle, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import McpCard from '@/components/mcp-hub/McpCard';

// Mock MCP Provider Data
interface MCPProvider {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  totalMCPs: number;
  activeUsers: number;
  categories: string[];
  createdAt: string;
  version: string;
}

const mockMCPProviders: MCPProvider[] = [
  {
    id: 'mcp1',
    name: 'Solana MCP Server',
    description: 'Offers MCP services for the Solana ecosystem, focusing on DeFi and gaming applications',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.8,
    totalMCPs: 45,
    activeUsers: 1260,
    categories: ['DeFi', 'Gaming', 'Smart Contracts'],
    createdAt: '2023-04-15',
    version: '2.3.1'
  },
  {
    id: 'mcp2',
    name: 'Jupiter MCP Server',
    description: 'Aggregated trading MCP provider based on Jupiter protocol',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.6,
    totalMCPs: 32,
    activeUsers: 980,
    categories: ['DeFi', 'Trading', 'Aggregator'],
    createdAt: '2023-06-10',
    version: '1.8.0'
  },
  {
    id: 'mcp3',
    name: 'NFT Marketplace MCP Server',
    description: 'MCP server for NFT marketplace trading and creation',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.5,
    totalMCPs: 28,
    activeUsers: 750,
    categories: ['NFT', 'Art', 'Marketplace'],
    createdAt: '2023-07-22',
    version: '3.1.2'
  },
  {
    id: 'mcp4',
    name: 'Staking MCP Server',
    description: 'Provides multi-chain staking and yield optimization MCP solutions',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.7,
    totalMCPs: 36,
    activeUsers: 1420,
    categories: ['Staking', 'DeFi', 'Yield'],
    createdAt: '2023-05-18',
    version: '2.0.4'
  },
  {
    id: 'mcp5',
    name: 'Data Analytics MCP Server',
    description: 'Blockchain data analytics and visualization MCP provider',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.4,
    totalMCPs: 24,
    activeUsers: 680,
    categories: ['Data', 'Analytics', 'Insights'],
    createdAt: '2023-08-05',
    version: '1.5.7'
  },
  {
    id: 'mcp6',
    name: 'Governance MCP Server',
    description: 'DAO governance and voting system MCP services',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.3,
    totalMCPs: 19,
    activeUsers: 520,
    categories: ['Governance', 'DAO', 'Voting'],
    createdAt: '2023-09-12',
    version: '0.9.3'
  },
];

// Mock API function
const fetchMCPProvidersAPI = async (): Promise<MCPProvider[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMCPProviders);
    }, 500);
  });
};

const MCPHubPage = () => {
  const [allMCPProviders, setAllMCPProviders] = useState<MCPProvider[]>([]);
  const [filteredMCPProviders, setFilteredMCPProviders] = useState<MCPProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilters, setActiveCategoryFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 6; // 2x3 grid

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const providers = await fetchMCPProvidersAPI();
        setAllMCPProviders(providers);
        setFilteredMCPProviders(providers); // Show all initially
      } catch (e) {
        setError('Failed to load MCP Hub. Please try again later.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Get all unique categories
  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>();
    allMCPProviders.forEach(provider => provider.categories.forEach(cat => categories.add(cat)));
    return Array.from(categories).sort();
  }, [allMCPProviders]);

  // Apply filters
  useEffect(() => {
    let tempProviders = [...allMCPProviders];

    // Apply category filters
    if (activeCategoryFilters.length > 0) {
      tempProviders = tempProviders.filter(provider =>
        activeCategoryFilters.some(filterCat => provider.categories.includes(filterCat))
      );
    }

    // Apply search term
    if (searchTerm) {
      tempProviders = tempProviders.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMCPProviders(tempProviders);
    setCurrentPage(1); // Reset to first page
  }, [searchTerm, activeCategoryFilters, allMCPProviders]);

  // Pagination handling
  const paginatedProviders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMCPProviders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMCPProviders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMCPProviders.length / itemsPerPage);

  // Toggle filter
  const toggleCategoryFilter = (category: string) => {
    setActiveCategoryFilters(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="ml-2">Loading MCP Hub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <FiAlertCircle className="text-4xl text-error mb-4" />
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h2>
        <p className="text-base-content/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MCP Hub</h1>
        <p className="text-base-content/70">Explore and access MCP Servers (Multi-Chain Processing) for the Solana ecosystem</p>
      </header>

      {/* Filters and Search Section */}
      <div className="mb-8 p-6 bg-base-200 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search MCP Providers</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or description..."
                className="input input-bordered w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-base-content/50" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-outline w-full justify-between">
                Filter by Category <FiChevronDown />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10 max-h-60 overflow-y-auto">
                {uniqueCategories.map(category => (
                  <li key={category}>
                    <label className="label cursor-pointer">
                      <span className="label-text">{category}</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={activeCategoryFilters.includes(category)}
                        onChange={() => toggleCategoryFilter(category)}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MCP Provider List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProviders.map(provider => (
          <McpCard key={provider.id} provider={provider} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join">
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`join-item btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPHubPage; 