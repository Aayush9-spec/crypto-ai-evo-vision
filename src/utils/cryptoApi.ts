
// CoinMarketCap utilities for fetching cryptocurrency data
const API_KEY = 'a5063b8f-d446-4f06-9c77-3a03e1ba70a8';
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export interface CryptoAsset {
  asset_id: string;
  name: string;
  price_usd: number;
  volume_1day_usd: number;
  market_cap_usd: number;
  change_24h?: number;
  logo_url?: string;
}

export interface HistoricalPrice {
  time_period_start: string;
  rate_open: number;
  rate_high: number;
  rate_low: number;
  rate_close: number;
}

export interface MarketIndicator {
  asset_id: string;
  name: string;
  rsi?: number;
  macd?: number;
  macd_signal?: number;
  bollinger_upper?: number;
  bollinger_middle?: number;
  bollinger_lower?: number;
  volume_24h: number;
  price_usd: number;
  change_24h: number;
  logo_url?: string;
}

// Helper to map CoinMarketCap data to our internal format
const mapCMCDataToAsset = (cmcData: any): CryptoAsset => ({
  asset_id: cmcData.symbol,
  name: cmcData.name,
  price_usd: cmcData.quote.USD.price,
  volume_1day_usd: cmcData.quote.USD.volume_24h,
  market_cap_usd: cmcData.quote.USD.market_cap,
  change_24h: cmcData.quote.USD.percent_change_24h,
  logo_url: `https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcData.id}.png`
});

export const fetchCryptoAssets = async (): Promise<CryptoAsset[]> => {
  try {
    const response = await fetch(`${BASE_URL}/cryptocurrency/listings/latest?limit=20`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.map(mapCMCDataToAsset);
  } catch (error) {
    console.error('Error fetching crypto assets:', error);
    // Return mock data if API fails (for development purposes)
    return generateMockAssets();
  }
};

// Generate mock data when API fails
const generateMockAssets = (): CryptoAsset[] => {
  const mockCoins = [
    { symbol: 'BTC', name: 'Bitcoin', price: 65000, volume: 30000000000, marketCap: 1200000000000, change: 2.5 },
    { symbol: 'ETH', name: 'Ethereum', price: 3500, volume: 15000000000, marketCap: 420000000000, change: 1.2 },
    { symbol: 'BNB', name: 'Binance Coin', price: 580, volume: 2000000000, marketCap: 90000000000, change: -0.8 },
    { symbol: 'SOL', name: 'Solana', price: 150, volume: 5000000000, marketCap: 60000000000, change: 3.7 },
    { symbol: 'ADA', name: 'Cardano', price: 0.48, volume: 1000000000, marketCap: 17000000000, change: -1.2 },
    { symbol: 'XRP', name: 'XRP', price: 0.57, volume: 3500000000, marketCap: 30000000000, change: 0.5 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.2, volume: 700000000, marketCap: 9000000000, change: -2.1 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.13, volume: 1500000000, marketCap: 18000000000, change: 5.3 },
    { symbol: 'AVAX', name: 'Avalanche', price: 35, volume: 800000000, marketCap: 12500000000, change: 1.9 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.75, volume: 600000000, marketCap: 7500000000, change: 0.3 }
  ];

  return mockCoins.map(coin => ({
    asset_id: coin.symbol,
    name: coin.name,
    price_usd: coin.price,
    volume_1day_usd: coin.volume,
    market_cap_usd: coin.marketCap,
    change_24h: coin.change,
    logo_url: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.symbol.toLowerCase()}.png`
  }));
};

// For historical data we'll use mock data since CoinMarketCap historical requires a higher tier subscription
export const fetchHistoricalData = async (
  assetId: string,
  timeframe: '1DAY' | '1HRS' | '4HRS'
): Promise<HistoricalPrice[]> => {
  try {
    // In a real implementation, we'd fetch from CoinMarketCap's historical endpoint
    // For now, we'll generate mock data
    const now = new Date();
    const data: HistoricalPrice[] = [];
    
    let timeIncrement = 24 * 60 * 60 * 1000; // 1 day in ms
    let dataPoints = 30;
    
    if (timeframe === '1HRS') {
      timeIncrement = 60 * 60 * 1000; // 1 hour
      dataPoints = 24;
    } else if (timeframe === '4HRS') {
      timeIncrement = 4 * 60 * 60 * 1000; // 4 hours
      dataPoints = 42;
    }
    
    // Generate price starting point based on asset ID
    const seed = assetId.charCodeAt(0) + assetId.charCodeAt(1);
    let basePrice = (seed % 1000) + 50;
    
    if (assetId === 'BTC') basePrice = 65000;
    if (assetId === 'ETH') basePrice = 3500;
    
    for (let i = dataPoints; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * timeIncrement));
      const volatility = 0.03; // 3% volatility
      
      // Generate price with some randomness but trending
      const trend = Math.sin(i / 5) * volatility * basePrice;
      const noise = (Math.random() - 0.5) * volatility * basePrice;
      
      const open = basePrice + trend + noise;
      const high = open * (1 + Math.random() * 0.02);
      const low = open * (1 - Math.random() * 0.02);
      const close = (open + high + low) / 3 + (Math.random() - 0.5) * 0.01 * basePrice;
      
      data.push({
        time_period_start: timestamp.toISOString(),
        rate_open: open,
        rate_high: high,
        rate_low: low,
        rate_close: close
      });
      
      // Update base price for next iteration to create a somewhat realistic price movement
      basePrice = close;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching historical data for ${assetId}:`, error);
    return [];
  }
};

const calculateRSI = (prices: number[], periods = 14): number => {
  if (prices.length < periods) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - periods; i < prices.length - 1; i++) {
    const difference = prices[i + 1] - prices[i];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }
  
  if (losses === 0) return 100;
  
  const avgGain = gains / periods;
  const avgLoss = losses / periods;
  const rs = avgGain / avgLoss;
  
  return 100 - (100 / (1 + rs));
};

