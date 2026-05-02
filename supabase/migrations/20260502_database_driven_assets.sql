create extension if not exists pgcrypto;

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

alter table public.media_assets enable row level security;
alter table public.site_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.portfolio_images enable row level security;

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at
before update on public.media_assets
for each row
execute function public.set_updated_at();

drop trigger if exists site_assets_set_updated_at on public.site_assets;
create trigger site_assets_set_updated_at
before update on public.site_assets
for each row
execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists portfolio_images_set_updated_at on public.portfolio_images;
create trigger portfolio_images_set_updated_at
before update on public.portfolio_images
for each row
execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read active media assets" on public.media_assets;
create policy "Public can read active media assets"
on public.media_assets
for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins can insert media assets" on public.media_assets;
create policy "Admins can insert media assets"
on public.media_assets
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update media assets" on public.media_assets;
create policy "Admins can update media assets"
on public.media_assets
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete media assets" on public.media_assets;
create policy "Admins can delete media assets"
on public.media_assets
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read active site assets" on public.site_assets;
create policy "Public can read active site assets"
on public.site_assets
for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins can insert site assets" on public.site_assets;
create policy "Admins can insert site assets"
on public.site_assets
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update site assets" on public.site_assets;
create policy "Admins can update site assets"
on public.site_assets
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete site assets" on public.site_assets;
create policy "Admins can delete site assets"
on public.site_assets
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read public site settings" on public.site_settings;
create policy "Public can read public site settings"
on public.site_settings
for select
to anon, authenticated
using (is_public = true or public.is_admin());

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete site settings" on public.site_settings;
create policy "Admins can delete site settings"
on public.site_settings
for delete
to authenticated
using (public.is_admin());

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
create policy "Admins can insert portfolio images"
on public.portfolio_images
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update portfolio images" on public.portfolio_images;
create policy "Admins can update portfolio images"
on public.portfolio_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete portfolio images" on public.portfolio_images;
create policy "Admins can delete portfolio images"
on public.portfolio_images
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read site media files" on storage.objects;
create policy "Public can read site media files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media files" on storage.objects;
create policy "Admins can upload site media files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can update site media files" on storage.objects;
create policy "Admins can update site media files"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can delete site media files" on storage.objects;
create policy "Admins can delete site media files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and public.is_admin());

insert into public.site_settings (setting_key, setting_value, is_public)
values (
  'contact_links',
  '[
    {"label":"WhatsApp","value":"+62 831 5096 4050","href":"https://wa.me/6283150964050","type":"whatsapp","isActive":true,"sortOrder":1},
    {"label":"Email","value":"faddgraphics@gmail.com","href":"mailto:faddgraphics@gmail.com","type":"email","isActive":true,"sortOrder":2},
    {"label":"Instagram","value":"@fadd_graphics","href":"https://instagram.com/fadd_graphics","type":"instagram","isActive":true,"sortOrder":3},
    {"label":"LinkedIn","value":"Mufaddhol","href":"https://www.linkedin.com/in/mufaddhol-01b60333a/","type":"linkedin","isActive":true,"sortOrder":4}
  ]'::jsonb,
  true
)
on conflict (setting_key) do nothing;

insert into public.site_settings (setting_key, setting_value, is_public)
values (
  'about_profile',
  '{"name":"Mufaddhol","role":"Founder of FADD GRAPHICS / Freelance Graphic Designer","shortBio":"","detailBio":""}'::jsonb,
  true
)
on conflict (setting_key) do nothing;

insert into public.portfolio_images (
  portfolio_item_id,
  image_role,
  image_url,
  image_path,
  alt_text,
  sort_order,
  is_active
)
select
  item.id,
  'main',
  item.image_url,
  coalesce(item.image_path, ''),
  item.title,
  0,
  true
from public.portfolio_items item
where item.image_url is not null
and not exists (
  select 1
  from public.portfolio_images image
  where image.portfolio_item_id = item.id
  and image.image_role = 'main'
);

insert into public.portfolio_images (
  portfolio_item_id,
  image_role,
  image_url,
  image_path,
  alt_text,
  sort_order,
  is_active
)
select
  item.id,
  'gallery',
  gallery.url,
  coalesce(item.gallery_paths[gallery.ordinality], ''),
  item.title,
  gallery.ordinality,
  true
from public.portfolio_items item
cross join lateral unnest(item.gallery_urls) with ordinality as gallery(url, ordinality)
where gallery.url is not null
and not exists (
  select 1
  from public.portfolio_images image
  where image.portfolio_item_id = item.id
  and image.image_url = gallery.url
);
