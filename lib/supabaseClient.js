// Mock client for offline development
console.log('🔧 Modo de desenvolvimento offline - usando mock client')

// Simple mock storage
const mockStorage = {
  users: JSON.parse(localStorage.getItem('domiva_users') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('domiva_current_user') || 'null'),
  
  saveUsers() {
    localStorage.setItem('domiva_users', JSON.stringify(this.users))
  },
  
  saveCurrentUser() {
    localStorage.setItem('domiva_current_user', JSON.stringify(this.currentUser))
  }
}

// Mock Supabase client for development
export const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const existingUser = mockStorage.users.find(u => u.email === email)
      if (existingUser) {
        return {
          data: null,
          error: { message: 'Este email já está registado' }
        }
      }
      
      // Create new user
      const newUser = {
        id: 'user_' + Date.now(),
        email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: options?.data || {},
        created_at: new Date().toISOString()
      }
      
      mockStorage.users.push(newUser)
      mockStorage.saveUsers()
      
      return {
        data: { user: newUser },
        error: null
      }
    },
    
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const user = mockStorage.users.find(u => u.email === email)
      if (!user) {
        return {
          data: null,
          error: { message: 'Email ou palavra-passe incorretos' }
        }
      }
      
      mockStorage.currentUser = user
      mockStorage.saveCurrentUser()
      
      return {
        data: { user },
        error: null
      }
    },
    
    signOut: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      mockStorage.currentUser = null
      mockStorage.saveCurrentUser()
      return { error: null }
    },
    
    getUser: async () => {
      return {
        data: { user: mockStorage.currentUser },
        error: null
      }
    },
    
    resetPasswordForEmail: async (email) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { data: {}, error: null }
    },
    
    updateUser: async ({ password }) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { data: { user: mockStorage.currentUser }, error: null }
    },
    
    resend: async ({ type, email }) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { data: {}, error: null }
    }
  },
  
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: async () => {
          if (table === 'profiles' && mockStorage.currentUser) {
            const profile = {
              id: mockStorage.currentUser.id,
              name: mockStorage.currentUser.user_metadata.name || 'Utilizador',
              email: mockStorage.currentUser.email,
              phone: mockStorage.currentUser.user_metadata.phone || '',
              role: mockStorage.currentUser.user_metadata.user_type || 'particular'
            }
            return { data: profile, error: null }
          }
          return { data: null, error: { code: 'PGRST116' } }
        }
      })
    }),
    insert: (data) => ({
      select: () => ({
        single: async () => {
          return { data, error: null }
        }
      })
    })
  })
} 