ALTER TABLE public.custom_users
  ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;
