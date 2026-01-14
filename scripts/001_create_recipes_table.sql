-- Create recipes table with RLS enabled
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  description text,
  servings integer,
  cook_time integer,
  difficulty text,
  image text,
  ingredients jsonb not null default '[]',
  instructions text[] not null default '{}',
  nutrition jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable row level security
alter table public.recipes enable row level security;

-- RLS Policies for recipes table
create policy "Users can view all recipes"
  on public.recipes for select
  using (true);

create policy "Users can only create their own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own recipes"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index if not exists recipes_user_id_idx on public.recipes(user_id);
create index if not exists recipes_category_idx on public.recipes(category);
