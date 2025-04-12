
import MainLayout from "@/components/MainLayout";
import PriceChart from "@/components/dashboard/PriceChart";
import MarketOverview from "@/components/dashboard/MarketOverview";
import AIInsights from "@/components/dashboard/AIInsights";
import NewsWidget from "@/components/dashboard/NewsWidget";

const Index = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="space-y-6">
            <PriceChart />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIInsights />
              <NewsWidget />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Markets</h2>
            <MarketOverview />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
