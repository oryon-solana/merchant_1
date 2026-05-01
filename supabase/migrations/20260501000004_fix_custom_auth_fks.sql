-- Clear orphaned rows that reference old auth.users IDs not in custom_users
DELETE FROM public.point_transactions
  WHERE user_id NOT IN (SELECT id FROM public.custom_users);

DELETE FROM public.cart_items
  WHERE user_id NOT IN (SELECT id FROM public.custom_users);

DELETE FROM public.user_points
  WHERE user_id NOT IN (SELECT id FROM public.custom_users);

-- orders must be deleted before order_items (FK)
DELETE FROM public.orders
  WHERE user_id NOT IN (SELECT id FROM public.custom_users);

-- Rewire all FK constraints from auth.users → custom_users
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey,
  ADD CONSTRAINT cart_items_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.custom_users(id) ON DELETE CASCADE;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey,
  ADD CONSTRAINT orders_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.custom_users(id) ON DELETE CASCADE;

ALTER TABLE public.user_points
  DROP CONSTRAINT IF EXISTS user_points_user_id_fkey,
  ADD CONSTRAINT user_points_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.custom_users(id) ON DELETE CASCADE;

ALTER TABLE public.point_transactions
  DROP CONSTRAINT IF EXISTS point_transactions_user_id_fkey,
  ADD CONSTRAINT point_transactions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.custom_users(id) ON DELETE CASCADE;

-- Move wallet_address from custom_users to user_points
ALTER TABLE public.custom_users
  DROP COLUMN IF EXISTS wallet_address;

ALTER TABLE public.user_points
  ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;
