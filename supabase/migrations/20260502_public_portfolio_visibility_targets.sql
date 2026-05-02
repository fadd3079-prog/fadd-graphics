drop policy if exists "Public can read published portfolio" on public.portfolio_items;
drop policy if exists "Public can read visible portfolio" on public.portfolio_items;

create policy "Public can read visible portfolio"
on public.portfolio_items
for select
to anon, authenticated
using (is_home = true or is_featured = true or is_published = true or public.is_admin());
