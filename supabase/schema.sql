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

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  path text not null unique,
  url text not null,
  label text not null default '',
  alt_text text not null default '',
  section text not null default 'library',
  usage_type text not null default 'general',
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  media_asset_id uuid references public.media_assets(id) on delete set null,
  url text not null default '',
  path text not null default '',
  label text not null default '',
  alt_text text not null default '',
  section text not null default 'global',
  usage_type text not null default 'site-asset',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  portfolio_item_id uuid not null references public.portfolio_items(id) on delete cascade,
  media_asset_id uuid references public.media_assets(id) on delete set null,
  image_role text not null default 'gallery' check (image_role in ('main', 'gallery')),
  image_url text not null,
  image_path text not null default '',
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_assets_section_idx on public.media_assets(section);
create index if not exists media_assets_usage_type_idx on public.media_assets(usage_type);
create index if not exists media_assets_is_active_idx on public.media_assets(is_active);
create index if not exists site_assets_asset_key_idx on public.site_assets(asset_key);
create index if not exists site_settings_setting_key_idx on public.site_settings(setting_key);
create index if not exists portfolio_images_item_idx on public.portfolio_images(portfolio_item_id);
create index if not exists portfolio_images_role_idx on public.portfolio_images(image_role);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

drop trigger if exists portfolio_items_set_updated_at on public.portfolio_items;
create trigger portfolio_items_set_updated_at before update on public.portfolio_items for each row execute function public.set_updated_at();

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at before update on public.media_assets for each row execute function public.set_updated_at();

drop trigger if exists site_assets_set_updated_at on public.site_assets;
create trigger site_assets_set_updated_at before update on public.site_assets for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

drop trigger if exists portfolio_images_set_updated_at on public.portfolio_images;
create trigger portfolio_images_set_updated_at before update on public.portfolio_images for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.portfolio_images enable row level security;

drop policy if exists "Admins can read their own admin row" on public.admin_users;
create policy "Admins can read their own admin row" on public.admin_users for select to authenticated using (user_id = auth.uid());

drop policy if exists "Public can read published portfolio" on public.portfolio_items;
drop policy if exists "Public can read visible portfolio" on public.portfolio_items;
create policy "Public can read visible portfolio" on public.portfolio_items for select to anon, authenticated using (is_home = true or is_featured = true or is_published = true or public.is_admin());

drop policy if exists "Admins can insert portfolio" on public.portfolio_items;
create policy "Admins can insert portfolio" on public.portfolio_items for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update portfolio" on public.portfolio_items;
create policy "Admins can update portfolio" on public.portfolio_items for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete portfolio" on public.portfolio_items;
create policy "Admins can delete portfolio" on public.portfolio_items for delete to authenticated using (public.is_admin());

drop policy if exists "Public can read active media assets" on public.media_assets;
create policy "Public can read active media assets" on public.media_assets for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists "Admins can insert media assets" on public.media_assets;
create policy "Admins can insert media assets" on public.media_assets for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update media assets" on public.media_assets;
create policy "Admins can update media assets" on public.media_assets for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete media assets" on public.media_assets;
create policy "Admins can delete media assets" on public.media_assets for delete to authenticated using (public.is_admin());

drop policy if exists "Public can read active site assets" on public.site_assets;
create policy "Public can read active site assets" on public.site_assets for select to anon, authenticated using (is_active = true or public.is_admin());

drop policy if exists "Admins can insert site assets" on public.site_assets;
create policy "Admins can insert site assets" on public.site_assets for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update site assets" on public.site_assets;
create policy "Admins can update site assets" on public.site_assets for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete site assets" on public.site_assets;
create policy "Admins can delete site assets" on public.site_assets for delete to authenticated using (public.is_admin());

drop policy if exists "Public can read public site settings" on public.site_settings;
create policy "Public can read public site settings" on public.site_settings for select to anon, authenticated using (is_public = true or public.is_admin());

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings" on public.site_settings for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete site settings" on public.site_settings;
create policy "Admins can delete site settings" on public.site_settings for delete to authenticated using (public.is_admin());

drop policy if exists "Public can read active portfolio images" on public.portfolio_images;
create policy "Public can read active portfolio images"
on public.portfolio_images
for select
to anon, authenticated
using (
  (
    is_active = true
    and exists (
      select 1
      from public.portfolio_items item
      where item.id = portfolio_images.portfolio_item_id
      and (item.is_home = true or item.is_featured = true or item.is_published = true)
    )
  )
  or public.is_admin()
);

drop policy if exists "Admins can insert portfolio images" on public.portfolio_images;
create policy "Admins can insert portfolio images" on public.portfolio_images for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update portfolio images" on public.portfolio_images;
create policy "Admins can update portfolio images" on public.portfolio_images for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete portfolio images" on public.portfolio_images;
create policy "Admins can delete portfolio images" on public.portfolio_images for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true) on conflict (id) do update set public = true;

drop policy if exists "Public can read site media files" on storage.objects;
create policy "Public can read site media files" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media files" on storage.objects;
create policy "Admins can upload site media files" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can update site media files" on storage.objects;
create policy "Admins can update site media files" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can delete site media files" on storage.objects;
create policy "Admins can delete site media files" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());
