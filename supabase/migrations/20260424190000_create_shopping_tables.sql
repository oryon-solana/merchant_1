-- ─── Cart ────────────────────────────────────────────────────────────────────
create table public.cart_items (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id uuid        not null references public.products(id) on delete cascade,
  quantity   integer     not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "users manage own cart"
  on public.cart_items for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Orders ──────────────────────────────────────────────────────────────────
create table public.orders (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  total_amount  numeric     not null check (total_amount >= 0),
  points_earned integer     not null default 0,
  status        text        not null default 'paid' check (status in ('paid', 'cancelled')),
  created_at    timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "users see own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- ─── Order Items ─────────────────────────────────────────────────────────────
-- price and name are snapshotted at purchase time so historical orders stay accurate
create table public.order_items (
  id             uuid    primary key default gen_random_uuid(),
  order_id       uuid    not null references public.orders(id) on delete cascade,
  product_id     uuid    references public.products(id) on delete set null,
  product_name   text    not null,
  product_price  numeric not null,
  quantity       integer not null check (quantity > 0),
  subtotal       numeric not null
);

alter table public.order_items enable row level security;

create policy "users see own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ─── User Points (balance) ───────────────────────────────────────────────────
create table public.user_points (
  user_id      uuid        primary key references auth.users(id) on delete cascade,
  total_points integer     not null default 0 check (total_points >= 0),
  updated_at   timestamptz not null default now()
);

alter table public.user_points enable row level security;

create policy "users see own points"
  on public.user_points for select
  using (auth.uid() = user_id);

-- ─── Point Transactions (history) ────────────────────────────────────────────
create table public.point_transactions (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  order_id   uuid        references public.orders(id) on delete set null,
  points     integer     not null,
  type       text        not null check (type in ('earned', 'redeemed')),
  note       text,
  created_at timestamptz not null default now()
);

alter table public.point_transactions enable row level security;

create policy "users see own point transactions"
  on public.point_transactions for select
  using (auth.uid() = user_id);
