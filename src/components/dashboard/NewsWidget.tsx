
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ExternalLinkIcon } from "lucide-react";

const newsData = [
  {
    title: "Bitcoin Breaks Record High Above $70,000 as Institutional Interest Surges",
    source: "CryptoNews",
    date: "Apr 12, 2025",
    category: "Bitcoin",
    url: "#",
  },
  {
    title: "ETH 2.0 Upgrade to Unlock New Scaling Solutions",
    source: "Blockchain Daily",
    date: "Apr 11, 2025",
    category: "Ethereum",
    url: "#",
  },
  {
    title: "US Regulators Announce New Framework for Crypto Assets",
    source: "Finance Today",
    date: "Apr 10, 2025",
    category: "Regulation",
    url: "#",
  },
  {
    title: "Major Bank Adds Bitcoin to Balance Sheet in $200M Purchase",
    source: "Market Watch",
    date: "Apr 9, 2025",
    category: "Adoption",
    url: "#",
  },
];

const NewsWidget = () => {
  return (
    <Card className="crypto-card">
      <CardHeader className="pb-3">
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsData.map((news, index) => (
            <div key={index} className="border-b border-border/20 pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium mb-1 hover:text-primary transition-colors">
                <a href={news.url} className="flex items-start">
                  {news.title} <ExternalLinkIcon className="h-3 w-3 ml-1 flex-shrink-0 mt-1" />
                </a>
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>{news.source}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {news.date}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-secondary/50 hover:bg-secondary">
                  {news.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 text-xs">
          View All News
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
