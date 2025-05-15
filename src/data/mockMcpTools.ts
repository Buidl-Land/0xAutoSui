import { MCPProvider } from './mockMcpServers';

// MCP Tool data type
export interface MCPTool {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  usageCount: number;
  providerId: string;
  categories: string[];
  version: string;
  inputParams: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  outputExample: string;
}

// Mock MCP tools by provider
export const mockMCPToolsByProvider: Record<string, MCPTool[]> = {
  'twitter': [
    {
      id: 'twitter-1',
      name: 'Get User Last Tweets',
      description: 'Fetches the most recent tweets from a specified Twitter user account',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.9,
      usageCount: 780,
      providerId: 'twitter',
      categories: ['Social Media', 'Content'],
      version: '1.2.0',
      inputParams: [
        {
          name: 'username',
          type: 'string',
          description: 'Twitter username (without @ symbol)',
          required: true
        },
        {
          name: 'count',
          type: 'number',
          description: 'Number of tweets to retrieve (max 100)',
          required: false
        },
        {
          name: 'includeReplies',
          type: 'boolean',
          description: 'Whether to include replies in results',
          required: false
        }
      ],
      outputExample: `{
  "tweets": [
    {
      "id": "1234567890123456789", // Unique tweet ID
      "text": "This is the tweet content", // The actual tweet text
      "created_at": "2023-06-15T14:31:20Z", // When the tweet was posted
      "likes": 42, // Number of likes
      "retweets": 12, // Number of retweets
      "replies": 5, // Number of replies
      "media": [ // Optional array of media attachments
        {
          "type": "photo",
          "url": "https://example.com/image.jpg"
        }
      ]
    }
  ],
  "user": {
    "id": "12345678", // User ID
    "username": "twitteruser", // Username
    "name": "Twitter User", // Display name
    "profile_image": "https://example.com/profile.jpg" // Profile image URL
  }
}`
    },
    {
      id: 'twitter-2',
      name: 'Get User Followers',
      description: 'Retrieves followers list for a specified Twitter user account',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 650,
      providerId: 'twitter',
      categories: ['Social Media', 'Users'],
      version: '1.1.0',
      inputParams: [
        {
          name: 'username',
          type: 'string',
          description: 'Twitter username (without @ symbol)',
          required: true
        },
        {
          name: 'count',
          type: 'number',
          description: 'Number of followers to retrieve (max 200)',
          required: false
        },
        {
          name: 'cursor',
          type: 'string',
          description: 'Pagination cursor for fetching next page',
          required: false
        }
      ],
      outputExample: `{
  "followers": [
    {
      "id": "12345678", // User ID
      "username": "follower1", // Username
      "name": "Follower One", // Display name
      "profile_image": "https://example.com/profile1.jpg", // Profile image URL
      "bio": "User biography text", // User bio text
      "verified": true // Whether user is verified
    }
  ],
  "pagination": {
    "count": 50, // Number of users returned
    "total": 1240, // Total followers count
    "next_cursor": "1234567890", // Cursor for next page
    "has_more": true // Whether more followers exist
  }
}`
    },
    {
      id: 'twitter-3',
      name: 'Get User Followings',
      description: 'Retrieves the list of accounts that a specified Twitter user is following',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.6,
      usageCount: 520,
      providerId: 'twitter',
      categories: ['Social Media', 'Users'],
      version: '1.1.0',
      inputParams: [
        {
          name: 'username',
          type: 'string',
          description: 'Twitter username (without @ symbol)',
          required: true
        },
        {
          name: 'count',
          type: 'number',
          description: 'Number of followings to retrieve (max 200)',
          required: false
        },
        {
          name: 'cursor',
          type: 'string',
          description: 'Pagination cursor for fetching next page',
          required: false
        }
      ],
      outputExample: `{
  "followings": [
    {
      "id": "12345678", // User ID
      "username": "following1", // Username
      "name": "Following One", // Display name
      "profile_image": "https://example.com/profile1.jpg", // Profile image URL
      "bio": "User biography text", // User bio text
      "verified": true // Whether user is verified
    }
  ],
  "pagination": {
    "count": 50, // Number of users returned
    "total": 840, // Total followings count
    "next_cursor": "1234567890", // Cursor for next page
    "has_more": true // Whether more followings exist
  }
}`
    },
    {
      id: 'twitter-4',
      name: 'Get Tweet Replies',
      description: 'Fetches replies to a specific tweet',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 490,
      providerId: 'twitter',
      categories: ['Social Media', 'Content'],
      version: '1.3.0',
      inputParams: [
        {
          name: 'tweetId',
          type: 'string',
          description: 'ID of the tweet to fetch replies for',
          required: true
        },
        {
          name: 'count',
          type: 'number',
          description: 'Number of replies to retrieve (max 100)',
          required: false
        }
      ],
      outputExample: `{
  "tweet": {
    "id": "1234567890123456789", // Original tweet ID
    "text": "This is the original tweet", // The original tweet text
    "created_at": "2023-06-15T14:31:20Z", // When the tweet was posted
    "user": {
      "id": "12345678", // User ID
      "username": "originaluser", // Username
      "name": "Original User", // Display name
      "profile_image": "https://example.com/profile.jpg" // Profile image URL
    }
  },
  "replies": [
    {
      "id": "9876543210987654321", // Reply tweet ID
      "text": "This is a reply to the tweet", // Reply text content
      "created_at": "2023-06-15T15:12:33Z", // When the reply was posted
      "likes": 8, // Number of likes
      "user": {
        "id": "87654321", // User ID
        "username": "replyuser", // Username
        "name": "Reply User", // Display name
        "profile_image": "https://example.com/replyprofile.jpg" // Profile image URL
      }
    }
  ],
  "pagination": {
    "count": 20, // Number of replies returned
    "total": 42, // Total replies count
    "has_more": true // Whether more replies exist
  }
}`
    },
    {
      id: 'twitter-5',
      name: 'Advanced Search',
      description: 'Performs advanced Twitter search with multiple filter options',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 580,
      providerId: 'twitter',
      categories: ['Social Media', 'Search'],
      version: '1.4.0',
      inputParams: [
        {
          name: 'query',
          type: 'string',
          description: 'Search query text',
          required: true
        },
        {
          name: 'filters',
          type: 'object',
          description: 'Search filters object with various options',
          required: false
        },
        {
          name: 'count',
          type: 'number',
          description: 'Number of results to retrieve (max 100)',
          required: false
        }
      ],
      outputExample: `{
  "results": [
    {
      "id": "1234567890123456789", // Tweet ID
      "text": "This tweet matches your search query", // Tweet text
      "created_at": "2023-06-15T14:31:20Z", // When the tweet was posted
      "likes": 42, // Number of likes
      "retweets": 12, // Number of retweets
      "user": {
        "id": "12345678", // User ID
        "username": "searchuser", // Username 
        "name": "Search Result User", // Display name
        "profile_image": "https://example.com/profile.jpg" // Profile image URL
      }
    }
  ],
  "metadata": {
    "count": 25, // Number of results returned
    "total_estimated": 1240, // Estimated total results
    "next_token": "abc123xyz", // Pagination token
    "query": "your search query" // The query that was executed
  }
}`
    },
    {
      id: 'twitter-6',
      name: 'Post/Reply/Quote Tweet',
      description: 'Creates a new tweet, reply to an existing tweet, or quote tweet',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 720,
      providerId: 'twitter',
      categories: ['Social Media', 'Content Creation'],
      version: '1.5.0',
      inputParams: [
        {
          name: 'text',
          type: 'string',
          description: 'Tweet text content (max 280 characters)',
          required: true
        },
        {
          name: 'replyToId',
          type: 'string',
          description: 'Tweet ID to reply to (for replies)',
          required: false
        },
        {
          name: 'quoteId',
          type: 'string',
          description: 'Tweet ID to quote (for quote tweets)',
          required: false
        },
        {
          name: 'mediaIds',
          type: 'array',
          description: 'Array of media IDs to attach to tweet',
          required: false
        }
      ],
      outputExample: `{
  "tweet": {
    "id": "1234567890123456789", // New tweet ID
    "text": "This is the tweet that was created", // The tweet text
    "created_at": "2023-06-15T14:31:20Z", // When the tweet was posted
    "type": "reply", // Type: "tweet", "reply", or "quote"
    "reply_to": { // Only present for replies
      "id": "9876543210987654321",
      "username": "originaluser"
    },
    "quote": { // Only present for quotes
      "id": "9876543210987654321",
      "text": "Original tweet being quoted"
    },
    "media": [ // Only present if media was attached
      {
        "id": "media123456",
        "type": "photo",
        "url": "https://example.com/image.jpg"
      }
    ]
  },
  "user": {
    "id": "12345678", // User ID
    "username": "twitteruser" // Username
  }
}`
    }
  ],
  'tokenview': [
    {
      id: 'tokenview-1',
      name: 'Get Address Balance',
      description: 'Fetches balance information for a specific blockchain address',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 950,
      providerId: 'tokenview',
      categories: ['Blockchain', 'Data'],
      version: '1.2.0',
      inputParams: [
        {
          name: 'address',
          type: 'string',
          description: 'Blockchain address to query',
          required: true
        },
        {
          name: 'chain',
          type: 'string',
          description: 'Blockchain name (btc, eth, sol, etc.)',
          required: true
        }
      ],
      outputExample: `{
  "address": "0x1234567890abcdef1234567890abcdef12345678", // The queried address
  "chain": "eth", // The blockchain
  "balance": "1.234567890123456789", // The main token balance
  "balance_usd": 2345.67, // USD value of main token
  "tokens": [ // List of additional tokens (for supported chains)
    {
      "token_address": "0xabcdef1234567890abcdef1234567890abcdef12",
      "symbol": "USDT",
      "name": "Tether USD",
      "balance": "100.23",
      "balance_usd": 100.23,
      "decimals": 6
    }
  ],
  "last_updated": "2023-06-15T14:31:20Z" // When data was last updated
}`
    },
    {
      id: 'tokenview-2',
      name: 'Get Address Transactions',
      description: 'Retrieves transaction history for a specific blockchain address',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 820,
      providerId: 'tokenview',
      categories: ['Blockchain', 'Data', 'Transactions'],
      version: '1.3.0',
      inputParams: [
        {
          name: 'address',
          type: 'string',
          description: 'Blockchain address to query',
          required: true
        },
        {
          name: 'chain',
          type: 'string',
          description: 'Blockchain name (btc, eth, sol, etc.)',
          required: true
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Number of transactions to retrieve (max 100)',
          required: false
        },
        {
          name: 'offset',
          type: 'number',
          description: 'Pagination offset',
          required: false
        }
      ],
      outputExample: `{
  "address": "0x1234567890abcdef1234567890abcdef12345678", // The queried address
  "chain": "eth", // The blockchain
  "transactions": [
    {
      "txid": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", // Transaction hash
      "block_height": 16123456, // Block number
      "timestamp": "2023-06-15T14:31:20Z", // Transaction time
      "from": "0x1234567890abcdef1234567890abcdef12345678", // Sender address
      "to": "0xabcdef1234567890abcdef1234567890abcdef12", // Recipient address
      "value": "0.125", // Transaction value in main token
      "fee": "0.000123", // Transaction fee
      "status": "confirmed", // Transaction status
      "confirmations": 42 // Number of confirmations
    }
  ],
  "pagination": {
    "limit": 20, // Number of results per page
    "offset": 0, // Current offset
    "total": 156 // Total number of transactions
  }
}`
    },
    {
      id: 'tokenview-3',
      name: 'Get Block Information',
      description: 'Retrieves detailed information about a specific blockchain block',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.6,
      usageCount: 580,
      providerId: 'tokenview',
      categories: ['Blockchain', 'Data', 'Blocks'],
      version: '1.2.0',
      inputParams: [
        {
          name: 'blockHash',
          type: 'string',
          description: 'Block hash to query',
          required: false
        },
        {
          name: 'blockHeight',
          type: 'number',
          description: 'Block height/number to query',
          required: false
        },
        {
          name: 'chain',
          type: 'string',
          description: 'Blockchain name (btc, eth, sol, etc.)',
          required: true
        }
      ],
      outputExample: `{
  "block_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", // Block hash
  "block_height": 16123456, // Block number
  "chain": "eth", // The blockchain
  "timestamp": "2023-06-15T14:31:20Z", // Block timestamp
  "size": 45678, // Block size in bytes
  "transaction_count": 123, // Number of transactions in block
  "miner": "0x1234567890abcdef1234567890abcdef12345678", // Block miner/validator
  "difficulty": "12345678901234", // Mining difficulty (for PoW chains)
  "total_fees": "0.123456", // Total fees in block
  "gas_used": 12345678, // Gas used (for Ethereum)
  "gas_limit": 30000000 // Gas limit (for Ethereum)
}`
    }
  ],
  'jupiter': [
    {
      id: 'jupiter-1',
      name: 'Get Swap Quote',
      description: 'Fetches swap price quotes between tokens on Solana using Jupiter\'s aggregation',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.9,
      usageCount: 1480,
      providerId: 'jupiter',
      categories: ['DeFi', 'Trading', 'Solana'],
      version: '2.0.0',
      inputParams: [
        {
          name: 'inputMint',
          type: 'string',
          description: 'Input token mint address',
          required: true
        },
        {
          name: 'outputMint',
          type: 'string',
          description: 'Output token mint address',
          required: true
        },
        {
          name: 'amount',
          type: 'string',
          description: 'Amount of input token (in native units with decimals)',
          required: true
        },
        {
          name: 'slippageBps',
          type: 'number',
          description: 'Slippage tolerance in basis points (100 = 1%)',
          required: false
        }
      ],
      outputExample: `{
  "inputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Input token mint (USDC)
  "outputMint": "So11111111111111111111111111111111111111112", // Output token mint (SOL)
  "amount": "100000000", // Amount in input token units (100 USDC)
  "swapMode": "ExactIn", // Swap mode (ExactIn or ExactOut)
  "otherAmountThreshold": "3900000000", // Minimum amount out with slippage
  "routes": [
    {
      "marketInfos": [
        {
          "id": "jupiter-route-1",
          "label": "Orca (Whirlpools)",
          "inputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "outputMint": "So11111111111111111111111111111111111111112",
          "inAmount": "100000000",
          "outAmount": "4039087563",
          "lpFee": {
            "amount": "300000",
            "percent": 0.3
          }
        }
      ],
      "outAmount": "4039087563", // Expected output amount
      "amount": "100000000", // Input amount
      "slippageBps": 100, // Slippage tolerance
      "priceImpactPct": 0.11 // Price impact percentage
    }
  ],
  "bestRoute": {
    "outAmount": "4039087563", // Best output amount
    "inAmount": "100000000", // Input amount
    "priceImpactPct": 0.11, // Price impact percentage
    "marketInfos": [ /* Same as routes[0].marketInfos */ ]
  },
  "price": 0.02475066292, // Price (input/output)
  "priceImpactPct": 0.11 // Overall price impact percentage
}`
    },
    {
      id: 'jupiter-2',
      name: 'Execute Swap',
      description: 'Executes a token swap on Solana using Jupiter\'s smart routing',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 1250,
      providerId: 'jupiter',
      categories: ['DeFi', 'Trading', 'Solana'],
      version: '2.1.0',
      inputParams: [
        {
          name: 'quoteResponse',
          type: 'object',
          description: 'Quote response from Get Swap Quote',
          required: true
        },
        {
          name: 'userPublicKey',
          type: 'string',
          description: 'User\'s Solana wallet public key',
          required: true
        },
        {
          name: 'wrapUnwrapSOL',
          type: 'boolean',
          description: 'Whether to handle wrapping/unwrapping SOL automatically',
          required: false
        }
      ],
      outputExample: `{
  "swapTransaction": "encoded_transaction_data_base64", // Base64 encoded transaction data
  "txid": "5KtPn1LGuxhKEhLV6VhCgKjKQWnktJfVCxJA712qrozjde2ZQS6qKHdzHprvTfpjFGNmParTZ4TBiUFbmDBCzezW", // Transaction ID after execution
  "inputAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Input token address
  "outputAddress": "So11111111111111111111111111111111111111112", // Output token address
  "inAmount": "100000000", // Input amount
  "outAmount": "4029087563", // Actual output amount received
  "fee": {
    "amount": "5000", // Fee amount
    "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Fee token mint
    "pct": 0.005 // Fee percentage
  },
  "timestamp": "2023-06-15T14:31:20Z", // Transaction timestamp
  "blockhash": "8nFMwMmL5TdaShKP3uFzGranKdYgYKwHHGJ3nHGLrJu5" // Blockhash of the transaction
}`
    },
    {
      id: 'jupiter-3',
      name: 'Get Token List',
      description: 'Retrieves a list of tokens supported by Jupiter for swaps',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 980,
      providerId: 'jupiter',
      categories: ['DeFi', 'Tokens', 'Solana'],
      version: '1.5.0',
      inputParams: [
        {
          name: 'includeTags',
          type: 'boolean',
          description: 'Whether to include token tags in response',
          required: false
        },
        {
          name: 'onlyVerified',
          type: 'boolean',
          description: 'Filter to only return verified tokens',
          required: false
        }
      ],
      outputExample: `{
  "tokens": [
    {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Token mint address
      "symbol": "USDC", // Token symbol
      "name": "USD Coin", // Token name
      "decimals": 6, // Decimal places
      "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png", // Logo URL
      "tags": ["stablecoin"], // Token tags (if includeTags=true)
      "verified": true, // Whether token is verified
      "coingeckoId": "usd-coin" // CoinGecko ID for price data
    },
    {
      "address": "So11111111111111111111111111111111111111112", // SOL token mint
      "symbol": "SOL", // Token symbol
      "name": "Wrapped SOL", // Token name
      "decimals": 9, // Decimal places
      "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png", // Logo URL
      "tags": ["wrapped-solana"], // Token tags (if includeTags=true)
      "verified": true, // Whether token is verified
      "coingeckoId": "solana" // CoinGecko ID for price data
    }
  ],
  "timestamp": "2023-06-15T14:31:20Z" // Response timestamp
}`
    }
  ],
  'okx': [
    {
      id: 'okx-1',
      name: 'Get Market Tickers',
      description: 'Retrieves current market data for trading pairs on OKX exchange',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 890,
      providerId: 'okx',
      categories: ['Exchange', 'Market Data'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'instType',
          type: 'string',
          description: 'Instrument type (SPOT, SWAP, FUTURES, OPTION)',
          required: false
        },
        {
          name: 'instFamily',
          type: 'string',
          description: 'Instrument family (e.g., BTC-USD)',
          required: false
        }
      ],
      outputExample: `{
  "tickers": [
    {
      "instId": "BTC-USDT", // Instrument ID
      "last": "42680.1", // Last traded price
      "lastSz": "0.00046", // Last traded size
      "askPx": "42680.2", // Best ask price
      "askSz": "1.47138", // Best ask size
      "bidPx": "42680.1", // Best bid price
      "bidSz": "0.00802", // Best bid size
      "open24h": "42136.5", // 24-hour open price
      "high24h": "42869.7", // 24-hour highest price
      "low24h": "41882.0", // 24-hour lowest price
      "volCcy24h": "132413565.64", // 24-hour volume in quote currency
      "vol24h": "3115.86", // 24-hour volume in base currency
      "ts": "1687441234567", // Timestamp in milliseconds
      "chg24h": "1.29" // 24-hour price change percentage
    }
  ],
  "timestamp": "2023-06-15T14:31:20Z" // Response timestamp
}`
    },
    {
      id: 'okx-2',
      name: 'Place Order',
      description: 'Places a new order on OKX exchange',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 1100,
      providerId: 'okx',
      categories: ['Exchange', 'Trading'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'instId',
          type: 'string',
          description: 'Instrument ID, e.g., BTC-USDT',
          required: true
        },
        {
          name: 'tdMode',
          type: 'string',
          description: 'Trade mode (cash, cross, isolated)',
          required: true
        },
        {
          name: 'side',
          type: 'string',
          description: 'Order side (buy, sell)',
          required: true
        },
        {
          name: 'ordType',
          type: 'string',
          description: 'Order type (market, limit, post_only, etc.)',
          required: true
        },
        {
          name: 'sz',
          type: 'string',
          description: 'Order size',
          required: true
        },
        {
          name: 'px',
          type: 'string',
          description: 'Order price (required for non-market orders)',
          required: false
        }
      ],
      outputExample: `{
  "ordId": "12345678", // Order ID
  "clOrdId": "client12345", // Client-supplied order ID (if provided)
  "tag": "", // Order tag (if provided)
  "sCode": "0", // Status code (0 means success)
  "sMsg": "", // Status message
  "ordType": "limit", // Order type
  "instId": "BTC-USDT", // Instrument ID
  "side": "buy", // Order side
  "px": "42500.0", // Order price
  "sz": "0.01", // Order size
  "tdMode": "cash", // Trade mode
  "tgtCcy": "", // Target currency
  "fillSz": "0", // Filled size
  "fillPx": "0", // Average filled price
  "tradeId": "", // Trade ID (if immediately matched)
  "accFillSz": "0", // Accumulated filled size
  "fillNotionalUsd": "0", // Filled notional in USD
  "fillTime": "", // Last fill time
  "state": "live", // Order state
  "avgPx": "0", // Average price for filled portion
  "lever": "10", // Leverage (for margin)
  "fee": "0", // Fee
  "feeCcy": "USDT", // Fee currency
  "reqId": "1234abcd", // Request ID
  "timestamp": "2023-06-15T14:31:20Z" // Response timestamp
}`
    },
    {
      id: 'okx-3',
      name: 'Get Account Balance',
      description: 'Retrieves user account balance information from OKX',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.6,
      usageCount: 950,
      providerId: 'okx',
      categories: ['Exchange', 'Account'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'ccy',
          type: 'string',
          description: 'Currency, e.g., BTC (optional, returns all currencies if omitted)',
          required: false
        }
      ],
      outputExample: `{
  "balances": [
    {
      "ccy": "BTC", // Currency
      "availBal": "0.5", // Available balance
      "frozenBal": "0.1", // Frozen balance (in orders)
      "bal": "0.6", // Total balance
      "eqUsd": "25608.06", // USD equivalent
      "availEq": "0.5", // Available equity
      "uTime": "1687441234567" // Update time (milliseconds)
    },
    {
      "ccy": "USDT", // Currency
      "availBal": "10000.0", // Available balance
      "frozenBal": "500.0", // Frozen balance (in orders)
      "bal": "10500.0", // Total balance
      "eqUsd": "10500.0", // USD equivalent
      "availEq": "10000.0", // Available equity
      "uTime": "1687441234567" // Update time (milliseconds)
    }
  ],
  "totalEqUsd": "36108.06", // Total equity in USD
  "timestamp": "2023-06-15T14:31:20Z" // Response timestamp
}`
    },
    {
      id: 'okx-4',
      name: 'Get Market Depth',
      description: 'Retrieves order book depth data for a trading instrument',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.5,
      usageCount: 720,
      providerId: 'okx',
      categories: ['Exchange', 'Market Data'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'instId',
          type: 'string',
          description: 'Instrument ID, e.g., BTC-USDT',
          required: true
        },
        {
          name: 'sz',
          type: 'string',
          description: 'Depth size, default is 1',
          required: false
        }
      ],
      outputExample: `{
  "asks": [
    ["42685.1", "0.57843", "0", "12"],
    ["42685.2", "1.23754", "0", "5"],
    ["42685.3", "0.76532", "0", "3"]
  ],
  "bids": [
    ["42684.9", "0.78921", "0", "14"],
    ["42684.8", "1.54367", "0", "8"],
    ["42684.7", "0.69215", "0", "2"]
  ],
  "ts": "1687441234567",
  "instId": "BTC-USDT"
}`
    }
  ],
  'binance': [
    {
      id: 'binance-1',
      name: 'Get Market Ticker',
      description: 'Retrieves 24-hour price statistics for a symbol or all symbols',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 1250,
      providerId: 'binance',
      categories: ['Exchange', 'Market Data'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'symbol',
          type: 'string',
          description: 'Trading pair symbol (e.g., BTCUSDT)',
          required: false
        }
      ],
      outputExample: `{
  "tickers": [
    {
      "symbol": "BTCUSDT", // Trading pair
      "priceChange": "1290.50000000", // Price change
      "priceChangePercent": "3.120", // Price change percent
      "weightedAvgPrice": "41932.15640000", // Weighted average price
      "prevClosePrice": "41368.20000000", // Previous close price
      "lastPrice": "42658.70000000", // Last price
      "lastQty": "0.00157000", // Last quantity
      "bidPrice": "42658.60000000", // Best bid price
      "bidQty": "0.00936000", // Best bid quantity
      "askPrice": "42658.70000000", // Best ask price
      "askQty": "0.44639000", // Best ask quantity
      "openPrice": "41368.20000000", // Open price
      "highPrice": "42879.30000000", // High price
      "lowPrice": "41020.20000000", // Low price
      "volume": "79563.12948000", // Volume
      "quoteVolume": "3336245120.79934050", // Quote volume
      "openTime": 1687354834567, // Open time
      "closeTime": 1687441234567, // Close time
      "firstId": 123456789, // First trade ID
      "lastId": 123856789, // Last trade ID
      "count": 400000 // Trade count
    }
  ],
  "timestamp": "2023-06-15T14:31:20Z" // Response timestamp
}`
    },
    {
      id: 'binance-2',
      name: 'Create Order',
      description: 'Places a new order on Binance exchange',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.9,
      usageCount: 1450,
      providerId: 'binance',
      categories: ['Exchange', 'Trading'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'symbol',
          type: 'string',
          description: 'Trading pair symbol (e.g., BTCUSDT)',
          required: true
        },
        {
          name: 'side',
          type: 'string',
          description: 'Order side (BUY, SELL)',
          required: true
        },
        {
          name: 'type',
          type: 'string',
          description: 'Order type (LIMIT, MARKET, etc.)',
          required: true
        },
        {
          name: 'quantity',
          type: 'string',
          description: 'Order quantity',
          required: false
        },
        {
          name: 'price',
          type: 'string',
          description: 'Order price (required for limit orders)',
          required: false
        },
        {
          name: 'timeInForce',
          type: 'string',
          description: 'Time in force (GTC, IOC, FOK)',
          required: false
        }
      ],
      outputExample: `{
  "symbol": "BTCUSDT", // Trading pair
  "orderId": 12345678, // Order ID
  "orderListId": -1, // List order ID (if part of OCO)
  "clientOrderId": "x-R4BD3S82", // Client order ID
  "transactTime": 1687441234567, // Transaction time
  "price": "42500.00000000", // Order price
  "origQty": "0.01000000", // Original quantity
  "executedQty": "0.00000000", // Executed quantity
  "cummulativeQuoteQty": "0.00000000", // Cumulative quote quantity
  "status": "NEW", // Order status
  "timeInForce": "GTC", // Time in force
  "type": "LIMIT", // Order type
  "side": "BUY", // Order side
  "fills": [] // Fill information (for market orders)
}`
    },
    {
      id: 'binance-3',
      name: 'Get Account Information',
      description: 'Retrieves account information including balances',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 1100,
      providerId: 'binance',
      categories: ['Exchange', 'Account'],
      version: '1.0.0',
      inputParams: [],
      outputExample: `{
  "makerCommission": 10, // Maker commission rate (bips)
  "takerCommission": 10, // Taker commission rate (bips)
  "buyerCommission": 0, // Buyer commission rate (bips)
  "sellerCommission": 0, // Seller commission rate (bips)
  "canTrade": true, // Can user trade
  "canWithdraw": true, // Can user withdraw
  "canDeposit": true, // Can user deposit
  "updateTime": 1687441234567, // Update time
  "accountType": "SPOT", // Account type
  "balances": [
    {
      "asset": "BTC", // Asset
      "free": "0.50000000", // Free amount
      "locked": "0.10000000" // Locked amount (in orders)
    },
    {
      "asset": "USDT", // Asset
      "free": "10000.00000000", // Free amount
      "locked": "500.00000000" // Locked amount (in orders)
    }
  ],
  "permissions": [
    "SPOT",
    "MARGIN"
  ]
}`
    },
    {
      id: 'binance-4',
      name: 'Get Kline/Candlestick Data',
      description: 'Retrieves historical candlestick data for a symbol',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.8,
      usageCount: 1350,
      providerId: 'binance',
      categories: ['Exchange', 'Market Data', 'Charts'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'symbol',
          type: 'string',
          description: 'Trading pair symbol (e.g., BTCUSDT)',
          required: true
        },
        {
          name: 'interval',
          type: 'string',
          description: 'Time interval (1m, 5m, 15m, 1h, 4h, 1d, etc.)',
          required: true
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Number of candles to return (default 500, max 1000)',
          required: false
        },
        {
          name: 'startTime',
          type: 'number',
          description: 'Start time in milliseconds',
          required: false
        },
        {
          name: 'endTime',
          type: 'number',
          description: 'End time in milliseconds',
          required: false
        }
      ],
      outputExample: `{
  "symbol": "BTCUSDT",
  "interval": "1h",
  "data": [
    [
      1687435200000, // Open time
      "42500.10000000", // Open price
      "42700.55000000", // High price
      "42450.20000000", // Low price
      "42650.30000000", // Close price
      "521.34500000", // Volume
      1687438799999, // Close time
      "22155432.45500000", // Quote asset volume
      9500, // Number of trades
      "245.50000000", // Taker buy base asset volume
      "10435234.53000000", // Taker buy quote asset volume
      "0" // Ignore
    ],
    [
      1687438800000, // Open time
      "42650.30000000", // Open price
      "42800.75000000", // High price
      "42600.50000000", // Low price
      "42780.40000000", // Close price
      "485.22100000", // Volume
      1687442399999, // Close time
      "20675432.67800000", // Quote asset volume
      8700, // Number of trades
      "220.10000000", // Taker buy base asset volume
      "9385432.45000000", // Taker buy quote asset volume
      "0" // Ignore
    ]
  ]
}`
    }
  ],
  'telegram': [
    {
      id: 'telegram-1',
      name: 'Send Message',
      description: 'Sends a text message to a specified chat',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.7,
      usageCount: 980,
      providerId: 'telegram',
      categories: ['Messaging', 'Bots'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'chat_id',
          type: 'string',
          description: 'Unique identifier for the target chat',
          required: true
        },
        {
          name: 'text',
          type: 'string',
          description: 'Text of the message to be sent',
          required: true
        },
        {
          name: 'parse_mode',
          type: 'string',
          description: 'Mode for parsing entities (Markdown, HTML)',
          required: false
        },
        {
          name: 'disable_notification',
          type: 'boolean',
          description: 'Sends the message silently',
          required: false
        }
      ],
      outputExample: `{
  "ok": true, // Operation success flag
  "result": {
    "message_id": 12345, // Message ID
    "from": {
      "id": 1234567890, // Bot ID
      "is_bot": true, // Is a bot
      "first_name": "Your Bot", // Bot name
      "username": "your_bot" // Bot username
    },
    "chat": {
      "id": 9876543210, // Chat ID
      "type": "private", // Chat type (private, group, supergroup, channel)
      "first_name": "User", // User first name (for private chats)
      "last_name": "Name", // User last name (for private chats)
      "username": "username" // User username (for private chats)
    },
    "date": 1687441234, // Message timestamp
    "text": "Hello, this is a test message!", // Message text
    "entities": [ // Message entities (if any)
      {
        "type": "bold", // Entity type
        "offset": 0, // Offset in UTF-16 code units
        "length": 5 // Length in UTF-16 code units
      }
    ]
  }
}`
    },
    {
      id: 'telegram-2',
      name: 'Send Photo',
      description: 'Sends a photo to a specified chat',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.6,
      usageCount: 780,
      providerId: 'telegram',
      categories: ['Messaging', 'Bots', 'Media'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'chat_id',
          type: 'string',
          description: 'Unique identifier for the target chat',
          required: true
        },
        {
          name: 'photo',
          type: 'string',
          description: 'File ID or URL of the photo to send',
          required: true
        },
        {
          name: 'caption',
          type: 'string',
          description: 'Photo caption (may also be used when resending photos)',
          required: false
        }
      ],
      outputExample: `{
  "ok": true, // Operation success flag
  "result": {
    "message_id": 12345, // Message ID
    "from": {
      "id": 1234567890, // Bot ID
      "is_bot": true, // Is a bot
      "first_name": "Your Bot", // Bot name
      "username": "your_bot" // Bot username
    },
    "chat": {
      "id": 9876543210, // Chat ID
      "type": "private", // Chat type (private, group, supergroup, channel)
      "first_name": "User", // User first name (for private chats)
      "last_name": "Name", // User last name (for private chats)
      "username": "username" // User username (for private chats)
    },
    "date": 1687441234, // Message timestamp
    "photo": [ // Array of available photo sizes
      {
        "file_id": "AgACAgQAAxkBAAIBxGJhM7WGm3-Yz2M", // File identifier
        "file_unique_id": "AQADGvwkYly3GUB4", // Unique file identifier
        "file_size": 1234, // File size
        "width": 90, // Image width
        "height": 90 // Image height
      },
      {
        "file_id": "AgACAgQAAxkBAAIBxGJhM7WGm3-Yz2N", // File identifier
        "file_unique_id": "AQADGvwkYly3GUB5", // Unique file identifier
        "file_size": 12345, // File size
        "width": 320, // Image width
        "height": 320 // Image height
      }
    ],
    "caption": "A beautiful photo" // Photo caption
  }
}`
    },
    {
      id: 'telegram-3',
      name: 'Create Poll',
      description: 'Creates a poll in a group, channel, or supergroup',
      imageUrl: 'https://via.placeholder.com/150',
      rating: 4.5,
      usageCount: 580,
      providerId: 'telegram',
      categories: ['Messaging', 'Bots', 'Interaction'],
      version: '1.0.0',
      inputParams: [
        {
          name: 'chat_id',
          type: 'string',
          description: 'Unique identifier for the target chat',
          required: true
        },
        {
          name: 'question',
          type: 'string',
          description: 'Poll question, 1-300 characters',
          required: true
        },
        {
          name: 'options',
          type: 'array',
          description: 'List of poll options, 2-10 strings 1-100 characters each',
          required: true
        },
        {
          name: 'is_anonymous',
          type: 'boolean',
          description: 'True if the poll needs to be anonymous, defaults to True',
          required: false
        },
        {
          name: 'allows_multiple_answers',
          type: 'boolean',
          description: 'True if the poll allows multiple answers',
          required: false
        }
      ],
      outputExample: `{
  "ok": true,
  "result": {
    "message_id": 12345,
    "from": {
      "id": 1234567890,
      "is_bot": true,
      "first_name": "Your Bot",
      "username": "your_bot"
    },
    "chat": {
      "id": 9876543210,
      "title": "Group Chat",
      "type": "supergroup"
    },
    "date": 1687441234,
    "poll": {
      "id": "6541234567890",
      "question": "What is your favorite programming language?",
      "options": [
        {
          "text": "JavaScript",
          "voter_count": 0
        },
        {
          "text": "Python",
          "voter_count": 0
        },
        {
          "text": "Rust",
          "voter_count": 0
        },
        {
          "text": "Go",
          "voter_count": 0
        }
      ],
      "total_voter_count": 0,
      "is_closed": false,
      "is_anonymous": true,
      "allows_multiple_answers": false
    }
  }
}`
    }
  ]
};

// Mock API function
export const fetchMCPToolsByProviderAPI = async (providerId: string): Promise<MCPTool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMCPToolsByProvider[providerId] || []);
    }, 700);
  });
}; 