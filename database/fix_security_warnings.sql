    -- Fix Security Advisor Warnings
    -- Resolves: Function Search Path, Password Protection, MFA Options

    -- 1. Fix Function Search Path Mutable
    -- Recreate check_email_exists function with fixed search_path
    DROP FUNCTION IF EXISTS check_email_exists(text);

    CREATE OR REPLACE FUNCTION check_email_exists(email_to_check text)
    RETURNS boolean
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, auth  -- Fixed search_path
    AS $$
    BEGIN
    -- Check if email exists in auth.users table
    RETURN EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE email = email_to_check
    );
    END;
    $$;

    -- Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION check_email_exists(text) TO authenticated;
    GRANT EXECUTE ON FUNCTION check_email_exists(text) TO anon;

    -- 2. Enable Leaked Password Protection
    -- Note: This needs to be done in Supabase Dashboard > Authentication > Settings
    -- Enable "Check for compromised passwords" option

    -- 3. Enable additional MFA options
    -- Note: These need to be configured in Supabase Dashboard > Authentication > Providers
    -- Recommended to enable:
    -- - Phone (SMS) MFA
    -- - TOTP (Time-based One-Time Password)
    -- - Email verification (already enabled)

    -- Verify the function was created correctly
    SELECT 
        proname as function_name,
        prosecdef as security_definer,
        proconfig as function_config
    FROM pg_proc 
    WHERE proname = 'check_email_exists';

    -- Test the function still works
    SELECT check_email_exists('test@example.com') as function_test; 