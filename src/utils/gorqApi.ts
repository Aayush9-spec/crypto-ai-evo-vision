
// Gorq API utility for AI insights
const API_KEY = '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';

interface GorqResponse {
  text: string;
  markdown?: string;
  id?: string;
}

// Main function to query the Gorq AI
export async function queryGorqAI(prompt: string): Promise<GorqResponse> {
  try {
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
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      id: data.id
    };
  } catch (error) {
    console.error('Error querying Gorq AI:', error);
    return {
      text: "I'm having trouble connecting to my analysis engine. Please try again in a moment."
    };
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
      return null;
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