const calculateMACD = (prices: number[]): { macd: number; signal: number } => {
  if (prices.length < 26) return { macd: 0, signal: 0 };
  
  const ema12 = prices.slice(-12).reduce((sum, price) => sum + price, 0) / 12;
  const ema26 = prices.slice(-26).reduce((sum, price) => sum + price, 0) / 26;
  
  const macd = ema12 - ema26;
  const signal = prices.slice(-9).reduce((sum, price) => sum + price, 0) / 9;
  
  return { macd, signal };
};

const calculateBollingerBands = (prices: number[], periods = 20): { upper: number; middle: number; lower: number } => {
  if (prices.length < periods) {
    return { upper: prices[prices.length - 1] * 1.05, middle: prices[prices.length - 1], lower: prices[prices.length - 1] * 0.95 };
  }
  
  const recentPrices = prices.slice(-periods);
  const ma = recentPrices.reduce((sum, price) => sum + price, 0) / periods;
  
  const squaredDiffs = recentPrices.map(price => Math.pow(price - ma, 2));
  const stdDev = Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / periods);
  
  return {
    upper: ma + (2 * stdDev),
    middle: ma,
    lower: ma - (2 * stdDev)
  };
};

export const fetchMarketIndicators = async (): Promise<MarketIndicator[]> => {
  try {
    const assets = await fetchCryptoAssets();
    const indicators: MarketIndicator[] = [];
    
    for (const asset of assets.slice(0, 15)) {
      try {
        const historicalData = await fetchHistoricalData(asset.asset_id, '1DAY');
        
        if (historicalData && historicalData.length > 0) {
          const closingPrices = historicalData.map(data => data.rate_close);
          
          const rsi = calculateRSI(closingPrices);
          const { macd, signal } = calculateMACD(closingPrices);
          const { upper, middle, lower } = calculateBollingerBands(closingPrices);
          
          indicators.push({
            asset_id: asset.asset_id,
            name: asset.name,
            rsi,
            macd,
            macd_signal: signal,
            bollinger_upper: upper,
            bollinger_middle: middle,
            bollinger_lower: lower,
            volume_24h: asset.volume_1day_usd,
            price_usd: asset.price_usd,
            change_24h: asset.change_24h || 0,
            logo_url: asset.logo_url
          });
        }
      } catch (error) {
        console.error(`Error fetching indicators for ${asset.asset_id}:`, error);
        indicators.push({
          asset_id: asset.asset_id,
          name: asset.name,
          volume_24h: asset.volume_1day_usd,
          price_usd: asset.price_usd,
          change_24h: asset.change_24h || 0,
          logo_url: asset.logo_url
        });
      }
    }
    
    return indicators;
  } catch (error) {
    console.error('Error fetching market indicators:', error);
    throw error;
  }
};

export const fetchIndicatorHistory = async (
  assetId: string,
  indicator: 'rsi' | 'macd' | 'bollinger',
  timeframe: '1DAY' | '1HRS' | '4HRS' = '1DAY'
): Promise<{ time: string; value: number; signal?: number; upper?: number; lower?: number; }[]> => {
  try {
    const historicalData = await fetchHistoricalData(assetId, timeframe);
    
    if (!historicalData || historicalData.length === 0) {
      return [];
    }
    
    const closingPrices = historicalData.map(data => data.rate_close);
    
    switch (indicator) {
      case 'rsi': {
        return historicalData.map((data, index) => {
          const prices = closingPrices.slice(0, index + 1);
          return {
            time: data.time_period_start,
            value: prices.length >= 14 ? calculateRSI(prices) : 50
          };
        }).filter((_, i) => i >= 14);
      }
      case 'macd': {
        return historicalData.map((data, index) => {
          const prices = closingPrices.slice(0, index + 1);
          const { macd, signal } = prices.length >= 26 ? calculateMACD(prices) : { macd: 0, signal: 0 };
          return {
            time: data.time_period_start,
            value: macd,
            signal
          };
        }).filter((_, i) => i >= 26);
      }
      case 'bollinger': {
        return historicalData.map((data, index) => {
          const prices = closingPrices.slice(0, index + 1);
          const { upper, middle, lower } = prices.length >= 20 ? 
            calculateBollingerBands(prices) : 
            { upper: data.rate_close * 1.05, middle: data.rate_close, lower: data.rate_close * 0.95 };
          return {
            time: data.time_period_start,
            value: middle,
            upper,
            lower
          };
        }).filter((_, i) => i >= 20);
      }
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching ${indicator} history for ${assetId}:`, error);
    throw error;
  }
};
