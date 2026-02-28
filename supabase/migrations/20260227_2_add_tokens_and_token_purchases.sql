-- Add tokens column to user_profiles if not exists
alter table public.user_profiles add column if not exists tokens integer not null default 0;

-- Create a table to record token purchases
create table if not exists public.token_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount integer not null,
  price integer not null, -- in cents
  created_at timestamp with time zone default timezone('utc', now())
);

create index if not exists token_purchases_user_id_idx on public.token_purchases(user_id);
