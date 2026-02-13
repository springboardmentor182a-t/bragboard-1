export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usage_count: number;
  created_at: string;
}

export interface Shoutout {
  id: string;
  author_id: string;
  title: string;
  message: string;
  is_public: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  flagged_at: string | null;
  flagged_by: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  author?: Profile;
  recipients?: Profile[];
  tags?: Tag[];
}

export interface ShoutoutRecipient {
  id: string;
  shoutout_id: string;
  recipient_id: string;
  created_at: string;
  recipient?: Profile;
}

export interface ShoutoutTag {
  id: string;
  shoutout_id: string;
  tag_id: string;
  created_at: string;
  tag?: Tag;
}

export interface ShoutoutLike {
  id: string;
  shoutout_id: string;
  user_id: string;
  created_at: string;
}

export interface ShoutoutComment {
  id: string;
  shoutout_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface CreateShoutoutInput {
  title: string;
  message: string;
  is_public?: boolean;
  recipient_ids: string[];
  tag_ids: string[];
}

export interface UpdateShoutoutInput {
  title?: string;
  message?: string;
  is_public?: boolean;
}

export interface AnalyticsData {
  total_shoutouts: number;
  total_likes: number;
  total_comments: number;
  flagged_count: number;
  top_tags: { tag: Tag; count: number }[];
  recent_activity: Shoutout[];
  shoutouts_by_day: { date: string; count: number }[];
}
