-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shoutouts table
CREATE TABLE public.shoutouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  flagged_at TIMESTAMPTZ,
  flagged_by UUID REFERENCES public.profiles(id),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create recipients table (many-to-many relationship)
CREATE TABLE public.shoutout_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID NOT NULL REFERENCES public.shoutouts(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shoutout_id, recipient_id)
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#F59E0B',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shoutout_tags junction table
CREATE TABLE public.shoutout_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID NOT NULL REFERENCES public.shoutouts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shoutout_id, tag_id)
);

-- Create likes table
CREATE TABLE public.shoutout_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID NOT NULL REFERENCES public.shoutouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(shoutout_id, user_id)
);

-- Create comments table
CREATE TABLE public.shoutout_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID NOT NULL REFERENCES public.shoutouts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutout_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutout_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutout_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutout_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Shoutouts policies
CREATE POLICY "Public shoutouts are viewable by authenticated" ON public.shoutouts
  FOR SELECT TO authenticated USING (is_public = true OR author_id = auth.uid());

CREATE POLICY "Users can create shoutouts" ON public.shoutouts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own shoutouts" ON public.shoutouts
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own shoutouts" ON public.shoutouts
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Shoutout recipients policies
CREATE POLICY "Recipients viewable by authenticated" ON public.shoutout_recipients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authors can add recipients" ON public.shoutout_recipients
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.shoutouts WHERE id = shoutout_id AND author_id = auth.uid())
  );

CREATE POLICY "Authors can remove recipients" ON public.shoutout_recipients
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.shoutouts WHERE id = shoutout_id AND author_id = auth.uid())
  );

-- Tags policies
CREATE POLICY "Tags viewable by authenticated" ON public.tags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create tags" ON public.tags
  FOR INSERT TO authenticated WITH CHECK (true);

-- Shoutout tags policies
CREATE POLICY "Shoutout tags viewable by authenticated" ON public.shoutout_tags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authors can add tags" ON public.shoutout_tags
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.shoutouts WHERE id = shoutout_id AND author_id = auth.uid())
  );

CREATE POLICY "Authors can remove tags" ON public.shoutout_tags
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.shoutouts WHERE id = shoutout_id AND author_id = auth.uid())
  );

-- Likes policies
CREATE POLICY "Likes viewable by authenticated" ON public.shoutout_likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can like shoutouts" ON public.shoutout_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" ON public.shoutout_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments viewable by authenticated" ON public.shoutout_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create comments" ON public.shoutout_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON public.shoutout_comments
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON public.shoutout_comments
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.shoutouts SET likes_count = likes_count + 1 WHERE id = NEW.shoutout_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.shoutouts SET likes_count = likes_count - 1 WHERE id = OLD.shoutout_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_shoutout_likes_count
  AFTER INSERT OR DELETE ON public.shoutout_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.shoutouts SET comments_count = comments_count + 1 WHERE id = NEW.shoutout_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.shoutouts SET comments_count = comments_count - 1 WHERE id = OLD.shoutout_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_shoutout_comments_count
  AFTER INSERT OR DELETE ON public.shoutout_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_tag_usage
  AFTER INSERT OR DELETE ON public.shoutout_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_tag_usage_count();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shoutouts_updated_at BEFORE UPDATE ON public.shoutouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.shoutout_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default tags
INSERT INTO public.tags (name, color) VALUES
  ('Teamwork', '#3B82F6'),
  ('Leadership', '#8B5CF6'),
  ('Innovation', '#10B981'),
  ('Excellence', '#F59E0B'),
  ('Dedication', '#EF4444'),
  ('Collaboration', '#06B6D4'),
  ('Mentorship', '#EC4899'),
  ('Problem Solving', '#6366F1');