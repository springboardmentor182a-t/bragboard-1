import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shoutout, CreateShoutoutInput, UpdateShoutoutInput, Profile, Tag } from '@/types/shoutout';
import { toast } from 'sonner';

export function useShoutouts(options?: { flaggedOnly?: boolean }) {
  return useQuery({
    queryKey: ['shoutouts', options?.flaggedOnly],
    queryFn: async () => {
      let query = supabase
        .from('shoutouts')
        .select(`
          *,
          author:profiles!shoutouts_author_id_fkey(*),
          shoutout_recipients(
            recipient:profiles(*)
          ),
          shoutout_tags(
            tag:tags(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (options?.flaggedOnly) {
        query = query.eq('is_flagged', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(item => ({
        ...item,
        recipients: item.shoutout_recipients?.map((r: any) => r.recipient) || [],
        tags: item.shoutout_tags?.map((t: any) => t.tag) || []
      })) as Shoutout[];
    }
  });
}

export function useShoutout(id: string) {
  return useQuery({
    queryKey: ['shoutout', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shoutouts')
        .select(`
          *,
          author:profiles!shoutouts_author_id_fkey(*),
          shoutout_recipients(
            recipient:profiles(*)
          ),
          shoutout_tags(
            tag:tags(*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        recipients: data.shoutout_recipients?.map((r: any) => r.recipient) || [],
        tags: data.shoutout_tags?.map((t: any) => t.tag) || []
      } as Shoutout;
    },
    enabled: !!id
  });
}

export function useCreateShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateShoutoutInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: shoutout, error: shoutoutError } = await supabase
        .from('shoutouts')
        .insert({
          author_id: user.id,
          title: input.title,
          message: input.message,
          is_public: input.is_public ?? true
        })
        .select()
        .single();

      if (shoutoutError) throw shoutoutError;

      if (input.recipient_ids.length > 0) {
        const { error: recipientError } = await supabase
          .from('shoutout_recipients')
          .insert(
            input.recipient_ids.map(recipient_id => ({
              shoutout_id: shoutout.id,
              recipient_id
            }))
          );
        if (recipientError) throw recipientError;
      }

      if (input.tag_ids.length > 0) {
        const { error: tagError } = await supabase
          .from('shoutout_tags')
          .insert(
            input.tag_ids.map(tag_id => ({
              shoutout_id: shoutout.id,
              tag_id
            }))
          );
        if (tagError) throw tagError;
      }

      return shoutout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      toast.success('Shoutout created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create shoutout: ' + error.message);
    }
  });
}

export function useUpdateShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateShoutoutInput & { id: string }) => {
      const { data, error } = await supabase
        .from('shoutouts')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      queryClient.invalidateQueries({ queryKey: ['shoutout', data.id] });
      toast.success('Shoutout updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update shoutout: ' + error.message);
    }
  });
}

interface FullUpdateInput {
  id: string;
  title: string;
  message: string;
  is_public: boolean;
  recipient_ids: string[];
  tag_ids: string[];
}

export function useUpdateShoutoutFull() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, message, is_public, recipient_ids, tag_ids }: FullUpdateInput) => {
      // Update the shoutout
      const { data: shoutout, error: shoutoutError } = await supabase
        .from('shoutouts')
        .update({ title, message, is_public })
        .eq('id', id)
        .select()
        .single();

      if (shoutoutError) throw shoutoutError;

      // Delete existing recipients and add new ones
      const { error: deleteRecipientsError } = await supabase
        .from('shoutout_recipients')
        .delete()
        .eq('shoutout_id', id);
      
      if (deleteRecipientsError) throw deleteRecipientsError;

      if (recipient_ids.length > 0) {
        const { error: recipientError } = await supabase
          .from('shoutout_recipients')
          .insert(
            recipient_ids.map(recipient_id => ({
              shoutout_id: id,
              recipient_id
            }))
          );
        if (recipientError) throw recipientError;
      }

      // Delete existing tags and add new ones
      const { error: deleteTagsError } = await supabase
        .from('shoutout_tags')
        .delete()
        .eq('shoutout_id', id);
      
      if (deleteTagsError) throw deleteTagsError;

      if (tag_ids.length > 0) {
        const { error: tagError } = await supabase
          .from('shoutout_tags')
          .insert(
            tag_ids.map(tag_id => ({
              shoutout_id: id,
              tag_id
            }))
          );
        if (tagError) throw tagError;
      }

      return shoutout;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      queryClient.invalidateQueries({ queryKey: ['shoutout', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Shoutout updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update shoutout: ' + error.message);
    }
  });
}

export function useDeleteShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shoutouts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      toast.success('Shoutout deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete shoutout: ' + error.message);
    }
  });
}

export function useFlagShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shoutouts')
        .update({
          is_flagged: true,
          flag_reason: reason,
          flagged_at: new Date().toISOString(),
          flagged_by: user.id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      queryClient.invalidateQueries({ queryKey: ['shoutout', data.id] });
      toast.success('Shoutout flagged for review');
    },
    onError: (error) => {
      toast.error('Failed to flag shoutout: ' + error.message);
    }
  });
}

export function useUnflagShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('shoutouts')
        .update({
          is_flagged: false,
          flag_reason: null,
          flagged_at: null,
          flagged_by: null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      queryClient.invalidateQueries({ queryKey: ['shoutout', data.id] });
      toast.success('Shoutout unflagged');
    },
    onError: (error) => {
      toast.error('Failed to unflag shoutout: ' + error.message);
    }
  });
}

export function useLikeShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shoutoutId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shoutout_likes')
        .insert({ shoutout_id: shoutoutId, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      queryClient.invalidateQueries({ queryKey: ['user-likes'] });
    }
  });
}

export function useUnlikeShoutout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shoutoutId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('shoutout_likes')
        .delete()
        .eq('shoutout_id', shoutoutId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoutouts'] });
      queryClient.invalidateQueries({ queryKey: ['user-likes'] });
    }
  });
}

export function useUserLikes() {
  return useQuery({
    queryKey: ['user-likes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('shoutout_likes')
        .select('shoutout_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(l => l.shoutout_id) || [];
    }
  });
}
