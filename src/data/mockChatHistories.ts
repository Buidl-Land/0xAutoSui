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
      content: `Based on the trading monitoring information, analyze the Swap token information. When buying Meme tokens exceeds 5 SOL, analyze the token, check Twitter popularity, and if there are many positive discussions about this token on Twitter, use GoPlus to analyze token security and top 10 holder percentage. If the token contract is safe and top 10 holders percentage is less than 20%, help me buy 1 SOL worth of the token using OKX Dex.

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
        tool: 'OKX Dex',
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
      content: `# Summary of Actions and Recommendations
## 1. Analysis Phase:
- **Wallet Scan**: Identified recent Candle token (A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL) interaction. A KOL bought 7.5 SOL worth 5 mins ago, matching rules.
- **Social Media Monitoring**: 30 relevant tweets found. Market sentiment is 78% positive. Candle has short-term speculative value; potential for significant gains.
- **Security Assessment**: No security vulnerabilities. Top 10 holders: 16.5%. Contract audited, liquidity locked 90 days, security score 92/100 (low risk).

## 2. Trade Execution:
Bought 12,452 Candle for 1 SOL via OKX Dex. Price: 1 Candle = 0.00008 SOL. TxHash: 5Drt7vvBHEubqrJGLZwGxzUbZnfMPBx3WQXFzCjDrNrv. Fee: 0.000005 SOL.

## 3. Next Steps:
Monitor Candle's on-chain data & community sentiment (price, volume, KOL actions). Alerts set for +30%/-15% price changes.`
    }
  ]
};