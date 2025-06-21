import { supabase } from './supabaseClient'

/**
 * Sign up a new user
 */
export async function signUp({ email, password, name, phone, userType }) {
  // Check if Supabase is available
  if (!supabase) {
    console.error('Supabase not configured - check environment variables')
    return { 
      data: null, 
      error: new Error('Sistema de autenticação não configurado. Contacte o administrador.') 
    }
  }

  try {
    console.log('Attempting user signup...', { email, userType })
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError) {
      console.error('Supabase auth error:', authError)
      console.error('Auth error details:', JSON.stringify(authError, null, 2))
      console.error('Auth error message:', authError.message)
      console.error('Auth error code:', authError.code)
      
      // Handle specific error cases
      if (authError.message.includes('Invalid API key')) {
        return { 
          data: null, 
          error: new Error('Configuração do sistema inválida. Contacte o administrador.') 
        }
      }
      
      if (authError.message.includes('Database error')) {
        return { 
          data: null, 
          error: new Error('Erro na base de dados. Verifique a configuração do Supabase.') 
        }
      }
      
      // Handle rate limiting first
      if (authError.code === 'over_email_send_rate_limit' || 
          authError.message.toLowerCase().includes('only request this after') ||
          authError.message.toLowerCase().includes('rate limit')) {
        console.log('Rate limit hit, but this might be hiding a duplicate email issue')
        return { 
          data: null, 
          error: new Error('Muitas tentativas. Este email pode já estar registado. Tente fazer login ou aguarde 30 segundos.') 
        }
      }

      // Check for various duplicate email error patterns
      const errorMessage = authError.message.toLowerCase()
      const isDuplicateError = errorMessage.includes('user already registered') || 
                              errorMessage.includes('already been registered') ||
                              errorMessage.includes('already registered') ||
                              errorMessage.includes('duplicate') ||
                              errorMessage.includes('email address not available') ||
                              errorMessage.includes('user_already_exists') ||
                              errorMessage.includes('signup is disabled') ||
                              errorMessage.includes('email already exists') ||
                              errorMessage.includes('already exists') ||
                              authError.code === 'user_already_exists' ||
                              authError.code === 'email_address_not_available' ||
                              authError.code === 'signup_disabled' ||
                              authError.code === 'email_already_exists'

      if (isDuplicateError) {
        console.log('Detected duplicate email error:', authError.message)
        return { 
          data: null, 
          error: new Error('Este email já está registado. Tente fazer login ou recuperar a password.') 
        }
      }
      
      // Generic error with more details
      return { 
        data: null, 
        error: new Error(`Erro no registo: ${authError.message}`) 
      }
    }

    console.log('Auth user created successfully:', authData.user?.id)
    console.log('Profile will be created automatically by trigger')

    console.log('User registered successfully:', authData.user?.email)
    return { data: authData, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

/**
 * Sign in an existing user
 */
export async function signIn({ email, password }) {
  // Check if Supabase is available
  if (!supabase) {
    console.error('Supabase not configured - check environment variables')
    return { 
      data: null, 
      error: new Error('Sistema de autenticação não configurado. Contacte o administrador.') 
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Supabase sign in error:', error)
      
      // Handle specific error cases
      if (error.message.includes('Invalid API key')) {
        return { 
          data: null, 
          error: new Error('Configuração do sistema inválida. Contacte o administrador.') 
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return { 
          data: null, 
          error: new Error('NEED_EMAIL_VERIFICATION') 
        }
      }
      
      if (error.message.includes('Invalid login credentials')) {
        return { 
          data: null, 
          error: new Error('Email ou password incorretos. Verifique os seus dados.')
        }
      }
      
      throw error
    }

    // Double-check if email is confirmed (additional safety)
    if (data.user && !data.user.email_confirmed_at) {
      return { 
        data: null, 
        error: new Error('NEED_EMAIL_VERIFICATION') 
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId) {
  // Check if Supabase is available
  if (!supabase) {
    console.error('Supabase not configured - check environment variables')
    return { 
      data: null, 
      error: new Error('Sistema de autenticação não configurado.') 
    }
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // Handle specific cases
      if (error.code === 'PGRST116') {
        // No rows returned - profile doesn't exist
        console.log('Profile not found, will create one')
        return { data: null, error: new Error('PROFILE_NOT_FOUND') }
      }
      
      console.error('Database error getting profile:', error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Get user profile error:', error)
    return { data: null, error }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Update user profile error:', error)
    return { data: null, error }
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' 
        ? `${window.location.origin}/redefinir-password` 
        : 'http://localhost:3000/redefinir-password'
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error }
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Update password error:', error)
    return { error }
  }
}

/**
 * Social sign in with provider
 */
export async function signInWithProvider(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`${provider} sign in error:`, error)
    return { data: null, error }
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error('Check authentication error:', error)
    return false
  }
}

/**
 * Resend email verification
 */
export async function resendVerificationEmail(email) {
  if (!supabase) {
    return { 
      error: new Error('Sistema de autenticação não configurado.') 
    }
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' 
          ? `${window.location.origin}/login?verified=true` 
          : 'http://localhost:3000/login?verified=true'
      }
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Resend verification email error:', error)
    return { error }
  }
} 