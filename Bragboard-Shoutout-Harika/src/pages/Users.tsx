import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles } from '@/hooks/useProfiles';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Users() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: profiles = [], isLoading } = useProfiles();

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
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">All registered team members</p>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 mb-4">
              <UsersIcon className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-xl font-semibold">No users yet</h2>
            <p className="text-muted-foreground mt-2">
              Users will appear here once they sign up.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile, index) => (
              <Card 
                key={profile.id} 
                className="card-hover animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl flex-shrink-0">
                      {profile.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {profile.full_name || 'Unknown User'}
                        </h3>
                        {profile.id === user.id && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                      {profile.department && (
                        <Badge variant="outline" className="mt-2">
                          {profile.department}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground mt-3">
                        Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
