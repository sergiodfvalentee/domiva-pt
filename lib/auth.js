import { supabase } from './supabaseClient'

/**
 * Sign up a new user (offline version)
 */
export async function signUp({ email, password, name, phone, userType }) {
  console.log('📝 Creating account offline:', { email, name, userType })
  
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
      console.error('Sign up error:', error)
      return { data: null, error }
    }

    console.log('✅ Account created successfully')
    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

/**
 * Sign in a user (offline version)
 */
export async function signIn({ email, password }) {
  console.log('🔑 Signing in offline:', email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }

    console.log('✅ Signed in successfully')
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
  console.log('👋 Signing out...')
  
  try {
    const { error } = await supabase.auth.signOut()
    console.log('✅ Signed out successfully')
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
 * Social sign in with provider (offline mock)
 */
export async function signInWithProvider(provider) {
  console.log(`🔄 Mock social login with ${provider}`)
  
  // For offline development, just return success
  const mockUser = {
    id: 'social_user_' + Date.now(),
    email: `test@${provider}.com`,
    user_metadata: {
      name: `User from ${provider}`,
      user_type: 'particular'
    }
  }
  
  // Save to localStorage
  localStorage.setItem('domiva_current_user', JSON.stringify(mockUser))
  
  return { 
    data: { user: mockUser }, 
    error: null 
  }
}

/**
 * Resend verification email (offline mock)
 */
export async function resendVerificationEmail(email) {
  console.log('📧 Mock: Resending verification email to', email)
  
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    return { data, error }
  } catch (error) {
    console.error('Resend verification email error:', error)
    return { data: null, error }
  }
}

/**
 * Get user profile from localStorage
 */
export async function getUserProfile(userId) {
  console.log('👤 Getting user profile for:', userId)
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile not found
      return { data: null, error: new Error('PROFILE_NOT_FOUND') }
    }

    return { data, error }
  } catch (error) {
    console.error('Get user profile error:', error)
    return { data: null, error }
  }
}

/**
 * Reset password (offline mock)
 */
export async function resetPassword(email) {
  console.log('🔐 Mock: Password reset requested for', email)
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-password`
    })

    return { data, error }
  } catch (error) {
    console.error('Reset password error:', error)
    return { data: null, error }
  }
}

/**
 * Update password (offline mock)
 */
export async function updatePassword(newPassword) {
  console.log('🔄 Mock: Updating password...')
  
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    return { data, error }
  } catch (error) {
    console.error('Update password error:', error)
    return { data: null, error }
  }
} 