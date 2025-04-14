
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
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link to={to}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const CollapsibleSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem
                icon={<HomeIcon className="h-5 w-5" />}
                label="Dashboard"
                to="/"
                active={currentPath === "/"}
              />
              <SidebarItem
                icon={<TrendingUpIcon className="h-5 w-5" />}
                label="Markets"
                to="/markets"
                active={currentPath === "/markets"}
              />
              <SidebarItem
                icon={<WalletIcon className="h-5 w-5" />}
                label="Portfolio"
                to="/portfolio"
                active={currentPath === "/portfolio"}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>AI Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
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
      </SidebarFooter>

      <AIInsights openFromSidebar={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </ShadcnSidebar>
  );
};

const Sidebar = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <CollapsibleSidebar />
      <div className="hidden">
        <SidebarTrigger />
      </div>
    </SidebarProvider>
  );
};

export default Sidebar;
