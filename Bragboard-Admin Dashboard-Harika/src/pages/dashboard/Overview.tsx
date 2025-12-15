import { Users, MessageSquare, Flag, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview() {
  const recentActivity = [
    { user: "John Doe", action: "Posted a shout-out", time: "2 minutes ago", status: "Approved" },
    { user: "Jane Smith", action: "Flagged content", time: "15 minutes ago", status: "Under Review" },
    { user: "Mike Johnson", action: "Updated profile", time: "1 hour ago", status: "Completed" },
  ];

  const columns = [
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground">Welcome to your BragBoard admin dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="2,543"
          change="+12% from last month"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Shout-outs"
          value="8,234"
          change="+8% from last month"
          icon={MessageSquare}
          trend="up"
        />
        <StatCard
          title="Flagged Content"
          value="23"
          change="-5% from last month"
          icon={Flag}
          trend="down"
        />
        <StatCard
          title="Engagement"
          value="94.2%"
          change="+2.5% from last month"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable
          title="Recent Activity"
          columns={columns}
          data={recentActivity}
        />

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Users Today</span>
              <span className="font-semibold text-foreground">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Reviews</span>
              <span className="font-semibold text-warning">15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">System Health</span>
              <span className="font-semibold text-success">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
