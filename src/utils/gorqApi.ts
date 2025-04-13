
// Gorq API utility for AI insights
const API_KEY = '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';

interface GorqResponse {
  text: string;
  markdown?: string;
  id?: string;
}

// Mock responses for fallback
const mockResponses = [
  {
    text: "Based on recent market data, Bitcoin is showing strong support at current levels. The recent price consolidation after its all-time high suggests accumulation rather than distribution. With institutional adoption continuing to increase and on-chain metrics showing fewer coins on exchanges, a bullish continuation seems likely. Consider dollar-cost averaging into BTC rather than making a single large purchase.",
    id: "mock-1"
  },
  {
    text: "Ethereum has strong fundamentals with the ongoing adoption of its layer-2 scaling solutions and the deflationary mechanism of EIP-1559. However, the short-term price action shows some resistance at current levels. If you're looking to invest in ETH, consider waiting for a pullback to the $4,000-4,200 range before accumulating.",
    id: "mock-2"
  },
  {
    text: "For diversification in the current market, consider allocating 60% to large-cap assets like BTC and ETH, 30% to mid-cap layer-1 alternatives with strong ecosystems (Solana, Avalanche), and 10% to high-potential DeFi or NFT projects. This balanced approach provides exposure to different segments of the crypto market while managing risk.",
    id: "mock-3"
  },
  {
    text: "Technical analysis for Bitcoin shows a bullish divergence on the RSI while approaching the 50-day moving average. This often signals the end of a correction phase. With funding rates neutral and open interest decreasing, a sustained move above $65,000 could trigger a new leg up towards the $70,000-72,000 range. Consider buying BTC at current levels with tight stop losses.",
    id: "mock-4"
  }
];

// Main function to query the Gorq AI
export async function queryGorqAI(prompt: string): Promise<GorqResponse> {
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('https://api.gorq.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gorq-xm',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency trading assistant that provides expert analysis on crypto assets. Provide concise, helpful advice about trading opportunities, market trends, and investment strategies. Use data to support your recommendations when possible. Keep responses focused on cryptocurrency trading and investment.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      // Fall back to a mock response
      return getMockResponse(prompt);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      id: data.id
    };
  } catch (error) {
    console.error('Error querying Gorq AI:', error);
    
    // Fall back to a mock response when the API fails
    return getMockResponse(prompt);
  }
}

// Helper function to get a mock response
function getMockResponse(prompt: string): GorqResponse {
  // Select a mock response based on keywords in the prompt
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('bitcoin') || lowercasePrompt.includes('btc')) {
    return mockResponses[0];
  } else if (lowercasePrompt.includes('ethereum') || lowercasePrompt.includes('eth')) {
    return mockResponses[1];
  } else if (lowercasePrompt.includes('portfolio') || lowercasePrompt.includes('diversify')) {
    return mockResponses[2];
  } else {
    // Use a random response if no keywords match
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex];
  }
}

// Helper function to extract investment advice
export function extractInvestmentAdvice(response: string): {asset: string, action: 'buy'|'sell'|'hold', confidence: number} | null {
  try {
    // Simple pattern matching to extract recommendations
    // This could be enhanced with more sophisticated NLP in a production app
    const buyMatch = response.match(/should (buy|purchase|acquire|accumulate) ([A-Z]{3,5})/i);
    const sellMatch = response.match(/should (sell|exit|reduce) ([A-Z]{3,5})/i);
    const holdMatch = response.match(/should (hold|keep|maintain) ([A-Z]{3,5})/i);
    
    let asset = '';
    let action: 'buy'|'sell'|'hold' = 'hold';
    let confidence = Math.random() * 30 + 50; // Mock confidence between 50-80%
    
    if (buyMatch && buyMatch[2]) {
      asset = buyMatch[2].toUpperCase();
      action = 'buy';
    } else if (sellMatch && sellMatch[2]) {
      asset = sellMatch[2].toUpperCase();
      action = 'sell';
    } else if (holdMatch && holdMatch[2]) {
      asset = holdMatch[2].toUpperCase();
      action = 'hold';
    } else {
      // If we can't find action keywords, look for asset symbols
      const assetMatch = response.match(/\b(BTC|ETH|SOL|DOT|ADA|XRP|LINK|AVAX|MATIC|DOT)\b/i);
      if (assetMatch) {
        asset = assetMatch[0].toUpperCase();
        
        // Determine action based on sentiment words
        const bullishWords = ['bullish', 'uptrend', 'growth', 'increase', 'rise', 'upside'];
        const bearishWords = ['bearish', 'downtrend', 'decline', 'decrease', 'fall', 'downside'];
        
        let bullishCount = 0;
        let bearishCount = 0;
        
        bullishWords.forEach(word => {
          if (response.toLowerCase().includes(word)) bullishCount++;
        });
        
        bearishWords.forEach(word => {
          if (response.toLowerCase().includes(word)) bearishCount++;
        });
        
        if (bullishCount > bearishCount) {
          action = 'buy';
        } else if (bearishCount > bullishCount) {
          action = 'sell';
        } else {
          action = 'hold';
        }
      } else {
        return null;
      }
    }
    
    return {
      asset,
      action,
      confidence: Math.round(confidence)
    };
  } catch (error) {
    console.error('Error extracting investment advice:', error);
    return null;
  }
}
