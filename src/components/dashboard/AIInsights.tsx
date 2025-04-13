
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BrainCircuitIcon, ChartBarIcon, TrendingUpIcon, MicIcon, SendIcon, Loader2Icon } from "lucide-react";
import { queryGorqAI, extractInvestmentAdvice } from "@/utils/gorqApi";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

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

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  investment?: {
    asset: string;
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
  } | null;
}

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState("sentiment");
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice recognition
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening,
    hasRecognitionSupport 
  } = useSpeechRecognition();

  // Set transcript as query when speech recognition completes
  useEffect(() => {
    if (transcript && !isListening) {
      setQuery(transcript);
      // Auto submit if we have a transcript and enough characters
      if (transcript.length > 5) {
        handleSubmit(transcript);
      }
    }
  }, [transcript, isListening]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (text = query) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuery('');
    
    try {
      // Get response from Gorq AI
      const response = await queryGorqAI(text);
      const investmentAdvice = extractInvestmentAdvice(response.text);
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: response.id || `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.text,
        timestamp: new Date(),
        investment: investmentAdvice
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error querying AI:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "Sorry, I'm having trouble analyzing that request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="crypto-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuitIcon className="h-5 w-5 text-primary" />
              AI Market Insights
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="ml-auto"
              onClick={() => setIsChatOpen(true)}
            >
              Ask AI Assistant
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sentiment" onValueChange={setActiveTab} value={activeTab}>
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
      
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BrainCircuitIcon className="h-5 w-5 text-primary" />
              AI Crypto Assistant
            </DialogTitle>
            <DialogDescription>
              Ask questions about market analysis, trading strategies, or specific cryptocurrencies.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[400px]">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <BrainCircuitIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Ask me about cryptocurrency investments, market trends, or trading strategies.</p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {["Should I buy Bitcoin now?", "What's your analysis on Ethereum?", "Which crypto has the best growth potential?"].map((suggestion) => (
                    <Button 
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="text-left"
                      onClick={() => {
                        setQuery(suggestion);
                        handleSubmit(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary/40 border border-border/30'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.investment && (
                      <div className="mt-2 pt-2 border-t border-border/30">
                        <div className="flex items-center justify-between">
                          <Badge variant={
                            msg.investment.action === "buy" 
                              ? "default" 
                              : msg.investment.action === "sell" 
                                ? "destructive" 
                                : "secondary"
                          }>
                            {msg.investment.action.toUpperCase()} {msg.investment.asset}
                          </Badge>
                          <span className="text-xs">
                            Confidence: {msg.investment.confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t pt-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex gap-2"
            >
              <Input 
                placeholder="Ask about crypto markets or investments..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              {hasRecognitionSupport && (
                <Button 
                  type="button"
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  onClick={() => isListening ? stopListening() : startListening()}
                  disabled={isLoading}
                  className={isListening ? "animate-pulse bg-primary" : ""}
                >
                  <MicIcon className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" size="icon" disabled={!query.trim() || isLoading}>
                {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIInsights;
