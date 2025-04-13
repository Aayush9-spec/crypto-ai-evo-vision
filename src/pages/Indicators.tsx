
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMarketIndicators, fetchIndicatorHistory, MarketIndicator } from "@/utils/cryptoApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ChartContainer } from "@/components/ui/chart";
import MainLayout from "@/components/MainLayout";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  RefreshCw, 
  Search, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  BarChart3, 
  LineChart, 
  Activity, 
  ArrowRightLeft, 
  FilterIcon,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart as RechartsLineChart,
  Line, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { format, parseISO } from "date-fns";

const Indicators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<"rsi" | "macd" | "bollinger">("rsi");
  const [timeframe, setTimeframe] = useState<"1HRS" | "1DAY" | "4HRS">("1DAY");
  const [filteredData, setFilteredData] = useState<MarketIndicator[]>([]);
  const { toast } = useToast();

  // Fetch market indicators
  const { 
    data: indicators,
    isLoading: isLoadingIndicators,
    refetch: refetchIndicators,
    isError: isIndicatorsError
  } = useQuery({
    queryKey: ['marketIndicators'],
    queryFn: fetchMarketIndicators,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter indicators based on search term
  useEffect(() => {
    if (indicators) {
      const filtered = indicators.filter(
        (indicator) =>
          indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          indicator.asset_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
      
      // Set default selected asset if none is selected
      if (!selectedAsset && filtered.length > 0) {
        setSelectedAsset(filtered[0].asset_id);
      }
    }
  }, [indicators, searchTerm, selectedAsset]);

  // Fetch indicator history for selected asset
  const {
    data: indicatorHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['indicatorHistory', selectedAsset, selectedIndicator, timeframe],
    queryFn: () => selectedAsset ? fetchIndicatorHistory(selectedAsset, selectedIndicator, timeframe) : Promise.resolve([]),
    enabled: !!selectedAsset,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle refresh
  const handleRefresh = () => {
    refetchIndicators();
    refetchHistory();
    toast({
      title: "Market indicators refreshed",
      description: "Latest market data loaded"
    });
  };

  // Get selected asset details
  const selectedAssetData = indicators?.find((indicator) => indicator.asset_id === selectedAsset);

  // Formatting functions
  const formatRSI = (value: number) => {
    if (value > 70) return { label: "Overbought", color: "text-red-500", icon: <AlertCircle size={16} /> };
    if (value < 30) return { label: "Oversold", color: "text-green-500", icon: <AlertCircle size={16} /> };
    return { label: "Neutral", color: "text-yellow-500", icon: <ArrowRightLeft size={16} /> };
  };

  const formatMACD = (value: number, signal: number) => {
    if (value > signal) return { label: "Bullish", color: "text-green-500", icon: <TrendingUpIcon size={16} /> };
    if (value < signal) return { label: "Bearish", color: "text-red-500", icon: <TrendingDownIcon size={16} /> };
    return { label: "Neutral", color: "text-yellow-500", icon: <ArrowRightLeft size={16} /> };
  };

  const formatBollinger = (price: number, upper: number, lower: number) => {
    if (price > upper) return { label: "Overbought", color: "text-red-500", icon: <AlertCircle size={16} /> };
    if (price < lower) return { label: "Oversold", color: "text-green-500", icon: <AlertCircle size={16} /> };
    return { label: "Within Bands", color: "text-blue-500", icon: <Check size={16} /> };
  };

  // Chart config based on selected indicator
  const renderChart = () => {
    if (!indicatorHistory || indicatorHistory.length === 0) {
      return (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          {isLoadingHistory ? (
            <RefreshCw className="h-8 w-8 animate-spin" />
          ) : (
            <div>No historical data available</div>
          )}
        </div>
      );
    }

    const chartData = indicatorHistory.map(data => ({
      time: format(parseISO(data.time), timeframe === "1HRS" ? "HH:mm" : "MMM dd"),
      ...data
    }));

    switch(selectedIndicator) {
      case "rsi":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
              <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="RSI" 
                stroke="#8884d8" 
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "macd":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="MACD" 
                stroke="#8884d8" 
                dot={false}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="signal" 
                name="Signal" 
                stroke="#82ca9d" 
                dot={false}
                strokeWidth={2}
              />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "bollinger":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="upper" 
                stroke="#ef4444" 
                fill="#ef444420" 
                name="Upper Band"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Middle Band" 
                stroke="#0ea5e9" 
                dot={false}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="lower" 
                stroke="#10b981" 
                fill="#10b98120" 
                name="Lower Band"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
          <div className="w-full md:w-2/3 space-y-6">
            {/* Chart Card */}
            <Card className="crypto-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedAssetData ? (
                      <>
                        <img 
                          src={selectedAssetData.logo_url || "https://placeholder.co/32"} 
                          alt={selectedAssetData.name} 
                          className="w-6 h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://placeholder.co/32";
                          }}
                        />
                        {selectedAssetData.name} ({selectedAssetData.asset_id})
                      </>
                    ) : isLoadingIndicators ? (
                      <Skeleton className="h-6 w-32" />
                    ) : (
                      "Select an Asset"
                    )}
                  </CardTitle>
                  {selectedAssetData && (
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-mono font-semibold">
                        ${selectedAssetData.price_usd.toLocaleString(undefined, { 
                          maximumFractionDigits: selectedAssetData.price_usd > 1 ? 2 : 6 
                        })}
                      </span>
                      <div className={`flex items-center text-sm ${
                        selectedAssetData.change_24h > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {selectedAssetData.change_24h > 0 ? (
                          <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(selectedAssetData.change_24h).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoadingIndicators}>
                  <RefreshCw className={`h-4 w-4 ${isLoadingIndicators ? "animate-spin" : ""}`} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Select value={selectedIndicator} onValueChange={(value: "rsi" | "macd" | "bollinger") => setSelectedIndicator(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            RSI
                          </div>
                        </SelectItem>
                        <SelectItem value="macd">
                          <div className="flex items-center gap-2">
                            <LineChart className="w-4 h-4" />
                            MACD
                          </div>
                        </SelectItem>
                        <SelectItem value="bollinger">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Bollinger Bands
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={timeframe} onValueChange={(value: "1HRS" | "4HRS" | "1DAY") => setTimeframe(value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1HRS">1 Hour</SelectItem>
                        <SelectItem value="4HRS">4 Hours</SelectItem>
                        <SelectItem value="1DAY">1 Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedIndicator === "rsi" && (
                    <div className="text-sm flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                        <span>Overbought (>70)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        <span>Oversold (<30)</span>
                      </div>
                    </div>
                  )}

                  {selectedIndicator === "macd" && (
                    <div className="text-sm flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                        <span>MACD Line</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        <span>Signal Line</span>
                      </div>
                    </div>
                  )}
                </div>

                {renderChart()}

                {selectedIndicator === "rsi" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      <strong>RSI (Relative Strength Index):</strong> Measures the speed and change of price movements. 
                      Values above 70 indicate overbought conditions, while values below 30 indicate oversold conditions.
                    </p>
                  </div>
                )}

                {selectedIndicator === "macd" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      <strong>MACD (Moving Average Convergence Divergence):</strong> Shows the relationship 
                      between two moving averages. When MACD crosses above the signal line, it's a bullish signal, 
                      and when it crosses below, it's bearish.
                    </p>
                  </div>
                )}

                {selectedIndicator === "bollinger" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      <strong>Bollinger Bands:</strong> Shows price volatility with upper and lower bands. 
                      When price touches the upper band, it may be overbought. 
                      When it touches the lower band, it may be oversold.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-1/3 space-y-6">
            {/* Assets with Indicators */}
            <Card className="crypto-card">
              <CardHeader className="pb-3">
                <CardTitle>Market Indicators</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search"
                    placeholder="Search assets..."
                    className="pl-9 bg-secondary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="rsi" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="rsi">RSI</TabsTrigger>
                    <TabsTrigger value="macd">MACD</TabsTrigger>
                    <TabsTrigger value="bollinger">Bollinger</TabsTrigger>
                  </TabsList>

                  <TabsContent value="rsi" className="pt-4">
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {isLoadingIndicators ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between border-b border-border/20 py-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 rounded-full" />
                              <div>
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-3 w-10" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-10" />
                          </div>
                        ))
                      ) : filteredData.length > 0 ? (
                        filteredData.map((asset) => {
                          const rsiStatus = formatRSI(asset.rsi || 50);
                          return (
                            <div 
                              key={asset.asset_id}
                              className={`flex items-center justify-between border-b border-border/20 py-3 cursor-pointer hover:bg-secondary/20 rounded transition-colors ${
                                selectedAsset === asset.asset_id ? 'bg-secondary/30' : ''
                              }`}
                              onClick={() => setSelectedAsset(asset.asset_id)}
                            >
                              <div className="flex items-center gap-2">
                                <img 
                                  src={asset.logo_url || "https://placeholder.co/32"} 
                                  alt={asset.name} 
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://placeholder.co/32";
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{asset.asset_id}</div>
                                  <div className="text-xs text-muted-foreground">${asset.price_usd.toLocaleString(undefined, { 
                                    maximumFractionDigits: asset.price_usd > 1 ? 2 : 6 
                                  })}</div>
                                </div>
                              </div>
                              <div className={`flex items-center gap-1 ${rsiStatus.color}`}>
                                {rsiStatus.icon}
                                <span className="text-xs">{asset.rsi ? asset.rsi.toFixed(1) : 'N/A'}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          No assets found
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="macd" className="pt-4">
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {isLoadingIndicators ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between border-b border-border/20 py-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 rounded-full" />
                              <div>
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-3 w-10" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-10" />
                          </div>
                        ))
                      ) : filteredData.length > 0 ? (
                        filteredData.map((asset) => {
                          const macdStatus = formatMACD(asset.macd || 0, asset.macd_signal || 0);
                          return (
                            <div 
                              key={asset.asset_id}
                              className={`flex items-center justify-between border-b border-border/20 py-3 cursor-pointer hover:bg-secondary/20 rounded transition-colors ${
                                selectedAsset === asset.asset_id ? 'bg-secondary/30' : ''
                              }`}
                              onClick={() => setSelectedAsset(asset.asset_id)}
                            >
                              <div className="flex items-center gap-2">
                                <img 
                                  src={asset.logo_url || "https://placeholder.co/32"} 
                                  alt={asset.name} 
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://placeholder.co/32";
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{asset.asset_id}</div>
                                  <div className="text-xs text-muted-foreground">${asset.price_usd.toLocaleString(undefined, { 
                                    maximumFractionDigits: asset.price_usd > 1 ? 2 : 6 
                                  })}</div>
                                </div>
                              </div>
                              <div className={`flex items-center gap-1 ${macdStatus.color}`}>
                                {macdStatus.icon}
                                <span className="text-xs">{macdStatus.label}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          No assets found
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="bollinger" className="pt-4">
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {isLoadingIndicators ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between border-b border-border/20 py-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 rounded-full" />
                              <div>
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-3 w-10" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-10" />
                          </div>
                        ))
                      ) : filteredData.length > 0 ? (
                        filteredData.map((asset) => {
                          const bollingerStatus = formatBollinger(
                            asset.price_usd, 
                            asset.bollinger_upper || asset.price_usd * 1.05, 
                            asset.bollinger_lower || asset.price_usd * 0.95
                          );
                          return (
                            <div 
                              key={asset.asset_id}
                              className={`flex items-center justify-between border-b border-border/20 py-3 cursor-pointer hover:bg-secondary/20 rounded transition-colors ${
                                selectedAsset === asset.asset_id ? 'bg-secondary/30' : ''
                              }`}
                              onClick={() => setSelectedAsset(asset.asset_id)}
                            >
                              <div className="flex items-center gap-2">
                                <img 
                                  src={asset.logo_url || "https://placeholder.co/32"} 
                                  alt={asset.name} 
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://placeholder.co/32";
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{asset.asset_id}</div>
                                  <div className="text-xs text-muted-foreground">${asset.price_usd.toLocaleString(undefined, { 
                                    maximumFractionDigits: asset.price_usd > 1 ? 2 : 6 
                                  })}</div>
                                </div>
                              </div>
                              <div className={`flex items-center gap-1 ${bollingerStatus.color}`}>
                                {bollingerStatus.icon}
                                <span className="text-xs">{bollingerStatus.label}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          No assets found
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Indicators;
