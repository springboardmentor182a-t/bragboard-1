import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const [
        shoutoutsResult,
        tagsResult,
        flaggedResult
      ] = await Promise.all([
        supabase.from('shoutouts').select('id, likes_count, comments_count, created_at'),
        supabase.from('tags').select('*').order('usage_count', { ascending: false }).limit(5),
        supabase.from('shoutouts').select('id').eq('is_flagged', true)
      ]);

      const shoutouts = shoutoutsResult.data || [];
      const tags = tagsResult.data || [];
      const flagged = flaggedResult.data || [];

      const totalLikes = shoutouts.reduce((sum, s) => sum + (s.likes_count || 0), 0);
      const totalComments = shoutouts.reduce((sum, s) => sum + (s.comments_count || 0), 0);

      // Calculate shoutouts by day (last 7 days)
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const shoutoutsByDay = last7Days.map(date => ({
        date,
        count: shoutouts.filter(s => s.created_at.startsWith(date)).length
      }));

      return {
        total_shoutouts: shoutouts.length,
        total_likes: totalLikes,
        total_comments: totalComments,
        flagged_count: flagged.length,
        top_tags: tags.map(tag => ({ tag, count: tag.usage_count })),
        shoutouts_by_day: shoutoutsByDay
      };
    }
  });
}
