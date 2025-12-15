-- Create enum for user roles
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create enum for shoutout status
create type public.shoutout_status as enum ('pending', 'approved', 'rejected');

-- Create enum for flagged content severity
create type public.severity_level as enum ('low', 'medium', 'high');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

-- Create shoutouts table
create table public.shoutouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  recipient_name text not null,
  status shoutout_status not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create flagged_content table
create table public.flagged_content (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  severity severity_level not null default 'medium',
  resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.shoutouts enable row level security;
alter table public.flagged_content enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for user_roles
create policy "User roles viewable by authenticated users"
  on public.user_roles for select
  to authenticated
  using (true);

create policy "Only admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for shoutouts
create policy "Users can view their own shoutouts"
  on public.shoutouts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all shoutouts"
  on public.shoutouts for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can create shoutouts"
  on public.shoutouts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Admins can update shoutouts"
  on public.shoutouts for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for flagged_content
create policy "Admins can view all flagged content"
  on public.flagged_content for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can flag content"
  on public.flagged_content for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Admins can update flagged content"
  on public.flagged_content for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_shoutouts_updated
  before update on public.shoutouts
  for each row execute procedure public.handle_updated_at();