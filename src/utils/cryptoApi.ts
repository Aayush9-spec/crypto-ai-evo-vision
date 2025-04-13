
// CoinAPI utilities for fetching cryptocurrency data
const API_KEY = 'a5063b8f-d446-4f06-9c77-3a03e1ba70a8';
const BASE_URL = 'https://rest.coinapi.io/v1';

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

export const fetchCryptoAssets = async (): Promise<CryptoAsset[]> => {
  try {
    const response = await fetch(`${BASE_URL}/assets`, {
      headers: {
        'X-CoinAPI-Key': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data
      .filter((asset: any) => asset.price_usd && asset.type_is_crypto === 1)
      .sort((a: any, b: any) => b.market_cap_usd - a.market_cap_usd)
      .slice(0, 20)
      .map((asset: any) => ({
        asset_id: asset.asset_id,
        name: asset.name,
        price_usd: asset.price_usd,
        volume_1day_usd: asset.volume_1day_usd || 0,
        market_cap_usd: asset.market_cap_usd || 0,
        change_24h: asset.price_usd_change_24h || 0,
        logo_url: `https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_32/${asset.id_icon?.toLowerCase()}.png`
      }));
  } catch (error) {
    console.error('Error fetching crypto assets:', error);
    throw error;
  }
};

export const fetchHistoricalData = async (
  assetId: string,
  timeframe: '1DAY' | '1HRS' | '4HRS'
): Promise<HistoricalPrice[]> => {
  try {
    // Define period based on timeframe
    let period_id = '1DAY';
    let limit = 30;
    
    if (timeframe === '1HRS') {
      period_id = '1HRS';
      limit = 24;
    } else if (timeframe === '4HRS') {
      period_id = '4HRS';
      limit = 42;
    } else {
      limit = 30; // 1 month for daily data
    }
    
    const response = await fetch(
      `${BASE_URL}/ohlcv/${assetId}/USD/history?period_id=${period_id}&limit=${limit}`, 
      {
        headers: {
          'X-CoinAPI-Key': API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching historical data for ${assetId}:`, error);
    throw error;
  }
};
