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
    <div className="p-4 md:p-6 space-y-6 bg-base-200 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-base-content">Agents Store</h1>
        <p className="text-base-content/70">Discover and deploy pre-built Agents, focused on the Solana Ecosystem.</p>
      </header>

      {/* Filters and Search Section - Updated for consistent styling */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Search & Filter</h2>
          
          <div className="bg-base-200/30 rounded-lg border border-base-300 p-5 mb-4">
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
                      {activePriceFilters.length === 0 || activePriceFilters.includes('All')
                        ? "All Prices" 
                        : activePriceFilters.join(" & ")}
                    </span>
                    <FiChevronDown className="h-4 w-4" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-lg w-full z-10 max-h-60 overflow-y-auto mt-1">
                    {priceFilterOptions.map(price => (
                      <li key={price}>
                        <label className="label cursor-pointer justify-start">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm mr-2"
                            checked={activePriceFilters.includes(price) || (price === 'All' && activePriceFilters.length === 0)}
                            onChange={() => {
                              if (price === 'All') {
                                setActivePriceFilters([]);
                              } else {
                                toggleFilter(activePriceFilters.filter(p => p !== 'All'), setActivePriceFilters, price);
                              }
                            }}
                          />
                          <span className="label-text">{price}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-2 sm:mb-0">
              <span className="text-sm text-base-content/70">Found {filteredStoreAgents.length} agents</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2 whitespace-nowrap">Sort by:</span>
              <select 
                className="select select-sm select-bordered"
                value={activeSortOption}
                onChange={(e) => setActiveSortOption(e.target.value)}
              >
                <option value="popularityScore_desc">Most Popular</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="createdAt_desc">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Available Agents</h2>
          
          {paginatedAgents.length === 0 ? (
            <div className="bg-base-200/30 p-8 rounded-lg text-center border border-base-300">
              <p className="text-base-content/70">No agents found matching your criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedAgents.map(agent => (
                <AgentStoreCard 
                  key={agent.storeAgentId} 
                  agent={agent} 
                  isOwned={userHasAcquiredAgent(mockCurrentUser.userId, agent.storeAgentId)}
                  onGetOrDeploy={handleGetOrDeploy}
                />
              ))}
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join shadow-sm">
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* FAQ Section or other content could go here */}
    </div>
  );
};

export default AgentStorePage;