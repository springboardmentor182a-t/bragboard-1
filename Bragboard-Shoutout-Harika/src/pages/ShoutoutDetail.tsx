import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShoutout, useLikeShoutout, useUnlikeShoutout, useUserLikes } from '@/hooks/useShoutouts';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommentSection } from '@/components/shoutout/CommentSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, MessageCircle, Calendar, Flag, Edit } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ShoutoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: shoutout, isLoading, error } = useShoutout(id!);
  const { data: userLikes = [] } = useUserLikes();
  const likeMutation = useLikeShoutout();
  const unlikeMutation = useUnlikeShoutout();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const isLiked = userLikes.includes(id!);
  const isAuthor = user?.id === shoutout?.author_id;

  const handleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate(id!);
    } else {
      likeMutation.mutate(id!);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-96 bg-muted rounded-xl animate-pulse" />
        </div>
      </MainLayout>
    );
  }

  if (error || !shoutout) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto text-center py-16">
          <h2 className="text-xl font-semibold">Shoutout not found</h2>
          <p className="text-muted-foreground mt-2">This shoutout may have been deleted.</p>
          <Button className="mt-4" onClick={() => navigate('/shoutouts')}>
            Back to Shoutouts
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Main content */}
        <Card className="animate-fade-in">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  {shoutout.author?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-lg">{shoutout.author?.full_name || 'Anonymous'}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(shoutout.created_at), 'MMM d, yyyy')}
                    <span>•</span>
                    {formatDistanceToNow(new Date(shoutout.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>

              {isAuthor && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/shoutouts/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Recipients */}
            {shoutout.recipients && shoutout.recipients.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Shoutout to:</span>
                <div className="flex flex-wrap gap-2">
                  {shoutout.recipients.map((recipient) => (
                    <Badge key={recipient.id} variant="secondary" className="font-medium py-1">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold mr-1.5">
                        {recipient.full_name?.charAt(0).toUpperCase()}
                      </div>
                      {recipient.full_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Title & Message */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold">{shoutout.title}</h1>
              <p className="mt-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {shoutout.message}
              </p>
            </div>

            {/* Tags */}
            {shoutout.tags && shoutout.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {shoutout.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
                    className="border"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Flagged warning */}
            {shoutout.is_flagged && (
              <div className="mt-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex items-center gap-2 text-destructive font-medium">
                  <Flag className="h-4 w-4" />
                  This shoutout has been flagged for review
                </div>
                {shoutout.flag_reason && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Reason: {shoutout.flag_reason}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-border">
              <button
                onClick={handleLike}
                className={cn(
                  'flex items-center gap-2 font-medium transition-all',
                  isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                )}
              >
                <Heart className={cn('h-6 w-6', isLiked && 'fill-current animate-bounce-soft')} />
                <span className="text-lg">{shoutout.likes_count}</span>
                <span className="text-sm">likes</span>
              </button>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-6 w-6" />
                <span className="text-lg">{shoutout.comments_count}</span>
                <span className="text-sm">comments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-lg font-semibold mb-6">Comments</h2>
            <CommentSection shoutoutId={id!} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
