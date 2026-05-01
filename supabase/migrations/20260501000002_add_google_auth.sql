ALTER TABLE public.custom_users
  ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
  ALTER COLUMN password_hash DROP NOT NULL;
