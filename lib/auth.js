import { supabase } from './supabaseClient'

/**
 * Sign up a new user (simplified version)
 */
export async function signUp({ email, password, name, phone, userType }) {
  // Check if Supabase is available
  if (!supabase) {
    return { 
      data: null, 
      error: new Error('Sistema de autenticação não configurado. Contacte o administrador.') 
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          user_type: userType
        }
      }
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

/**
 * Sign in a user (simplified version)
 */
export async function signIn({ email, password }) {
  if (!supabase) {
    return { 
      data: null, 
      error: new Error('Sistema de autenticação não configurado.') 
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  if (!supabase) {
    return { error: new Error('Supabase não configurado') }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  if (!supabase) {
    return null
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Social sign in with provider (simplified)
 */
export async function signInWithProvider(provider) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase não configurado') }
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    return { data, error }
  } catch (error) {
    console.error(`${provider} sign in error:`, error)
    return { data: null, error }
  }
} 