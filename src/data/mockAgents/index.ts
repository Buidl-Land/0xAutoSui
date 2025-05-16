import { ExtendedAgent } from './types';
import { alphaTraderAgent } from './alphaTraderAgent';
import { dcaSolAgent } from './dcaSolAgent';
import { xInfoCollectorAgent } from './xInfoCollectorAgent';
import { featuredPerpTradingAgent } from './featuredPerpTradingAgent';
import { featuredLPAgent } from './featuredLPAgent';
import { twitterAnalysisAgent } from './twitterAnalysisAgent';
export type { ExtendedAgent, MockLog } from './types';

export const mockAgents: ExtendedAgent[] = [
  alphaTraderAgent,
  twitterAnalysisAgent,
  featuredPerpTradingAgent,
  featuredLPAgent,
  dcaSolAgent,
  xInfoCollectorAgent,
];

export const getMockAgentById = (id: string): ExtendedAgent | undefined => {
  return mockAgents.find(agent => agent.id === id);
};

export const getFeaturedAgents = (): ExtendedAgent[] => {
  return mockAgents.filter(agent =>
    agent.id === 'alpha-trader-01' ||
    agent.id === 'featured-perp-trader-01' ||
    agent.id === 'featured-lp-provider-01'
  );
}; 