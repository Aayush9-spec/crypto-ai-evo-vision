
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoAssets, fetchHistoricalData, CryptoAsset, HistoricalPrice } from "@/utils/cryptoApi";
import { format, parseISO } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Default crypto symbols to display with fallback logos
const defaultCryptos = {
  BTC: {
    name: "Bitcoin",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    color: "#f7931a"
  },
  ETH: {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "#627eea"
  },
  SOL: {
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    color: "#00ffbd"
  },
  ADA: {
    name: "Cardano",
    logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    color: "#0033ad"
  },
  BNB: {
    name: "BNB",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    color: "#f3ba2f"
  }
};

interface ChartData {
  date: string;
  price: number;
}

const PriceChart = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "1Y">("1M");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  
  // Fetch available crypto assets
  const { 
    data: cryptoAssets, 
    isLoading: isLoadingAssets,
    refetch: refetchAssets 
  } = useQuery({
    queryKey: ['cryptoAssets'],
    queryFn: fetchCryptoAssets,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  // Map API timeframes to UI timeframes
  const getApiTimeframe = () => {
    switch(timeframe) {
      case "1W": return "1HRS";
      case "1M": return "1DAY";
      case "1Y": return "1DAY"; 
      default: return "1DAY";
    }
  };
  
  // Fetch historical data for selected crypto
  const {
    data: historicalData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['historicalData', selectedCrypto, getApiTimeframe()],
    queryFn: () => fetchHistoricalData(selectedCrypto, getApiTimeframe() as any),
    enabled: !!selectedCrypto,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  const isLoading = isLoadingAssets || isLoadingHistory;
  
  // Format data for chart
  const chartData = historicalData?.map(item => ({
    date: format(parseISO(item.time_period_start), timeframe === "1W" ? "HH:mm" : "MMM dd"),
    price: item.rate_close
  })).reverse() || [];
  
  // Get current crypto information
  const currentCrypto = cryptoAssets?.find(crypto => crypto.asset_id === selectedCrypto);
  const fallbackCrypto = defaultCryptos[selectedCrypto as keyof typeof defaultCryptos];
  
  // Calculate price change
  const isPriceUp = chartData.length > 1 ? 
    chartData[chartData.length - 1].price > chartData[0].price : 
    (currentCrypto?.change_24h || 0) > 0;
  
  const currentPrice = currentCrypto?.price_usd || 0;
  const percentageChange = currentCrypto?.change_24h || 
    (chartData.length > 1 ? 
      ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100 : 
      0);
  
  // Handle refresh
  const handleRefresh = () => {
    refetchAssets();
    refetchHistory();
    toast({
      title: "Chart updated",
      description: "Latest market data loaded"
    });
  };
  
  // Get cryptos to display in dropdown
  const availableCryptos = isLoadingAssets ? 
    Object.entries(defaultCryptos).map(([id, data]) => ({ 
      asset_id: id, 
      name: data.name, 
      logo_url: data.logo 
    })) : 
    cryptoAssets || [];
  
  // Setup chart config
  const chartConfig = {
    price: {
      label: "Price",
      theme: {
        light: currentCrypto?.change_24h && currentCrypto?.change_24h > 0 ? "#10b981" : "#ef4444",
        dark: currentCrypto?.change_24h && currentCrypto?.change_24h > 0 ? "#10b981" : "#ef4444"
      }
    }
  };
  
  return (
    <Card className="crypto-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {availableCryptos.map((crypto: any) => (
                  <SelectItem key={crypto.asset_id} value={crypto.asset_id}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={crypto.logo_url || defaultCryptos[crypto.asset_id as keyof typeof defaultCryptos]?.logo || "https://placeholder.co/32"} 
                        alt={crypto.name} 
                        className="w-5 h-5"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://placeholder.co/32";
                        }} 
                      />
                      {crypto.name} ({crypto.asset_id})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardTitle className="flex items-center gap-2">
            <img 
              src={currentCrypto?.logo_url || fallbackCrypto?.logo || "https://placeholder.co/32"} 
              alt={currentCrypto?.name || fallbackCrypto?.name} 
              className="w-6 h-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placeholder.co/32";
              }}
            />
            {currentCrypto?.name || fallbackCrypto?.name} ({selectedCrypto})
          </CardTitle>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-semibold">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: currentPrice > 1 ? 2 : 6 })}</span>
            <div className={`flex items-center text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
              {isPriceUp ? <ArrowUpIcon className="h-3 w-3 mr-0.5" /> : <ArrowDownIcon className="h-3 w-3 mr-0.5" />}
              {Math.abs(percentageChange).toFixed(2)}%
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={setTimeframe as any} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Advanced View
            </Button>
          </div>
          
          {isLoading ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id={`colorPrice${isPriceUp ? 'Up' : 'Down'}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPriceUp ? "#10b981" : "#ef4444"}
                      stopOpacity={0.3} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPriceUp ? "#10b981" : "#ef4444"} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  axisLine={{ stroke: '#374151', opacity: 0.2 }}
                  tickLine={{ stroke: '#374151', opacity: 0.2 }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  domain={['auto', 'auto']} 
                  axisLine={{ stroke: '#374151', opacity: 0.2 }}
                  tickLine={{ stroke: '#374151', opacity: 0.2 }}
                  tickFormatter={(tick) => `$${tick.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPriceUp ? "#10b981" : "#ef4444"}
                  fill={`url(#colorPrice${isPriceUp ? 'Up' : 'Down'})`} 
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="crypto-card p-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-mono font-medium">${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: payload[0].value > 1 ? 2 : 6 })}</p>
      </div>
    );
  }
  return null;
};

export default PriceChart;
