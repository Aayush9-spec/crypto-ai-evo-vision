
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react";

// Mock data
const data = [
  { name: "Apr 1", price: 58964 },
  { name: "Apr 2", price: 59132 },
  { name: "Apr 3", price: 60489 },
  { name: "Apr 4", price: 61802 },
  { name: "Apr 5", price: 62305 },
  { name: "Apr 6", price: 61500 },
  { name: "Apr 7", price: 63200 },
  { name: "Apr 8", price: 64100 },
  { name: "Apr 9", price: 63700 },
  { name: "Apr 10", price: 67250 },
  { name: "Apr 11", price: 71023 },
  { name: "Apr 12", price: 69845 },
];

const weekData = data.slice(5);
const monthData = data;
const yearData = [
  ...data,
  { name: "May 1", price: 72000 },
  { name: "Jun 1", price: 65000 },
  { name: "Jul 1", price: 68000 },
  { name: "Aug 1", price: 63000 },
  { name: "Sep 1", price: 69000 },
];

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
        <p className="text-sm font-mono font-medium">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const PriceChart = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState("1M");
  const [loading, setLoading] = useState(false);
  
  const chartData = timeframe === "1W" ? weekData : timeframe === "1M" ? monthData : yearData;
  
  const isPriceUp = chartData[chartData.length - 1].price > chartData[0].price;
  const currentPrice = chartData[chartData.length - 1].price;
  const startPrice = chartData[0].price;
  const priceDifference = currentPrice - startPrice;
  const percentageChange = ((priceDifference) / startPrice) * 100;
  
  const handleRefresh = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Chart updated",
        description: "Latest market data loaded"
      });
    }, 1000);
  };
  
  return (
    <Card className="crypto-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" className="w-6 h-6" />
            Bitcoin (BTC)
          </CardTitle>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-semibold">${currentPrice.toLocaleString()}</span>
            <div className={`flex items-center text-sm ${isPriceUp ? 'price-up' : 'price-down'}`}>
              {isPriceUp ? <ArrowUpIcon className="h-3 w-3 mr-0.5" /> : <ArrowDownIcon className="h-3 w-3 mr-0.5" />}
              {Math.abs(percentageChange).toFixed(2)}%
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
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
          
          <TabsContent value="1W" className="mt-0">
            <ChartComponent data={weekData} isPriceUp={isPriceUp} />
          </TabsContent>
          
          <TabsContent value="1M" className="mt-0">
            <ChartComponent data={monthData} isPriceUp={isPriceUp} />
          </TabsContent>
          
          <TabsContent value="1Y" className="mt-0">
            <ChartComponent data={yearData} isPriceUp={isPriceUp} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ChartComponent = ({ data, isPriceUp }: { data: any[], isPriceUp: boolean }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis 
            dataKey="name" 
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
            fill={isPriceUp ? "url(#colorUp)" : "url(#colorDown)"} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
