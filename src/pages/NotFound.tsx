
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-6 max-w-md crypto-card">
        <h1 className="text-6xl font-mono font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-4">
          This page doesn't exist in the crypto universe
        </p>
        <div className="flex justify-center">
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={() => window.location.href = "/"}
          >
            <HomeIcon className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
