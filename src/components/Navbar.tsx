
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellIcon, Search, Settings, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-border/40">
      <div className="flex items-center space-x-1">
        <div className="font-mono text-xl font-semibold text-primary">
          <span>EVO</span>
          <span className="text-foreground">AI</span>
        </div>
        <div className="hidden md:flex items-center h-9 rounded-md border border-input bg-background px-4 py-2 text-sm text-muted-foreground ml-4">
          <span className="text-xs">v0.1.0</span>
        </div>
      </div>
      
      <div className="hidden md:flex flex-1 mx-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search assets, news, trends..."
            className="pl-9 bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <BellIcon className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
