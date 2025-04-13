
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDownIcon, ArrowUpIcon, RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoAssets, CryptoAsset } from "@/utils/cryptoApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback logos if API doesn't provide them
const fallbackLogos: Record<string, string> = {
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
  ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
  DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  LINK: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
};

const MarketOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Fetch crypto assets data
  const { 
    data: cryptoAssets, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['cryptoAssets'],
    queryFn: fetchCryptoAssets,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  const filteredCryptos = cryptoAssets?.filter(crypto => 
    crypto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.asset_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Market data refreshed",
      description: "Latest market prices loaded"
    });
  };
  
  return (
    <Card className="crypto-card">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Market Overview</CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search cryptocurrency..."
            className="pl-9 bg-secondary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 max-h-[370px] overflow-y-auto scrollbar-thin pr-2">
          <div className="grid grid-cols-12 py-2 text-xs text-muted-foreground">
            <div className="col-span-5">Asset</div>
            <div className="col-span-3 text-right">Price</div>
            <div className="col-span-2 text-right">24h %</div>
            <div className="col-span-2 text-right">Market Cap</div>
          </div>
          
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 py-2.5 border-t border-border/20">
                <div className="col-span-5 flex items-center space-x-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="py-8 text-center text-muted-foreground">
              Error loading market data. Please try again.
            </div>
          ) : filteredCryptos.length > 0 ? (
            filteredCryptos.map((crypto) => (
              <div 
                key={crypto.asset_id}
                className="grid grid-cols-12 py-2.5 border-t border-border/20 hover:bg-secondary/20 rounded transition-colors"
              >
                <div className="col-span-5 flex items-center space-x-3">
                  <img 
                    src={crypto.logo_url || fallbackLogos[crypto.asset_id] || "https://placeholder.co/32"} 
                    alt={crypto.name} 
                    className="w-6 h-6"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://placeholder.co/32";
                    }}
                  />
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.asset_id}</div>
                  </div>
                </div>
                <div className="col-span-3 text-right font-mono font-medium">
                  ${crypto.price_usd < 1 
                    ? crypto.price_usd.toLocaleString(undefined, { maximumFractionDigits: 6 }) 
                    : crypto.price_usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div 
                  className={`col-span-2 text-right flex items-center justify-end ${
                    crypto.change_24h > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {crypto.change_24h > 0 ? (
                    <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(crypto.change_24h || 0).toFixed(2)}%
                </div>
                <div className="col-span-2 text-right text-muted-foreground">
                  ${crypto.market_cap_usd 
                    ? (crypto.market_cap_usd / 1000000000).toFixed(1) + 'B'
                    : 'N/A'}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No cryptocurrencies found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
