import { Message } from "@ai-sdk/react";
import { nanoid } from 'nanoid';

// Define mock chat histories indexed by agentId
export const mockChatHistories: Record<string, Message[]> = {
  'default': [ // Fallback
    { id: nanoid(), role: 'assistant', content: 'Hello! How can I assist you today?' }
  ],
  'alpha-trader-01': [
    {
      id: nanoid(),
      role: 'user',
      content: `Based on the trading monitoring information, analyze the Swap token information. When buying Meme tokens exceeds 5 SOL, analyze the token, check Twitter popularity, and if there are many positive discussions about this token on Twitter, use GoPlus to analyze token security and top 10 holder percentage. If the token contract is safe and top 10 holders percentage is less than 20%, help me buy 1 SOL worth of the token using Jup Swap.

Trigger Info:
{
  "wallet_address": "73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B",
  "meme_name": "Candle",
  "meme_address": "A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL",
  "transaction": {
    "amount": 7.5,
    "currency": "SOL",
    "timestamp": "2024-03-20T08:45:23Z",
    "type": "buy_meme"
  }
}`
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Analysis Results: Found recent token transaction for Candle (A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL)\nVolume: 7.5 SOL\nTransaction Time: 5 minutes ago\nTransaction Type: Buy'
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Detected Meme token transaction exceeding 5 SOL, proceeding with social media analysis...'
    },
    {
      id: nanoid(),
      role: 'data',
      content: JSON.stringify({
        type: 'agent_call',
        agent: 'Twitter Analysis',
        parameters: {
          token_name: 'Candle',
          token_address: 'A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL',
          time_range: '24h',
          sentiment_analysis: true
        }
      })
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Social Media Analysis Results:\n- Found 30 related tweets\n- Sentiment Analysis: Positive (78%)\n- Key Points: Community maintains positive attitude, believes Candle has short-term trading potential\n- Popularity Index: High'
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Social media analysis shows positive sentiment, proceeding with security analysis...'
    },
    {
      id: nanoid(),
      role: 'data',
      content: JSON.stringify({
        type: 'tool_call',
        tool: 'GoPlus',
        parameters: {
          token_address: 'A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL',
          chain: 'solana',
          analysis_type: 'security'
        }
      })
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Security Analysis Results:\n- Contract Audit: Passed\n- Risk Items: None found\n- Top 10 Holders: 16.5%\n- Liquidity Locked: Yes (90 days)\n- Security Score: 92/100'
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Token security is good and top 10 holder percentage is below 20%, meeting trading conditions. Preparing to execute trade...'
    },
    {
      id: nanoid(),
      role: 'data',
      content: JSON.stringify({
        type: 'tool_call',
        tool: 'JupSwap',
        parameters: {
          from_token: 'SOL',
          to_token: 'A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL',
          amount: 1,
          slippage: 1
        }
      })
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: 'Trade Executed Successfully!\n- Transaction Hash: 5Drt7vvBHEubqrJGLZwGxzUbZnfMPBx3WQXFzCjDrNrv\n- Input: 1 SOL\n- Received: 12,452 Candle\n- Current Price: 1 Candle = 0.00008 SOL\n- Transaction Fee: 0.000005 SOL'
    },
    {
      id: nanoid(),
      role: 'assistant',
      content: `# 一、数据洞察与分析阶段
1. **钱包数据扫描**：启动WalletAnalyze工具，精准定位到近期交互代币**Candle（合约地址：A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL）**，锁定潜在投资目标。KOL钱包在5分钟前进行了**7.5 SOL**的买入操作，交易行为符合我们的监控规则。

2. **舆情动态监测**：借助TwitterCrawler抓取到**30条相关推文**，深入剖析近5条高互动内容发现，市场情绪显著乐观（积极情绪占比78%），多数观点认为Candle具备**短期炒作价值**，印证市场关注度与投资潜力。特别是加密货币社区中的主流意见认为该代币有突破性涨幅可能。

3. **安全风险评估**：通过GoPlus专业审计，确认代币**无安全漏洞**，且前十大持仓占比仅**16.5%**，流通结构分散，符合稳健投资的风控标准。代币合约已通过安全审计，流动性锁定90天，综合安全评分高达92分（满分100分），风险系数极低。

# 二、交易执行阶段
基于多维数据交叉验证，触发自动化交易指令：通过Jup Swap协议，以**1 SOL**成功购入**12,452枚Candle代币**（当前价格1 Candle = 0.00008 SOL），交易哈希为5Drt7vvBHEubqrJGLZwGxzUbZnfMPBx3WQXFzCjDrNrv，交易瞬时完成，确保捕捉市场先机。交易手续费仅为0.000005 SOL，性价比极高。

# 三、后续行动建议
建议持续关注Candle的链上数据与社区热度变化，我将实时监控价格波动、大户动向等指标，一旦触发止盈止损条件，将立即执行调仓策略，为您的资产保驾护航。特别关注：
- 代币持有地址增长率
- 24小时交易量变化
- 社交媒体情绪波动
- KOL后续操作动向

系统已设置价格提醒，当Candle价格上涨30%或下跌15%时将第一时间通知您，帮助您把握最佳交易时机。`
    }
  ]
}; 