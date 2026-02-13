import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShoutouts, useUnflagShoutout, useDeleteShoutout } from '@/hooks/useShoutouts';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag, Check, Trash2, Eye, Calendar, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function FlaggedContent() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: shoutouts = [], isLoading } = useShoutouts({ flaggedOnly: true });
  const unflagMutation = useUnflagShoutout();
  const deleteMutation = useDeleteShoutout();

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
          <h1 className="text-3xl font-display font-bold text-foreground">Flagged Content</h1>
          <p className="text-muted-foreground mt-1">Review and moderate reported shoutouts</p>
        </div>

        {/* Warning Banner */}
        {shoutouts.length > 0 && (
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-4 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{shoutouts.length} item(s)</span> require your attention.
              Review each flagged shoutout and take appropriate action.
            </p>
          </div>
        )}

        {/* Flagged Items */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : shoutouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-4">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-xl font-semibold">All clear!</h2>
            <p className="text-muted-foreground mt-2">
              No flagged content to review at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {shoutouts.map((shoutout, index) => (
              <Card 
                key={shoutout.id} 
                className="border-destructive/20 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Author info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
                          {shoutout.author?.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{shoutout.author?.full_name || 'Unknown'}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(shoutout.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-semibold text-lg">{shoutout.title}</h3>
                      <p className="text-muted-foreground mt-1 line-clamp-2">{shoutout.message}</p>

                      {/* Flag reason */}
                      {shoutout.flag_reason && (
                        <div className="mt-4 rounded-lg bg-destructive/5 border border-destructive/10 p-3">
                          <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-1">
                            <Flag className="h-4 w-4" />
                            Report Reason
                          </div>
                          <p className="text-sm text-muted-foreground">{shoutout.flag_reason}</p>
                          {shoutout.flagged_at && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Flagged {formatDistanceToNow(new Date(shoutout.flagged_at), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <Badge variant="destructive" className="flex-shrink-0">
                      <Flag className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => navigate(`/shoutouts/${shoutout.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-success hover:text-success"
                      onClick={() => unflagMutation.mutate(shoutout.id)}
                      disabled={unflagMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2 ml-auto"
                      onClick={() => deleteMutation.mutate(shoutout.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
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
