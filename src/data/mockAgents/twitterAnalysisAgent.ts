import { ExtendedAgent } from './types';
import { AgentStatus, TriggerType, ScheduledTriggerFrequency } from '@/types/agent';
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear';

export const twitterAnalysisAgent: ExtendedAgent = {
  id: 'twitter-analysis-01',
  name: 'Twitter Analysis',
  description: 'Analyzes token-related Twitter content to provide sentiment analysis, key insights, and popularity metrics',
  status: AgentStatus.RUNNING,
  agentType: 'Task',
  systemPrompt: 'Analyze Twitter content for token-related discussions, perform sentiment analysis, and extract key insights and popularity metrics.',
  triggerType: TriggerType.SCHEDULED,
  triggerConfig: {
    frequency: ScheduledTriggerFrequency.DAILY,
    timeValue: '09:00',
  },
  config: {
    dependentMCPs: [
      {
        mcpId: 'twitter-1',
        mcpName: 'Get User Last Tweets',
        order: 1,
        parameters: {
          username: 'cryptotoken',
          count: 100,
          includeReplies: false
        }
      },
      {
        mcpId: 'twitter-5',
        mcpName: 'Advanced Search',
        order: 2,
        parameters: {
          query: '#crypto #token',
          filters: {
            minLikes: 100,
            minRetweets: 50
          },
          count: 100
        }
      }
    ],
    dependentAgents: [],
    outputActions: [
      {
        outputType: 'LOG_WRITER',
        outputProviderName: 'Internal Logger',
        parameters: {}
      }
    ]
  },
  tasks: [
    {
      id: 'twitter-task-01',
      description: 'Fetch recent tweets from crypto influencers',
      order: 1,
      tags: ['Data Fetch', 'Twitter']
    },
    {
      id: 'twitter-task-02',
      description: 'Perform sentiment analysis on tweets',
      order: 2,
      tags: ['Analysis', 'Sentiment']
    },
    {
      id: 'twitter-task-03',
      description: 'Extract key insights and topics',
      order: 3,
      tags: ['Analysis', 'Insights']
    },
    {
      id: 'twitter-task-04',
      description: 'Calculate popularity metrics',
      order: 4,
      tags: ['Analysis', 'Metrics']
    }
  ],
  logs: [
    {
      id: 'log-1',
      timestamp: Date.now() - 3600000,
      message: 'Starting daily Twitter analysis for BTC',
      status: 'info',
      executionSteps: ['Initializing analysis', 'Fetching tweets']
    },
    {
      id: 'log-2',
      timestamp: Date.now() - 3540000,
      message: 'Retrieved 100 tweets from crypto influencers',
      status: 'info',
      executionSteps: ['Tweet fetch complete', 'Processing data']
    },
    {
      id: 'log-3',
      timestamp: Date.now() - 3480000,
      message: 'Analysis complete: Positive sentiment 65%, Key topics: Price prediction, Adoption news',
      status: 'info',
      executionSteps: ['Analysis complete', 'Generating report']
    }
  ],
  createdAt: new Date(Date.now() - 1209600000), // 14 days ago
  updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
  iconUrl: getDiceBearAvatar(DICEBEAR_STYLES.AGENT, 'Twitter Analysis', { size: 128, backgroundColor: ['1d4ed8'] })
}; 