-- Enable Row Level Security for user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for users matching their own ID
CREATE POLICY "Allow select on user_profiles"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow INSERT for users matching their own ID
CREATE POLICY "Allow insert on user_profiles"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow UPDATE for users matching their own ID
CREATE POLICY "Allow update on user_profiles"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow DELETE for users matching their own ID
CREATE POLICY "Allow delete on user_profiles"
ON user_profiles
FOR DELETE
USING (auth.uid() = id);