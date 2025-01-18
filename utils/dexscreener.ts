const DEXSCREENER_API_BASE = 'https://api.dexscreener.com/latest/dex';

export async function getTokenProfile(tokenAddress: string): Promise<string> {
  try {
    const response = await fetch(`${DEXSCREENER_API_BASE}/tokens/${tokenAddress}`);
    const data = await response.json();
    
    if (!data || !data.pairs || data.pairs.length === 0) {
      return 'No token information found.';
    }

    const pair = data.pairs[0];
    return `
Token Information:
Name: ${pair.baseToken.name}
Symbol: ${pair.baseToken.symbol}
Network: ${pair.chainId}
Contract: ${pair.baseToken.address}
Price: $${pair.priceUsd}
24h Volume: $${pair.volume.h24}
Market Cap: $${pair.fdv}
Liquidity: $${pair.liquidity.usd}
Note: Always conduct thorough research before investing. Low liquidity and market cap may indicate higher risk.
    `.trim();
  } catch (error) {
    console.error('Error fetching token profile:', error);
    return 'Error fetching token profile';
  }
}

export async function getPairInfo(chainId: string, pairId: string): Promise<string> {
  try {
    const response = await fetch(`${DEXSCREENER_API_BASE}/pairs/${chainId}/${pairId}`);
    const data = await response.json();
    
    if (!data || !data.pair) {
      return 'No pair information found.';
    }

    const pair = data.pair;
    return `
Pair Information:
Chain: ${pair.chainId}
DEX: ${pair.dexId}
Base Token: ${pair.baseToken.name} (${pair.baseToken.symbol})
Quote Token: ${pair.quoteToken.name} (${pair.quoteToken.symbol})
Price: $${pair.priceUsd}
Liquidity: $${pair.liquidity.usd}
Volume 24h: $${pair.volume.h24}
Market Cap: $${pair.fdv}
Note: Always conduct thorough research before investing. Low liquidity and market cap may indicate higher risk.
    `.trim();
  } catch (error) {
    console.error('Error fetching pair info:', error);
    return 'Error fetching pair info';
  }
}

export async function getTokenOrders(chainId: string, tokenAddress: string): Promise<string> {
  try {
    const response = await fetch(`${DEXSCREENER_API_BASE}/tokens/${chainId}/${tokenAddress}`);
    const data = await response.json();
    
    if (!data || !data.pairs || data.pairs.length === 0) {
      return 'No token orders found.';
    }

    const pair = data.pairs[0];
    return `
Token Orders:
Symbol: ${pair.baseToken.symbol}
Price: $${pair.priceUsd}
24h Volume: $${pair.volume.h24}
Liquidity: $${pair.liquidity.usd}
Market Cap: $${pair.fdv}
Note: Always conduct thorough research before investing. Low liquidity and market cap may indicate higher risk.
    `.trim();
  } catch (error) {
    console.error('Error fetching token orders:', error);
    return 'Error fetching token orders';
  }
}

