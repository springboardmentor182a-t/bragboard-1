import { MetricCard } from "../components/MetricCard";
import { NewCustomers } from "../components/NewCustomers";
import { ProductViewChart } from "../components/ProductViewChart";
import { TopContributors } from "../components/TopContributors";
import { TrendingTags } from "../components/TrendingTags";
import { QuickLinks } from "../components/QuickLinks";


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";  

interface DashboardPageProps {
  onViewShout: () => void;
}

export function DashboardPage({ onViewShout }: DashboardPageProps) {
  return (
    <div className="space-y-4" >
      {/* Overview Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        {/* <Select defaultValue="lastmonth">
          <SelectTrigger className="w-32 h-8 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: 'var(--radius-md)' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ borderRadius: 'var(--radius-md)' }}>
            <SelectItem value="lastmonth">Last month</SelectItem>
            <SelectItem value="last3months">Last 3 months</SelectItem>
            <SelectItem value="last6months">Last 6 months</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-2">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Totel Users"
              value="1,293"
              change="56.8%"
              isPositive={true}
              subtitle="vs last month"
              icon="users"
            />
            <MetricCard
              title="All Shouts"
              value="256k"
              change="36.8%"
              isPositive={true}
              subtitle="vs last month"
              icon="Shout"
            />
          </div>
          

          {/* New Customers */}
          <NewCustomers />

          {/* Product View Chart */}
          <ProductViewChart />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2">
          <TopContributors />
          <TrendingTags />
          <QuickLinks />
        </div>
      </div>
    </div>
  );
}