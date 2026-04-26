create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  current_role text not null,
  target_role text not null,
  experience_level text not null check (experience_level in ('Beginner', 'Intermediate', 'Advanced')),
  skills text[] not null default '{}',
  years_of_experience integer not null default 0,
  bio text default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulation_type text not null check (simulation_type in ('skill_gap', 'roadmap', 'projects', 'career_switch', 'interview')),
  target_role text,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.simulations enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id);

create policy "simulations_select_own"
on public.simulations
for select
using (auth.uid() = user_id);

create policy "simulations_insert_own"
on public.simulations
for insert
with check (auth.uid() = user_id);
