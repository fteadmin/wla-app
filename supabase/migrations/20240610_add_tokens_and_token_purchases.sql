-- Migration: Add tokens to user_profiles and create token_purchases table

-- Add tokens column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN tokens integer NOT NULL DEFAULT 0;

-- Create token_purchases table
CREATE TABLE token_purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    stripe_payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Index for fast lookup
CREATE INDEX idx_token_purchases_user_id ON token_purchases(user_id);