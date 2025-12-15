import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoutoutComment } from '@/types/shoutout';
import { toast } from 'sonner';

export function useComments(shoutoutId: string) {
  return useQuery({
    queryKey: ['comments', shoutoutId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shoutout_comments')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('shoutout_id', shoutoutId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ShoutoutComment[];
    },
    enabled: !!shoutoutId
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ shoutoutId, content }: { shoutoutId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shoutout_comments')
        .insert({
          shoutout_id: shoutoutId,
          author_id: user.id,
          content
        })
        .select(`
          *,
          author:profiles(*)
        `)
        .single();

      if (error) throw error;
      return data as ShoutoutComment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.shoutout_id] });
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      toast.success('Comment added!');
    },
    onError: (error) => {
      toast.error('Failed to add comment: ' + error.message);
    }
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, shoutoutId }: { commentId: string; shoutoutId: string }) => {
      const { error } = await supabase
        .from('shoutout_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return shoutoutId;
    },
    onSuccess: (shoutoutId) => {
      queryClient.invalidateQueries({ queryKey: ['comments', shoutoutId] });
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      toast.success('Comment deleted!');
    },
    onError: (error) => {
      toast.error('Failed to delete comment: ' + error.message);
    }
  });
}
