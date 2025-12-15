import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShoutouts } from '@/hooks/useShoutouts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShoutoutCard } from '@/components/shoutout/ShoutoutCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Heart, MessageCircle, Flag, Plus, TrendingUp } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: shoutouts = [], isLoading: shoutoutsLoading } = useShoutouts();
  const { data: analytics } = useAnalytics();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const recentShoutouts = shoutouts.slice(0, 3);

  const stats = [
    { label: 'Total Shoutouts', value: analytics?.total_shoutouts || 0, icon: Megaphone, color: 'text-primary' },
    { label: 'Total Likes', value: analytics?.total_likes || 0, icon: Heart, color: 'text-destructive' },
    { label: 'Comments', value: analytics?.total_comments || 0, icon: MessageCircle, color: 'text-accent' },
    { label: 'Flagged', value: analytics?.flagged_count || 0, icon: Flag, color: 'text-warning' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <Button onClick={() => navigate('/shoutouts/create')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Shoutout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Shoutouts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Shoutouts</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/shoutouts')}>
                View all
              </Button>
            </div>
            
            {shoutoutsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : recentShoutouts.length === 0 ? (
              <Card className="p-8 text-center">
                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No shoutouts yet</h3>
                <p className="text-muted-foreground mt-1">Be the first to celebrate someone!</p>
                <Button className="mt-4" onClick={() => navigate('/shoutouts/create')}>
                  Create Shoutout
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentShoutouts.map((shoutout) => (
                  <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
                ))}
              </div>
            )}
          </div>

          {/* Top Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Trending Tags</h2>
            <Card>
              <CardContent className="p-4">
                {analytics?.top_tags && analytics.top_tags.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.top_tags.map((item, index) => (
                      <div key={item.tag.id} className="flex items-center gap-3">
                        <div 
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                          style={{ backgroundColor: item.tag.color + '20', color: item.tag.color }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.tag.name}</p>
                          <p className="text-xs text-muted-foreground">{item.count} uses</p>
                        </div>
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No tags used yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
