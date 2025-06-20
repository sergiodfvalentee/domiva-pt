-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('particular', 'agente')) DEFAULT 'particular',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'particular')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user_favorites table for saving favorite properties
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS for user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;
CREATE POLICY "Users can insert own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Update listings table to include user ownership
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- RLS Policies for listings
DROP POLICY IF EXISTS "Anyone can view approved listings" ON public.listings;
CREATE POLICY "Anyone can view approved listings" ON public.listings
  FOR SELECT USING (status = 'aprovado');

DROP POLICY IF EXISTS "Users can view own listings" ON public.listings;
CREATE POLICY "Users can view own listings" ON public.listings
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
CREATE POLICY "Users can insert own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
CREATE POLICY "Users can update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;
CREATE POLICY "Users can delete own listings" ON public.listings
  FOR DELETE USING (auth.uid() = owner_id);

-- Create function to get user profile with auth check
CREATE OR REPLACE FUNCTION get_user_profile(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the requesting user is the profile owner
  IF auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.name, p.email, p.phone, p.role, p.created_at
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.user_favorites TO authenticated;
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT ALL ON public.listings TO authenticated;

-- Insert some test data (optional)
-- Uncomment the following lines if you want test data

/*
-- Insert test user profile (replace with actual user ID from auth.users)
INSERT INTO public.profiles (id, name, email, phone, role) VALUES 
(gen_random_uuid(), 'João Silva', 'joao@exemplo.com', '+351 912 345 678', 'particular')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, name, email, phone, role) VALUES 
(gen_random_uuid(), 'Maria Santos', 'maria@exemplo.com', '+351 913 456 789', 'agente')
ON CONFLICT (id) DO NOTHING;
*/ 