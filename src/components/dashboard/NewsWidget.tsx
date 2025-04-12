
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ExternalLinkIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

// Define the type for news articles from the API
interface NewsArticle {
  title: string;
  source: string;
  published_at: string;
  url: string;
  category?: string;
}

const API_KEY = "801067da0a5f0dafecd1fbea024a3724";

const NewsWidget = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://api.mediastack.com/v1/news?access_key=${API_KEY}&keywords=cryptocurrency,bitcoin,ethereum&limit=4&sort=published_desc`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const formattedNews = data.data.map((item: any) => ({
            title: item.title,
            source: item.source,
            published_at: item.published_at,
            url: item.url,
            category: getCategoryFromKeywords(item.title),
          }));
          setNews(formattedNews);
        } else {
          // Fallback to dummy data if API doesn't return expected format
          setNews(fallbackNewsData);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Using fallback data.");
        setNews(fallbackNewsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Helper function to determine category based on article title
  const getCategoryFromKeywords = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("bitcoin") || lowerTitle.includes("btc")) return "Bitcoin";
    if (lowerTitle.includes("ethereum") || lowerTitle.includes("eth")) return "Ethereum";
    if (lowerTitle.includes("regulation") || lowerTitle.includes("law")) return "Regulation";
    if (lowerTitle.includes("adoption")) return "Adoption";
    return "Crypto";
  };

  // Format date from API to readable format
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <Card className="crypto-card">
      <CardHeader className="pb-3">
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((article, index) => (
              <div key={index} className="border-b border-border/20 pb-3 last:border-0 last:pb-0">
                <h4 className="font-medium mb-1 hover:text-primary transition-colors">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start">
                    {article.title} <ExternalLinkIcon className="h-3 w-3 ml-1 flex-shrink-0 mt-1" />
                  </a>
                </h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span>{article.source}</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(article.published_at)}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-secondary/50 hover:bg-secondary">
                    {article.category || "Crypto"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full mt-4 text-xs"
          onClick={() => window.open("/news", "_self")}
        >
          View All News
        </Button>
      </CardContent>
    </Card>
  );
};

// Fallback news data in case the API fails
const fallbackNewsData = [
  {
    title: "Bitcoin Breaks Record High Above $70,000 as Institutional Interest Surges",
    source: "CryptoNews",
    published_at: "2025-04-12T10:30:00Z",
    url: "#",
    category: "Bitcoin",
  },
  {
    title: "ETH 2.0 Upgrade to Unlock New Scaling Solutions",
    source: "Blockchain Daily",
    published_at: "2025-04-11T14:15:00Z",
    url: "#",
    category: "Ethereum",
  },
  {
    title: "US Regulators Announce New Framework for Crypto Assets",
    source: "Finance Today",
    published_at: "2025-04-10T08:45:00Z",
    url: "#",
    category: "Regulation",
  },
  {
    title: "Major Bank Adds Bitcoin to Balance Sheet in $200M Purchase",
    source: "Market Watch",
    published_at: "2025-04-09T16:20:00Z",
    url: "#",
    category: "Adoption",
  },
];

export default NewsWidget;
