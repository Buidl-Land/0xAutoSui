'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiAlertCircle, FiLoader, FiSettings, FiShoppingBag } from 'react-icons/fi';
import McpCard from '@/components/mcp-hub/McpCard';
import { MCPProvider, fetchMCPProvidersAPI } from '@/data/mockMcpServers';

// 定义筛选区域组件
interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategoryFilters: string[];
  setActiveCategoryFilters: (filters: string[]) => void;
  uniqueCategories: string[];
  toggleCategoryFilter: (category: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  activeCategoryFilters,
  uniqueCategories,
  toggleCategoryFilter
}) => {
  return (
    <div className="bg-base-200/30 rounded-lg mb-6 p-5 border border-base-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Search</span>
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
                      onChange={() => toggleCategoryFilter(category)}
                    />
                    <span className="label-text">{category}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Sort By */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Sort By</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="userCount_desc">Most Popular</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="mcpCount_desc">Most Tools</option>
            <option value="createdAt_desc">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// 定义MCP卡片列表组件
interface McpListProps {
  providers: MCPProvider[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  emptyMessage: string;
}

const McpList: React.FC<McpListProps> = ({ 
  providers, 
  currentPage, 
  setCurrentPage, 
  totalPages, 
  emptyMessage
}) => {
  return (
    <div>
      {providers.length === 0 ? (
        <div className="bg-base-200/30 p-8 rounded-lg text-center border border-base-300">
          <p className="text-base-content/70">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map(provider => (
              <McpCard key={provider.id} provider={provider} isInstalled={provider.installed} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 mb-2">
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
        </>
      )}
    </div>
  );
};

const MCPHubPage = () => {
  const [allMCPProviders, setAllMCPProviders] = useState<MCPProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 已安装MCP状态
  const [installedProviders, setInstalledProviders] = useState<MCPProvider[]>([]);
  const [filteredInstalledProviders, setFilteredInstalledProviders] = useState<MCPProvider[]>([]);
  const [installedSearchTerm, setInstalledSearchTerm] = useState('');
  const [installedCategoryFilters, setInstalledCategoryFilters] = useState<string[]>([]);
  const [installedCurrentPage, setInstalledCurrentPage] = useState(1);
  
  // 市场MCP状态
  const [marketProviders, setMarketProviders] = useState<MCPProvider[]>([]);
  const [filteredMarketProviders, setFilteredMarketProviders] = useState<MCPProvider[]>([]);
  const [marketSearchTerm, setMarketSearchTerm] = useState('');
  const [marketCategoryFilters, setMarketCategoryFilters] = useState<string[]>([]);
  const [marketCurrentPage, setMarketCurrentPage] = useState(1);
  
  const itemsPerPage = 6; // 2x3 grid

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const providers = await fetchMCPProvidersAPI();
        setAllMCPProviders(providers);
        
        // 分离已安装和市场MCP
        const installed = providers.filter(p => p.installed);
        const market = providers.filter(p => !p.installed);
        
        setInstalledProviders(installed);
        setFilteredInstalledProviders(installed);
        
        setMarketProviders(market);
        setFilteredMarketProviders(market);
      } catch (e) {
        setError('Failed to load MCP Hub. Please try again later.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 获取所有唯一分类
  const uniqueCategories = React.useMemo(() => {
    const categories = new Set<string>();
    allMCPProviders.forEach(provider => provider.categories.forEach(cat => categories.add(cat)));
    return Array.from(categories).sort();
  }, [allMCPProviders]);

  // 切换分类筛选 - 已安装
  const toggleInstalledCategoryFilter = (category: string) => {
    setInstalledCategoryFilters(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };
  
  // 切换分类筛选 - 市场
  const toggleMarketCategoryFilter = (category: string) => {
    setMarketCategoryFilters(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // 应用筛选 - 已安装
  useEffect(() => {
    let filtered = [...installedProviders];

    // 应用分类筛选
    if (installedCategoryFilters.length > 0) {
      filtered = filtered.filter(provider =>
        installedCategoryFilters.some(filterCat => provider.categories.includes(filterCat))
      );
    }

    // 应用搜索词
    if (installedSearchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(installedSearchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(installedSearchTerm.toLowerCase())
      );
    }

    setFilteredInstalledProviders(filtered);
    setInstalledCurrentPage(1); // 重置为第一页
  }, [installedSearchTerm, installedCategoryFilters, installedProviders]);

  // 应用筛选 - 市场
  useEffect(() => {
    let filtered = [...marketProviders];
    
    // 应用分类筛选
    if (marketCategoryFilters.length > 0) {
      filtered = filtered.filter(provider =>
        marketCategoryFilters.some(filterCat => provider.categories.includes(filterCat))
      );
    }
    
    // 应用搜索词
    if (marketSearchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(marketSearchTerm.toLowerCase())
      );
    }
    
    setFilteredMarketProviders(filtered);
    setMarketCurrentPage(1); // 重置为第一页
  }, [marketSearchTerm, marketCategoryFilters, marketProviders]);

  // 计算分页 - 已安装
  const paginatedInstalledProviders = React.useMemo(() => {
    const startIndex = (installedCurrentPage - 1) * itemsPerPage;
    return filteredInstalledProviders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInstalledProviders, installedCurrentPage]);
  
  // 计算分页 - 市场
  const paginatedMarketProviders = React.useMemo(() => {
    const startIndex = (marketCurrentPage - 1) * itemsPerPage;
    return filteredMarketProviders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMarketProviders, marketCurrentPage]);
  
  // 计算总页数 - 已安装
  const installedTotalPages = Math.ceil(filteredInstalledProviders.length / itemsPerPage);
  
  // 计算总页数 - 市场
  const marketTotalPages = Math.ceil(filteredMarketProviders.length / itemsPerPage);

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
    <div className="p-4 md:p-6 space-y-6 bg-base-200 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-base-content">MCP Hub</h1>
        <p className="text-base-content/70">Discover and install MCP servers for your agent integration needs.</p>
      </header>

      {/* 已安装的MCP服务器 */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Installed Servers</h2>
          
          <FilterSection
            searchTerm={installedSearchTerm}
            setSearchTerm={setInstalledSearchTerm}
            activeCategoryFilters={installedCategoryFilters}
            setActiveCategoryFilters={setInstalledCategoryFilters}
            uniqueCategories={uniqueCategories}
            toggleCategoryFilter={toggleInstalledCategoryFilter}
          />
          
          <McpList
            providers={paginatedInstalledProviders}
            currentPage={installedCurrentPage}
            setCurrentPage={setInstalledCurrentPage}
            totalPages={installedTotalPages}
            emptyMessage="No installed MCP servers found. Install some from the marketplace below."
          />
        </div>
      </div>
      
      {/* MCP市场 */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Marketplace Servers</h2>
          
          <FilterSection
            searchTerm={marketSearchTerm}
            setSearchTerm={setMarketSearchTerm}
            activeCategoryFilters={marketCategoryFilters}
            setActiveCategoryFilters={setMarketCategoryFilters}
            uniqueCategories={uniqueCategories}
            toggleCategoryFilter={toggleMarketCategoryFilter}
          />
          
          <McpList
            providers={paginatedMarketProviders}
            currentPage={marketCurrentPage}
            setCurrentPage={setMarketCurrentPage}
            totalPages={marketTotalPages}
            emptyMessage="No marketplace MCP servers found. Try changing your filters."
          />
        </div>
      </div>
    </div>
  );
};

export default MCPHubPage; 