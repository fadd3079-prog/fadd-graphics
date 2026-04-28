create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'logo',
  summary text,
  deliverable text,
  focus text,
  tone text,
  tags text[] not null default '{}',
  layout text not null default 'wide' check (layout in ('wide', 'tall', 'panoramic')),
  image_url text,
  image_path text,
  gallery_urls text[] not null default '{}',
  gallery_paths text[] not null default '{}',
  cta_label text,
  detail_path text,
  is_featured boolean not null default false,
  is_home boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_items
add column if not exists is_home boolean not null default false;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_items_set_updated_at on public.portfolio_items;
create trigger portfolio_items_set_updated_at
before update on public.portfolio_items
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.portfolio_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

drop policy if exists "Admins can read their own admin row" on public.admin_users;
create policy "Admins can read their own admin row"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read published portfolio" on public.portfolio_items;
create policy "Public can read published portfolio"
on public.portfolio_items
for select
to anon, authenticated
using (is_published = true or public.is_admin());

drop policy if exists "Admins can insert portfolio" on public.portfolio_items;
create policy "Admins can insert portfolio"
on public.portfolio_items
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update portfolio" on public.portfolio_items;
create policy "Admins can update portfolio"
on public.portfolio_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete portfolio" on public.portfolio_items;
create policy "Admins can delete portfolio"
on public.portfolio_items
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio images" on storage.objects;
create policy "Public can read portfolio images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Admins can upload portfolio images" on storage.objects;
create policy "Admins can upload portfolio images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "Admins can update portfolio images" on storage.objects;
create policy "Admins can update portfolio images"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio' and public.is_admin())
with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "Admins can delete portfolio images" on storage.objects;
create policy "Admins can delete portfolio images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio' and public.is_admin());
