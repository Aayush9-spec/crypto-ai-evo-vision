
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for multiple cryptocurrencies
const cryptoData = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    color: "#f7931a",
    data: [
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
    ]
  },
  ethereum: {
    name: "Ethereum",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "#627eea",
    data: [
      { name: "Apr 1", price: 3145 },
      { name: "Apr 2", price: 3198 },
      { name: "Apr 3", price: 3256 },
      { name: "Apr 4", price: 3301 },
      { name: "Apr 5", price: 3275 },
      { name: "Apr 6", price: 3290 },
      { name: "Apr 7", price: 3350 },
      { name: "Apr 8", price: 3410 },
      { name: "Apr 9", price: 3380 },
      { name: "Apr 10", price: 3450 },
      { name: "Apr 11", price: 3520 },
      { name: "Apr 12", price: 3480 },
    ]
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    color: "#00ffbd",
    data: [
      { name: "Apr 1", price: 120 },
      { name: "Apr 2", price: 125 },
      { name: "Apr 3", price: 128 },
      { name: "Apr 4", price: 130 },
      { name: "Apr 5", price: 127 },
      { name: "Apr 6", price: 135 },
      { name: "Apr 7", price: 140 },
      { name: "Apr 8", price: 143 },
      { name: "Apr 9", price: 138 },
      { name: "Apr 10", price: 145 },
      { name: "Apr 11", price: 150 },
      { name: "Apr 12", price: 147 },
    ]
  },
  cardano: {
    name: "Cardano",
    symbol: "ADA",
    logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    color: "#0033ad",
    data: [
      { name: "Apr 1", price: 0.39 },
      { name: "Apr 2", price: 0.40 },
      { name: "Apr 3", price: 0.41 },
      { name: "Apr 4", price: 0.42 },
      { name: "Apr 5", price: 0.41 },
      { name: "Apr 6", price: 0.43 },
      { name: "Apr 7", price: 0.44 },
      { name: "Apr 8", price: 0.45 },
      { name: "Apr 9", price: 0.44 },
      { name: "Apr 10", price: 0.46 },
      { name: "Apr 11", price: 0.47 },
      { name: "Apr 12", price: 0.46 },
    ]
  },
  bnb: {
    name: "BNB",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    color: "#f3ba2f",
    data: [
      { name: "Apr 1", price: 510 },
      { name: "Apr 2", price: 515 },
      { name: "Apr 3", price: 525 },
      { name: "Apr 4", price: 530 },
      { name: "Apr 5", price: 525 },
      { name: "Apr 6", price: 520 },
      { name: "Apr 7", price: 535 },
      { name: "Apr 8", price: 540 },
      { name: "Apr 9", price: 535 },
      { name: "Apr 10", price: 545 },
      { name: "Apr 11", price: 550 },
      { name: "Apr 12", price: 545 },
    ]
  }
};

// Generate week and year data for each cryptocurrency
Object.keys(cryptoData).forEach(crypto => {
  cryptoData[crypto].weekData = cryptoData[crypto].data.slice(5);
  cryptoData[crypto].monthData = cryptoData[crypto].data;
  cryptoData[crypto].yearData = [
    ...cryptoData[crypto].data,
    { name: "May 1", price: cryptoData[crypto].data[11].price * (1 + (Math.random() * 0.2 - 0.1)) },
    { name: "Jun 1", price: cryptoData[crypto].data[11].price * (1 + (Math.random() * 0.3 - 0.15)) },
    { name: "Jul 1", price: cryptoData[crypto].data[11].price * (1 + (Math.random() * 0.3 - 0.15)) },
    { name: "Aug 1", price: cryptoData[crypto].data[11].price * (1 + (Math.random() * 0.4 - 0.2)) },
    { name: "Sep 1", price: cryptoData[crypto].data[11].price * (1 + (Math.random() * 0.4 - 0.2)) },
  ];
});

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
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  
  const crypto = cryptoData[selectedCrypto];
  const chartData = timeframe === "1W" ? crypto.weekData : timeframe === "1M" ? crypto.monthData : crypto.yearData;
  
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
          <div className="flex items-center gap-2 mb-4">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(cryptoData).map((crypto) => (
                  <SelectItem key={crypto} value={crypto}>
                    <div className="flex items-center gap-2">
                      <img src={cryptoData[crypto].logo} alt={cryptoData[crypto].name} className="w-5 h-5" />
                      {cryptoData[crypto].name} ({cryptoData[crypto].symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardTitle className="flex items-center gap-2">
            <img src={crypto.logo} alt={crypto.name} className="w-6 h-6" />
            {crypto.name} ({crypto.symbol})
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
            <ChartComponent data={crypto.weekData} isPriceUp={isPriceUp} color={crypto.color} />
          </TabsContent>
          
          <TabsContent value="1M" className="mt-0">
            <ChartComponent data={crypto.monthData} isPriceUp={isPriceUp} color={crypto.color} />
          </TabsContent>
          
          <TabsContent value="1Y" className="mt-0">
            <ChartComponent data={crypto.yearData} isPriceUp={isPriceUp} color={crypto.color} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ChartComponent = ({ data, isPriceUp, color }: { data: any[], isPriceUp: boolean, color: string }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id={`color${isPriceUp ? 'Up' : 'Down'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
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
            stroke={color}
            fill={`url(#color${isPriceUp ? 'Up' : 'Down'})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
