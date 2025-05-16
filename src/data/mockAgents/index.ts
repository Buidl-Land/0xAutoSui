import { ExtendedAgent, MockLog } from './types'; // Ensure MockLog is imported if used by generation logic
import { Agent, AIModel, TriggerType, AgentStatus, Task } from '../../types/agent'; // Import necessary types
import { getDiceBearAvatar, DICEBEAR_STYLES } from '../../utils/dicebear';
import { alphaTraderAgent } from './alphaTraderAgent';
import { dcaSolAgent } from './dcaSolAgent';
import { xInfoCollectorAgent } from './xInfoCollectorAgent';
import { featuredPerpTradingAgent } from './featuredPerpTradingAgent';
import { featuredLPAgent } from './featuredLPAgent';
import { twitterAnalysisAgent } from './twitterAnalysisAgent';
export type { ExtendedAgent, MockLog } from './types';

export enum AgentCreationType {
  BASIC = "BASIC",
  WITH_TASKS = "WITH_TASKS",
  RANDOM_ATTRIBUTES = "RANDOM_ATTRIBUTES",
}

let allMockAgents: ExtendedAgent[] = [
  alphaTraderAgent,
  twitterAnalysisAgent,
  featuredPerpTradingAgent,
  featuredLPAgent,
  dcaSolAgent,
  xInfoCollectorAgent,
];

export const getMockAgents = (): ExtendedAgent[] => {
  return allMockAgents;
};

export { allMockAgents };

export const getMockAgentById = (id: string): ExtendedAgent | undefined => {
  return allMockAgents.find(agent => agent.id === id);
};

export const addMockAgent = (
  name: string,
  description: string,
  model: AIModel,
  systemPrompt: string,
  creationType: AgentCreationType
): void => {
  const newAgentId = `agent-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  let newAgent: ExtendedAgent = {
    id: newAgentId,
    name,
    description,
    model,
    systemPrompt,
    iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, name),
    triggerType: TriggerType.MANUAL,
    triggerConfig: null,
    config: {
      dependentMCPs: [],
      dependentAgents: [],
      outputActions: [],
    },
    status: AgentStatus.IDLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastModified: new Date(),
    creator: 'currentUser', // Placeholder
    logs: [],
    tasks: [],
    // Default wallet/credit settings
    associatedWalletId: null,
    autoRefillServiceCredits: false,
    serviceCreditsRefillThreshold: 0,
    serviceCreditsRefillAmount: 0,
    autoRefillSol: false,
    solRefillThreshold: 0,
    solRefillAmount: 0,
    solRefillSourceEoa: '',
  };

  switch (creationType) {
    case AgentCreationType.BASIC:
      // Minimal data is already set by the defaults above
      break;
    case AgentCreationType.WITH_TASKS:
      newAgent.tasks = [
        { id: 'task-1', description: 'Initial setup task', order: 1, tags: ['setup'] },
        { id: 'task-2', description: 'Monitor primary objective', order: 2, tags: ['monitoring'] },
        { id: 'task-3', description: 'Report findings', order: 3, tags: ['reporting'] },
      ];
      newAgent.description = `${description} (Task-Oriented)`;
      break;
    case AgentCreationType.RANDOM_ATTRIBUTES:
      const statuses = [AgentStatus.RUNNING, AgentStatus.PENDING, AgentStatus.ERROR, AgentStatus.IDLE, AgentStatus.STOPPED];
      newAgent.status = statuses[Math.floor(Math.random() * statuses.length)];
      newAgent.lastModified = new Date(Date.now() - Math.floor(Math.random() * 1000000000)); // Random past date
      newAgent.config.dependentMCPs = Math.random() > 0.5 ? [{ mcpId: 'mcp-random-1', mcpName: 'Random MCP 1', order: 1, parameters: { foo: 'bar' } }] : [];
      newAgent.description = `${description} (Dynamic Attributes)`;
      newAgent.autoRefillSol = Math.random() > 0.5;
      if (newAgent.autoRefillSol) {
        newAgent.solRefillThreshold = Math.random() * 10;
        newAgent.solRefillAmount = Math.random() * 5;
      }
      break;
    default:
      // Default to basic if type is unknown
      break;
  }

  allMockAgents.push(newAgent);
};

export const getFeaturedAgents = (): ExtendedAgent[] => {
  return allMockAgents.filter(agent =>
    agent.id === 'alpha-trader-01' ||
    agent.id === 'featured-perp-trader-01' ||
    agent.id === 'featured-lp-provider-01'
  );
};