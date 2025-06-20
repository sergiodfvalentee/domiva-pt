-- Complete cleanup of duplicate accounts

-- 1. First, let's see what duplicates we have
SELECT 
    email,
    COUNT(*) as count,
    array_agg(id ORDER BY created_at) as profile_ids,
    array_agg(created_at ORDER BY created_at) as created_dates
FROM profiles 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 2. Delete duplicate profiles (keep only the first one for each email)
DELETE FROM profiles 
WHERE id IN (
    SELECT id 
    FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) as rn
        FROM profiles
    ) t 
    WHERE rn > 1
);

-- 3. Check auth.users table for duplicates
SELECT 
    email,
    COUNT(*) as count,
    array_agg(id::text ORDER BY created_at) as user_ids,
    array_agg(created_at ORDER BY created_at) as created_dates
FROM auth.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Note: We cannot directly delete from auth.users table
-- You need to delete duplicate users from Supabase Dashboard > Authentication > Users

-- 4. Verify no duplicates remain in profiles
SELECT email, COUNT(*) 
FROM profiles 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 5. Final check - show current state
SELECT 
    p.email,
    p.name,
    p.role,
    p.created_at as profile_created,
    u.created_at as auth_created,
    u.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users u ON u.email = p.email
ORDER BY p.created_at DESC
LIMIT 10; 