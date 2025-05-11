'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import AgentOverviewCard from '@/components/dashboard/AgentOverviewCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import WalletBalanceCard from '@/components/dashboard/WalletBalanceCard';
import WatchedFeedsSection from '@/components/dashboard/WatchedFeedsSection';
import { User } from '@/types/user';
import { AgentStatus, Agent } from '@/types/agent';

// Mock data types - replace with actual types from domain model
interface AgentStats {
  total: number;
  running: number;
  scheduled: number;
  pendingError: number;
}

interface AgentActivityLog {
  logId: string;
  agentId: string;
  timestamp: string;
  activityType: string;
  description: string;
  details?: any;
  status: 'SUCCESS' | 'FAILURE' | 'INFO' | 'WARNING';
}

interface WalletBalance {
  solBalance: number;
  usdtBalance: number;
  serviceCredits: number;
}

interface WatchedFeed {
  feedId: string;
  agentId: string;
  agentName?: string;
  feedName: string;
  lastSummary: string;
  lastUpdatedAt: string;
  isActive: boolean;
}

// Mock API call functions - replace with actual API calls
const fetchCurrentUser = async (): Promise<User> => {
  // Simulate API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ userId: 'user123', username: 'Ricky', email: 'ricky@example.com' }), 500)
  );
};

const fetchAgentStats = async (userId: string): Promise<AgentStats> => {
  console.log(`Fetching agent stats for ${userId}`);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ total: 10, running: 3, scheduled: 2, pendingError: 1 }), 500)
  );
};

const fetchRecentLogs = async (userId: string, limit: number): Promise<AgentActivityLog[]> => {
  console.log(`Fetching ${limit} recent logs for ${userId}`);
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            logId: 'log1',
            agentId: 'agentA',
            timestamp: new Date().toISOString(),
            activityType: 'TASK_COMPLETED',
            description: 'Agent A completed daily Solana news scraping',
            status: 'SUCCESS',
          },
          {
            logId: 'log2',
            agentId: 'agentB',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            activityType: 'TRADE_EXECUTED',
            description: 'Agent B executed Jupiter aggregation trade',
            status: 'SUCCESS',
          },
          {
            logId: 'log3',
            agentId: 'agentC',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            activityType: 'ERROR_OCCURRED',
            description: 'Agent C failed to trigger SOL price alert',
            status: 'FAILURE',
          },
        ]),
      500
    )
  );
};

const fetchWalletBalance = async (userId: string): Promise<WalletBalance> => {
  console.log(`Fetching wallet balance for ${userId}`);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ solBalance: 1.5, usdtBalance: 200, serviceCredits: 8000 }), 500)
  );
};

const fetchWatchedFeeds = async (userId: string): Promise<WatchedFeed[]> => {
  console.log(`Fetching watched feeds for ${userId}`);
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            feedId: 'feed1',
            agentId: 'SolanaNewsAggregator',
            agentName: 'SolanaNewsAggregator',
            feedName: 'Daily Solana Ecosystem News Summary',
            lastSummary: 'Solana price hits new ATH, several new projects launched on the ecosystem.',
            lastUpdatedAt: new Date().toISOString(),
            isActive: true,
          },
          {
            feedId: 'feed2',
            agentId: 'SOLWhaleWatcher',
            agentName: 'SOLWhaleWatcher',
            feedName: 'Tracking SOL Whale Address Activity',
            lastSummary: 'Whale address 0xABC... moved 1M SOL to an exchange.',
            lastUpdatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            isActive: true,
          },
        ]),
      500
    )
  );
};


const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<AgentActivityLog[] | null>(null);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [watchedFeeds, setWatchedFeeds] = useState<WatchedFeed[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
        if (user) {
          const [stats, logs, balance, feeds] = await Promise.all([
            fetchAgentStats(user.userId),
            fetchRecentLogs(user.userId, 5),
            fetchWalletBalance(user.userId),
            fetchWatchedFeeds(user.userId),
          ]);
          setAgentStats(stats);
          setRecentLogs(logs);
          setWalletBalance(balance);
          setWatchedFeeds(feeds);
        }
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

  const handleCreateNewAgent = () => {
    router.push('/agents/new'); // Or your specific route for creating new agents
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    <div className="container mx-auto p-4">
      <WelcomeMessage username={currentUser?.username} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-6">
          <AgentOverviewCard stats={agentStats || undefined} onViewAllAgents={() => handleNavigate('/agents')} />
          <QuickActionsCard
            onCreateNewAgent={handleCreateNewAgent}
            onBrowseMCP={() => handleNavigate('/store')} // Corrected to /store as per QuickActionsCard
            onManageWallet={() => handleNavigate('/wallet')}
          />
        </div>
        <div className="flex flex-col space-y-6">
          <RecentActivityCard logs={recentLogs || undefined} onViewFullLogs={() => handleNavigate('/logs')} />
          <WalletBalanceCard balance={walletBalance || undefined} />
        </div>
      </div>
      <WatchedFeedsSection feeds={watchedFeeds || undefined} />
    </div>
  );
};

export default DashboardPage;