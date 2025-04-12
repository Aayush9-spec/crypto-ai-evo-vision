
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BrainCircuitIcon, ChartBarIcon, TrendingUpIcon } from "lucide-react";

const sentimentData = [
  {
    asset: "BTC",
    sentiment: "bullish",
    confidence: 78,
    source: "Social Media Analysis",
    change: "+5.2%",
  },
  {
    asset: "ETH",
    sentiment: "bullish",
    confidence: 65,
    source: "News Sentiment",
    change: "+3.7%",
  },
  {
    asset: "SOL",
    sentiment: "neutral",
    confidence: 52,
    source: "Technical Indicators",
    change: "+0.3%",
  },
  {
    asset: "ADA",
    sentiment: "bearish",
    confidence: 61,
    source: "On-Chain Analysis",
    change: "-2.1%",
  },
];

const trendData = [
  "Growing institutional adoption for Bitcoin",
  "Ethereum layer-2 solutions gaining traction",
  "Increasing regulatory clarity in major markets",
  "DeFi TVL recovering after recent market correction",
];

const AIInsights = () => {
  return (
    <Card className="crypto-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuitIcon className="h-5 w-5 text-primary" />
          AI Market Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sentiment">
          <TabsList className="mb-4 bg-secondary/50">
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment">
            <div className="space-y-3">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md bg-secondary/30 border border-border/20">
                  <div className="flex items-center space-x-3">
                    <div className="font-mono font-semibold text-white">{item.asset}</div>
                    <Badge variant={
                      item.sentiment === "bullish" 
                        ? "default" 
                        : item.sentiment === "bearish" 
                          ? "destructive" 
                          : "secondary"
                    }>
                      {item.sentiment}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-secondary rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          item.confidence > 70 
                            ? "bg-crypto-up" 
                            : item.confidence > 50 
                              ? "bg-crypto-highlight" 
                              : "bg-crypto-down"
                        }`}
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Based on 24h analysis of social media, news, and on-chain data</p>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="space-y-3">
              {trendData.map((trend, index) => (
                <div key={index} className="flex items-start p-3 rounded-md bg-secondary/30 border border-border/20">
                  <TrendingUpIcon className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <p className="text-sm">{trend}</p>
                </div>
              ))}
              <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-primary mr-3" />
                  <p className="text-sm font-medium">AI Prediction: Market volatility expected to decrease in the next 48h</p>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Confidence: 71% • Based on historical patterns and current market conditions</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
