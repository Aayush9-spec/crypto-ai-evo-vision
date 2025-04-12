
import MainLayout from "@/components/MainLayout";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ExternalLinkIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsArticle {
  title: string;
  source: string;
  published_at: string;
  url: string;
  category?: string;
  description?: string;
}

const API_KEY = "801067da0a5f0dafecd1fbea024a3724";

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // Using HTTPS and requesting more articles for the full page
        const response = await fetch(
          `https://api.mediastack.com/v1/news?access_key=${API_KEY}&languages=en&limit=12&sort=published_desc`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const formattedNews = data.data.map((item: any) => ({
            title: item.title,
            source: item.source,
            published_at: item.published_at,
            url: item.url,
            description: item.description,
            category: getCategoryFromKeywords(item.title),
          }));
          setNews(formattedNews);
        } else {
          console.log("Using fallback data due to unexpected API response format:", data);
          setError("API returned unexpected format. Using fallback data.");
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
    if (lowerTitle.includes("business") || lowerTitle.includes("economy") || lowerTitle.includes("market")) return "Business";
    if (lowerTitle.includes("tech") || lowerTitle.includes("technology") || lowerTitle.includes("digital")) return "Technology";
    if (lowerTitle.includes("politics") || lowerTitle.includes("government") || lowerTitle.includes("election")) return "Politics";
    if (lowerTitle.includes("health") || lowerTitle.includes("medical") || lowerTitle.includes("covid")) return "Health";
    if (lowerTitle.includes("sport") || lowerTitle.includes("football") || lowerTitle.includes("olympic")) return "Sports";
    return "General";
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
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Latest News</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-lg text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start">
                      {article.title} <ExternalLinkIcon className="h-4 w-4 ml-1 flex-shrink-0 mt-1" />
                    </a>
                  </h3>
                  {article.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{article.source}</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(article.published_at)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-secondary/50 hover:bg-secondary">
                      {article.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

// Fallback news data in case the API fails
const fallbackNewsData = [
  {
    title: "Global Climate Summit Reaches Historic Agreement on Emissions",
    source: "World News Daily",
    published_at: "2025-04-12T10:30:00Z",
    url: "#",
    category: "Politics",
    description: "World leaders have agreed to unprecedented carbon reduction targets after a week of intense negotiations at the Global Climate Summit."
  },
  // ... Add more fallback news items here similar to the NewsWidget component's fallback data
];

export default News;
