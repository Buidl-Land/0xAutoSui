"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Agent, AgentStatus } from "@/types/agent"; // Keep Agent type
import { mockAgents } from "@/data/mockAgents";
// import AgentTable from "@/components/agents/AgentTable"; // Remove AgentTable import
import AgentCard from "@/components/agents/AgentCard"; // Import AgentCard
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10; // Or make this configurable

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Management</h1>
        <Link href="/agents/create" className="btn btn-primary">
          Create New Agent
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 p-4 bg-base-200 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search Agents</span>
            </label>
            <div className="join">
              <input
                type="text"
                placeholder="Search by name..."
                className="input input-bordered join-item w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
              <button className="btn btn-ghost join-item" aria-label="Search">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filter by Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as AgentStatus | "All");
                setCurrentPage(1); // Reset to first page on filter change
              }}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              {Object.values(AgentStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
           {/* Placeholder for more filters */}
           <div className="form-control md:pt-9">
             <button className="btn btn-outline btn-neutral w-full md:w-auto">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2"/>
                More Filters
             </button>
           </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      {paginatedAgents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onAction={handleAgentAction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-base-content opacity-70">No agents found matching your criteria.</p>
        </div>
      )}


      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
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
                     <button className="join-item btn btn-disabled">...</button>
                  )}
                  <button
                    className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
            ))}
            <button
              className="join-item btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default AgentsPage;
