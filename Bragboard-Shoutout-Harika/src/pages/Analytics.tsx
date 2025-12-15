import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Megaphone, Heart, MessageCircle, Flag, TrendingUp, Calendar } from 'lucide-react';

export default function Analytics() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: analytics, isLoading } = useAnalytics();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const stats = [
    { 
      label: 'Total Shoutouts', 
      value: analytics?.total_shoutouts || 0, 
      icon: Megaphone, 
      color: 'bg-primary/10 text-primary',
      trend: '+12%'
    },
    { 
      label: 'Total Likes', 
      value: analytics?.total_likes || 0, 
      icon: Heart, 
      color: 'bg-destructive/10 text-destructive',
      trend: '+8%'
    },
    { 
      label: 'Comments', 
      value: analytics?.total_comments || 0, 
      icon: MessageCircle, 
      color: 'bg-accent/10 text-accent',
      trend: '+15%'
    },
    { 
      label: 'Flagged Items', 
      value: analytics?.flagged_count || 0, 
      icon: Flag, 
      color: 'bg-warning/10 text-warning',
      trend: '-3%'
    },
  ];

  const chartData = analytics?.shoutouts_by_day?.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    shoutouts: item.count
  })) || [];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track engagement and activity metrics</p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-success font-medium">{stat.trend}</span>
                    <span className="text-muted-foreground">vs last week</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Chart */}
          <Card className="lg:col-span-2 animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Shoutouts This Week
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="shoutouts" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Tags */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Top Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.top_tags && analytics.top_tags.length > 0 ? (
                <div className="space-y-4">
                  {analytics.top_tags.map((item, index) => (
                    <div key={item.tag.id} className="flex items-center gap-3">
                      <div 
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                        style={{ backgroundColor: item.tag.color + '20', color: item.tag.color }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Badge
                            style={{ 
                              backgroundColor: item.tag.color + '20', 
                              color: item.tag.color, 
                              borderColor: item.tag.color 
                            }}
                            className="border"
                          >
                            {item.tag.name}
                          </Badge>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${Math.min((item.count / (analytics.top_tags[0]?.count || 1)) * 100, 100)}%`,
                              backgroundColor: item.tag.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No tags used yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
