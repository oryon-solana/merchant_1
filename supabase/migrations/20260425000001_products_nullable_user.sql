-- Allow products with no owner (merchant/system products browsable by customers)
alter table public.products alter column user_id drop not null;

-- Allow anyone to read products that have no owner (public menu items)
create policy "public can read menu products"
  on public.products for select
  using (user_id is null);
