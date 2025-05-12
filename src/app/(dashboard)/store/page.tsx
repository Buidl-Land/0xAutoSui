'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { StoreAgent, PricingModelType } from '@/types/storeAgent';
import { mockStoreAgents } from '@/data/mockStoreAgents';
import AgentStoreCard from '@/components/agent-store/AgentStoreCard';
import { FiSearch, FiFilter, FiChevronDown, FiAlertCircle, FiLoader } from 'react-icons/fi'; // Example icons

// Mock API functions (replace with actual API calls)
const fetchAllStoreAgentsAPI = async (): Promise<StoreAgent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStoreAgents);
    }, 500);
  });
};

// Mock user data (replace with actual user context/API)
const mockCurrentUser = { userId: 'user_123', name: 'Demo User' };
const userHasAcquiredAgent = (userId: string, storeAgentId: string): boolean => {
  // Mock logic: For demo, assume user has not acquired any paid agents yet
  const agent = mockStoreAgents.find(a => a.storeAgentId === storeAgentId);
  return agent?.pricingModel.type === PricingModelType.FREE;
};


const AgentStorePage = () => {
  const [allStoreAgents, setAllStoreAgents] = useState<StoreAgent[]>([]);
  const [filteredStoreAgents, setFilteredStoreAgents] = useState<StoreAgent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilters, setActiveCategoryFilters] = useState<string[]>([]);
  const [activeProviderFilters, setActiveProviderFilters] = useState<string[]>([]);
  const [activePriceFilters, setActivePriceFilters] = useState<string[]>([]);
  const [activeSortOption, setActiveSortOption] = useState('popularityScore_desc'); // e.g., price_asc, name_asc

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For modals (simplified for now, implement modals as separate components if complex)
  // const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  // const [showDeployModal, setShowDeployModal] = useState(false);
  // const [selectedAgentForModal, setSelectedAgentForModal] = useState<StoreAgent | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const agents = await fetchAllStoreAgentsAPI();
        setAllStoreAgents(agents);
        setFilteredStoreAgents(agents); // Initially show all
      } catch (e) {
        setError('Failed to load Agent Store. Please try again later.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    allStoreAgents.forEach(agent => agent.categories.forEach(cat => categories.add(cat)));
    return Array.from(categories).sort();
  }, [allStoreAgents]);

  const uniqueProviders = useMemo(() => {
    const providers = new Set<string>();
    allStoreAgents.forEach(agent => providers.add(agent.provider));
    return Array.from(providers).sort();
  }, [allStoreAgents]);

  const priceFilterOptions = ['All', 'Free', 'Paid'];


  useEffect(() => {
    let tempAgents = [...allStoreAgents];

    // Apply Category Filters
    if (activeCategoryFilters.length > 0) {
      tempAgents = tempAgents.filter(agent =>
        activeCategoryFilters.every(filterCat => agent.categories.includes(filterCat))
      );
    }

    // Apply Provider Filters
    if (activeProviderFilters.length > 0) {
      tempAgents = tempAgents.filter(agent => activeProviderFilters.includes(agent.provider));
    }

    // Apply Price Filters
    if (activePriceFilters.length > 0 && !activePriceFilters.includes('All')) {
        tempAgents = tempAgents.filter(agent => {
            if (activePriceFilters.includes('Free') && agent.pricingModel.type === PricingModelType.FREE) {
                return true;
            }
            if (activePriceFilters.includes('Paid') && agent.pricingModel.type !== PricingModelType.FREE) {
                return true;
            }
            return false;
        });
    }

    // Apply Search Term
    if (searchTerm) {
      tempAgents = tempAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply Sorting
    if (activeSortOption) {
      const [key, order] = activeSortOption.split('_');
      tempAgents.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (key === 'price') {
            valA = a.pricingModel.type === PricingModelType.FREE ? 0 : (a.pricingModel.priceCredits || a.pricingModel.priceSol || Infinity);
            valB = b.pricingModel.type === PricingModelType.FREE ? 0 : (b.pricingModel.priceCredits || b.pricingModel.priceSol || Infinity);
        } else {
            valA = (a as any)[key];
            valB = (b as any)[key];
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return order === 'asc' ? valA - valB : valB - valA;
      });
    }

    setFilteredStoreAgents(tempAgents);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, activeCategoryFilters, activeProviderFilters, activePriceFilters, activeSortOption, allStoreAgents]);

  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStoreAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStoreAgents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStoreAgents.length / itemsPerPage);

  const handleGetOrDeploy = (agent: StoreAgent) => {
    // Mock interaction
    console.log(`Attempting to get/deploy: ${agent.name}`);
    if (agent.pricingModel.type === PricingModelType.FREE || userHasAcquiredAgent(mockCurrentUser.userId, agent.storeAgentId)) {
      alert(`Deploying ${agent.name}... (Mock Action)`);
      // Here you would typically open a deployment configuration modal
      // setSelectedAgentForModal(agent);
      // setShowDeployModal(true);
    } else {
      alert(`Initiating purchase for ${agent.name}... (Mock Action)`);
      // Here you would typically open a purchase confirmation modal
      // setSelectedAgentForModal(agent);
      // setShowPurchaseModal(true);
    }
  };

  const toggleFilter = (filterList: string[], setFilterList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setFilterList(prev => prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="ml-2">Loading Agent Store...</p>
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
        <h1 className="text-3xl font-bold mb-2">Agents Store</h1>
        <p className="text-base-content/70">Discover and deploy pre-built Agents, focused on the Solana Ecosystem.</p>
      </header>

      {/* Filters and Search Section - Updated for consistent styling */}
      <div className="mb-8 p-5 bg-base-200 rounded-lg shadow-md">
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-base-content">Search & Filter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Search Agents</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="input input-bordered w-full pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-base-content/50 h-5 w-5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <div className="dropdown dropdown-bottom w-full">
                <div tabIndex={0} role="button" className="select select-bordered w-full text-left flex justify-between items-center">
                  <span>
                    {activeCategoryFilters.length === 0 
                      ? "All Categories" 
                      : activeCategoryFilters.length === 1 
                        ? activeCategoryFilters[0] 
                        : `${activeCategoryFilters.length} categories selected`}
                  </span>
                  <FiChevronDown className="h-4 w-4" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-lg w-full z-10 max-h-60 overflow-y-auto mt-1">
                  {uniqueCategories.map(category => (
                    <li key={category}>
                      <label className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm mr-2"
                          checked={activeCategoryFilters.includes(category)}
                          onChange={() => toggleFilter(activeCategoryFilters, setActiveCategoryFilters, category)}
                        />
                        <span className="label-text">{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Provider Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Provider</span>
              </label>
              <div className="dropdown dropdown-bottom w-full">
                <div tabIndex={0} role="button" className="select select-bordered w-full text-left flex justify-between items-center">
                  <span>
                    {activeProviderFilters.length === 0 
                      ? "All Providers" 
                      : activeProviderFilters.length === 1 
                        ? activeProviderFilters[0] 
                        : `${activeProviderFilters.length} providers selected`}
                  </span>
                  <FiChevronDown className="h-4 w-4" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-lg w-full z-10 max-h-60 overflow-y-auto mt-1">
                  {uniqueProviders.map(provider => (
                    <li key={provider}>
                      <label className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm mr-2"
                          checked={activeProviderFilters.includes(provider)}
                          onChange={() => toggleFilter(activeProviderFilters, setActiveProviderFilters, provider)}
                        />
                        <span className="label-text">{provider}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Price</span>
              </label>
              <div className="dropdown dropdown-bottom w-full">
                <div tabIndex={0} role="button" className="select select-bordered w-full text-left flex justify-between items-center">
                  <span>
                    {activePriceFilters.length === 0 
                      ? "All Prices" 
                      : activePriceFilters.length === 1 
                        ? activePriceFilters[0] 
                        : `${activePriceFilters.length} price options selected`}
                  </span>
                  <FiChevronDown className="h-4 w-4" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-lg w-full z-10 max-h-60 overflow-y-auto mt-1">
                  {priceFilterOptions.map(priceOpt => (
                    <li key={priceOpt}>
                      <label className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm mr-2"
                          checked={activePriceFilters.includes(priceOpt)}
                          onChange={() => toggleFilter(activePriceFilters, setActivePriceFilters, priceOpt)}
                        />
                        <span className="label-text">{priceOpt}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sort Options */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Sort By</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={activeSortOption}
                onChange={(e) => setActiveSortOption(e.target.value)}
                aria-label="Sort Agents By"
              >
                <option value="popularityScore_desc">Popularity (High to Low)</option>
                <option value="popularityScore_asc">Popularity (Low to High)</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="publishedAt_desc">Recently Added</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      {paginatedAgents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAgents.map(agent => (
              <AgentStoreCard key={agent.storeAgentId} agent={agent} onGetOrDeploy={handleGetOrDeploy} />
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
        </>
      ) : (
        <div className="text-center py-12">
          <FiAlertCircle className="text-4xl text-base-content/50 mx-auto mb-4" />
          <p className="text-xl">No Agents Found</p>
          <p className="text-base-content/70">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AgentStorePage;