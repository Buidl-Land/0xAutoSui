'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import { User } from '@/types/user';
import { fetchMockCurrentUser } from '@/data/mocks/userMocks'; // Import the new mock function
import { ExtendedAgent, getMockAgents } from '@/data/mockAgents'; // Changed to import getMockAgents

// Import new dashboard components
import ExploreSection from '@/components/dashboard/ExploreSection'; // New Explore Section
import TokenBalancesCard from '@/components/dashboard/TokenBalancesCard';
import ActiveAgentsList from '@/components/dashboard/ActiveTasksList'; // Imports ActiveAgentsList component from ActiveTasksList.tsx
import AgentLogsView from '@/components/dashboard/AgentLogsView';
import { Cog6ToothIcon, PlusCircleIcon } from '@heroicons/react/24/outline'; // For button icons

// Mock API call functions - REMOVED
// const fetchCurrentUser = async (): Promise<User> => { ... };

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allAgents, setAllAgents] = useState<ExtendedAgent[]>([]); // For ExploreSection
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await fetchMockCurrentUser(); // Use the new mock function
        setCurrentUser(user);
        setAllAgents(getMockAgents()); // Pass all mock agents to ExploreSection
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleNavigate = (route: string) => {
    router.push(route);
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.24))]"> {/* Adjusted min-height */}
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div role="alert" className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {currentUser && <WelcomeMessage username={currentUser.username} />}

      {/* Main Dashboard Grid - Adjusted Layout */}
      {/* Row 1: Active Agents & Token Portfolio (with P/L) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-96 overflow-y-auto"> {/* Active Agents takes 1/3 width on large screens, fixed height and scrollable */}
          <ActiveAgentsList />
        </div>
        <div className="lg:col-span-2 h-96 overflow-y-auto"> {/* Token Portfolio takes 2/3 width on large screens, fixed height and scrollable */}
          <TokenBalancesCard />
        </div>
      </div>

      {/* Row 2: Agent Logs View - Full width */}
      <div className="mt-6"> {/* Added margin-top for spacing */}
        <AgentLogsView />
      </div>

      {/* Row 3: Explore Section - Full width */}
      <div className="mt-6"> {/* Added margin-top for spacing */}
        <ExploreSection agents={allAgents} /> {/* Pass all agents */}
      </div>


      {/* Quick Create Agent Button - Remains at the bottom */}
      <div className="flex justify-center items-center py-4 md:py-6">
        <button
          className="btn btn-primary btn-lg w-full max-w-md flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
          onClick={() => handleNavigate('/agents/create')}
        >
          <PlusCircleIcon className="w-7 h-7" />
          Create New Agent
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;