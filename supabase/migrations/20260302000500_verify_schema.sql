-- Verify final user_profiles table structure
DO $$
BEGIN
    RAISE NOTICE 'Final user_profiles columns: %', (
        SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_profiles'
    );
END $$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
