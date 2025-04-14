
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChartIcon,
  BookIcon,
  BrainCircuitIcon,
  HomeIcon,
  LineChartIcon,
  MessageSquareTextIcon,
  MessagesSquareIcon,
  NewspaperIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import AIInsights from "./dashboard/AIInsights";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal",
          active ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="w-60 h-full flex flex-col bg-sidebar py-4 border-r border-border/40">
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-medium uppercase text-muted-foreground">
            Overview
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<HomeIcon className="h-5 w-5" />}
              label="Dashboard"
              to="/"
              active={currentPath === "/"}
            />
            <SidebarItem
              icon={<WalletIcon className="h-5 w-5" />}
              label="Portfolio"
              to="/portfolio"
              active={currentPath === "/portfolio"}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-medium uppercase text-muted-foreground">
            Analytics
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<LineChartIcon className="h-5 w-5" />}
              label="Price Analysis"
              to="/price-analysis"
              active={currentPath === "/price-analysis"}
            />
            <SidebarItem
              icon={<BarChartIcon className="h-5 w-5" />}
              label="Market Indicators"
              to="/indicators"
              active={currentPath === "/indicators"}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-medium uppercase text-muted-foreground">
            AI Insights
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<BrainCircuitIcon className="h-5 w-5" />}
              label="AI Predictions"
              to="/ai-predictions"
              active={currentPath === "/ai-predictions"}
            />
            <SidebarItem
              icon={<MessageSquareTextIcon className="h-5 w-5" />}
              label="ChatGPT Insights"
              to="/chat-insights"
              active={currentPath === "/chat-insights"}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-medium uppercase text-muted-foreground">
            Resources
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={<NewspaperIcon className="h-5 w-5" />}
              label="News"
              to="/news"
              active={currentPath === "/news"}
            />
            <SidebarItem
              icon={<MessagesSquareIcon className="h-5 w-5" />}
              label="Community"
              to="/community"
              active={currentPath === "/community"}
            />
            <SidebarItem
              icon={<BookIcon className="h-5 w-5" />}
              label="Learn"
              to="/learn"
              active={currentPath === "/learn"}
            />
          </div>
        </div>
        
        <div className="mt-auto px-3">
          <div className="px-3 py-2">
            <h3 className="mb-2 px-4 text-xs font-medium uppercase text-muted-foreground">
              Markets
            </h3>
            <div className="space-y-1">
              <SidebarItem
                icon={<TrendingUpIcon className="h-5 w-5" />}
                label="Markets"
                to="/markets"
                active={currentPath === "/markets"}
              />
            </div>
          </div>
        </div>
        
        <div className="px-3 py-4">
          <div className="crypto-card overflow-hidden">
            <div className="px-4 py-3 bg-primary/20">
              <div className="flex items-center">
                <BrainCircuitIcon className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">AI Assistant</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Need help analyzing market trends?</p>
              <Button size="sm" className="w-full" onClick={() => setIsChatOpen(true)}>
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <AIInsights openFromSidebar={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Sidebar;
