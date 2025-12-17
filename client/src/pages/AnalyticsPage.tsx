import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import ExportReportCard from "../components/ExportReportCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Users, MessageSquare, TrendingUp, Activity, MoreHorizontal } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const metrics = [
  {
    title: "Total Users",
    value: "1,293",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "bg-sky-50 text-sky-600",
  },
  {
    title: "Shout-outs",
    value: "3,456",
    change: "+18.2%",
    trend: "up",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Engagement Rate",
    value: "68.4%",
    change: "+4.3%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-mint-50 text-green-600",
  },
  {
    title: "Active Today",
    value: "842",
    change: "+23.1%",
    trend: "up",
    icon: Activity,
    color: "bg-rose-50 text-rose-600",
  },
];

const chartData = [
  { name: "Mon", shouts: 42, reactions: 156 },
  { name: "Tue", shouts: 58, reactions: 198 },
  { name: "Wed", shouts: 48, reactions: 172 },
  { name: "Thu", shouts: 65, reactions: 224 },
  { name: "Fri", shouts: 72, reactions: 268 },
  { name: "Sat", shouts: 38, reactions: 142 },
  { name: "Sun", shouts: 45, reactions: 165 },
];

const moderationQueue = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    content: "Great work on the project launch! The team really pulled together...",
    reported: 2,
    status: "pending",
    time: "5m ago",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    content: "Thanks for the amazing support during the sprint!",
    reported: 1,
    status: "pending",
    time: "12m ago",
  },
];

const users = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "Admin",
    shouts: 42,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    email: "alex@company.com",
    role: "User",
    shouts: 35,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Jessica Williams",
    email: "jessica@company.com",
    role: "User",
    shouts: 38,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Marcus Thompson",
    email: "marcus@company.com",
    role: "Moderator",
    shouts: 31,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor your platform's performance and activity</p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-40 h-10 border-gray-200" style={{ borderRadius: 'var(--radius-md)' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ borderRadius: 'var(--radius-md)' }}>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Moderation Queue */}
      <Card className="p-4 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div className="flex items-center justify-between mb-0">
          <h3 className="text-gray-900">Moderation Queue</h3>
          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700" style={{ borderRadius: 'var(--radius-sm)' }}>
            {moderationQueue.length} pending
          </Badge>
        </div>
        <div className="space-y-2">
          {moderationQueue.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
              <Avatar className="w-12 h-12 ring-2 ring-gray-100 flex-shrink-0">
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{item.user.name}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{item.time}</span>
                  <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 ml-auto" style={{ borderRadius: 'var(--radius-sm)' }}>
                    {item.reported} reports
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{item.content}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.color}`} style={{ borderRadius: 'var(--radius-md)' }}>
                  <Icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700" style={{ borderRadius: 'var(--radius-sm)' }}>
                  {metric.change}
                </Badge>
              </div>
              <h3 className="text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
          <h3 className="text-gray-900 mb-6">Shout-outs Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="shouts" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
          <h3 className="text-gray-900 mb-6">Reactions Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Line type="monotone" dataKey="reactions" stroke="#A855F7" strokeWidth={3} dot={{ fill: "#A855F7", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div>
        <ExportReportCard />
      </div>
    </div>
  );
}
