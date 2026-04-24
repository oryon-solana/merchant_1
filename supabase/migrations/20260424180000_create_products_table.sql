create table public.products (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  description text,
  price       numeric     not null check (price >= 0),
  stock       integer     not null default 0 check (stock >= 0),
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS is auto-enabled by the rls_auto_enable trigger, but we add it explicitly to be safe
alter table public.products enable row level security;

-- Users can only read/write their own products
create policy "users manage own products"
  on public.products for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
