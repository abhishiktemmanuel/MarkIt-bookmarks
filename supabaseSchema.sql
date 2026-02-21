-- ────────────────────────────────────────────────────────────
-- 1. Collections
-- ────────────────────────────────────────────────────────────
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  created_at  timestamptz default now()
);

-- Row Level Security
alter table public.collections enable row level security;

create policy "Users can manage their own collections"
  on public.collections
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- 2. Bookmarks
-- ────────────────────────────────────────────────────────────
create table if not exists public.bookmarks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  collection_id uuid references public.collections(id) on delete set null,
  title         text,
  url           text not null,
  is_archived   boolean default false,
  created_at    timestamptz default now()
);

-- Row Level Security
alter table public.bookmarks enable row level security;

create policy "Users can manage their own bookmarks"
  on public.bookmarks
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- 3. Enable Realtime
-- ────────────────────────────────────────────────────────────
-- Run in SQL editor:
alter publication supabase_realtime add table public.bookmarks;
alter publication supabase_realtime add table public.collections;

-- ────────────────────────────────────────────────────────────
-- 4. Indexes for performance
-- ────────────────────────────────────────────────────────────
create index if not exists bookmarks_user_created on public.bookmarks(user_id, created_at desc);
create index if not exists collections_user_created on public.collections(user_id, created_at asc);
