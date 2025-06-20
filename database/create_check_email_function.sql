-- Create RPC function to check if email exists in auth.users
-- This runs on the server side and can access auth.users table safely

CREATE OR REPLACE FUNCTION check_email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to access auth.users
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