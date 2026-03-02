-- Notify Supabase to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify user_profiles table structure
DO $$
BEGIN
    -- Log table columns for debugging
    RAISE NOTICE 'user_profiles columns: %', (
        SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_profiles'
    );
END $$;
