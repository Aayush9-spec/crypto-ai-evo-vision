
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <SidebarInset>
        <Navbar />
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </SidebarInset>
    </div>
  );
};

export default MainLayout;
