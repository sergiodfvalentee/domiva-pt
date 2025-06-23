import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase = null

// Create Supabase client if environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client created successfully')
  } catch (error) {
    console.error('❌ Supabase client creation failed:', error)
    supabase = null
  }
} else {
  console.warn('⚠️ Supabase environment variables not found')
}

// Export the supabase client
export { supabase } 