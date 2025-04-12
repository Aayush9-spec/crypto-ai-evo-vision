
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDownIcon, ArrowUpIcon, Search } from "lucide-react";

// Mock data for cryptocurrencies
const cryptoData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    price: 69845,
    change24h: 2.56,
    volume24h: 45832051687,
    marketCap: 1371434590693,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH", 
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    price: 3346.25,
    change24h: 3.21,
    volume24h: 20584239583,
    marketCap: 401498238493,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    price: 147.32,
    change24h: -1.83,
    volume24h: 2543987534,
    marketCap: 65483290543,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    price: 0.452,
    change24h: 1.23,
    volume24h: 354689432,
    marketCap: 16039853245,
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    price: 532.48,
    change24h: -0.72,
    volume24h: 1486324785,
    marketCap: 81065443298,
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    logo: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
    price: 0.5243,
    change24h: -2.17,
    volume24h: 2143587215,
    marketCap: 28743951824,
  },
];

const MarketOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCryptos = cryptoData.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="crypto-card">
      <CardHeader className="pb-3">
        <CardTitle>Market Overview</CardTitle>
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
          
          {filteredCryptos.length > 0 ? (
            filteredCryptos.map((crypto) => (
              <div 
                key={crypto.id}
                className="grid grid-cols-12 py-2.5 border-t border-border/20 hover:bg-secondary/20 rounded transition-colors"
              >
                <div className="col-span-5 flex items-center space-x-3">
                  <img src={crypto.logo} alt={crypto.name} className="w-6 h-6" />
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                  </div>
                </div>
                <div className="col-span-3 text-right font-mono font-medium">
                  ${crypto.price < 1 ? crypto.price.toString() : crypto.price.toLocaleString()}
                </div>
                <div 
                  className={`col-span-2 text-right flex items-center justify-end ${
                    crypto.change24h > 0 ? 'price-up' : 'price-down'
                  }`}
                >
                  {crypto.change24h > 0 ? (
                    <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(crypto.change24h).toFixed(2)}%
                </div>
                <div className="col-span-2 text-right text-muted-foreground">
                  ${(crypto.marketCap / 1000000000).toFixed(1)}B
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
