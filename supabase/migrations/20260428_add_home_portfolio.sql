alter table public.portfolio_items
add column if not exists is_home boolean not null default false;
