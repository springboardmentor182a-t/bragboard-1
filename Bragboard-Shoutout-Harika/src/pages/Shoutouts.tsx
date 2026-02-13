import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShoutouts } from '@/hooks/useShoutouts';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShoutoutCard } from '@/components/shoutout/ShoutoutCard';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone } from 'lucide-react';

export default function Shoutouts() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: shoutouts = [], isLoading } = useShoutouts();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Shoutouts</h1>
            <p className="text-muted-foreground mt-1">Celebrate and appreciate your team members</p>
          </div>
          <Button onClick={() => navigate('/shoutouts/create')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Shoutout
          </Button>
        </div>

        {/* Shoutouts Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : shoutouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Megaphone className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">No shoutouts yet</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Be the first to celebrate someone's achievement! Create a shoutout to recognize a team member.
            </p>
            <Button className="mt-6" onClick={() => navigate('/shoutouts/create')}>
              Create Your First Shoutout
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {shoutouts.map((shoutout) => (
              <ShoutoutCard 
                key={shoutout.id} 
                shoutout={shoutout}
                onEdit={() => navigate(`/shoutouts/${shoutout.id}/edit`)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
