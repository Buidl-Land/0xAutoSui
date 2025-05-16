"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Agent, AgentStatus } from "@/types/agent"; // Keep Agent type
import { ExtendedAgent } from "@/data/mockAgents/types";
import { getMockAgents } from "@/data/mockAgents";
// import AgentTable from "@/components/agents/AgentTable"; // Remove AgentTable import
import AgentCard from "@/components/agents/AgentCard"; // Import AgentCard
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10; // Or make this configurable

  const mockAgents: ExtendedAgent[] = getMockAgents();
  const filteredAgents = useMemo(() => {
    return mockAgents
      .filter((agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((agent) =>
        statusFilter === "All" ? true : agent.status === statusFilter
      );
  }, [searchTerm, statusFilter]);

  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * agentsPerPage;
    return filteredAgents.slice(startIndex, startIndex + agentsPerPage);
  }, [filteredAgents, currentPage, agentsPerPage]);

  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

  // Mock handlers - replace with actual logic
  const handleAgentAction = (action: 'details' | 'edit' | 'start' | 'pause' | 'delete', agentId: string) => {
    console.log(`Action: ${action} on agent: ${agentId}`);
    // Implement actual logic, e.g., API calls, state updates
    if (action === 'start') {
        // Find agent and update status (mock)
        const agentIndex = mockAgents.findIndex(a => a.id === agentId);
        if (agentIndex !== -1) {
            // This is a mock update. In a real app, you'd update state that causes re-render.
            // For now, we'll just log.
            console.log(`Mock starting agent ${agentId}`);
        }
    }
    // Add more specific handlers if needed
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-base-200 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-base-content">Agent Management</h1>
        <Link href="/agents/create" className="btn btn-primary btn-md">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Agent
        </Link>
      </div>

      {/* Search and Filter Controls - Updated for consistent styling */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Search & Filter</h2>

          <div className="bg-base-200/30 rounded-lg border border-base-300 p-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Search Agents</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="input input-bordered w-full pr-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                  <MagnifyingGlassIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-base-content/50 h-5 w-5" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Filter by Status</span>
                </label>
                <div className="dropdown dropdown-bottom w-full">
                  <div tabIndex={0} role="button" className="select select-bordered w-full text-left flex justify-between items-center">
                    <span className="flex items-center">
                      {statusFilter !== "All" && (
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                          statusFilter === AgentStatus.RUNNING ? 'bg-success' :
                          statusFilter === AgentStatus.ERROR ? 'bg-error' :
                          statusFilter === AgentStatus.PENDING ? 'bg-warning' :
                          statusFilter === AgentStatus.SCHEDULED ? 'bg-info' : 'bg-base-300'
                        }`}></span>
                      )}
                      {statusFilter === "All" ? "All Statuses" : statusFilter}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 ml-1 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-lg w-full z-10 max-h-60 overflow-y-auto mt-1">
                    <li><button onClick={() => setStatusFilter("All")} className="w-full text-left">All Statuses</button></li>
                    {Object.values(AgentStatus).map((status) => (
                      <li key={status}>
                        <button
                          onClick={() => setStatusFilter(status)}
                          className="w-full text-left flex items-center"
                        >
                          <span className={`w-3 h-3 rounded-full mr-2 ${status === AgentStatus.RUNNING ? 'bg-success' :
                                                                    status === AgentStatus.ERROR ? 'bg-error' :
                                                                    status === AgentStatus.PENDING ? 'bg-warning' :
                                                                    status === AgentStatus.SCHEDULED ? 'bg-info' : 'bg-base-300'}`}></span>
                          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Advanced Filters Button */}
              <div className="form-control md:self-end">
                <button className="btn btn-outline btn-neutral">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2"/>
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Agent List</h2>

          {paginatedAgents.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onAction={handleAgentAction} />
              ))}
            </div>
          ) : (
            <div className="bg-base-200/30 p-8 rounded-lg text-center border border-base-300">
              <p className="text-base-content/70">No agents found matching your criteria.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join shadow-sm">
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {/* Simplified pagination display for many pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Always show first, last, current, and nearby pages
                    if (page === 1 || page === totalPages || page === currentPage ||
                        (page >= currentPage - 1 && page <= currentPage + 1) ||
                        (totalPages <= 5) || // Show all if 5 or less pages
                        (currentPage <=3 && page <=3) || // Show first 3 if current is among them
                        (currentPage >= totalPages - 2 && page >= totalPages -2) // Show last 3 if current is among them
                    ) {
                      return true;
                    }
                    // Add ellipsis logic
                    if ((currentPage > 4 && page === 2) || (currentPage < totalPages - 3 && page === totalPages - 1)) {
                        return false; // Placeholder for ellipsis, actual ellipsis rendered below
                    }
                    return false;
                  })
                  .map((page, index, arr) => (
                    <React.Fragment key={page}>
                      {/* Ellipsis before a gap */}
                      {index > 0 && page - arr[index-1] > 1 && (
                         <button className="join-item btn btn-sm btn-disabled">...</button>
                      )}
                      <button
                        className={`join-item btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                ))}
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
