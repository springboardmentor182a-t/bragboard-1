import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Flag, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Shoutout } from '@/types/shoutout';
import { useAuth } from '@/hooks/useAuth';
import { useLikeShoutout, useUnlikeShoutout, useUserLikes, useFlagShoutout, useDeleteShoutout } from '@/hooks/useShoutouts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ShoutoutCardProps {
  shoutout: Shoutout;
  onEdit?: () => void;
}

export function ShoutoutCard({ shoutout, onEdit }: ShoutoutCardProps) {
  const { user } = useAuth();
  const { data: userLikes = [] } = useUserLikes();
  const likeMutation = useLikeShoutout();
  const unlikeMutation = useUnlikeShoutout();
  const flagMutation = useFlagShoutout();
  const deleteMutation = useDeleteShoutout();

  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isLiked = userLikes.includes(shoutout.id);
  const isAuthor = user?.id === shoutout.author_id;

  const handleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate(shoutout.id);
    } else {
      likeMutation.mutate(shoutout.id);
    }
  };

  const handleFlag = () => {
    if (flagReason.trim()) {
      flagMutation.mutate({ id: shoutout.id, reason: flagReason });
      setFlagDialogOpen(false);
      setFlagReason('');
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(shoutout.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <article className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
              {shoutout.author?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-semibold text-card-foreground">
                {shoutout.author?.full_name || 'Anonymous'}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(shoutout.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor && (
                <>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              {!isAuthor && !shoutout.is_flagged && (
                <DropdownMenuItem onClick={() => setFlagDialogOpen(true)}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Recipients */}
        {shoutout.recipients && shoutout.recipients.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">To:</span>
            <div className="flex flex-wrap gap-2">
              {shoutout.recipients.map((recipient) => (
                <Badge key={recipient.id} variant="secondary" className="font-medium">
                  {recipient.full_name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <Link to={`/shoutouts/${shoutout.id}`} className="block mt-4">
          <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors">
            {shoutout.title}
          </h3>
          <p className="mt-2 text-muted-foreground line-clamp-3">
            {shoutout.message}
          </p>
        </Link>

        {/* Tags */}
        {shoutout.tags && shoutout.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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

        {/* Actions */}
        <div className="mt-6 flex items-center gap-4 pt-4 border-t border-border">
          <button
            onClick={handleLike}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all',
              isLiked 
                ? 'text-destructive' 
                : 'text-muted-foreground hover:text-destructive'
            )}
          >
            <Heart 
              className={cn('h-5 w-5 transition-transform', isLiked && 'fill-current animate-bounce-soft')} 
            />
            {shoutout.likes_count}
          </button>

          <Link 
            to={`/shoutouts/${shoutout.id}`}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            {shoutout.comments_count}
          </Link>

          {shoutout.is_flagged && (
            <Badge variant="destructive" className="ml-auto">
              <Flag className="mr-1 h-3 w-3" />
              Flagged
            </Badge>
          )}
        </div>
      </article>

      {/* Flag Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report this shoutout</DialogTitle>
            <DialogDescription>
              Please provide a reason for reporting this content.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Describe why this content should be reviewed..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleFlag}
              disabled={!flagReason.trim()}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete shoutout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shoutout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
