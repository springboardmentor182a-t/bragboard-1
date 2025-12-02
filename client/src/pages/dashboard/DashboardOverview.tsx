// src/pages/dashboard/DashboardOverview.tsx
import React from "react";
import { TrendingUp, TrendingDown, MessageSquare, Users, AlertCircle, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { ChartContainer } from "../../components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

export interface DashboardOverviewProps {
  userRole: "admin" | "employee";
  userData: { name: string; email: string };
  onLogout: () => void;
}

const weeklyData = [
  { day: "Mon", shoutouts: 45 },
  { day: "Tue", shoutouts: 52 },
  { day: "Wed", shoutouts: 38 },
  { day: "Thu", shoutouts: 67 },
  { day: "Fri", shoutouts: 71 },
  { day: "Sat", shoutouts: 28 },
  { day: "Sun", shoutouts: 22 },
];

const topEmployees = [
  { name: "Priya Sharma", shoutouts: 47, initials: "PS", color: "bg-yellow-500" },
  { name: "Rahul Verma", shoutouts: 42, initials: "RV", color: "bg-gray-400" },
  { name: "Sneha Kapoor", shoutouts: 38, initials: "SK", color: "bg-orange-500" },
];

const recentActivities = [
  { user: "Arjun", recipient: "Sneha", time: "5 min ago" },
  { user: "Priya", recipient: "Rahul", time: "12 min ago" },
  { user: "Vikram", recipient: "Anita", time: "23 min ago" },
  { user: "Neha", recipient: "Karan", time: "1 hour ago" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm">{payload[0].value} shout-outs</p>
      </div>
    );
  }
  return null;
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ userRole, userData, onLogout }) => {
  const statsCards = [
    { title: "Total Shout-outs", value: "1,284", growth: "+24%", isPositive: true, icon: MessageSquare, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { title: "Active Employees", value: "342", growth: "+12%", isPositive: true, icon: Users, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { title: "Pending Reports", value: "23", growth: "-15%", isPositive: false, icon: AlertCircle, bgColor: "bg-orange-50", iconColor: "text-orange-600" },
    { title: "Total Reactions", value: "5,672", growth: "+34%", isPositive: true, icon: Heart, bgColor: "bg-pink-50", iconColor: "text-pink-600" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-purple-600 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">BragBoard</h2>
        <p className="mb-4">Welcome, {userData.name}</p>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-auto">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? "text-green-600" : "text-red-600"}`}>
                      {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{stat.growth}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart + Top Employees */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Shout-outs Trend</CardTitle>
              <CardDescription>Number of shout-outs over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px] w-full">
                <BarChart data={weeklyData} width={500} height={300}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="shoutouts" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>Employees with most shout-outs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEmployees.map((emp, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-white text-xs`}>
                      {idx === 0 ? "🏆" : idx + 1}
                    </div>
                    <Avatar className="shrink-0">
                      <AvatarFallback name={emp.initials} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.shoutouts} shout-outs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest shout-outs on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="text-purple-600">{act.user}</span> gave a shout-out to{" "}
                      <span className="text-purple-600">{act.recipient}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
